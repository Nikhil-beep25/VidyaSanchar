import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, BookOpen, Clock, Users, ArrowRight, Award, ChevronLeft, ChevronRight, 
  Star, Sparkles, Database, Check, Code, Github, Terminal, Briefcase 
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import heroCampus from '../../assets/images/hero_campus.png';

const CountUp: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ 
  end, 
  duration = 1400, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = progress * (2 - progress); // Ease out quad
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={elementRef}>{count.toLocaleString('en-IN')}{suffix}</span>;
};


export const Home: React.FC = () => {
  // Testimonial Carousel State
  const [activeReview, setActiveReview] = useState(0);
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
  ];

  const handlePrevReview = () => {
    setActiveReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNextReview = () => {
    setActiveReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(handleNextReview, 6000);
    return () => clearInterval(timer);
  }, []);



  const developerSkills = [
    { name: 'Full-Stack React & Node', desc: 'Crafting responsive user interfaces backed by scalable API architectures.' },
    { name: 'Relational Ledgers', desc: 'Designing secure, normalized database tables mapping double-entry accounting.' },
    { name: 'DevOps & Docker Compose', desc: 'Containerizing multi-service stacks, proxy setups, and auto-backup cron jobs.' },
    { name: 'Performance Audits', desc: 'Optimizing SQL query indices, reducing render shifts, and maintaining high SLAs.' }
  ];

  return (
    <div className="space-y-16 pb-16 theme-transition relative">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8">
        {/* Glow Spheres */}
        <div className="absolute top-[20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[130px] animate-pulse-slow pointer-events-none" />
        <div className="absolute top-[10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[130px] animate-pulse-slow pointer-events-none" />

        <div className="layout-container grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-8 text-left z-10 reveal reveal-fade-up">
            {/* Animated Premium Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-[0_0_15px_-3px_hsl(var(--primary)/0.15)] animate-pulse">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>New Release v1.2</span>
              <span className="h-3 w-px bg-border" />
              <span className="text-muted-foreground font-medium">CBSE & State Board Ready</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-sans">
              Transforming Indian Education with{' '}
              <span className="text-gradient-theme font-black">
                Modern Management
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed font-semibold">
              An enterprise-grade, fast, and open-source school ERP built specifically for Indian schools, universities, and coaching institutes. Simplify admissions, attendance, fees, examinations, and library tracking.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-full text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-12 px-8 shadow-md shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] duration-200 btn-saas"
              >
                Book a Free Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition-all border border-border bg-card hover:bg-muted/70 h-12 px-8 backdrop-blur-md btn-saas"
              >
                Explore Modules
              </Link>
            </div>

            {/* Trust Info */}
            <div className="flex items-center space-x-6 pt-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>100% Free Core</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>No Vendor Lock-in</span>
              </div>
            </div>
          </div>
          
          {/* Dashboard Preview Mockup */}
          <div className="lg:col-span-6 relative z-10 w-full animate-float reveal reveal-scale">
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary-light/20 opacity-40 blur-2xl dark:block hidden" />
            <div className="relative border border-border/80 rounded-2xl overflow-hidden shadow-xl bg-card/60 backdrop-blur-md">
              
              {/* macOS Window Title Bar */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/60 bg-background/40">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
                </div>
                <div className="text-[11px] font-bold text-muted-foreground/80 tracking-wide font-mono bg-white/[0.04] px-4 py-0.5 rounded-md border border-border/40">
                  app.vidyasanchar.in
                </div>
                <div className="w-12" /> {/* Spacer */}
              </div>

              {/* Mockup Dashboard Body Container */}
              <div className="relative overflow-hidden">
                <img
                  src={heroCampus}
                  alt="VidyaSanchar Active Campus Hub"
                  className="w-full h-72 sm:h-96 object-cover object-center filter saturate-75 contrast-105"
                />
                
                {/* Floating Glass Indicators */}
                {/* 1. Today's Attendance (Top Left) */}
                <div className="absolute top-4 left-4 p-2.5 sm:p-3 rounded-xl border border-border/80 bg-card/85 backdrop-blur-md shadow-xl flex items-center space-x-2 sm:space-x-3 text-left animate-float">
                  <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg text-emerald-500 border border-emerald-500/20">
                    <Users className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  </div>
                  <div>
                    <h5 className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Attendance</h5>
                    <p className="text-xs sm:text-sm font-black text-foreground mt-0.5">94% Today</p>
                  </div>
                </div>

                {/* 2. CBSE Compliant (Top Right) */}
                <div className="absolute top-4 right-4 p-2.5 sm:p-3 rounded-xl border border-border/80 bg-card/85 backdrop-blur-md shadow-xl flex items-center space-x-2 sm:space-x-3 text-left animate-float" style={{ animationDelay: '1s' }}>
                  <div className="p-1.5 sm:p-2 bg-violet-500/10 rounded-lg text-violet-500 border border-violet-500/20">
                    <Shield className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  </div>
                  <div>
                    <h5 className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Affiliation</h5>
                    <p className="text-xs sm:text-sm font-black text-foreground mt-0.5">CBSE Compliant</p>
                  </div>
                </div>

                {/* 3. Fee Collection (Bottom Left) */}
                <div className="absolute bottom-4 left-4 p-2.5 sm:p-3 rounded-xl border border-border/80 bg-card/85 backdrop-blur-md shadow-xl flex items-center space-x-2 sm:space-x-3 text-left animate-float" style={{ animationDelay: '2s' }}>
                  <div className="p-1.5 sm:p-2 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20 flex items-center justify-center h-7 sm:h-8 w-7 sm:w-8 font-black text-xs sm:text-sm">
                    ₹
                  </div>
                  <div>
                    <h5 className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fees Collected</h5>
                    <p className="text-xs sm:text-sm font-black text-foreground mt-0.5">₹12.5 Lakhs</p>
                  </div>
                </div>

                {/* 4. Active Students (Bottom Right) */}
                <div className="absolute bottom-4 right-4 p-2.5 sm:p-3 rounded-xl border border-border/80 bg-card/85 backdrop-blur-md shadow-xl flex items-center space-x-2 sm:space-x-3 text-left animate-float" style={{ animationDelay: '3s' }}>
                  <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
                    <BookOpen className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  </div>
                  <div>
                    <h5 className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Students</h5>
                    <p className="text-xs sm:text-sm font-black text-foreground mt-0.5">3,250+ Active</p>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="p-5 bg-card/45 border-t border-border/60 flex items-center justify-between text-left">
                <div>
                  <h4 className="font-extrabold text-sm text-foreground font-sans">VidyaSanchar ERP Dashboard</h4>
                  <p className="text-xs text-muted-foreground">Indian School Management Platform</p>
                </div>
                <div className="flex items-center space-x-1.5 text-yellow-600 dark:text-yellow-500 bg-yellow-500/5 px-2.5 py-1 rounded-lg border border-yellow-500/15">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase font-sans">ERP Top Rated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="relative py-12 reveal reveal-fade-up">
        <div className="absolute inset-0 bg-gradient-to-y from-transparent via-primary/[0.01] to-transparent pointer-events-none" />
        <div className="layout-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="border border-border/80 bg-card rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group card-hover-saas">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary font-mono"><CountUp end={120} suffix="+" /></h2>
              <p className="text-xs text-muted-foreground mt-2 font-bold tracking-wide uppercase">Institutions Connected</p>
            </div>

            <div className="border border-border/80 bg-card rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group card-hover-saas">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary font-mono"><CountUp end={50000} suffix="+" /></h2>
              <p className="text-xs text-muted-foreground mt-2 font-bold tracking-wide uppercase">Active Students</p>
            </div>

            <div className="border border-border/80 bg-card rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group card-hover-saas">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary font-mono"><CountUp end={12} suffix="+" /></h2>
              <p className="text-xs text-muted-foreground mt-2 font-bold tracking-wide uppercase">Completed Projects</p>
            </div>

            <div className="border border-border/80 bg-card rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group card-hover-saas">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary font-mono"><CountUp end={45} suffix="+" /></h2>
              <p className="text-xs text-muted-foreground mt-2 font-bold tracking-wide uppercase">GitHub Repositories</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Featured Skills Section */}
      <section className="layout-container py-8 reveal reveal-scale">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
            <span>Specializations</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl Outfit text-foreground">Featured Technical Skills</h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-semibold">
            Core development capabilities backing our software releases and school deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {developerSkills.map((s, idx) => (
            <Card key={idx} className="p-6 text-left border-border/80 flex flex-col justify-between card-hover-saas group">
              <div className="space-y-3">
                <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl border border-primary/20 transition-transform duration-300">
                  <Code className="h-5 w-5 icon-rotate-hover" />
                </div>
                <h4 className="font-extrabold text-base Outfit text-foreground">{s.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{s.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Featured Projects link / callout */}
      <section className="layout-container py-8 reveal reveal-fade-up">
        <div className="border border-border/80 rounded-3xl p-8 bg-card/60 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Active Repositories</span>
            <h3 className="text-xl sm:text-2xl font-extrabold Outfit text-foreground">Flagship Platform & Microservices</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl font-semibold">
              VidyaSanchar ERP is fully open-source. Explore the source repositories, Docker build files, and setup instructions.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center justify-center rounded-full text-xs font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-11 px-6 gap-2 shadow-sm shadow-primary/20 shrink-0 btn-saas"
          >
            <Github className="h-4 w-4" />
            View Projects Portfolio
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. Experience Highlights Timeline Preview */}
      <section className="layout-container py-8 reveal reveal-fade-up">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl Outfit text-foreground">Milestone Highlights</h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-semibold">
            A chronological timeline tracking full stack development, container deployments, and system rollouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <Card className="p-6 border-border/80 flex flex-col justify-between card-hover-saas group">
            <div className="space-y-3">
              <span className="text-[10px] font-black tracking-widest text-primary uppercase font-mono">2026</span>
              <h4 className="font-extrabold text-base Outfit text-foreground">System Architect Certifications</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">Refactored school databases to support active double-entry fee billing ledgers.</p>
            </div>
          </Card>
          
          <Card className="p-6 border-border/80 flex flex-col justify-between card-hover-saas group">
            <div className="space-y-3">
              <span className="text-[10px] font-black tracking-widest text-primary uppercase font-mono">2025</span>
              <h4 className="font-extrabold text-base Outfit text-foreground">Docker DevOps Automation</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">Orchestrated continuous deployment scripts and local database cron backups.</p>
            </div>
          </Card>

          <Card className="p-6 border-border/80 flex flex-col justify-between card-hover-saas group">
            <div className="space-y-3">
              <span className="text-[10px] font-black tracking-widest text-primary uppercase font-mono">2024</span>
              <h4 className="font-extrabold text-base Outfit text-foreground">Launched VidyaSanchar v1.0</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">Deployed open-source campus suites to pilot CBSE institutions in Bharat.</p>
            </div>
          </Card>
        </div>

        <div className="pt-6 text-center">
          <Link to="/journey" className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1.5">
            <span>Explore Complete Engineering Timeline</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 6. Testimonial Carousel Section */}
      <section className="relative py-16 bg-card/25 border-y border-border/60 reveal reveal-fade-up">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.005] to-transparent pointer-events-none" />
        <div className="container max-w-6xl mx-auto px-4 text-center space-y-12">
          
          <div className="space-y-3">
            <span className="text-xs text-primary font-bold uppercase tracking-wider px-3 py-1 border border-primary/20 bg-primary/5 rounded-full">Testimonials</span>
            <h2 className="text-3xl font-extrabold Outfit text-foreground">Trusted by Administrators</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto font-semibold">See how VidyaSanchar is simplifying school management across Bharat.</p>
          </div>

          <Card className="relative max-w-4xl mx-auto min-h-[250px] text-left p-8 md:p-12 shadow-md border-border/80 card-hover-saas group">
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

            <div className="space-y-6">
              <div className="flex items-center space-x-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < reviews[activeReview].rating ? 'fill-yellow-500' : 'text-muted-foreground/30'}`}
                  />
                ))}
              </div>

              <blockquote className="text-base sm:text-xl font-medium leading-relaxed text-foreground/90 italic">
                "{reviews[activeReview].text}"
              </blockquote>

              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <div className="flex items-center space-x-4">
                  <img 
                    src={reviews[activeReview].avatar} 
                    alt={reviews[activeReview].name} 
                    className="h-12 w-12 rounded-full object-cover border border-border/80 bg-slate-900" 
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{reviews[activeReview].name}</h4>
                    <p className="text-xs text-muted-foreground">{reviews[activeReview].role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handlePrevReview}
                    className="p-2 rounded-xl border border-border bg-card hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-all btn-saas"
                    aria-label="Previous Testimonial"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={handleNextReview}
                    className="p-2 rounded-xl border border-border bg-card hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-all btn-saas"
                    aria-label="Next Testimonial"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-center space-x-1.5 pt-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveReview(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeReview === i ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/60'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 7. Call To Action section */}
      <section className="layout-container py-8 reveal reveal-scale">
        <div className="relative border border-primary/20 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-12 md:py-20 text-center space-y-6 shadow-md shadow-primary/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,hsl(var(--primary)/0.12),rgba(255,255,255,0))]" />
          
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl max-w-2xl mx-auto Outfit relative z-10 text-foreground">
            Ready to upgrade your school administration?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed relative z-10 font-semibold">
            Get started with our free demo instance or download the repository to deploy on your own local server.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 pt-4 max-w-xs sm:max-w-md mx-auto">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-full text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-11 px-8 shadow-md shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] duration-200 btn-saas"
            >
              Sign Up For Demo
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition-all border border-border bg-card hover:bg-muted h-11 px-8 btn-saas"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
