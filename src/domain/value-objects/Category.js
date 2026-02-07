/**
 * Category enum
 * Defines all available word categories
 */

export const Category = {
  ANIMALS: 'animals',
  SPORTS: 'sports',
  SCIENCE: 'science',
  FOOD: 'food',
  GEOGRAPHY: 'geography',
  TECHNOLOGY: 'technology',
  MUSIC: 'music',
  MOVIES: 'movies'
};

/**
 * Category display names
 */
export const CategoryDisplayNames = {
  [Category.ANIMALS]: 'Animals',
  [Category.SPORTS]: 'Sports',
  [Category.SCIENCE]: 'Science',
  [Category.FOOD]: 'Food',
  [Category.GEOGRAPHY]: 'Geography',
  [Category.TECHNOLOGY]: 'Technology',
  [Category.MUSIC]: 'Music',
  [Category.MOVIES]: 'Movies'
};

/**
 * Get all categories
 * @returns {Array} Array of category keys
 */
export function getAllCategories() {
  return Object.values(Category);
}

/**
 * Get display name for a category
 * @param {string} category - Category key
 * @returns {string} Display name
 */
export function getCategoryDisplayName(category) {
  return CategoryDisplayNames[category] || category;
}
