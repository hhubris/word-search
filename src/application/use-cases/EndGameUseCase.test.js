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
    puzzle = new Puzzle(grid, [], 'ANIMALS', 'EASY');
    gameSession = new GameSession(puzzle, 'EASY');
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
      const hardSession = new GameSession(puzzle, 'HARD');
      
      mockScoringService.calculateScore.mockReturnValue(800);
      mockHighScoreRepository.isHighScore.mockReturnValue(true);
      mockHighScoreRepository.getRank.mockReturnValue(1);

      const result = endGameUseCase.execute(hardSession);

      expect(mockHighScoreRepository.isHighScore).toHaveBeenCalledWith(800, 'HARD');
      expect(mockHighScoreRepository.getRank).toHaveBeenCalledWith(800, 'HARD');
    });
  });
});

// Property-based tests
import * as fc from 'fast-check';

describe('Property-Based Tests', () => {
  let endGameUseCase;
  let mockScoringService;
  let mockHighScoreRepository;

  beforeEach(() => {
    mockScoringService = {
      calculateScore: vi.fn()
    };

    mockHighScoreRepository = {
      isHighScore: vi.fn(),
      getRank: vi.fn()
    };

    endGameUseCase = new EndGameUseCase(mockScoringService, mockHighScoreRepository);
  });

  // Feature: word-search-game, Property 12: Game End Conditions
  describe('Property 12: Game End Conditions', () => {
    it('should always end game session and calculate score', () => {
      fc.assert(
        fc.property(
          // Generate random game parameters
          fc.record({
            difficulty: fc.constantFrom('EASY', 'MEDIUM', 'HARD'),
            score: fc.integer({ min: 0, max: 100000 }),
            startTime: fc.integer({ min: 1000000000000, max: 2000000000000 }),
            duration: fc.integer({ min: 0, max: 600000 }) // 0-10 minutes
          }),
          ({ difficulty, score, startTime, duration }) => {
            const grid = new Grid(8, 8);
            const puzzle = new Puzzle(grid, [], 'Animals', difficulty);
            const gameSession = new GameSession(puzzle, difficulty, startTime);
            const endTime = startTime + duration;

            mockScoringService.calculateScore.mockReturnValue(score);
            mockHighScoreRepository.isHighScore.mockReturnValue(false);

            const result = endGameUseCase.execute(gameSession, endTime);

            // Property 1: Game session should be ended
            expect(gameSession.isEnded()).toBe(true);
            expect(gameSession.getEndTime()).toBe(endTime);

            // Property 2: Score should be calculated
            expect(mockScoringService.calculateScore).toHaveBeenCalledWith(gameSession);
            expect(result.score).toBe(score);

            // Property 3: High score check should be performed
            expect(mockHighScoreRepository.isHighScore).toHaveBeenCalledWith(score, difficulty);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: word-search-game, Property 13: High Score Qualification
  describe('Property 13: High Score Qualification', () => {
    it('should correctly determine high score qualification', () => {
      fc.assert(
        fc.property(
          // Generate random scores and high score status
          fc.record({
            difficulty: fc.constantFrom('EASY', 'MEDIUM', 'HARD'),
            score: fc.integer({ min: 0, max: 100000 }),
            isHighScore: fc.boolean(),
            rank: fc.integer({ min: 1, max: 10 })
          }),
          ({ difficulty, score, isHighScore, rank }) => {
            const grid = new Grid(8, 8);
            const puzzle = new Puzzle(grid, [], 'Animals', difficulty);
            const gameSession = new GameSession(puzzle, difficulty);

            mockScoringService.calculateScore.mockReturnValue(score);
            mockHighScoreRepository.isHighScore.mockReturnValue(isHighScore);
            mockHighScoreRepository.getRank.mockReturnValue(rank);

            const result = endGameUseCase.execute(gameSession);

            // Property 1: isHighScore should match repository response
            expect(result.isHighScore).toBe(isHighScore);

            // Property 2: If high score, rank should be returned
            if (isHighScore) {
              expect(mockHighScoreRepository.getRank).toHaveBeenCalledWith(score, difficulty);
              expect(result.rank).toBe(rank);
            } else {
              // Property 3: If not high score, rank should be null
              expect(result.rank).toBeNull();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
