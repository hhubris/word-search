import { useState, useEffect } from 'react';
import { getContainer } from '../container';

/**
 * useTheme hook
 * Manages theme state and applies theme to document
 */
export function useTheme() {
  const container = getContainer();
  const { changeThemeUseCase } = container;
  
  const [theme, setTheme] = useState(() => {
    return changeThemeUseCase.getCurrentTheme();
  });

  // Apply theme to document when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Initialize theme on mount
  useEffect(() => {
    const currentTheme = changeThemeUseCase.getCurrentTheme();
    setTheme(currentTheme);
    applyTheme(currentTheme);
  }, []);

  /**
   * Apply theme to document
   * @param {string} themeValue - Theme to apply (LIGHT, DARK, SYSTEM)
   */
  const applyTheme = (themeValue) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    if (themeValue === 'SYSTEM') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      // Use explicit theme
      root.classList.add(themeValue.toLowerCase());
    }
  };

  /**
   * Cycle to next theme
   */
  const cycleTheme = () => {
    const nextTheme = changeThemeUseCase.execute();
    setTheme(nextTheme);
  };

  /**
   * Set specific theme
   * @param {string} newTheme - Theme to set
   */
  const setSpecificTheme = (newTheme) => {
    changeThemeUseCase.setTheme(newTheme);
    setTheme(newTheme);
  };

  return {
    theme,
    cycleTheme,
    setTheme: setSpecificTheme,
    isLight: theme === 'LIGHT',
    isDark: theme === 'DARK',
    isSystem: theme === 'SYSTEM',
  };
}
