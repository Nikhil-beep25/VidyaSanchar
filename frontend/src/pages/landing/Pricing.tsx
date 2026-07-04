import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
import { Check, Send } from 'lucide-react';

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
    <div className="container max-w-7xl mx-auto px-4 py-16 space-y-24">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Flexible Pricing Plans</h1>
        <p className="text-lg text-muted-foreground">
          VidyaSanchar code is 100% free and open-source. Choose to self-host for free, or use our secure cloud deployment.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`border rounded-2xl p-8 bg-card flex flex-col justify-between hover:shadow-xl transition-shadow relative ${
              tier.active ? 'border-primary shadow-md' : 'border-border'
            }`}
          >
            {tier.active && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-xl">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">{tier.desc}</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">{tier.price}</span>
                <span className="text-muted-foreground ml-2 text-sm">/{tier.period}</span>
              </div>
              <ul className="space-y-3 text-sm">
                {tier.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8">
              <a
                href="#demo-form"
                className={`w-full block text-center py-2.5 rounded-md text-sm font-medium transition-colors ${
                  tier.active
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {tier.buttonText}
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Booking Form */}
      <section id="demo-form" className="max-w-xl mx-auto border rounded-2xl p-8 bg-card shadow-lg relative scroll-mt-24">
        <h2 className="text-2xl font-bold mb-2 text-center">Book a Free Live Demo</h2>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Schedule a 30-minute walkthrough with our product expert to see how VidyaSanchar fits your institute.
        </p>

        {success && (
          <div className="p-4 mb-6 rounded-lg bg-green-500/15 border border-green-500/30 text-green-500 text-sm">
            ✓ Demo booking submitted successfully! We will contact you on your registered email address shortly.
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Institute / Contact Person Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="e.g. Principal - DAV Public School"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="e.g. principal@davdwarka.edu.in"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Phone Number (WhatsApp)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="e.g. +91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Select Demo Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="Free Demo Request">Request Free Demo Instance</option>
              <option value="Enterprise Pricing Inquiry">Enterprise Multi-Branch Consultation</option>
              <option value="Self-Host Assistance">Assistance in Self-Hosting VidyaSanchar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Tell us about your institute *
            </label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="e.g. We have 500 students in standard 1 to 12. We want to track CBSE exam scores and monthly fee receipts."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-10 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Submitting request...' : 'Book Demo Session'}
            <Send className="ml-2 h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
  );
};
