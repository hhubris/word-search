import { describe, it, expect, beforeEach } from 'vitest';
import { createContainer, getContainer, resetContainer } from './container.js';

// Use Cases
import { StartGameUseCase } from './use-cases/StartGameUseCase.js';
import { SelectWordUseCase } from './use-cases/SelectWordUseCase.js';
import { EndGameUseCase } from './use-cases/EndGameUseCase.js';
import { SaveHighScoreUseCase } from './use-cases/SaveHighScoreUseCase.js';
import { GetHighScoresUseCase } from './use-cases/GetHighScoresUseCase.js';
import { ChangeThemeUseCase } from './use-cases/ChangeThemeUseCase.js';

// Repositories
import { WordRepositoryImpl } from '../infrastructure/repositories/WordRepositoryImpl.js';
import { HighScoreRepositoryImpl } from '../infrastructure/repositories/HighScoreRepositoryImpl.js';
import { ThemeRepositoryImpl } from '../infrastructure/repositories/ThemeRepositoryImpl.js';

// Services
import { PuzzleGeneratorService } from '../domain/services/PuzzleGeneratorService.js';
import { WordSelectionService } from '../domain/services/WordSelectionService.js';
import { ScoringService } from '../domain/services/ScoringService.js';

// Storage
import { LocalStorageAdapter } from '../infrastructure/storage/LocalStorageAdapter.js';

describe('Container', () => {
  beforeEach(() => {
    resetContainer();
  });

  describe('createContainer', () => {
    it('should create a container with all use cases', () => {
      const container = createContainer();

      expect(container.startGameUseCase).toBeInstanceOf(StartGameUseCase);
      expect(container.selectWordUseCase).toBeInstanceOf(SelectWordUseCase);
      expect(container.endGameUseCase).toBeInstanceOf(EndGameUseCase);
      expect(container.saveHighScoreUseCase).toBeInstanceOf(SaveHighScoreUseCase);
      expect(container.getHighScoresUseCase).toBeInstanceOf(GetHighScoresUseCase);
      expect(container.changeThemeUseCase).toBeInstanceOf(ChangeThemeUseCase);
    });

    it('should create a container with all repositories', () => {
      const container = createContainer();

      expect(container.wordRepository).toBeInstanceOf(WordRepositoryImpl);
      expect(container.highScoreRepository).toBeInstanceOf(HighScoreRepositoryImpl);
      expect(container.themeRepository).toBeInstanceOf(ThemeRepositoryImpl);
    });

    it('should create a container with all services', () => {
      const container = createContainer();

      expect(container.puzzleGeneratorService).toBeInstanceOf(PuzzleGeneratorService);
      expect(container.wordSelectionService).toBeInstanceOf(WordSelectionService);
      expect(container.scoringService).toBeInstanceOf(ScoringService);
    });

    it('should create a container with storage adapter', () => {
      const container = createContainer();

      expect(container.storageAdapter).toBeInstanceOf(LocalStorageAdapter);
    });

    it('should create new instances each time', () => {
      const container1 = createContainer();
      const container2 = createContainer();

      expect(container1).not.toBe(container2);
      expect(container1.startGameUseCase).not.toBe(container2.startGameUseCase);
    });
  });

  describe('getContainer', () => {
    it('should return a singleton container instance', () => {
      const container1 = getContainer();
      const container2 = getContainer();

      expect(container1).toBe(container2);
    });

    it('should return container with all use cases', () => {
      const container = getContainer();

      expect(container.startGameUseCase).toBeInstanceOf(StartGameUseCase);
      expect(container.selectWordUseCase).toBeInstanceOf(SelectWordUseCase);
      expect(container.endGameUseCase).toBeInstanceOf(EndGameUseCase);
      expect(container.saveHighScoreUseCase).toBeInstanceOf(SaveHighScoreUseCase);
      expect(container.getHighScoresUseCase).toBeInstanceOf(GetHighScoresUseCase);
      expect(container.changeThemeUseCase).toBeInstanceOf(ChangeThemeUseCase);
    });
  });

  describe('resetContainer', () => {
    it('should reset the singleton instance', () => {
      const container1 = getContainer();
      resetContainer();
      const container2 = getContainer();

      expect(container1).not.toBe(container2);
    });

    it('should create new instances after reset', () => {
      const container1 = getContainer();
      const useCase1 = container1.startGameUseCase;

      resetContainer();

      const container2 = getContainer();
      const useCase2 = container2.startGameUseCase;

      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('dependency wiring', () => {
    it('should wire StartGameUseCase with correct dependencies', () => {
      const container = createContainer();
      const useCase = container.startGameUseCase;

      expect(useCase.puzzleGenerator).toBeInstanceOf(PuzzleGeneratorService);
      expect(useCase.wordRepository).toBeInstanceOf(WordRepositoryImpl);
    });

    it('should wire SelectWordUseCase with correct dependencies', () => {
      const container = createContainer();
      const useCase = container.selectWordUseCase;

      expect(useCase.wordSelectionService).toBeInstanceOf(WordSelectionService);
    });

    it('should wire EndGameUseCase with correct dependencies', () => {
      const container = createContainer();
      const useCase = container.endGameUseCase;

      expect(useCase.scoringService).toBeInstanceOf(ScoringService);
      expect(useCase.highScoreRepository).toBeInstanceOf(HighScoreRepositoryImpl);
    });

    it('should wire SaveHighScoreUseCase with correct dependencies', () => {
      const container = createContainer();
      const useCase = container.saveHighScoreUseCase;

      expect(useCase.highScoreRepository).toBeInstanceOf(HighScoreRepositoryImpl);
    });

    it('should wire GetHighScoresUseCase with correct dependencies', () => {
      const container = createContainer();
      const useCase = container.getHighScoresUseCase;

      expect(useCase.highScoreRepository).toBeInstanceOf(HighScoreRepositoryImpl);
    });

    it('should wire ChangeThemeUseCase with correct dependencies', () => {
      const container = createContainer();
      const useCase = container.changeThemeUseCase;

      expect(useCase.themeRepository).toBeInstanceOf(ThemeRepositoryImpl);
    });

    it('should share same storage adapter across repositories', () => {
      const container = createContainer();

      expect(container.highScoreRepository.storage).toBe(container.storageAdapter);
      expect(container.themeRepository.storage).toBe(container.storageAdapter);
    });
  });
});
