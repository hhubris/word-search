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
    <div className="min-h-screen bg-primary p-5">
      <div className="max-w-[800px] mx-auto bg-secondary p-10 rounded-lg border border-color relative">
        {/* Theme Switcher in top right */}
        <div className="absolute top-[15px] right-[15px]">
          <ThemeSwitcher />
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-5xl accent-color mb-2.5">
            Word Search
          </h1>
          <p className="text-secondary">Find hidden words in the grid!</p>
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
          className={`w-full p-4 rounded-md text-lg font-bold mb-2.5 transition-all border-0 ${
            isStartEnabled
              ? 'bg-accent text-white cursor-pointer hover:bg-[var(--accent-hover)]'
              : 'bg-tertiary text-secondary cursor-not-allowed opacity-60'
          }`}
        >
          Start Game
        </button>

        <button
          onClick={() => navigate({ to: '/high-scores' })}
          className="w-full p-3 bg-tertiary text-primary border border-color rounded-md text-base font-semibold cursor-pointer hover:border-[var(--accent-color)] transition-all"
        >
          View High Scores
        </button>
      </div>
    </div>
  );
}
