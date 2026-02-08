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
    <div className="mb-8">
      <label className="block font-bold mb-4 text-primary">
        Choose a Category
      </label>
      <div className="grid grid-cols-4 gap-2.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategorySelect(cat.value)}
            className={`p-3 rounded-md cursor-pointer transition-all ${
              selectedCategory === cat.value
                ? 'border-2 border-[var(--accent-color)] bg-accent text-white font-bold'
                : 'border border-color bg-secondary text-primary hover:border-[var(--accent-color)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
