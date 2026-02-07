import { Position } from './Position.js';
import { getDirection } from './Direction.js';

/**
 * Selection value object
 * Represents a player's word selection
 */
export class Selection {
  constructor(positions = []) {
    this.positions = positions;
  }

  /**
   * Get the start position
   * @returns {Position|null} First position or null
   */
  getStart() {
    return this.positions.length > 0 ? this.positions[0] : null;
  }

  /**
   * Get the end position
   * @returns {Position|null} Last position or null
   */
  getEnd() {
    return this.positions.length > 0 
      ? this.positions[this.positions.length - 1] 
      : null;
  }

  /**
   * Get the direction of this selection
   * @returns {Object|null} Direction object or null
   */
  getDirection() {
    if (this.positions.length < 2) return null;
    return getDirection(this.positions[0], this.positions[1]);
  }

  /**
   * Get all positions in this selection
   * @returns {Array} Array of Position objects
   */
  getPositions() {
    return [...this.positions];
  }

  /**
   * Extract text from grid cells
   * @param {Object} grid - Grid object with cells
   * @returns {string} Extracted text
   */
  getText(grid) {
    return this.positions
      .map(pos => {
        if (pos.row >= 0 && pos.row < grid.cells.length &&
            pos.col >= 0 && pos.col < grid.cells[pos.row].length) {
          return grid.cells[pos.row][pos.col];
        }
        return '';
      })
      .join('')
      .toUpperCase();
  }

  /**
   * Get the length of this selection
   * @returns {number} Number of positions
   */
  length() {
    return this.positions.length;
  }

  /**
   * Check if selection is empty
   * @returns {boolean} True if empty
   */
  isEmpty() {
    return this.positions.length === 0;
  }

  /**
   * Add a position to the selection
   * @param {Position} position - Position to add
   * @returns {Selection} New selection with added position
   */
  addPosition(position) {
    return new Selection([...this.positions, position]);
  }

  /**
   * Clear the selection
   * @returns {Selection} Empty selection
   */
  clear() {
    return new Selection([]);
  }
}
