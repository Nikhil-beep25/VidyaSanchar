import React from 'react';
import { Link } from 'react-router-dom';
import { SocialLinks } from './SocialLinks';
import { School, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navigationSections = [
    {
      title: 'Project Info',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Features & Modules', path: '/features' },
        { name: 'Development Roadmap', path: '/pricing' },
      ],
    },
    {
      title: 'Support & Feedback',
      links: [
        { name: 'Contact & Inquiries', path: '/contact' },
        { name: 'Frequently Asked FAQs', path: '/faq' },
      ],
    },
  ];

  return (
    <footer className="relative bg-background text-left transition-colors duration-300" role="contentinfo">
      {/* Dynamic Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Brand column: Span 6 */}
        <div className="lg:col-span-6 space-y-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <School className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              VidyaSanchar
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            VidyaSanchar is an open-source School ERP prototype developed to demonstrate modern full-stack application architecture. It showcases authentication, academic management modules, responsive design, and scalable backend development.
          </p>
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Connect with the Developer</h4>
            <SocialLinks />
          </div>
        </div>

        {/* Navigation links: Column 1 (Span 3) */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            {navigationSections[0].title}
          </h4>
          <ul className="space-y-3">
            {navigationSections[0].links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation links: Column 2 (Span 3) */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            {navigationSections[1].title}
          </h4>
          <ul className="space-y-3">
            {navigationSections[1].links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Footer */}
      <div className="border-t border-border/60 bg-card/25 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-[11px] text-muted-foreground text-center md:text-left font-medium">
            <p>
              © {currentYear} VidyaSanchar Project. Deployed as open source under MIT License.
            </p>
          </div>

          <div className="text-[11px] text-muted-foreground text-center md:text-right font-medium">
            <p>
              Made with <Heart className="h-3.5 w-3.5 text-rose-500 inline-block fill-current animate-pulse" /> for academic showcase.
            </p>
          </div>

        </div>
      </div>

    </footer>
  );
};
