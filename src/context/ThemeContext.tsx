import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  isDarkMode: boolean;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  textScaling: 'default' | 'large' | 'extra_large';
  setTextScaling: (scale: 'default' | 'large' | 'extra_large') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem('sg_theme') as AppTheme) || 'light';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('sg_high_contrast') === 'true';
  });

  const [textScaling, setTextScalingState] = useState<'default' | 'large' | 'extra_large'>(() => {
    return (localStorage.getItem('sg_text_scaling') as any) || 'default';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const updateDark = () => {
      let isDark = false;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateDark();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('sg_theme', newTheme);
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    localStorage.setItem('sg_high_contrast', String(val));
  };

  const setTextScaling = (scale: 'default' | 'large' | 'extra_large') => {
    setTextScalingState(scale);
    localStorage.setItem('sg_text_scaling', scale);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDarkMode,
        highContrast,
        setHighContrast,
        textScaling,
        setTextScaling,
      }}
    >
      <div
        className={`${highContrast ? 'contrast-125' : ''} ${
          textScaling === 'large' ? 'text-lg' : textScaling === 'extra_large' ? 'text-xl' : 'text-base'
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
