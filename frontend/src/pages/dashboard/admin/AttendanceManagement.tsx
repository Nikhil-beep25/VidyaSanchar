import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { Calendar as CalendarIcon, CheckCircle, Search, Save } from 'lucide-react';

export const AttendanceManagement: React.FC = () => {
  const toast = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: string; remarks: string }>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load all classes
  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await apiRequest('/classes');
        setClasses(data);
        if (data.length > 0) {
          setSelectedClassId(data[0].id);
        }
      } catch (err: any) {
        toast.error('Failed to load class list.');
      }
    }
    loadClasses();
  }, []);

  // Load students and existing attendance when class or date changes
  useEffect(() => {
    if (!selectedClassId) return;

    async function loadAttendanceData() {
      setLoading(true);
      try {
        // Fetch all students in the class
        const studentList = await apiRequest(`/students?classId=${selectedClassId}`);
        setStudents(studentList);

        // Fetch existing attendance records for the class and date
        const existingRecords = await apiRequest(
          `/attendance/class/${selectedClassId}?date=${selectedDate}`
        );

        // Map existing records to studentId
        const newMap: Record<string, { status: string; remarks: string }> = {};
        
        // Pre-populate with PRESENT by default for all students
        studentList.forEach((s: any) => {
          newMap[s.id] = { status: 'PRESENT', remarks: '' };
        });

        // Overlay existing records from database
        existingRecords.forEach((rec: any) => {
          newMap[rec.studentId] = {
            status: rec.status,
            remarks: rec.remarks || ''
          };
        });

        setAttendanceMap(newMap);
      } catch (err: any) {
        toast.error('Failed to load attendance logs.');
      } finally {
        setLoading(false);
      }
    }

    loadAttendanceData();
  }, [selectedClassId, selectedDate]);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedClassId) return;
    
    setSubmitting(true);
    try {
      const records = Object.entries(attendanceMap).map(([studentId, data]) => ({
        studentId,
        status: data.status,
        remarks: data.remarks
      }));

      await apiRequest('/attendance', {
        method: 'POST',
        body: JSON.stringify({
          classId: selectedClassId,
          date: selectedDate,
          records
        })
      });

      toast.success('Attendance records saved successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Attendance Register</h1>
        <p className="text-sm text-muted-foreground">Monitor and record student attendance across all class branches.</p>
      </div>

      {/* Selector Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border p-4 rounded-xl bg-card items-end">
        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Class *</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full h-10 px-3 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.section}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Date *</label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handleSave}
            disabled={submitting || students.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {submitting ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* Student List */}
      {loading ? (
        <div className="p-12 text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
          Loading student roster...
        </div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground w-16">Roll</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground w-64">Student Name</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground w-72">Attendance Status</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const currentRecord = attendanceMap[student.id] || { status: 'PRESENT', remarks: '' };
                  return (
                    <tr key={student.id} className="border-b hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-semibold text-primary">{student.rollNumber}</td>
                      <td className="p-4 font-bold">{student.user?.name}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`attendance-${student.id}`}
                              value="PRESENT"
                              checked={currentRecord.status === 'PRESENT'}
                              onChange={() => handleStatusChange(student.id, 'PRESENT')}
                              className="text-primary focus:ring-primary h-4 w-4"
                            />
                            <span className="text-xs font-semibold text-green-600">Present</span>
                          </label>

                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`attendance-${student.id}`}
                              value="ABSENT"
                              checked={currentRecord.status === 'ABSENT'}
                              onChange={() => handleStatusChange(student.id, 'ABSENT')}
                              className="text-primary focus:ring-primary h-4 w-4"
                            />
                            <span className="text-xs font-semibold text-destructive">Absent</span>
                          </label>

                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`attendance-${student.id}`}
                              value="LATE"
                              checked={currentRecord.status === 'LATE'}
                              onChange={() => handleStatusChange(student.id, 'LATE')}
                              className="text-primary focus:ring-primary h-4 w-4"
                            />
                            <span className="text-xs font-semibold text-yellow-600">Late</span>
                          </label>

                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`attendance-${student.id}`}
                              value="EXCUSED"
                              checked={currentRecord.status === 'EXCUSED'}
                              onChange={() => handleStatusChange(student.id, 'EXCUSED')}
                              className="text-primary focus:ring-primary h-4 w-4"
                            />
                            <span className="text-xs font-semibold text-blue-600">Excused</span>
                          </label>
                        </div>
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={currentRecord.remarks}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          placeholder="e.g. Health reason, leave, etc."
                          className="w-full h-8 px-2 rounded border bg-background text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                        />
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No student enrollment records found in this class.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
