import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
import { MapPin, Mail, Phone, Send, Sparkles, Github, Linkedin, Briefcase, ExternalLink } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { ConnectWithUsSection } from '../../components/layout/footer/ConnectWithUsSection';
import { SOCIAL_LINKS } from '../../config/social';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const isEmailValid = email === '' || validateEmail(email);
  const isNameValid = name === '' || name.trim().length >= 2;
  const isSubjectValid = subject === '' || subject.trim().length >= 4;
  const isMessageValid = message === '' || message.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
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
    <div className="layout-container py-8 sm:py-12 space-y-14 relative text-left">
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      <div className="absolute top-[40%] right-[-15%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />

      {/* Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4 reveal reveal-fade-up">
        <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Support & Enquiries</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight Outfit text-foreground font-sans">Contact Our Team</h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-semibold">
          Have questions about self-hosting, custom features, or custom SaaS deployments? Get in touch with us.
        </p>
      </section>

      {/* Main layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch reveal reveal-fade-up">
        
        {/* LEFT COLUMN: Info Cards & Professional Links */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 reveal reveal-left">
          
          {/* Availability Status Card */}
          <div className="flex items-start space-x-4 border border-emerald-500/20 bg-emerald-500/5 p-6 rounded-2xl group card-hover-saas">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl flex-shrink-0 border border-emerald-500/20 shadow-[0_2px_12px_-3px_rgba(16,185,129,0.25)] transition-transform duration-300 group-hover:scale-110">
              <Briefcase className="h-5 w-5 icon-rotate-hover" />
            </div>
            <div>
              <h3 className="font-extrabold text-base Outfit text-foreground">Availability Status</h3>
              <p className="text-xs text-emerald-500 font-extrabold flex items-center gap-1.5 mt-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Open to Role Offers & Consulting Contracts
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">
                Available to integrate VidyaSanchar ERP or configure custom dashboards on remote servers.
              </p>
            </div>
          </div>

          {/* Developer Contact - GitHub Profile Card */}
          <div className="flex items-start space-x-4 border border-border/80 bg-card p-6 rounded-2xl group card-hover-saas hover:border-violet-300 transition-all duration-300">
            <div className="p-3 bg-violet-100 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 rounded-xl flex-shrink-0 border border-violet-200/50 dark:border-violet-900/30 shadow-[0_2px_12px_-3px_rgba(124,58,237,0.25)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Github className="h-5 w-5 icon-rotate-hover" />
            </div>
            <div className="space-y-3 w-full text-left">
              <div>
                <h3 className="font-extrabold text-base Outfit text-foreground">GitHub</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">
                  Checkout my open-source projects, full-stack prototypes, and active repositories.
                </p>
              </div>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit GitHub Profile"
                className="inline-flex items-center justify-center space-x-1.5 h-9 px-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-violet-300 dark:hover:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/25 text-xs font-bold transition-all shadow-sm duration-300 hover:-translate-y-[0.5px] hover:scale-102 text-[#334155] dark:text-slate-300 focus-visible:outline-none"
              >
                <span>Visit Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Developer Contact - LinkedIn Profile Card */}
          <div className="flex items-start space-x-4 border border-border/80 bg-card p-6 rounded-2xl group card-hover-saas hover:border-violet-300 transition-all duration-300">
            <div className="p-3 bg-violet-100 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 rounded-xl flex-shrink-0 border border-violet-200/50 dark:border-violet-900/30 shadow-[0_2px_12px_-3px_rgba(124,58,237,0.25)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Linkedin className="h-5 w-5 icon-rotate-hover" />
            </div>
            <div className="space-y-3 w-full text-left">
              <div>
                <h3 className="font-extrabold text-base Outfit text-foreground">LinkedIn</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">
                  Connect professionally, browse my work experience, and explore consulting offers.
                </p>
              </div>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit LinkedIn Profile"
                className="inline-flex items-center justify-center space-x-1.5 h-9 px-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-violet-300 dark:hover:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/25 text-xs font-bold transition-all shadow-sm duration-300 hover:-translate-y-[0.5px] hover:scale-102 text-[#334155] dark:text-slate-300 focus-visible:outline-none"
              >
                <span>Visit Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Contact Details stack */}
          <div className="space-y-6 flex-grow">
            {/* Location Card */}
            <div className="flex items-start space-x-4 border border-border/80 bg-card p-6 rounded-2xl group hover:border-primary/20 hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0 border border-primary/20 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.25)]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base Outfit text-foreground">Our Locations</h3>
                <div className="text-xs sm:text-sm text-muted-foreground mt-2.5 space-y-2 leading-relaxed">
                  <p>
                    <strong className="text-foreground/80 block font-bold">Delhi NCR:</strong> Dwarka, New Delhi - 110075
                  </p>
                  <p>
                    <strong className="text-foreground/80 block font-bold">Bengaluru Hub:</strong> Indiranagar, Bengaluru, Karnataka - 560038
                  </p>
                </div>
              </div>
            </div>

            {/* Email Support */}
            <div className="flex items-start space-x-4 border border-border/80 bg-card p-6 rounded-2xl group hover:border-primary/20 hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0 border border-primary/20 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.25)]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base Outfit text-foreground">Email Support</h3>
                <div className="text-xs sm:text-sm mt-2.5 space-y-2.5 font-semibold">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground font-medium">General:</span>
                    <a href="mailto:info@vidyasanchar.in" className="text-primary hover:underline">info@vidyasanchar.in</a>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground font-medium">Technical:</span>
                    <a href="mailto:support@vidyasanchar.in" className="text-primary hover:underline">support@vidyasanchar.in</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Support */}
            <div className="flex items-start space-x-4 border border-border/80 bg-card p-6 rounded-2xl group hover:border-primary/20 hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0 border border-primary/20 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.25)]">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base Outfit text-foreground">Call Channels</h3>
                <div className="text-xs sm:text-sm text-muted-foreground mt-2.5 space-y-1">
                  <p className="font-bold text-foreground/85">Office Hotline: +91 11 2507 4600</p>
                  <p className="font-medium">Mon - Sat (9:00 AM - 6:00 PM IST)</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Modern Glass Form */}
        <Card className="lg:col-span-7 p-6 sm:p-10 shadow-2xl relative flex flex-col justify-center border-border/80 reveal reveal-right">
          <div className="space-y-1 mb-8">
            <h3 className="font-extrabold text-xl Outfit text-foreground">Send us a Message</h3>
            <p className="text-xs text-muted-foreground">Fill in the fields below. Labels float up as you type.</p>
          </div>

          {success && (
            <div className="p-3.5 mb-6 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-300 text-xs sm:text-sm font-semibold text-center animate-in fade-in duration-200">
              ✓ Message sent successfully! Our administrative team will review it and reply shortly.
            </div>
          )}

          {error && (
            <div className="p-3.5 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm font-semibold text-center animate-in fade-in duration-200">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Floating label 1: Name */}
              <div className="relative">
                <input
                  type="text"
                  required
                  id="contact-name"
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`peer block w-full px-4 pt-6 pb-2 text-sm bg-background border rounded-xl focus:outline-none focus-glow text-foreground placeholder-transparent transition-all ${
                    !isNameValid ? 'border-destructive focus:ring-destructive focus:border-destructive' : 'border-border/80'
                  }`}
                />
                <label
                  htmlFor="contact-name"
                  className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/50 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none"
                >
                  Your Name *
                </label>
                {!isNameValid && (
                  <p className="text-[10px] text-destructive font-bold mt-1.5 ml-1">Must be at least 2 characters.</p>
                )}
              </div>

              {/* Floating label 2: Email */}
              <div className="relative">
                <input
                  type="email"
                  required
                  id="contact-email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`peer block w-full px-4 pt-6 pb-2 text-sm bg-background border rounded-xl focus:outline-none focus-glow text-foreground placeholder-transparent transition-all ${
                    !isEmailValid ? 'border-destructive focus:ring-destructive focus:border-destructive' : 'border-border/80'
                  }`}
                />
                <label
                  htmlFor="contact-email"
                  className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/50 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none"
                >
                  Email Address *
                </label>
                {!isEmailValid && (
                  <p className="text-[10px] text-destructive font-bold mt-1.5 ml-1">Please enter a valid email address.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Floating label 3: Phone */}
              <div className="relative">
                <input
                  type="tel"
                  id="contact-phone"
                  placeholder=" "
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="peer block w-full px-4 pt-6 pb-2 text-sm bg-background border border-border/80 rounded-xl focus:outline-none focus-glow text-foreground placeholder-transparent transition-all"
                />
                <label
                  htmlFor="contact-phone"
                  className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/50 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none"
                >
                  Phone (Optional)
                </label>
              </div>

              {/* Floating label 4: Subject */}
              <div className="relative">
                <input
                  type="text"
                  required
                  id="contact-subject"
                  placeholder=" "
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`peer block w-full px-4 pt-6 pb-2 text-sm bg-background border rounded-xl focus:outline-none focus-glow text-foreground placeholder-transparent transition-all ${
                    !isSubjectValid ? 'border-destructive focus:ring-destructive focus:border-destructive' : 'border-border/80'
                  }`}
                />
                <label
                  htmlFor="contact-subject"
                  className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/50 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none"
                >
                  Subject *
                </label>
                {!isSubjectValid && (
                  <p className="text-[10px] text-destructive font-bold mt-1.5 ml-1">Must be at least 4 characters.</p>
                )}
              </div>
            </div>

            {/* Floating label 5: Message */}
            <div className="relative">
              <textarea
                required
                id="contact-message"
                placeholder=" "
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className={`peer block w-full px-4 pt-6 pb-2 text-sm bg-background border rounded-xl focus:outline-none focus-glow text-foreground placeholder-transparent transition-all ${
                  !isMessageValid ? 'border-destructive focus:ring-destructive focus:border-destructive' : 'border-border/80'
                }`}
              />
              <label
                htmlFor="contact-message"
                className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/50 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none"
              >
                Your Message *
              </label>
              {!isMessageValid && (
                <p className="text-[10px] text-destructive font-bold mt-1.5 ml-1">Must be at least 10 characters.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || !isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid}
              className="w-full h-11 inline-flex items-center justify-center rounded-xl text-sm font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-50 shadow-md shadow-primary/25 pt-0.5 btn-saas"
            >
              {submitting ? 'Sending message...' : 'Send Message'}
              <Send className="ml-2 h-4 w-4" />
            </button>
          </form>
        </Card>
      </section>

      {/* Connect With Us Section */}
      <ConnectWithUsSection />
    </div>
  );
};
