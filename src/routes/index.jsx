import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

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
  { value: 'EASY', label: 'Easy', description: 'No timer, 2 directions' },
  { value: 'MEDIUM', label: 'Medium', description: '5 min timer, 4 directions' },
  { value: 'HARD', label: 'Hard', description: '3 min timer, 8 directions' },
];

function HomeScreen() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('ANIMALS');
  const [difficulty, setDifficulty] = useState('MEDIUM');

  const handleStartGame = () => {
    navigate({ 
      to: '/game', 
      search: { category, difficulty } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-indigo-600 mb-2">Word Search</h1>
          <p className="text-gray-600">Find hidden words in the grid!</p>
        </div>

        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose a Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    category === cat.value
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Difficulty
            </label>
            <div className="space-y-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => setDifficulty(diff.value)}
                  className={`w-full px-6 py-4 rounded-lg text-left transition-all ${
                    difficulty === diff.value
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold">{diff.label}</div>
                  <div className={`text-sm ${difficulty === diff.value ? 'text-indigo-100' : 'text-gray-500'}`}>
                    {diff.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Game
          </button>

          {/* High Scores Link */}
          <button
            onClick={() => navigate({ to: '/high-scores' })}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all"
          >
            View High Scores
          </button>
        </div>
      </div>
    </div>
  );
}
