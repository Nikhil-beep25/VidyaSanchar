import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left py-2 font-semibold text-lg hover:text-primary transition-colors focus:outline-none"
      >
        <span>{question}</span>
        {open ? <ChevronUp className="h-5 w-5 text-primary" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {open && (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed transition-all duration-300">
          {answer}
        </p>
      )}
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
    <div className="container max-w-4xl mx-auto px-4 py-16 space-y-12">
      {/* Intro */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions about setting up and running VidyaSanchar.
        </p>
      </section>

      {/* List */}
      <section className="border rounded-2xl p-6 md:p-8 bg-card shadow-sm space-y-2">
        {faqs.map((f, i) => (
          <FAQItem key={i} question={f.q} answer={f.a} />
        ))}
      </section>
    </div>
  );
};
