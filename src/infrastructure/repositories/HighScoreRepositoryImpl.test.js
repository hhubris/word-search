import { describe, it, expect, beforeEach } from 'vitest';
import { HighScoreRepositoryImpl } from './HighScoreRepositoryImpl.js';
import { HighScore } from '../../domain/entities/HighScore.js';

// Mock storage adapter
class MockStorageAdapter {
  constructor() {
    this.data = {};
  }

  get(key) {
    return this.data[key] || null;
  }

  set(key, value) {
    this.data[key] = value;
    return true;
  }

  remove(key) {
    delete this.data[key];
    return true;
  }

  clear() {
    this.data = {};
    return true;
  }
}

describe('HighScoreRepositoryImpl', () => {
  let repository;
  let storage;

  beforeEach(() => {
    storage = new MockStorageAdapter();
    repository = new HighScoreRepositoryImpl(storage);
  });

  describe('getHighScores', () => {
    it('should return empty array when no scores exist', () => {
      const scores = repository.getHighScores('EASY');
      expect(scores).toEqual([]);
    });

    it('should return scores for specific difficulty', () => {
      const highScore = new HighScore('ABC', 1000, 'EASY', Date.now());
      repository.saveHighScore(highScore);

      const scores = repository.getHighScores('EASY');
      expect(scores).toHaveLength(1);
      expect(scores[0].getScore()).toBe(1000);
    });

    it('should return scores sorted by score (highest first)', () => {
      repository.saveHighScore(new HighScore('AAA', 500, 'EASY', Date.now()));
      repository.saveHighScore(new HighScore('BBB', 1000, 'EASY', Date.now()));
      repository.saveHighScore(new HighScore('CCC', 750, 'EASY', Date.now()));

      const scores = repository.getHighScores('EASY');
      expect(scores[0].getScore()).toBe(1000);
      expect(scores[1].getScore()).toBe(750);
      expect(scores[2].getScore()).toBe(500);
    });

    it('should not mix scores from different difficulties', () => {
      repository.saveHighScore(new HighScore('AAA', 1000, 'EASY', Date.now()));
      repository.saveHighScore(new HighScore('BBB', 2000, 'MEDIUM', Date.now()));

      const easyScores = repository.getHighScores('EASY');
      const mediumScores = repository.getHighScores('MEDIUM');

      expect(easyScores).toHaveLength(1);
      expect(mediumScores).toHaveLength(1);
      expect(easyScores[0].getScore()).toBe(1000);
      expect(mediumScores[0].getScore()).toBe(2000);
    });
  });

  describe('saveHighScore', () => {
    it('should save a high score', () => {
      const highScore = new HighScore('ABC', 1000, 'EASY', Date.now());
      const result = repository.saveHighScore(highScore);

      expect(result).toBe(true);
      const scores = repository.getHighScores('EASY');
      expect(scores).toHaveLength(1);
    });

    it('should maintain top 10 limit', () => {
      // Add 15 scores
      for (let i = 0; i < 15; i++) {
        repository.saveHighScore(new HighScore('AAA', 100 * i, 'EASY', Date.now()));
      }

      const scores = repository.getHighScores('EASY');
      expect(scores).toHaveLength(10);
    });

    it('should keep only the highest 10 scores', () => {
      // Add scores from 0 to 14
      for (let i = 0; i < 15; i++) {
        repository.saveHighScore(new HighScore('AAA', 100 * i, 'EASY', Date.now()));
      }

      const scores = repository.getHighScores('EASY');
      expect(scores).toHaveLength(10);
      
      // Should have scores 1400, 1300, ..., 500
      expect(scores[0].getScore()).toBe(1400);
      expect(scores[9].getScore()).toBe(500);
    });

    it('should preserve all score properties', () => {
      const timestamp = Date.now();
      const highScore = new HighScore('XYZ', 1234, 'MEDIUM', timestamp);
      repository.saveHighScore(highScore);

      const scores = repository.getHighScores('MEDIUM');
      expect(scores[0].getInitials()).toBe('XYZ');
      expect(scores[0].getScore()).toBe(1234);
      expect(scores[0].getDifficulty()).toBe('MEDIUM');
      expect(scores[0].getTimestamp()).toBe(timestamp);
    });
  });

  describe('getTopScores', () => {
    beforeEach(() => {
      // Add 15 scores
      for (let i = 0; i < 15; i++) {
        repository.saveHighScore(new HighScore('AAA', 100 * i, 'EASY', Date.now()));
      }
    });

    it('should return top 10 by default', () => {
      const scores = repository.getTopScores('EASY');
      expect(scores).toHaveLength(10);
    });

    it('should return top N scores', () => {
      const top5 = repository.getTopScores('EASY', 5);
      expect(top5).toHaveLength(5);
      expect(top5[0].getScore()).toBe(1400);
      expect(top5[4].getScore()).toBe(1000);
    });

    it('should handle limit larger than available scores', () => {
      repository.clearHighScores();
      repository.saveHighScore(new HighScore('AAA', 100, 'EASY', Date.now()));
      
      const scores = repository.getTopScores('EASY', 10);
      expect(scores).toHaveLength(1);
    });
  });

  describe('isHighScore', () => {
    it('should return true when less than 10 scores exist', () => {
      repository.saveHighScore(new HighScore('AAA', 500, 'EASY', Date.now()));
      
      expect(repository.isHighScore(100, 'EASY')).toBe(true);
      expect(repository.isHighScore(1000, 'EASY')).toBe(true);
    });

    it('should return true when score beats lowest high score', () => {
      // Add 10 scores (0-900)
      for (let i = 0; i < 10; i++) {
        repository.saveHighScore(new HighScore('AAA', 100 * i, 'EASY', Date.now()));
      }

      expect(repository.isHighScore(50, 'EASY')).toBe(true); // Beats 0
      expect(repository.isHighScore(500, 'EASY')).toBe(true); // Beats lower scores
    });

    it('should return false when score does not beat lowest high score', () => {
      // Add 10 scores (100-1000)
      for (let i = 1; i <= 10; i++) {
        repository.saveHighScore(new HighScore('AAA', 100 * i, 'EASY', Date.now()));
      }

      expect(repository.isHighScore(50, 'EASY')).toBe(false);
      expect(repository.isHighScore(100, 'EASY')).toBe(false);
    });
  });

  describe('getRank', () => {
    beforeEach(() => {
      // Add scores: 1000, 800, 600, 400, 200
      [1000, 800, 600, 400, 200].forEach(score => {
        repository.saveHighScore(new HighScore('AAA', score, 'EASY', Date.now()));
      });
    });

    it('should return rank 1 for highest score', () => {
      expect(repository.getRank(1500, 'EASY')).toBe(1);
    });

    it('should return correct rank for middle scores', () => {
      expect(repository.getRank(900, 'EASY')).toBe(2);
      expect(repository.getRank(700, 'EASY')).toBe(3);
      expect(repository.getRank(500, 'EASY')).toBe(4);
    });

    it('should return rank for score that qualifies at end', () => {
      expect(repository.getRank(100, 'EASY')).toBe(6);
    });

    it('should return null for score that does not qualify', () => {
      // Fill up to 10 scores
      for (let i = 0; i < 5; i++) {
        repository.saveHighScore(new HighScore('AAA', 100, 'EASY', Date.now()));
      }

      expect(repository.getRank(50, 'EASY')).toBeNull();
    });
  });

  describe('clearHighScores', () => {
    it('should clear all high scores', () => {
      repository.saveHighScore(new HighScore('AAA', 1000, 'EASY', Date.now()));
      repository.saveHighScore(new HighScore('BBB', 2000, 'MEDIUM', Date.now()));

      repository.clearHighScores();

      expect(repository.getHighScores('EASY')).toEqual([]);
      expect(repository.getHighScores('MEDIUM')).toEqual([]);
    });
  });

  describe('clearDifficultyScores', () => {
    it('should clear scores for specific difficulty only', () => {
      repository.saveHighScore(new HighScore('AAA', 1000, 'EASY', Date.now()));
      repository.saveHighScore(new HighScore('BBB', 2000, 'MEDIUM', Date.now()));

      repository.clearDifficultyScores('EASY');

      expect(repository.getHighScores('EASY')).toEqual([]);
      expect(repository.getHighScores('MEDIUM')).toHaveLength(1);
    });
  });

  describe('getAllHighScores', () => {
    it('should return all scores grouped by difficulty', () => {
      repository.saveHighScore(new HighScore('AAA', 1000, 'EASY', Date.now()));
      repository.saveHighScore(new HighScore('BBB', 2000, 'MEDIUM', Date.now()));
      repository.saveHighScore(new HighScore('CCC', 3000, 'HARD', Date.now()));

      const allScores = repository.getAllHighScores();

      expect(allScores.EASY).toHaveLength(1);
      expect(allScores.MEDIUM).toHaveLength(1);
      expect(allScores.HARD).toHaveLength(1);
    });

    it('should return empty object when no scores exist', () => {
      const allScores = repository.getAllHighScores();
      expect(allScores).toEqual({});
    });
  });

  describe('Property: High Score Separation by Difficulty', () => {
    it('should never mix scores from different difficulties', () => {
      // Add scores to all difficulties
      repository.saveHighScore(new HighScore('E1', 100, 'EASY', Date.now()));
      repository.saveHighScore(new HighScore('E2', 200, 'EASY', Date.now()));
      repository.saveHighScore(new HighScore('M1', 300, 'MEDIUM', Date.now()));
      repository.saveHighScore(new HighScore('M2', 400, 'MEDIUM', Date.now()));
      repository.saveHighScore(new HighScore('H1', 500, 'HARD', Date.now()));
      repository.saveHighScore(new HighScore('H2', 600, 'HARD', Date.now()));

      const easyScores = repository.getHighScores('EASY');
      const mediumScores = repository.getHighScores('MEDIUM');
      const hardScores = repository.getHighScores('HARD');

      // Verify each difficulty only has its own scores
      easyScores.forEach(score => expect(score.getDifficulty()).toBe('EASY'));
      mediumScores.forEach(score => expect(score.getDifficulty()).toBe('MEDIUM'));
      hardScores.forEach(score => expect(score.getDifficulty()).toBe('HARD'));
    });
  });

  describe('Property: High Score List Size Limit', () => {
    it('should never exceed 10 scores per difficulty', () => {
      // Add 20 scores to each difficulty
      for (let i = 0; i < 20; i++) {
        repository.saveHighScore(new HighScore('E', i * 10, 'EASY', Date.now()));
        repository.saveHighScore(new HighScore('M', i * 10, 'MEDIUM', Date.now()));
        repository.saveHighScore(new HighScore('H', i * 10, 'HARD', Date.now()));
      }

      expect(repository.getHighScores('EASY').length).toBeLessThanOrEqual(10);
      expect(repository.getHighScores('MEDIUM').length).toBeLessThanOrEqual(10);
      expect(repository.getHighScores('HARD').length).toBeLessThanOrEqual(10);
    });
  });

  describe('Property: High Score Sorting', () => {
    it('should always return scores in descending order', () => {
      // Add scores in random order
      const scores = [500, 1000, 200, 800, 300, 900, 100, 700, 400, 600];
      scores.forEach(score => {
        repository.saveHighScore(new HighScore('AAA', score, 'EASY', Date.now()));
      });

      const highScores = repository.getHighScores('EASY');
      
      // Verify descending order
      for (let i = 0; i < highScores.length - 1; i++) {
        expect(highScores[i].getScore()).toBeGreaterThanOrEqual(highScores[i + 1].getScore());
      }
    });
  });
});

