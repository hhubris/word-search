/**
 * Puzzle entity
 * Represents a complete word search puzzle
 */
export class Puzzle {
  constructor(grid, words, category, difficulty) {
    this.grid = grid;
    this.words = words; // Array of Word entities
    this.category = category;
    this.difficulty = difficulty;
    this.foundWords = new Set(); // Set of found word IDs
  }

  /**
   * Mark a word as found
   * @param {string} wordId - Word identifier
   * @returns {boolean} True if word was found and marked
   */
  markWordFound(wordId) {
    const word = this.words.find(w => w.getId() === wordId);
    if (word && !word.isFound()) {
      word.markFound();
      this.foundWords.add(wordId);
      return true;
    }
    return false;
  }

  /**
   * Check if puzzle is complete (all words found)
   * @returns {boolean} True if all words found
   */
  isComplete() {
    return this.foundWords.size === this.words.length;
  }

  /**
   * Get count of found words
   * @returns {number} Number of words found
   */
  getFoundWordCount() {
    return this.foundWords.size;
  }

  /**
   * Get count of total words
   * @returns {number} Total number of words
   */
  getTotalWordCount() {
    return this.words.length;
  }

  /**
   * Get remaining words (not yet found)
   * @returns {Array} Array of Word entities not yet found
   */
  getRemainingWords() {
    return this.words.filter(word => !word.isFound());
  }

  /**
   * Get all found words
   * @returns {Array} Array of found Word entities
   */
  getFoundWords() {
    return this.words.filter(word => word.isFound());
  }

  /**
   * Get all words
   * @returns {Array} Array of all Word entities
   */
  getAllWords() {
    return [...this.words];
  }

  /**
   * Find a word by its text
   * @param {string} text - Word text to find
   * @returns {Word|null} Word entity or null
   */
  findWordByText(text) {
    const upperText = text.toUpperCase();
    return this.words.find(word => word.getText() === upperText) || null;
  }

  /**
   * Find a word by its ID
   * @param {string} wordId - Word identifier
   * @returns {Word|null} Word entity or null
   */
  findWordById(wordId) {
    return this.words.find(word => word.getId() === wordId) || null;
  }

  /**
   * Get the grid
   * @returns {Grid} Grid entity
   */
  getGrid() {
    return this.grid;
  }

  /**
   * Get the category
   * @returns {string} Category name
   */
  getCategory() {
    return this.category;
  }

  /**
   * Get the difficulty
   * @returns {string} Difficulty level
   */
  getDifficulty() {
    return this.difficulty;
  }

  /**
   * Get completion percentage
   * @returns {number} Percentage of words found (0-100)
   */
  getCompletionPercentage() {
    if (this.words.length === 0) return 0;
    return Math.round((this.foundWords.size / this.words.length) * 100);
  }

  /**
   * Check if a specific word has been found
   * @param {string} wordId - Word identifier
   * @returns {boolean} True if word is found
   */
  isWordFound(wordId) {
    return this.foundWords.has(wordId);
  }

  /**
   * Reset all found words (for testing/replay)
   */
  reset() {
    this.foundWords.clear();
    this.words.forEach(word => word.markNotFound());
  }
}
