import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/game')({
  component: GameScreen,
  validateSearch: (search) => {
    return {
      category: search.category || 'ANIMALS',
      difficulty: search.difficulty || 'MEDIUM',
    };
  },
});

function GameScreen() {
  const navigate = useNavigate();
  const { category, difficulty } = Route.useSearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
          >
            ← Back to Home
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-indigo-600">Word Search</h1>
            <p className="text-sm text-gray-600">
              {category} • {difficulty}
            </p>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Game Area Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center text-gray-600">
            <p className="text-xl mb-4">Game screen coming soon!</p>
            <p className="text-sm">Category: {category}</p>
            <p className="text-sm">Difficulty: {difficulty}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
