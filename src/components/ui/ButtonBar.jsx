import { useNavigate } from '@tanstack/react-router';
import { ThemeSwitcher } from './ThemeSwitcher';

/**
 * ButtonBar component
 * Top navigation bar with High Scores button and Theme Switcher
 */
export function ButtonBar() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-5 py-[15px] bg-secondary border-b-2 border-color mb-5">
      <button
        onClick={() => navigate({ to: '/high-scores' })}
        className="px-5 py-2.5 bg-accent text-white border-0 rounded-md cursor-pointer text-sm font-semibold transition-all hover:bg-[var(--accent-hover)]"
      >
        🏆 High Scores
      </button>

      <ThemeSwitcher />
    </div>
  );
}
