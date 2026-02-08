import { describe, it, expect } from 'vitest';
import { Selection } from './Selection.js';
import { Position } from './Position.js';
import { Direction } from './Direction.js';
import { Grid } from '../entities/Grid.js';

describe('Selection', () => {
  describe('constructor', () => {
    it('should create empty selection with no positions', () => {
      const selection = new Selection();
      expect(selection.positions).toEqual([]);
    });

    it('should create selection with provided positions', () => {
      const positions = [new Position(0, 0), new Position(0, 1)];
      const selection = new Selection(positions);
      expect(selection.positions).toEqual(positions);
    });
  });

  describe('getStart', () => {
    it('should return first position', () => {
      const positions = [new Position(0, 0), new Position(0, 1), new Position(0, 2)];
      const selection = new Selection(positions);
      expect(selection.getStart()).toBe(positions[0]);
    });

    it('should return null for empty selection', () => {
      const selection = new Selection();
      expect(selection.getStart()).toBeNull();
    });
  });

  describe('getEnd', () => {
    it('should return last position', () => {
      const positions = [new Position(0, 0), new Position(0, 1), new Position(0, 2)];
      const selection = new Selection(positions);
      expect(selection.getEnd()).toBe(positions[2]);
    });

    it('should return null for empty selection', () => {
      const selection = new Selection();
      expect(selection.getEnd()).toBeNull();
    });
  });

  describe('getDirection', () => {
    it('should return null for empty selection', () => {
      const selection = new Selection();
      expect(selection.getDirection()).toBeNull();
    });

    it('should return null for single position', () => {
      const selection = new Selection([new Position(0, 0)]);
      expect(selection.getDirection()).toBeNull();
    });

    it('should return RIGHT for horizontal selection', () => {
      const positions = [new Position(0, 0), new Position(0, 1), new Position(0, 2)];
      const selection = new Selection(positions);
      expect(selection.getDirection()).toBe(Direction.RIGHT);
    });

    it('should return DOWN for vertical selection', () => {
      const positions = [new Position(0, 0), new Position(1, 0), new Position(2, 0)];
      const selection = new Selection(positions);
      expect(selection.getDirection()).toBe(Direction.DOWN);
    });

    it('should return DOWN_RIGHT for diagonal selection', () => {
      const positions = [new Position(0, 0), new Position(1, 1), new Position(2, 2)];
      const selection = new Selection(positions);
      expect(selection.getDirection()).toBe(Direction.DOWN_RIGHT);
    });
  });

  describe('getPositions', () => {
    it('should return copy of positions array', () => {
      const positions = [new Position(0, 0), new Position(0, 1)];
      const selection = new Selection(positions);
      const result = selection.getPositions();
      expect(result).toEqual(positions);
      expect(result).not.toBe(positions); // Should be a copy
    });

    it('should return empty array for empty selection', () => {
      const selection = new Selection();
      expect(selection.getPositions()).toEqual([]);
    });
  });

  describe('getText', () => {
    it('should extract text from grid cells', () => {
      const grid = new Grid(5);
      grid.setLetter(0, 0, 'C');
      grid.setLetter(0, 1, 'A');
      grid.setLetter(0, 2, 'T');

      const positions = [new Position(0, 0), new Position(0, 1), new Position(0, 2)];
      const selection = new Selection(positions);

      expect(selection.getText(grid)).toBe('CAT');
    });

    it('should return uppercase text', () => {
      const grid = new Grid(5);
      grid.setLetter(0, 0, 'c');
      grid.setLetter(0, 1, 'a');
      grid.setLetter(0, 2, 't');

      const positions = [new Position(0, 0), new Position(0, 1), new Position(0, 2)];
      const selection = new Selection(positions);

      expect(selection.getText(grid)).toBe('CAT');
    });

    it('should return empty string for empty selection', () => {
      const grid = new Grid(5);
      const selection = new Selection();
      expect(selection.getText(grid)).toBe('');
    });

    it('should handle vertical text extraction', () => {
      const grid = new Grid(5);
      grid.setLetter(0, 0, 'D');
      grid.setLetter(1, 0, 'O');
      grid.setLetter(2, 0, 'G');

      const positions = [new Position(0, 0), new Position(1, 0), new Position(2, 0)];
      const selection = new Selection(positions);

      expect(selection.getText(grid)).toBe('DOG');
    });

    it('should handle diagonal text extraction', () => {
      const grid = new Grid(5);
      grid.setLetter(0, 0, 'B');
      grid.setLetter(1, 1, 'I');
      grid.setLetter(2, 2, 'G');

      const positions = [new Position(0, 0), new Position(1, 1), new Position(2, 2)];
      const selection = new Selection(positions);

      expect(selection.getText(grid)).toBe('BIG');
    });
  });

  describe('length', () => {
    it('should return number of positions', () => {
      const positions = [new Position(0, 0), new Position(0, 1), new Position(0, 2)];
      const selection = new Selection(positions);
      expect(selection.length()).toBe(3);
    });

    it('should return 0 for empty selection', () => {
      const selection = new Selection();
      expect(selection.length()).toBe(0);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty selection', () => {
      const selection = new Selection();
      expect(selection.isEmpty()).toBe(true);
    });

    it('should return false for non-empty selection', () => {
      const selection = new Selection([new Position(0, 0)]);
      expect(selection.isEmpty()).toBe(false);
    });
  });

  describe('addPosition', () => {
    it('should return new selection with added position', () => {
      const selection = new Selection([new Position(0, 0)]);
      const newSelection = selection.addPosition(new Position(0, 1));
      
      expect(newSelection.length()).toBe(2);
      expect(newSelection.getPositions()).toEqual([
        new Position(0, 0),
        new Position(0, 1)
      ]);
    });

    it('should not modify original selection', () => {
      const selection = new Selection([new Position(0, 0)]);
      selection.addPosition(new Position(0, 1));
      
      expect(selection.length()).toBe(1);
    });

    it('should work on empty selection', () => {
      const selection = new Selection();
      const newSelection = selection.addPosition(new Position(0, 0));
      
      expect(newSelection.length()).toBe(1);
      expect(newSelection.getStart()).toEqual(new Position(0, 0));
    });
  });

  describe('clear', () => {
    it('should return empty selection', () => {
      const selection = new Selection([new Position(0, 0), new Position(0, 1)]);
      const cleared = selection.clear();
      
      expect(cleared.isEmpty()).toBe(true);
      expect(cleared.length()).toBe(0);
    });

    it('should not modify original selection', () => {
      const selection = new Selection([new Position(0, 0)]);
      selection.clear();
      
      expect(selection.length()).toBe(1);
    });
  });
});
