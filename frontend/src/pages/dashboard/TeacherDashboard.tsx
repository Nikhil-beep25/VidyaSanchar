import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';
import { Users, Calendar, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    assignedClassesCount: 1,
    subjectsCount: 2,
    examsCreated: 2,
  });

  useEffect(() => {
    async function loadTeacherStats() {
      try {
        const data = await apiRequest('/analytics/summary');
        if (data && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        // Fallback to mock data if offline
      }
    }
    loadTeacherStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teacher Console</h1>
        <p className="text-sm text-muted-foreground">Manage your assigned classrooms, schedule, and gradebooks.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Assigned Classrooms</span>
            <span className="text-2xl font-bold">{stats.assignedClassesCount}</span>
          </div>
        </div>

        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Subjects Taught</span>
            <span className="text-2xl font-bold">{stats.subjectsCount}</span>
          </div>
        </div>

        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Exams Scheduled</span>
            <span className="text-2xl font-bold">{stats.examsCreated}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-xl p-6 bg-card space-y-4">
          <h3 className="font-bold text-lg">Classroom Shortcuts</h3>
          <div className="flex flex-col space-y-3">
            <Link
              to="/dashboard/teacher/attendance"
              className="inline-flex items-center justify-between p-4 border rounded-lg hover:bg-accent text-sm transition-colors text-left"
            >
              <div>
                <span className="font-bold block">Record Daily Attendance</span>
                <span className="text-xs text-muted-foreground">Log present/absent sheets for Class 10-A</span>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to="/dashboard/teacher/marks"
              className="inline-flex items-center justify-between p-4 border rounded-lg hover:bg-accent text-sm transition-colors text-left"
            >
              <div>
                <span className="font-bold block">Gradebook Marks Entry</span>
                <span className="text-xs text-muted-foreground">Input student marks for Mid-term tests</span>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to="/dashboard/teacher/timetable"
              className="inline-flex items-center justify-between p-4 border rounded-lg hover:bg-accent text-sm transition-colors text-left"
            >
              <div>
                <span className="font-bold block">View My Schedule</span>
                <span className="text-xs text-muted-foreground">Check daily teaching period slot timings</span>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="border rounded-xl p-6 bg-card flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Teacher Profile</h3>
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120"
                alt="Ramesh Verma"
                className="h-16 w-16 rounded-full object-cover border"
              />
              <div className="text-left">
                <h4 className="font-bold text-base">Ramesh Verma</h4>
                <p className="text-xs text-muted-foreground">Department of Mathematics</p>
                <p className="text-xs text-primary font-semibold mt-1">ID: T-2026-101</p>
              </div>
            </div>
            <div className="text-sm space-y-2 pt-2 border-t text-left">
              <div>
                <span className="text-muted-foreground text-xs block">Highest Qualification</span>
                <span className="font-medium text-xs">M.Sc. Mathematics, B.Ed.</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">Specialization</span>
                <span className="font-medium text-xs">Algebra & Analytical Geometry</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
