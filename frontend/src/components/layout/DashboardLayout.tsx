import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DashboardFooter } from './footer/DashboardFooter';
import { Avatar } from '../common/Avatar';
import { NotificationBell } from './NotificationBell';
import {
  School,
  Sun,
  Moon,
  LogOut,
  Users,
  Calendar,
  BookOpen,
  CreditCard,
  Clock,
  Library,
  Bell,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  UserCheck,
  X,
  MessageSquare,
  ClipboardList
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Desktop sidebar collapsed state (persisted in localStorage)
  const [desktopCollapsed, setDesktopCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  // Mobile sidebar drawer open state
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Close mobile drawer on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleToggleSidebar = () => {
    const nextState = !desktopCollapsed;
    setDesktopCollapsed(nextState);
    localStorage.setItem('sidebarCollapsed', String(nextState));
  };

  // Get navigation links based on user role
  const getNavLinks = () => {
    const role = user.role;
    switch (role) {
      case 'SUPER_ADMIN':
        return [
          { name: 'Analytics Summary', path: '/dashboard/super-admin', icon: <LayoutDashboard className="h-5 w-5" /> },
          { name: 'User Management', path: '/dashboard/super-admin/users', icon: <Users className="h-5 w-5" /> },
          { name: 'School Branches', path: '/dashboard/super-admin/schools', icon: <School className="h-5 w-5" /> },
          { name: 'System Settings', path: '/dashboard/super-admin/settings', icon: <Settings className="h-5 w-5" /> },
        ];
      case 'ADMIN':
        return [
          { name: 'Admin Summary', path: '/dashboard/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
          { name: 'Students Catalog', path: '/dashboard/admin/students', icon: <Users className="h-5 w-5" /> },
          { name: 'Teachers Directory', path: '/dashboard/admin/teachers', icon: <UserCheck className="h-5 w-5" /> },
          { name: 'Parents Directory', path: '/dashboard/admin/parents', icon: <Users className="h-5 w-5" /> },
          { name: 'Classes & Sections', path: '/dashboard/admin/classes', icon: <School className="h-5 w-5" /> },
          { name: 'Subjects List', path: '/dashboard/admin/subjects', icon: <BookOpen className="h-5 w-5" /> },
          { name: 'Class Attendance', path: '/dashboard/admin/attendance', icon: <Calendar className="h-5 w-5" /> },
          { name: 'Exams & Results', path: '/dashboard/admin/exams', icon: <BookOpen className="h-5 w-5" /> },
          { name: 'Class Timetables', path: '/dashboard/admin/timetables', icon: <Clock className="h-5 w-5" /> },
          { name: 'Tuition Fees', path: '/dashboard/admin/fees', icon: <CreditCard className="h-5 w-5" /> },
          { name: 'Library System', path: '/dashboard/admin/library', icon: <Library className="h-5 w-5" /> },
          { name: 'Notice Board', path: '/dashboard/notices', icon: <Bell className="h-5 w-5" /> },
          { name: 'Chat Messages', path: '/dashboard/messages', icon: <MessageSquare className="h-5 w-5" /> },
          { name: 'System Settings', path: '/dashboard/admin/settings', icon: <Settings className="h-5 w-5" /> },
        ];
      case 'TEACHER':
        return [
          { name: 'Teacher Summary', path: '/dashboard/teacher', icon: <LayoutDashboard className="h-5 w-5" /> },
          { name: 'Class Attendance', path: '/dashboard/teacher/attendance', icon: <Calendar className="h-5 w-5" /> },
          { name: 'Exams & Results', path: '/dashboard/teacher/exams', icon: <BookOpen className="h-5 w-5" /> },
          { name: 'Marks Entry', path: '/dashboard/teacher/marks', icon: <BookOpen className="h-5 w-5" /> },
          { name: 'Schedule Timetable', path: '/dashboard/teacher/timetable', icon: <Clock className="h-5 w-5" /> },
          { name: 'Homework Hub', path: '/dashboard/homework', icon: <ClipboardList className="h-5 w-5" /> },
          { name: 'Notice Board', path: '/dashboard/notices', icon: <Bell className="h-5 w-5" /> },
          { name: 'Chat Messages', path: '/dashboard/messages', icon: <MessageSquare className="h-5 w-5" /> },
        ];
      case 'STUDENT':
        return [
          { name: 'My Dashboard', path: '/dashboard/student', icon: <LayoutDashboard className="h-5 w-5" /> },
          { name: 'Attendance Records', path: '/dashboard/student/attendance', icon: <Calendar className="h-5 w-5" /> },
          { name: 'Exams & Grades', path: '/dashboard/student/grades', icon: <BookOpen className="h-5 w-5" /> },
          { name: 'Fees Statements', path: '/dashboard/student/fees', icon: <CreditCard className="h-5 w-5" /> },
          { name: 'Schedule List', path: '/dashboard/student/timetable', icon: <Clock className="h-5 w-5" /> },
          { name: 'Homework Hub', path: '/dashboard/homework', icon: <ClipboardList className="h-5 w-5" /> },
          { name: 'Notice Board', path: '/dashboard/notices', icon: <Bell className="h-5 w-5" /> },
          { name: 'Chat Messages', path: '/dashboard/messages', icon: <MessageSquare className="h-5 w-5" /> },
        ];
      case 'PARENT':
        return [
          { name: 'Parent Dashboard', path: '/dashboard/parent', icon: <LayoutDashboard className="h-5 w-5" /> },
          { name: 'Child Attendance', path: '/dashboard/parent/attendance', icon: <Calendar className="h-5 w-5" /> },
          { name: 'Child report card', path: '/dashboard/parent/grades', icon: <BookOpen className="h-5 w-5" /> },
          { name: 'Pending Fees', path: '/dashboard/parent/fees', icon: <CreditCard className="h-5 w-5" /> },
          { name: 'Homework Tracker', path: '/dashboard/homework', icon: <ClipboardList className="h-5 w-5" /> },
          { name: 'Notice Board', path: '/dashboard/notices', icon: <Bell className="h-5 w-5" /> },
          { name: 'Chat Messages', path: '/dashboard/messages', icon: <MessageSquare className="h-5 w-5" /> },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      
      {/* 1. Desktop Sidebar */}
      <aside
        className={`border-r bg-card/60 backdrop-blur-md flex flex-col justify-between transition-all duration-300 ease-in-out z-30 sticky top-0 h-screen overflow-hidden ${
          desktopCollapsed ? 'w-20' : 'w-[280px]'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Sidebar Header: height: 72px, centered in collapsed, justified in expanded */}
          <div 
            className={`h-[72px] flex items-center border-b border-border px-4 flex-shrink-0 transition-all duration-300 ${
              desktopCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            {!desktopCollapsed && (
              <NavLink to="/" className="flex items-center space-x-2 animate-in fade-in duration-300">
                <div className="p-1.5 rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                  <School className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  VidyaSanchar
                </span>
              </NavLink>
            )}
            
            <button
              onClick={handleToggleSidebar}
              aria-label={desktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="p-1.5 rounded-lg border bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center justify-center flex-shrink-0"
            >
              {desktopCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Navigation Links: padding-top: 16px, gap: 12px */}
          <nav className="p-3 pt-4 flex flex-col gap-3 flex-grow">
            {navLinks.map((link, idx) => (
              <div key={idx} className="relative group">
                <NavLink
                  to={link.path}
                  end={link.path.endsWith('/dashboard') || link.path === '/dashboard/super-admin' || link.path === '/dashboard/admin' || link.path === '/dashboard/teacher' || link.path === '/dashboard/student' || link.path === '/dashboard/parent'}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    } ${desktopCollapsed ? 'justify-center' : 'space-x-3'}`
                  }
                >
                  <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">{link.icon}</div>
                  {!desktopCollapsed && (
                    <span className="truncate animate-in fade-in slide-in-from-left-2 duration-300">{link.name}</span>
                  )}
                </NavLink>
                
                {/* Tooltip for collapsed state */}
                {desktopCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 rounded-md shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 select-none">
                    {link.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-800" />
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="border-t p-3 space-y-2 bg-card/40 flex-shrink-0">
          <div className={`flex items-center ${desktopCollapsed ? 'justify-center' : 'space-x-3 px-2 py-1'}`}>
            <Avatar imageUrl={user.profileImage} fullName={user.name} role={user.role} size="md" />
            {!desktopCollapsed && (
              <div className="truncate text-left flex-grow animate-in fade-in duration-300">
                <h4 className="font-bold text-xs truncate">{user.name}</h4>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            aria-label="Sign Out"
            className={`w-full flex items-center rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 py-2.5 transition-colors ${
              desktopCollapsed ? 'justify-center' : 'px-3 space-x-3'
            }`}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!desktopCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 animate-in fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 3. Mobile Drawer Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 md:hidden w-[280px] bg-card border-r flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo Brand Header with Close Button: height: 72px */}
          <div className="h-[72px] flex items-center justify-between px-4 border-b border-border flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-2" onClick={() => setMobileOpen(false)}>
              <div className="p-1.5 rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                <School className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                VidyaSanchar
              </span>
            </NavLink>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close Sidebar"
              className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links: padding-top: 16px, gap: 12px */}
          <nav className="p-3 pt-4 flex flex-col gap-3 flex-grow">
            {navLinks.map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                end={link.path.endsWith('/dashboard') || link.path === '/dashboard/super-admin' || link.path === '/dashboard/admin' || link.path === '/dashboard/teacher' || link.path === '/dashboard/student' || link.path === '/dashboard/parent'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                <div className="flex-shrink-0">{link.icon}</div>
                <span className="truncate">{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="border-t p-3 space-y-2 bg-card/45 flex-shrink-0">
          <div className="flex items-center space-x-3 px-2 py-1">
            <Avatar imageUrl={user.profileImage} fullName={user.name} role={user.role} size="md" />
            <div className="truncate text-left flex-grow">
              <h4 className="font-bold text-xs truncate">{user.name}</h4>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                {user.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            aria-label="Sign Out"
            className="w-full flex items-center rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 py-2.5 px-3 space-x-3 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 4. Main viewport */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Header toolbar */}
        <header className="h-[72px] border-b bg-card/45 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open Sidebar"
              className="p-2 rounded-lg hover:bg-accent md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-bold text-lg tracking-tight capitalize hidden sm:block">
              Welcome back, {user.name.split(' ')[0]}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5 text-slate-800" />}
            </button>

            {/* Notification Indicator */}
            <NotificationBell />

            <span className="h-5 w-px bg-border" />
            
            <span className="text-xs font-medium border rounded-full px-3 py-1 bg-muted uppercase tracking-wider select-none">
              {user.role.replace('_', ' ')}
            </span>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-grow p-6 md:p-8 bg-muted/20">
          <Outlet />
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
};
