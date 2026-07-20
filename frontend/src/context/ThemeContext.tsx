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
  // Read combined theme from localStorage or fallback to system default / time-based automatic theme detection
  const [activeTheme, setActiveThemeState] = useState<string>(() => {
    // 1. Check for manual user theme preference
    const savedMode = localStorage.getItem('vidyasanchar-theme');
    
    // 2. Extract theme color preset
    const savedPresetCombined = localStorage.getItem('vidyasanchar-theme-preset');
    const savedPreset = savedPresetCombined ? savedPresetCombined.split('-')[0] : 'purple';
    
    if (savedMode === 'light' || savedMode === 'dark') {
      return `${savedPreset}-${savedMode}`;
    }

    // 3. Fallback to time-based automatic theme detection (6 AM - 5:59 PM is light)
    const hour = new Date().getHours();
    const isMorning = hour >= 6 && hour < 18;
    const detectedMode = isMorning ? 'light' : 'dark';
    return `${savedPreset}-${detectedMode}`;
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

    // 3. Persist manual theme selections
    localStorage.setItem('vidyasanchar-theme-preset', activeTheme);
    localStorage.setItem('vidyasanchar-theme', parsedTheme);
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
