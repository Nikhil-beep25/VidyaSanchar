import React from 'react';
import { SocialLinks } from './SocialLinks';
import { ShieldCheck, CloudLightning } from 'lucide-react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="border-t bg-card/25 backdrop-blur-md py-4 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Left: Branding & Status */}
        <div className="flex items-center space-x-4 text-muted-foreground font-semibold text-left">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-green-500">Secure Node Online</span>
          </div>
          <span className="h-3 w-px bg-border" />
          <div className="flex items-center space-x-1">
            <CloudLightning className="h-3.5 w-3.5 text-primary" />
            <span>v1.2.4 (Production)</span>
          </div>
        </div>

        {/* Center: Social Channels */}
        <div className="scale-75 origin-center sm:origin-right">
          <SocialLinks />
        </div>

        {/* Right: Copyright */}
        <div className="text-muted-foreground text-center sm:text-right font-medium">
          <span>© {new Date().getFullYear()} VidyaSanchar ERP. Powered by Open Source.</span>
        </div>

      </div>
    </footer>
  );
};
