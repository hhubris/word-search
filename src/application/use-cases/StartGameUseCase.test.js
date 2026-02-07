import { describe, it, expect, beforeEach } from 'vitest';
import { StartGameUseCase } from './StartGameUseCase.js';
import { PuzzleGeneratorService } from '../../domain/services/PuzzleGeneratorService.js';
import { WordRepositoryImpl } from '../../infrastructure/repositories/WordRepositoryImpl.js';

describe('StartGameUseCase', () => {
  let useCase;
  let puzzleGenerator;
  let wordRepository;

  beforeEach(() => {
    puzzleGenerator = new PuzzleGeneratorService();
    wordRepository = new WordRepositoryImpl();
    useCase = new StartGameUseCase(puzzleGenerator, wordRepository);
  });

  describe('execute', () => {
    it('should create a game session', () => {
      const gameSession = useCase.execute('Animals', 'EASY');
      
      expect(gameSession).toBeDefined();
      expect(gameSession.getPuzzle()).toBeDefined();
      expect(gameSession.getDifficulty()).toBe('EASY');
    });

    it('should generate puzzle with correct category', () => {
      const gameSession = useCase.execute('Sports', 'MEDIUM');
      const puzzle = gameSession.getPuzzle();
      
      expect(puzzle.getCategory()).toBe('Sports');
    });

    it('should generate puzzle with correct difficulty', () => {
      const gameSession = useCase.execute('Science', 'HARD');
      const puzzle = gameSession.getPuzzle();
      
      expect(puzzle.getDifficulty()).toBe('HARD');
    });

    it('should generate puzzle with correct word count for EASY', () => {
      const gameSession = useCase.execute('Animals', 'EASY');
      const puzzle = gameSession.getPuzzle();
      
      expect(puzzle.getAllWords()).toHaveLength(8);
    });

    it('should generate puzzle with correct word count for MEDIUM', () => {
      const gameSession = useCase.execute('Sports', 'MEDIUM');
      const puzzle = gameSession.getPuzzle();
      
      expect(puzzle.getAllWords()).toHaveLength(12);
    });

    it('should generate puzzle with correct word count for HARD', () => {
      const gameSession = useCase.execute('Science', 'HARD');
      const puzzle = gameSession.getPuzzle();
      
      expect(puzzle.getAllWords()).toHaveLength(16);
    });

    it('should set start time on game session', () => {
      const before = Date.now();
      const gameSession = useCase.execute('Animals', 'EASY');
      const after = Date.now();
      
      expect(gameSession.getStartTime()).toBeGreaterThanOrEqual(before);
      expect(gameSession.getStartTime()).toBeLessThanOrEqual(after);
    });

    it('should create game session with no end time', () => {
      const gameSession = useCase.execute('Animals', 'EASY');
      
      expect(gameSession.getEndTime()).toBeNull();
      expect(gameSession.isEnded()).toBe(false);
    });

    it('should set correct timer duration for EASY (no timer)', () => {
      const gameSession = useCase.execute('Animals', 'EASY');
      
      expect(gameSession.getTimerDuration()).toBeNull();
    });

    it('should set correct timer duration for MEDIUM (300 seconds)', () => {
      const gameSession = useCase.execute('Sports', 'MEDIUM');
      
      expect(gameSession.getTimerDuration()).toBe(300);
    });

    it('should set correct timer duration for HARD (180 seconds)', () => {
      const gameSession = useCase.execute('Science', 'HARD');
      
      expect(gameSession.getTimerDuration()).toBe(180);
    });
  });

  describe('Property: Puzzle Matches Configuration', () => {
    it('should generate EASY puzzle with 8 words from selected category', () => {
      const gameSession = useCase.execute('Animals', 'EASY');
      const puzzle = gameSession.getPuzzle();
      
      expect(puzzle.getAllWords()).toHaveLength(8);
      expect(puzzle.getCategory()).toBe('Animals');
      expect(puzzle.getDifficulty()).toBe('EASY');
    });

    it('should generate MEDIUM puzzle with 12 words from selected category', () => {
      const gameSession = useCase.execute('Sports', 'MEDIUM');
      const puzzle = gameSession.getPuzzle();
      
      expect(puzzle.getAllWords()).toHaveLength(12);
      expect(puzzle.getCategory()).toBe('Sports');
      expect(puzzle.getDifficulty()).toBe('MEDIUM');
    });

    it('should generate HARD puzzle with 16 words from selected category', () => {
      const gameSession = useCase.execute('Science', 'HARD');
      const puzzle = gameSession.getPuzzle();
      
      expect(puzzle.getAllWords()).toHaveLength(16);
      expect(puzzle.getCategory()).toBe('Science');
      expect(puzzle.getDifficulty()).toBe('HARD');
    });
  });
});