// Property-based tests
import * as fc from 'fast-check';

describe('Property-Based Tests', () => {
  let repository;
  let storage;

  beforeEach(() => {
    storage = new MockStorageAdapter();
    repository = new HighScoreRepositoryImpl(storage);
  });

  // Feature: word-search-game, Property 14: High Score Separation by Difficulty
  describe('Property 14: High Score Separation by Difficulty', () => {
    it('should never mix scores from different difficulties', () => {
      fc.assert(
        fc.property(
          // Generate random high scores for all difficulties
          fc.array(
            fc.record({
              initials: fc.constantFrom('AAA', 'BBB', 'CCC', 'XYZ', 'ABC', 'DEF'),
              score: fc.integer({ min: 0, max: 100000 }),
              difficulty: fc.constantFrom('EASY', 'MEDIUM', 'HARD'),
              timestamp: fc.integer({ min: 1000000000000, max: 2000000000000 })
            }),
            { minLength: 10, maxLength: 50 }
          ),
          (scoreData) => {
            // Clear and add all scores
            repository.clearHighScores();
            scoreData.forEach(data => {
              const highScore = new HighScore(
                data.initials,
                data.score,
                data.difficulty,
                data.timestamp
              );
              repository.saveHighScore(highScore);
            });

            // Verify each difficulty only contains its own scores
            const easyScores = repository.getHighScores('EASY');
            const mediumScores = repository.getHighScores('MEDIUM');
            const hardScores = repository.getHighScores('HARD');

            easyScores.forEach(score => {
              expect(score.getDifficulty()).toBe('EASY');
            });

            mediumScores.forEach(score => {
              expect(score.getDifficulty()).toBe('MEDIUM');
            });

            hardScores.forEach(score => {
              expect(score.getDifficulty()).toBe('HARD');
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: word-search-game, Property 15: High Score List Size Limit
  describe('Property 15: High Score List Size Limit', () => {
    it('should never exceed 10 scores per difficulty', () => {
      fc.assert(
        fc.property(
          // Generate random number of scores (up to 50) for each difficulty
          fc.record({
            easyScores: fc.array(
              fc.record({
                initials: fc.constantFrom('AAA', 'BBB', 'CCC', 'XYZ', 'ABC', 'DEF'),
                score: fc.integer({ min: 0, max: 100000 }),
                timestamp: fc.integer({ min: 1000000000000, max: 2000000000000 })
              }),
              { minLength: 0, maxLength: 50 }
            ),
            mediumScores: fc.array(
              fc.record({
                initials: fc.constantFrom('AAA', 'BBB', 'CCC', 'XYZ', 'ABC', 'DEF'),
                score: fc.integer({ min: 0, max: 100000 }),
                timestamp: fc.integer({ min: 1000000000000, max: 2000000000000 })
              }),
              { minLength: 0, maxLength: 50 }
            ),
            hardScores: fc.array(
              fc.record({
                initials: fc.constantFrom('AAA', 'BBB', 'CCC', 'XYZ', 'ABC', 'DEF'),
                score: fc.integer({ min: 0, max: 100000 }),
                timestamp: fc.integer({ min: 1000000000000, max: 2000000000000 })
              }),
              { minLength: 0, maxLength: 50 }
            )
          }),
          ({ easyScores, mediumScores, hardScores }) => {
            repository.clearHighScores();

            // Add all scores
            easyScores.forEach(data => {
              repository.saveHighScore(new HighScore(data.initials, data.score, 'EASY', data.timestamp));
            });
            mediumScores.forEach(data => {
              repository.saveHighScore(new HighScore(data.initials, data.score, 'MEDIUM', data.timestamp));
            });
            hardScores.forEach(data => {
              repository.saveHighScore(new HighScore(data.initials, data.score, 'HARD', data.timestamp));
            });

            // Verify size limits
            expect(repository.getHighScores('EASY').length).toBeLessThanOrEqual(10);
            expect(repository.getHighScores('MEDIUM').length).toBeLessThanOrEqual(10);
            expect(repository.getHighScores('HARD').length).toBeLessThanOrEqual(10);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: word-search-game, Property 16: High Score Sorting
  describe('Property 16: High Score Sorting', () => {
    it('should always return scores in descending order', () => {
      fc.assert(
        fc.property(
          // Generate random scores
          fc.array(
            fc.record({
              initials: fc.constantFrom('AAA', 'BBB', 'CCC', 'XYZ', 'ABC', 'DEF'),
              score: fc.integer({ min: 0, max: 100000 }),
              difficulty: fc.constantFrom('EASY', 'MEDIUM', 'HARD'),
              timestamp: fc.integer({ min: 1000000000000, max: 2000000000000 })
            }),
            { minLength: 1, maxLength: 30 }
          ),
          (scoreData) => {
            repository.clearHighScores();

            // Add all scores
            scoreData.forEach(data => {
              repository.saveHighScore(new HighScore(
                data.initials,
                data.score,
                data.difficulty,
                data.timestamp
              ));
            });

            // Check sorting for each difficulty
            ['EASY', 'MEDIUM', 'HARD'].forEach(difficulty => {
              const scores = repository.getHighScores(difficulty);
              
              // Verify descending order
              for (let i = 0; i < scores.length - 1; i++) {
                expect(scores[i].getScore()).toBeGreaterThanOrEqual(scores[i + 1].getScore());
              }
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: word-search-game, Property 19: Data Persistence Round Trip (High Scores)
  describe('Property 19: Data Persistence Round Trip (High Scores)', () => {
    it('should preserve all high score properties through save and retrieve', () => {
      fc.assert(
        fc.property(
          // Generate random high scores
          fc.array(
            fc.record({
              initials: fc.constantFrom('AAA', 'BBB', 'CCC', 'XYZ', 'ABC', 'DEF'),
              score: fc.integer({ min: 0, max: 100000 }),
              difficulty: fc.constantFrom('EASY', 'MEDIUM', 'HARD'),
              timestamp: fc.integer({ min: 1000000000000, max: 2000000000000 })
            }),
            { minLength: 1, maxLength: 20 }
          ),
          (scoreData) => {
            repository.clearHighScores();

            // Save all scores
            const savedScores = scoreData.map(data => 
              new HighScore(data.initials, data.score, data.difficulty, data.timestamp)
            );
            
            savedScores.forEach(score => {
              repository.saveHighScore(score);
            });

            // Retrieve and verify each difficulty
            ['EASY', 'MEDIUM', 'HARD'].forEach(difficulty => {
              const retrievedScores = repository.getHighScores(difficulty);
              const originalScoresForDifficulty = savedScores.filter(s => s.getDifficulty() === difficulty);

              // Each retrieved score should match an original score
              retrievedScores.forEach(retrieved => {
                const matching = originalScoresForDifficulty.find(original =>
                  original.getInitials() === retrieved.getInitials() &&
                  original.getScore() === retrieved.getScore() &&
                  original.getDifficulty() === retrieved.getDifficulty() &&
                  original.getTimestamp() === retrieved.getTimestamp()
                );

                // Should find a matching original score
                expect(matching).toBeDefined();
              });
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
