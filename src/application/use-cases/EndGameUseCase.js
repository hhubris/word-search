/**
 * EndGameUseCase
 * Use case for ending a game and calculating score
 */
export class EndGameUseCase {
  constructor(scoringService, highScoreRepository) {
    this.scoringService = scoringService;
    this.highScoreRepository = highScoreRepository;
  }

  /**
   * Execute the use case
   * @param {GameSession} gameSession - Current game session
   * @param {number} endTime - End timestamp (optional, defaults to now)
   * @returns {Object} Result { score: number, isHighScore: boolean, rank: number|null }
   */
  execute(gameSession, endTime = Date.now()) {
    // End the game session
    gameSession.endGame(endTime);
    
    // Calculate score
    const score = this.scoringService.calculateScore(gameSession);
    
    // Check if it's a high score
    const difficulty = gameSession.getDifficulty();
    const isHighScore = this.highScoreRepository.isHighScore(score, difficulty);
    const rank = isHighScore ? this.highScoreRepository.getRank(score, difficulty) : null;
    
    return {
      score,
      isHighScore,
      rank
    };
  }
}
