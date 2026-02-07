import { WORD_LISTS, CATEGORIES } from '../wordLists/index.js';

/**
 * WordRepositoryImpl
 * Implementation of word repository using static word lists
 */
export class WordRepositoryImpl {
  constructor() {
    this.wordLists = WORD_LISTS;
    this.categories = CATEGORIES;
  }

  /**
   * Get words by category
   * @param {string} category - Category name
   * @returns {Array} Array of words (3-8 characters, uppercase)
   */
  getWordsByCategory(category) {
    const words = this.wordLists[category.toLowerCase()];
    
    if (!words) {
      console.warn(`Category not found: ${category}`);
      return [];
    }

    // Filter words to ensure they meet length requirements (3-8 chars)
    return words
      .filter(word => word.length >= 3 && word.length <= 8)
      .map(word => word.toUpperCase());
  }

  /**
   * Get all available categories
   * @returns {Array} Array of category names
   */
  getAllCategories() {
    return this.categories.map(cat => {
      // Capitalize first letter
      return cat.charAt(0).toUpperCase() + cat.slice(1);
    });
  }

  /**
   * Get word count for a category
   * @param {string} category - Category name
   * @returns {number} Number of words in category
   */
  getWordCount(category) {
    const words = this.getWordsByCategory(category);
    return words.length;
  }

  /**
   * Check if a category exists
   * @param {string} category - Category name
   * @returns {boolean} True if category exists
   */
  hasCategory(category) {
    return this.categories.includes(category.toLowerCase());
  }
}
