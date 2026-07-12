import React from 'react';
import { Sparkles, Search, Cpu, CreditCard, MessageSquare, BarChart3, Rocket } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const Journey: React.FC = () => {
  const milestones = [
    {
      year: '2026',
      phase: 'Q1 • Planning',
      title: 'Idea & Research',
      desc: 'Identified challenges faced by Indian schools in attendance, fees, examinations, library management, and parent communication.',
      icon: <Search className="h-5 w-5 text-primary" />,
      badges: ['Research', 'CBSE', 'School ERP', 'Planning']
    },
    {
      year: '2026',
      phase: 'Q2 • Development',
      title: 'Core Platform Development',
      desc: 'Built the foundation of VidyaSanchar ERP including student management, teacher management, classes, attendance, and examination modules.',
      icon: <Cpu className="h-5 w-5 text-primary" />,
      badges: ['React', 'Node.js', 'PostgreSQL', 'Prisma']
    },
    {
      year: '2026',
      phase: 'Q3 • Payments',
      title: 'Financial Management System',
      desc: 'Implemented fees management, online payments, receipts, financial reports, and parent payment tracking.',
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      badges: ['Payments', 'Finance', 'Reports', 'Razorpay']
    },
    {
      year: '2026',
      phase: 'Q3 • Connect',
      title: 'Communication Platform',
      desc: 'Added notices, notifications, messaging, announcements, and parent-school communication tools.',
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      badges: ['Messaging', 'Notifications', 'Parent Portal']
    },
    {
      year: '2026',
      phase: 'Q4 • Insights',
      title: 'Analytics & Reporting',
      desc: 'Developed dashboards, charts, attendance analytics, fee collection analytics, and academic performance reporting.',
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      badges: ['Analytics', 'Reports', 'Charts']
    },
    {
      year: '2026',
      phase: 'Q4 • Release',
      title: 'VidyaSanchar ERP Launch',
      desc: 'Released the first production-ready version of VidyaSanchar ERP for Indian educational institutions.',
      icon: <Rocket className="h-5 w-5 text-primary" />,
      badges: ['Launch', 'Production', 'Open Source']
    }
  ];

  return (
    <div className="layout-container py-6 sm:py-10 space-y-10 relative text-left">
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-[10%] left-[-20%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />

      {/* Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Product Roadmap</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight Outfit text-foreground font-sans">
          VidyaSanchar Product Roadmap
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-semibold">
          The milestones, core developments, and future plans that shaped VidyaSanchar into a premier school ERP.
        </p>
      </section>

      {/* Vertical Timeline Structure */}
      <section className="relative px-2 sm:px-6 max-w-5xl mx-auto">
        {/* Timeline Central Vertical Line */}
        <div className="absolute left-8 sm:left-1/2 top-4 bottom-4 w-0.5 bg-primary/20 -translate-x-1/2 dark:block shadow-[0_0_8px_rgba(168,85,247,0.15)]" />

        <div className="space-y-8 relative z-10">
          {milestones.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={idx}
                className={`flex flex-col sm:flex-row items-stretch w-full relative py-2 ${
                  isEven ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* 1. Date/Year Indicator node: Centered badge in desktop, shifted in mobile */}
                <div className="absolute left-8 sm:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                  <div className="h-12 w-12 rounded-full border-2 border-primary bg-card flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] relative">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary/10 animate-ping" />
                    <span className="text-[10px] font-black text-primary font-mono relative z-10">{item.year}</span>
                  </div>
                </div>

                {/* 2. Content card: Left or Right depending on indices */}
                <div className={`w-full sm:w-[calc(50%-32px)] pl-16 sm:pl-0 reveal ${
                  isEven ? 'sm:pr-8 text-left sm:text-right reveal-left' : 'sm:pl-8 text-left reveal-right'
                }`}>
                  <Card 
                    className="relative group border-border/80 hover:border-primary/30 transition-all duration-300 shadow-sm overflow-hidden h-full card-hover-saas"
                  >
                    <div className="p-5 flex flex-col justify-between h-full min-h-[170px] space-y-4">
                      {/* Milestone Badge/Icon header */}
                      <div className={`flex items-start gap-3.5 ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                        <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/10 flex-shrink-0 text-primary group-hover:scale-110 transition-transform duration-300">
                          <span className="icon-rotate-hover inline-block">
                            {item.icon}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="font-extrabold text-base sm:text-lg Outfit text-foreground leading-tight">
                            {item.title}
                          </h3>
                          <span className="text-[10px] font-bold text-primary/80 uppercase tracking-wider block">
                            {item.phase}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-grow font-medium">
                        {item.desc}
                      </p>

                      {/* Badges */}
                      <div className={`flex flex-wrap gap-1.5 pt-3 border-t border-border/40 ${
                        isEven ? 'sm:justify-end' : 'justify-start'
                      }`}>
                        {item.badges.map((badge) => (
                          <span 
                            key={badge} 
                            className="px-2.5 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-bold text-primary"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* 3. Spacer for desktop alignment */}
                <div className="hidden sm:block w-[calc(50%-32px)]" />

              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
