import React from 'react';
import { UserCheck, Calendar, BookOpen, CreditCard, Clock, Library, Bell, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const Features: React.FC = () => {
  const modules = [
    {
      icon: <UserCheck className="h-5.5 w-5.5" />,
      title: 'Student Management',
      desc: 'Add, update, search, and delete students. View holistic student profiles, roll assignments, and maintain quick access to medical or contact details.',
      features: ['Demographics & Bio', 'Roll Call Mapping', 'Parent Linkage', 'Bulk Imports']
    },
    {
      icon: <Calendar className="h-5.5 w-5.5" />,
      title: 'Attendance System',
      desc: 'Quick class sheets for mark-in. Generate monthly attendance percentages, export Excel/CSV reports, and identify chronic absent students.',
      features: ['One-Click Check-in', 'Calendar View Grid', 'Absence Alerts', 'Export PDF/Excel']
    },
    {
      icon: <BookOpen className="h-5.5 w-5.5" />,
      title: 'Examination System',
      desc: 'Schedule exams, set maximum/passing grades, record test marks, publish digital report cards, and analyze high/low/average performances.',
      features: ['Exam Timeframes', 'Bulk Marks Upload', 'CBSE Report Cards', 'Averages & Medians']
    },
    {
      icon: <CreditCard className="h-5.5 w-5.5" />,
      title: 'Fee Management',
      desc: 'Set quarterly tuition fees or exam fees for classes. Keep history of cash/UPI payments, track balances, and generate unique receipt numbers.',
      features: ['Class-wise Billing', 'UPI & Cash Ledger', 'Partial Due Payments', 'Unique Receipt IDs']
    },
    {
      icon: <Clock className="h-5.5 w-5.5" />,
      title: 'Timetable Scheduling',
      desc: 'Configure day schedules, periods, room numbers, teacher loads, and subjects taught to prevent conflicts.',
      features: ['Conflict Detection', 'Teacher Credit Loads', 'Room Allocations', 'Export PDF Schedules']
    },
    {
      icon: <Library className="h-5.5 w-5.5" />,
      title: 'Library Management',
      desc: 'Maintain library book database (titles, authors, ISBNs). Record borrow/return transactions, and automatically track daily overdue fines.',
      features: ['ISBN Scanning', 'Borrower Records', 'Fine Counter Logic', 'Uptimes Tracker']
    },
    {
      icon: <Bell className="h-5.5 w-5.5" />,
      title: 'Announcements Board',
      desc: 'Send targeted notifications (for teachers, parents, students, or administrative staff) with instant dashboard boards.',
      features: ['Custom Role Targets', 'Notice Board Feeds', 'Email Dispatcher', 'Pinned Notice Tags']
    },
    {
      icon: <ShieldAlert className="h-5.5 w-5.5" />,
      title: 'Role-Based Authorization',
      desc: 'Granular permissions for Super Admin, Admin, Teacher, Student, and Parent. Tokens expire securely with HTTP-only cookies.',
      features: ['RBAC Middleware', 'JWT Security tokens', 'Audit Activity Log', 'Cookie Expirations']
    },
  ];

  return (
    <div className="layout-container pt-4 pb-12 sm:pt-6 sm:pb-16 space-y-12 sm:space-y-16 relative">
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      <div className="absolute top-[50%] right-[-15%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />

      {/* Intro - Reduced Top Padding */}
      <section id="modules" className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>VidyaSanchar Capabilities</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight Outfit text-foreground">System Modules & Features</h1>
        <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
          VidyaSanchar comes packed with features covering all day-to-day administrative and academic operations.
        </p>
      </section>

      {/* Grid using reusable Card Component with Equal Heights */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {modules.map((m, index) => (
          <Card 
            key={index} 
            hoverLift 
            glowOnHover
            className="group flex flex-col justify-between space-y-5 text-left p-6 sm:p-8 h-full"
          >
            <div className="space-y-4">
              {/* Icon container with group-hover animation */}
              <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl border border-primary/25 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.25)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {m.icon}
              </div>
              <h3 className="font-extrabold text-lg text-foreground Outfit">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
            
            {/* Features Sub-bullets */}
            <div className="pt-4 border-t border-border/60 space-y-2.5 mt-auto">
              {m.features.map((feat, fidx) => (
                <div key={fidx} className="flex items-center space-x-2.5 text-xs font-semibold text-muted-foreground/80">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};
