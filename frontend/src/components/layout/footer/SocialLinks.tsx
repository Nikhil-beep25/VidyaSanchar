import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import { SOCIAL_LINKS } from '../../../config/social';

interface SocialLinkItem {
  name: string;
  url: string;
  tooltip: string;
  ariaLabel: string;
  icon: React.ReactNode;
}

export const SocialLinks: React.FC = () => {
  const links: SocialLinkItem[] = [
    {
      name: 'GitHub',
      url: SOCIAL_LINKS.github,
      tooltip: 'Visit GitHub Profile',
      ariaLabel: 'Visit GitHub Profile',
      icon: <Github className="h-5 w-5" />,
    },
    {
      name: 'LinkedIn',
      url: SOCIAL_LINKS.linkedin,
      tooltip: 'Visit LinkedIn Profile',
      ariaLabel: 'Visit LinkedIn Profile',
      icon: <Linkedin className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {links.map((link) => (
        <div key={link.name} className="relative group">
          {/* Custom Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] font-bold text-white bg-slate-900 dark:bg-slate-800 rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 select-none">
            {link.tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800" />
          </div>

          {/* Social Anchor Link */}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-muted/55 hover:bg-violet-100 dark:hover:bg-violet-950/20 text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {link.icon}
          </a>
        </div>
      ))}
    </div>
  );
};
