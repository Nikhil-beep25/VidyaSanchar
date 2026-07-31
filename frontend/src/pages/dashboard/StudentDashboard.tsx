import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  CreditCard,
  Clock,
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
  const [timetable, setTimetable] = useState<any[]>([]);

  const loadDashboardData = async () => {
    setLoading(true);
    // 1. Fetch general statistics
    try {
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
    } catch (err) {
      console.warn('Non-fatal error loading student stats summary:', err);
    }

    // 2. Fetch timetable
    try {
      const timetableData = await apiRequest('/timetables/my');
      if (Array.isArray(timetableData)) {
        setTimetable(timetableData);
      }
    } catch (err) {
      console.warn('Non-fatal error loading student timetable:', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Hero Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10">
            Student Academic Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome, {stats.studentName || 'Student'}! 👋
          </h1>
          <p className="text-purple-200/80 text-xs md:text-sm max-w-xl leading-relaxed">
            Track your class attendance and stay updated with your schedule.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 self-stretch md:self-auto justify-center">
          <User className="h-5 w-5 text-purple-300" />
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-purple-200/70 block">Enrolled Class</span>
            <span className="font-extrabold text-sm text-white">{stats.className}</span>
          </div>
        </div>
      </div>

      {/* Top Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border rounded-2xl p-6 bg-card shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-purple-500/10 text-primary">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">Attendance Rate</span>
            <span className="text-2xl font-extrabold text-foreground">{stats.attendancePercentage}%</span>
            <span className="text-[10px] text-muted-foreground block font-medium mt-0.5">Total class attendance</span>
          </div>
        </div>

        <div className="border rounded-2xl p-6 bg-card shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">Dues Balance</span>
            <span className={`text-2xl font-extrabold ${stats.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-500'}`}>
              {stats.outstandingBalance > 0 ? `₹${stats.outstandingBalance.toLocaleString('en-IN')}` : 'Paid'}
            </span>
            <span className="text-[10px] text-muted-foreground block font-medium mt-0.5">Pending invoice dues</span>
          </div>
        </div>

        <div className="border rounded-2xl p-6 bg-card shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">Exam Performance</span>
            <span className="text-2xl font-extrabold text-foreground">{stats.averageScore}%</span>
            <span className="text-[10px] text-muted-foreground block font-medium mt-0.5">Aggregate score average</span>
          </div>
        </div>
      </div>

      {/* Class Schedule */}
      <div className="border rounded-2xl p-6 bg-card shadow-sm space-y-4">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" /> Class Schedule
        </h3>
        <div className="divide-y divide-border">
          {timetable.slice(0, 5).map((t: any) => (
            <div key={t.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-muted text-foreground font-bold">
                  {t.startTime}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{t.subject?.name}</h4>
                  <p className="text-muted-foreground mt-0.5">Room {t.roomNumber} | {t.teacher?.user?.name}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{t.dayOfWeek}</span>
            </div>
          ))}
          {timetable.length === 0 && (
            <div className="text-center p-8 text-muted-foreground text-xs">No scheduled classes.</div>
          )}
        </div>
      </div>
    </div>
  );
};
