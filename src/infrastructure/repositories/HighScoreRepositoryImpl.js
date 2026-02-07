import { HighScore } from '../../domain/entities/HighScore.js';

/**
 * HighScoreRepositoryImpl
 * Implementation of high score repository using localStorage
 */
export class HighScoreRepositoryImpl {
  constructor(storageAdapter) {
    this.storage = storageAdapter;
    this.storageKey = 'word-search-high-scores';
  }

  /**
   * Get high scores for a difficulty level
   * @param {string} difficulty - Difficulty level (EASY, MEDIUM, HARD)
   * @returns {Array} Array of HighScore entities, sorted by score (highest first)
   */
  getHighScores(difficulty) {
    const allScores = this.storage.get(this.storageKey) || {};
    const difficultyScores = allScores[difficulty] || [];
    
    return difficultyScores
      .map(data => new HighScore(
        data.initials,
        data.score,
        data.difficulty,
        data.timestamp
      ))
      .sort((a, b) => b.getScore() - a.getScore());
  }

  /**
   * Save a high score
   * @param {HighScore} highScore - HighScore entity to save
   * @returns {boolean} True if saved successfully
   */
  saveHighScore(highScore) {
    try {
      const allScores = this.storage.get(this.storageKey) || {};
      const difficulty = highScore.getDifficulty();
      const difficultyScores = allScores[difficulty] || [];
      
      // Add new score
      difficultyScores.push({
        initials: highScore.getInitials(),
        score: highScore.getScore(),
        difficulty: highScore.getDifficulty(),
        timestamp: highScore.getTimestamp()
      });
      
      // Sort by score (highest first)
      difficultyScores.sort((a, b) => b.score - a.score);
      
      // Keep only top 10
      allScores[difficulty] = difficultyScores.slice(0, 10);
      
      return this.storage.set(this.storageKey, allScores);
    } catch (error) {
      console.error('Error saving high score:', error);
      return false;
    }
  }

  /**
   * Get top N scores for a difficulty level
   * @param {string} difficulty - Difficulty level
   * @param {number} limit - Maximum number of scores to return (default 10)
   * @returns {Array} Array of HighScore entities
   */
  getTopScores(difficulty, limit = 10) {
    const scores = this.getHighScores(difficulty);
    return scores.slice(0, limit);
  }

  /**
   * Check if a score qualifies as a high score
   * @param {number} score - Score to check
   * @param {string} difficulty - Difficulty level
   * @returns {boolean} True if score qualifies
   */
  isHighScore(score, difficulty) {
    const highScores = this.getHighScores(difficulty);
    
    // If less than 10 scores, always qualifies
    if (highScores.length < 10) {
      return true;
    }
    
    // Check if score is higher than the lowest high score
    const lowestHighScore = highScores[highScores.length - 1];
    return score > lowestHighScore.getScore();
  }

  /**
   * Get the rank of a score
   * @param {number} score - Score to check
   * @param {string} difficulty - Difficulty level
   * @returns {number|null} Rank (1-10) or null if doesn't qualify
   */
  getRank(score, difficulty) {
    const highScores = this.getHighScores(difficulty);
    
    // Find where this score would rank
    let rank = 1;
    for (const highScore of highScores) {
      if (score > highScore.getScore()) {
        return rank;
      }
      rank++;
    }
    
    // If we get here, check if it still qualifies (less than 10 scores)
    if (highScores.length < 10) {
      return rank;
    }
    
    return null; // Doesn't qualify
  }

  /**
   * Clear all high scores
   * @returns {boolean} True if cleared successfully
   */
  clearHighScores() {
    return this.storage.set(this.storageKey, {});
  }

  /**
   * Clear high scores for a specific difficulty
   * @param {string} difficulty - Difficulty level
   * @returns {boolean} True if cleared successfully
   */
  clearDifficultyScores(difficulty) {
    try {
      const allScores = this.storage.get(this.storageKey) || {};
      delete allScores[difficulty];
      return this.storage.set(this.storageKey, allScores);
    } catch (error) {
      console.error('Error clearing difficulty scores:', error);
      return false;
    }
  }

  /**
   * Get all high scores (all difficulties)
   * @returns {Object} Object with difficulty keys and HighScore arrays
   */
  getAllHighScores() {
    const allScores = this.storage.get(this.storageKey) || {};
    const result = {};
    
    for (const difficulty in allScores) {
      result[difficulty] = allScores[difficulty].map(data => 
        new HighScore(
          data.initials,
          data.score,
          data.difficulty,
          data.timestamp
        )
      );
    }
    
    return result;
  }
}
