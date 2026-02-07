import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeScreen,
});

function HomeScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Word Search - Home Screen</h1>
    </div>
  );
}
