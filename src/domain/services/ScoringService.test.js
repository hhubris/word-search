import { describe, it, expect } from 'vitest';
import { ScoringService } from './ScoringService.js';
import { GameSession } from '../entities/GameSession.js';
import { Puzzle } from '../entities/Puzzle.js';
import { Grid } from '../entities/Grid.js';
import { Word } from '../entities/Word.js';
import { Position } from '../value-objects/Position.js';
import { Direction } from '../value-objects/Direction.js';

describe('ScoringService', () => {
  const service = new ScoringService();

  describe('getDifficultyMultiplier', () => {
    it('should return 1.0 for EASY difficulty', () => {
      expect(service.getDifficultyMultiplier('EASY')).toBe(1.0);
    });

    it('should return 1.5 for MEDIUM difficulty', () => {
      expect(service.getDifficultyMultiplier('MEDIUM')).toBe(1.5);
    });

    it('should return 2.0 for HARD difficulty', () => {
      expect(service.getDifficultyMultiplier('HARD')).toBe(2.0);
    });

    it('should return 1.0 for unknown difficulty', () => {
      expect(service.getDifficultyMultiplier('UNKNOWN')).toBe(1.0);
    });
  });

  describe('calculateBaseScore', () => {
    it('should calculate 100 points per word', () => {
      expect(service.calculateBaseScore(0)).toBe(0);
      expect(service.calculateBaseScore(1)).toBe(100);
      expect(service.calculateBaseScore(5)).toBe(500);
      expect(service.calculateBaseScore(8)).toBe(800);
    });
  });

  describe('calculateCompletionBonus', () => {
    it('should return 500 when all words found', () => {
      expect(service.calculateCompletionBonus(8, 8)).toBe(500);
      expect(service.calculateCompletionBonus(12, 12)).toBe(500);
    });

    it('should return 0 when not all words found', () => {
      expect(service.calculateCompletionBonus(0, 8)).toBe(0);
      expect(service.calculateCompletionBonus(7, 8)).toBe(0);
      expect(service.calculateCompletionBonus(11, 12)).toBe(0);
    });
  });

  describe('calculateTimeBonus', () => {
    it('should return 0 for null remaining time (no timer)', () => {
      expect(service.calculateTimeBonus(null)).toBe(0);
    });

    it('should calculate 10 points per second', () => {
      expect(service.calculateTimeBonus(0)).toBe(0);
      expect(service.calculateTimeBonus(10)).toBe(100);
      expect(service.calculateTimeBonus(30)).toBe(300);
      expect(service.calculateTimeBonus(180)).toBe(1800);
    });

    it('should floor fractional seconds', () => {
      expect(service.calculateTimeBonus(10.9)).toBe(100);
      expect(service.calculateTimeBonus(15.5)).toBe(150);
    });
  });

  describe('calculateScore - EASY difficulty', () => {
    it('should calculate score with 12 minute timer and all words found', () => {
      const grid = new Grid(8);
      const words = Array.from({ length: 8 }, (_, i) => 
        new Word(`${i}`, `WORD${i}`, new Position(0, 0), Direction.RIGHT)
      );
      
      const puzzle = new Puzzle(grid, words, 'Animals', 'EASY');
      words.forEach(w => puzzle.markWordFound(w.getId()));
      
      const startTime = Date.now();
      const session = new GameSession(puzzle, 'EASY', startTime);
      // Simulate 1 second elapsed
      session.endGame(startTime + 1000);
      
      const score = service.calculateScore(session);
      
      // 8 words * 100 = 800
      // Completion bonus = 500
      // Time bonus = (720 - 1) * 10 = 7190
      // Multiplier = 1.0
      // Total = (800 + 500 + 7190) * 1.0 = 8490
      expect(score).toBe(8490);
    });

    it('should calculate score with partial completion', () => {
      const grid = new Grid(8);
      const words = Array.from({ length: 8 }, (_, i) => 
        new Word(`${i}`, `WORD${i}`, new Position(0, 0), Direction.RIGHT)
      );
      
      const puzzle = new Puzzle(grid, words, 'Animals', 'EASY');
      
      // Mark only 5 words as found
      for (let i = 0; i < 5; i++) {
        puzzle.markWordFound(words[i].getId());
      }
      
      const startTime = Date.now();
      const session = new GameSession(puzzle, 'EASY', startTime);
      // Simulate 2 seconds elapsed
      session.endGame(startTime + 2000);
      
      const score = service.calculateScore(session);
      
      // 5 words * 100 = 500
      // Completion bonus = 0 (not all found)
      // Time bonus = (720 - 2) * 10 = 7180
      // Multiplier = 1.0
      // Total = (500 + 0 + 7180) * 1.0 = 7680
      expect(score).toBe(7680);
    });
  });

  describe('calculateScore - MEDIUM difficulty', () => {
    it('should calculate score with timer and all words found', () => {
      const grid = new Grid(10);
      const words = Array.from({ length: 12 }, (_, i) => 
        new Word(`${i}`, `WORD${i}`, new Position(0, 0), Direction.RIGHT)
      );
      
      const puzzle = new Puzzle(grid, words, 'Sports', 'MEDIUM');
      words.forEach(w => puzzle.markWordFound(w.getId()));
      
      // Start time and end time with 60 seconds remaining (300 - 240 = 60)
      const startTime = Date.now();
      const endTime = startTime + (240 * 1000); // 240 seconds elapsed
      
      const session = new GameSession(puzzle, 'MEDIUM', startTime);
      session.endGame(endTime);
      
      const score = service.calculateScore(session);
      
      // 12 words * 100 = 1200
      // Completion bonus = 500
      // Time bonus = 60 * 10 = 600
      // Multiplier = 1.5
      // Total = (1200 + 500 + 600) * 1.5 = 3450
      expect(score).toBe(3450);
    });

    it('should calculate score with timer expired', () => {
      const grid = new Grid(10);
      const words = Array.from({ length: 12 }, (_, i) => 
        new Word(`${i}`, `WORD${i}`, new Position(0, 0), Direction.RIGHT)
      );
      
      const puzzle = new Puzzle(grid, words, 'Sports', 'MEDIUM');
      
      // Mark 10 words as found
      for (let i = 0; i < 10; i++) {
        puzzle.markWordFound(words[i].getId());
      }
      
      // Timer expired (300+ seconds elapsed)
      const startTime = Date.now();
      const endTime = startTime + (301 * 1000);
      
      const session = new GameSession(puzzle, 'MEDIUM', startTime);
      session.endGame(endTime);
      
      const score = service.calculateScore(session);
      
      // 10 words * 100 = 1000
      // Completion bonus = 0 (not all found)
      // Time bonus = 0 (timer expired)
      // Multiplier = 1.5
      // Total = (1000 + 0 + 0) * 1.5 = 1500
      expect(score).toBe(1500);
    });
  });

  describe('calculateScore - HARD difficulty', () => {
    it('should calculate score with timer and all words found', () => {
      const grid = new Grid(12);
      const words = Array.from({ length: 16 }, (_, i) => 
        new Word(`${i}`, `WORD${i}`, new Position(0, 0), Direction.RIGHT)
      );
      
      const puzzle = new Puzzle(grid, words, 'Science', 'HARD');
      words.forEach(w => puzzle.markWordFound(w.getId()));
      
      // Start time and end time with 90 seconds remaining (180 - 90 = 90)
      const startTime = Date.now();
      const endTime = startTime + (90 * 1000);
      
      const session = new GameSession(puzzle, 'HARD', startTime);
      session.endGame(endTime);
      
      const score = service.calculateScore(session);
      
      // 16 words * 100 = 1600
      // Completion bonus = 500
      // Time bonus = 90 * 10 = 900
      // Multiplier = 2.0
      // Total = (1600 + 500 + 900) * 2.0 = 6000
      expect(score).toBe(6000);
    });

    it('should calculate score with partial completion and some time remaining', () => {
      const grid = new Grid(12);
      const words = Array.from({ length: 16 }, (_, i) => 
        new Word(`${i}`, `WORD${i}`, new Position(0, 0), Direction.RIGHT)
      );
      
      const puzzle = new Puzzle(grid, words, 'Science', 'HARD');
      
      // Mark 12 words as found
      for (let i = 0; i < 12; i++) {
        puzzle.markWordFound(words[i].getId());
      }
      
      // 150 seconds elapsed, 30 seconds remaining
      const startTime = Date.now();
      const endTime = startTime + (150 * 1000);
      
      const session = new GameSession(puzzle, 'HARD', startTime);
      session.endGame(endTime);
      
      const score = service.calculateScore(session);
      
      // 12 words * 100 = 1200
      // Completion bonus = 0 (not all found)
      // Time bonus = 30 * 10 = 300
      // Multiplier = 2.0
      // Total = (1200 + 0 + 300) * 2.0 = 3000
      expect(score).toBe(3000);
    });
  });

  describe('calculateScore - edge cases', () => {
    it('should return time bonus only for no words found', () => {
      const grid = new Grid(8);
      const words = Array.from({ length: 8 }, (_, i) => 
        new Word(`${i}`, `WORD${i}`, new Position(0, 0), Direction.RIGHT)
      );
      
      const puzzle = new Puzzle(grid, words, 'Animals', 'EASY');
      const startTime = Date.now();
      const session = new GameSession(puzzle, 'EASY', startTime);
      // Simulate 1 second elapsed
      session.endGame(startTime + 1000);
      
      const score = service.calculateScore(session);
      // 0 words * 100 = 0
      // Completion bonus = 0
      // Time bonus = (720 - 1) * 10 = 7190
      // Total = 7190
      expect(score).toBe(7190);
    });

    it('should never return negative score', () => {
      const grid = new Grid(8);
      const words = [];
      
      const puzzle = new Puzzle(grid, words, 'Animals', 'EASY');
      const session = new GameSession(puzzle, 'EASY', Date.now());
      session.endGame(Date.now());
      
      const score = service.calculateScore(session);
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });
});
