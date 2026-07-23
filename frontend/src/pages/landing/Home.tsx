import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, LayoutDashboard, CalendarCheck, CreditCard, GraduationCap, Clock, 
  BarChart3, MessageSquare, Globe, Sparkles, ArrowRight, Github, Code, School, 
  CheckCircle2, Terminal, Zap, Layers, Activity, Users, UserCheck, HeartHandshake,
  Wallet, Library, Bus, Home as HomeIcon, Briefcase
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { SOCIAL_LINKS } from '../../config/social';
import heroCampus from '../../assets/images/hero_campus.png';

export const Home: React.FC = () => {
  const developerSkills = [
    { name: 'Full-Stack React & Node', desc: 'Crafting responsive user interfaces backed by RESTful API endpoints.' },
    { name: 'Relational Database Schema', desc: 'Designing normalized PostgreSQL tables with Prisma ORM data modeling.' },
    { name: 'DevOps & Docker Setup', desc: 'Containerizing multi-service stacks for development and deployment.' },
    { name: 'Role-Based Access Control', desc: 'Implementing JWT authentication with role-based routing for 5 user roles.' }
  ];

  const featuredHighlights = [
    {
      icon: <CalendarCheck className="h-6 w-6 text-amber-500" />,
      title: 'Attendance & Scheduling',
      desc: 'Class check-ins, monthly attendance records, and timetable period assignments.',
      link: '/features'
    },
    {
      icon: <Wallet className="h-6 w-6 text-violet-500" />,
      title: 'Fee Management & Payments',
      desc: 'Class fee head setup, payment tracking, payment receipts, and balance tracking.',
      link: '/features'
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-emerald-500" />,
      title: 'Examinations & Marks',
      desc: 'Exam schedule publishing, subject mark entry, progress report cards, and grade distributions.',
      link: '/features'
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
      title: 'Role-Based Authorization',
      desc: 'Role-based access matrix for Super Admin, Admin, Teacher, Student, and Parent roles.',
      link: '/features'
    }
  ];

  const erpModuleTeasers = [
    { name: 'Student Management', icon: <UserCheck className="h-5 w-5 text-violet-500" />, desc: 'Student profiles, admissions, and class section assignments' },
    { name: 'Teacher Management', icon: <Users className="h-5 w-5 text-indigo-500" />, desc: 'Faculty directory, subject allocations, and schedules' },
    { name: 'Parent Portal', icon: <HeartHandshake className="h-5 w-5 text-pink-500" />, desc: 'Guardian access to student progress, fees, and notices' },
    { name: 'Attendance System', icon: <CalendarCheck className="h-5 w-5 text-amber-500" />, desc: 'Daily roll call, monthly rosters, and attendance reports' },
    { name: 'Fee Management', icon: <Wallet className="h-5 w-5 text-emerald-500" />, desc: 'Fee head setup, payment transactions, and receipts' },
    { name: 'Exams & Grades', icon: <GraduationCap className="h-5 w-5 text-purple-500" />, desc: 'Exam schedules, marksheets, and report card downloads' }
  ];

  return (
    <div className="pb-16 bg-background text-foreground transition-colors duration-300 relative theme-transition font-sans overflow-x-hidden">
      
      {/* 
        ============================================================
        1. HERO SECTION
        ============================================================
      */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24">
        {/* Ambient Glow Spheres */}
        <div className="absolute top-[10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-primary/10 blur-[130px] pointer-events-none dark:block hidden" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px] pointer-events-none dark:block hidden" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 sm:space-y-8 text-left z-10"
          >
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>VidyaSanchar School ERP</span>
              <span className="h-3 w-px bg-border" />
              <span className="text-muted-foreground font-medium">Open Source Prototype</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-sans text-foreground">
                VidyaSanchar
              </h1>
              <span className="block text-gradient-theme font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Open-Source School ERP Platform
              </span>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed font-medium">
              A School ERP prototype developed with React, TypeScript, Node.js, Express, PostgreSQL, and Prisma ORM. Designed for academic record management, attendance tracking, fee billing, and user role authorization.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                to="/features"
                className="inline-flex items-center justify-center rounded-full text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-12 px-8 shadow-md hover:shadow-lg active:scale-[0.98] duration-200 btn-saas gap-2"
              >
                Platform Features
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/modules"
                className="inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition-all border border-border bg-card/80 hover:bg-muted/80 h-12 px-7 backdrop-blur-md btn-saas gap-2"
              >
                <Layers className="h-4 w-4 text-primary" />
                ERP Modules
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition-all border border-border bg-card/50 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-300 h-12 px-6 backdrop-blur-md text-foreground btn-saas gap-2"
              >
                Demo Login
              </Link>
            </div>

            {/* Factual Info Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>MIT Licensed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Docker Setup Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Role-Based Authorization</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Dashboard Preview Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative z-10 w-full p-2 sm:p-4 lg:p-6"
          >
            <div className="relative border border-border/80 rounded-3xl overflow-hidden shadow-2xl bg-card/70 backdrop-blur-xl transition-all duration-300">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-background/50">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm" />
                </div>
                <div className="text-[11px] font-bold text-muted-foreground/90 tracking-wide font-mono bg-muted/40 px-4 py-1 rounded-full border border-border/50 flex items-center gap-1.5">
                  <Terminal className="h-3 w-3 text-primary" />
                  <span>vidyasanchar.app/dashboard</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Preview Image */}
              <div className="relative overflow-hidden group">
                <img
                  src={heroCampus}
                  alt="VidyaSanchar Dashboard Interface Preview"
                  className="w-full h-80 sm:h-[420px] object-cover object-center filter saturate-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />
                
                {/* Information Badge */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto inline-flex items-center space-x-3 px-5 py-3 rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-xl">
                  <div className="p-2 bg-primary/15 rounded-xl text-primary flex items-center justify-center">
                    <School className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-extrabold text-foreground font-sans leading-none">
                      VidyaSanchar ERP Prototype
                    </h5>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">
                      Multi-Role Academic Application
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 bg-card/60 border-t border-border/60 flex items-center justify-between text-left">
                <div>
                  <h4 className="font-extrabold text-sm text-foreground font-sans">Full-Stack Application</h4>
                  <p className="text-xs text-muted-foreground">React 18 • TypeScript • Node.js • Prisma</p>
                </div>
                <div className="flex items-center space-x-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                  <Code className="h-4 w-4" />
                  <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase font-sans">Open Source</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* 
        ============================================================
        2. SECTION 1: PLATFORM CAPABILITIES
        ============================================================
      */}
      <section className="py-20 lg:py-28 bg-muted/20 dark:bg-slate-900/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-primary">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Platform Overview</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight Outfit text-foreground">
              Core Technical Capabilities
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium">
              Implemented features supporting academic administration, student records, fee tracking, and user role management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredHighlights.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <Card className="h-full p-6 text-left flex flex-col justify-between border-border/80 hover:border-primary/40 hover:shadow-xl transition-all rounded-2xl bg-card">
                  <div className="space-y-3">
                    <div className="p-3.5 bg-primary/10 w-fit rounded-2xl border border-primary/20">
                      {feat.icon}
                    </div>
                    <h3 className="font-extrabold text-lg text-foreground Outfit">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">{feat.desc}</p>
                  </div>

                  <Link
                    to={feat.link}
                    className="mt-6 flex items-center justify-between text-xs font-extrabold text-primary pt-3 border-t border-border/40 hover:underline"
                  >
                    <span>View Features</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/features"
              className="inline-flex items-center justify-center rounded-full text-xs font-extrabold tracking-wider uppercase px-8 py-3.5 bg-primary text-primary-foreground hover:opacity-95 shadow-sm gap-2"
            >
              <span>View All Implemented Features</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 
        ============================================================
        3. SECTION 2: ERP MODULES OVERVIEW
        ============================================================
      */}
      <section className="py-20 lg:py-28 bg-background border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-primary">
              <Layers className="h-3.5 w-3.5" />
              <span>Module Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight Outfit text-foreground">
              Implemented ERP Modules
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium">
              Functional components designed for administrators, teachers, students, and parent roles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {erpModuleTeasers.map((mod, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 text-left border-border/80 hover:border-primary/40 hover:shadow-lg transition-all rounded-2xl bg-card h-full flex items-start gap-4">
                  <div className="p-3 bg-muted rounded-2xl border border-border/60 shrink-0">
                    {mod.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base Outfit text-foreground">{mod.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">{mod.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/modules"
              className="inline-flex items-center justify-center rounded-full text-xs font-extrabold tracking-wider uppercase px-8 py-3.5 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all gap-2"
            >
              <span>Explore All Functional Modules</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 
        ============================================================
        4. TECHNICAL SPECIALIZATIONS / SKILLS
        ============================================================
      */}
      <section className="py-20 lg:py-28 bg-muted/20 dark:bg-slate-900/30 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-primary">
              <Code className="h-3.5 w-3.5" />
              <span>Technology Stack</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight Outfit text-foreground">
              Technical Implementation Details
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium">
              Software engineering patterns and libraries utilized across the codebase.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {developerSkills.map((s, idx) => (
              <Card key={idx} className="p-6 text-left border-border/80 flex flex-col justify-between card-hover-saas group rounded-2xl h-full">
                <div className="space-y-3">
                  <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl border border-primary/20">
                    <Code className="h-5 w-5" />
                  </div>
                  <h4 className="font-extrabold text-base Outfit text-foreground">{s.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">{s.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ============================================================
        5. CALL TO ACTION SECTION
        ============================================================
      */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative border border-primary/25 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-12 md:py-16 text-center space-y-6 shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,hsl(var(--primary)/0.15),rgba(255,255,255,0))]" />
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto Outfit relative z-10 text-foreground">
              Explore VidyaSanchar Source Code & Demo
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed relative z-10 font-semibold">
              Test prototype logins for Super Admin, Admin, Teacher, Student, and Parent roles or review source code on GitHub.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 pt-4 max-w-xs sm:max-w-md mx-auto">
              <Link
                to="/features"
                className="inline-flex items-center justify-center rounded-full text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-12 px-8 shadow-md active:scale-[0.98] duration-200 btn-saas"
              >
                Platform Features
              </Link>
              <Link
                to="/modules"
                className="inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition-all border border-border bg-card/80 hover:bg-muted/80 h-12 px-8 backdrop-blur-md btn-saas"
              >
                System Modules
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
