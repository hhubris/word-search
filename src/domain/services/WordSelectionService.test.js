import { describe, it, expect } from 'vitest';
import { WordSelectionService } from './WordSelectionService.js';
import { Grid } from '../entities/Grid.js';
import { Word } from '../entities/Word.js';
import { Puzzle } from '../entities/Puzzle.js';
import { Position } from '../value-objects/Position.js';
import { Selection } from '../value-objects/Selection.js';
import { Direction } from '../value-objects/Direction.js';

describe('WordSelectionService', () => {
  const service = new WordSelectionService();

  describe('validateSelection', () => {
    it('should return null for empty selection', () => {
      const grid = new Grid(5);
      const puzzle = new Puzzle(grid, [], 'Animals', 'EASY');
      const selection = new Selection([]);

      const result = service.validateSelection(selection, puzzle);
      expect(result).toBeNull();
    });

    it('should return null for selection shorter than 3 characters', () => {
      const grid = new Grid(5);
      grid.setLetter(0, 0, 'C');
      grid.setLetter(0, 1, 'A');
      
      const puzzle = new Puzzle(grid, [], 'Animals', 'EASY');
      const selection = new Selection([
        new Position(0, 0),
        new Position(0, 1)
      ]);

      const result = service.validateSelection(selection, puzzle);
      expect(result).toBeNull();
    });

    it('should return word when selection matches a word in puzzle', () => {
      const grid = new Grid(5);
      grid.setLetter(0, 0, 'C');
      grid.setLetter(0, 1, 'A');
      grid.setLetter(0, 2, 'T');

      const word = new Word('1', 'CAT', new Position(0, 0), Direction.RIGHT);
      const puzzle = new Puzzle(grid, [word], 'Animals', 'EASY');
      
      const selection = new Selection([
        new Position(0, 0),
        new Position(0, 1),
        new Position(0, 2)
      ]);

      const result = service.validateSelection(selection, puzzle);
      expect(result).toBe(word);
      expect(result.getText()).toBe('CAT');
    });

    it('should return null when word is already found', () => {
      const grid = new Grid(5);
      grid.setLetter(0, 0, 'C');
      grid.setLetter(0, 1, 'A');
      grid.setLetter(0, 2, 'T');

      const word = new Word('1', 'CAT', new Position(0, 0), Direction.RIGHT);
      word.markFound();
      const puzzle = new Puzzle(grid, [word], 'Animals', 'EASY');
      
      const selection = new Selection([
        new Position(0, 0),
        new Position(0, 1),
        new Position(0, 2)
      ]);

      const result = service.validateSelection(selection, puzzle);
      expect(result).toBeNull();
    });

    it('should return null when selection text matches but positions do not', () => {
      const grid = new Grid(5);
      grid.setLetter(0, 0, 'C');
      grid.setLetter(0, 1, 'A');
      grid.setLetter(0, 2, 'T');
      grid.setLetter(1, 0, 'C');
      grid.setLetter(1, 1, 'A');
      grid.setLetter(1, 2, 'T');

      const word = new Word('1', 'CAT', new Position(0, 0), Direction.RIGHT);
      const puzzle = new Puzzle(grid, [word], 'Animals', 'EASY');
      
      // Select CAT from row 1 instead of row 0
      const selection = new Selection([
        new Position(1, 0),
        new Position(1, 1),
        new Position(1, 2)
      ]);

      const result = service.validateSelection(selection, puzzle);
      expect(result).toBeNull();
    });
  });

  describe('determineDirection', () => {
    it('should return null for same position', () => {
      const pos = new Position(0, 0);
      const result = service.determineDirection(pos, pos);
      expect(result).toBeNull();
    });

    it('should return RIGHT for horizontal right movement', () => {
      const start = new Position(0, 0);
      const end = new Position(0, 2);
      const result = service.determineDirection(start, end);
      expect(result).toBe(Direction.RIGHT);
    });

    it('should return DOWN for vertical down movement', () => {
      const start = new Position(0, 0);
      const end = new Position(2, 0);
      const result = service.determineDirection(start, end);
      expect(result).toBe(Direction.DOWN);
    });

    it('should return DOWN_RIGHT for diagonal movement', () => {
      const start = new Position(0, 0);
      const end = new Position(2, 2);
      const result = service.determineDirection(start, end);
      expect(result).toBe(Direction.DOWN_RIGHT);
    });

    it('should return null for invalid inputs', () => {
      expect(service.determineDirection(null, new Position(0, 0))).toBeNull();
      expect(service.determineDirection(new Position(0, 0), null)).toBeNull();
    });
  });

  describe('restrictToDirection', () => {
    it('should return position if it lies along horizontal direction', () => {
      const start = new Position(0, 0);
      const current = new Position(0, 3);
      const result = service.restrictToDirection(start, Direction.RIGHT, current);
      expect(result).toBe(current);
    });

    it('should return null if position does not lie along horizontal direction', () => {
      const start = new Position(0, 0);
      const current = new Position(1, 3);
      const result = service.restrictToDirection(start, Direction.RIGHT, current);
      expect(result).toBeNull();
    });

    it('should return position if it lies along vertical direction', () => {
      const start = new Position(0, 0);
      const current = new Position(3, 0);
      const result = service.restrictToDirection(start, Direction.DOWN, current);
      expect(result).toBe(current);
    });

    it('should return null if position does not lie along vertical direction', () => {
      const start = new Position(0, 0);
      const current = new Position(3, 1);
      const result = service.restrictToDirection(start, Direction.DOWN, current);
      expect(result).toBeNull();
    });

    it('should return position if it lies along diagonal direction', () => {
      const start = new Position(0, 0);
      const current = new Position(3, 3);
      const result = service.restrictToDirection(start, Direction.DOWN_RIGHT, current);
      expect(result).toBe(current);
    });

    it('should return null if diagonal position has unequal deltas', () => {
      const start = new Position(0, 0);
      const current = new Position(3, 2);
      const result = service.restrictToDirection(start, Direction.DOWN_RIGHT, current);
      expect(result).toBeNull();
    });

    it('should return null for invalid inputs', () => {
      expect(service.restrictToDirection(null, Direction.RIGHT, new Position(0, 0))).toBeNull();
      expect(service.restrictToDirection(new Position(0, 0), null, new Position(0, 0))).toBeNull();
      expect(service.restrictToDirection(new Position(0, 0), Direction.RIGHT, null)).toBeNull();
    });
  });
});
