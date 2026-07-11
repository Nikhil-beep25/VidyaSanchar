import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  BookOpen,
  CreditCard,
  User,
  Clock,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Download,
  Search,
  BookOpenCheck,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [dashboardData, setDashboardData] = useState<any>(null);

  const handleDownloadReceipt = async (paymentId: string, receiptNumber: string) => {
    try {
      let apiBase = (import.meta.env.VITE_API_URL as string) || '';
      if (apiBase.endsWith('/')) {
        apiBase = apiBase.slice(0, -1);
      }
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${apiBase}/api/payments/${paymentId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Receipt generation failed.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt_${receiptNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Error downloading receipt PDF.');
    }
  };
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'academics' | 'fees' | 'timetable' | 'homework'>('overview');

  const loadChildren = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/parent/children');
      if (Array.isArray(data)) {
        setChildren(data);
        if (data.length > 0) {
          setSelectedChildId(data[0].id);
        } else {
          setLoading(false);
        }
      }
    } catch (err) {
      toast.error('Failed to load children profiles.');
      setLoading(false);
    }
  };

  const loadChildDashboard = async (studentId: string) => {
    try {
      setLoading(true);
      const data = await apiRequest(`/parent/children/${studentId}/dashboard`);
      setDashboardData(data);
    } catch (err) {
      toast.error('Failed to load student dashboard details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      loadChildDashboard(selectedChildId);
    }
  }, [selectedChildId]);

  if (loading && children.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="text-center p-12 border rounded-2xl bg-card space-y-4 max-w-md mx-auto">
        <User className="h-12 w-12 text-muted-foreground/30 mx-auto" />
        <h2 className="text-xl font-bold">No Children Linked</h2>
        <p className="text-sm text-muted-foreground">
          There are no student accounts associated with this parent email. Please contact the school administration to link profiles.
        </p>
      </div>
    );
  }

  const currentChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Parent Portal <span className="text-primary text-sm font-semibold border px-2 py-0.5 rounded-full bg-primary/5 uppercase">MVP Ready</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time academic monitoring, timetable schedules, and fee ledgers.
          </p>
        </div>

        {/* Student Switcher dropdown */}
        <div className="flex items-center space-x-3 self-start md:self-auto bg-card border p-2 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">Select Child:</span>
          <select
            value={selectedChildId}
            onChange={(e) => {
              setSelectedChildId(e.target.value);
              setActiveTab('overview');
            }}
            className="h-10 px-3 pr-8 rounded-lg border-0 bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-0 focus-visible:outline-none cursor-pointer"
          >
            {children.map(c => (
              <option key={c.id} value={c.id} className="text-slate-950">{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        dashboardData && (
          <div className="space-y-8">
            {/* Child Profile Banner Card */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white dark:border-slate-800">
                {dashboardData.profile.name.charAt(0)}
              </div>
              <div className="text-center sm:text-left flex-grow space-y-1">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{dashboardData.profile.name}</h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                  <span>Class: <strong className="text-slate-700 dark:text-slate-300">{dashboardData.profile.className}</strong></span>
                  <span className="hidden sm:inline">|</span>
                  <span>Roll No: <strong className="text-slate-700 dark:text-slate-300">{dashboardData.profile.rollNumber}</strong></span>
                  <span className="hidden sm:inline">|</span>
                  <span>Adm No: <strong className="text-slate-700 dark:text-slate-300">{dashboardData.profile.admissionNumber}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick KPI Stats Dashboard Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Attendance Card */}
              <div className="border rounded-2xl p-6 bg-card shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow">
                <div className="p-4 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Attendance Rate</span>
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{dashboardData.attendance.percentage}%</span>
                  <span className="text-[10px] text-slate-500 block font-medium mt-0.5">
                    {dashboardData.attendance.presentDays} / {dashboardData.attendance.totalDays} days present
                  </span>
                </div>
              </div>

              {/* Dues Card */}
              <div className="border rounded-2xl p-6 bg-card shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow">
                <div className="p-4 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Outstanding Dues</span>
                  <span className={`text-2xl font-extrabold ${dashboardData.fees.pending.length > 0 ? 'text-rose-600' : 'text-emerald-500'}`}>
                    {dashboardData.fees.pending.length > 0
                      ? `₹${dashboardData.fees.pending.reduce((acc: number, f: any) => acc + f.amount, 0).toLocaleString('en-IN')}`
                      : 'All Fees Paid'
                    }
                  </span>
                  <span className="text-[10px] text-slate-500 block font-medium mt-0.5">
                    {dashboardData.fees.pending.length} unpaid invoices pending
                  </span>
                </div>
              </div>

              {/* Academics Score */}
              <div className="border rounded-2xl p-6 bg-card shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow">
                <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Academic Grade Entries</span>
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                    {dashboardData.grades.length > 0
                      ? `${dashboardData.grades.length} Graded Exams`
                      : 'No exams registered'
                    }
                  </span>
                  <span className="text-[10px] text-slate-500 block font-medium mt-0.5">
                    Updated CBSE marksheet history
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs Selector */}
            <div className="border-b flex overflow-x-auto space-x-6 scrollbar-none">
              {(['overview', 'attendance', 'academics', 'fees', 'timetable', 'homework'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold capitalize transition-colors relative whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="space-y-6">
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Homework List */}
                  <div className="border rounded-2xl p-6 bg-card space-y-4 shadow-sm">
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">Pending Homework</h3>
                    <div className="divide-y divide-border">
                      {dashboardData.homework.slice(0, 4).map((h: any) => (
                        <div key={h.id} className="py-3.5 flex items-center justify-between text-xs">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{h.title}</h4>
                            <p className="text-slate-400 mt-0.5">{h.subjectName} | Teacher: {h.teacherName}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full font-bold ${h.submission ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {h.submission ? 'Submitted' : 'Pending'}
                          </span>
                        </div>
                      ))}
                      {dashboardData.homework.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-xs">No pending homework.</div>
                      )}
                    </div>
                  </div>

                  {/* Right: Class Notice Board Summary */}
                  <div className="border rounded-2xl p-6 bg-card space-y-4 shadow-sm">
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">Today's Class Timetable</h3>
                    <div className="divide-y divide-border">
                      {dashboardData.timetable.slice(0, 4).map((t: any) => (
                        <div key={t.id} className="py-3.5 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                              {t.startTime}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-200">{t.subjectName}</h4>
                              <p className="text-slate-400 mt-0.5">Room {t.roomNumber} | Instructor: {t.teacherName}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{t.dayOfWeek}</span>
                        </div>
                      ))}
                      {dashboardData.timetable.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-xs">No scheduled classes today.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Attendance */}
              {activeTab === 'attendance' && (
                <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
                  <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Daily Attendance Log</h3>
                    <button
                      onClick={() => window.open(`/api/reports/attendance/${selectedChildId}`, '_blank')}
                      className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                    >
                      <Download className="h-3 w-3 mr-1" /> Download PDF Report
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs divide-y divide-border">
                      <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider font-bold">
                        <tr>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {dashboardData.attendance.logs.map((log: any) => (
                          <tr key={log.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-medium">{new Date(log.date).toLocaleDateString('en-IN')}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                log.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500">{log.remarks || 'Standard log'}</td>
                          </tr>
                        ))}
                        {dashboardData.attendance.logs.length === 0 && (
                          <tr>
                            <td colSpan={3} className="text-center p-8 text-slate-400">No attendance entries registered.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Academics */}
              {activeTab === 'academics' && (
                <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
                  <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Exam Results & Marksheets</h3>
                    <button
                      onClick={() => window.open(`/api/reports/report-card/${selectedChildId}`, '_blank')}
                      className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                    >
                      <Download className="h-3 w-3 mr-1" /> Download PDF Report Card
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs divide-y divide-border">
                      <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider font-bold">
                        <tr>
                          <th className="px-6 py-4">Exam Name</th>
                          <th className="px-6 py-4">Subject</th>
                          <th className="px-6 py-4">Score</th>
                          <th className="px-6 py-4">Percentage</th>
                          <th className="px-6 py-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {dashboardData.grades.map((g: any) => {
                          const pct = Math.round((g.marksObtained / g.maxMarks) * 100);
                          return (
                            <tr key={g.id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 font-bold">{g.examName}</td>
                              <td className="px-6 py-4">{g.subjectName}</td>
                              <td className="px-6 py-4 font-semibold">{g.marksObtained} / {g.maxMarks}</td>
                              <td className="px-6 py-4">
                                <span className={`font-bold ${pct >= 70 ? 'text-emerald-500' : pct >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                  {pct}%
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-400">{g.remarks || 'Grades mapped'}</td>
                            </tr>
                          );
                        })}
                        {dashboardData.grades.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center p-8 text-slate-400">No grading records found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Fees */}
              {activeTab === 'fees' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pending Fees */}
                  <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-rose-500/5 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Pending Term Dues</h3>
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                    </div>
                    <div className="p-4 divide-y divide-border">
                      {dashboardData.fees.pending.map((fee: any) => (
                        <div key={fee.id} className="py-4 flex justify-between items-center text-xs">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{fee.title}</h4>
                            <p className="text-slate-400 mt-1">Due Date: {new Date(fee.dueDate).toLocaleDateString('en-IN')}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-rose-500 block">₹{fee.amount.toLocaleString('en-IN')}</span>
                            <button
                              onClick={() => navigate('/dashboard/parent/fees')}
                              className="text-[10px] font-bold text-primary hover:underline mt-1 block"
                            >
                              Pay Now
                            </button>
                          </div>
                        </div>
                      ))}
                      {dashboardData.fees.pending.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-xs">All fee invoices paid.</div>
                      )}
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-emerald-500/5 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Paid Invoices History</h3>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="p-4 divide-y divide-border">
                      {dashboardData.fees.paid.map((p: any) => (
                        <div key={p.id} className="py-4 flex justify-between items-center text-xs">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{p.fee.title}</h4>
                            <p className="text-slate-400 mt-1">
                              Paid On: {new Date(p.paidAt || p.createdAt).toLocaleDateString('en-IN')} | Receipt: {p.receiptNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-500 block">₹{p.amountPaid.toLocaleString('en-IN')}</span>
                            <button
                              onClick={() => handleDownloadReceipt(p.id, p.receiptNumber)}
                              className="text-[10px] font-semibold text-primary hover:underline mt-1 block animate-pulse"
                            >
                              Download Receipt
                            </button>
                          </div>
                        </div>
                      ))}
                      {dashboardData.fees.paid.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-xs">No payment history log.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Timetable */}
              {activeTab === 'timetable' && (
                <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
                  <div className="p-4 border-b bg-muted/20">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Weekly Schedule Mappings</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs divide-y divide-border">
                      <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider font-bold">
                        <tr>
                          <th className="px-6 py-4">Day</th>
                          <th className="px-6 py-4">Timing</th>
                          <th className="px-6 py-4">Subject</th>
                          <th className="px-6 py-4">Teacher</th>
                          <th className="px-6 py-4">Room No</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {dashboardData.timetable.map((t: any) => (
                          <tr key={t.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-bold uppercase">{t.dayOfWeek}</td>
                            <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">
                              {t.startTime} - {t.endTime}
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{t.subjectName}</td>
                            <td className="px-6 py-4">{t.teacherName}</td>
                            <td className="px-6 py-4 text-slate-500 font-medium">Room {t.roomNumber || 'N/A'}</td>
                          </tr>
                        ))}
                        {dashboardData.timetable.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center p-8 text-slate-400">No scheduled periods.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 6: Homework */}
              {activeTab === 'homework' && (
                <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
                  <div className="p-4 border-b bg-muted/20">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Academic Homework Planner</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {dashboardData.homework.map((h: any) => (
                      <div key={h.id} className="p-4 border rounded-xl bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[10px]">
                              {h.subjectName}
                            </span>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{h.title}</h4>
                          </div>
                          <p className="text-slate-500 font-medium">{h.description}</p>
                          <span className="text-[10px] text-slate-400 block pt-1 font-medium">
                            Due Date: {new Date(h.dueDate).toLocaleDateString('en-IN')} | Assigned by {h.teacherName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full font-bold ${
                            h.submission
                              ? h.submission.status === 'GRADED'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-primary/10 text-primary'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {h.submission
                              ? h.submission.status === 'GRADED'
                                ? `Graded: ${h.submission.marksObtained} Marks`
                                : 'Submitted'
                              : 'Pending'
                            }
                          </span>
                          {h.submission?.feedback && (
                            <div className="p-2 border bg-card rounded-lg text-[10px] text-slate-500 max-w-xs">
                              <strong>Teacher Feedback:</strong> {h.submission.feedback}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {dashboardData.homework.length === 0 && (
                      <div className="p-8 text-center text-slate-400">No homework assigned.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};
