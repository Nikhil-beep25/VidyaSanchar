import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { School, Eye, EyeOff, AlertTriangle, CheckCircle, BookOpen, Clock, Calendar, Shield } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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
      // Redirect based on role
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
    <div className="container max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[85vh]">
      {/* 2-Column Main Login Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl items-stretch">
        
        {/* Left Column: ERP Info / Indian School Branding */}
        <div className="hidden md:flex flex-col justify-between rounded-2xl bg-gradient-to-tr from-primary/95 to-violet-900 text-primary-foreground p-8 lg:p-12 shadow-xl relative overflow-hidden text-left">
          {/* Decorative background shape */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-20 -translate-y-20 blur-3xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                <School className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">VidyaSanchar ERP</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight text-white">
              Empowering Educational Institutions Across Bharat
            </h2>
            
            <p className="text-white/80 text-sm leading-relaxed max-w-md">
              A comprehensive open-source School ERP platform designed to streamline admissions, classroom attendance, academic grades, timetable schedules, library transactions, and parent-teacher communication.
            </p>
            
            {/* Features list */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3 text-xs lg:text-sm text-white/90">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>Real-time Student & Teacher Directories</span>
              </div>
              <div className="flex items-center space-x-3 text-xs lg:text-sm text-white/90">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>Normalized Database Ledger & Fee Billing</span>
              </div>
              <div className="flex items-center space-x-3 text-xs lg:text-sm text-white/90">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>Responsive Parent & Student Access Portals</span>
              </div>
            </div>
          </div>
          
          <div className="pt-8 text-xs text-white/60 border-t border-white/10 mt-8">
            © 2026 VidyaSanchar ERP. Built for Indian Schools and Colleges.
          </div>
        </div>

        {/* Right Column: Login Card */}
        <div className="w-full border rounded-2xl bg-card p-6 md:p-8 lg:p-12 shadow-xl flex flex-col justify-center space-y-6 text-left">
          {/* Small Branding Header for Mobile View */}
          <div className="flex flex-col items-center text-center space-y-2 md:items-start md:text-left">
            <div className="p-3 bg-primary text-primary-foreground rounded-2xl md:hidden">
              <School className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Login to Portal</h2>
            <p className="text-xs text-muted-foreground">
              Access your student, teacher, parent, or administrative dashboard.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-sm flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span className="break-all">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="e.g. admin@sms.edu.in"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <a 
                  href="#forgot" 
                  className="text-xs text-primary hover:underline" 
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
                  className="w-full h-10 pl-3 pr-10 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-10 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>

      </div>

      {/* Dev helper credentials card (Conditional on DEV Mode) */}
      {import.meta.env.DEV ? (
        <div className="mt-8 w-full max-w-5xl border border-dashed border-primary/45 rounded-xl bg-primary/5 p-5 text-xs space-y-3 text-left">
          <h4 className="font-bold text-primary flex items-center space-x-1.5">
            <span>🛠️ Developer Test Credentials</span>
          </h4>
          <p className="text-muted-foreground">
            Use these seeded user accounts to sign in and test the respective dashboard modules:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1 w-full">
            <div className="p-3 border rounded-xl bg-card shadow-sm flex flex-col justify-between h-full">
              <div>
                <span className="font-bold text-primary block text-xs mb-1">Admin Portal</span>
                <code className="text-[10px] break-all block text-muted-foreground select-all">admin@sms.edu.in</code>
              </div>
              <div className="mt-2 pt-1 border-t border-muted">
                <span className="text-[10px] text-muted-foreground">Pwd: </span>
                <code className="text-[10px] font-semibold">Password@123</code>
              </div>
            </div>
            
            <div className="p-3 border rounded-xl bg-card shadow-sm flex flex-col justify-between h-full">
              <div>
                <span className="font-bold text-primary block text-xs mb-1">Teacher Portal</span>
                <code className="text-[10px] break-all block text-muted-foreground select-all">ramesh.verma@sms.edu.in</code>
              </div>
              <div className="mt-2 pt-1 border-t border-muted">
                <span className="text-[10px] text-muted-foreground">Pwd: </span>
                <code className="text-[10px] font-semibold">Password@123</code>
              </div>
            </div>
            
            <div className="p-3 border rounded-xl bg-card shadow-sm flex flex-col justify-between h-full">
              <div>
                <span className="font-bold text-primary block text-xs mb-1">Student Portal</span>
                <code className="text-[10px] break-all block text-muted-foreground select-all">aarav.sharma@student.sms.edu.in</code>
              </div>
              <div className="mt-2 pt-1 border-t border-muted">
                <span className="text-[10px] text-muted-foreground">Pwd: </span>
                <code className="text-[10px] font-semibold">Password@123</code>
              </div>
            </div>
            
            <div className="p-3 border rounded-xl bg-card shadow-sm flex flex-col justify-between h-full">
              <div>
                <span className="font-bold text-primary block text-xs mb-1">Parent Portal</span>
                <code className="text-[10px] break-all block text-muted-foreground select-all">anil.sharma@parent.sms.edu.in</code>
              </div>
              <div className="mt-2 pt-1 border-t border-muted">
                <span className="text-[10px] text-muted-foreground">Pwd: </span>
                <code className="text-[10px] font-semibold">Password@123</code>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-xs text-muted-foreground">
          Please contact the school administrator for login credentials.
        </div>
      )}
    </div>
  );
};
