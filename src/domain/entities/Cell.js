/**
 * Cell entity
 * Represents a single cell in the puzzle grid
 */
export class Cell {
  constructor(letter, isPartOfWord = false) {
    this.letter = letter.toUpperCase();
    this.isPartOfWord = isPartOfWord;
    this.wordIds = []; // IDs of words this cell belongs to
  }

  /**
   * Add a word ID to this cell
   * @param {string} wordId - Word identifier
   */
  addWordId(wordId) {
    if (!this.wordIds.includes(wordId)) {
      this.wordIds.push(wordId);
      this.isPartOfWord = true;
    }
  }

  /**
   * Check if this cell is part of a specific word
   * @param {string} wordId - Word identifier
   * @returns {boolean} True if cell belongs to word
   */
  belongsToWord(wordId) {
    return this.wordIds.includes(wordId);
  }

  /**
   * Get the letter in this cell
   * @returns {string} Uppercase letter
   */
  getLetter() {
    return this.letter;
  }

  /**
   * Check if this cell is empty
   * @returns {boolean} True if no letter
   */
  isEmpty() {
    return !this.letter || this.letter === '';
  }
}
