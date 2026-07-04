import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';
import { Calendar, BookOpen, CreditCard, Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    attendancePercentage: 100,
    outstandingBalance: 4500,
    averageScore: 88,
    className: 'Class 10-A',
  });

  const [announcements, setAnnouncements] = useState<any[]>([
    { title: 'Independence Day Assembly', message: 'All students assemble in school uniform at 7:30 AM on 15th August.' },
    { title: 'PTM on Saturday', message: 'First Parent-Teacher Meeting is scheduled from 9:00 AM to 1:00 PM.' }
  ]);

  useEffect(() => {
    async function loadStudentStats() {
      try {
        const data = await apiRequest('/analytics/summary');
        if (data) {
          if (data.stats) {
            setStats({
              attendancePercentage: data.stats.attendancePercentage || 100,
              outstandingBalance: data.stats.outstandingBalance !== undefined ? data.stats.outstandingBalance : 4500,
              averageScore: data.stats.averageScore || 88,
              className: data.studentClass ? `${data.studentClass.name}-${data.studentClass.section}` : 'Class 10-A',
            });
          }
        }
      } catch (err) {
        // Fallback to mock if offline
      }
    }
    loadStudentStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-sm text-muted-foreground">Classroom Assigned: <span className="font-semibold text-primary">{stats.className}</span></p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">My Attendance Rate</span>
            <span className="text-2xl font-bold">{stats.attendancePercentage}%</span>
          </div>
        </div>

        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Outstanding Fees Balance</span>
            <span className={`text-2xl font-bold ${stats.outstandingBalance > 0 ? 'text-destructive' : 'text-green-500'}`}>
              ₹{stats.outstandingBalance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Exam Marks Average</span>
            <span className="text-2xl font-bold">{stats.averageScore}/100</span>
          </div>
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notices */}
        <div className="border rounded-xl p-6 bg-card space-y-4 lg:col-span-2">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Notices & School Alerts</span>
          </h3>
          <div className="space-y-4">
            {announcements.map((item, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-muted/20 text-left space-y-1">
                <h4 className="font-semibold text-sm text-primary">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation shortcuts */}
        <div className="border rounded-xl p-6 bg-card space-y-4">
          <h3 className="font-bold text-lg">My Portal Tools</h3>
          <div className="flex flex-col space-y-3">
            <Link
              to="/dashboard/student/attendance"
              className="inline-flex items-center justify-between p-3 border rounded-lg hover:bg-accent text-sm transition-colors text-left"
            >
              <span>View Attendance Details</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard/student/grades"
              className="inline-flex items-center justify-between p-3 border rounded-lg hover:bg-accent text-sm transition-colors text-left"
            >
              <span>Report Card Grades</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard/student/fees"
              className="inline-flex items-center justify-between p-3 border rounded-lg hover:bg-accent text-sm transition-colors text-left"
            >
              <span>Fees Ledger & Receipts</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard/student/timetable"
              className="inline-flex items-center justify-between p-3 border rounded-lg hover:bg-accent text-sm transition-colors text-left"
            >
              <span>Class Timetable Schedule</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
