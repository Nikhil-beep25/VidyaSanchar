import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Zap, BarChart3, LayoutDashboard, 
  UserCheck, CalendarCheck, Wallet, GraduationCap, MessageSquare, 
  Moon, Lock, Smartphone, Cloud, ArrowRight, ChevronDown, Check, FileSpreadsheet,
  Users, Clock, HelpCircle, Layers
} from 'lucide-react';
import { Card } from '../../components/common/Card';

export const Features: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // 12 FEATURE CATEGORY CARDS - Concise (1-2 sentences, max 3 benefits)
  const featureCategories = [
    {
      icon: <LayoutDashboard className="h-6 w-6 text-violet-500" />,
      title: 'Role-Based Dashboard',
      desc: 'Tailored dashboard views for Super Admins, School Admins, Teachers, Students, and Parents.',
      benefits: ['Role-Specific Interfaces', 'Clean Navigation', 'Fast Data Load'],
      badge: 'User Interface'
    },
    {
      icon: <UserCheck className="h-6 w-6 text-indigo-500" />,
      title: 'Student & Teacher Management',
      desc: 'Centralized records for student admissions, class section assignments, and faculty directories.',
      benefits: ['Student Profiles', 'Section Assignments', 'Faculty Directory'],
      badge: 'Academic Core'
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-emerald-500" />,
      title: 'Grade & Exam Analytics',
      desc: 'Calculate class grade medians, record subject marks, and generate printable report cards.',
      benefits: ['Class Medians', 'Marksheet Entry', 'Report Card Downloads'],
      badge: 'Analytics'
    },
    {
      icon: <CalendarCheck className="h-6 w-6 text-amber-500" />,
      title: 'Attendance System',
      desc: 'Record daily class attendance, track student absentees, and generate monthly rosters.',
      benefits: ['Class Roll Calls', 'Absentee Tracking', 'Monthly Roster Views'],
      badge: 'Attendance'
    },
    {
      icon: <Wallet className="h-6 w-6 text-cyan-500" />,
      title: 'Fee & Payment Tracking',
      desc: 'Manage class tuition fees, issue digital payment receipts, and monitor due balances.',
      benefits: ['Fee Head Setup', 'Payment Receipts', 'Defaulter Tracking'],
      badge: 'Finance'
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-purple-500" />,
      title: 'Examination Management',
      desc: 'Create exam schedules, manage subject grading scales, and print marksheets.',
      benefits: ['Exam Schedules', 'Marksheet Portals', 'Grade Calculations'],
      badge: 'Exams'
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-pink-500" />,
      title: 'Notice Board & Communication',
      desc: 'Publish role-targeted circular notices, school announcements, and parent-teacher messages.',
      benefits: ['Targeted Circulars', 'School Announcements', 'Direct Messaging'],
      badge: 'Communication'
    },
    {
      icon: <Layers className="h-6 w-6 text-blue-500" />,
      title: 'Modular ERP Architecture',
      desc: 'Scalable and decoupled module structures designed for enterprise school operations.',
      benefits: ['Decoupled Modules', 'Scalable Architecture', 'Extensible Design'],
      badge: 'Architecture'
    },
    {
      icon: <Moon className="h-6 w-6 text-slate-400" />,
      title: 'Dark & Light Appearance',
      desc: 'Toggle between dark and light themes with customizable preset color palettes.',
      benefits: ['Theme Switcher', 'System Theme Sync', 'Preset Palettes'],
      badge: 'Theme'
    },
    {
      icon: <Lock className="h-6 w-6 text-rose-500" />,
      title: 'Role Security & Auth',
      desc: 'Role-based access control, JWT session token management, and encrypted password storage.',
      benefits: ['Password Hashing', 'Role Authorization', 'Token Session Control'],
      badge: 'Security'
    },
    {
      icon: <Smartphone className="h-6 w-6 text-teal-500" />,
      title: 'Mobile Responsive Layouts',
      desc: 'Responsive grid layouts designed for smooth navigation across mobile, tablet, and desktop devices.',
      benefits: ['Mobile & Desktop View', 'Touch Friendly UI', 'Responsive Tables'],
      badge: 'Responsive'
    },
    {
      icon: <Cloud className="h-6 w-6 text-sky-500" />,
      title: 'Docker Microservices Stack',
      desc: 'Containerized deployment separating frontend, Express backend, and PostgreSQL database services.',
      benefits: ['Docker Compose Setup', 'Prisma DB Migration', 'Environment Configs'],
      badge: 'Infrastructure'
    }
  ];

  // TRADITIONAL VS VIDYASANCHAR COMPARISON TABLE
  const comparisonRows = [
    {
      feature: 'User Role Dashboards',
      traditional: 'Single shared admin login with manual access control',
      vidyaSanchar: 'Dedicated portals for Admin, Teacher, Student, and Parent roles'
    },
    {
      feature: 'Attendance Management',
      traditional: 'Paper register entry and manual end-of-month tallying',
      vidyaSanchar: 'Digital class check-ins with monthly attendance summary views'
    },
    {
      feature: 'Fee Ledger Tracking',
      traditional: 'Manual receipt books and physical ledger books',
      vidyaSanchar: 'Fee head mapping, payment records, and balance tracking'
    },
    {
      feature: 'Exam & Result Processing',
      traditional: 'Manual marksheet calculation and paper report cards',
      vidyaSanchar: 'Subject mark entry, grade median calculation, and digital report cards'
    },
    {
      feature: 'Communication & Notices',
      traditional: 'Physical circular notices sent via students',
      vidyaSanchar: 'Digital notice board dispatches with audience filtering'
    },
    {
      feature: 'System Security',
      traditional: 'Shared passwords and unencrypted data storage',
      vidyaSanchar: 'JWT token authorization, role permissions, and password hashing'
    }
  ];

  // PERFORMANCE METRICS
  const performanceMetrics = [
    { val: '5', label: 'Role Portals', desc: 'Admin, Teacher, Student, Parent & Super Admin' },
    { val: '20', label: 'ERP Modules', desc: 'Core academic and administrative tools' },
    { val: '100%', label: 'Mobile Responsive', desc: 'Optimized for phone, tablet, and desktop' },
    { val: 'REST', label: 'API Architecture', desc: 'Node.js Express API with Prisma ORM' }
  ];

  // FAQ ITEMS
  const faqs = [
    {
      q: 'Which user roles are supported in VidyaSanchar?',
      a: 'VidyaSanchar supports Super Admin, School Admin, Teacher, Student, and Parent roles. Each role accesses a dedicated dashboard.'
    },
    {
      q: 'How does the fee management module work?',
      a: 'Admins set up class fee structures, record student payments (Cash, Transfer, UPI), and track due balances.'
    },
    {
      q: 'Can VidyaSanchar be deployed locally?',
      a: 'Yes. Docker Compose setups are included to run PostgreSQL, Node.js backend, and React frontend containers locally or in the cloud.'
    },
    {
      q: 'Is VidyaSanchar mobile-friendly?',
      a: 'Yes. The interface is built with responsive grid layouts, making it accessible on smartphones, tablets, and desktops.'
    }
  ];

  return (
    <div className="pb-16 bg-background text-foreground transition-colors duration-300 relative font-sans overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          
          <div className="inline-flex items-center space-x-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>VidyaSanchar Capabilities</span>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight Outfit text-foreground">
              Powerful School ERP Features
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              Explore the key capabilities and administrative tools built into the VidyaSanchar ERP platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/modules"
              className="inline-flex items-center justify-center rounded-full text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-12 px-8 shadow-md gap-2"
            >
              <span>Explore System Modules</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition-all border border-border bg-card hover:bg-muted h-12 px-8 gap-2"
            >
              <span>Contact Developer</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 12 FEATURE CATEGORY CARDS */}
      <section className="py-20 lg:py-28 bg-background border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-primary">
              <Zap className="h-3.5 w-3.5" />
              <span>Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight Outfit text-foreground">
              Core Platform Features
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium">
              Essential administrative, academic, and security capabilities supporting campus operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featureCategories.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                whileHover={{ y: -6 }}
              >
                <Card className="h-full p-6 text-left flex flex-col justify-between border-border/80 hover:border-primary/40 hover:shadow-xl transition-all rounded-2xl bg-card">
                  <div className="space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                        {feat.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-muted text-muted-foreground font-mono">
                        {feat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-xl Outfit text-foreground mb-2">{feat.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium min-h-[40px]">
                        {feat.desc}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-border/40">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                        Key Benefits:
                      </span>
                      <ul className="space-y-1.5">
                        {feat.benefits.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-center space-x-2 text-xs font-semibold text-foreground/90">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-20 lg:py-28 bg-muted/20 dark:bg-slate-900/30 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-primary">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Comparison</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight Outfit text-foreground">
              Traditional Methods vs. VidyaSanchar
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium">
              Comparing manual recordkeeping with digital school management processes.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 shadow-lg bg-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/50">
                  <th className="py-5 px-6 font-extrabold text-sm text-foreground uppercase tracking-wider">Feature</th>
                  <th className="py-5 px-6 font-extrabold text-sm text-muted-foreground uppercase tracking-wider">Traditional Methods</th>
                  <th className="py-5 px-6 font-extrabold text-sm text-primary uppercase tracking-wider">VidyaSanchar Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs sm:text-sm font-medium">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-foreground">{row.feature}</td>
                    <td className="py-4 px-6 text-muted-foreground">{row.traditional}</td>
                    <td className="py-4 px-6 text-foreground font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{row.vidyaSanchar}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* METRICS */}
      <section className="py-20 lg:py-28 bg-background border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {performanceMetrics.map((m, idx) => (
              <Card key={idx} className="p-8 border-border/80 bg-card rounded-2xl space-y-2">
                <span className="text-3xl sm:text-4xl font-black text-primary font-mono block">{m.val}</span>
                <h4 className="font-extrabold text-sm sm:text-base text-foreground font-sans">{m.label}</h4>
                <p className="text-xs text-muted-foreground font-medium">{m.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 lg:py-28 bg-muted/20 dark:bg-slate-900/30 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight Outfit text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4 text-left">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <Card 
                  key={idx} 
                  className="border-border/80 bg-card rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-extrabold text-base sm:text-lg text-foreground focus-visible:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-primary shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium border-t border-border/40 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative border border-primary/25 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-12 md:py-16 text-center space-y-6 shadow-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto Outfit text-foreground">
              Explore All 20 ERP System Modules
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed font-medium">
              Review module listings and specifications across administrative and academic components.
            </p>
            <div className="pt-4">
              <Link
                to="/modules"
                className="inline-flex items-center justify-center rounded-full text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-12 px-8 shadow-md gap-2"
              >
                <span>View System Modules</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
