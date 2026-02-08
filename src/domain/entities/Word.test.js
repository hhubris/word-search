import { describe, it, expect } from 'vitest';
import { Word } from './Word.js';
import { Position } from '../value-objects/Position.js';
import { Direction } from '../value-objects/Direction.js';

describe('Word', () => {
  describe('constructor', () => {
    it('should create word with uppercase text', () => {
      const word = new Word('1', 'cat', new Position(0, 0), Direction.RIGHT);
      expect(word.getText()).toBe('CAT');
    });

    it('should initialize as not found', () => {
      const word = new Word('1', 'dog', new Position(0, 0), Direction.RIGHT);
      expect(word.isFound()).toBe(false);
    });
  });

  describe('getPositions', () => {
    it('should calculate positions for horizontal word', () => {
      const word = new Word('1', 'CAT', new Position(0, 0), Direction.RIGHT);
      const positions = word.getPositions();
      
      expect(positions).toHaveLength(3);
      expect(positions[0]).toEqual(new Position(0, 0));
      expect(positions[1]).toEqual(new Position(0, 1));
      expect(positions[2]).toEqual(new Position(0, 2));
    });

    it('should calculate positions for vertical word', () => {
      const word = new Word('1', 'DOG', new Position(0, 0), Direction.DOWN);
      const positions = word.getPositions();
      
      expect(positions).toHaveLength(3);
      expect(positions[0]).toEqual(new Position(0, 0));
      expect(positions[1]).toEqual(new Position(1, 0));
      expect(positions[2]).toEqual(new Position(2, 0));
    });

    it('should calculate positions for diagonal word', () => {
      const word = new Word('1', 'BIG', new Position(0, 0), Direction.DOWN_RIGHT);
      const positions = word.getPositions();
      
      expect(positions).toHaveLength(3);
      expect(positions[0]).toEqual(new Position(0, 0));
      expect(positions[1]).toEqual(new Position(1, 1));
      expect(positions[2]).toEqual(new Position(2, 2));
    });

    it('should calculate positions for word going left', () => {
      const word = new Word('1', 'CAT', new Position(0, 5), Direction.LEFT);
      const positions = word.getPositions();
      
      expect(positions).toHaveLength(3);
      expect(positions[0]).toEqual(new Position(0, 5));
      expect(positions[1]).toEqual(new Position(0, 4));
      expect(positions[2]).toEqual(new Position(0, 3));
    });

    it('should calculate positions for word going up', () => {
      const word = new Word('1', 'DOG', new Position(5, 0), Direction.UP);
      const positions = word.getPositions();
      
      expect(positions).toHaveLength(3);
      expect(positions[0]).toEqual(new Position(5, 0));
      expect(positions[1]).toEqual(new Position(4, 0));
      expect(positions[2]).toEqual(new Position(3, 0));
    });
  });

  describe('markFound and isFound', () => {
    it('should mark word as found', () => {
      const word = new Word('1', 'cat', new Position(0, 0), Direction.RIGHT);
      expect(word.isFound()).toBe(false);
      
      word.markFound();
      expect(word.isFound()).toBe(true);
    });

    it('should mark word as not found', () => {
      const word = new Word('1', 'cat', new Position(0, 0), Direction.RIGHT);
      word.markFound();
      expect(word.isFound()).toBe(true);
      
      word.markNotFound();
      expect(word.isFound()).toBe(false);
    });
  });

  describe('getters', () => {
    it('should return word ID', () => {
      const word = new Word('word-123', 'cat', new Position(0, 0), Direction.RIGHT);
      expect(word.getId()).toBe('word-123');
    });

    it('should return word text in uppercase', () => {
      const word = new Word('1', 'cat', new Position(0, 0), Direction.RIGHT);
      expect(word.getText()).toBe('CAT');
    });

    it('should return start position', () => {
      const startPos = new Position(2, 3);
      const word = new Word('1', 'cat', startPos, Direction.RIGHT);
      expect(word.getStartPosition()).toBe(startPos);
    });

    it('should return direction', () => {
      const word = new Word('1', 'cat', new Position(0, 0), Direction.DOWN);
      expect(word.getDirection()).toBe(Direction.DOWN);
    });

    it('should return word length', () => {
      const word = new Word('1', 'elephant', new Position(0, 0), Direction.RIGHT);
      expect(word.getLength()).toBe(8);
    });
  });
});
