import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';
import { Calendar, BookOpen, CreditCard, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ParentDashboard: React.FC = () => {
  const [children, setChildren] = useState<any[]>([
    { id: 'student-id-1', user: { name: 'Rahul Gupta' }, rollNumber: '10A01', studentClass: { name: 'Class 10', section: 'A' } }
  ]);
  const [selectedChildId, setSelectedChildId] = useState('');
  
  const [stats, setStats] = useState({
    attendancePercentage: 100,
    outstandingBalance: 0,
    averageScore: 88,
  });

  useEffect(() => {
    async function loadParentData() {
      try {
        const data = await apiRequest('/analytics/summary');
        if (data && data.children) {
          setChildren(data.children);
          setSelectedChildId(data.children[0]?.id || '');
        }
      } catch (err) {
        // Fallback to mock data
      }
    }
    loadParentData();
  }, []);

  // Fetch stats for child
  useEffect(() => {
    if (!selectedChildId) return;
    
    // In a real application, fetch stats for this studentId. We will mock it using Rahul's values.
    setStats({
      attendancePercentage: 100,
      outstandingBalance: 0, // Paid
      averageScore: 88,
    });
  }, [selectedChildId]);

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Parent Portal</h1>
          <p className="text-sm text-muted-foreground">Monitor and track your child's academic status.</p>
        </div>

        {/* Children dropdown */}
        {children.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Select Child:</span>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="h-10 px-3 rounded-md border bg-card text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {children.map(c => (
                <option key={c.id} value={c.id}>{c.user.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedChild && (
        <div className="p-4 border rounded-xl bg-card flex items-center space-x-4">
          <div className="p-2.5 rounded-full bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-base">{selectedChild.user.name}</h3>
            <p className="text-xs text-muted-foreground">
              Classroom: <span className="font-semibold">{selectedChild.studentClass?.name}-{selectedChild.studentClass?.section}</span> | Roll Number: <span className="font-semibold">{selectedChild.rollNumber}</span>
            </p>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Child's Attendance</span>
            <span className="text-2xl font-bold">{stats.attendancePercentage}%</span>
          </div>
        </div>

        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Child's Unpaid Fees</span>
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
            <span className="text-xs text-muted-foreground block font-medium">Academic Average</span>
            <span className="text-2xl font-bold">{stats.averageScore}/100</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border rounded-xl p-6 bg-card space-y-4 max-w-xl mx-auto">
        <h3 className="font-bold text-lg">Child Monitoring Actions</h3>
        <div className="flex flex-col space-y-3">
          <Link
            to="/dashboard/parent/attendance"
            className="inline-flex items-center justify-between p-3.5 border rounded-lg hover:bg-accent text-sm transition-colors text-left"
          >
            <span>View detailed attendance records</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard/parent/grades"
            className="inline-flex items-center justify-between p-3.5 border rounded-lg hover:bg-accent text-sm transition-colors text-left"
          >
            <span>Download report card grades</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard/parent/fees"
            className="inline-flex items-center justify-between p-3.5 border rounded-lg hover:bg-accent text-sm transition-colors text-left"
          >
            <span>Check pending term dues & history</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
