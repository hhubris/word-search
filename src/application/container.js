/**
 * Dependency Injection Container
 * Wires all dependencies and exports configured use cases
 */

// Infrastructure - Storage
import { LocalStorageAdapter } from '../infrastructure/storage/LocalStorageAdapter.js';

// Infrastructure - Repositories
import { WordRepositoryImpl } from '../infrastructure/repositories/WordRepositoryImpl.js';
import { HighScoreRepositoryImpl } from '../infrastructure/repositories/HighScoreRepositoryImpl.js';
import { ThemeRepositoryImpl } from '../infrastructure/repositories/ThemeRepositoryImpl.js';

// Domain Services
import { PuzzleGeneratorService } from '../domain/services/PuzzleGeneratorService.js';
import { WordSelectionService } from '../domain/services/WordSelectionService.js';
import { ScoringService } from '../domain/services/ScoringService.js';

// Application Use Cases
import { StartGameUseCase } from './use-cases/StartGameUseCase.js';
import { SelectWordUseCase } from './use-cases/SelectWordUseCase.js';
import { EndGameUseCase } from './use-cases/EndGameUseCase.js';
import { SaveHighScoreUseCase } from './use-cases/SaveHighScoreUseCase.js';
import { GetHighScoresUseCase } from './use-cases/GetHighScoresUseCase.js';
import { ChangeThemeUseCase } from './use-cases/ChangeThemeUseCase.js';

/**
 * Create and configure the dependency injection container
 * @returns {Object} Container with all configured use cases
 */
export function createContainer() {
  // Infrastructure Layer - Storage
  const storageAdapter = new LocalStorageAdapter();

  // Infrastructure Layer - Repositories
  const wordRepository = new WordRepositoryImpl();
  const highScoreRepository = new HighScoreRepositoryImpl(storageAdapter);
  const themeRepository = new ThemeRepositoryImpl(storageAdapter);

  // Domain Layer - Services
  const puzzleGeneratorService = new PuzzleGeneratorService();
  const wordSelectionService = new WordSelectionService();
  const scoringService = new ScoringService();

  // Application Layer - Use Cases
  const startGameUseCase = new StartGameUseCase(
    puzzleGeneratorService,
    wordRepository
  );

  const selectWordUseCase = new SelectWordUseCase(
    wordSelectionService
  );

  const endGameUseCase = new EndGameUseCase(
    scoringService,
    highScoreRepository
  );

  const saveHighScoreUseCase = new SaveHighScoreUseCase(
    highScoreRepository
  );

  const getHighScoresUseCase = new GetHighScoresUseCase(
    highScoreRepository
  );

  const changeThemeUseCase = new ChangeThemeUseCase(
    themeRepository
  );

  // Return container with all use cases
  return {
    // Use Cases
    startGameUseCase,
    selectWordUseCase,
    endGameUseCase,
    saveHighScoreUseCase,
    getHighScoresUseCase,
    changeThemeUseCase,

    // Repositories (for direct access if needed)
    wordRepository,
    highScoreRepository,
    themeRepository,

    // Services (for direct access if needed)
    puzzleGeneratorService,
    wordSelectionService,
    scoringService,

    // Storage (for direct access if needed)
    storageAdapter
  };
}

// Create singleton container instance
let containerInstance = null;

/**
 * Get the singleton container instance
 * @returns {Object} Container instance
 */
export function getContainer() {
  if (!containerInstance) {
    containerInstance = createContainer();
  }
  return containerInstance;
}

/**
 * Reset the container (useful for testing)
 */
export function resetContainer() {
  containerInstance = null;
}

// Export default container instance
export default getContainer();
