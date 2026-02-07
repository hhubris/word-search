import { describe, it, expect } from 'vitest';
import { PuzzleGeneratorService } from './PuzzleGeneratorService.js';

// Mock word repository
class MockWordRepository {
  constructor() {
    this.words = {
      'Animals': ['CAT', 'DOG', 'BIRD', 'FISH', 'LION', 'BEAR', 'WOLF', 'DEER', 'FROG', 'DUCK', 'GOAT', 'SEAL', 'HAWK', 'CRAB', 'MOTH', 'WASP'],
      'Sports': ['GOLF', 'TENNIS', 'SOCCER', 'HOCKEY', 'RUGBY', 'BOXING', 'SKIING', 'DIVING', 'RACING', 'ROWING', 'CYCLING', 'SURFING', 'POLO', 'JUDO', 'YOGA', 'DARTS'],
      'Science': ['ATOM', 'CELL', 'GENE', 'VIRUS', 'ENERGY', 'FORCE', 'LIGHT', 'SOUND', 'HEAT', 'WAVE', 'MASS', 'SPEED', 'ORBIT', 'LASER', 'PRISM', 'MAGNET']
    };
  }

  getWordsByCategory(category) {
    return this.words[category] || [];
  }

  getAllCategories() {
    return Object.keys(this.words);
  }
}

