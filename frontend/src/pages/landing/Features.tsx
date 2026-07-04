import React from 'react';
import { UserCheck, Calendar, BookOpen, CreditCard, Clock, Library, Bell, ShieldAlert } from 'lucide-react';

export const Features: React.FC = () => {
  const modules = [
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: 'Student Management',
      desc: 'Add, update, search, and delete students. View holistic student profiles, roll assignments, and maintain quick access to medical or contact details.',
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Attendance System',
      desc: 'Quick class sheets for mark-in. Generate monthly attendance percentages, export Excel/CSV reports, and identify chronic absent students.',
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Examination System',
      desc: 'Schedule exams, set maximum/passing grades, record test marks, publish digital report cards, and analyze high/low/average performances.',
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Fee Management',
      desc: 'Set quarterly tuition fees or exam fees for classes. Keep history of cash/UPI payments, track balances, and generate unique receipt numbers.',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Timetable Scheduling',
      desc: 'Configure day schedules, periods, room numbers, teacher loads, and subjects taught to prevent conflicts.',
    },
    {
      icon: <Library className="h-6 w-6" />,
      title: 'Library Management',
      desc: 'Maintain library book database (titles, authors, ISBNs). Record borrow/return transactions, and automatically track daily overdue fines.',
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Announcements Board',
      desc: 'Send targeted notifications (for teachers, parents, students, or administrative staff) with instant dashboard boards.',
    },
    {
      icon: <ShieldAlert className="h-6 w-6" />,
      title: 'Role-Based Authorization',
      desc: 'Granular permissions for Super Admin, Admin, Teacher, Student, and Parent. Tokens expire securely with HTTP-only cookies.',
    },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-16 space-y-16">
      {/* Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">System Modules & Features</h1>
        <p className="text-lg text-muted-foreground">
          VidyaSanchar comes packed with features covering all day-to-day administrative and academic operations.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((m, index) => (
          <div key={index} className="border rounded-xl p-6 bg-card hover:shadow-md transition-all space-y-4">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg">
              {m.icon}
            </div>
            <h3 className="font-bold text-lg">{m.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
