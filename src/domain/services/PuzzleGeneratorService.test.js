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
      expect(size).toBeLessThanOrEqual(20); // Max grid size is 20
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
