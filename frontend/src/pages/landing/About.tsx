import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, BookOpen, Receipt, Database, Smartphone, Award, Activity, 
  Users, GraduationCap, Calendar, Coins, FileSpreadsheet, Clock, 
  HeartHandshake, BarChart3, ShieldAlert, Bell, Code2, Server, 
  Link2, Globe, Palette, Cloud, Layers, Shield, ArrowRight, ChevronRight 
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { ConnectWithUsSection } from '../../components/layout/footer/ConnectWithUsSection';

// Animated SVG representing the school data network flow
const AnimatedIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[480px] aspect-square mx-auto flex items-center justify-center p-4">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/5 rounded-3xl blur-2xl -z-10" />
      <svg 
        viewBox="0 0 400 400" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full select-none"
        role="img"
        aria-label="VidyaSanchar ERP core student lifecycle management network hub illustration"
      >
        <style>{`
          @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(6px); }
          }
          @keyframes dash {
            to { stroke-dashoffset: -40; }
          }
          .dash-line {
            stroke-dasharray: 8 4;
            animation: dash 2.5s linear infinite;
          }
          .orbit-group {
            transform-origin: 200px 200px;
            animation: orbit 25s linear infinite;
          }
          .orbit-reverse {
            transform-origin: 200px 200px;
            animation: orbit 35s linear infinite reverse;
          }
          .floating-widget {
            animation: float-slow 6s ease-in-out infinite;
          }
          .floating-widget-delayed {
            animation: float-delayed 5s ease-in-out infinite;
          }
        `}</style>

        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-border/30 dark:text-border/10" />
          </pattern>
          <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <filter id="glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" rx="24" className="theme-transition fill-transparent" />

        {/* Outer orbits */}
        <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1.5" className="text-border/40 dark:text-border/10" strokeDasharray="4 4" />
        <circle cx="200" cy="200" r="90" stroke="currentColor" strokeWidth="1.5" className="text-border/40 dark:text-border/10" />

        {/* Dynamic connection lines */}
        <line x1="200" y1="200" x2="100" y2="100" stroke="url(#grad-purple)" strokeWidth="2" className="dash-line" />
        <line x1="200" y1="200" x2="300" y2="100" stroke="url(#grad-blue)" strokeWidth="2" className="dash-line" />
        <line x1="200" y1="200" x2="100" y2="300" stroke="url(#grad-green)" strokeWidth="2" className="dash-line" />
        <line x1="200" y1="200" x2="300" y2="300" stroke="url(#grad-purple)" strokeWidth="2" className="dash-line" />

        {/* Orbiting Tech Nodes */}
        <g className="orbit-group">
          {/* Academic / Book Node */}
          <circle cx="100" cy="100" r="22" fill="url(#grad-purple)" filter="url(#glow)" />
          <path d="M92 95h16v10H92z M95 98h10M95 101h10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Finance / Ledger Node */}
          <circle cx="300" cy="300" r="22" fill="url(#grad-green)" filter="url(#glow)" />
          <path d="M292 295h16v10H292z M296 300l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g className="orbit-reverse">
          {/* User Portal Node */}
          <circle cx="100" cy="300" r="22" fill="url(#grad-blue)" filter="url(#glow)" />
          <path d="M93 306c0-4 3-6 7-6s7 2 7 6M100 297a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Calendar Scheduling Node */}
          <circle cx="300" cy="100" r="22" fill="url(#grad-purple)" filter="url(#glow)" />
          <path d="M292 96h16v10H292z M296 92v4M304 92v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Center Main Core Hub: VidyaSanchar Building */}
        <g className="floating-widget">
          <circle cx="200" cy="200" r="48" fill="var(--card)" stroke="url(#grad-purple)" strokeWidth="3.5" filter="url(#glow)" className="theme-transition" />
          <circle cx="200" cy="200" r="40" fill="url(#grad-purple)" opacity="0.15" />
          <path d="M188 206v-12l12-9 12 9v12h-24z M194 206v-5h4v5h-4z" stroke="url(#grad-purple)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M182 210h36" stroke="url(#grad-purple)" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Floating Card Mockups */}
        <g className="floating-widget" transform="translate(15, -15)">
          <rect x="250" y="140" width="105" height="40" rx="10" fill="var(--card)" stroke="currentColor" strokeWidth="1.5" className="text-border/50 shadow-md theme-transition" />
          <circle cx="270" cy="160" r="9" fill="url(#grad-purple)" opacity="0.2" />
          <circle cx="270" cy="160" r="4" fill="url(#grad-purple)" />
          <rect x="288" y="152" width="50" height="5" rx="2.5" fill="currentColor" className="text-foreground" />
          <rect x="288" y="162" width="30" height="3" rx="1.5" fill="currentColor" className="text-muted-foreground" />
        </g>

        <g className="floating-widget-delayed" transform="translate(-15, 15)">
          <rect x="45" y="210" width="110" height="40" rx="10" fill="var(--card)" stroke="currentColor" strokeWidth="1.5" className="text-border/50 shadow-md theme-transition" />
          <circle cx="65" cy="230" r="9" fill="url(#grad-green)" opacity="0.2" />
          <path d="M62 230l2 2 4-4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="82" y="222" width="55" height="5" rx="2.5" fill="currentColor" className="text-foreground" />
          <rect x="82" y="232" width="35" height="3" rx="1.5" fill="currentColor" className="text-muted-foreground" />
        </g>
      </svg>
    </div>
  );
};

