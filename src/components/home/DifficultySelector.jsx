const DIFFICULTIES = [
  { value: 'EASY', label: 'Easy', description: '8 words, 12 minute timer, horizontal and vertical only' },
  { value: 'MEDIUM', label: 'Medium', description: '12 words, 5 minute timer, includes diagonals' },
  { value: 'HARD', label: 'Hard', description: '16 words, 3 minute timer, all eight directions' },
];

export function DifficultySelector({ selectedDifficulty, onDifficultySelect }) {
  return (
    <div className="mb-8">
      <label className="block font-bold mb-4 text-primary">
        Choose Difficulty
      </label>
      <div className="grid grid-cols-3 gap-2.5">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.value}
            onClick={() => onDifficultySelect(diff.value)}
            className={`p-4 rounded-md cursor-pointer text-center transition-all ${
              selectedDifficulty === diff.value
                ? 'border-2 border-[var(--accent-color)] bg-accent text-white'
                : 'border border-color bg-secondary text-primary hover:border-[var(--accent-color)]'
            }`}
          >
            <div className="font-bold mb-1">{diff.label}</div>
            <div className="text-xs opacity-80">{diff.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
