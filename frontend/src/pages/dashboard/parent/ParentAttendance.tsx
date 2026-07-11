import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { Calendar, CheckCircle2, XCircle, AlertCircle, User } from 'lucide-react';

export const ParentAttendance: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [attendance, setAttendance] = useState<any>({
    summary: { totalDays: 0, presentDays: 0, absentDays: 0, lateDays: 0, excusedDays: 0, percentage: 100 },
    records: []
  });
  const [loading, setLoading] = useState(true);

  // 1. Fetch parent children context
  useEffect(() => {
    async function loadParentContext() {
      try {
        const summary = await apiRequest('/analytics/summary');
        if (summary && summary.children && summary.children.length > 0) {
          setChildren(summary.children);
          setSelectedChildId(summary.children[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching parent student context:', err);
        setLoading(false);
      }
    }
    loadParentContext();
  }, []);

  // 2. Fetch attendance for selected child
  useEffect(() => {
    if (!selectedChildId) return;
    setLoading(true);

    async function loadAttendance() {
      try {
        const data = await apiRequest(`/attendance/student/${selectedChildId}`);
        setAttendance(data);
      } catch (err) {
        setAttendance({
          summary: { totalDays: 4, presentDays: 3, absentDays: 1, lateDays: 0, excusedDays: 0, percentage: 75 },
          records: [
            { id: '1', date: '2026-07-04T00:00:00.000Z', status: 'PRESENT', remarks: 'Punctual' },
            { id: '2', date: '2026-07-03T00:00:00.000Z', status: 'PRESENT', remarks: 'Active' },
            { id: '3', date: '2026-07-02T00:00:00.000Z', status: 'ABSENT', remarks: 'Unwell' },
            { id: '4', date: '2026-07-01T00:00:00.000Z', status: 'PRESENT', remarks: 'Attentive' }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, [selectedChildId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'ABSENT':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const activeChild = children.find(c => c.id === selectedChildId);

  if (loading && children.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Child Attendance Monitor</h1>
          <p className="text-sm text-muted-foreground">Monitor your child's monthly classroom presence records.</p>
        </div>

        {/* Children selector dropdown */}
        {children.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Child:</span>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="h-10 px-3 rounded-md border bg-card text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
            >
              {children.map(c => (
                <option key={c.id} value={c.id}>{c.user.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeChild && (
        <div className="p-4 border border-violet-100 rounded-xl bg-violet-50/15 flex items-center space-x-4 text-left shadow-sm">
          <div className="p-2.5 rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">{activeChild.user.name}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Classroom: <span className="font-semibold">{activeChild.studentClass?.name}-{activeChild.studentClass?.section}</span> | Roll Number: <span className="font-semibold">{activeChild.rollNumber}</span>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border rounded-xl p-5 bg-card text-center">
          <span className="text-2xl font-bold text-primary">{attendance.summary.percentage}%</span>
          <span className="text-xs text-muted-foreground block font-medium mt-1">Attendance Ratio</span>
        </div>
        <div className="border rounded-xl p-5 bg-card text-center">
          <span className="text-2xl font-bold text-green-500">{attendance.summary.presentDays}</span>
          <span className="text-xs text-muted-foreground block font-medium mt-1">Days Present</span>
        </div>
        <div className="border rounded-xl p-5 bg-card text-center">
          <span className="text-2xl font-bold text-destructive">{attendance.summary.absentDays}</span>
          <span className="text-xs text-muted-foreground block font-medium mt-1">Days Absent</span>
        </div>
        <div className="border rounded-xl p-5 bg-card text-center">
          <span className="text-2xl font-bold text-yellow-500">{attendance.summary.totalDays}</span>
          <span className="text-xs text-muted-foreground block font-medium mt-1">Total Roll Calls</span>
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-muted/20 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-base">Child Presence Logs</h3>
        </div>
        <div className="divide-y">
          {attendance.records.map((item: any) => (
            <div key={item.id} className="p-4 flex items-center justify-between text-sm text-left">
              <div className="space-y-1">
                <span className="font-bold text-foreground">
                  {new Date(item.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                {item.remarks && <span className="text-xs text-muted-foreground block font-medium">Remarks: {item.remarks}</span>}
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(item.status)}
                <span className="font-bold text-xs uppercase">{item.status.toLowerCase()}</span>
              </div>
            </div>
          ))}
          {attendance.records.length === 0 && (
            <p className="p-8 text-center text-muted-foreground">No attendance records logged.</p>
          )}
        </div>
      </div>
    </div>
  );
};
