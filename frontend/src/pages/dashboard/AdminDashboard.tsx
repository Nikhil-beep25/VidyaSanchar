import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';
import { Users, UserCheck, Calendar, CreditCard, Bell, ArrowRight, BookOpen, Clock, Activity, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

// --- Safe Error Boundary to Prevent App Crashes ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Dashboard component rendering crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 border border-rose-200 rounded-2xl bg-rose-50 text-left space-y-4 max-w-lg mx-auto my-12 shadow-sm">
          <div className="flex items-center space-x-3 text-rose-800">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-lg font-bold">Dashboard Render Crash</h2>
          </div>
          <p className="text-sm text-rose-700">The dashboard could not be loaded due to an internal rendering error.</p>
          <pre className="p-3 bg-rose-100/50 border border-rose-200 rounded text-xs overflow-auto font-mono text-rose-900">{this.state.error?.message}</pre>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-rose-800 text-white rounded-lg text-sm font-semibold hover:bg-rose-900 transition-colors shadow-sm"
          >
            Reload Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminDashboardComponent: React.FC = () => {
  const toast = useToast();
  
  // Dashboard states initialized with safe fallback values
  const [stats, setStats] = useState<any>({
    studentCount: 0,
    teacherCount: 0,
    classCount: 0,
    totalAttendancePercentage: 100,
    totalFeesCollected: 0,
    pendingFees: 0,
    upcomingExams: 0,
  });

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [trends, setTrends] = useState<{
    feeCollectionTrends: any[];
    attendanceTrends: any[];
    studentGrowthTrends: any[];
  }>({
    feeCollectionTrends: [],
    attendanceTrends: [],
    studentGrowthTrends: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch dashboard summary stats
      const summary = await apiRequest('/analytics/summary');
      if (summary) {
        setStats(summary.stats || {});
        setAnnouncements(summary.recentAnnouncements || []);
        setActivities(summary.recentActivities || []);
        setRecentPayments(summary.recentPayments || []);
      }

      // 2. Fetch trends metrics for SVGs
      const trendsData = await apiRequest('/analytics/trends');
      if (trendsData) {
        setTrends(trendsData);
      }
    } catch (err: any) {
      console.error('Error loading admin dashboard stats:', err);
      setError(err.message || 'Failed to retrieve school analytics. Please verify your authentication.');
      toast.error('Failed to load real-time analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Safe Loading Spinner state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground font-medium">Loading real-time school analytics...</p>
      </div>
    );
  }

  // Safe Error Card state
  if (error) {
    return (
      <div className="p-8 border border-destructive/20 rounded-2xl bg-destructive/5 text-left max-w-lg mx-auto my-12 space-y-4 shadow-sm">
        <div className="flex items-center space-x-3 text-destructive">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-lg font-bold">Failed to Load Dashboard Data</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          There was an error communicating with the Indian School ERP server. This can happen if your session token expired or if the backend server is unreachable.
        </p>
        <div className="p-3.5 bg-muted rounded border text-xs font-mono break-all text-slate-800">
          {error}
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={loadDashboardData} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/95 transition-colors shadow-sm"
          >
            Retry Loading
          </button>
          <Link
            to="/login"
            className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-accent transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // --- SVG Chart Render Helpers with Dynamic Safeguards ---

  // 1. Line Chart Helper (for Attendance Trends: 0% to 100%)
  const renderAttendanceChart = () => {
    const data = trends?.attendanceTrends || [];
    if (data.length === 0) return <div className="text-xs text-muted-foreground py-10">No trend data available</div>;

    const width = 450;
    const height = 150;
    const padding = 25;

    // Map rates to Y coordinates safely
    const points = data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1 || 1);
      const rate = d?.rate ?? 100;
      const y = height - padding - (rate / 100) * (height - 2 * padding);
      return { x, y, label: d?.month ?? '', val: rate };
    });

    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    return (
      <div className="space-y-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="att-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0"/>
            </linearGradient>
          </defs>
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E5E7EB" strokeWidth="1" />
          
          {/* Filled Area */}
          {points.length > 0 && (
            <path
              d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
              fill="url(#att-grad)"
            />
          )}
          
          {/* Trend Line */}
          <path d={pathD} fill="none" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Data Points & Value labels */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#7C3AED">{p.val}%</text>
              <text x={p.x} y={height - 8} textAnchor="middle" fontSize="10" fontWeight="medium" fill="#9CA3AF">{p.label}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  // 2. Bar Chart Helper (for Fees Collected trends)
  const renderFeesChart = () => {
    const data = trends?.feeCollectionTrends || [];
    if (data.length === 0) return <div className="text-xs text-muted-foreground py-10">No trend data available</div>;

    const width = 450;
    const height = 150;
    const padding = 25;

    const maxVal = Math.max(...data.map(d => d?.amount ?? 0), 50000);
    const barWidth = 30;

    return (
      <div className="space-y-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E5E7EB" strokeWidth="1" />

          {data.map((d, i) => {
            const x = padding + (i * (width - 2 * padding)) / (data.length - 1 || 1) - barWidth / 2;
            const amount = d?.amount ?? 0;
            const barHeight = ((amount / maxVal) * (height - 2 * padding)) || 5;
            const y = height - padding - barHeight;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  fill="#7C3AED"
                  className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                />
                <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1F2937">
                  ₹{(amount / 1000).toFixed(1)}k
                </text>
                <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fontSize="10" fontWeight="medium" fill="#9CA3AF">
                  {d?.month ?? ''}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // 3. Area Chart Helper (for Student Admissions Growth)
  const renderGrowthChart = () => {
    const data = trends?.studentGrowthTrends || [];
    if (data.length === 0) return <div className="text-xs text-muted-foreground py-10">No trend data available</div>;

    const width = 450;
    const height = 150;
    const padding = 25;

    const maxCount = Math.max(...data.map(d => d?.count ?? 0), 10);

    const points = data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1 || 1);
      const count = d?.count ?? 0;
      const y = height - padding - (count / maxCount) * (height - 2 * padding);
      return { x, y, label: d?.month ?? '', val: count };
    });

    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    return (
      <div className="space-y-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="growth-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0"/>
            </linearGradient>
          </defs>
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E5E7EB" strokeWidth="1" />

          {points.length > 0 && (
            <path
              d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
              fill="url(#growth-grad)"
            />
          )}

          <path d={pathD} fill="none" stroke="#8B5CF6" strokeWidth="2.5" />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x={p.x} y={p.y - 6} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#8B5CF6">{p.val}</text>
              <text x={p.x} y={height - 8} textAnchor="middle" fontSize="10" fontWeight="medium" fill="#9CA3AF">{p.label}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'STUDENT_CREATED':
      case 'STUDENT_UPDATED':
      case 'STUDENT_DELETED':
        return '🧑‍🎓';
      case 'TEACHER_CREATED':
      case 'TEACHER_UPDATED':
      case 'TEACHER_DELETED':
        return '🧑‍🏫';
      case 'ATTENDANCE_RECORDED':
        return '📅';
      case 'PAYMENT_RECORDED':
        return '💳';
      case 'EXAM_CREATED':
      case 'EXAM_UPDATED':
      case 'EXAM_DELETED':
      case 'RESULTS_PUBLISHED':
      case 'MARKS_RECORDED':
        return '📝';
      default:
        return '⚙️';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight text-gradient-theme">
          Admin Dashboard Summary
        </h1>
        <p className="text-sm text-muted-foreground">Real-time school enterprise resource planning telemetry.</p>
      </div>

      {/* Stats Grid Cards with Safe Rendering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-violet-100 rounded-xl p-5 bg-card flex items-center space-x-4 shadow-sm hover:shadow transition-shadow text-left">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Total Students</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{stats?.studentCount ?? 0}</span>
          </div>
        </div>

        <div className="border border-violet-100 rounded-xl p-5 bg-card flex items-center space-x-4 shadow-sm hover:shadow transition-shadow text-left">
          <div className="p-3 rounded-lg bg-violet-100 text-violet-700">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Active Teachers</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{stats?.teacherCount ?? 0}</span>
          </div>
        </div>

        <div className="border border-violet-100 rounded-xl p-5 bg-card flex items-center space-x-4 shadow-sm hover:shadow transition-shadow text-left">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Attendance Rate</span>
            <span className="text-2xl font-extrabold text-emerald-600">{stats?.totalAttendancePercentage ?? 100}%</span>
          </div>
        </div>

        <div className="border border-violet-100 rounded-xl p-5 bg-card flex items-center space-x-4 shadow-sm hover:shadow transition-shadow text-left">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Total Collection</span>
            <span className="text-2xl font-extrabold text-indigo-600">₹{(stats?.totalFeesCollected ?? 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-rose-100 rounded-xl p-5 bg-card flex items-center space-x-4 shadow-sm text-left">
          <div className="p-3 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Pending Dues</span>
            <span className="text-2xl font-extrabold text-rose-600">₹{(stats?.pendingFees ?? 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="border border-violet-100 rounded-xl p-5 bg-card flex items-center space-x-4 shadow-sm text-left">
          <div className="p-3 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Upcoming Exams</span>
            <span className="text-2xl font-extrabold text-violet-600">{stats?.upcomingExams ?? 0}</span>
          </div>
        </div>

        <div className="border border-emerald-100 rounded-xl p-5 bg-card flex items-center space-x-4 shadow-sm text-left">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Monthly Revenue</span>
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">₹{(stats?.monthlyRevenue ?? 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="border border-rose-100 rounded-xl p-5 bg-card flex items-center space-x-4 shadow-sm text-left">
          <div className="p-3 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Failed Payments</span>
            <span className="text-2xl font-extrabold text-rose-600">{stats?.failedPaymentCount ?? 0}</span>
          </div>
        </div>
      </div>

      {/* SVG Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border border-violet-100/50 rounded-2xl p-6 bg-card space-y-4 shadow-sm text-left">
          <div>
            <h3 className="font-bold text-sm text-foreground">Classroom Attendance Trends</h3>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Average student monthly attendance (%)</span>
          </div>
          <div className="p-2 border rounded-xl bg-muted/20">
            {renderAttendanceChart()}
          </div>
        </div>

        <div className="border border-violet-100/50 rounded-2xl p-6 bg-card space-y-4 shadow-sm text-left">
          <div>
            <h3 className="font-bold text-sm text-foreground">Tuition Fee Inflow Trends</h3>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Monthly payment collections (INR)</span>
          </div>
          <div className="p-2 border rounded-xl bg-muted/20">
            {renderFeesChart()}
          </div>
        </div>

        <div className="border border-violet-100/50 rounded-2xl p-6 bg-card space-y-4 shadow-sm text-left">
          <div>
            <h3 className="font-bold text-sm text-foreground">Cumulative Student Growth</h3>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Registered student enrollment progression</span>
          </div>
          <div className="p-2 border rounded-xl bg-muted/20">
            {renderGrowthChart()}
          </div>
        </div>
      </div>

      {/* Activity Logs & Branch announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Audit Activities */}
        <div className="border border-violet-100 rounded-xl p-6 bg-card space-y-4 lg:col-span-2 text-left shadow-sm">
          <h3 className="font-bold text-base flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Recent Activity Logs Feed</span>
          </h3>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 divide-y divide-border font-sans">
            {activities.map((item, idx) => (
              <div key={item.id || idx} className="pt-3 flex items-start space-x-3 text-xs">
                <span className="text-base p-1.5 rounded-lg bg-muted/50">{getActivityIcon(item.action)}</span>
                <div className="flex-grow space-y-1">
                  <p className="font-medium text-slate-800 dark:text-slate-200">{item.details}</p>
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                    <span>Actor: <span className="font-semibold text-primary">{item.user?.name || 'System Auto'}</span> ({item.user?.role?.replace('_', ' ') || 'SYSTEM'})</span>
                    <span>{item?.createdAt ? new Date(item.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}</span>
                  </div>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="p-8 text-center text-muted-foreground text-xs">No audit activity log events recorded yet.</p>
            )}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="border border-violet-100 rounded-xl p-6 bg-card space-y-4 text-left shadow-sm h-fit">
          <h3 className="font-bold text-base">Quick Action Tasks</h3>
          <div className="flex flex-col space-y-3">
            <Link
              to="/dashboard/admin/students"
              className="inline-flex items-center justify-between p-3 border rounded-lg hover:bg-accent text-xs font-semibold transition-colors"
            >
              <span>Register new Student</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
            <Link
              to="/dashboard/admin/teachers"
              className="inline-flex items-center justify-between p-3 border rounded-lg hover:bg-accent text-xs font-semibold transition-colors"
            >
              <span>Add teacher profile</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
            <Link
              to="/dashboard/admin/exams"
              className="inline-flex items-center justify-between p-3 border rounded-lg hover:bg-accent text-xs font-semibold transition-colors"
            >
              <span>Create examination cycle</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
            <Link
              to="/dashboard/admin/fees"
              className="inline-flex items-center justify-between p-3 border rounded-lg hover:bg-accent text-xs font-semibold transition-colors"
            >
              <span>Collect fee dues</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Payments Log */}
      <div className="border border-violet-100 rounded-xl p-6 bg-card space-y-4 text-left shadow-sm">
        <h3 className="font-bold text-base flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span>Recent Payment Transactions Log</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 uppercase text-muted-foreground">
              <tr>
                <th className="p-3 font-semibold">Receipt No</th>
                <th className="p-3 font-semibold">Student Name</th>
                <th className="p-3 font-semibold">Fee Component</th>
                <th className="p-3 font-semibold">Amount Paid</th>
                <th className="p-3 font-semibold">Method</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentPayments.map((p: any) => (
                <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                  <td className="p-3 font-mono font-bold">{p.receiptNumber}</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{p.student?.user?.name || 'Manual Admin Collection'}</td>
                  <td className="p-3">{p.fee?.title || 'Fee Allocation'}</td>
                  <td className="p-3 font-bold font-mono">₹{p.amountPaid.toLocaleString('en-IN')}</td>
                  <td className="p-3 uppercase text-[10px] font-bold text-violet-600">{p.paymentMethod.replace('ONLINE_', '')}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(p.paidAt || p.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' :
                      p.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">No recent payment transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Export wrapper with Error Boundary
export const AdminDashboard: React.FC = () => (
  <ErrorBoundary>
    <AdminDashboardComponent />
  </ErrorBoundary>
);
