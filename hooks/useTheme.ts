import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('theme', 'system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Function to get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Update actual theme based on stored theme and system preference
  useEffect(() => {
    const updateTheme = () => {
      let theme: 'light' | 'dark';
      
      if (storedTheme === 'system') {
        theme = getSystemTheme();
      } else {
        theme = storedTheme;
      }
      
      setActualTheme(theme);
      
      // Apply theme to document
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content', 
          theme === 'dark' ? '#0f172a' : '#ffffff'
        );
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (storedTheme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storedTheme]);

  const setTheme = (theme: Theme) => {
    setStoredTheme(theme);
  };

  const toggleTheme = () => {
    if (storedTheme === 'light') {
      setTheme('dark');
    } else if (storedTheme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const isDark = actualTheme === 'dark';
  const isLight = actualTheme === 'light';
  const isSystem = storedTheme === 'system';

  return {
    theme: storedTheme,
    actualTheme,
    setTheme,
    toggleTheme,
    isDark,
    isLight,
    isSystem,
  };
}