import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { ConnectWithUsSection } from '../../components/layout/footer/ConnectWithUsSection';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
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
        skipAuth: true,
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-16 space-y-16">
      {/* Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Contact Our Team</h1>
        <p className="text-lg text-muted-foreground">
          Have questions about self-hosting or managed subscriptions? Get in touch with us.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Our Locations</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                <strong>Delhi:</strong> B-12, Sector 4, Dwarka, New Delhi - 110075
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                <strong>Bengaluru:</strong> Flat 402, Indiranagar, Bengaluru, Karnataka - 560038
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Email Inquiries</h3>
              <a href="mailto:info@vidyasanchar.in" className="text-sm text-primary hover:underline block mt-2">
                info@vidyasanchar.in
              </a>
              <a href="mailto:support@vidyasanchar.in" className="text-sm text-primary hover:underline block mt-1">
                support@vidyasanchar.in
              </a>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Call Support</h3>
              <p className="text-sm text-muted-foreground mt-2 block">
                Office Landline: +91 11 2507 4600
              </p>
              <p className="text-sm text-muted-foreground mt-1 block">
                Mon - Sat (9:00 AM - 6:00 PM IST)
              </p>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2 border rounded-2xl p-8 bg-card shadow-lg">
          <h3 className="font-bold text-xl mb-6">Send us a Message</h3>

          {success && (
            <div className="p-4 mb-6 rounded-lg bg-green-500/15 border border-green-500/30 text-green-500 text-sm">
              ✓ Message sent successfully! Our administrative team will review it and reply shortly.
            </div>
          )}

          {error && (
            <div className="p-4 mb-6 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Ramesh Chandra"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. ramesh@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. +91 9876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Setup issue on local server"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Your Message *
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="e.g. We are installing the docker containers on our server and wanted to ask about configuring the environment variables for postgres..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-10 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? 'Sending message...' : 'Send Message'}
              <Send className="ml-2 h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Connect With Us Section */}
      <ConnectWithUsSection />
    </div>
  );
};
