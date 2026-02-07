import { HighScore } from '../../domain/entities/HighScore.js';

/**
 * SaveHighScoreUseCase
 * Use case for saving a high score
 */
export class SaveHighScoreUseCase {
  constructor(highScoreRepository) {
    this.highScoreRepository = highScoreRepository;
  }

  /**
   * Execute the use case
   * @param {string} initials - Player initials (max 3 chars)
   * @param {number} score - Score value
   * @param {string} difficulty - Difficulty level
   * @returns {Array} Updated high scores list for the difficulty
   */
  execute(initials, score, difficulty) {
    // Create high score entity
    const highScore = new HighScore(initials, score, difficulty, Date.now());
    
    // Save to repository
    this.highScoreRepository.saveHighScore(highScore);
    
    // Return updated high scores
    return this.highScoreRepository.getHighScores(difficulty);
  }
}
