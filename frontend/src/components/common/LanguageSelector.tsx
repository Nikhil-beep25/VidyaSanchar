import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'inline';
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'dropdown' }) => {
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('vidyasanchar-lang') || 'en';
  });
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setSelectedLang(code);
    localStorage.setItem('vidyasanchar-lang', code);
    setIsOpen(false);
  };

  const currentLangObj = languages.find(l => l.code === selectedLang) || languages[0];

  if (variant === 'inline') {
    return (
      <div className="space-y-2 w-full">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-gray-700 dark:text-slate-200 uppercase tracking-wider">
          <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span>🌐 Language</span>
        </div>
        <div className="relative">
          <select
            value={selectedLang}
            onChange={(e) => handleSelect(e.target.value)}
            className="w-full py-2.5 px-3.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-gray-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-xs font-bold text-gray-700 dark:text-slate-200 shadow-sm transition-all duration-200 focus-visible:outline-none cursor-pointer"
        aria-label="Language Selector"
      >
        <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        <span className="hidden sm:inline">{currentLangObj.name}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1.5 shadow-2xl z-50 text-left space-y-0.5"
          >
            {languages.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
