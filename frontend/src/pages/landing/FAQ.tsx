import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Card } from '../../components/common/Card';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/60 py-4 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left py-3 font-semibold text-base sm:text-lg hover:text-primary transition-all duration-300 focus:outline-none group"
      >
        <span className="text-foreground/90 group-hover:text-primary transition-colors">{question}</span>
        <div className={`p-1.5 rounded-lg border border-border/80 bg-background text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-all ${open ? 'rotate-180 bg-primary/5 text-primary border-primary/20' : ''}`}>
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>
      
      {/* Accordion Smooth Spring Slide transition block */}
      <div 
        className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: 'Is VidyaSanchar really free and open-source?',
      a: 'Yes, the full source code is released under the open-source MIT license. You can clone the project, host it on your own server, and run it for unlimited students without paying any licensing or subscription fees.',
    },
    {
      q: 'Can it handle CBSE, ICSE, and local State Board exam grading guidelines?',
      a: 'Absolutely. The examination module allows you to create custom exams (Mid-terms, Practical assessments, Board mock tests), set maximum marks, and specify passing thresholds. Reports are generated dynamically based on these variables.',
    },
    {
      q: 'How does the Fee Management module handle local Indian payment systems?',
      a: 'Administrators can record student payments using UPI, NetBanking, Card, or Cash. The system tracks partial payments, computes remaining ledger balances, and generates unique receipt numbers logged in your PostgreSQL database.',
    },
    {
      q: 'How does the Library Management module calculate book fine rates?',
      a: 'When an issued book is returned past its assigned due date, the system automatically calculates the fine amount using a standard daily rate (e.g. ₹10 per day) from the return date, updating the records instantly.',
    },
    {
      q: 'Can we install it on local school servers without active internet access?',
      a: 'Yes, using Docker and Docker Compose, you can build and run the entire application stack (PostgreSQL, Express API, Nginx frontend) offline in a Local Area Network (LAN). Active internet is only needed if you use external image CDNs.',
    },
  ];

  return (
    <div className="layout-container py-8 sm:py-12 space-y-10 relative text-left">
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-[10%] left-[-20%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />

      {/* Intro */}
      <section className="text-center space-y-4 reveal reveal-fade-up">
        <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>F.A.Q.</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight Outfit text-foreground">Frequently Asked Questions</h1>
        <p className="text-base sm:text-lg text-muted-foreground font-semibold">
          Find answers to common questions about setting up and running VidyaSanchar.
        </p>
      </section>

      {/* List using Card Component */}
      <Card className="p-6 sm:p-10 shadow-2xl relative reveal reveal-scale">
        <div className="divide-y divide-border/60">
          {faqs.map((f, i) => (
            <FAQItem key={i} question={f.q} answer={f.a} />
          ))}
        </div>
      </Card>
    </div>
  );
};
