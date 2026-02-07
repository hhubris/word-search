/**
 * GetHighScoresUseCase
 * Use case for retrieving high scores
 */
export class GetHighScoresUseCase {
  constructor(highScoreRepository) {
    this.highScoreRepository = highScoreRepository;
  }

  /**
   * Execute the use case
   * @returns {Object} High scores grouped by difficulty
   */
  execute() {
    return {
      EASY: this.highScoreRepository.getHighScores('EASY'),
      MEDIUM: this.highScoreRepository.getHighScores('MEDIUM'),
      HARD: this.highScoreRepository.getHighScores('HARD')
    };
  }

  /**
   * Get high scores for a specific difficulty
   * @param {string} difficulty - Difficulty level
   * @returns {Array} High scores for the difficulty
   */
  executeForDifficulty(difficulty) {
    return this.highScoreRepository.getHighScores(difficulty);
  }
}
