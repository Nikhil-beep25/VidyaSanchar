import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

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
    <div className="layout-container py-8 sm:py-12 space-y-12 relative text-left">
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-[15%] left-[-15%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none dark:block hidden" />

      {/* Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Real Reviews</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight Outfit">On the Ground Feedback</h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Hear from administrators, educators, and parents who are using VidyaSanchar.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((r, index) => (
          <div 
            key={index} 
            className="border border-white/[0.06] rounded-3xl p-6 sm:p-10 bg-card/45 backdrop-blur-sm space-y-6 hover:border-primary/20 hover:shadow-xl transition-all duration-300 relative group text-left"
          >
            {/* Top quote mark icon */}
            <div className="absolute top-6 right-8 text-white/[0.02] dark:text-white/[0.02] group-hover:text-primary/[0.05] transition-colors pointer-events-none">
              <Quote className="h-16 w-16 rotate-180" />
            </div>

            <div className="flex items-center space-x-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4.5 w-4.5 ${i < r.rating ? 'fill-yellow-500' : 'text-muted-foreground/30'}`}
                />
              ))}
            </div>
            <p className="italic text-muted-foreground leading-relaxed text-sm sm:text-base">"{r.text}"</p>
            <div className="flex items-center space-x-4 pt-6 border-t border-white/[0.05]">
              <img 
                src={r.avatar} 
                alt={r.name} 
                className="h-12 w-12 rounded-full object-cover border border-white/10 bg-slate-900" 
              />
              <div>
                <h4 className="font-extrabold text-sm text-foreground">{r.name}</h4>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
