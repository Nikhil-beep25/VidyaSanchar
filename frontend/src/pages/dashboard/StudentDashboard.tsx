import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  BookOpen,
  CreditCard,
  Bell,
  Clock,
  ClipboardList,
  Download,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  User
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    outstandingBalance: 0,
    averageScore: 0,
    className: '',
    studentName: ''
  });
  const [notices, setNotices] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Fetch general statistics
      const summary = await apiRequest('/analytics/summary');
      if (summary) {
        setStats({
          attendancePercentage: summary.stats?.attendancePercentage || 0,
          outstandingBalance: summary.stats?.outstandingBalance || 0,
          averageScore: summary.stats?.averageScore || 0,
          className: summary.studentClass ? `${summary.studentClass.name}-${summary.studentClass.section}` : 'N/A',
          studentName: summary.studentName || 'Student'
        });
      }

      // 2. Fetch notices
      const noticesData = await apiRequest('/notices');
      if (Array.isArray(noticesData)) {
        setNotices(noticesData.slice(0, 4));
      }

      // 3. Fetch homework
      const homeworkData = await apiRequest('/homework');
      if (Array.isArray(homeworkData)) {
        setHomework(homeworkData.slice(0, 4));
      }

      // 4. Fetch timetable
      const timetableData = await apiRequest('/timetables/my');
      if (Array.isArray(timetableData)) {
        setTimetable(timetableData);
      }
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white dark:border-slate-800">
          {stats.studentName.charAt(0)}
        </div>
        <div className="text-center sm:text-left flex-grow space-y-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Welcome Back, {stats.studentName}!</h2>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
            <span>Class: <strong className="text-slate-700 dark:text-slate-300">{stats.className}</strong></span>
            <span className="hidden sm:inline">|</span>
            <span>Academic Portal Dashboard</span>
          </div>
        </div>
      </div>

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance widget */}
        <div className="border rounded-2xl p-6 bg-card shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Attendance Rate</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{stats.attendancePercentage}%</span>
            <span className="text-[10px] text-slate-500 block font-medium mt-0.5">Overall presence rate</span>
          </div>
        </div>

        {/* Fees widget */}
        <div className="border rounded-2xl p-6 bg-card shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Dues Balance</span>
            <span className={`text-2xl font-extrabold ${stats.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-500'}`}>
              {stats.outstandingBalance > 0 ? `₹${stats.outstandingBalance.toLocaleString('en-IN')}` : 'Paid'}
            </span>
            <span className="text-[10px] text-slate-500 block font-medium mt-0.5">Pending invoice dues</span>
          </div>
        </div>

        {/* Average widget */}
        <div className="border rounded-2xl p-6 bg-card shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Exam Performance</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{stats.averageScore}%</span>
            <span className="text-[10px] text-slate-500 block font-medium mt-0.5">Aggregate score average</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Homework & Timetables */}
        <div className="lg:col-span-2 space-y-8">
          {/* Homework Planner */}
          <div className="border rounded-2xl p-6 bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" /> Active Homework Assignments
              </h3>
            </div>
            <div className="space-y-4">
              {homework.map((h: any) => (
                <div key={h.id} className="p-4 border rounded-xl bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{h.title}</h4>
                    <p className="text-slate-400 font-medium">{h.subject?.name} | Teacher: {h.teacher?.user?.name}</p>
                    <span className="text-[10px] text-slate-500 block">
                      Due: {new Date(h.dueDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full font-bold ${h.submissions?.length > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {h.submissions?.length > 0 ? 'Submitted' : 'Pending'}
                  </span>
                </div>
              ))}
              {homework.length === 0 && (
                <div className="text-center p-8 text-slate-400 text-xs">No homework assigned yet.</div>
              )}
            </div>
          </div>

          {/* Timetable Grid */}
          <div className="border rounded-2xl p-6 bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Class Schedule
            </h3>
            <div className="divide-y divide-border">
              {timetable.slice(0, 4).map((t: any) => (
                <div key={t.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                      {t.startTime}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{t.subject?.name}</h4>
                      <p className="text-slate-400 mt-0.5">Room {t.roomNumber} | {t.teacher?.user?.name}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{t.dayOfWeek}</span>
                </div>
              ))}
              {timetable.length === 0 && (
                <div className="text-center p-8 text-slate-400 text-xs">No scheduled classes.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Bulletin notices */}
        <div className="space-y-8">
          <div className="border rounded-2xl p-6 bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Board Bulletins
            </h3>
            <div className="space-y-4">
              {notices.map((n: any) => (
                <div key={n.id} className={`p-4 border rounded-xl text-left space-y-2 relative overflow-hidden ${
                  n.isPinned ? 'border-primary/30 bg-primary/5' : 'bg-muted/10'
                }`}>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 leading-tight">{n.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      n.type === 'EMERGENCY' ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'
                    }`}>
                      {n.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{n.content}</p>
                  <span className="text-[9px] text-slate-400 block font-medium">
                    {new Date(n.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              ))}
              {notices.length === 0 && (
                <div className="text-center p-8 text-slate-400 text-xs">No bulletins posted.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
