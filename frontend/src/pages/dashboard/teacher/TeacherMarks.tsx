import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { BookOpen, Check, AlertCircle } from 'lucide-react';

export const TeacherMarks: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  
  const [students, setStudents] = useState<any[]>([]);
  const [marksRecords, setMarksRecords] = useState<Record<string, { marksObtained: string; remarks: string }>>({});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load exams
  useEffect(() => {
    async function loadExams() {
      try {
        const data = await apiRequest('/exams');
        setExams(data);
        if (data.length > 0) setSelectedExamId(data[0].id);
      } catch (err) {
        setExams([
          { id: 'ex1', name: 'Term 1 Mid-Term Examination', maxMarks: 100, subject: { name: 'Mathematics' } }
        ]);
        setSelectedExamId('ex1');
      }
    }
    loadExams();
  }, []);

  // Load students for exam class (linked to subjects)
  useEffect(() => {
    if (!selectedExamId) return;

    async function loadStudents() {
      try {
        // Fetch class linked to the exam
        const exam = exams.find(e => e.id === selectedExamId);
        const classId = exam?.subject?.classId || '';
        
        const data = await apiRequest(`/students${classId ? `?classId=${classId}` : ''}`);
        setStudents(data);
        
        const records: Record<string, { marksObtained: string; remarks: string }> = {};
        data.forEach((s: any) => {
          records[s.id] = { marksObtained: '', remarks: '' };
        });
        setMarksRecords(records);
      } catch (err) {
        const mockStudents = [
          { id: 's1', rollNumber: '10A01', user: { name: 'Rahul Gupta' } },
          { id: 's2', rollNumber: '10A02', user: { name: 'Snigdha Das' } }
        ];
        setStudents(mockStudents);
        const records: Record<string, { marksObtained: string; remarks: string }> = {};
        mockStudents.forEach((s: any) => {
          records[s.id] = { marksObtained: '', remarks: '' };
        });
        setMarksRecords(records);
      }
    }
    loadStudents();
  }, [selectedExamId, exams]);

  const handleMarksChange = (studentId: string, marksObtained: string) => {
    setMarksRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], marksObtained }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setMarksRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const recordsPayload = Object.keys(marksRecords)
      .filter(studentId => marksRecords[studentId].marksObtained !== '')
      .map(studentId => ({
        studentId,
        marksObtained: parseFloat(marksRecords[studentId].marksObtained),
        remarks: marksRecords[studentId].remarks,
      }));

    try {
      await apiRequest('/exams/marks', {
        method: 'POST',
        body: JSON.stringify({
          examId: selectedExamId,
          records: recordsPayload
        })
      });
      setMessage('✓ Student marks saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`✗ ${err.message || 'Failed to record marks.'}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedExam = exams.find(e => e.id === selectedExamId);

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Gradebook Marks Entry</h1>
        <p className="text-sm text-muted-foreground">Select exam and enter student scores.</p>
      </div>

      {/* Selectors Bar */}
      <div className="flex border p-4 rounded-xl bg-card items-center justify-between">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Select Exam Assessment:</span>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="h-10 px-3 border rounded-md bg-background text-sm w-full sm:w-64"
          >
            {exams.map(e => (
              <option key={e.id} value={e.id}>{e.name} ({e.subject?.name || 'Math'})</option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm flex items-center space-x-2 ${message.startsWith('✓') ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
          {message.startsWith('✓') ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{message}</span>
        </div>
      )}

      {/* Entry Sheet */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Roll No.</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Student Name</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Marks Obtained (Max: {selectedExam?.maxMarks || 100})
                  </th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Grade Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const record = marksRecords[student.id] || { marksObtained: '', remarks: '' };

                  return (
                    <tr key={student.id} className="border-b hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-semibold text-primary">{student.rollNumber}</td>
                      <td className="p-4 font-bold">{student.user?.name || student.name}</td>
                      <td className="p-4">
                        <input
                          type="number"
                          min="0"
                          max={selectedExam?.maxMarks || 100}
                          value={record.marksObtained}
                          onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          className="w-24 h-8 px-2 border rounded bg-background text-sm font-semibold"
                          placeholder="e.g. 85"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={record.remarks}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          className="w-full h-8 px-2 border rounded bg-background text-xs"
                          placeholder="e.g. Good in algebra"
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
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {loading ? 'Submitting marks...' : 'Save Gradebook Scores'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
