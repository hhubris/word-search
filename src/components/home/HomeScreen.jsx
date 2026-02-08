import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { CategorySelector } from './CategorySelector';
import { DifficultySelector } from './DifficultySelector';

const STORAGE_KEY_CATEGORY = 'word-search-last-category';
const STORAGE_KEY_DIFFICULTY = 'word-search-last-difficulty';

export function HomeScreen() {
  const navigate = useNavigate();
  
  // Load saved preferences from localStorage
  const [category, setCategory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORY);
    return saved || null;
  });
  
  const [difficulty, setDifficulty] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DIFFICULTY);
    return saved || null;
  });

  // Save to localStorage whenever selections change
  useEffect(() => {
    if (category) {
      localStorage.setItem(STORAGE_KEY_CATEGORY, category);
    }
  }, [category]);

  useEffect(() => {
    if (difficulty) {
      localStorage.setItem(STORAGE_KEY_DIFFICULTY, difficulty);
    }
  }, [difficulty]);

  const handleStartGame = () => {
    navigate({ 
      to: '/game', 
      search: { category, difficulty } 
    });
  };

  const isStartEnabled = category !== null && difficulty !== null;

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

        <CategorySelector 
          selectedCategory={category} 
          onCategorySelect={setCategory} 
        />

        <DifficultySelector 
          selectedDifficulty={difficulty} 
          onDifficultySelect={setDifficulty} 
        />

        <button
          onClick={handleStartGame}
          disabled={!isStartEnabled}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: isStartEnabled ? 'var(--accent-color)' : 'var(--bg-tertiary)',
            color: isStartEnabled ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '6px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: isStartEnabled ? 'pointer' : 'not-allowed',
            marginBottom: '10px',
            opacity: isStartEnabled ? 1 : 0.6,
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
