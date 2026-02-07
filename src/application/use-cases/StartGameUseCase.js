import { GameSession } from '../../domain/entities/GameSession.js';

/**
 * StartGameUseCase
 * Use case for starting a new game
 */
export class StartGameUseCase {
  constructor(puzzleGenerator, wordRepository) {
    this.puzzleGenerator = puzzleGenerator;
    this.wordRepository = wordRepository;
  }

  /**
   * Execute the use case
   * @param {string} category - Word category
   * @param {string} difficulty - Difficulty level
   * @returns {GameSession} New game session
   */
  execute(category, difficulty) {
    // Generate puzzle
    const puzzle = this.puzzleGenerator.generatePuzzle(
      category,
      difficulty,
      this.wordRepository
    );

    // Create game session
    const gameSession = new GameSession(puzzle, difficulty, Date.now());

    return gameSession;
  }
}
