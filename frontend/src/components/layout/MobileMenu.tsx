import React, { useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { School, X, Home, Sparkles, Layers, Compass, Mail, LogIn } from 'lucide-react';
import { SettingsMenu } from '../common/SettingsMenu';
import { useAuth } from '../../context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4 text-purple-600 dark:text-purple-400" /> },
    { name: 'Features', path: '/features', icon: <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" /> },
    { name: 'Modules', path: '/modules', icon: <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" /> },
    { name: 'Roadmap', path: '/roadmap', icon: <Compass className="h-4 w-4 text-purple-600 dark:text-purple-400" /> },
    { name: 'Contact', path: '/contact', icon: <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" /> },
  ];

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sliding Drawer Container */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-950 h-full shadow-2xl p-6 flex flex-col justify-between z-10 border-l border-gray-200 dark:border-slate-800 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-slate-800/80 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
                    <School className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-extrabold text-base text-gray-900 dark:text-slate-100">VidyaSanchar</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors"
                  aria-label="Close Menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                          : 'text-gray-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 dark:hover:text-purple-400'
                      }`
                    }
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-slate-800" />

              {/* ⚙️ Settings Section (Mobile Sheet) */}
              <SettingsMenu variant="mobile-sheet" />

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-slate-800" />
            </div>

            {/* Bottom Section: Portal Login CTA */}
            <div className="pt-4 mt-6">
              {user ? (
                <button
                  onClick={() => {
                    onClose();
                    if (user.role === 'SUPER_ADMIN') navigate('/dashboard/super-admin');
                    else if (user.role === 'ADMIN') navigate('/dashboard/admin');
                    else if (user.role === 'TEACHER') navigate('/dashboard/teacher');
                    else if (user.role === 'STUDENT') navigate('/dashboard/student');
                    else if (user.role === 'PARENT') navigate('/dashboard/parent');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Portal Login</span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
