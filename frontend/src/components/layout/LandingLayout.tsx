import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { Footer } from './footer/Footer';

export const LandingLayout: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Scroll Reveal Intersection Observer Controller
  useEffect(() => {
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
            }
          });
        },
        { 
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px'
        }
      );
      revealElements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 120);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Scroll to hash element if it exists in URL
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative theme-transition font-sans overflow-x-clip">
      {/* SaaS Navbar */}
      <Navbar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      {/* Mobile Drawer */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <main key={location.pathname} className="flex-grow relative z-10 page-transition-enter">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

