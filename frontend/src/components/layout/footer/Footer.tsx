import React from 'react';
import { Link } from 'react-router-dom';
import { SocialLinks } from './SocialLinks';
import { NewsletterSignup } from './NewsletterSignup';
import { School, ShieldCheck, Heart, Users, Award, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navigationSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', path: '/features' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Integrations', path: '#integrations' },
        { name: 'Updates', path: '#updates' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Careers', path: '#careers' },
        { name: 'Blog', path: '#blog' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', path: '#docs' },
        { name: 'Help Center', path: '#help' },
        { name: 'Community', path: '#community' },
        { name: 'FAQs', path: '/faq' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '#privacy' },
        { name: 'Terms & Conditions', path: '#terms' },
        { name: 'Security Policy', path: '#security' },
        { name: 'Cookie Policy', path: '#cookie' },
      ],
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Students Managed', icon: <Users className="h-4 w-4 text-primary" /> },
    { value: '500+', label: 'Teachers Supported', icon: <Award className="h-4 w-4 text-primary" /> },
    { value: '50+', label: 'Schools Connected', icon: <School className="h-4 w-4 text-primary" /> },
  ];

  const trustBadges = [
    { name: 'Made for Indian Schools', icon: <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">🇮🇳 Bharat Ready</span> },
    { name: 'Secure ERP Platform', icon: <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">🔒 SSL Encrypted</span> },
    { name: 'GDPR Friendly', icon: <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">🛡️ GDPR Compliant</span> },
    { name: 'Data Privacy Focused', icon: <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">🔑 ISO 27001</span> },
  ];

  return (
    <footer className="border-t bg-muted/20 text-left" role="contentinfo">
      
      {/* 1. Statistics Section */}
      <div className="border-b bg-card/45 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center md:space-x-3 space-y-2 md:space-y-0 p-4 border rounded-xl bg-background/50 hover:shadow-md transition-shadow">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                {stat.icon}
              </div>
              <div>
                <span className="block text-xl font-black text-primary font-mono">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="container max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Brand column: Span 4 */}
        <div className="lg:col-span-4 space-y-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
              <School className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              VidyaSanchar
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            An enterprise-grade, premium open-source school ERP designed specifically for CBSE, ICSE, and state-board institutions in India. Streamline attendance, fee collection ledgers, examinations, and digital library systems.
          </p>
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Follow Our Channels</h4>
            <SocialLinks />
          </div>
        </div>

        {/* Navigation links: Span 5 */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter: Span 3 */}
        <div className="lg:col-span-3">
          <NewsletterSignup />
        </div>

      </div>

      {/* 3. Bottom Footer */}
      <div className="border-t bg-card/20 py-8">
        <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {trustBadges.map((badge, idx) => (
              <div key={idx} title={badge.name}>
                {badge.icon}
              </div>
            ))}
          </div>

          {/* Copyright Info */}
          <div className="text-xs text-muted-foreground text-center md:text-right font-medium">
            <p>
              © {currentYear} VidyaSanchar ERP. Powered by open source. Made in India with{' '}
              <Heart className="h-3 w-3 text-red-500 inline-block fill-current animate-pulse" /> for schools.
            </p>
          </div>

        </div>
      </div>

    </footer>
  );
};
