import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
import { Check, Send, Sparkles } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const Pricing: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Free Demo Request');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, subject, message }),
        skipAuth: true
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const tiers = [
    {
      name: 'Open Source (Self-Hosted)',
      price: '₹0',
      period: 'free forever',
      desc: 'Deploy on your own infrastructure with zero license costs.',
      features: [
        'Full source code access',
        'Unlimited students & classes',
        'Super Admin & Admin dashboards',
        'PostgreSQL database integration',
        'Community forum support',
      ],
      buttonText: 'Clone Github Repository',
      active: false,
    },
    {
      name: 'Standard ERP',
      price: '₹1,499',
      period: 'per month',
      desc: 'Hosted and managed on our secure cloud server for peace of mind.',
      features: [
        'Up to 1,000 students',
        'Automatic nightly backups',
        'SSL certificate included',
        '99.9% uptime SLA',
        'Email & WhatsApp support',
      ],
      buttonText: 'Start Free Trial',
      active: true,
    },
    {
      name: 'Enterprise ERP',
      price: '₹4,999',
      period: 'per month',
      desc: 'Tailored solutions for universities and multi-branch schools.',
      features: [
        'Unlimited students & branches',
        'Dedicated database instance',
        'Custom domain integration',
        'SMS/WhatsApp gateway credits',
        '24/7 priority call support',
      ],
      buttonText: 'Contact for Quote',
      active: false,
    },
  ];

  return (
    <div className="layout-container py-8 sm:py-12 space-y-16 relative text-left">
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      <div className="absolute top-[40%] right-[-15%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />

      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Flexible Plans</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight Outfit">Flexible Pricing Plans</h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          VidyaSanchar code is 100% free and open-source. Choose to self-host for free, or use our secure cloud deployment.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <Card
            key={index}
            hoverLift={!tier.active}
            className={`flex flex-col justify-between p-8 relative theme-transition ${
              tier.active 
                ? 'border-primary shadow-lg shadow-primary/10 scale-102 z-10 md:translate-y-[-8px] hover:shadow-primary/20' 
                : 'hover:border-border/80'
            }`}
          >
            {tier.active && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
                Most Popular
              </span>
            )}
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-xl Outfit text-foreground">{tier.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 min-h-[40px] leading-relaxed">{tier.desc}</p>
              </div>
              <div className="flex items-baseline py-2.5 border-y border-border/60">
                <span className="text-4xl font-extrabold Outfit text-foreground">{tier.price}</span>
                <span className="text-muted-foreground ml-2 text-xs font-semibold uppercase tracking-wider">/{tier.period}</span>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm">
                {tier.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-start">
                    <Check className="h-4.5 w-4.5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8 mt-auto">
              <a
                href="#demo-form"
                className={`w-full block text-center py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  tier.active
                    ? 'bg-primary text-primary-foreground hover:opacity-95 shadow-md shadow-primary/25'
                    : 'border border-border/80 bg-card hover:bg-muted/70'
                }`}
              >
                {tier.buttonText}
              </a>
            </div>
          </Card>
        ))}
      </section>

      {/* Booking Form */}
      <Card id="demo-form" className="max-w-2xl mx-auto p-6 sm:p-10 shadow-2xl relative scroll-mt-24">
        <div className="absolute -top-10 left-[-10px] w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
        <h2 className="text-2xl font-extrabold mb-2 text-center Outfit text-foreground">Book a Free Live Demo</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-8 text-center leading-relaxed">
          Schedule a 30-minute walkthrough with our product expert to see how VidyaSanchar fits your institute.
        </p>

        {success && (
          <div className="p-3.5 mb-6 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-300 text-xs sm:text-sm font-semibold text-center">
            ✓ Demo booking submitted successfully! We will contact you on your registered email address shortly.
          </div>
        )}

        {error && (
          <div className="p-3.5 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm font-semibold text-center">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Institute / Contact Person Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder-muted-foreground/60 transition-all"
              placeholder="e.g. Principal - DAV Public School"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder-muted-foreground/60 transition-all"
                placeholder="e.g. principal@davdwarka.edu.in"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Phone Number (WhatsApp)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-4 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder-muted-foreground/60 transition-all"
                placeholder="e.g. +91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Select Demo Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-11 px-4 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground transition-all cursor-pointer"
            >
              <option value="Free Demo Request" className="bg-card text-foreground">Request Free Demo Instance</option>
              <option value="Enterprise Pricing Inquiry" className="bg-card text-foreground">Enterprise Multi-Branch Consultation</option>
              <option value="Self-Host Assistance" className="bg-card text-foreground">Assistance in Self-Hosting VidyaSanchar</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Tell us about your institute *
            </label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-border/80 bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder-muted-foreground/60 transition-all"
              placeholder="e.g. We have 500 students in standard 1 to 12. We want to track CBSE exam scores and monthly fee receipts."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 inline-flex items-center justify-center rounded-xl text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-50 shadow-md shadow-primary/25"
          >
            {submitting ? 'Submitting request...' : 'Book Demo Session'}
            <Send className="ml-2 h-4 w-4" />
          </button>
        </form>
      </Card>
    </div>
  );
};
