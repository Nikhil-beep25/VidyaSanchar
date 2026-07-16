import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme, type ThemePreset } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  School, Globe, ChevronDown, Palette, Menu, X, 
  Home, Info, Layers, CreditCard, MessageSquare, HelpCircle, Mail, Lock, Check, Sun, Moon, Sparkles, MapPin, LogIn
} from 'lucide-react';
import { Footer } from './footer/Footer';

export const LandingLayout: React.FC = () => {
  const { theme, preset, activeTheme, setThemeMode, setThemePreset } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Switcher dropdown states
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [langTimeout, setLangTimeout] = useState<any>(null);
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

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

  // Filter languages: Only English and Hindi are supported now
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  const presetsList = [
    { code: 'purple' as ThemePreset, name: 'Purple', dotColor: 'bg-violet-600' },
    { code: 'blue' as ThemePreset, name: 'Ocean Blue', dotColor: 'bg-blue-500' },
    { code: 'emerald' as ThemePreset, name: 'Emerald', dotColor: 'bg-emerald-500' },
    { code: 'orange' as ThemePreset, name: 'Sunset Orange', dotColor: 'bg-orange-500' },
    { code: 'rose' as ThemePreset, name: 'Rose Pink', dotColor: 'bg-rose-500' },
    { code: 'obsidian' as ThemePreset, name: 'Obsidian', dotColor: 'bg-slate-700 dark:bg-slate-300 border border-border/80' }
  ];

  const selectedLang = languages.find(l => l.code === lang) || languages[0];

  const selectLang = (code: string) => {
    setLang(code);
    localStorage.setItem('lang', code);
    setLangMenuOpen(false);
  };

  const handleLangEnter = () => {
    if (langTimeout) clearTimeout(langTimeout);
    setLangMenuOpen(true);
  };

  const handleLangLeave = () => {
    const timeout = setTimeout(() => {
      setLangMenuOpen(false);
    }, 300);
    setLangTimeout(timeout);
  };

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

  const toggleLangClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLangMenuOpen(!langMenuOpen);
  };

  useEffect(() => {
    const closeAll = () => {
      setLangMenuOpen(false);
      setAppearanceOpen(false);
    };
    window.addEventListener('click', closeAll);
    return () => window.removeEventListener('click', closeAll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-3.5 w-3.5" /> },
    { name: 'About', path: '/about', icon: <Info className="h-3.5 w-3.5" /> },
    { name: 'Features', path: '/features', icon: <Layers className="h-3.5 w-3.5" /> },
    { name: 'Projects', path: '/projects', icon: <Layers className="h-3.5 w-3.5" /> },
    { name: 'Journey', path: '/journey', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { name: 'Pricing', path: '/pricing', icon: <CreditCard className="h-3.5 w-3.5" /> },
    { name: 'Testimonials', path: '/testimonials', icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { name: 'FAQ', path: '/faq', icon: <HelpCircle className="h-3.5 w-3.5" /> },
    { name: 'Contact', path: '/contact', icon: <Mail className="h-3.5 w-3.5" /> },
  ];

  const navRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Calculate active index on route change
  useEffect(() => {
    const activeIdx = navLinks.findIndex((link) => {
      if (link.path === '/') return location.pathname === '/';
      return location.pathname.startsWith(link.path);
    });
    setActiveIndex(activeIdx !== -1 ? activeIdx : null);
  }, [location.pathname]);

  // Recalculate pill coordinates dynamically
  useEffect(() => {
    const container = navRef.current;
    if (!container) return;

    const targetIndex = hoveredIndex;
    if (targetIndex !== null) {
      const linkElements = container.querySelectorAll('.nav-link-item');
      const targetEl = linkElements[targetIndex] as HTMLElement;
      if (targetEl) {
        setPillStyle({
          left: targetEl.offsetLeft,
          width: targetEl.offsetWidth,
          height: targetEl.offsetHeight,
          top: targetEl.offsetTop,
          opacity: 1,
        });
      }
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [hoveredIndex]);

  // Handle window resizing to adjust pill coordinates
  useEffect(() => {
    const handleResize = () => {
      const container = navRef.current;
      if (!container) return;
      const targetIndex = hoveredIndex;
      if (targetIndex !== null) {
        const linkElements = container.querySelectorAll('.nav-link-item');
        const targetEl = linkElements[targetIndex] as HTMLElement;
        if (targetEl) {
          setPillStyle({
            left: targetEl.offsetLeft,
            width: targetEl.offsetWidth,
            height: targetEl.offsetHeight,
            top: targetEl.offsetTop,
            opacity: 1,
          });
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoveredIndex]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative theme-transition font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-25%] left-[-15%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px] pointer-events-none dark:block hidden transition-all duration-500" />
      <div className="absolute top-[25%] right-[-15%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none dark:block hidden transition-all duration-500" />

      {/* Premium Fixed SaaS Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out border-b bg-white/90 dark:bg-[#050816]/90 backdrop-blur-md border-[#E5E7EB] dark:border-white/[0.08] ${
          scrolled ? 'shadow-sm' : 'shadow-none'
        }`}
      >
        <div className="max-w-[1280px] mx-auto w-full h-[72px] px-6 sm:px-8 flex items-center justify-between relative navbar-enter">
          
          {/* Left Brand Section */}
          <div className="flex-1 flex items-center justify-start">
            <Link to="/" className="flex items-center space-x-1.5 group z-10 relative flex-shrink-0 transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-[0_0_10px_-3px_hsl(var(--primary)/0.25)]">
                <School className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-[14.5px] sm:text-[15px] tracking-tight text-[#0F172A] dark:text-[#F9FAFB] leading-none font-sans group-hover:text-primary transition-colors duration-200">
                  VidyaSanchar
                </span>
                <span className="text-[7.5px] font-bold tracking-[0.15em] text-[#64748B] dark:text-slate-400 uppercase mt-0.5">
                  School ERP
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Menu — Premium SaaS style with sliding pill */}
          <div className="hidden xl:flex items-center justify-center mx-8 flex-shrink-0">
            <nav 
              ref={navRef}
              className="flex items-center space-x-1 p-1 bg-[#F1F5F9]/60 dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800/80 rounded-2xl relative"
              role="navigation" 
              aria-label="Main navigation"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Sliding Pill Background */}
              <div 
                className="absolute rounded-[12px] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
                style={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                  height: pillStyle.height,
                  top: pillStyle.top,
                  opacity: pillStyle.opacity,
                  backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.08)' : 'rgba(124, 58, 237, 0.06)',
                  boxShadow: theme === 'dark'
                    ? '0 4px 12px -2px rgba(168, 85, 247, 0.15)'
                    : '0 4px 12px -2px rgba(124, 58, 237, 0.08)',
                  border: theme === 'dark'
                    ? '1px solid rgba(168, 85, 247, 0.15)'
                    : '1px solid rgba(124, 58, 237, 0.12)',
                }}
              />
   
              {navLinks.map((link, idx) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `nav-link-item relative py-2.5 px-4 rounded-[12px] text-xs transition-all duration-200 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isActive 
                        ? 'bg-[#F3E8FF] dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-300 font-semibold shadow-sm' 
                        : 'text-[#334155] dark:text-slate-300 hover:text-[#7C3AED] dark:hover:text-purple-400 font-medium'
                    }`
                  }
                  onMouseEnter={() => setHoveredIndex(idx)}
                >
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Control Section */}
          <div className="flex-1 flex items-center justify-end gap-3 z-10 relative flex-shrink-0 flex-nowrap">
            
            {/* Language Switcher Button */}
            <div 
              className="relative mr-1"
              onMouseEnter={handleLangEnter}
              onMouseLeave={handleLangLeave}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={toggleLangClick}
                aria-label={`Language: ${selectedLang.name}`}
                className="inline-flex items-center space-x-1.5 h-[40px] px-3.5 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold transition-all active:scale-[0.97] text-[#334155] dark:text-slate-300 hover:text-[#7C3AED] dark:hover:text-purple-400 hover:border-[#7C3AED]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="text-[10px] leading-none font-bold uppercase">{selectedLang.code}</span>
                <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-32 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-950 p-1 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => selectLang(l.code)}
                      className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-left text-xs font-semibold transition-all ${
                        lang === l.code 
                          ? 'bg-[#F3E8FF] dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-300 font-bold' 
                          : 'text-[#334155] dark:text-slate-300 hover:text-[#7C3AED] dark:hover:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Appearance Selector Button */}
            <div 
              className="relative hidden sm:block"
              onMouseEnter={handleAppearanceEnter}
              onMouseLeave={handleAppearanceLeave}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={toggleAppearanceClick}
                className="inline-flex items-center space-x-1.5 h-[40px] px-3.5 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold transition-all active:scale-[0.97] text-[#334155] dark:text-slate-300 hover:text-[#7C3AED] dark:hover:text-purple-400 hover:border-[#7C3AED]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2"
                aria-label="Customize Appearance"
              >
                <Palette className="h-3.5 w-3.5 text-[#7C3AED] dark:text-purple-400" />
                <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${appearanceOpen ? 'rotate-180' : ''}`} />
              </button>

              {appearanceOpen && (
                <div className="absolute right-0 mt-2.5 w-60 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-950 p-3.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left space-y-3.5">
                  
                  {/* SECTION 1: MODE */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B] dark:text-slate-400 px-1 block">
                      Mode
                    </span>
                    <div className="p-0.5 bg-[#F1F5F9]/60 dark:bg-slate-900/60 flex border border-[#E5E7EB] dark:border-slate-800 rounded-lg relative">
                      <div 
                        className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800/60 rounded-md shadow-sm transition-all duration-300 ${
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
                                : 'border-[#E5E7EB] dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-[#334155] dark:text-slate-400 hover:text-[#7C3AED] dark:hover:text-purple-400 font-medium'
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
                className="hidden sm:inline-flex items-center justify-center min-w-[130px] h-[40px] px-5 py-2.5 rounded-xl text-[15px] font-semibold tracking-wide whitespace-nowrap bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white shadow-[0_4px_12px_rgba(124,58,237,0.15)] hover:shadow-[0_6px_16px_rgba(124,58,237,0.20)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2 flex gap-2"
              >
                <Lock className="h-4 w-4 flex-shrink-0" />
                <span>Dashboard</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center min-w-[130px] h-[40px] px-5 py-2.5 rounded-xl text-[15px] font-semibold tracking-wide whitespace-nowrap bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white shadow-[0_4px_12px_rgba(124,58,237,0.15)] hover:shadow-[0_6px_16px_rgba(124,58,237,0.20)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2 flex gap-2"
              >
                <LogIn className="h-4 w-4 flex-shrink-0" />
                <span>Portal Login</span>
              </Link>
            )}

            {/* Mobile hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden flex items-center justify-center h-[40px] w-[40px] rounded-xl border border-border/50 bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2"
              aria-label="Open Mobile Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (Slides in from the right) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden animate-in fade-in duration-200 text-left">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-[310px] bg-background/95 backdrop-blur-md border-l border-border/85 p-6 flex flex-col space-y-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <span className="font-extrabold text-base text-gradient-theme">VidyaSanchar ERP</span>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 rounded-full border border-border hover:bg-muted transition-all active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col space-y-1 overflow-y-auto max-h-[300px]">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                      isActive 
                        ? 'text-[#7C3AED] dark:text-purple-300 bg-[#F3E8FF] dark:bg-purple-950/40 border-[#7C3AED]/20 dark:border-purple-400/20 font-bold' 
                        : 'text-[#334155] dark:text-slate-300 border-transparent hover:text-[#7C3AED] dark:hover:text-purple-400 hover:bg-[#F3E8FF]/30 dark:hover:bg-purple-950/20'
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </nav>

            <div className="pt-4 border-t border-border/60 mt-auto space-y-5 overflow-y-auto">
              
              {/* Mobile Segmented Appearance Panel */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B] dark:text-slate-400 px-2 block">
                  Appearance Settings
                </span>
                
                {/* Mode Segmented Controls */}
                <div className="p-1 bg-[#F1F5F9]/60 dark:bg-slate-900/60 flex border border-[#E5E7EB] dark:border-slate-800 rounded-xl relative mx-2">
                  <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800/60 rounded-lg shadow-sm transition-all duration-300 ${
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

                {/* Preset Color Selection Grid */}
                <div className="grid grid-cols-3 gap-1.5 bg-card/60 p-2 rounded-xl border border-[#E5E7EB] dark:border-slate-800 mx-2">
                  {presetsList.map((t) => {
                    const isSelected = preset === t.code;
                    return (
                      <button
                        key={t.code}
                        onClick={() => setThemePreset(t.code)}
                        className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1.5 border transition-all ${
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

              {/* Language Switcher in Mobile */}
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B] dark:text-slate-400">Language</span>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={toggleLangClick}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-slate-800 text-xs font-semibold bg-white dark:bg-slate-900 text-[#334155] dark:text-slate-300 hover:text-[#7C3AED] hover:border-[#7C3AED]/30 active:scale-[0.97] transition-all"
                  >
                    <span>{selectedLang.flag}</span>
                    <span>{selectedLang.name}</span>
                  </button>
                  {langMenuOpen && (
                    <div className="absolute right-0 bottom-full mb-1.5 w-36 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-950 p-1 shadow-xl z-50 text-left">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => selectLang(l.code)}
                          className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-left text-xs font-semibold transition-all ${
                            lang === l.code 
                              ? 'bg-[#F3E8FF] dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-300 font-bold' 
                              : 'text-[#334155] dark:text-slate-300 hover:text-[#7C3AED] dark:hover:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                          }`}
                        >
                          <span>{l.flag}</span>
                          <span>{l.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CTA portal login in Mobile */}
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
                  className="w-full text-center py-3 text-xs font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.97] flex items-center justify-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Go to Dashboard
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 text-xs font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.97] flex items-center justify-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Portal Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main key={location.pathname} className="flex-grow relative z-10 pt-16 md:pt-[72px] page-transition-enter">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
