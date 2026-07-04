import React from 'react';
import { SocialLinks } from './SocialLinks';
import { Mail, Phone, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react';

export const ConnectWithUsSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-md shadow-xl p-8 lg:p-12 text-left">
      {/* Background soft gradient overlay */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
        
        {/* Left Column: Heading */}
        <div className="space-y-4 lg:col-span-1">
          <div className="inline-flex items-center space-x-2 rounded-full border bg-muted/60 px-3 py-1 text-xs font-semibold text-primary w-fit">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Official Support Node</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Connect With Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            We're here to help schools, educators, students, and parents succeed with modern education technology.
          </p>
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Join Social Ecosystem</h4>
            <SocialLinks />
          </div>
        </div>

        {/* Center/Right: Grid details */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          
          {/* Card 1: Email Channels */}
          <div className="border rounded-xl p-5 bg-card/30 hover:bg-card/70 transition-colors duration-300 space-y-3">
            <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-lg">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">School ERP Support</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Write to us for deployments or queries.</p>
            </div>
            <div className="space-y-1 pt-1 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-muted-foreground">General Support:</span>
                <a href="mailto:support@vidyasanchar.in" className="text-primary hover:underline">
                  support@vidyasanchar.in
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sales Inquiries:</span>
                <a href="mailto:sales@vidyasanchar.in" className="text-primary hover:underline">
                  sales@vidyasanchar.in
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Phone & WhatsApp */}
          <div className="border rounded-xl p-5 bg-card/30 hover:bg-card/70 transition-colors duration-300 space-y-3">
            <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-lg">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Calling Channels</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Direct phone and chat-support helpdesk.</p>
            </div>
            <div className="space-y-1 pt-1 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Office Hotline:</span>
                <a href="tel:+919876543210" className="text-foreground hover:underline font-mono">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  WhatsApp Chat:
                </span>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-400 hover:underline font-mono"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Location Details */}
          <div className="border rounded-xl p-5 bg-card/30 hover:bg-card/70 transition-colors duration-300 space-y-3">
            <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-lg">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Corporate Office</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Headquarters & branch operations.</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              New Delhi, India
            </p>
          </div>

          {/* Card 4: Working Hours */}
          <div className="border rounded-xl p-5 bg-card/30 hover:bg-card/70 transition-colors duration-300 space-y-3">
            <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Working Hours</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Official support window timings.</p>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Monday–Saturday:</span>
              <span className="font-semibold text-foreground">9:00 AM – 6:00 PM IST</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
