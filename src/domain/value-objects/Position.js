/**
 * Position value object
 * Represents a cell position in the grid
 */
export class Position {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  /**
   * Check if this position equals another position
   * @param {Position} other - Position to compare
   * @returns {boolean} True if positions are equal
   */
  equals(other) {
    if (!other) return false;
    return this.row === other.row && this.col === other.col;
  }

  /**
   * Add a direction vector to this position
   * @param {Object} direction - Direction object with dx and dy
   * @returns {Position} New position
   */
  add(direction) {
    return new Position(
      this.row + direction.dy,
      this.col + direction.dx
    );
  }

  /**
   * Create a string representation
   * @returns {string} Position as string
   */
  toString() {
    return `(${this.row}, ${this.col})`;
  }
}
