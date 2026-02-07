import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveHighScoreUseCase } from './SaveHighScoreUseCase.js';
import { HighScore } from '../../domain/entities/HighScore.js';

describe('SaveHighScoreUseCase', () => {
  let saveHighScoreUseCase;
  let mockHighScoreRepository;

  beforeEach(() => {
    mockHighScoreRepository = {
      saveHighScore: vi.fn(),
      getHighScores: vi.fn()
    };

    saveHighScoreUseCase = new SaveHighScoreUseCase(mockHighScoreRepository);
  });

  describe('execute', () => {
    it('should create a HighScore entity with provided data', () => {
      const initials = 'ABC';
      const score = 500;
      const difficulty = 'MEDIUM';

      mockHighScoreRepository.getHighScores.mockReturnValue([]);

      saveHighScoreUseCase.execute(initials, score, difficulty);

      expect(mockHighScoreRepository.saveHighScore).toHaveBeenCalledTimes(1);
      const savedHighScore = mockHighScoreRepository.saveHighScore.mock.calls[0][0];
      
      expect(savedHighScore).toBeInstanceOf(HighScore);
      expect(savedHighScore.getInitials()).toBe(initials);
      expect(savedHighScore.getScore()).toBe(score);
      expect(savedHighScore.getDifficulty()).toBe(difficulty);
    });

    it('should save high score to repository', () => {
      const initials = 'XYZ';
      const score = 750;
      const difficulty = 'HARD';

      mockHighScoreRepository.getHighScores.mockReturnValue([]);

      saveHighScoreUseCase.execute(initials, score, difficulty);

      expect(mockHighScoreRepository.saveHighScore).toHaveBeenCalledTimes(1);
    });

    it('should return updated high scores list', () => {
      const initials = 'DEF';
      const score = 300;
      const difficulty = 'EASY';

      const expectedHighScores = [
        new HighScore('ABC', 500, 'EASY', Date.now()),
        new HighScore('DEF', 300, 'EASY', Date.now())
      ];

      mockHighScoreRepository.getHighScores.mockReturnValue(expectedHighScores);

      const result = saveHighScoreUseCase.execute(initials, score, difficulty);

      expect(mockHighScoreRepository.getHighScores).toHaveBeenCalledWith(difficulty);
      expect(result).toEqual(expectedHighScores);
    });

    it('should handle different difficulty levels', () => {
      const difficulties = ['EASY', 'MEDIUM', 'HARD'];

      difficulties.forEach(difficulty => {
        mockHighScoreRepository.getHighScores.mockReturnValue([]);
        
        saveHighScoreUseCase.execute('TST', 100, difficulty);

        const savedHighScore = mockHighScoreRepository.saveHighScore.mock.calls[mockHighScoreRepository.saveHighScore.mock.calls.length - 1][0];
        expect(savedHighScore.getDifficulty()).toBe(difficulty);
      });
    });

    it('should create high score with current timestamp', () => {
      const beforeExecution = Date.now();
      
      mockHighScoreRepository.getHighScores.mockReturnValue([]);

      saveHighScoreUseCase.execute('NOW', 200, 'EASY');

      const afterExecution = Date.now();
      const savedHighScore = mockHighScoreRepository.saveHighScore.mock.calls[0][0];
      const timestamp = savedHighScore.getTimestamp();

      expect(timestamp).toBeGreaterThanOrEqual(beforeExecution);
      expect(timestamp).toBeLessThanOrEqual(afterExecution);
    });

    it('should validate initials through HighScore entity', () => {
      mockHighScoreRepository.getHighScores.mockReturnValue([]);

      // Valid initials
      saveHighScoreUseCase.execute('ABC', 100, 'EASY');
      let savedHighScore = mockHighScoreRepository.saveHighScore.mock.calls[0][0];
      expect(savedHighScore.getInitials()).toBe('ABC');

      // Initials too long - should be truncated to 3 chars
      saveHighScoreUseCase.execute('ABCD', 200, 'EASY');
      savedHighScore = mockHighScoreRepository.saveHighScore.mock.calls[1][0];
      expect(savedHighScore.getInitials()).toBe('ABC');

      // Empty initials - should default to 'AAA'
      saveHighScoreUseCase.execute('', 300, 'EASY');
      savedHighScore = mockHighScoreRepository.saveHighScore.mock.calls[2][0];
      expect(savedHighScore.getInitials()).toBe('AAA');
    });

    it('should handle multiple saves in sequence', () => {
      mockHighScoreRepository.getHighScores.mockReturnValue([]);

      saveHighScoreUseCase.execute('AAA', 100, 'EASY');
      saveHighScoreUseCase.execute('BBB', 200, 'EASY');
      saveHighScoreUseCase.execute('CCC', 300, 'EASY');

      expect(mockHighScoreRepository.saveHighScore).toHaveBeenCalledTimes(3);
      expect(mockHighScoreRepository.getHighScores).toHaveBeenCalledTimes(3);
    });
  });
});
