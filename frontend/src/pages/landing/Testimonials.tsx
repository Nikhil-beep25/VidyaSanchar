import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Dr. G.S. Grewal',
      role: 'Principal, Delhi Public School Dwarka',
      text: 'VidyaSanchar completely changed our administrative workflows. Collecting student fees, generating ledger reports, and tracking classroom attendances used to take hours. Now it takes minutes, and parents receive alerts instantly.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      rating: 5,
    },
    {
      name: 'Sister Mary Joseph',
      role: 'Registrar, St. Xavier\'s College, Mumbai',
      text: 'Since we deployed the open-source ERP on our local college servers, we have saved lakhs in recurring licensing fees. The timetable generation and student profiling modules are fast and highly customisable.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
      rating: 5,
    },
    {
      name: 'Prof. Ramesh Verma',
      role: 'Senior Mathematics Teacher, Indore Academy',
      text: 'Recording mid-term exam marks in bulk through the clean teacher portal has simplified my grading duties. The performance reports provide high/low/average grade graphs instantly.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
      rating: 4,
    },
    {
      name: 'Anil Gupta',
      role: 'Parent of Rahul Gupta (Class 10-A)',
      text: 'I can see Rahul\'s attendance calendar and exam scores directly from my phone. Paying the tuition fee quarter-bills online via UPI and downloading receipts is incredibly convenient.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120',
      rating: 5,
    },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-16 space-y-16">
      {/* Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">On the Ground Feedback</h1>
        <p className="text-lg text-muted-foreground">
          Hear from administrators, educators, and parents who are using VidyaSanchar.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((r, index) => (
          <div key={index} className="border rounded-2xl p-8 bg-card shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < r.rating ? 'fill-yellow-500' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
            <p className="italic text-muted-foreground leading-relaxed">"{r.text}"</p>
            <div className="flex items-center space-x-4 pt-4 border-t">
              <img src={r.avatar} alt={r.name} className="h-12 w-12 rounded-full object-cover border" />
              <div>
                <h4 className="font-bold text-sm">{r.name}</h4>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
