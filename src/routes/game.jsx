import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/game')({
  component: GameScreen,
});

function GameScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Game Screen</h1>
    </div>
  );
}
