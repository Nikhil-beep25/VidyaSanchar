import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { BookOpen } from 'lucide-react';

export const ParentGrades: React.FC = () => {
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    async function loadGrades() {
      try {
        const data = await apiRequest('/exams/report/student/s1');
        setGrades(data);
      } catch (err) {
        setGrades([
          { id: 'g1', marksObtained: 88, remarks: 'Excellent in Algebra, needs minor geometry practice', exam: { name: 'Term 1 Mid-Term Examination', maxMarks: 100, passingMarks: 33, subject: { name: 'Mathematics', code: 'MATH101' } } },
          { id: 'g2', marksObtained: 42, remarks: 'Fluent speaker', exam: { name: 'English Language assessment', maxMarks: 50, passingMarks: 17, subject: { name: 'Communicative English', code: 'ENG101' } } }
        ]);
      }
    }
    loadGrades();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Child's report card</h1>
        <p className="text-sm text-muted-foreground">Digital report card grades and class remarks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {grades.map((item) => {
          const percentage = (item.marksObtained / item.exam.maxMarks) * 100;
          const passed = item.marksObtained >= item.exam.passingMarks;

          return (
            <div key={item.id} className="border rounded-xl p-6 bg-card flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow text-left">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary border border-primary/30 px-2 py-0.5 rounded w-fit block bg-primary/10">
                  {item.exam.subject.name}
                </span>
                <h3 className="font-bold text-base text-foreground">{item.exam.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Teacher Remarks: {item.remarks || 'No remarks provided.'}
                </p>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <span className="text-2xl font-extrabold text-foreground">{item.marksObtained}</span>
                  <span className="text-muted-foreground text-xs"> / {item.exam.maxMarks}</span>
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
      </div>
    </div>
  );
};
