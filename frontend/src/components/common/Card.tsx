import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverLift?: boolean;
  glowOnHover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverLift = false,
  glowOnHover = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-card text-card-foreground border border-border/80 rounded-2xl p-6 shadow-sm transition-all duration-300 theme-transition ${
        hoverLift ? 'hover:-translate-y-1 hover:shadow-md hover:border-border/60' : ''
      } ${
        glowOnHover ? 'hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_hsl(var(--primary)/0.1)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
