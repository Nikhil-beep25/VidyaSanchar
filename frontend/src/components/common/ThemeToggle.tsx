import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { useTheme, type ThemePreset } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'dropdown' | 'inline';
}

export const presetsList: { code: ThemePreset; name: string; dotColor: string; bgGradient: string }[] = [
  { code: 'purple', name: 'Purple', dotColor: 'bg-purple-500', bgGradient: 'from-purple-600 to-violet-600' },
  { code: 'blue', name: 'Ocean Blue', dotColor: 'bg-blue-500', bgGradient: 'from-blue-600 to-indigo-600' },
  { code: 'emerald', name: 'Cyber', dotColor: 'bg-emerald-500', bgGradient: 'from-emerald-500 to-teal-600' },
  { code: 'orange', name: 'Orange', dotColor: 'bg-orange-500', bgGradient: 'from-orange-500 to-amber-600' },
  { code: 'rose', name: 'Rose Pink', dotColor: 'bg-rose-500', bgGradient: 'from-rose-500 to-pink-600' },
  { code: 'obsidian', name: 'Obsidian', dotColor: 'bg-slate-700 dark:bg-slate-300', bgGradient: 'from-slate-700 to-slate-900' },
];

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'dropdown' }) => {
  const { theme, preset, setThemeMode, setThemePreset } = useTheme();
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

  if (variant === 'inline') {
    return (
      <div className="space-y-3 w-full">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-gray-700 dark:text-slate-200 uppercase tracking-wider">
          <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span>🎨 Theme</span>
        </div>

        {/* Light / Dark Mode Buttons */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-slate-900/80 rounded-xl border border-gray-200 dark:border-slate-800">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setThemeMode('light')}
            className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
              theme === 'light'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>☀️ Light</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setThemeMode('dark')}
            className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            <span>🌙 Dark</span>
          </motion.button>
        </div>

        {/* Theme Color Presets Grid */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold text-gray-500 dark:text-slate-400 uppercase tracking-widest block">
            Color Presets
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {presetsList.map((p) => {
              const isSelected = preset === p.code;
              return (
                <motion.button
                  key={p.code}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setThemePreset(p.code)}
                  className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-md'
                      : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${p.dotColor} flex-shrink-0 ${isSelected ? 'ring-1 ring-white' : ''}`} />
                  <span className="truncate">{p.name.split(' ')[0]}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Dropdown Variant for Desktop Navbar
  return (
    <div className="relative inline-block" ref={containerRef}>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 transition-all duration-300 focus-visible:outline-none cursor-pointer"
        aria-label="Theme Selector"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">Theme</span>
        {theme === 'dark' ? (
          <Moon className="h-3.5 w-3.5 opacity-90" />
        ) : (
          <Sun className="h-3.5 w-3.5 opacity-90" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3.5 shadow-2xl z-50 text-left space-y-3.5"
          >
            {/* Mode Header */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 block">
                Mode
              </span>
              <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-slate-900 rounded-lg border border-gray-200/80 dark:border-slate-800">
                <button
                  onClick={() => setThemeMode('light')}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>☀️ Light</span>
                </button>
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  <span>🌙 Dark</span>
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 block">
                Color Presets
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {presetsList.map((p) => {
                  const isSelected = preset === p.code;
                  return (
                    <button
                      key={p.code}
                      onClick={() => setThemePreset(p.code)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                          : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className={`w-2.5 h-2.5 rounded-full ${p.dotColor} flex-shrink-0`} />
                        <span className="truncate">{p.name}</span>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
