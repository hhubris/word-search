import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { ThemeSwitcher } from '../components/ui/ThemeSwitcher';

export const Route = createFileRoute('/')({
  component: HomeScreen,
});

const CATEGORIES = [
  { value: 'ANIMALS', label: 'Animals' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'SCIENCE', label: 'Science' },
  { value: 'FOOD', label: 'Food' },
  { value: 'GEOGRAPHY', label: 'Geography' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'MUSIC', label: 'Music' },
  { value: 'MOVIES', label: 'Movies' },
];

const DIFFICULTIES = [
  { value: 'EASY', label: 'Easy', description: '10 min timer, 2 directions' },
  { value: 'MEDIUM', label: 'Medium', description: '5 min timer, 4 directions' },
  { value: 'HARD', label: 'Hard', description: '3 min timer, 8 directions' },
];

const STORAGE_KEY_CATEGORY = 'word-search-last-category';
const STORAGE_KEY_DIFFICULTY = 'word-search-last-difficulty';

function HomeScreen() {
  const navigate = useNavigate();
  
  // Load saved preferences from localStorage
  const [category, setCategory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORY);
    return saved || 'ANIMALS';
  });
  
  const [difficulty, setDifficulty] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DIFFICULTY);
    return saved || 'MEDIUM';
  });

  // Save to localStorage whenever selections change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATEGORY, category);
  }, [category]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DIFFICULTY, difficulty);
  }, [difficulty]);

  const handleStartGame = () => {
    navigate({ 
      to: '/game', 
      search: { category, difficulty } 
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-secondary)', padding: '40px', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative' }}>
        {/* Theme Switcher in top right */}
        <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
          <ThemeSwitcher />
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', color: 'var(--accent-color)', marginBottom: '10px' }}>Word Search</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Find hidden words in the grid!</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '15px' }}>
            Choose a Category
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                style={{
                  padding: '12px',
                  border: category === cat.value ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  backgroundColor: category === cat.value ? 'var(--accent-color)' : 'var(--bg-secondary)',
                  color: category === cat.value ? 'white' : 'var(--text-primary)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: category === cat.value ? 'bold' : 'normal',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '15px' }}>
            Choose Difficulty
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setDifficulty(diff.value)}
                style={{
                  padding: '16px',
                  border: difficulty === diff.value ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  backgroundColor: difficulty === diff.value ? 'var(--accent-color)' : 'var(--bg-secondary)',
                  color: difficulty === diff.value ? 'white' : 'var(--text-primary)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{diff.label}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>{diff.description}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStartGame}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          Start Game
        </button>

        <button
          onClick={() => navigate({ to: '/high-scores' })}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          View High Scores
        </button>
      </div>
    </div>
  );
}
