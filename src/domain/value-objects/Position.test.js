import { describe, it, expect } from 'vitest';
import { Position } from './Position.js';
import { Direction } from './Direction.js';

describe('Position', () => {
  describe('constructor', () => {
    it('should create a position with row and col', () => {
      const pos = new Position(3, 5);
      expect(pos.row).toBe(3);
      expect(pos.col).toBe(5);
    });
  });

  describe('equals', () => {
    it('should return true for positions with same row and col', () => {
      const pos1 = new Position(2, 3);
      const pos2 = new Position(2, 3);
      expect(pos1.equals(pos2)).toBe(true);
    });

    it('should return false for positions with different row', () => {
      const pos1 = new Position(2, 3);
      const pos2 = new Position(3, 3);
      expect(pos1.equals(pos2)).toBe(false);
    });

    it('should return false for positions with different col', () => {
      const pos1 = new Position(2, 3);
      const pos2 = new Position(2, 4);
      expect(pos1.equals(pos2)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      const pos = new Position(2, 3);
      expect(pos.equals(null)).toBe(false);
      expect(pos.equals(undefined)).toBe(false);
    });
  });

  describe('add', () => {
    it('should add RIGHT direction correctly', () => {
      const pos = new Position(2, 3);
      const newPos = pos.add(Direction.RIGHT);
      expect(newPos.row).toBe(2);
      expect(newPos.col).toBe(4);
    });

    it('should add LEFT direction correctly', () => {
      const pos = new Position(2, 3);
      const newPos = pos.add(Direction.LEFT);
      expect(newPos.row).toBe(2);
      expect(newPos.col).toBe(2);
    });

    it('should add DOWN direction correctly', () => {
      const pos = new Position(2, 3);
      const newPos = pos.add(Direction.DOWN);
      expect(newPos.row).toBe(3);
      expect(newPos.col).toBe(3);
    });

    it('should add UP direction correctly', () => {
      const pos = new Position(2, 3);
      const newPos = pos.add(Direction.UP);
      expect(newPos.row).toBe(1);
      expect(newPos.col).toBe(3);
    });

    it('should add DOWN_RIGHT direction correctly', () => {
      const pos = new Position(2, 3);
      const newPos = pos.add(Direction.DOWN_RIGHT);
      expect(newPos.row).toBe(3);
      expect(newPos.col).toBe(4);
    });

    it('should add DOWN_LEFT direction correctly', () => {
      const pos = new Position(2, 3);
      const newPos = pos.add(Direction.DOWN_LEFT);
      expect(newPos.row).toBe(3);
      expect(newPos.col).toBe(2);
    });

    it('should add UP_RIGHT direction correctly', () => {
      const pos = new Position(2, 3);
      const newPos = pos.add(Direction.UP_RIGHT);
      expect(newPos.row).toBe(1);
      expect(newPos.col).toBe(4);
    });

    it('should add UP_LEFT direction correctly', () => {
      const pos = new Position(2, 3);
      const newPos = pos.add(Direction.UP_LEFT);
      expect(newPos.row).toBe(1);
      expect(newPos.col).toBe(2);
    });

    it('should not modify the original position', () => {
      const pos = new Position(2, 3);
      pos.add(Direction.RIGHT);
      expect(pos.row).toBe(2);
      expect(pos.col).toBe(3);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const pos = new Position(2, 3);
      expect(pos.toString()).toBe('(2, 3)');
    });
  });
});
