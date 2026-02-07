import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/high-scores')({
  component: HighScoresScreen,
});

function HighScoresScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">High Scores Screen</h1>
    </div>
  );
}