interface StatItem {
  label: string;
  val: number | string;
  target?: number;
  suffix?: string;
  isStatic?: boolean;
}

export const About: React.FC = () => {
  // Stat counter animations
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Open Source', val: 0, target: 100, suffix: '%' },
    { label: 'Cloud Ready', val: 0, target: 24, suffix: '/7' },
    { label: 'Access System', val: 'Multi', isStatic: true },
    { label: 'Architecture', val: 'Scalable', isStatic: true }
  ]);

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const intervalTime = duration / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      setStats(prev =>
        prev.map(stat => {
          if (stat.isStatic || stat.target === undefined) return stat;
          const nextVal = Math.min(
            stat.target,
            Math.round((stat.target / steps) * stepCount)
          );
          return { ...stat, val: nextVal };
        })
      );

      if (stepCount >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const challenges = [
    {
      title: 'Manual Record Keeping',
      description: 'Replace paper documents, ledgers, and notebooks with automated digital workflows.',
      emoji: '📚',
      color: 'from-amber-500/10 to-orange-500/5 hover:border-amber-500/30'
    },
    {
      title: 'Fee Collection Complexity',
      description: 'Collect student fees digitally, generate direct ledgers, and automate alerts.',
      emoji: '💰',
      color: 'from-emerald-500/10 to-green-500/5 hover:border-emerald-500/30'
    },
    {
      title: 'Lack of Centralized Data',
      description: 'Unify isolated student, classroom, grading, and parent logs into one system.',
      emoji: '📊',
      color: 'from-blue-500/10 to-indigo-500/5 hover:border-blue-500/30'
    },
    {
      title: 'Poor Parent Communication',
      description: 'Alert guardians instantly about announcements, fee payments, and attendances.',
      emoji: '📱',
      color: 'from-purple-500/10 to-pink-500/5 hover:border-purple-500/30'
    },
    {
      title: 'Examination Management',
      description: 'Simplify midterm grades entry, automate average marks calculation, and print cards.',
      emoji: '📝',
      color: 'from-rose-500/10 to-red-500/5 hover:border-rose-500/30'
    },
    {
      title: 'Administrative Workload',
      description: 'Reduce repetitive manual tasks for principals, registrars, and support staff.',
      emoji: '🏫',
      color: 'from-cyan-500/10 to-sky-500/5 hover:border-cyan-500/30'
    }
  ];

  const capabilities = [
    {
      title: 'Student Management',
      description: 'Granular student profiles, admission lifecycles, and academic registries.',
      icon: Users,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Teacher Management',
      description: 'Monitor faculty workloads, subject maps, and daily classroom rosters.',
      icon: GraduationCap,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Attendance Tracking',
      description: 'Digitized daily attendance tracking with automated reports and notifications.',
      icon: Calendar,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      title: 'Fee Management',
      description: 'Automated ledger posting, invoice printing, and balance reminders.',
      icon: Coins,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Examination System',
      description: 'Create grading scales, print mark sheets, and audit student performances.',
      icon: FileSpreadsheet,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Timetable Management',
      description: 'Resolve schedule conflicts and coordinate hours for classes and venues.',
      icon: Clock,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Parent Portal',
      description: 'Direct dashboard for parents to view grades, notifications, and fees.',
      icon: HeartHandshake,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Aggregated graphs representing school statistics, balances, and pass rates.',
      icon: BarChart3,
      color: 'text-violet-500 bg-violet-500/10 border-violet-500/20'
    },
    {
      title: 'Role-Based Access Control',
      description: 'Strict JWT-verified dashboards for administrators, staff, and families.',
      icon: ShieldAlert,
      color: 'text-red-500 bg-red-500/10 border-red-500/20'
    },
    {
      title: 'Notifications & Communication',
      description: 'Keep the community informed with real-time news and system notifications.',
      icon: Bell,
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20'
    }
  ];

  const architecture = [
    {
      role: 'Frontend',
      name: 'React + TypeScript',
      desc: 'Highly responsive client application with type safety and interactive panels.',
      icon: Code2,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      role: 'Backend',
      name: 'Node.js + Express',
      desc: 'Fast, secure middleware API endpoint layer routing requests and verified tokens.',
      icon: Server,
      color: 'text-green-500 bg-green-500/10 border-green-500/20'
    },
    {
      role: 'Database',
      name: 'PostgreSQL',
      desc: 'Robust relational database management system supporting double-entry logs.',
      icon: Database,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      role: 'ORM',
      name: 'Prisma',
      desc: 'Automated type-safe database schemas and queries for backend validation.',
      icon: Link2,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      role: 'Deployment',
      name: 'Vercel + Render',
      desc: 'Cloud deployment stack for high availability, automatic deployments, and secure APIs.',
      icon: Globe,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    },
    {
      role: 'Design',
      name: 'Tailwind CSS',
      desc: 'Flexible layout frameworks styling responsive, custom components and dark mode.',
      icon: Palette,
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20'
    }
  ];

  return (
    <div className="layout-container py-8 sm:py-16 space-y-24 relative text-left">
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      <div className="absolute bottom-[20%] left-[-15%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[130px] pointer-events-none dark:block hidden" />

      {/* SECTION 1: ABOUT VIDYASANCHAR */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>About The Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight Outfit text-foreground leading-[1.1]">
            Transforming School <br className="hidden sm:inline" />
            <span className="text-gradient-theme">Management Across India</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-semibold">
            VidyaSanchar ERP is a modern open-source school management platform designed specifically for Indian educational institutions. It simplifies administration, academics, communication, attendance, finance, examinations, and student lifecycle management through a single integrated system.
          </p>
        </div>
        <div className="lg:col-span-5 flex items-center justify-center">
          <AnimatedIllustration />
        </div>
      </section>

      {/* SECTION 2: WHY VIDYASANCHAR EXISTS */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold Outfit text-foreground">
            Built To Solve Real School Challenges
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-semibold">
            Traditional tools are expensive, slow, and hard to customize. Here is how VidyaSanchar bridges the gaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, idx) => (
            <div 
              key={idx}
              className={`group relative overflow-hidden bg-card/65 backdrop-blur-md border border-border/70 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-primary/25 ${challenge.color}`}
            >
              <div className="text-4xl mb-4 select-none filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300 inline-block">
                {challenge.emoji}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                {challenge.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                {challenge.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: PLATFORM CAPABILITIES */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold Outfit text-foreground">
            Platform Capabilities
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-semibold">
            An extensive modular system designed to support every role in your educational ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => {
            const IconComponent = cap.icon;
            return (
              <Card 
                key={idx}
                hoverLift 
                glowOnHover 
                className="bg-card/50 backdrop-blur-md border-border/50 hover:border-primary/30 p-6 flex flex-col items-start text-left space-y-4 group"
              >
                <div className={`p-3 rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${cap.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-extrabold text-foreground group-hover:text-primary transition-colors duration-200">
                    {cap.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: VISION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-card/20 border-y border-border/60 py-12 px-6 sm:px-12 rounded-3xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 pointer-events-none" />
        
        <div className="lg:col-span-6 space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold Outfit text-foreground">
            Empowering Digital Education
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-semibold">
            Our vision is to provide every school in India with access to modern, affordable, and scalable educational technology without expensive licensing costs.
          </p>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6 relative z-10">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-card/75 border border-border/50 p-6 rounded-2xl text-center space-y-1.5 shadow-sm hover:border-primary/20 transition-colors duration-200"
            >
              <h3 className="text-2xl sm:text-3xl font-extrabold text-primary Outfit font-mono leading-none tracking-tight">
                {stat.isStatic ? stat.val : `${stat.val}${stat.suffix}`}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-black uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: TECHNOLOGY FOUNDATION */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold Outfit text-foreground">
            Built With Modern Technologies
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-semibold">
            The reliable software engineering layers driving the VidyaSanchar school management network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {architecture.map((tech, idx) => {
            const IconComponent = tech.icon;
            return (
              <div 
                key={idx}
                className="bg-card/50 backdrop-blur-md border border-border/60 hover:border-primary/30 p-6 rounded-2xl flex flex-col justify-between space-y-6 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                      {tech.role}
                    </span>
                    <div className={`p-2.5 rounded-lg border transition-transform duration-300 group-hover:scale-105 ${tech.color}`}>
                      <IconComponent className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h3 className="text-base sm:text-lg font-extrabold text-foreground group-hover:text-primary transition-colors duration-200">
                      {tech.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {tech.desc}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-3 flex items-center justify-between text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                  <span>Stack Verified</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: CALL TO ACTION */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-tr from-primary/10 via-purple-500/5 to-transparent py-16 px-6 sm:px-12 text-center space-y-8 shadow-xl">
        {/* Glow Spheres */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/10 blur-[90px] pointer-events-none" />
        
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black Outfit tracking-tight text-foreground leading-tight">
            Ready To Modernize <br className="sm:hidden" />
            Your Institution?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto font-medium leading-relaxed">
            Unleash powerful double-entry accounting ledgers, automatic attendances, notice boards, and student databases in minutes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Link 
            to="/contact" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md hover:shadow-lg hover:shadow-primary/10 active:scale-98 group gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link 
            to="/features" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold border border-border bg-card/45 backdrop-blur-sm text-foreground hover:bg-muted/40 transition-all active:scale-98 group gap-1.5"
          >
            <span>View Features</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </section>

      {/* Connect With Us Section */}
      <ConnectWithUsSection />
    </div>
  );
};
