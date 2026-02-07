import { getDifficultyConfig } from '../value-objects/Difficulty.js';

/**
 * GameSession entity
 * Represents an active game session with timing and scoring
 */
export class GameSession {
  constructor(puzzle, difficulty, startTime = Date.now()) {
    this.puzzle = puzzle;
    this.difficulty = difficulty;
    this.startTime = startTime;
    this.endTime = null;
    this.score = null;
    this.timerDuration = this.getTimerDuration();
  }

  /**
   * Get timer duration based on difficulty
   * @returns {number|null} Duration in seconds or null for no timer
   */
  getTimerDuration() {
    const config = getDifficultyConfig(this.difficulty);
    return config.timerSeconds;
  }

  /**
   * Get remaining time in seconds
   * @param {number} currentTime - Current timestamp
   * @returns {number|null} Seconds remaining or null if no timer
   */
  getRemainingTime(currentTime = Date.now()) {
    if (this.timerDuration === null) {
      return null; // No timer for this difficulty
    }

    if (this.endTime !== null) {
      return 0; // Game has ended
    }

    const elapsedSeconds = Math.floor((currentTime - this.startTime) / 1000);
    const remaining = this.timerDuration - elapsedSeconds;
    
    return Math.max(0, remaining);
  }

  /**
   * Check if timer has expired
   * @param {number} currentTime - Current timestamp
   * @returns {boolean} True if timer expired
   */
  isTimeExpired(currentTime = Date.now()) {
    if (this.timerDuration === null) {
      return false; // No timer means never expires
    }

    const remaining = this.getRemainingTime(currentTime);
    return remaining === 0;
  }

  /**
   * Calculate score based on performance
   * @param {number} endTime - End timestamp
   * @returns {number} Calculated score
   */
  calculateScore(endTime = Date.now()) {
    const wordsFound = this.puzzle.getFoundWordCount();
    const totalWords = this.puzzle.getTotalWordCount();
    
    // Base points: 100 per word found
    const basePoints = wordsFound * 100;
    
    // Completion bonus: 500 points for finding all words
    const completionBonus = wordsFound === totalWords ? 500 : 0;
    
    // Time bonus: points for remaining time (if timed)
    let timeBonus = 0;
    if (this.timerDuration !== null) {
      const remainingTime = this.getRemainingTime(endTime);
      timeBonus = Math.floor(remainingTime * 10); // 10 points per second remaining
    }
    
    // Difficulty multiplier
    const multiplier = this.getDifficultyMultiplier();
    
    const totalScore = Math.floor((basePoints + completionBonus + timeBonus) * multiplier);
    
    return Math.max(0, totalScore);
  }

  /**
   * Get difficulty multiplier for scoring
   * @returns {number} Multiplier value
   */
  getDifficultyMultiplier() {
    switch (this.difficulty) {
      case 'EASY':
        return 1.0;
      case 'MEDIUM':
        return 1.5;
      case 'HARD':
        return 2.0;
      default:
        return 1.0;
    }
  }

  /**
   * End the game session
   * @param {number} endTime - End timestamp
   * @returns {number} Final score
   */
  endGame(endTime = Date.now()) {
    if (this.endTime === null) {
      this.endTime = endTime;
      this.score = this.calculateScore(endTime);
    }
    return this.score;
  }

  /**
   * Check if game has ended
   * @returns {boolean} True if game ended
   */
  isEnded() {
    return this.endTime !== null;
  }

  /**
   * Get the puzzle
   * @returns {Puzzle} Puzzle entity
   */
  getPuzzle() {
    return this.puzzle;
  }

  /**
   * Get the difficulty
   * @returns {string} Difficulty level
   */
  getDifficulty() {
    return this.difficulty;
  }

  /**
   * Get the start time
   * @returns {number} Start timestamp
   */
  getStartTime() {
    return this.startTime;
  }

  /**
   * Get the end time
   * @returns {number|null} End timestamp or null
   */
  getEndTime() {
    return this.endTime;
  }

  /**
   * Get the final score
   * @returns {number|null} Score or null if not ended
   */
  getScore() {
    return this.score;
  }

  /**
   * Get elapsed time in seconds
   * @param {number} currentTime - Current timestamp
   * @returns {number} Elapsed seconds
   */
  getElapsedTime(currentTime = Date.now()) {
    const endTime = this.endTime || currentTime;
    return Math.floor((endTime - this.startTime) / 1000);
  }
}
