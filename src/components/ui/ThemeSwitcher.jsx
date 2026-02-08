import { useTheme } from '../../application/hooks/useTheme';

/**
 * ThemeSwitcher component
 * Button to cycle through themes: Light → Dark → System
 */
export function ThemeSwitcher() {
  const { theme, cycleTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'LIGHT':
        return '☀️';
      case 'DARK':
        return '🌙';
      case 'SYSTEM':
        return '💻';
      default:
        return '☀️';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'LIGHT':
        return 'Light';
      case 'DARK':
        return 'Dark';
      case 'SYSTEM':
        return 'System';
      default:
        return 'Light';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="px-3 py-1.5 bg-tertiary border border-border rounded-md cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:opacity-80"
      title={`Current theme: ${getThemeLabel()}. Click to cycle.`}
    >
      <span className="text-sm">{getThemeIcon()}</span>
      <span>{getThemeLabel()}</span>
    </button>
  );
}
