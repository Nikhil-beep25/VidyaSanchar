import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { ClipboardCheck, Check, AlertCircle } from 'lucide-react';

export const TeacherAttendance: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const [students, setStudents] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, { status: string; remarks: string }>>({});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load teacher's assigned classes
  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await apiRequest('/classes');
        setClasses(data);
        if (data.length > 0) setSelectedClassId(data[0].id);
      } catch (err) {
        setClasses([{ id: 'c1', name: 'Class 10', section: 'A' }]);
        setSelectedClassId('c1');
      }
    }
    loadClasses();
  }, []);

  // Load students for the selected class
  useEffect(() => {
    if (!selectedClassId) return;

    async function loadStudents() {
      try {
        const data = await apiRequest(`/students?classId=${selectedClassId}`);
        setStudents(data);
        
        // Initialize attendance records
        const records: Record<string, { status: string; remarks: string }> = {};
        data.forEach((s: any) => {
          records[s.id] = { status: 'PRESENT', remarks: '' };
        });
        setAttendanceRecords(records);
      } catch (err) {
        const mockStudents = [
          { id: 's1', rollNumber: '10A01', user: { name: 'Rahul Gupta' } },
          { id: 's2', rollNumber: '10A02', user: { name: 'Snigdha Das' } }
        ];
        setStudents(mockStudents);
        const records: Record<string, { status: string; remarks: string }> = {};
        mockStudents.forEach((s: any) => {
          records[s.id] = { status: 'PRESENT', remarks: '' };
        });
        setAttendanceRecords(records);
      }
    }
    loadStudents();
  }, [selectedClassId]);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const recordsPayload = Object.keys(attendanceRecords).map(studentId => ({
      studentId,
      status: attendanceRecords[studentId].status,
      remarks: attendanceRecords[studentId].remarks,
    }));

    try {
      await apiRequest('/attendance', {
        method: 'POST',
        body: JSON.stringify({
          classId: selectedClassId,
          date,
          records: recordsPayload
        })
      });
      setMessage('✓ Attendance sheet recorded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`✗ ${err.message || 'Failed to record attendance.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Record Daily Attendance</h1>
        <p className="text-sm text-muted-foreground">Select class, date, and take student roll calls.</p>
      </div>

      {/* Selectors Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border p-4 rounded-xl bg-card">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Classroom:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="h-10 px-3 border rounded-md bg-background text-sm w-full sm:w-48"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Date:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 px-3 border rounded-md bg-background text-sm w-full sm:w-48"
          />
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm flex items-center space-x-2 ${message.startsWith('✓') ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
          {message.startsWith('✓') ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{message}</span>
        </div>
      )}

      {/* Attendance checklist sheet */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Roll No.</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Student Name</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Attendance Status</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Remarks (Optional)</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const record = attendanceRecords[student.id] || { status: 'PRESENT', remarks: '' };

                  return (
                    <tr key={student.id} className="border-b hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-semibold text-primary">{student.rollNumber}</td>
                      <td className="p-4 font-bold">{student.user?.name || student.name}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-4">
                          {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map((status) => (
                            <label key={status} className="flex items-center space-x-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name={`status-${student.id}`}
                                value={status}
                                checked={record.status === status}
                                onChange={() => handleStatusChange(student.id, status)}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                              />
                              <span className={`text-xs font-semibold ${
                                record.status === status
                                  ? status === 'PRESENT'
                                    ? 'text-green-500'
                                    : status === 'ABSENT'
                                      ? 'text-destructive'
                                      : 'text-yellow-500'
                                  : 'text-muted-foreground'
                              }`}>
                                {status.toLowerCase()}
                              </span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={record.remarks}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          className="w-full h-8 px-2 border rounded bg-background text-xs"
                          placeholder="e.g. Late due to rain"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t bg-muted/20 flex justify-end">
            <button
              type="submit"
              disabled={loading || students.length === 0}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 disabled:opacity-50"
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              {loading ? 'Submitting sheet...' : 'Submit Attendance Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
