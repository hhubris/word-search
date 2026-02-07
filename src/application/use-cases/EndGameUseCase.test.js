import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EndGameUseCase } from './EndGameUseCase.js';
import { GameSession } from '../../domain/entities/GameSession.js';
import { Puzzle } from '../../domain/entities/Puzzle.js';
import { Grid } from '../../domain/entities/Grid.js';
import { ScoringService } from '../../domain/services/ScoringService.js';

describe('EndGameUseCase', () => {
  let endGameUseCase;
  let mockScoringService;
  let mockHighScoreRepository;
  let gameSession;
  let puzzle;

  beforeEach(() => {
    // Create mock services
    mockScoringService = {
      calculateScore: vi.fn()
    };

    mockHighScoreRepository = {
      isHighScore: vi.fn(),
      getRank: vi.fn()
    };

    endGameUseCase = new EndGameUseCase(mockScoringService, mockHighScoreRepository);

    // Create test puzzle and game session
    const grid = new Grid(8, 8);
    puzzle = new Puzzle(grid, []);
    gameSession = new GameSession(puzzle, 'EASY', 'ANIMALS');
  });

  describe('execute', () => {
    it('should end the game session', () => {
      const startTime = Date.now();
      const endTime = startTime + 60000; // 1 minute later

      mockScoringService.calculateScore.mockReturnValue(100);
      mockHighScoreRepository.isHighScore.mockReturnValue(false);

      endGameUseCase.execute(gameSession, endTime);

      expect(gameSession.isEnded()).toBe(true);
      expect(gameSession.getEndTime()).toBe(endTime);
    });

    it('should calculate score using scoring service', () => {
      const expectedScore = 250;
      mockScoringService.calculateScore.mockReturnValue(expectedScore);
      mockHighScoreRepository.isHighScore.mockReturnValue(false);

      const result = endGameUseCase.execute(gameSession);

      expect(mockScoringService.calculateScore).toHaveBeenCalledWith(gameSession);
      expect(result.score).toBe(expectedScore);
    });

    it('should check if score is a high score', () => {
      mockScoringService.calculateScore.mockReturnValue(300);
      mockHighScoreRepository.isHighScore.mockReturnValue(true);
      mockHighScoreRepository.getRank.mockReturnValue(3);

      const result = endGameUseCase.execute(gameSession);

      expect(mockHighScoreRepository.isHighScore).toHaveBeenCalledWith(300, 'EASY');
      expect(result.isHighScore).toBe(true);
    });

    it('should return rank when score is a high score', () => {
      mockScoringService.calculateScore.mockReturnValue(500);
      mockHighScoreRepository.isHighScore.mockReturnValue(true);
      mockHighScoreRepository.getRank.mockReturnValue(1);

      const result = endGameUseCase.execute(gameSession);

      expect(mockHighScoreRepository.getRank).toHaveBeenCalledWith(500, 'EASY');
      expect(result.rank).toBe(1);
    });

    it('should return null rank when score is not a high score', () => {
      mockScoringService.calculateScore.mockReturnValue(50);
      mockHighScoreRepository.isHighScore.mockReturnValue(false);

      const result = endGameUseCase.execute(gameSession);

      expect(mockHighScoreRepository.getRank).not.toHaveBeenCalled();
      expect(result.rank).toBeNull();
    });

    it('should use current time if endTime not provided', () => {
      const beforeExecution = Date.now();
      
      mockScoringService.calculateScore.mockReturnValue(100);
      mockHighScoreRepository.isHighScore.mockReturnValue(false);

      endGameUseCase.execute(gameSession);

      const afterExecution = Date.now();
      const endTime = gameSession.getEndTime();

      expect(endTime).toBeGreaterThanOrEqual(beforeExecution);
      expect(endTime).toBeLessThanOrEqual(afterExecution);
    });

    it('should return complete result object', () => {
      mockScoringService.calculateScore.mockReturnValue(400);
      mockHighScoreRepository.isHighScore.mockReturnValue(true);
      mockHighScoreRepository.getRank.mockReturnValue(2);

      const result = endGameUseCase.execute(gameSession);

      expect(result).toEqual({
        score: 400,
        isHighScore: true,
        rank: 2
      });
    });

    it('should work with different difficulty levels', () => {
      const hardSession = new GameSession(puzzle, 'HARD', 'SCIENCE');
      
      mockScoringService.calculateScore.mockReturnValue(800);
      mockHighScoreRepository.isHighScore.mockReturnValue(true);
      mockHighScoreRepository.getRank.mockReturnValue(1);

      const result = endGameUseCase.execute(hardSession);

      expect(mockHighScoreRepository.isHighScore).toHaveBeenCalledWith(800, 'HARD');
      expect(mockHighScoreRepository.getRank).toHaveBeenCalledWith(800, 'HARD');
    });
  });
});
