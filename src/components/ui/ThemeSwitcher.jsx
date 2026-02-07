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
      style={{
        padding: '6px 12px',
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
      title={`Current theme: ${getThemeLabel()}. Click to cycle.`}
    >
      <span style={{ fontSize: '14px' }}>{getThemeIcon()}</span>
      <span>{getThemeLabel()}</span>
    </button>
  );
}
