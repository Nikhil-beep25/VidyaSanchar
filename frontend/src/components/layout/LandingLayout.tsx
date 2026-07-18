import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme, type ThemePreset } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  School, ChevronDown, Palette, Menu, X, 
  Home, Info, Layers, Compass, MessageSquare, HelpCircle, Mail, Lock, Check, Sun, Moon, Sparkles, MapPin, LogIn, Github
} from 'lucide-react';
import { SOCIAL_LINKS } from '../../config/social';
import { Footer } from './footer/Footer';

export const LandingLayout: React.FC = () => {
  const { theme, preset, activeTheme, setThemeMode, setThemePreset } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Appearance Selector states
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [appearanceTimeout, setAppearanceTimeout] = useState<any>(null);

  // Monitor Scroll Offset - Shadow and glass borders appear after scrolling 50px
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Scroll Reveal Intersection Observer Controller
  useEffect(() => {
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
            }
          });
        },
        { 
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px'
        }
      );
      revealElements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 120);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const presetsList = [
    { code: 'purple' as ThemePreset, name: 'Purple', dotColor: 'bg-violet-600' },
    { code: 'blue' as ThemePreset, name: 'Ocean Blue', dotColor: 'bg-blue-500' },
    { code: 'emerald' as ThemePreset, name: 'Emerald', dotColor: 'bg-emerald-500' },
    { code: 'orange' as ThemePreset, name: 'Sunset Orange', dotColor: 'bg-orange-500' },
    { code: 'rose' as ThemePreset, name: 'Rose Pink', dotColor: 'bg-rose-500' },
    { code: 'obsidian' as ThemePreset, name: 'Obsidian', dotColor: 'bg-slate-700 dark:bg-slate-300 border border-border/80' }
  ];

  const handleAppearanceEnter = () => {
    if (appearanceTimeout) clearTimeout(appearanceTimeout);
    setAppearanceOpen(true);
  };

  const handleAppearanceLeave = () => {
    const timeout = setTimeout(() => {
      setAppearanceOpen(false);
    }, 300);
    setAppearanceTimeout(timeout);
  };

  const toggleAppearanceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAppearanceOpen(!appearanceOpen);
  };

  useEffect(() => {
    const closeAll = () => {
      setAppearanceOpen(false);
    };
    window.addEventListener('click', closeAll);
    return () => window.removeEventListener('click', closeAll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-3.5 w-3.5" /> },
    { name: 'Features', path: '/features', icon: <Layers className="h-3.5 w-3.5" /> },
    { name: 'Modules', path: '/features#modules', icon: <Layers className="h-3.5 w-3.5" /> },
    { name: 'Roadmap', path: '/pricing', icon: <Compass className="h-3.5 w-3.5" /> },
    { name: 'Contact', path: '/contact', icon: <Mail className="h-3.5 w-3.5" /> },
  ];

  // Scroll to hash element if it exists in URL
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, location.hash]);

  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Close drawer on Escape keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Focus trap inside the mobile drawer
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalFocusedElement = document.activeElement as HTMLElement;

    // Focus the first focusable element inside the drawer, or the close button
    const focusableElements = drawerRef.current?.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (!drawerRef.current) return;
      const elements = drawerRef.current.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!elements || elements.length === 0) return;

      const firstEl = elements[0] as HTMLElement;
      const lastEl = elements[elements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab: if on first element, wrap to last
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleFocusTrap);

    return () => {
      window.removeEventListener('keydown', handleFocusTrap);
      if (originalFocusedElement) {
        originalFocusedElement.focus();
      }
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative theme-transition font-sans overflow-x-clip">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-25%] left-[-15%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px] pointer-events-none dark:block hidden transition-all duration-500" />
      <div className="absolute top-[25%] right-[-15%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none dark:block hidden transition-all duration-500" />

      {/* Premium Sticky SaaS Navbar */}
      <header 
        className="sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b bg-white/80 dark:bg-[#050816]/80 backdrop-blur-xl border-gray-200/60 dark:border-slate-800/60 shadow-sm theme-transition"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-20 flex items-center justify-between relative navbar-enter">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 group z-10 relative transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
              <div className="p-2 rounded-full bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
                <School className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-base tracking-tight text-[#0F172A] dark:text-[#F9FAFB] leading-none font-sans group-hover:text-primary transition-colors duration-200">
                  VidyaSanchar
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 dark:text-slate-400 uppercase mt-1">
                  School ERP
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Menu (hidden lg:flex) */}
          <nav 
            className="hidden lg:flex items-center gap-1.5 rounded-full border border-gray-200/70 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm px-3 py-1.5 flex-shrink-0 whitespace-nowrap"
            role="navigation" 
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => {
                  const isLinkActive = link.name === 'Modules' 
                    ? location.pathname === '/features' && location.hash === '#modules'
                    : link.name === 'Features'
                      ? location.pathname === '/features' && location.hash !== '#modules'
                      : isActive;
                  return `h-11 flex items-center px-5 rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none ${
                    isLinkActive 
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-md shadow-violet-500/10' 
                      : 'text-gray-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:text-violet-600 dark:hover:text-violet-400'
                  }`;
                }}
              >
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Control Section (GitHub, Theme, Login, Hamburger) */}
          <div className="flex items-center gap-4 z-10 relative flex-shrink-0 flex-nowrap whitespace-nowrap">
            
            {/* GitHub Button (hidden md:flex) */}
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 h-11 px-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-violet-300 dark:hover:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/25 text-xs font-semibold shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:scale-105 hover:shadow-md text-[#334155] dark:text-slate-300 focus-visible:outline-none"
              title="GitHub Repository"
              aria-label="Visit GitHub Profile"
            >
              <Github className="h-4 w-4 text-[#7C3AED] dark:text-purple-400" />
              <span>GitHub</span>
            </a>

            {/* Appearance Selector Button (hidden md:flex) */}
            <div 
              className="relative hidden md:flex"
              onMouseEnter={handleAppearanceEnter}
              onMouseLeave={handleAppearanceLeave}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={toggleAppearanceClick}
                className="inline-flex items-center space-x-1.5 h-11 px-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-violet-300 dark:hover:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/25 text-xs font-semibold shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:scale-[1.02] hover:shadow-md text-[#334155] dark:text-slate-300 focus-visible:outline-none"
                aria-label="Customize Appearance"
              >
                <Palette className="h-3.5 w-3.5 text-[#7C3AED] dark:text-purple-400" />
                <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${appearanceOpen ? 'rotate-180' : ''}`} />
              </button>

              {appearanceOpen && (
                <div className="absolute right-0 mt-2.5 w-60 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left space-y-3.5">
                  
                  {/* SECTION 1: MODE */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B] dark:text-slate-400 px-1 block">
                      Mode
                    </span>
                    <div className="p-0.5 bg-[#F1F5F9]/60 dark:bg-slate-900/60 flex border border-gray-200 dark:border-slate-800 rounded-lg relative">
                      <div 
                        className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800/60 rounded-md shadow-sm transition-all duration-300 ${
                          theme === 'dark' ? 'left-[calc(50%+1px)]' : 'left-[1px]'
                        }`}
                      />
                      <button
                        onClick={() => setThemeMode('light')}
                        className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-all relative z-10 flex items-center justify-center gap-1 ${
                          theme === 'light' ? 'text-[#7C3AED]' : 'text-[#334155] dark:text-slate-400 hover:text-[#7C3AED] dark:hover:text-purple-400'
                        }`}
                      >
                        <Sun className="h-3 w-3" />
                        <span>Light</span>
                      </button>
                      <button
                        onClick={() => setThemeMode('dark')}
                        className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-all relative z-10 flex items-center justify-center gap-1 ${
                          theme === 'dark' ? 'text-[#7C3AED] dark:text-purple-300' : 'text-[#334155] dark:text-slate-400 hover:text-[#7C3AED] dark:hover:text-purple-400'
                        }`}
                      >
                        <Moon className="h-3 w-3" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>

                  {/* SECTION 2: THEME COLORS */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B] dark:text-slate-400 px-1 block">
                      Theme Colors
                    </span>
                    <div className="grid grid-cols-2 gap-1">
                      {presetsList.map((t) => {
                        const isSelected = preset === t.code;
                        return (
                          <button
                            key={t.code}
                            onClick={() => setThemePreset(t.code)}
                            className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all text-left ${
                              isSelected 
                                ? 'bg-[#F3E8FF] dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-300 border-[#7C3AED]/20 shadow-sm' 
                                : 'border-gray-200 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-[#334155] dark:text-slate-400 hover:text-[#7C3AED] dark:hover:text-purple-400 font-medium'
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${t.dotColor} flex-shrink-0`} />
                            <span className="truncate">{t.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Portal Login CTA */}
            {user ? (
              <button
                onClick={() => {
                  if (user.role === 'SUPER_ADMIN') navigate('/dashboard/super-admin');
                  else if (user.role === 'ADMIN') navigate('/dashboard/admin');
                  else if (user.role === 'TEACHER') navigate('/dashboard/teacher');
                  else if (user.role === 'STUDENT') navigate('/dashboard/student');
                  else if (user.role === 'PARENT') navigate('/dashboard/parent');
                }}
                className="flex items-center justify-center h-12 px-6 sm:px-9 rounded-2xl text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/15 dark:shadow-violet-950/20 hover:scale-105 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-violet-500/25 active:scale-[0.98] transition-all duration-300 ease-out z-10 focus-visible:outline-none gap-2"
              >
                <Lock className="h-4 w-4 flex-shrink-0" />
                <span>Dashboard</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center h-12 px-6 sm:px-9 rounded-2xl text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/15 dark:shadow-violet-950/20 hover:scale-105 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-violet-500/25 active:scale-[0.98] transition-all duration-300 ease-out z-10 focus-visible:outline-none gap-2"
              >
                <LogIn className="h-4 w-4 flex-shrink-0" />
                <span>Portal Login</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle (flex lg:hidden) */}
            <button
              ref={hamburgerRef}
              onClick={() => setMobileMenuOpen(true)}
              className="flex lg:hidden items-center justify-center h-11 w-11 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-violet-300 dark:hover:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/25 shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:scale-[1.02] hover:shadow-md text-[#334155] dark:text-slate-300 focus-visible:outline-none"
              aria-label="Open navigation"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (Slides in from the right) */}
      <div 
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Overlay backdrop */}
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        {/* Drawer panel */}
        <div 
          ref={drawerRef}
          className={`fixed top-0 right-0 h-full w-[310px] bg-background/95 dark:bg-[#050816]/95 backdrop-blur-xl border-l border-border/80 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out transform rounded-l-2xl ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <span className="font-extrabold text-base text-gradient-theme">VidyaSanchar ERP</span>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2 rounded-full border border-border hover:bg-violet-55 dark:hover:bg-violet-950/20 hover:text-violet-600 transition-all active:scale-95 text-foreground"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5 overflow-y-auto my-4 flex-grow">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => {
                  const isLinkActive = link.name === 'Modules' 
                    ? location.pathname === '/features' && location.hash === '#modules'
                    : link.name === 'Features'
                      ? location.pathname === '/features' && location.hash !== '#modules'
                      : isActive;
                  return `flex items-center gap-3 h-11 px-4 rounded-xl text-sm font-semibold transition-all duration-300 border border-transparent ${
                    isLinkActive 
                      ? 'text-violet-750 dark:text-purple-300 bg-violet-100 dark:bg-purple-950/40 border-violet-200/50 dark:border-purple-900/30' 
                      : 'text-gray-650 dark:text-slate-300 hover:text-violet-650 dark:hover:text-purple-400 hover:bg-violet-50 dark:hover:bg-violet-950/15'
                  }`;
                }}
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Settings and Actions */}
          <div className="pt-4 border-t border-border/60 space-y-5 overflow-y-auto">
            
            {/* Appearance settings */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B] dark:text-slate-400 px-2 block">
                Appearance Settings
              </span>
              
              {/* Mode Control */}
              <div className="p-1 bg-[#F1F5F9]/60 dark:bg-slate-900/60 flex border border-gray-200 dark:border-slate-800 rounded-2xl relative mx-2">
                <div 
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800/60 rounded-lg shadow-sm transition-all duration-300 ${
                    theme === 'dark' ? 'left-[calc(50%+2px)]' : 'left-[6px]'
                  }`}
                />
                <button
                  onClick={() => setThemeMode('light')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                    theme === 'light' ? 'text-[#7C3AED]' : 'text-[#334155] dark:text-slate-400 hover:text-[#7C3AED] dark:hover:text-purple-400'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                    theme === 'dark' ? 'text-[#7C3AED] dark:text-purple-300' : 'text-[#334155] dark:text-slate-400 hover:text-[#7C3AED] dark:hover:text-purple-400'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  <span>Dark</span>
                </button>
              </div>

              {/* Color Presets */}
              <div className="grid grid-cols-3 gap-1.5 bg-card/60 p-2 rounded-2xl border border-gray-200 dark:border-slate-800 mx-2">
                {presetsList.map((t) => {
                  const isSelected = preset === t.code;
                  return (
                    <button
                      key={t.code}
                      onClick={() => setThemePreset(t.code)}
                      className={`py-2 rounded-xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                        isSelected 
                          ? 'border-[#7C3AED]/20 bg-[#F3E8FF] dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-300' 
                          : 'border-transparent text-[#334155] dark:text-slate-300 hover:text-[#7C3AED]'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${t.dotColor}`} />
                      <span className="text-[9px] font-bold truncate w-full px-1 text-center">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Developer Profile */}
            <div className="flex flex-col space-y-2 px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B] dark:text-slate-400 block mb-0.5">
                Developer Link
              </span>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit GitHub Profile"
                className="w-full inline-flex items-center justify-center space-x-1.5 h-11 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-[#334155] dark:text-slate-355 hover:text-violet-650 dark:hover:text-purple-400 hover:border-violet-300 dark:hover:border-violet-850 active:scale-[0.97] transition-all duration-300"
              >
                <Github className="h-3.5 w-3.5 text-[#7C3AED] dark:text-purple-400" />
                <span>GitHub Portfolio</span>
              </a>
            </div>

            {/* Portal Login CTA */}
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user.role === 'SUPER_ADMIN') navigate('/dashboard/super-admin');
                  else if (user.role === 'ADMIN') navigate('/dashboard/admin');
                  else if (user.role === 'TEACHER') navigate('/dashboard/teacher');
                  else if (user.role === 'STUDENT') navigate('/dashboard/student');
                  else if (user.role === 'PARENT') navigate('/dashboard/parent');
                }}
                className="w-full text-center h-11 text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-95 text-white rounded-2xl shadow-md shadow-violet-300/40 dark:shadow-violet-950/40 transition-all active:scale-[0.97] flex items-center justify-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                Go to Dashboard
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center h-11 py-3 text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-95 text-white rounded-2xl shadow-md shadow-violet-300/40 dark:shadow-violet-950/40 transition-all active:scale-[0.97] flex items-center justify-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5 inline-block mr-1" />
                Portal Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main key={location.pathname} className="flex-grow relative z-10 page-transition-enter">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
