import { Cell } from './Cell.js';

/**
 * Grid entity
 * Represents the puzzle grid containing cells
 */
export class Grid {
  constructor(size) {
    this.size = size;
    this.cells = this.initializeCells(size);
  }

  /**
   * Initialize empty grid cells
   * @param {number} size - Grid size (square)
   * @returns {Array} 2D array of Cell objects
   */
  initializeCells(size) {
    const cells = [];
    for (let row = 0; row < size; row++) {
      cells[row] = [];
      for (let col = 0; col < size; col++) {
        cells[row][col] = new Cell('');
      }
    }
    return cells;
  }

  /**
   * Get a cell at a specific position
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {Cell|null} Cell object or null if out of bounds
   */
  getCell(row, col) {
    if (!this.isValidPosition(row, col)) {
      return null;
    }
    return this.cells[row][col];
  }

  /**
   * Set a cell at a specific position
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @param {Cell} cell - Cell object
   */
  setCell(row, col, cell) {
    if (this.isValidPosition(row, col)) {
      this.cells[row][col] = cell;
    }
  }

  /**
   * Set a letter at a specific position
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @param {string} letter - Letter to set
   */
  setLetter(row, col, letter) {
    if (this.isValidPosition(row, col)) {
      this.cells[row][col] = new Cell(letter);
    }
  }

  /**
   * Check if a position is valid (within grid bounds)
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} True if valid
   */
  isValidPosition(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Get the grid size
   * @returns {number} Grid size
   */
  getSize() {
    return this.size;
  }

  /**
   * Check if grid is square and within max size
   * @param {number} maxSize - Maximum allowed size
   * @returns {boolean} True if valid
   */
  isValidSize(maxSize = 12) {
    return this.size <= maxSize;
  }

  /**
   * Get all cells as 2D array
   * @returns {Array} 2D array of cells
   */
  getCells() {
    return this.cells;
  }

  /**
   * Fill empty cells with random letters
   * @param {Array} excludeWords - Words to avoid creating
   */
  fillEmptyCells(excludeWords = []) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const cell = this.getCell(row, col);
        if (cell && cell.isEmpty()) {
          const randomLetter = letters[Math.floor(Math.random() * letters.length)];
          this.setLetter(row, col, randomLetter);
        }
      }
    }
  }

  /**
   * Convert grid to string representation (for debugging)
   * @returns {string} Grid as string
   */
  toString() {
    let result = '';
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const cell = this.getCell(row, col);
        result += cell ? cell.getLetter() || '.' : '.';
        result += ' ';
      }
      result += '\n';
    }
    return result;
  }
}
