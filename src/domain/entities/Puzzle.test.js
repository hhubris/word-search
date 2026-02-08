import { describe, it, expect, beforeEach } from 'vitest';
import { Puzzle } from './Puzzle.js';
import { Grid } from './Grid.js';
import { Word } from './Word.js';
import { Position } from '../value-objects/Position.js';
import { Direction } from '../value-objects/Direction.js';

describe('Puzzle', () => {
  let grid, words, puzzle;

  beforeEach(() => {
    grid = new Grid(10);
    words = [
      new Word('1', 'CAT', new Position(0, 0), Direction.RIGHT),
      new Word('2', 'DOG', new Position(1, 0), Direction.RIGHT),
      new Word('3', 'BIRD', new Position(2, 0), Direction.RIGHT)
    ];
    puzzle = new Puzzle(grid, words, 'Animals', 'EASY');
  });

  describe('constructor', () => {
    it('should create puzzle with grid and words', () => {
      expect(puzzle.getGrid()).toBe(grid);
      expect(puzzle.getAllWords()).toHaveLength(3);
    });

    it('should initialize with no found words', () => {
      expect(puzzle.getFoundWordCount()).toBe(0);
    });

    it('should store category and difficulty', () => {
      expect(puzzle.getCategory()).toBe('Animals');
      expect(puzzle.getDifficulty()).toBe('EASY');
    });
  });

  describe('markWordFound', () => {
    it('should mark word as found', () => {
      const result = puzzle.markWordFound('1');
      expect(result).toBe(true);
      expect(puzzle.getFoundWordCount()).toBe(1);
      expect(puzzle.isWordFound('1')).toBe(true);
    });

    it('should return false for already found word', () => {
      puzzle.markWordFound('1');
      const result = puzzle.markWordFound('1');
      expect(result).toBe(false);
      expect(puzzle.getFoundWordCount()).toBe(1);
    });

    it('should return false for non-existent word', () => {
      const result = puzzle.markWordFound('999');
      expect(result).toBe(false);
      expect(puzzle.getFoundWordCount()).toBe(0);
    });

    it('should mark multiple words as found', () => {
      puzzle.markWordFound('1');
      puzzle.markWordFound('2');
      expect(puzzle.getFoundWordCount()).toBe(2);
    });
  });

  describe('isComplete', () => {
    it('should return false when no words found', () => {
      expect(puzzle.isComplete()).toBe(false);
    });

    it('should return false when some words found', () => {
      puzzle.markWordFound('1');
      puzzle.markWordFound('2');
      expect(puzzle.isComplete()).toBe(false);
    });

    it('should return true when all words found', () => {
      puzzle.markWordFound('1');
      puzzle.markWordFound('2');
      puzzle.markWordFound('3');
      expect(puzzle.isComplete()).toBe(true);
    });
  });

  describe('getFoundWordCount and getTotalWordCount', () => {
    it('should return correct counts', () => {
      expect(puzzle.getTotalWordCount()).toBe(3);
      expect(puzzle.getFoundWordCount()).toBe(0);
      
      puzzle.markWordFound('1');
      expect(puzzle.getFoundWordCount()).toBe(1);
      
      puzzle.markWordFound('2');
      expect(puzzle.getFoundWordCount()).toBe(2);
    });
  });

  describe('getRemainingWords', () => {
    it('should return all words initially', () => {
      const remaining = puzzle.getRemainingWords();
      expect(remaining).toHaveLength(3);
    });

    it('should return only unfound words', () => {
      puzzle.markWordFound('1');
      puzzle.markWordFound('2');
      
      const remaining = puzzle.getRemainingWords();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].getId()).toBe('3');
    });

    it('should return empty array when all found', () => {
      puzzle.markWordFound('1');
      puzzle.markWordFound('2');
      puzzle.markWordFound('3');
      
      expect(puzzle.getRemainingWords()).toHaveLength(0);
    });
  });

  describe('getFoundWords', () => {
    it('should return empty array initially', () => {
      expect(puzzle.getFoundWords()).toHaveLength(0);
    });

    it('should return only found words', () => {
      puzzle.markWordFound('1');
      puzzle.markWordFound('3');
      
      const found = puzzle.getFoundWords();
      expect(found).toHaveLength(2);
      expect(found.map(w => w.getId())).toContain('1');
      expect(found.map(w => w.getId())).toContain('3');
    });
  });

  describe('findWordByText', () => {
    it('should find word by exact text', () => {
      const word = puzzle.findWordByText('CAT');
      expect(word).not.toBeNull();
      expect(word.getId()).toBe('1');
    });

    it('should find word case-insensitively', () => {
      const word = puzzle.findWordByText('cat');
      expect(word).not.toBeNull();
      expect(word.getId()).toBe('1');
    });

    it('should return null for non-existent word', () => {
      const word = puzzle.findWordByText('ELEPHANT');
      expect(word).toBeNull();
    });
  });

  describe('findWordById', () => {
    it('should find word by ID', () => {
      const word = puzzle.findWordById('2');
      expect(word).not.toBeNull();
      expect(word.getText()).toBe('DOG');
    });

    it('should return null for non-existent ID', () => {
      const word = puzzle.findWordById('999');
      expect(word).toBeNull();
    });
  });

  describe('getCompletionPercentage', () => {
    it('should return 0 initially', () => {
      expect(puzzle.getCompletionPercentage()).toBe(0);
    });

    it('should return correct percentage', () => {
      puzzle.markWordFound('1');
      expect(puzzle.getCompletionPercentage()).toBe(33); // 1/3 = 33%
      
      puzzle.markWordFound('2');
      expect(puzzle.getCompletionPercentage()).toBe(67); // 2/3 = 67%
      
      puzzle.markWordFound('3');
      expect(puzzle.getCompletionPercentage()).toBe(100); // 3/3 = 100%
    });

    it('should return 0 for puzzle with no words', () => {
      const emptyPuzzle = new Puzzle(grid, [], 'Test', 'EASY');
      expect(emptyPuzzle.getCompletionPercentage()).toBe(0);
    });
  });

  describe('reset', () => {
    it('should reset all found words', () => {
      puzzle.markWordFound('1');
      puzzle.markWordFound('2');
      puzzle.markWordFound('3');
      
      expect(puzzle.isComplete()).toBe(true);
      
      puzzle.reset();
      
      expect(puzzle.getFoundWordCount()).toBe(0);
      expect(puzzle.isComplete()).toBe(false);
      expect(puzzle.getAllWords().every(w => !w.isFound())).toBe(true);
    });
  });

  describe('isWordFound', () => {
    it('should return false for unfound word', () => {
      expect(puzzle.isWordFound('1')).toBe(false);
    });

    it('should return true for found word', () => {
      puzzle.markWordFound('1');
      expect(puzzle.isWordFound('1')).toBe(true);
    });

    it('should return false for non-existent word', () => {
      expect(puzzle.isWordFound('999')).toBe(false);
    });
  });
});
