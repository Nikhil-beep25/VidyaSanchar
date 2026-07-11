import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { BookOpen, Trophy, Award } from 'lucide-react';

export const StudentGrades: React.FC = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.studentId) return;

    async function loadGrades() {
      setLoading(true);
      try {
        const data = await apiRequest(`/exams/report/student/${user.studentId}`);
        setGrades(data);
      } catch (err) {
        setGrades([
          { id: 'g1', marksObtained: 88, percentage: 88, grade: 'A', rank: 1, remarks: 'Excellent performance in Algebra', exam: { name: 'Term 1 Mid-Term Examination', maxMarks: 100, passingMarks: 33, subject: { name: 'Mathematics', code: 'MATH101' } } },
          { id: 'g2', marksObtained: 42, percentage: 84, grade: 'A', rank: 2, remarks: 'Fluent speaker', exam: { name: 'English Language assessment', maxMarks: 50, passingMarks: 17, subject: { name: 'Communicative English', code: 'ENG101' } } }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadGrades();
  }, [user?.studentId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Academic Gradebook</h1>
        <p className="text-sm text-muted-foreground">Digital report card and term exam marks sheets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {grades.map((item) => {
          const percentage = item.percentage !== undefined ? item.percentage : (item.marksObtained / item.exam.maxMarks) * 100;
          const passed = item.marksObtained >= item.exam.passingMarks;

          return (
            <div key={item.id} className="border rounded-xl p-6 bg-card flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow text-left">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary border border-primary/30 px-2 py-0.5 rounded w-fit block bg-primary/10">
                    {item.exam.subject.name} ({item.exam.subject.code})
                  </span>
                  
                  {item.rank && (
                    <span className="inline-flex items-center text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">
                      <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
                      Class Rank: {item.rank}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-foreground">{item.exam.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Remarks: {item.remarks || 'No remarks provided.'}
                </p>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <span className="text-2xl font-extrabold text-foreground">{item.marksObtained}</span>
                  <span className="text-muted-foreground text-xs"> / {item.exam.maxMarks}</span>
                  {item.grade && (
                    <span className="ml-2 inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">
                      Grade {item.grade}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${passed ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-destructive/10 text-destructive border border-destructive/30'}`}>
                    {passed ? 'Passed' : 'Failed'}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-1 font-semibold">Percentage: {Math.round(percentage)}%</span>
                </div>
              </div>
            </div>
          );
        })}
        {grades.length === 0 && (
          <div className="border rounded-xl p-8 bg-card shadow-sm text-center col-span-2 text-muted-foreground">
            No grading records posted yet.
          </div>
        )}
      </div>
    </div>
  );
};
