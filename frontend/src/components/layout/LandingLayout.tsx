import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme, type ThemePreset } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  School, ChevronDown, Palette, Menu, X, 
  Home, Info, Layers, Compass, MessageSquare, HelpCircle, Mail, Lock, Check, Sun, Moon, Sparkles, MapPin, LogIn, Github, Linkedin, Globe
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
  const [language, setLanguage] = useState('English (US)');
  const [langOpen, setLangOpen] = useState(false);

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
      setLangOpen(false);
    };
    window.addEventListener('click', closeAll);
    return () => window.removeEventListener('click', closeAll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-3.5 w-3.5" /> },
    { name: 'Features', path: '/features', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { name: 'Modules', path: '/modules', icon: <Layers className="h-3.5 w-3.5" /> },
    { name: 'Roadmap', path: '/roadmap', icon: <Compass className="h-3.5 w-3.5" /> },
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

    const getFocusableElements = () => {
      if (!drawerRef.current) return [];
      return Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);
    const timer = setTimeout(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleTabKey);
      clearTimeout(timer);
      if (originalFocusedElement && typeof originalFocusedElement.focus === 'function') {
        originalFocusedElement.focus();
      }
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative theme-transition font-sans overflow-x-clip">
      
      {/* Premium Sticky SaaS Navbar */}
      <header className="sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b bg-white/80 dark:bg-[#050816]/80 backdrop-blur-xl border-gray-200/60 dark:border-slate-800/60 shadow-sm theme-transition">
        
        {/* Dynamic Gradient Top Accent Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

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
                className={({ isActive }) => 
                  `h-11 flex items-center px-5 rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none ${
                    isActive 
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-md shadow-violet-500/10' 
                      : 'text-gray-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:text-violet-600 dark:hover:text-violet-400'
                  }`
                }
              >
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Control Section (GitHub, Theme, Login, Hamburger) */}
          <div className="flex items-center gap-2.5 md:gap-3 lg:gap-4 z-10 relative flex-shrink-0 flex-nowrap whitespace-nowrap">
            
            {/* GitHub Button */}
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center space-x-1 lg:space-x-1.5 h-10 lg:h-11 px-3 lg:px-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-violet-300 dark:hover:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/25 text-xs font-semibold shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:scale-105 hover:shadow-md text-[#334155] dark:text-slate-300 focus-visible:outline-none"
              title="GitHub Repository"
              aria-label="Visit GitHub Profile"
            >
              <Github className="h-4 w-4 text-[#7C3AED] dark:text-purple-400" />
              <span>GitHub</span>
            </a>

            {/* Appearance Selector Button */}
            <div 
              className="relative hidden md:flex"
              onMouseEnter={handleAppearanceEnter}
              onMouseLeave={handleAppearanceLeave}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={toggleAppearanceClick}
                className="inline-flex items-center space-x-1 lg:space-x-1.5 h-10 lg:h-11 px-2.5 lg:px-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-violet-300 dark:hover:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/25 text-xs font-semibold shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:scale-[1.02] hover:shadow-md text-[#334155] dark:text-slate-300 focus-visible:outline-none"
                aria-label="Customize Appearance"
              >
                <Palette className="h-3.5 w-3.5 text-[#7C3AED] dark:text-purple-400" />
                <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${appearanceOpen ? 'rotate-180' : ''}`} />
              </button>

              {appearanceOpen && (
                <div className="absolute right-0 mt-2.5 w-60 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left space-y-3.5">
                  
                  {/* Mode */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B] dark:text-slate-400 px-1 block">
                      Mode
                    </span>
                    <div className="p-0.5 bg-[#F1F5F9]/60 dark:bg-slate-900/60 flex border border-gray-200 dark:border-slate-800 rounded-lg relative">
                      <div 
                        className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white dark:bg-slate-950 border border-gray-205 dark:border-slate-800/60 rounded-md shadow-sm transition-all duration-300 ${
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

                  {/* Theme Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B] dark:text-slate-400 px-1 block">
                      Theme Presets
                    </span>
                    <div className="grid grid-cols-3 gap-1 bg-[#F1F5F9]/60 dark:bg-slate-900/60 p-1 border border-gray-200 dark:border-slate-800 rounded-lg">
                      {presetsList.map((p) => (
                        <button
                          key={p.code}
                          onClick={() => setThemePreset(p.code)}
                          className={`flex items-center justify-center gap-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                            preset === p.code
                              ? 'bg-white dark:bg-slate-950 text-[#7C3AED] dark:text-purple-300 shadow-sm border border-gray-200 dark:border-slate-800'
                              : 'text-[#334155] dark:text-slate-400 hover:text-[#7C3AED] dark:hover:text-purple-400'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${p.dotColor}`} />
                          <span className="truncate">{p.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Portal Action Buttons */}
            {user ? (
              <button
                onClick={() => {
                  if (user.role === 'SUPER_ADMIN') navigate('/dashboard/super-admin');
                  else if (user.role === 'ADMIN') navigate('/dashboard/admin');
                  else if (user.role === 'TEACHER') navigate('/dashboard/teacher');
                  else if (user.role === 'STUDENT') navigate('/dashboard/student');
                  else if (user.role === 'PARENT') navigate('/dashboard/parent');
                }}
                className="inline-flex items-center space-x-1.5 h-10 lg:h-11 px-3.5 lg:px-5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-extrabold tracking-wide shadow-md shadow-violet-500/20 transition-all duration-300 active:scale-[0.98] btn-saas focus-visible:outline-none"
              >
                <span>Dashboard</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 h-10 lg:h-11 px-3.5 lg:px-5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-extrabold tracking-wide shadow-md shadow-violet-500/20 transition-all duration-300 active:scale-[0.98] btn-saas focus-visible:outline-none"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Portal Login</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              ref={hamburgerRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-[#334155] dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-950/25 transition-colors focus-visible:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div 
            ref={drawerRef}
            className="relative w-full max-w-xs bg-white dark:bg-slate-950 h-full shadow-2xl p-6 flex flex-col justify-between z-10 border-l border-gray-200 dark:border-slate-800 overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-slate-800/80 pb-4">
                <div className="flex items-center space-x-2">
                  <School className="h-5 w-5 text-primary" />
                  <span className="font-extrabold text-base text-foreground">VidyaSanchar</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1.5">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-primary text-primary-foreground font-extrabold shadow-sm' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`
                    }
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-gray-200/80 dark:border-slate-800/80 space-y-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md"
              >
                <LogIn className="h-4 w-4" />
                <span>Portal Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main key={location.pathname} className="flex-grow relative z-10 page-transition-enter">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
