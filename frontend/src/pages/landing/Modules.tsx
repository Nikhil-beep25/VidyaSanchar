import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, Users, HeartHandshake, CalendarCheck, Wallet, GraduationCap, 
  Award, Clock, FileText, Library, Home as HomeIcon, Bus, Briefcase, 
  PackageCheck, FileSpreadsheet, FileCheck2, MessageSquare, BarChart3, 
  ShieldCheck, Settings as SettingsIcon, Search, Filter, Layers, CheckCircle2, 
  X, ArrowRight, Shield, Database, Cpu, Sparkles, Check
} from 'lucide-react';
import { Card } from '../../components/common/Card';

interface ModuleItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  category: 'Core Academics' | 'Staff & HR' | 'Finance & Fees' | 'Operations & Logistics' | 'Governance & Security';
  statBadge: string;
  overview: string;
  functionalities: string[];
  userRoles: string[];
  details: {
    summary: string;
    keyWorkflows: string[];
    dataEntities: string[];
    highlight: string;
  };
}

export const Modules: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalModule, setActiveModalModule] = useState<ModuleItem | null>(null);

  // ALL 20 ERP MODULES - Concise (1-2 sentences, max 4-5 functionalities)
  const allModules: ModuleItem[] = [
    {
      id: 'student-management',
      icon: <UserCheck className="h-7 w-7" />,
      title: 'Student Management',
      category: 'Core Academics',
      statBadge: 'Student Registry',
      overview: 'Centralized registry managing student admissions, profiles, section allocations, and transfer certificates.',
      functionalities: [
        'Bio & Contact Profile Records',
        'Admission Application Processing',
        'Section Allocation & Roll Numbers',
        'Academic History & Grade Tracking',
        'Transfer Certificate (TC) Generation'
      ],
      userRoles: ['Super Admin', 'Admin', 'Teacher'],
      details: {
        summary: 'Central database entity powering academic, fee billing, and attendance operations.',
        keyWorkflows: ['Applicant Screening', 'Section Allocation', 'Promotion Workflow', 'TC Generation'],
        dataEntities: ['Student', 'User', 'Class', 'ParentStudentRelation'],
        highlight: 'Provides centralized student profiling and section mapping.'
      }
    },
    {
      id: 'teacher-management',
      icon: <Users className="h-7 w-7" />,
      title: 'Teacher Management',
      category: 'Staff & HR',
      statBadge: 'Faculty Directory',
      overview: 'Faculty directory for managing subject workload allocations, class teacher duties, and period schedules.',
      functionalities: [
        'Faculty Profiles & Qualifications',
        'Subject & Period Workload Allocation',
        'Class Teacher Duties Mapping',
        'Substitute Duty Log',
        'Roll Call & Marks Entry Access'
      ],
      userRoles: ['Super Admin', 'Admin', 'Teacher'],
      details: {
        summary: 'Organizes faculty allocations and provides direct access to roll calls and marksheets.',
        keyWorkflows: ['Subject Assignment', 'Workload Balancing', 'Substitution Logging', 'Class Delegation'],
        dataEntities: ['Teacher', 'User', 'Subject', 'Class'],
        highlight: 'Provides faculty workload distribution and period tools.'
      }
    },
    {
      id: 'parent-portal',
      icon: <HeartHandshake className="h-7 w-7" />,
      title: 'Parent Portal',
      category: 'Core Academics',
      statBadge: 'Guardian Access',
      overview: 'Guardian portal for viewing student attendance records, exam report cards, fee payments, and notices.',
      functionalities: [
        'Multi-Child Dashboard Switching',
        'Daily Attendance Roster Visibility',
        'Digital Report Card Downloads',
        'Fee Payment & Receipt Downloads',
        'School Announcements & Direct Messages'
      ],
      userRoles: ['Parent'],
      details: {
        summary: 'Gives guardians visibility over student attendance, exam scores, and fee records.',
        keyWorkflows: ['Fee Payment Recording', 'Absence Notification', 'Report Card Download', 'School Notices'],
        dataEntities: ['Parent', 'Student', 'Payment', 'Notice'],
        highlight: 'Gives parents visibility into student attendance, grades, and notices.'
      }
    },
    {
      id: 'attendance',
      icon: <CalendarCheck className="h-7 w-7" />,
      title: 'Attendance System',
      category: 'Core Academics',
      statBadge: 'Attendance Log',
      overview: 'Class roll call interface for recording daily attendance status, student leave, and monthly summary rosters.',
      functionalities: [
        'Class Check-in Roll Calls',
        'Monthly Attendance Summary Grids',
        'Absentee & Late Status Logging',
        'Student Leave Request Approvals',
        'Exportable Attendance Reports'
      ],
      userRoles: ['Admin', 'Teacher', 'Parent'],
      details: {
        summary: 'Automates class roll calls and provides monthly attendance tracking.',
        keyWorkflows: ['Daily Roll Call', 'Absent Marking', 'Monthly Roster Calculation'],
        dataEntities: ['Attendance', 'Student', 'Class'],
        highlight: 'Generates monthly attendance summary grids for classes.'
      }
    },
    {
      id: 'fees',
      icon: <Wallet className="h-7 w-7" />,
      title: 'Fees & Payments',
      category: 'Finance & Fees',
      statBadge: 'Fee Accounting',
      overview: 'Class fee structure setup, student payment processing, digital receipt issuing, and due balance tracking.',
      functionalities: [
        'Class-wise Fee Head Setup',
        'Scholarship & Concession Discounts',
        'Payment Receipting (Cash, Online)',
        'Due Balance & Defaulter Reports',
        'Digital Fee Payment Receipts'
      ],
      userRoles: ['Super Admin', 'Admin', 'Parent'],
      details: {
        summary: 'Fee billing system for tracking tuition fees, receipts, and outstanding balances.',
        keyWorkflows: ['Fee Structure Setup', 'Payment Receipting', 'Defaulter Reporting', 'Balance Audit'],
        dataEntities: ['Fee', 'Payment', 'FeeTransaction', 'Student'],
        highlight: 'Supports fee head mapping and fee payment receipts.'
      }
    },
    {
      id: 'examinations',
      icon: <GraduationCap className="h-7 w-7" />,
      title: 'Examinations',
      category: 'Core Academics',
      statBadge: 'Exam Engine',
      overview: 'Exam schedule creation, grading scale management, subject marksheets, and student pass cards.',
      functionalities: [
        'Exam Schedule Timetables',
        'Subject Mark Entry Portals',
        'Grade Conversion Scale Setup',
        'Seating Plan Allocations',
        'Marksheet & Pass Card Printing'
      ],
      userRoles: ['Super Admin', 'Admin', 'Teacher'],
      details: {
        summary: 'Exam management engine for schedules, subject marks, and report cards.',
        keyWorkflows: ['Schedule Creation', 'Grade Entry', 'Marksheet Verification', 'Report Card Printing'],
        dataEntities: ['Exam', 'Mark', 'Subject', 'Student'],
        highlight: 'Manages subject grade entry and marksheet calculations.'
      }
    },
    {
      id: 'results',
      icon: <Award className="h-7 w-7" />,
      title: 'Results & Analytics',
      category: 'Core Academics',
      statBadge: 'Grade Summaries',
      overview: 'Class topper rankings, subject score medians, pass/fail totals, and downloadable report cards.',
      functionalities: [
        'Class Performance Summaries',
        'Subject Score Medians',
        'Digital Report Card Downloads',
        'Pass / Fail Percentage Charts',
        'Student Performance Trends'
      ],
      userRoles: ['Admin', 'Teacher', 'Student', 'Parent'],
      details: {
        summary: 'Calculates class grade medians, pass/fail totals, and printable progress report cards.',
        keyWorkflows: ['Score Aggregation', 'Report Card PDF Export', 'Subject Analytics Review'],
        dataEntities: ['Mark', 'Exam', 'Student', 'Class'],
        highlight: 'Calculates class grade medians and summary statistics.'
      }
    },
    {
      id: 'timetable',
      icon: <Clock className="h-7 w-7" />,
      title: 'Timetable Scheduling',
      category: 'Operations & Logistics',
      statBadge: 'Scheduling',
      overview: 'Period scheduling matrix, classroom venue mapping, teacher workload distribution, and schedule exports.',
      functionalities: [
        'Period Schedule Matrix',
        'Teacher Workload Distribution',
        'Classroom & Lab Mapping',
        'Substitution Schedule Swap',
        'Class & Teacher Schedule Downloads'
      ],
      userRoles: ['Admin', 'Teacher', 'Student'],
      details: {
        summary: 'Schedules class periods, teacher assignments, and classroom locations.',
        keyWorkflows: ['Period Scheduling', 'Workload Audit', 'Substitution Swap'],
        dataEntities: ['Timetable', 'Teacher', 'Class', 'Subject'],
        highlight: 'Provides weekly timetable matrices for classes and teachers.'
      }
    },
    {
      id: 'homework',
      icon: <FileText className="h-7 w-7" />,
      title: 'Homework & Assignments',
      category: 'Core Academics',
      statBadge: 'Assignment Portal',
      overview: 'Digital assignment feeds, document uploads, student submission tracking, and teacher evaluation.',
      functionalities: [
        'Subject Assignment Feeds',
        'PDF & Document Uploads',
        'Student Submission Tracking',
        'Teacher Evaluation & Feedback',
        'Assignment Due Date Tracking'
      ],
      userRoles: ['Teacher', 'Student', 'Parent'],
      details: {
        summary: 'Streamlines assignment creation, student uploads, and teacher feedback.',
        keyWorkflows: ['Assignment Creation', 'Student Submission', 'Teacher Evaluation'],
        dataEntities: ['Homework', 'HomeworkSubmission', 'Student', 'Teacher'],
        highlight: 'Provides digital assignment management for teachers and students.'
      }
    },
    {
      id: 'library',
      icon: <Library className="h-7 w-7" />,
      title: 'Library System',
      category: 'Operations & Logistics',
      statBadge: 'Book Circulation',
      overview: 'Book cataloging, borrower checkout tracking, return logging, shelf locations, and overdue fines.',
      functionalities: [
        'ISBN, Title & Author Cataloging',
        'Book Checkout & Return Logging',
        'Borrower Quota Controls',
        'Overdue Fine Calculation',
        'Shelf Location Indexing'
      ],
      userRoles: ['Admin', 'Student', 'Teacher'],
      details: {
        summary: 'Manages book cataloging, checkouts, returns, and fine tracking.',
        keyWorkflows: ['Book Cataloging', 'Borrower Checkout', 'Fine Calculation'],
        dataEntities: ['LibraryBook', 'BookIssue', 'Student', 'User'],
        highlight: 'Tracks book availability, borrower records, and due dates.'
      }
    },
    {
      id: 'hostel',
      icon: <HomeIcon className="h-7 w-7" />,
      title: 'Hostel Management',
      category: 'Operations & Logistics',
      statBadge: 'Residential Log',
      overview: 'Residential boarding room inventory, student bed allocations, gate passes, and night roll call logs.',
      functionalities: [
        'Hostel Room & Bed Inventory',
        'Student Room Allocation',
        'Gate Pass Approval Logging',
        'Night Roll Call Check-in Log',
        'Hostel Fee Mapping'
      ],
      userRoles: ['Admin', 'Parent', 'Student'],
      details: {
        summary: 'Residential management for student boarders and room allocations.',
        keyWorkflows: ['Room Allocation', 'Gate Pass Logging', 'Night Roll Call'],
        dataEntities: ['School', 'Student', 'User'],
        highlight: 'Tracks hostel room allocations and student resident records.'
      }
    },
    {
      id: 'transport',
      icon: <Bus className="h-7 w-7" />,
      title: 'Transport Fleet',
      category: 'Operations & Logistics',
      statBadge: 'Fleet Routes',
      overview: 'Vehicle directory, route mapping, driver assignments, pickup stops, and student bus passes.',
      functionalities: [
        'Route & Pickup Stop Directory',
        'Student Bus Stop Mapping',
        'Vehicle Maintenance Logs',
        'Driver Roster & Contacts',
        'Bus Pass Generation'
      ],
      userRoles: ['Admin', 'Parent', 'Student'],
      details: {
        summary: 'Manages bus routes, vehicle records, driver allocations, and student pickup stops.',
        keyWorkflows: ['Route Mapping', 'Student Stop Allocation', 'Maintenance Log'],
        dataEntities: ['Vehicle', 'Route', 'StudentTransport', 'Student'],
        highlight: 'Maps student pickup locations to school transport routes.'
      }
    },
    {
      id: 'hr-payroll',
      icon: <Briefcase className="h-7 w-7" />,
      title: 'HR & Payroll',
      category: 'Staff & HR',
      statBadge: 'Staff Payroll',
      overview: 'Faculty service book repository, staff attendance tracking, leave logs, and monthly salary slip records.',
      functionalities: [
        'Faculty Service Records',
        'Staff Attendance Integration',
        'Leave Balance Management',
        'Salary Calculation Logs',
        'Digital Pay Slip Generation'
      ],
      userRoles: ['Super Admin', 'Admin'],
      details: {
        summary: 'Manages staff profiles, leave records, and monthly salary logs.',
        keyWorkflows: ['Salary Setup', 'Leave Audit', 'Pay Slip Generation'],
        dataEntities: ['User', 'Teacher', 'School'],
        highlight: 'Provides staff payroll and service record tracking.'
      }
    },
    {
      id: 'inventory',
      icon: <PackageCheck className="h-7 w-7" />,
      title: 'Store & Inventory',
      category: 'Operations & Logistics',
      statBadge: 'Asset Index',
      overview: 'School equipment registers, uniform and book store sales, vendor purchase logs, and stock balance audits.',
      functionalities: [
        'Equipment & Asset Registry',
        'Store Item Sales Tracking',
        'Vendor Purchase Records',
        'Department Requisition Logs',
        'Stock Balance Audits'
      ],
      userRoles: ['Admin'],
      details: {
        summary: 'Tracks classroom equipment, school store inventory, and vendor purchases.',
        keyWorkflows: ['Item Requisition', 'Store Sales Entry', 'Stock Audit'],
        dataEntities: ['School'],
        highlight: 'Maintains asset registers and stock balance logs.'
      }
    },
    {
      id: 'admissions',
      icon: <FileSpreadsheet className="h-7 w-7" />,
      title: 'Admissions Pipeline',
      category: 'Core Academics',
      statBadge: 'Intake Pipeline',
      overview: 'Online applicant registrations, document verification checklists, merit ordering, and class section enrollment.',
      functionalities: [
        'Applicant Registration Forms',
        'Document Checklist Verification',
        'Screening Marks Entry',
        'Applicant Merit Ordering',
        'Class Section Enrollment'
      ],
      userRoles: ['Super Admin', 'Admin'],
      details: {
        summary: 'Manages new student intake from application to document verification and enrollment.',
        keyWorkflows: ['Application Intake', 'Document Check', 'Section Enrollment'],
        dataEntities: ['Student', 'User', 'Class'],
        highlight: 'Organizes new student onboarding steps.'
      }
    },
    {
      id: 'certificates',
      icon: <FileCheck2 className="h-7 w-7" />,
      title: 'Certificates & Documents',
      category: 'Governance & Security',
      statBadge: 'Document Issues',
      overview: 'Generate Transfer Certificates (TC), Character Certificates, and Bonafide documents with verification IDs.',
      functionalities: [
        'Transfer Certificates (TC)',
        'Character & Conduct Certificates',
        'Bonafide Student Certificates',
        'Certificate Issue Logs',
        'Verification Reference IDs'
      ],
      userRoles: ['Super Admin', 'Admin'],
      details: {
        summary: 'Generates official school certificates with verification IDs.',
        keyWorkflows: ['TC Request', 'Template Selection', 'Issue Log'],
        dataEntities: ['CertificateIssue', 'Student', 'School'],
        highlight: 'Generates student certificates with verification IDs.'
      }
    },
    {
      id: 'communication',
      icon: <MessageSquare className="h-7 w-7" />,
      title: 'Notice Board & Alerts',
      category: 'Governance & Security',
      statBadge: 'Notice Dispatches',
      overview: 'Targeted circular notices, school announcement feeds, notice board posts, and parent-teacher messaging.',
      functionalities: [
        'Role-Targeted Circular Notices',
        'School Announcement Feeds',
        'Notice Board Pinned Posts',
        'Parent-Teacher Direct Messages',
        'Event Calendar Records'
      ],
      userRoles: ['Super Admin', 'Admin', 'Teacher', 'Parent'],
      details: {
        summary: 'Central hub for school announcements and role-targeted notice dispatches.',
        keyWorkflows: ['Notice Publishing', 'Notice Pinning', 'Direct Messaging'],
        dataEntities: ['Notice', 'Notification', 'Message', 'User'],
        highlight: 'Provides role-targeted notice board dispatches.'
      }
    },
    {
      id: 'reports-analytics',
      icon: <BarChart3 className="h-7 w-7" />,
      title: 'Reports & Analytics',
      category: 'Governance & Security',
      statBadge: 'Academic Reports',
      overview: 'Academic performance summaries, fee collection reports, attendance totals, and exportable data tables.',
      functionalities: [
        'Academic Score Summaries',
        'Fee Collection Reports',
        'Class Attendance Ratios',
        'Financial Income Ledgers',
        'Exportable CSV/PDF Data Tables'
      ],
      userRoles: ['Super Admin', 'Admin'],
      details: {
        summary: 'Provides administrative reports for academic totals, fee ledgers, and attendance.',
        keyWorkflows: ['Academic Review', 'Fee Collection Audit', 'Report Printing'],
        dataEntities: ['Mark', 'Payment', 'Attendance', 'School'],
        highlight: 'Provides exportable report summaries for school administration.'
      }
    },
    {
      id: 'roles-permissions',
      icon: <ShieldCheck className="h-7 w-7" />,
      title: 'User Roles & Security',
      category: 'Governance & Security',
      statBadge: 'Role Security',
      overview: 'Role-Based Access Control (RBAC) permissions for Super Admins, Admins, Teachers, Students, and Parents.',
      functionalities: [
        'Role Authorization Rules',
        'Password Hashing (Bcrypt)',
        'JWT Token Expiration Control',
        'User Account Lock/Unlock',
        'System Audit Logging'
      ],
      userRoles: ['Super Admin'],
      details: {
        summary: 'Controls authorization across API endpoints and UI actions.',
        keyWorkflows: ['Role Assignment', 'Audit Inspection', 'Account Activation'],
        dataEntities: ['User', 'AuditLog', 'School'],
        highlight: 'Enforces role-based authorization rules across the system.'
      }
    },
    {
      id: 'settings',
      icon: <SettingsIcon className="h-7 w-7" />,
      title: 'System Settings',
      category: 'Governance & Security',
      statBadge: 'Master Config',
      overview: 'Master school profile setup, academic terms, grading thresholds, and system preferences.',
      functionalities: [
        'School Profile & Branding Setup',
        'Academic Session Definitions',
        'Grade Scale Threshold Setup',
        'Database Parameter Controls',
        'System Preference Toggles'
      ],
      userRoles: ['Super Admin', 'Admin'],
      details: {
        summary: 'Configuration panel for school parameters and academic term setup.',
        keyWorkflows: ['Academic Year Setup', 'Branding Customization', 'System Toggles'],
        dataEntities: ['School'],
        highlight: 'Provides configuration controls for school administrators.'
      }
    }
  ];

  // Category Filter Pills
  const categories = ['All', 'Core Academics', 'Staff & HR', 'Finance & Fees', 'Operations & Logistics', 'Governance & Security'];

  // Filter Modules by Category and Search Query
  const filteredModules = useMemo(() => {
    return allModules.filter(m => {
      const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.functionalities.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="pb-20 bg-background text-foreground transition-colors duration-300 relative font-sans overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md shadow-sm">
            <Layers className="h-4 w-4 text-primary" />
            <span>ERP System Modules</span>
            <span className="h-3 w-px bg-border" />
            <span className="text-muted-foreground font-medium">20 Functional Components</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight Outfit leading-tight max-w-4xl mx-auto">
            VidyaSanchar <span className="text-gradient-theme">ERP System Modules</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Overview of the 20 functional ERP modules supporting academic, staff, financial, and operational operations.
          </p>
        </div>
      </section>

      {/* SEARCH AND FILTER BAR */}
      <section className="sticky top-20 z-30 bg-background/95 backdrop-blur-md py-6 border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 focus-visible:outline-none ${
                  selectedCategory === cat 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 20 modules..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

        </div>
      </section>

      {/* MODULE CARDS GRID */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex items-center justify-between text-xs text-muted-foreground font-extrabold uppercase tracking-wider">
            <span>Showing {filteredModules.length} of {allModules.length} Modules</span>
            {selectedCategory !== 'All' && <span>Category: {selectedCategory}</span>}
          </div>

          {filteredModules.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border/60 rounded-3xl space-y-3">
              <Search className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
              <p className="text-muted-foreground text-base font-medium">No modules matched your search query.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="text-xs font-bold text-primary underline"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredModules.map((mod) => (
                <motion.div
                  key={mod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full p-6 text-left flex flex-col justify-between border-border/80 hover:border-primary/40 hover:shadow-xl transition-all rounded-2xl bg-card">
                    <div className="space-y-4">
                      
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
                          {mod.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-muted text-muted-foreground font-mono">
                          {mod.statBadge}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-xl Outfit text-foreground mb-1.5">{mod.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium min-h-[40px]">
                          {mod.overview}
                        </p>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-border/40">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                          Main Functionalities:
                        </span>
                        <ul className="space-y-1.5">
                          {mod.functionalities.map((func, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-xs font-semibold text-foreground/90 truncate">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{func}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    <div className="pt-5 border-t border-border/40 mt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {mod.userRoles.slice(0, 2).map((r, i) => (
                          <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            {r}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveModalModule(mod)}
                        className="text-xs font-extrabold text-primary flex items-center gap-1 hover:underline focus-visible:outline-none"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </Card>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* MODULE SPECIFICATION MODAL */}
      <AnimatePresence>
        {activeModalModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalModule(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 space-y-6 text-left my-8"
            >
              <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
                    {activeModalModule.icon}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold Outfit text-foreground">
                      {activeModalModule.title}
                    </h3>
                    <span className="text-xs font-bold text-muted-foreground">
                      Category: {activeModalModule.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalModule(null)}
                  className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-1">Description</h4>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed font-medium">{activeModalModule.details.summary}</p>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">Main Functionalities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeModalModule.functionalities.map((func, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-foreground/90 p-2 rounded-xl bg-muted/40 border border-border/40">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{func}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">User Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModalModule.userRoles.map((role, idx) => (
                      <span key={idx} className="text-xs font-bold px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-primary">Overview Note</h5>
                  <p className="text-xs text-muted-foreground font-medium">{activeModalModule.details.highlight}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 flex justify-end">
                <button
                  onClick={() => setActiveModalModule(null)}
                  className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-95"
                >
                  Close Specification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
