import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { School, Sun, Moon, Menu, X } from 'lucide-react';
import { Footer } from './footer/Footer';

export const LandingLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
              <School className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              VidyaSanchar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors hover:text-primary ${
                    isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <button
                onClick={() => {
                  if (user.role === 'SUPER_ADMIN') navigate('/dashboard/super-admin');
                  else if (user.role === 'ADMIN') navigate('/dashboard/admin');
                  else if (user.role === 'TEACHER') navigate('/dashboard/teacher');
                  else if (user.role === 'STUDENT') navigate('/dashboard/student');
                  else if (user.role === 'PARENT') navigate('/dashboard/parent');
                }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                Go to Dashboard
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                Portal Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-accent"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium hover:text-primary text-muted-foreground"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user.role === 'SUPER_ADMIN') navigate('/dashboard/super-admin');
                  else if (user.role === 'ADMIN') navigate('/dashboard/admin');
                  else if (user.role === 'TEACHER') navigate('/dashboard/teacher');
                  else if (user.role === 'STUDENT') navigate('/dashboard/student');
                  else if (user.role === 'PARENT') navigate('/dashboard/parent');
                }}
                className="w-full text-center py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md"
              >
                Go to Dashboard
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md"
              >
                Portal Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
