import { Cell } from './Cell.js';

/**
 * Grid entity
 * Represents the word search grid containing cells
 */
export class Grid {
  constructor(size) {
    this.size = size;
    this.cells = [];
    
    // Initialize 2D array of cells
    for (let row = 0; row < size; row++) {
      this.cells[row] = [];
      for (let col = 0; col < size; col++) {
        this.cells[row][col] = new Cell();
      }
    }
  }

  /**
   * Get the size of the grid
   * @returns {number} Grid size (width/height)
   */
  getSize() {
    return this.size;
  }

  /**
   * Get a cell at the specified position
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {Cell|null} Cell at position or null if invalid
   */
  getCell(row, col) {
    if (!this.isValidPosition(row, col)) {
      return null;
    }
    return this.cells[row][col];
  }

  /**
   * Set a cell at the specified position
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @param {Cell} cell - Cell to set
   * @returns {boolean} True if successful
   */
  setCell(row, col, cell) {
    if (!this.isValidPosition(row, col)) {
      return false;
    }
    this.cells[row][col] = cell;
    return true;
  }

  /**
   * Set a letter at the specified position
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @param {string} letter - Letter to set
   * @returns {boolean} True if successful
   */
  setLetter(row, col, letter) {
    const cell = this.getCell(row, col);
    if (!cell) {
      return false;
    }
    cell.setLetter(letter);
    return true;
  }

  /**
   * Check if a position is valid within the grid
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} True if position is valid
   */
  isValidPosition(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Get all cells in the grid
   * @returns {Array<Array<Cell>>} 2D array of cells
   */
  getAllCells() {
    return this.cells.map(row => [...row]);
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
