import { describe, it, expect } from 'vitest';
import { Direction, getDirectionsForDifficulty, getDirection, getNextPosition } from './Direction.js';
import { Position } from './Position.js';

describe('Direction', () => {
  describe('Direction enum', () => {
    it('should have all 8 directions defined', () => {
      expect(Direction.RIGHT).toBeDefined();
      expect(Direction.LEFT).toBeDefined();
      expect(Direction.DOWN).toBeDefined();
      expect(Direction.UP).toBeDefined();
      expect(Direction.DOWN_RIGHT).toBeDefined();
      expect(Direction.DOWN_LEFT).toBeDefined();
      expect(Direction.UP_RIGHT).toBeDefined();
      expect(Direction.UP_LEFT).toBeDefined();
    });

    it('should have correct dx and dy values for RIGHT', () => {
      expect(Direction.RIGHT.dx).toBe(1);
      expect(Direction.RIGHT.dy).toBe(0);
    });

    it('should have correct dx and dy values for DOWN', () => {
      expect(Direction.DOWN.dx).toBe(0);
      expect(Direction.DOWN.dy).toBe(1);
    });

    it('should have correct dx and dy values for DOWN_RIGHT', () => {
      expect(Direction.DOWN_RIGHT.dx).toBe(1);
      expect(Direction.DOWN_RIGHT.dy).toBe(1);
    });
  });

  describe('getDirectionsForDifficulty', () => {
    it('should return 2 directions for EASY (RIGHT and DOWN)', () => {
      const directions = getDirectionsForDifficulty('EASY');
      expect(directions).toHaveLength(2);
      expect(directions).toContain(Direction.RIGHT);
      expect(directions).toContain(Direction.DOWN);
    });

    it('should return 4 directions for MEDIUM', () => {
      const directions = getDirectionsForDifficulty('MEDIUM');
      expect(directions).toHaveLength(4);
      expect(directions).toContain(Direction.RIGHT);
      expect(directions).toContain(Direction.DOWN);
      expect(directions).toContain(Direction.DOWN_RIGHT);
      expect(directions).toContain(Direction.DOWN_LEFT);
    });

    it('should return 8 directions for HARD', () => {
      const directions = getDirectionsForDifficulty('HARD');
      expect(directions).toHaveLength(8);
      expect(directions).toContain(Direction.RIGHT);
      expect(directions).toContain(Direction.LEFT);
      expect(directions).toContain(Direction.DOWN);
      expect(directions).toContain(Direction.UP);
      expect(directions).toContain(Direction.DOWN_RIGHT);
      expect(directions).toContain(Direction.DOWN_LEFT);
      expect(directions).toContain(Direction.UP_RIGHT);
      expect(directions).toContain(Direction.UP_LEFT);
    });

    it('should return empty array for invalid difficulty', () => {
      const directions = getDirectionsForDifficulty('INVALID');
      expect(directions).toHaveLength(0);
    });

    it('should return empty array for null difficulty', () => {
      const directions = getDirectionsForDifficulty(null);
      expect(directions).toHaveLength(0);
    });
  });

  describe('getDirection', () => {
    it('should return null for same position', () => {
      const pos = new Position(0, 0);
      expect(getDirection(pos, pos)).toBeNull();
    });

    it('should return RIGHT for horizontal right movement', () => {
      const start = new Position(0, 0);
      const end = new Position(0, 3);
      expect(getDirection(start, end)).toBe(Direction.RIGHT);
    });

    it('should return LEFT for horizontal left movement', () => {
      const start = new Position(0, 3);
      const end = new Position(0, 0);
      expect(getDirection(start, end)).toBe(Direction.LEFT);
    });

    it('should return DOWN for vertical down movement', () => {
      const start = new Position(0, 0);
      const end = new Position(3, 0);
      expect(getDirection(start, end)).toBe(Direction.DOWN);
    });

    it('should return UP for vertical up movement', () => {
      const start = new Position(3, 0);
      const end = new Position(0, 0);
      expect(getDirection(start, end)).toBe(Direction.UP);
    });

    it('should return DOWN_RIGHT for diagonal down-right movement', () => {
      const start = new Position(0, 0);
      const end = new Position(3, 3);
      expect(getDirection(start, end)).toBe(Direction.DOWN_RIGHT);
    });

    it('should return DOWN_LEFT for diagonal down-left movement', () => {
      const start = new Position(0, 3);
      const end = new Position(3, 0);
      expect(getDirection(start, end)).toBe(Direction.DOWN_LEFT);
    });

    it('should return UP_RIGHT for diagonal up-right movement', () => {
      const start = new Position(3, 0);
      const end = new Position(0, 3);
      expect(getDirection(start, end)).toBe(Direction.UP_RIGHT);
    });

    it('should return UP_LEFT for diagonal up-left movement', () => {
      const start = new Position(3, 3);
      const end = new Position(0, 0);
      expect(getDirection(start, end)).toBe(Direction.UP_LEFT);
    });

    it('should return null for non-straight line movement', () => {
      const start = new Position(0, 0);
      const end = new Position(2, 3);
      expect(getDirection(start, end)).toBeNull();
    });

    it('should return null for L-shaped movement', () => {
      const start = new Position(0, 0);
      const end = new Position(1, 2);
      expect(getDirection(start, end)).toBeNull();
    });
  });

  describe('getNextPosition', () => {
    it('should return next position in RIGHT direction', () => {
      const current = new Position(2, 3);
      const next = getNextPosition(current, Direction.RIGHT);
      expect(next.row).toBe(2);
      expect(next.col).toBe(4);
    });

    it('should return next position in DOWN direction', () => {
      const current = new Position(2, 3);
      const next = getNextPosition(current, Direction.DOWN);
      expect(next.row).toBe(3);
      expect(next.col).toBe(3);
    });

    it('should return next position in DOWN_RIGHT direction', () => {
      const current = new Position(2, 3);
      const next = getNextPosition(current, Direction.DOWN_RIGHT);
      expect(next.row).toBe(3);
      expect(next.col).toBe(4);
    });

    it('should not modify the original position', () => {
      const current = new Position(2, 3);
      getNextPosition(current, Direction.RIGHT);
      expect(current.row).toBe(2);
      expect(current.col).toBe(3);
    });
  });
});
