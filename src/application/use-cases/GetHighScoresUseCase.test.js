import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetHighScoresUseCase } from './GetHighScoresUseCase.js';
import { HighScore } from '../../domain/entities/HighScore.js';

describe('GetHighScoresUseCase', () => {
  let getHighScoresUseCase;
  let mockHighScoreRepository;

  beforeEach(() => {
    mockHighScoreRepository = {
      getHighScores: vi.fn()
    };

    getHighScoresUseCase = new GetHighScoresUseCase(mockHighScoreRepository);
  });

  describe('execute', () => {
    it('should retrieve high scores for all difficulty levels', () => {
      const easyScores = [new HighScore('AAA', 100, 'EASY', Date.now())];
      const mediumScores = [new HighScore('BBB', 200, 'MEDIUM', Date.now())];
      const hardScores = [new HighScore('CCC', 300, 'HARD', Date.now())];

      mockHighScoreRepository.getHighScores
        .mockReturnValueOnce(easyScores)
        .mockReturnValueOnce(mediumScores)
        .mockReturnValueOnce(hardScores);

      const result = getHighScoresUseCase.execute();

      expect(mockHighScoreRepository.getHighScores).toHaveBeenCalledWith('EASY');
      expect(mockHighScoreRepository.getHighScores).toHaveBeenCalledWith('MEDIUM');
      expect(mockHighScoreRepository.getHighScores).toHaveBeenCalledWith('HARD');
      expect(mockHighScoreRepository.getHighScores).toHaveBeenCalledTimes(3);
    });

    it('should return high scores grouped by difficulty', () => {
      const easyScores = [new HighScore('AAA', 100, 'EASY', Date.now())];
      const mediumScores = [new HighScore('BBB', 200, 'MEDIUM', Date.now())];
      const hardScores = [new HighScore('CCC', 300, 'HARD', Date.now())];

      mockHighScoreRepository.getHighScores
        .mockReturnValueOnce(easyScores)
        .mockReturnValueOnce(mediumScores)
        .mockReturnValueOnce(hardScores);

      const result = getHighScoresUseCase.execute();

      expect(result).toEqual({
        EASY: easyScores,
        MEDIUM: mediumScores,
        HARD: hardScores
      });
    });

    it('should handle empty high score lists', () => {
      mockHighScoreRepository.getHighScores.mockReturnValue([]);

      const result = getHighScoresUseCase.execute();

      expect(result).toEqual({
        EASY: [],
        MEDIUM: [],
        HARD: []
      });
    });

    it('should handle mixed empty and populated lists', () => {
      const mediumScores = [
        new HighScore('AAA', 500, 'MEDIUM', Date.now()),
        new HighScore('BBB', 400, 'MEDIUM', Date.now())
      ];

      mockHighScoreRepository.getHighScores
        .mockReturnValueOnce([])
        .mockReturnValueOnce(mediumScores)
        .mockReturnValueOnce([]);

      const result = getHighScoresUseCase.execute();

      expect(result.EASY).toEqual([]);
      expect(result.MEDIUM).toEqual(mediumScores);
      expect(result.HARD).toEqual([]);
    });
  });

  describe('executeForDifficulty', () => {
    it('should retrieve high scores for specific difficulty', () => {
      const easyScores = [
        new HighScore('AAA', 300, 'EASY', Date.now()),
        new HighScore('BBB', 200, 'EASY', Date.now())
      ];

      mockHighScoreRepository.getHighScores.mockReturnValue(easyScores);

      const result = getHighScoresUseCase.executeForDifficulty('EASY');

      expect(mockHighScoreRepository.getHighScores).toHaveBeenCalledWith('EASY');
      expect(mockHighScoreRepository.getHighScores).toHaveBeenCalledTimes(1);
      expect(result).toEqual(easyScores);
    });

    it('should work for all difficulty levels', () => {
      const difficulties = ['EASY', 'MEDIUM', 'HARD'];

      difficulties.forEach(difficulty => {
        const scores = [new HighScore('TST', 100, difficulty, Date.now())];
        mockHighScoreRepository.getHighScores.mockReturnValue(scores);

        const result = getHighScoresUseCase.executeForDifficulty(difficulty);

        expect(result).toEqual(scores);
      });
    });

    it('should return empty array when no scores exist', () => {
      mockHighScoreRepository.getHighScores.mockReturnValue([]);

      const result = getHighScoresUseCase.executeForDifficulty('HARD');

      expect(result).toEqual([]);
    });

    it('should return scores in repository order', () => {
      const hardScores = [
        new HighScore('AAA', 1000, 'HARD', Date.now()),
        new HighScore('BBB', 900, 'HARD', Date.now()),
        new HighScore('CCC', 800, 'HARD', Date.now())
      ];

      mockHighScoreRepository.getHighScores.mockReturnValue(hardScores);

      const result = getHighScoresUseCase.executeForDifficulty('HARD');

      expect(result).toEqual(hardScores);
      expect(result[0].getScore()).toBe(1000);
      expect(result[1].getScore()).toBe(900);
      expect(result[2].getScore()).toBe(800);
    });
  });
});
