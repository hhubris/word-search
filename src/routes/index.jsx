import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

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
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f0f0f0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', color: '#4F46E5', marginBottom: '10px' }}>Word Search</h1>
          <p style={{ color: '#666' }}>Find hidden words in the grid!</p>
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
                  border: category === cat.value ? '2px solid #4F46E5' : '1px solid #ddd',
                  backgroundColor: category === cat.value ? '#4F46E5' : 'white',
                  color: category === cat.value ? 'white' : '#333',
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
                  border: difficulty === diff.value ? '2px solid #4F46E5' : '1px solid #ddd',
                  backgroundColor: difficulty === diff.value ? '#4F46E5' : 'white',
                  color: difficulty === diff.value ? 'white' : '#333',
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
            backgroundColor: '#4F46E5',
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
            backgroundColor: '#f0f0f0',
            color: '#333',
            border: '1px solid #ddd',
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
