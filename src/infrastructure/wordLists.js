// Word lists loader using Vite's glob import
// Each category is stored in a separate JSON file for better code splitting

const wordListModules = import.meta.glob('./wordLists/*.json', { eager: true });

// Transform the glob imports into a simple object
export const WORD_LISTS = Object.entries(wordListModules).reduce((acc, [path, module]) => {
  // Extract category name from path: './wordLists/animals.json' -> 'animals'
  const category = path.match(/\/([^/]+)\.json$/)[1];
  acc[category] = module.default;
  return acc;
}, {});

// Export category names for convenience
export const CATEGORIES = Object.keys(WORD_LISTS);
