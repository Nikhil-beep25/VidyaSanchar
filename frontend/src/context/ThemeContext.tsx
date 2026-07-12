import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
export type ThemePreset = 'purple' | 'blue' | 'emerald' | 'orange' | 'rose' | 'obsidian';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  preset: ThemePreset;
  activeTheme: string;
  selectTheme: (themeId: string) => void;
  setThemeMode: (mode: Theme) => void;
  setThemePreset: (preset: ThemePreset) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read combined theme from localStorage or fallback to system default
  const [activeTheme, setActiveThemeState] = useState<string>(() => {
    const saved = localStorage.getItem('vidyasanchar-theme-preset');
    if (saved) return saved;

    // Check system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'purple-dark' : 'purple-light';
  });

  // Extract mode and preset from activeTheme
  const [preset, setPreset] = useState<ThemePreset>('purple');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Parse preset and mode
    const [p, m] = activeTheme.split('-');
    const parsedPreset = (['purple', 'blue', 'emerald', 'orange', 'rose', 'obsidian'].includes(p) ? p : 'purple') as ThemePreset;
    const parsedTheme = (m === 'dark' ? 'dark' : 'light') as Theme;

    setPreset(parsedPreset);
    setTheme(parsedTheme);

    const root = window.document.documentElement;

    // 1. Update dark mode class
    if (parsedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 2. Update color preset class
    root.classList.remove(
      'preset-purple', 'preset-blue', 'preset-emerald', 'preset-orange', 'preset-rose', 'preset-obsidian'
    );
    root.classList.add(`preset-${parsedPreset}`);

    localStorage.setItem('vidyasanchar-theme-preset', activeTheme);
  }, [activeTheme]);

  const toggleTheme = () => {
    setActiveThemeState(prev => {
      const [p, m] = prev.split('-');
      const nextMode = m === 'dark' ? 'light' : 'dark';
      return `${p}-${nextMode}`;
    });
  };

  const selectTheme = (themeId: string) => {
    setActiveThemeState(themeId);
  };

  const setThemeMode = (mode: Theme) => {
    const [p] = activeTheme.split('-');
    setActiveThemeState(`${p}-${mode}`);
  };

  const setThemePreset = (newPreset: ThemePreset) => {
    const [, m] = activeTheme.split('-');
    setActiveThemeState(`${newPreset}-${m}`);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, toggleTheme, preset, activeTheme, selectTheme, setThemeMode, setThemePreset 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
