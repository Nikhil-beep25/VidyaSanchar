import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please provide an email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="space-y-4 max-w-md text-left">
      <h3 className="font-bold text-sm text-foreground tracking-tight Outfit">
        Stay Updated with Education Technology Insights
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Get product updates, school ERP best practices, and educational technology insights delivered to your inbox.
      </p>

      {success && (
        <div className="p-3.5 rounded-xl border border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>Thank you for subscribing to VidyaSanchar insights!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs flex items-center space-x-2 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          disabled={loading || success}
          aria-label="Email address for newsletter"
          className="flex-grow h-11 px-4 border border-border/80 bg-card/60 text-sm rounded-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder-muted-foreground/60 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || success}
          aria-label="Subscribe to newsletter"
          className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-md shadow-primary/20"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
};
