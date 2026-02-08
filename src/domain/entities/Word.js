import { Position } from '../value-objects/Position.js';

/**
 * Word entity
 * Represents a word placed in the puzzle
 */
export class Word {
  constructor(id, text, startPos, direction) {
    this.id = id;
    this.text = text.toUpperCase();
    this.startPos = startPos; // Position object
    this.direction = direction; // Direction object
    this.found = false;
  }

  /**
   * Calculate all cell positions this word occupies
   * @returns {Array} Array of Position objects
   */
  getPositions() {
    const positions = [];
    let currentPos = this.startPos;

    for (let i = 0; i < this.text.length; i++) {
      positions.push(currentPos);
      // Move to next position using direction
      currentPos = new Position(
        currentPos.row + this.direction.dy,
        currentPos.col + this.direction.dx
      );
    }

    return positions;
  }

  /**
   * Mark this word as found
   */
  markFound() {
    this.found = true;
  }

  /**
   * Mark this word as not found
   */
  markNotFound() {
    this.found = false;
  }

  /**
   * Check if this word has been found
   * @returns {boolean} True if found
   */
  isFound() {
    return this.found;
  }

  /**
   * Get the word text
   * @returns {string} Uppercase word text
   */
  getText() {
    return this.text;
  }

  /**
   * Get the word ID
   * @returns {string} Word identifier
   */
  getId() {
    return this.id;
  }

  /**
   * Get the start position
   * @returns {Position} Starting position
   */
  getStartPosition() {
    return this.startPos;
  }

  /**
   * Get the direction
   * @returns {Object} Direction object
   */
  getDirection() {
    return this.direction;
  }

  /**
   * Get the word length
   * @returns {number} Length of word
   */
  getLength() {
    return this.text.length;
  }
}
