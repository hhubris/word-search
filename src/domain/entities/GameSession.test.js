import { describe, it, expect, beforeEach } from 'vitest';
import { GameSession } from './GameSession.js';
import { Puzzle } from './Puzzle.js';
import { Grid } from './Grid.js';
import { Word } from './Word.js';
import { Position } from '../value-objects/Position.js';
import { Direction } from '../value-objects/Direction.js';

describe('GameSession', () => {
  let puzzle, words;

  beforeEach(() => {
    const grid = new Grid(10);
    words = [
      new Word('1', 'CAT', new Position(0, 0), Direction.RIGHT),
      new Word('2', 'DOG', new Position(1, 0), Direction.RIGHT),
      new Word('3', 'BIRD', new Position(2, 0), Direction.RIGHT)
    ];
    puzzle = new Puzzle(grid, words, 'Animals', 'EASY');
  });

  describe('constructor', () => {
    it('should create session with puzzle and difficulty', () => {
      const session = new GameSession(puzzle, 'EASY');
      expect(session.getPuzzle()).toBe(puzzle);
      expect(session.getDifficulty()).toBe('EASY');
    });

    it('should initialize with current time if not provided', () => {
      const before = Date.now();
      const session = new GameSession(puzzle, 'EASY');
      const after = Date.now();
      
      expect(session.getStartTime()).toBeGreaterThanOrEqual(before);
      expect(session.getStartTime()).toBeLessThanOrEqual(after);
    });

    it('should use provided start time', () => {
      const startTime = 1000000;
      const session = new GameSession(puzzle, 'EASY', startTime);
      expect(session.getStartTime()).toBe(startTime);
    });

    it('should initialize as not ended', () => {
      const session = new GameSession(puzzle, 'EASY');
      expect(session.isEnded()).toBe(false);
      expect(session.getEndTime()).toBeNull();
      expect(session.getScore()).toBeNull();
    });
  });

  describe('getTimerDuration', () => {
    it('should return null for EASY difficulty', () => {
      const session = new GameSession(puzzle, 'EASY');
      expect(session.getTimerDuration()).toBeNull();
    });

    it('should return 300 seconds for MEDIUM difficulty', () => {
      const session = new GameSession(puzzle, 'MEDIUM');
      expect(session.getTimerDuration()).toBe(300);
    });

    it('should return 180 seconds for HARD difficulty', () => {
      const session = new GameSession(puzzle, 'HARD');
      expect(session.getTimerDuration()).toBe(180);
    });
  });

  describe('getRemainingTime', () => {
    it('should return null for EASY (no timer)', () => {
      const session = new GameSession(puzzle, 'EASY', 1000);
      expect(session.getRemainingTime(2000)).toBeNull();
    });

    it('should calculate remaining time for MEDIUM', () => {
      const startTime = 1000;
      const session = new GameSession(puzzle, 'MEDIUM', startTime);
      
      // After 10 seconds
      const remaining = session.getRemainingTime(startTime + 10000);
      expect(remaining).toBe(290); // 300 - 10
    });

    it('should return 0 when time expired', () => {
      const startTime = 1000;
      const session = new GameSession(puzzle, 'MEDIUM', startTime);
      
      // After 400 seconds (more than 300)
      const remaining = session.getRemainingTime(startTime + 400000);
      expect(remaining).toBe(0);
    });

    it('should return 0 after game ended', () => {
      const startTime = 1000;
      const session = new GameSession(puzzle, 'MEDIUM', startTime);
      session.endGame(startTime + 10000);
      
      expect(session.getRemainingTime(startTime + 20000)).toBe(0);
    });
  });

  describe('isTimeExpired', () => {
    it('should return false for EASY (no timer)', () => {
      const session = new GameSession(puzzle, 'EASY', 1000);
      expect(session.isTimeExpired(1000000)).toBe(false);
    });

    it('should return false when time remaining', () => {
      const startTime = 1000;
      const session = new GameSession(puzzle, 'MEDIUM', startTime);
      expect(session.isTimeExpired(startTime + 10000)).toBe(false);
    });

    it('should return true when time expired', () => {
      const startTime = 1000;
      const session = new GameSession(puzzle, 'MEDIUM', startTime);
      expect(session.isTimeExpired(startTime + 400000)).toBe(true);
    });
  });

  describe('calculateScore', () => {
    it('should calculate base score for words found', () => {
      const session = new GameSession(puzzle, 'EASY', 1000);
      puzzle.markWordFound('1'); // 1 word found
      
      const score = session.calculateScore(2000);
      expect(score).toBe(100); // 1 * 100 * 1.0 (EASY multiplier)
    });

    it('should add completion bonus for all words found', () => {
      const session = new GameSession(puzzle, 'EASY', 1000);
      puzzle.markWordFound('1');
      puzzle.markWordFound('2');
      puzzle.markWordFound('3');
      
      const score = session.calculateScore(2000);
      expect(score).toBe(800); // (3 * 100 + 500) * 1.0
    });

    it('should add time bonus for timed games', () => {
      const startTime = 1000;
      const session = new GameSession(puzzle, 'MEDIUM', startTime);
      puzzle.markWordFound('1');
      
      // End after 10 seconds, 290 seconds remaining
      const score = session.calculateScore(startTime + 10000);
      // (100 + 0 + 2900) * 1.5 = 4500
      expect(score).toBe(4500);
    });

    it('should apply difficulty multipliers', () => {
      const startTime = 1000;
      
      // EASY: 1.0x (no timer, no time bonus)
      const easySession = new GameSession(puzzle, 'EASY', startTime);
      puzzle.markWordFound('1');
      expect(easySession.calculateScore(startTime + 1000)).toBe(100);
      
      // MEDIUM: 1.5x (with time bonus)
      puzzle.reset();
      const mediumSession = new GameSession(puzzle, 'MEDIUM', startTime);
      puzzle.markWordFound('1');
      const mediumScore = mediumSession.calculateScore(startTime + 1000);
      expect(mediumScore).toBeGreaterThan(100); // Should be higher due to multiplier and time bonus
      
      // HARD: 2.0x (with time bonus, but shorter timer)
      puzzle.reset();
      const hardSession = new GameSession(puzzle, 'HARD', startTime);
      puzzle.markWordFound('1');
      const hardScore = hardSession.calculateScore(startTime + 1000);
      expect(hardScore).toBeGreaterThan(100); // Should be higher due to multiplier
      
      // Verify multipliers work correctly by comparing base scores without time
      // End games immediately so time bonus is minimal
      puzzle.reset();
      const easySession2 = new GameSession(puzzle, 'EASY', startTime);
      puzzle.markWordFound('1');
      const easyFinal = easySession2.calculateScore(startTime + 290000); // Near end
      
      puzzle.reset();
      const mediumSession2 = new GameSession(puzzle, 'MEDIUM', startTime);
      puzzle.markWordFound('1');
      const mediumFinal = mediumSession2.calculateScore(startTime + 290000); // Near end
      
      puzzle.reset();
      const hardSession2 = new GameSession(puzzle, 'HARD', startTime);
      puzzle.markWordFound('1');
      const hardFinal = hardSession2.calculateScore(startTime + 170000); // Near end
      
      // With minimal time bonus, multipliers should be clear
      expect(mediumFinal).toBeGreaterThan(easyFinal);
      expect(hardFinal).toBeGreaterThan(mediumFinal);
    });

    it('should return 0 for no words found', () => {
      const session = new GameSession(puzzle, 'EASY', 1000);
      const score = session.calculateScore(2000);
      expect(score).toBe(0);
    });
  });

  describe('getDifficultyMultiplier', () => {
    it('should return 1.0 for EASY', () => {
      const session = new GameSession(puzzle, 'EASY');
      expect(session.getDifficultyMultiplier()).toBe(1.0);
    });

    it('should return 1.5 for MEDIUM', () => {
      const session = new GameSession(puzzle, 'MEDIUM');
      expect(session.getDifficultyMultiplier()).toBe(1.5);
    });

    it('should return 2.0 for HARD', () => {
      const session = new GameSession(puzzle, 'HARD');
      expect(session.getDifficultyMultiplier()).toBe(2.0);
    });
  });

  describe('endGame', () => {
    it('should set end time and calculate score', () => {
      const startTime = 1000;
      const session = new GameSession(puzzle, 'EASY', startTime);
      puzzle.markWordFound('1');
      
      const endTime = 2000;
      const score = session.endGame(endTime);
      
      expect(session.isEnded()).toBe(true);
      expect(session.getEndTime()).toBe(endTime);
      expect(session.getScore()).toBe(score);
      expect(score).toBe(100);
    });

    it('should not recalculate score on subsequent calls', () => {
      const session = new GameSession(puzzle, 'EASY', 1000);
      puzzle.markWordFound('1');
      
      const firstScore = session.endGame(2000);
      
      // Mark another word after ending
      puzzle.markWordFound('2');
      
      const secondScore = session.endGame(3000);
      expect(secondScore).toBe(firstScore);
    });

    it('should use current time if not provided', () => {
      const session = new GameSession(puzzle, 'EASY');
      const before = Date.now();
      session.endGame();
      const after = Date.now();
      
      expect(session.getEndTime()).toBeGreaterThanOrEqual(before);
      expect(session.getEndTime()).toBeLessThanOrEqual(after);
    });
  });

  describe('getElapsedTime', () => {
    it('should calculate elapsed time', () => {
      const startTime = 1000;
      const session = new GameSession(puzzle, 'EASY', startTime);
      
      const elapsed = session.getElapsedTime(startTime + 5000);
      expect(elapsed).toBe(5); // 5 seconds
    });

    it('should use end time if game ended', () => {
      const startTime = 1000;
      const session = new GameSession(puzzle, 'EASY', startTime);
      session.endGame(startTime + 10000);
      
      // Even if we pass a later time, it should use end time
      const elapsed = session.getElapsedTime(startTime + 20000);
      expect(elapsed).toBe(10);
    });
  });
});
