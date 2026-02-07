/**
 * ScoringService
 * Domain service for calculating game scores
 */
export class ScoringService {
  /**
   * Calculate score for a game session
   * @param {GameSession} gameSession - The game session
   * @returns {number} Calculated score
   */
  calculateScore(gameSession) {
    const puzzle = gameSession.getPuzzle();
    const wordsFound = puzzle.getFoundWordCount();
    const totalWords = puzzle.getTotalWordCount();
    
    // Base score: 100 points per word found
    const baseScore = wordsFound * 100;
    
    // Completion bonus: 500 points for finding all words
    const completionBonus = wordsFound === totalWords ? 500 : 0;
    
    // Time bonus: 10 points per second remaining (if timed)
    let timeBonus = 0;
    const timerDuration = gameSession.getTimerDuration();
    if (timerDuration !== null) {
      const endTime = gameSession.getEndTime() || Date.now();
      const elapsedSeconds = Math.floor((endTime - gameSession.getStartTime()) / 1000);
      const remainingSeconds = Math.max(0, timerDuration - elapsedSeconds);
      timeBonus = remainingSeconds * 10;
    }
    
    // Difficulty multiplier: Easy 1.0x, Medium 1.5x, Hard 2.0x
    const multiplier = this.getDifficultyMultiplier(gameSession.getDifficulty());
    
    // Calculate total score with multiplier
    const totalScore = Math.floor((baseScore + completionBonus + timeBonus) * multiplier);
    
    return Math.max(0, totalScore);
  }

  /**
   * Get difficulty multiplier for scoring
   * @param {string} difficulty - Difficulty level (EASY, MEDIUM, HARD)
   * @returns {number} Multiplier value
   */
  getDifficultyMultiplier(difficulty) {
    switch (difficulty) {
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
   * Calculate base score (words found * 100)
   * @param {number} wordsFound - Number of words found
   * @returns {number} Base score
   */
  calculateBaseScore(wordsFound) {
    return wordsFound * 100;
  }

  /**
   * Calculate completion bonus
   * @param {number} wordsFound - Number of words found
   * @param {number} totalWords - Total number of words
   * @returns {number} Completion bonus (500 if all found, 0 otherwise)
   */
  calculateCompletionBonus(wordsFound, totalWords) {
    return wordsFound === totalWords ? 500 : 0;
  }

  /**
   * Calculate time bonus
   * @param {number|null} remainingSeconds - Remaining time in seconds (null if no timer)
   * @returns {number} Time bonus (10 points per second)
   */
  calculateTimeBonus(remainingSeconds) {
    if (remainingSeconds === null) {
      return 0;
    }
    return Math.floor(remainingSeconds) * 10;
  }
}
