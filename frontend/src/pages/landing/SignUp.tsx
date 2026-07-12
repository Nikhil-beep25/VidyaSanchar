import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api';
import { School, CheckCircle } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'SUPER_ADMIN',
          phone,
          address,
        }),
        skipAuth: true,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="layout-container py-16 flex flex-col items-center justify-center min-h-[75vh] relative text-left">
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
        <Card className="w-full max-w-md p-8 shadow-2xl rounded-3xl text-center space-y-6 relative z-10">
          <div className="mx-auto p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full w-fit">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-extrabold Outfit text-foreground">Registration Successful!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your Super Admin account has been successfully created. You can now log in using your email and password.
          </p>
          <Link
            to="/login"
            className="w-full block py-2.5 text-sm font-bold bg-primary text-primary-foreground hover:opacity-95 rounded-xl transition-all shadow-md shadow-primary/20"
          >
            Go to Login
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="layout-container py-16 flex flex-col items-center justify-center min-h-[75vh] relative text-left">
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-2xl rounded-3xl space-y-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className="p-3 bg-primary/10 text-primary border border-primary/25 rounded-2xl">
            <School className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight Outfit text-foreground">Register New Branch</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Create a Super Admin profile to manage your school or college system.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs sm:text-sm text-center font-semibold animate-in fade-in duration-200">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Admin Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder-muted-foreground/60 transition-all"
              placeholder="e.g. Ramesh Kumar Iyer"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder-muted-foreground/60 transition-all"
              placeholder="e.g. admin@schoolname.edu.in"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder-muted-foreground/60 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              WhatsApp Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-4 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder-muted-foreground/60 transition-all"
              placeholder="e.g. +91 9876543210"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Office Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-11 px-4 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder-muted-foreground/60 transition-all"
              placeholder="e.g. Indiranagar, Bengaluru"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 inline-flex items-center justify-center rounded-xl text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-50 shadow-md shadow-primary/25 pt-0.5"
          >
            {submitting ? 'Creating account...' : 'Register School'}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login here
          </Link>
        </div>
      </Card>
    </div>
  );
};
