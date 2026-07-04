import React, { useState } from 'react';

interface AvatarProps {
  imageUrl?: string | null;
  fullName: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({ imageUrl, fullName, role, size = 'md' }) => {
  // Priority: 1 & 2. Try imageUrl, 3. Fallback to default local admin, 4. Fallback to initials
  const [displayMode, setDisplayMode] = useState<'image' | 'default' | 'initials'>(() => {
    if (imageUrl) return 'image';
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') return 'default';
    return 'initials';
  });

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-xs',
    lg: 'h-12 w-12 text-sm',
    xl: 'h-16 w-16 text-lg',
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleImageError = () => {
    if (displayMode === 'image') {
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        setDisplayMode('default');
      } else {
        setDisplayMode('initials');
      }
    } else if (displayMode === 'default') {
      setDisplayMode('initials');
    }
  };

  if (displayMode === 'image' && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={fullName}
        onError={handleImageError}
        className={`${sizeClasses[size]} rounded-full object-cover border flex-shrink-0`}
        loading="lazy"
      />
    );
  }

  if (displayMode === 'default') {
    return (
      <img
        src="/assets/avatars/admin-male.png"
        alt="Default Admin Avatar"
        onError={handleImageError}
        className={`${sizeClasses[size]} rounded-full object-cover border flex-shrink-0`}
        loading="lazy"
      />
    );
  }

  // Initials fallback
  const colors = [
    'bg-primary/20 text-primary border-primary/30',
    'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30',
    'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
    'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
  ];
  const colorIndex = fullName.length % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold tracking-wider border flex-shrink-0 ${colorClass} select-none`}
    >
      {getInitials(fullName)}
    </div>
  );
};
