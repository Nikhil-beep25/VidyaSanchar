import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme, type ThemePreset } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  School, Globe, ChevronDown, Palette, Menu, X, 
  Home, Info, Layers, CreditCard, MessageSquare, HelpCircle, Mail, Lock, Check, Sun, Moon, Sparkles, MapPin
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

    const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
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
  }, [hoveredIndex, activeIndex]);

  // Handle window resizing to adjust pill coordinates
  useEffect(() => {
    const handleResize = () => {
      const container = navRef.current;
      if (!container) return;
      const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
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
  }, [hoveredIndex, activeIndex]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative theme-transition font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-25%] left-[-15%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px] pointer-events-none dark:block hidden transition-all duration-500" />
      <div className="absolute top-[25%] right-[-15%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none dark:block hidden transition-all duration-500" />

      {/* Premium Fixed SaaS Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out border-b ${
          scrolled 
            ? 'bg-background/80 backdrop-blur-[20px] border-border/40 dark:border-white/[0.08] shadow-sm' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="layout-container w-full h-16 md:h-[72px] flex items-center justify-between relative navbar-enter">
          
          {/* Left Brand Section */}
          <Link to="/" className="flex items-center space-x-1.5 group z-10 relative flex-shrink-0 transition-transform duration-200 hover:scale-[1.01]">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-[0_0_10px_-3px_hsl(var(--primary)/0.25)]">
              <School className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-[14.5px] sm:text-[15px] tracking-tight text-foreground leading-none font-sans group-hover:text-primary transition-colors duration-200">
                VidyaSanchar
              </span>
              <span className="text-[6.5px] font-semibold tracking-[0.15em] text-primary/80 uppercase mt-0.5 opacity-90">
                School ERP
              </span>
            </div>
          </Link>

          {/* Center Navigation Menu — Premium SaaS style with sliding pill */}
          <nav 
            ref={navRef}
            className="hidden xl:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2 z-10 p-1 bg-muted/10 border border-border/10 rounded-full"
            role="navigation" 
            aria-label="Main navigation"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Sliding Pill Background */}
            <div 
              className="absolute rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
              style={{
                left: pillStyle.left,
                width: pillStyle.width,
                height: pillStyle.height,
                top: pillStyle.top,
                opacity: pillStyle.opacity,
                backgroundColor: hoveredIndex !== null 
                  ? 'hsl(var(--primary) / 0.08)' 
                  : 'hsl(var(--primary) / 0.12)',
                boxShadow: hoveredIndex !== null
                  ? '0 2px 10px -2px hsl(var(--primary) / 0.15), 0 0 6px 1px hsl(var(--primary) / 0.08)'
                  : '0 1px 8px -2px hsl(var(--primary) / 0.2)',
                transform: hoveredIndex !== null ? 'translateY(-0.5px) scale(1.01)' : 'translateY(0) scale(1)',
                border: '1px solid hsl(var(--primary) / 0.15)',
              }}
            />

            {navLinks.map((link, idx) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `nav-link-item relative py-1.5 px-3 rounded-full text-[11.5px] font-semibold tracking-[0.015em] transition-colors duration-200 z-10 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`
                }
                onMouseEnter={() => setHoveredIndex(idx)}
              >
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Control Section */}
          <div className="hidden xl:flex items-center space-x-2.5 z-10 relative flex-shrink-0">
            {/* Grouped Utility Selector Pill */}
            <div className="flex items-center space-x-1 bg-muted/40 border border-border/40 p-1 rounded-xl">
              
              {/* Language Switcher */}
              <div 
                className="relative"
                onMouseEnter={handleLangEnter}
                onMouseLeave={handleLangLeave}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={toggleLangClick}
                  aria-label={`Language: ${selectedLang.name}`}
                  className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-muted text-xs font-semibold transition-all active:scale-[0.97] text-muted-foreground hover:text-foreground"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span className="text-[10px] leading-none font-bold uppercase">{selectedLang.code}</span>
                  <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2.5 w-32 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-1 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => selectLang(l.code)}
                        className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-left text-xs font-semibold transition-all ${
                          lang === l.code 
                            ? 'bg-primary/10 text-primary font-bold' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Separator line inside group */}
              <div className="h-4 w-px bg-border/60 self-center" />

              {/* Appearance Selector */}
              <div 
                className="relative"
                onMouseEnter={handleAppearanceEnter}
                onMouseLeave={handleAppearanceLeave}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={toggleAppearanceClick}
                  className="inline-flex items-center space-x-0.5 px-2 py-1 rounded-lg hover:bg-muted text-xs font-semibold transition-all active:scale-[0.97] text-muted-foreground hover:text-foreground"
                  aria-label="Customize Appearance"
                >
                  <Palette className="h-3.5 w-3.5 text-primary" />
                  <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${appearanceOpen ? 'rotate-180' : ''}`} />
                </button>

                {appearanceOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-3.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left space-y-3.5">
                    
                    {/* SECTION 1: MODE */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1 block">
                        Mode
                      </span>
                      <div className="p-0.5 bg-muted/60 flex border border-border/60 rounded-lg relative">
                        <div 
                          className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-card border border-border/60 rounded-md shadow-sm transition-all duration-300 ${
                            theme === 'dark' ? 'left-[calc(50%+1px)]' : 'left-[1px]'
                          }`}
                        />
                        <button
                          onClick={() => setThemeMode('light')}
                          className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-all relative z-10 flex items-center justify-center gap-1 ${
                            theme === 'light' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Sun className="h-3 w-3" />
                          <span>Light</span>
                        </button>
                        <button
                          onClick={() => setThemeMode('dark')}
                          className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-all relative z-10 flex items-center justify-center gap-1 ${
                            theme === 'dark' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Moon className="h-3 w-3" />
                          <span>Dark</span>
                        </button>
                      </div>
                    </div>

                    {/* SECTION 2: THEME COLORS */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1 block">
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
                                  ? 'bg-primary/10 text-primary border-primary/20 shadow-sm' 
                                  : 'border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground font-medium'
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
                className="inline-flex items-center justify-center rounded-full text-[11px] font-bold tracking-wide transition-all btn-portal h-8.5 px-4.5 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)] active:scale-[0.97] z-10"
              >
                <Lock className="mr-1.5 h-3 w-3" />
                Dashboard
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full text-[11px] font-bold tracking-wide transition-all btn-portal h-8.5 px-4.5 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)] active:scale-[0.97] z-10"
              >
                <Lock className="mr-1.5 h-3 w-3" />
                Portal Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex items-center xl:hidden z-10 relative">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-full border border-border/50 bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground active:scale-95 transition-all"
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

            {/* Navigation links inside drawer */}
            <nav className="flex flex-col space-y-1 overflow-y-auto max-h-[300px]">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'text-primary bg-primary/10 border border-primary/20 font-black' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
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
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 block">
                  Appearance Settings
                </span>
                
                {/* Mode Segmented Controls */}
                <div className="p-1 bg-muted/60 flex border border-border/60 rounded-xl relative mx-2">
                  <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-card border border-border/60 rounded-lg shadow-sm transition-all duration-300 ${
                      theme === 'dark' ? 'left-[calc(50%+2px)]' : 'left-[6px]'
                    }`}
                  />
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                      theme === 'light' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                      theme === 'dark' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    <span>Dark</span>
                  </button>
                </div>

                {/* Preset Color Selection Grid */}
                <div className="grid grid-cols-3 gap-1.5 bg-card/60 p-2 rounded-xl border border-border/80 mx-2">
                  {presetsList.map((t) => (
                    <button
                      key={t.code}
                      onClick={() => setThemePreset(t.code)}
                      className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1.5 border transition-all ${
                        preset === t.code ? 'border-primary bg-primary/10' : 'border-transparent'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${t.dotColor}`} />
                      <span className="text-[9px] font-bold text-foreground/80 truncate w-full px-1 text-center">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Switcher in Mobile */}
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Language</span>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={toggleLangClick}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-bold bg-card"
                  >
                    <span>{selectedLang.flag}</span>
                    <span>{selectedLang.name}</span>
                  </button>
                  {langMenuOpen && (
                    <div className="absolute right-0 bottom-full mb-1.5 w-36 rounded-xl border border-border/80 bg-card p-1 shadow-2xl z-50 text-left">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => selectLang(l.code)}
                          className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-left text-xs font-semibold hover:bg-muted"
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
                  className="w-full text-center py-3 text-xs font-bold btn-portal rounded-full shadow-lg shadow-primary/20 btn-shine btn-glow flex items-center justify-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Go to Dashboard
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 text-xs font-bold btn-portal rounded-full shadow-lg shadow-primary/20 btn-shine btn-glow flex items-center justify-center gap-1.5"
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