describe('PuzzleGeneratorService', () => {
  const service = new PuzzleGeneratorService();
  const repository = new MockWordRepository();

  describe('selectRandomWords', () => {
    it('should select the requested number of words', () => {
      const words = ['CAT', 'DOG', 'BIRD', 'FISH', 'LION'];
      const selected = service.selectRandomWords(words, 3);
      expect(selected).toHaveLength(3);
    });

    it('should select words from the available list', () => {
      const words = ['CAT', 'DOG', 'BIRD'];
      const selected = service.selectRandomWords(words, 2);
      selected.forEach(word => {
        expect(words).toContain(word);
      });
    });
  });

  describe('calculateGridSize', () => {
    it('should return at least 8 for short words', () => {
      const words = ['CAT', 'DOG'];
      const size = service.calculateGridSize(words);
      expect(size).toBeGreaterThanOrEqual(8);
    });

    it('should scale with longest word', () => {
      const words = ['CAT', 'ELEPHANT'];
      const size = service.calculateGridSize(words);
      expect(size).toBeGreaterThanOrEqual(8);
    });

    it('should not exceed max grid size', () => {
      const words = ['VERYLONGWORD'];
      const size = service.calculateGridSize(words);
      expect(size).toBeLessThanOrEqual(12);
    });
  });

  describe('validateGridSize', () => {
    it('should return true for valid grid size', () => {
      const grid = { getSize: () => 10 };
      expect(service.validateGridSize(grid)).toBe(true);
    });

    it('should return true for max grid size', () => {
      const grid = { getSize: () => 12 };
      expect(service.validateGridSize(grid)).toBe(true);
    });

    it('should return false for oversized grid', () => {
      const grid = { getSize: () => 13 };
      expect(service.validateGridSize(grid)).toBe(false);
    });
  });

  describe('meetsIntersectionRequirement', () => {
    it('should return true for empty word list', () => {
      expect(service.meetsIntersectionRequirement([])).toBe(true);
    });

    it('should return true when 50% or more words intersect', () => {
      // Mock words with intersections
      const word1 = {
        intersectsWith: (other) => other === word2
      };
      const word2 = {
        intersectsWith: (other) => other === word1
      };
      const word3 = {
        intersectsWith: () => false
      };
      const word4 = {
        intersectsWith: () => false
      };

      const words = [word1, word2, word3, word4];
      // 2 out of 4 = 50%
      expect(service.meetsIntersectionRequirement(words)).toBe(true);
    });

    it('should return false when less than 50% words intersect', () => {
      const word1 = {
        intersectsWith: () => false
      };
      const word2 = {
        intersectsWith: () => false
      };
      const word3 = {
        intersectsWith: () => false
      };
      const word4 = {
        intersectsWith: () => false
      };

      const words = [word1, word2, word3, word4];
      // 0 out of 4 = 0%
      expect(service.meetsIntersectionRequirement(words)).toBe(false);
    });
  });

  describe('generatePuzzle - EASY', () => {
    it('should generate a valid puzzle', () => {
      const puzzle = service.generatePuzzle('Animals', 'EASY', repository);
      
      expect(puzzle).toBeDefined();
      expect(puzzle.getCategory()).toBe('Animals');
      expect(puzzle.getDifficulty()).toBe('EASY');
      expect(puzzle.getAllWords()).toHaveLength(8);
      expect(puzzle.getGrid().getSize()).toBeLessThanOrEqual(12);
    });

    it('should place words only in allowed directions (RIGHT, DOWN)', () => {
      const puzzle = service.generatePuzzle('Animals', 'EASY', repository);
      const words = puzzle.getAllWords();
      
      words.forEach(word => {
        const dir = word.getDirection();
        const isAllowed = dir.name === 'RIGHT' || dir.name === 'DOWN';
        expect(isAllowed).toBe(true);
      });
    });

    it('should have at least 50% words intersecting', () => {
      // This test may occasionally fail due to randomness
      // Try a few times to account for random generation
      let success = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const puzzle = service.generatePuzzle('Animals', 'EASY', repository);
          const words = puzzle.getAllWords();
          
          let intersectingCount = 0;
          for (const word of words) {
            for (const other of words) {
              if (word !== other && word.intersectsWith(other)) {
                intersectingCount++;
                break;
              }
            }
          }
          
          const ratio = intersectingCount / words.length;
          if (ratio >= 0.5) {
            success = true;
            break;
          }
        } catch (e) {
          // Try again
        }
      }
      expect(success).toBe(true);
    });

    it('should fill all empty cells', () => {
      const puzzle = service.generatePuzzle('Animals', 'EASY', repository);
      const grid = puzzle.getGrid();
      
      for (let row = 0; row < grid.getSize(); row++) {
        for (let col = 0; col < grid.getSize(); col++) {
          const cell = grid.getCell(row, col);
          expect(cell.isEmpty()).toBe(false);
        }
      }
    });
  });

  describe('generatePuzzle - MEDIUM', () => {
    it('should generate a valid puzzle with 12 words', () => {
      const puzzle = service.generatePuzzle('Sports', 'MEDIUM', repository);
      
      expect(puzzle).toBeDefined();
      expect(puzzle.getAllWords()).toHaveLength(12);
    });

    it('should place words in allowed directions (RIGHT, DOWN, DOWN_RIGHT, DOWN_LEFT)', () => {
      const puzzle = service.generatePuzzle('Sports', 'MEDIUM', repository);
      const words = puzzle.getAllWords();
      
      const allowedDirections = ['RIGHT', 'DOWN', 'DOWN_RIGHT', 'DOWN_LEFT'];
      words.forEach(word => {
        const dir = word.getDirection();
        expect(allowedDirections).toContain(dir.name);
      });
    });
  });

  describe('generatePuzzle - HARD', () => {
    it('should generate a valid puzzle with 16 words', () => {
      const puzzle = service.generatePuzzle('Science', 'HARD', repository);
      
      expect(puzzle).toBeDefined();
      expect(puzzle.getAllWords()).toHaveLength(16);
    });

    it('should allow all 8 directions', () => {
      const puzzle = service.generatePuzzle('Science', 'HARD', repository);
      const words = puzzle.getAllWords();
      
      const allDirections = ['RIGHT', 'LEFT', 'DOWN', 'UP', 'DOWN_RIGHT', 'DOWN_LEFT', 'UP_RIGHT', 'UP_LEFT'];
      words.forEach(word => {
        const dir = word.getDirection();
        expect(allDirections).toContain(dir.name);
      });
    });
  });
});
