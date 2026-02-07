/**
 * HighScore entity
 * Represents a high score entry
 */
export class HighScore {
  constructor(initials, score, difficulty, timestamp = Date.now()) {
    this.initials = this.validateInitials(initials);
    this.score = score;
    this.difficulty = difficulty;
    this.timestamp = timestamp;
  }

  /**
   * Validate and format initials
   * @param {string} initials - Player initials
   * @returns {string} Validated initials (max 3 chars, uppercase)
   */
  validateInitials(initials) {
    if (!initials || typeof initials !== 'string') {
      return 'AAA';
    }
    
    // Remove non-letter characters and convert to uppercase
    const cleaned = initials.replace(/[^A-Za-z]/g, '').toUpperCase();
    
    // Limit to 3 characters, pad with 'A' if needed
    if (cleaned.length === 0) {
      return 'AAA';
    } else if (cleaned.length > 3) {
      return cleaned.substring(0, 3);
    } else {
      return cleaned.padEnd(3, 'A');
    }
  }

  /**
   * Get the initials
   * @returns {string} Player initials
   */
  getInitials() {
    return this.initials;
  }

  /**
   * Get the score
   * @returns {number} Score value
   */
  getScore() {
    return this.score;
  }

  /**
   * Get the difficulty
   * @returns {string} Difficulty level
   */
  getDifficulty() {
    return this.difficulty;
  }

  /**
   * Get the timestamp
   * @returns {number} Timestamp
   */
  getTimestamp() {
    return this.timestamp;
  }

  /**
   * Get formatted date string
   * @returns {string} Formatted date
   */
  getFormattedDate() {
    return new Date(this.timestamp).toLocaleDateString();
  }

  /**
   * Compare this high score with another for sorting
   * @param {HighScore} other - Another high score
   * @returns {number} Negative if this < other, positive if this > other
   */
  compareTo(other) {
    // Higher scores come first
    if (this.score !== other.score) {
      return other.score - this.score;
    }
    // If scores are equal, earlier timestamp comes first
    return this.timestamp - other.timestamp;
  }

  /**
   * Convert to plain object for storage
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      initials: this.initials,
      score: this.score,
      difficulty: this.difficulty,
      timestamp: this.timestamp
    };
  }

  /**
   * Create HighScore from plain object
   * @param {Object} data - Plain object data
   * @returns {HighScore} HighScore instance
   */
  static fromJSON(data) {
    return new HighScore(
      data.initials,
      data.score,
      data.difficulty,
      data.timestamp
    );
  }
}
