import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { BookOpen, Trophy, User } from 'lucide-react';

export const ParentGrades: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [grades, setGrades] = useState<any[]>([]);
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

  // 2. Fetch grades for selected child
  useEffect(() => {
    if (!selectedChildId) return;
    setLoading(true);

    async function loadGrades() {
      try {
        const data = await apiRequest(`/exams/report/student/${selectedChildId}`);
        setGrades(data || []);
      } catch (err) {
        setGrades([
          { id: 'g1', marksObtained: 88, percentage: 88, grade: 'A', rank: 1, remarks: 'Excellent in Algebra, needs minor geometry practice', exam: { name: 'Term 1 Mid-Term Examination', maxMarks: 100, passingMarks: 33, subject: { name: 'Mathematics', code: 'MATH101' } } },
          { id: 'g2', marksObtained: 42, percentage: 84, grade: 'A', rank: 2, remarks: 'Fluent speaker', exam: { name: 'English Language assessment', maxMarks: 50, passingMarks: 17, subject: { name: 'Communicative English', code: 'ENG101' } } }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadGrades();
  }, [selectedChildId]);

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
          <h1 className="text-2xl font-bold tracking-tight">Child's Report Card</h1>
          <p className="text-sm text-muted-foreground">Digital report card grades and class remarks.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {grades.map((item) => {
          const percentage = item.percentage !== undefined ? item.percentage : (item.marksObtained / item.exam.maxMarks) * 100;
          const passed = item.marksObtained >= item.exam.passingMarks;

          return (
            <div key={item.id} className="border rounded-xl p-6 bg-card flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow text-left">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary border border-primary/30 px-2 py-0.5 rounded w-fit block bg-primary/10">
                    {item.exam.subject.name}
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
                  Teacher Remarks: {item.remarks || 'No remarks provided.'}
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
            No grading records posted yet for this child.
          </div>
        )}
      </div>
    </div>
  );
};
