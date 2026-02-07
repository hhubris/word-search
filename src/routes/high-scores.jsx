import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/high-scores')({
  component: HighScoresScreen,
});

function HighScoresScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/' })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              ← Back to Home
            </button>
            <h1 className="text-3xl font-bold text-indigo-600">High Scores</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* High Scores Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center text-gray-600">
            <p className="text-xl">High scores screen coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
