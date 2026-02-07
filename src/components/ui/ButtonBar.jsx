import { useNavigate } from '@tanstack/react-router';
import { ThemeSwitcher } from './ThemeSwitcher';

/**
 * ButtonBar component
 * Top navigation bar with High Scores button and Theme Switcher
 */
export function ButtonBar() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '2px solid var(--border-color)',
      marginBottom: '20px',
    }}>
      <button
        onClick={() => navigate({ to: '/high-scores' })}
        style={{
          padding: '10px 20px',
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-color)';
        }}
      >
        🏆 High Scores
      </button>

      <ThemeSwitcher />
    </div>
  );
}
