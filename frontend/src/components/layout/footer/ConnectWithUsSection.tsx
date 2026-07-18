import React from 'react';
import { SocialLinks } from './SocialLinks';
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { Card } from '../../common/Card';

export const ConnectWithUsSection: React.FC = () => {
  return (
    <Card className="relative overflow-hidden p-8 lg:p-12 text-left">
      {/* Background soft gradient overlay */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
        
        {/* Left Column: Heading */}
        <div className="space-y-4 lg:col-span-1">
          <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary w-fit">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Official Support Node</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight Outfit">Connect With Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            We're here to help schools, educators, students, and parents succeed with modern education technology.
          </p>
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Connect with the Developer</h4>
            <SocialLinks />
          </div>
        </div>

        {/* Center/Right: Grid details */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          
          {/* Card 1: Email Channels */}
          <div className="border border-border/80 rounded-2xl p-5 bg-card hover:border-primary/20 transition-all duration-300 space-y-3">
            <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl border border-primary/25">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-foreground Outfit">School ERP Support</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Write to us for deployments or queries.</p>
            </div>
            <div className="space-y-1.5 pt-1 text-xs font-medium">
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
          <div className="border border-border/80 rounded-2xl p-5 bg-card hover:border-primary/20 transition-all duration-300 space-y-3">
            <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl border border-primary/25">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-foreground Outfit">Calling Channels</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Direct phone and chat-support helpdesk.</p>
            </div>
            <div className="space-y-1.5 pt-1 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Office Hotline:</span>
                <a href="tel:+919876543210" className="text-foreground hover:underline font-mono font-semibold">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">WhatsApp Chat:</span>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline font-mono font-semibold"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Location Details */}
          <div className="border border-border/80 rounded-2xl p-5 bg-card hover:border-primary/20 transition-all duration-300 space-y-3">
            <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl border border-primary/25">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-foreground Outfit">Corporate Office</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Headquarters & branch operations.</p>
            </div>
            <p className="text-xs text-foreground/85 leading-relaxed font-semibold">
              New Delhi & Bengaluru, India
            </p>
          </div>

          {/* Card 4: Working Hours */}
          <div className="border border-border/80 rounded-2xl p-5 bg-card hover:border-primary/20 transition-all duration-300 space-y-3">
            <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl border border-primary/25">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-foreground Outfit">Working Hours</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Official support window timings.</p>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Monday–Saturday:</span>
              <span className="text-foreground">9:00 AM – 6:00 PM IST</span>
            </div>
          </div>

        </div>

      </div>
    </Card>
  );
};
