const DIFFICULTIES = [
  { value: 'EASY', label: 'Easy', description: '8 words, no timer, horizontal and vertical only' },
  { value: 'MEDIUM', label: 'Medium', description: '12 words, 5 minute timer, includes diagonals' },
  { value: 'HARD', label: 'Hard', description: '16 words, 3 minute timer, all eight directions' },
];

export function DifficultySelector({ selectedDifficulty, onDifficultySelect }) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '15px' }}>
        Choose Difficulty
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.value}
            onClick={() => onDifficultySelect(diff.value)}
            style={{
              padding: '16px',
              border: selectedDifficulty === diff.value ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
              backgroundColor: selectedDifficulty === diff.value ? 'var(--accent-color)' : 'var(--bg-secondary)',
              color: selectedDifficulty === diff.value ? 'white' : 'var(--text-primary)',
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
  );
}
