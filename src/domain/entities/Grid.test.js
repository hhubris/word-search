import { describe, it, expect } from 'vitest';
import { Grid } from './Grid.js';
import { Cell } from './Cell.js';

describe('Grid', () => {
  describe('constructor', () => {
    it('should create a grid with specified size', () => {
      const grid = new Grid(10);
      expect(grid.getSize()).toBe(10);
    });

    it('should initialize all cells', () => {
      const grid = new Grid(5);
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          const cell = grid.getCell(row, col);
          expect(cell).toBeInstanceOf(Cell);
        }
      }
    });
  });

  describe('getCell', () => {
    it('should return cell at valid position', () => {
      const grid = new Grid(5);
      const cell = grid.getCell(2, 3);
      expect(cell).toBeInstanceOf(Cell);
    });

    it('should return null for negative row', () => {
      const grid = new Grid(5);
      expect(grid.getCell(-1, 2)).toBeNull();
    });

    it('should return null for negative col', () => {
      const grid = new Grid(5);
      expect(grid.getCell(2, -1)).toBeNull();
    });

    it('should return null for row >= size', () => {
      const grid = new Grid(5);
      expect(grid.getCell(5, 2)).toBeNull();
    });

    it('should return null for col >= size', () => {
      const grid = new Grid(5);
      expect(grid.getCell(2, 5)).toBeNull();
    });
  });

  describe('setCell', () => {
    it('should set cell at valid position', () => {
      const grid = new Grid(5);
      const newCell = new Cell();
      newCell.setLetter('X');
      
      const result = grid.setCell(2, 3, newCell);
      expect(result).toBe(true);
      expect(grid.getCell(2, 3).getLetter()).toBe('X');
    });

    it('should return false for invalid position', () => {
      const grid = new Grid(5);
      const newCell = new Cell();
      
      expect(grid.setCell(-1, 2, newCell)).toBe(false);
      expect(grid.setCell(2, -1, newCell)).toBe(false);
      expect(grid.setCell(5, 2, newCell)).toBe(false);
      expect(grid.setCell(2, 5, newCell)).toBe(false);
    });
  });

  describe('setLetter', () => {
    it('should set letter at valid position', () => {
      const grid = new Grid(5);
      const result = grid.setLetter(2, 3, 'A');
      
      expect(result).toBe(true);
      expect(grid.getCell(2, 3).getLetter()).toBe('A');
    });

    it('should return false for invalid position', () => {
      const grid = new Grid(5);
      expect(grid.setLetter(-1, 2, 'A')).toBe(false);
      expect(grid.setLetter(5, 2, 'A')).toBe(false);
    });
  });

  describe('isValidPosition', () => {
    it('should return true for valid positions', () => {
      const grid = new Grid(5);
      expect(grid.isValidPosition(0, 0)).toBe(true);
      expect(grid.isValidPosition(2, 3)).toBe(true);
      expect(grid.isValidPosition(4, 4)).toBe(true);
    });

    it('should return false for negative positions', () => {
      const grid = new Grid(5);
      expect(grid.isValidPosition(-1, 0)).toBe(false);
      expect(grid.isValidPosition(0, -1)).toBe(false);
    });

    it('should return false for positions >= size', () => {
      const grid = new Grid(5);
      expect(grid.isValidPosition(5, 0)).toBe(false);
      expect(grid.isValidPosition(0, 5)).toBe(false);
    });
  });

  describe('getAllCells', () => {
    it('should return copy of all cells', () => {
      const grid = new Grid(3);
      grid.setLetter(0, 0, 'A');
      grid.setLetter(1, 1, 'B');
      
      const cells = grid.getAllCells();
      expect(cells).toHaveLength(3);
      expect(cells[0]).toHaveLength(3);
      expect(cells[0][0].getLetter()).toBe('A');
      expect(cells[1][1].getLetter()).toBe('B');
    });

    it('should return a copy not affecting original', () => {
      const grid = new Grid(3);
      const cells = grid.getAllCells();
      
      // Modify the copy
      cells[0][0] = new Cell();
      cells[0][0].setLetter('X');
      
      // Original should be unchanged
      expect(grid.getCell(0, 0).getLetter()).not.toBe('X');
    });
  });

  describe('toString', () => {
    it('should return string representation of grid', () => {
      const grid = new Grid(3);
      grid.setLetter(0, 0, 'A');
      grid.setLetter(0, 1, 'B');
      grid.setLetter(0, 2, 'C');
      
      const str = grid.toString();
      expect(str).toContain('A');
      expect(str).toContain('B');
      expect(str).toContain('C');
    });

    it('should use dots for empty cells', () => {
      const grid = new Grid(2);
      const str = grid.toString();
      expect(str).toContain('.');
    });
  });
});
