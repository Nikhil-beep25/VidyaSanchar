import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { School, Eye, EyeOff, AlertTriangle, CheckCircle, Copy, Check } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [parallaxStyle, setParallaxStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)' });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setParallaxStyle({
      transform: `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translate3d(${x * 12}px, ${y * 12}px, 0)`
    });
  };

  const handleMouseLeave = () => {
    setParallaxStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)'
    });
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 1500);
  };

  const credentialsList = [
    {
      role: 'Admin',
      email: 'admin@sms.edu.in',
      password: 'Password@123',
      badgeColor: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    },
    {
      role: 'Teacher',
      email: 'teacher@sms.edu.in',
      password: 'Password@123',
      badgeColor: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    },
    {
      role: 'Student',
      email: 'student@sms.edu.in',
      password: 'Password@123',
      badgeColor: 'bg-primary/10 border-primary/20 text-primary',
    },
    {
      role: 'Parent',
      email: 'parent@sms.edu.in',
      password: 'Password@123',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    },
  ];
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'SUPER_ADMIN') navigate('/dashboard/super-admin');
      else if (user.role === 'ADMIN') navigate('/dashboard/admin');
      else if (user.role === 'TEACHER') navigate('/dashboard/teacher');
      else if (user.role === 'STUDENT') navigate('/dashboard/student');
      else if (user.role === 'PARENT') navigate('/dashboard/parent');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="layout-container py-6 md:py-12 flex flex-col items-center justify-center min-h-[85vh] relative text-left">
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-[20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />

      {/* 2-Column Main Login Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl items-stretch relative z-10">
        
        {/* Left Column: ERP Info / Indian School Branding */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={parallaxStyle}
          className="hidden md:flex flex-col justify-between rounded-3xl auth-branding-mesh border border-white/10 text-white p-8 lg:p-10 shadow-2xl relative overflow-hidden text-left transition-transform duration-500 ease-out"
        >
          {/* Subtle grid pattern overlay for texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.08] z-0">
            <div className="absolute h-1.5 w-1.5 rounded-full bg-white top-[15%] left-[25%] animate-pulse" />
            <div className="absolute h-2 w-2 rounded-full bg-white top-[65%] left-[10%] animate-pulse" style={{ animationDelay: '1.2s' }} />
            <div className="absolute h-1 w-1 rounded-full bg-white top-[45%] left-[85%] animate-pulse" style={{ animationDelay: '2.4s' }} />
            <div className="absolute h-2.5 w-2.5 rounded-full bg-white top-[85%] left-[65%] animate-pulse" style={{ animationDelay: '3.6s' }} />
            <div className="absolute h-1.5 w-1.5 rounded-full bg-white top-[25%] left-[75%] animate-pulse" style={{ animationDelay: '1.8s' }} />
          </div>
          
          <div className="flex items-center space-x-2.5 relative z-10">
            <div className="p-2.5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
              <School className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white Outfit">VidyaSanchar ERP</span>
          </div>

          {/* Middle Section: Marketing Headline + 3 Floating Preview Cards */}
          <div className="my-auto py-6 relative z-10 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight text-white Outfit">
                Empowering Educational Institutions Across Bharat
              </h2>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-semibold">
                A comprehensive School ERP platform designed to streamline admissions, classroom attendance, academic grades, and parent-teacher communication.
              </p>
            </div>

            {/* Floating Preview Cards */}
            <div className="grid grid-cols-1 gap-3.5 pt-2">
              
              {/* Card 1: Today's Attendance */}
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 shadow-lg flex items-center space-x-4 animate-float-slow-1 select-none hover:border-white/20 transition-all duration-300">
                <div className="relative h-11 w-11 flex items-center justify-center flex-shrink-0">
                  <svg className="h-11 w-11 transform -rotate-90">
                    <circle cx="22" cy="22" r="17" className="stroke-white/[0.06] fill-none" strokeWidth="3" />
                    <circle cx="22" cy="22" r="17" className="stroke-emerald-400 fill-none" strokeWidth="3" strokeDasharray="106" strokeDashoffset="5.5" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-[9px] font-black text-white">94.8%</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white/90">Today's Attendance</h4>
                  <span className="text-[10px] text-emerald-400 font-extrabold block mt-0.5">High Attendance Rate</span>
                </div>
              </div>

              {/* Card 2: Fee Collection */}
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 shadow-lg flex items-center justify-between animate-float-slow-2 select-none hover:border-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3.5">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-black text-sm flex-shrink-0">
                    ₹
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white/90">Fee Collection</h4>
                    <span className="text-xs text-white/60 block mt-0.5">Academic Year 2026</span>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-sm font-black text-white">₹12.5L</span>
                  <div className="flex items-end space-x-0.5 h-6 pb-1">
                    <div className="w-1 bg-white/10 rounded-t h-2" />
                    <div className="w-1 bg-amber-500/30 rounded-t h-4" />
                    <div className="w-1 bg-amber-500/50 rounded-t h-3" />
                    <div className="w-1 bg-amber-400 rounded-t h-5" />
                  </div>
                </div>
              </div>

              {/* Card 3: Student Records */}
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 shadow-lg flex items-center justify-between animate-float-slow-3 select-none hover:border-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3.5">
                  <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <School className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white/90">Student Records</h4>
                    <span className="text-xs text-white/60 block mt-0.5">Active profiles</span>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-sm font-black text-white">3,250</span>
                  <svg className="w-12 h-6 text-blue-400" viewBox="0 0 50 30" fill="none">
                    <path d="M0,25 Q10,5 20,18 T40,10 L50,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="50" cy="8" r="2" fill="currentColor" />
                  </svg>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Section: Trusted by Glass Chips + Scrolling Marquee */}
          <div className="space-y-4 relative z-10 pt-4 border-t border-white/[0.06] mt-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Trusted By</span>
              <span className="text-[9px] font-black text-white/30 uppercase tracking-wider">Indian Schools</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {['CBSE Schools', 'ICSE Schools', 'State Boards', 'International Schools'].map((chip) => (
                <span key={chip} className="px-2.5 py-1 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/[0.06] text-[9px] font-bold text-white/60 shadow-sm">
                  {chip}
                </span>
              ))}
            </div>

            {/* Infinite Marquee */}
            <div className="relative w-full overflow-hidden py-1.5 border-t border-b border-white/[0.04] bg-white/[0.01] rounded-lg">
              <div className="animate-marquee flex items-center space-x-12 pr-12">
                {['CBSE', 'ICSE', 'NEP 2020', 'Digital India', 'Open Source'].map((logo, index) => (
                  <span key={`l1-${index}`} className="text-[10px] font-extrabold text-white/20 tracking-widest font-sans uppercase whitespace-nowrap">
                    {logo}
                  </span>
                ))}
                {['CBSE', 'ICSE', 'NEP 2020', 'Digital India', 'Open Source'].map((logo, index) => (
                  <span key={`l2-${index}`} className="text-[10px] font-extrabold text-white/20 tracking-widest font-sans uppercase whitespace-nowrap">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Login Card using reusable Card component */}
        <Card 
          className={`w-full p-6 sm:p-10 shadow-2xl flex flex-col justify-center space-y-6 text-left transition-all duration-[600ms] ease-out ${
            mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-[30px] scale-[0.97]'
          }`}
        >
          {/* Small Branding Header for Mobile View */}
          <div className="flex flex-col items-center text-center space-y-2.5 md:items-start md:text-left">
            <div className="p-3 bg-primary/10 text-primary border border-primary/25 rounded-2xl md:hidden">
              <School className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight Outfit text-foreground">Login to Portal</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Access your student, teacher, parent, or administrative dashboard.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs sm:text-sm flex items-center space-x-2.5 font-semibold">
              <AlertTriangle className="h-4.5 w-4.5 flex-shrink-0" />
              <span className="break-all">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-glow text-foreground placeholder-muted-foreground/60 transition-all"
                placeholder="e.g. admin@sms.edu.in"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <a 
                  href="#forgot" 
                  className="text-xs text-primary hover:underline font-semibold" 
                  onClick={() => alert('Password reset flow: Reset instruction was successfully simulated.')}
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-glow text-foreground placeholder-muted-foreground/60 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 inline-flex items-center justify-center rounded-xl text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-50 shadow-md shadow-primary/25 pt-0.5 btn-saas"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </Card>

      </div>

      {/* Dev helper credentials card using Card component */}
      <Card className="mt-12 w-full max-w-5xl p-6 sm:p-8 space-y-4 text-left shadow-2xl relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-foreground flex items-center space-x-2 text-base md:text-lg Outfit">
              <span className="p-1.5 bg-primary/10 rounded-lg text-primary border border-primary/20 text-xs font-bold">🛠️</span>
              <span>Developer Test Credentials</span>
            </h3>
            <p className="text-muted-foreground text-xs font-semibold">
              Use these seeded user accounts to sign in and test the respective dashboard portals:
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-2">
          {credentialsList.map((cred) => {
            const emailKey = `${cred.role.toLowerCase()}-email`;
            const passKey = `${cred.role.toLowerCase()}-pass`;
            return (
              <div key={cred.role} className="p-4 border border-border/80 rounded-2xl bg-background/50 hover:border-primary/20 transition-all flex flex-col justify-between space-y-3">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cred.badgeColor}`}>
                      {cred.role}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Email</span>
                    <div className="flex items-center justify-between gap-1 bg-card p-2 rounded-lg border border-border/80 text-xs">
                      <code className="text-foreground/80 select-all truncate block flex-1 font-mono text-[10px] sm:text-[11px]">{cred.email}</code>
                      <button
                        type="button"
                        onClick={() => handleCopyText(cred.email, emailKey)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                        title="Copy email"
                      >
                        {copiedKey === emailKey ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Password</span>
                    <div className="flex items-center justify-between gap-1 bg-card p-2 rounded-lg border border-border/80 text-xs">
                      <code className="text-foreground/80 select-all truncate block flex-1 font-mono text-[10px] sm:text-[11px]">{cred.password}</code>
                      <button
                        type="button"
                        onClick={() => handleCopyText(cred.password, passKey)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                        title="Copy password"
                      >
                        {copiedKey === passKey ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
