import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemePreset = 'purple' | 'blue' | 'emerald' | 'orange' | 'rose' | 'obsidian';

interface ThemeContextType {
  mode: ThemeMode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  preset: ThemePreset;
  activeTheme: string;
  selectTheme: (themeId: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setThemePreset: (preset: ThemePreset) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('vidyasanchar-theme-mode') as ThemeMode;
    if (savedMode === 'system' || savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }
    // Backward compatibility with previous key
    const legacyMode = localStorage.getItem('vidyasanchar-theme');
    if (legacyMode === 'light' || legacyMode === 'dark') {
      return legacyMode;
    }
    return 'system';
  });

  const [preset, setPresetState] = useState<ThemePreset>(() => {
    const savedPresetCombined = localStorage.getItem('vidyasanchar-theme-preset');
    const p = savedPresetCombined ? savedPresetCombined.split('-')[0] : 'purple';
    return (['purple', 'blue', 'emerald', 'orange', 'rose', 'obsidian'].includes(p) ? p : 'purple') as ThemePreset;
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const getSystemTheme = (): 'light' | 'dark' => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const computedTheme = mode === 'system' ? getSystemTheme() : mode;
    setEffectiveTheme(computedTheme);

    const root = window.document.documentElement;

    // Apply dark class
    if (computedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply color preset
    root.classList.remove(
      'preset-purple', 'preset-blue', 'preset-emerald', 'preset-orange', 'preset-rose', 'preset-obsidian'
    );
    root.classList.add(`preset-${preset}`);

    // Persist
    localStorage.setItem('vidyasanchar-theme-mode', mode);
    localStorage.setItem('vidyasanchar-theme', computedTheme);
    localStorage.setItem('vidyasanchar-theme-preset', `${preset}-${computedTheme}`);

    // Listen for system theme changes if mode is 'system'
    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const nextTheme = e.matches ? 'dark' : 'light';
        setEffectiveTheme(nextTheme);
        if (nextTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [mode, preset]);

  const toggleTheme = () => {
    setModeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const setThemePreset = (newPreset: ThemePreset) => {
    setPresetState(newPreset);
  };

  const selectTheme = (themeId: string) => {
    const [p, m] = themeId.split('-');
    if (['purple', 'blue', 'emerald', 'orange', 'rose', 'obsidian'].includes(p)) {
      setPresetState(p as ThemePreset);
    }
    if (m === 'light' || m === 'dark' || m === 'system') {
      setModeState(m as ThemeMode);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      mode,
      theme: effectiveTheme, 
      toggleTheme, 
      preset, 
      activeTheme: `${preset}-${effectiveTheme}`, 
      selectTheme, 
      setThemeMode, 
      setThemePreset 
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
