import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { getContainer } from '../application/container';

/**
 * Root route component
 * Initializes theme and provides layout wrapper
 */
function RootComponent() {
  const container = getContainer();
  const { changeThemeUseCase } = container;

  // Initialize and apply theme on mount
  useEffect(() => {
    const currentTheme = changeThemeUseCase.getCurrentTheme();
    applyTheme(currentTheme);

    // Listen for system theme changes when in SYSTEM mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const theme = changeThemeUseCase.getCurrentTheme();
      if (theme === 'SYSTEM') {
        applyTheme(theme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [changeThemeUseCase]);

  /**
   * Apply theme to document
   * @param {string} themeValue - Theme to apply (LIGHT, DARK, SYSTEM)
   */
  const applyTheme = (themeValue) => {
    const root = document.documentElement;
    
    // Remove existing theme data attribute
    root.removeAttribute('data-theme');
    
    if (themeValue === 'SYSTEM') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      // Use explicit theme
      root.setAttribute('data-theme', themeValue.toLowerCase());
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Outlet />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
