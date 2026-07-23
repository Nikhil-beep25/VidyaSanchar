import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SettingsMenu } from '../common/SettingsMenu';
import { 
  School, Home, Sparkles, Layers, Compass, Mail, LogIn, Menu, X, Github 
} from 'lucide-react';
import { SOCIAL_LINKS } from '../../config/social';
import { motion } from 'framer-motion';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-3.5 w-3.5" /> },
    { name: 'Features', path: '/features', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { name: 'Modules', path: '/modules', icon: <Layers className="h-3.5 w-3.5" /> },
    { name: 'Roadmap', path: '/roadmap', icon: <Compass className="h-3.5 w-3.5" /> },
    { name: 'Contact', path: '/contact', icon: <Mail className="h-3.5 w-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b bg-white/80 dark:bg-[#050816]/80 backdrop-blur-xl border-gray-200/60 dark:border-slate-800/60 shadow-sm theme-transition">
      {/* Dynamic Top Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-20 flex items-center justify-between relative navbar-enter">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link 
            to="/" 
            className="flex items-center space-x-3 group z-10 relative transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl"
          >
            <div className="p-2 rounded-full bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
              <School className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-base tracking-tight text-[#0F172A] dark:text-[#F9FAFB] leading-none font-sans group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                VidyaSanchar
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 dark:text-slate-400 uppercase mt-1">
                School ERP
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav 
          className="hidden lg:flex items-center gap-1.5 rounded-full border border-gray-200/70 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm px-3 py-1.5 flex-shrink-0 whitespace-nowrap"
          role="navigation" 
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `h-10 flex items-center px-4 rounded-full text-xs font-bold transition-all duration-300 focus-visible:outline-none ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-extrabold shadow-md shadow-purple-500/10' 
                    : 'text-gray-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 dark:hover:text-purple-400'
                }`
              }
            >
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Controls: GitHub | Settings | Portal Login | Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 z-10 relative flex-shrink-0 flex-nowrap whitespace-nowrap">
          {/* GitHub Link (desktop/tablet) */}
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center space-x-1.5 h-10 px-3.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-purple-300 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/25 text-xs font-bold shadow-sm transition-all duration-300 hover:-translate-y-[1px] text-gray-700 dark:text-slate-300 focus-visible:outline-none"
            title="GitHub Repository"
            aria-label="Visit GitHub Profile"
          >
            <Github className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>GitHub</span>
          </a>

          {/* Settings Menu Button & Dropdown (Desktop Only) */}
          <div className="hidden lg:inline-block">
            <SettingsMenu variant="dropdown" />
          </div>

          {/* Portal Action Button */}
          {user ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (user.role === 'SUPER_ADMIN') navigate('/dashboard/super-admin');
                else if (user.role === 'ADMIN') navigate('/dashboard/admin');
                else if (user.role === 'TEACHER') navigate('/dashboard/teacher');
                else if (user.role === 'STUDENT') navigate('/dashboard/student');
                else if (user.role === 'PARENT') navigate('/dashboard/parent');
              }}
              className="inline-flex items-center space-x-1.5 h-10 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-extrabold tracking-wide shadow-md shadow-purple-500/20 transition-all duration-300 focus-visible:outline-none cursor-pointer"
            >
              <span>Dashboard</span>
            </motion.button>
          ) : (
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center space-x-1.5 h-10 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-extrabold tracking-wide shadow-md shadow-purple-500/20 transition-all duration-300 focus-visible:outline-none cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Portal Login</span>
              </motion.div>
            </Link>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-gray-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors focus-visible:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
