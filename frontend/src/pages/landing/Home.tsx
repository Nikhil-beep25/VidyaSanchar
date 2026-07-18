import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, BookOpen, Clock, Users, ArrowRight, Sparkles, Database, Code, Github, Terminal, Briefcase, Linkedin, School
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { SOCIAL_LINKS } from '../../config/social';
import heroCampus from '../../assets/images/hero_campus.png';

export const Home: React.FC = () => {
  const developerSkills = [
    { name: 'Full-Stack React & Node', desc: 'Crafting responsive user interfaces backed by scalable API architectures.' },
    { name: 'Relational Ledgers', desc: 'Designing secure, normalized database tables mapping double-entry accounting.' },
    { name: 'DevOps & Docker Compose', desc: 'Containerizing multi-service stacks, proxy setups, and auto-backup cron jobs.' },
    { name: 'Performance Audits', desc: 'Optimizing SQL query indices, reducing render shifts, and maintaining high SLAs.' }
  ];

  return (
    <div className="pb-16 bg-background text-foreground transition-colors duration-300 relative theme-transition font-sans">
      
      {/* 1. Hero Section (24px pt from navbar) */}
      <section className="relative overflow-hidden pt-6">
        {/* Glow Spheres */}
        <div className="absolute top-[20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[130px] pointer-events-none dark:block hidden" />
        <div className="absolute top-[10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[130px] pointer-events-none dark:block hidden" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8 text-left z-10 reveal reveal-fade-up">
            {/* Animated Project Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-[0_0_15px_-3px_hsl(var(--primary)/0.15)]">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Project Status: Prototype</span>
              <span className="h-3 w-px bg-border" />
              <span className="text-muted-foreground font-medium">Open Source</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-sans">
              VidyaSanchar
              <span className="block text-gradient-theme font-black text-3xl sm:text-4xl lg:text-5xl mt-2">
                Modern School ERP Prototype
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed font-medium">
              VidyaSanchar is a modern School ERP prototype built to demonstrate full-stack software engineering using React, TypeScript, Node.js, PostgreSQL, and Prisma.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-12 px-8 shadow-md shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] duration-200 btn-saas"
              >
                Try Live Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition-all border border-border bg-card hover:bg-muted/70 h-12 px-8 backdrop-blur-md btn-saas"
              >
                View Roadmap
              </Link>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit GitHub Profile"
                className="inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition-all border border-border bg-card/45 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-300 h-12 px-6 backdrop-blur-md text-foreground btn-saas gap-2"
              >
                <Github className="h-4 w-4 text-[#7C3AED] dark:text-purple-400" />
                <span>View GitHub</span>
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit LinkedIn Profile"
                className="inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition-all border border-border bg-card/45 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-300 h-12 px-6 backdrop-blur-md text-foreground btn-saas gap-2"
              >
                <Linkedin className="h-4 w-4 text-[#7C3AED] dark:text-purple-400" />
                <span>Connect on LinkedIn</span>
              </a>
            </div>

            {/* Factual Info */}
            <div className="flex items-center space-x-6 pt-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>MIT Licensed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Dockerized Architecture</span>
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
                  github.com/VidyaSanchar
                </div>
                <div className="w-12" />
              </div>

              {/* Mockup Dashboard Body Container */}
              <div className="relative overflow-hidden">
                <img
                  src={heroCampus}
                  alt="VidyaSanchar Active Campus Hub"
                  className="w-full h-72 sm:h-96 object-cover object-center filter saturate-75 contrast-105"
                />
                
                {/* Subtle Glassmorphism Badge */}
                <div className="absolute bottom-4 left-4 inline-flex items-center space-x-2.5 px-4 py-2 rounded-full border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-950/75 backdrop-blur-md shadow-lg animate-float">
                  <div className="p-1.5 bg-[#7C3AED]/10 dark:bg-purple-400/10 rounded-full text-[#7C3AED] dark:text-purple-400 flex items-center justify-center">
                    <School className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-extrabold tracking-wide text-foreground font-sans">
                    VidyaSanchar School ERP
                  </span>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="p-5 bg-card/45 border-t border-border/60 flex items-center justify-between text-left">
                <div>
                  <h4 className="font-extrabold text-sm text-foreground font-sans">VidyaSanchar Project Prototype</h4>
                  <p className="text-xs text-muted-foreground">Full-Stack Architecture Showcase</p>
                </div>
                <div className="flex items-center space-x-1.5 text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/15">
                  <Code className="h-4 w-4" />
                  <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase font-sans">Open Source</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. True Project Highlights (48px margin-top, 64px margin-bottom) */}
      <section className="relative mt-12 mb-16 reveal reveal-fade-up">
        <div className="absolute inset-0 bg-gradient-to-y from-transparent via-primary/[0.01] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Card className="p-6 text-left border-border/80 flex flex-col justify-between card-hover-saas group">
              <div className="space-y-3">
                <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl border border-primary/20">
                  <Code className="h-5 w-5" />
                </div>
                <h4 className="font-extrabold text-base Outfit text-foreground">Modern Tech Stack</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">React • TypeScript • Node.js • PostgreSQL • Prisma</p>
              </div>
            </Card>

            <Card className="p-6 text-left border-border/80 flex flex-col justify-between card-hover-saas group">
              <div className="space-y-3">
                <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl border border-primary/20">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h4 className="font-extrabold text-base Outfit text-foreground">Core Modules</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">Students, Teachers, Attendance, Fees & Examinations</p>
              </div>
            </Card>

            <Card className="p-6 text-left border-border/80 flex flex-col justify-between card-hover-saas group">
              <div className="space-y-3">
                <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl border border-primary/20">
                  <Shield className="h-5 w-5" />
                </div>
                <h4 className="font-extrabold text-base Outfit text-foreground">Authentication</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">Secure login with role-based access architecture</p>
              </div>
            </Card>

            <Card className="p-6 text-left border-border/80 flex flex-col justify-between card-hover-saas group">
              <div className="space-y-3">
                <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl border border-primary/20">
                  <Clock className="h-5 w-5" />
                </div>
                <h4 className="font-extrabold text-base Outfit text-foreground">Project Status</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">Open-source prototype under active development</p>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* 3. Featured Skills Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 reveal reveal-scale">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 reveal reveal-fade-up">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 reveal reveal-fade-up">
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

      {/* 6. Call To Action section (64px padding bottom / footer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 reveal reveal-scale">
        <div className="relative border border-primary/20 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-12 md:py-16 text-center space-y-6 shadow-md shadow-primary/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,hsl(var(--primary)/0.12),rgba(255,255,255,0))]" />
          
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl max-w-2xl mx-auto Outfit relative z-10 text-foreground">
            Explore the Codebase & Roadmap
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed relative z-10 font-semibold">
            VidyaSanchar is open source. You can view the full repository on GitHub, check out the roadmap, or test the prototype modules.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 pt-4 max-w-xs sm:max-w-md mx-auto">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-full text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-11 px-8 shadow-md shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] duration-200 btn-saas"
            >
              View Roadmap
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition-all border border-border bg-card hover:bg-muted h-11 px-8 btn-saas"
            >
              Contact / Feedback
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
