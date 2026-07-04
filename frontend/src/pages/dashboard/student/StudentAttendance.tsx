import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<any>({
    summary: { totalDays: 4, presentDays: 4, absentDays: 0, lateDays: 0, excusedDays: 0, percentage: 100 },
    records: []
  });

  useEffect(() => {
    async function loadAttendance() {
      try {
        const data = await apiRequest('/attendance/student/s1');
        setAttendance(data);
      } catch (err) {
        setAttendance({
          summary: { totalDays: 4, presentDays: 3, absentDays: 1, lateDays: 0, excusedDays: 0, percentage: 75 },
          records: [
            { id: '1', date: '2026-07-04T00:00:00.000Z', status: 'PRESENT', remarks: 'Active' },
            { id: '2', date: '2026-07-03T00:00:00.000Z', status: 'PRESENT', remarks: 'Attentive' },
            { id: '3', date: '2026-07-02T00:00:00.000Z', status: 'ABSENT', remarks: 'Unwell' },
            { id: '4', date: '2026-07-01T00:00:00.000Z', status: 'PRESENT', remarks: 'Punctual' }
          ]
        });
      }
    }
    loadAttendance();
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Attendance Ledger</h1>
        <p className="text-sm text-muted-foreground">Detailed visual calendar and classroom presence statistics.</p>
      </div>

      {/* Grid */}
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

      {/* Logs */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-muted/20 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-base">Presence History Logs</h3>
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
