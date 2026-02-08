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

export function CategorySelector({ selectedCategory, onCategorySelect }) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '15px' }}>
        Choose a Category
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategorySelect(cat.value)}
            style={{
              padding: '12px',
              border: selectedCategory === cat.value ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
              backgroundColor: selectedCategory === cat.value ? 'var(--accent-color)' : 'var(--bg-secondary)',
              color: selectedCategory === cat.value ? 'white' : 'var(--text-primary)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: selectedCategory === cat.value ? 'bold' : 'normal',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
