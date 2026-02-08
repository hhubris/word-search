/**
 * Cell entity
 * Represents a single cell in the word search grid
 */
export class Cell {
  constructor(letter = '') {
    this.letter = letter ? letter.toUpperCase() : '';
    this.wordIds = []; // Array of word IDs this cell belongs to
  }

  /**
   * Get the letter in this cell
   * @returns {string} Uppercase letter
   */
  getLetter() {
    return this.letter;
  }

  /**
   * Set the letter in this cell
   * @param {string} letter - Letter to set
   */
  setLetter(letter) {
    this.letter = letter ? letter.toUpperCase() : '';
  }

  /**
   * Check if this cell is empty
   * @returns {boolean} True if no letter
   */
  isEmpty() {
    return !this.letter || this.letter === '';
  }

  /**
   * Add a word ID to this cell
   * @param {string} wordId - Word identifier
   */
  addWordId(wordId) {
    if (!this.wordIds.includes(wordId)) {
      this.wordIds.push(wordId);
    }
  }

  /**
   * Get all word IDs this cell belongs to
   * @returns {Array<string>} Array of word IDs
   */
  getWordIds() {
    return [...this.wordIds];
  }

  /**
   * Check if this cell is part of any word
   * @returns {boolean} True if cell belongs to at least one word
   */
  isPartOfWord() {
    return this.wordIds.length > 0;
  }

  /**
   * Check if this cell belongs to a specific word
   * @param {string} wordId - Word identifier
   * @returns {boolean} True if cell belongs to the word
   */
  belongsToWord(wordId) {
    return this.wordIds.includes(wordId);
  }
}
