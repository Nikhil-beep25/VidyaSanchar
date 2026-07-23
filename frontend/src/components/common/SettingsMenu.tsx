import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Moon, Laptop, Globe, Palette, Check, Info, ChevronDown } from 'lucide-react';
import { useTheme, type ThemeMode, type ThemePreset } from '../../context/ThemeContext';

interface SettingsMenuProps {
  variant?: 'dropdown' | 'mobile-sheet';
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

const accentColors: { code: ThemePreset; name: string; dotColor: string }[] = [
  { code: 'purple', name: 'Purple', dotColor: 'bg-purple-500' },
  { code: 'orange', name: 'Orange', dotColor: 'bg-orange-500' },
  { code: 'emerald', name: 'Cyber', dotColor: 'bg-emerald-500' },
  { code: 'blue', name: 'Emerald', dotColor: 'bg-blue-500' },
];

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ variant = 'dropdown' }) => {
  const { mode, theme, preset, setThemeMode, setThemePreset } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('vidyasanchar-lang') || 'en');
  const [showAboutModal, setShowAboutModal] = useState(false);
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

  const handleLanguageChange = (code: string) => {
    setLang(code);
    localStorage.setItem('vidyasanchar-lang', code);
  };

  // Button Trigger
  const triggerButton = (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="inline-flex items-center space-x-2 h-[42px] px-4 py-2 rounded-xl bg-transparent border border-gray-200 dark:border-white/10 hover:bg-[#7C3AED]/12 hover:border-[#A78BFA]/35 text-xs font-bold text-gray-800 dark:text-slate-200 transition-all duration-200 focus-visible:outline-none cursor-pointer"
      aria-label="Settings Menu"
    >
      <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400 transition-transform duration-300 hover:rotate-90" />
      <span>Settings</span>
      <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );

  const menuContent = (
    <div className="space-y-4 text-left font-sans">
      {/* Header */}
      <div className="flex items-center space-x-2 text-xs font-extrabold text-gray-900 dark:text-slate-100 uppercase tracking-wider">
        <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        <span>Settings</span>
      </div>

      <div className="border-t border-gray-200 dark:border-slate-800" />

      {/* 🎨 Theme Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-gray-700 dark:text-slate-300">
          <Palette className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          <span>Theme</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 dark:bg-slate-900/80 rounded-xl border border-gray-200/80 dark:border-slate-800">
          <button
            onClick={() => setThemeMode('system')}
            className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
              mode === 'system'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
            }`}
          >
            <Laptop className="h-3 w-3" />
            <span>System</span>
          </button>
          <button
            onClick={() => setThemeMode('light')}
            className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
              mode === 'light'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
            }`}
          >
            <Sun className="h-3 w-3" />
            <span>Light</span>
          </button>
          <button
            onClick={() => setThemeMode('dark')}
            className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
              mode === 'dark'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
            }`}
          >
            <Moon className="h-3 w-3" />
            <span>Dark</span>
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-slate-800" />

      {/* 🌐 Language Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-gray-700 dark:text-slate-300">
          <Globe className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          <span>Language</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {languages.map((l) => {
            const isSelected = lang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => handleLanguageChange(l.code)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                    : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <span>{l.flag}</span>
                  <span>{l.name}</span>
                </span>
                {isSelected && <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-slate-800" />

      {/* 🎨 Accent Color Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-gray-700 dark:text-slate-300">
          <Palette className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          <span>Accent Color</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {accentColors.map((color) => {
            const isSelected = preset === color.code;
            return (
              <button
                key={color.code}
                onClick={() => setThemePreset(color.code)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                    : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${color.dotColor}`} />
                  <span>{color.name}</span>
                </span>
                {isSelected && <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-slate-800" />

      {/* 💻 About Section */}
      <div className="space-y-1.5">
        <button
          onClick={() => setShowAboutModal(!showAboutModal)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all border border-gray-200 dark:border-slate-800"
        >
          <span className="flex items-center space-x-2">
            <Info className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>About VidyaSanchar</span>
          </span>
          <span className="text-[10px] text-gray-400 font-mono">v1.0.0</span>
        </button>

        {showAboutModal && (
          <div className="p-2.5 bg-purple-50/60 dark:bg-purple-950/30 rounded-lg text-[11px] text-gray-600 dark:text-slate-300 leading-relaxed border border-purple-200 dark:border-purple-900">
            <p className="font-bold text-purple-700 dark:text-purple-300">VidyaSanchar School ERP</p>
            <p>Version 1.0.0 • Modern SaaS Platform for Schools, Institutes & Universities.</p>
          </div>
        )}
      </div>
    </div>
  );

  if (variant === 'mobile-sheet') {
    return (
      <div className="w-full p-4 bg-gray-50/70 dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-800">
        {menuContent}
      </div>
    );
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      {triggerButton}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-2xl z-50 text-left"
          >
            {menuContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
