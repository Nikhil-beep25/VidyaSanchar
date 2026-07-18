import React from 'react';
import { CheckCircle2, Clock, Calendar, ArrowRight, Sparkles, Code, Shield, BookOpen, Layers } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const Pricing: React.FC = () => {
  const phases = [
    {
      title: 'Phase 1: Foundation & RBAC',
      status: 'Completed',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      icon: <Shield className="h-5 w-5 text-purple-500" />,
      desc: 'Base architecture setup and identity access control.',
      items: [
        'User Authentication & Session Management',
        'Role-Based Access Control (RBAC) Architecture',
        'Custom Dashboards for 5 user types (Admin, Teacher, etc.)',
        'Responsive layout system with dark mode presets',
      ],
    },
    {
      title: 'Phase 2: Academic Core',
      status: 'Completed',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      icon: <BookOpen className="h-5 w-5 text-purple-500" />,
      desc: 'Fundamental school organization and records management.',
      items: [
        'Student, Teacher & Parent directory structures',
        'Classrooms & section mapping schemas',
        'Daily attendance registers & report worksheets',
        'Profile editing and contact update portals',
      ],
    },
    {
      title: 'Phase 3: Administrative Modules',
      status: 'Active',
      statusColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      icon: <Layers className="h-5 w-5 text-purple-500" />,
      desc: 'Expanding operations with administrative utilities.',
      items: [
        'Examination schedules & grade assessment engines',
        'Digital report cards and marksheets export',
        'Tuition fee ledger records & payment receipts',
        'Notice board notices & global school broadcasts',
      ],
    },
    {
      title: 'Phase 4: Advanced Extensions',
      status: 'Planned',
      statusColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      desc: 'Future releases scheduled for development.',
      items: [
        'Transport route & vehicle allocation tracking',
        'Hostel & dormitory room mapping ledgers',
        'Multi-branch school group architecture',
        'Automated REST API database export utilities',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 relative text-left">
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      <div className="absolute top-[40%] right-[-15%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />

      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Development Status</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight Outfit text-foreground">Project Roadmap</h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          VidyaSanchar is an open-source School ERP prototype under active development. Below is the roadmap tracking completed modules and planned future releases.
        </p>
      </section>

      {/* Roadmap Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {phases.map((phase, index) => (
          <Card
            key={index}
            hoverLift
            className="flex flex-col justify-between p-8 border-border/80 relative theme-transition bg-card/60 backdrop-blur-md"
          >
            <div className="space-y-6">
              {/* Card Title & Status Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                    {phase.icon}
                  </div>
                  <h3 className="font-extrabold text-lg sm:text-xl Outfit text-foreground leading-tight">{phase.title}</h3>
                </div>
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${phase.statusColor}`}>
                  {phase.status}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {phase.desc}
              </p>

              {/* Items list */}
              <ul className="space-y-3.5 text-xs sm:text-sm border-t border-border/50 pt-5">
                {phase.items.map((item, fIdx) => (
                  <li key={fIdx} className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </section>

      {/* Repository Info Callout */}
      <section className="relative border border-primary/20 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-10 text-center space-y-6 shadow-md shadow-primary/5 max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,hsl(var(--primary)/0.08),rgba(255,255,255,0))]" />
        
        <h2 className="text-2xl font-extrabold tracking-tight Outfit relative z-10 text-foreground">
          Contributing & Setup Instructions
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto relative z-10 font-semibold">
          Want to deploy this prototype locally or run the test suite? The repository contains a complete Docker Compose environment, database seeds, and environment templates.
        </p>
        
        <div className="relative z-10 pt-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full text-xs font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-11 px-8 shadow-md shadow-primary/20 gap-2 btn-saas"
          >
            <Code className="h-4 w-4" />
            Clone Repository from GitHub
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
};
