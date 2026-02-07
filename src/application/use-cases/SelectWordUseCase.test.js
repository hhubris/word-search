import { describe, it, expect, beforeEach } from 'vitest';
import { SelectWordUseCase } from './SelectWordUseCase.js';
import { WordSelectionService } from '../../domain/services/WordSelectionService.js';
import { GameSession } from '../../domain/entities/GameSession.js';
import { Puzzle } from '../../domain/entities/Puzzle.js';
import { Grid } from '../../domain/entities/Grid.js';
import { Word } from '../../domain/entities/Word.js';
import { Selection } from '../../domain/value-objects/Selection.js';
import { Position } from '../../domain/value-objects/Position.js';
import { Direction } from '../../domain/value-objects/Direction.js';

describe('SelectWordUseCase', () => {
  let useCase;
  let wordSelectionService;

  beforeEach(() => {
    wordSelectionService = new WordSelectionService();
    useCase = new SelectWordUseCase(wordSelectionService);
  });

  function createTestGameSession() {
    const grid = new Grid(5);
    grid.setLetter(0, 0, 'C');
    grid.setLetter(0, 1, 'A');
    grid.setLetter(0, 2, 'T');
    grid.setLetter(1, 0, 'D');
    grid.setLetter(1, 1, 'O');
    grid.setLetter(1, 2, 'G');

    const word1 = new Word('1', 'CAT', new Position(0, 0), Direction.RIGHT);
    const word2 = new Word('2', 'DOG', new Position(1, 0), Direction.RIGHT);
    
    const puzzle = new Puzzle(grid, [word1, word2], 'Animals', 'EASY');
    return new GameSession(puzzle, 'EASY', Date.now());
  }

  describe('execute', () => {
    it('should return found=true when selection matches a word', () => {
      const gameSession = createTestGameSession();
      const selection = new Selection([
        new Position(0, 0),
        new Position(0, 1),
        new Position(0, 2)
      ]);

      const result = useCase.execute(selection, gameSession);

      expect(result.found).toBe(true);
      expect(result.word).toBeDefined();
      expect(result.word.getText()).toBe('CAT');
    });

    it('should return found=false when selection does not match', () => {
      const gameSession = createTestGameSession();
      const selection = new Selection([
        new Position(0, 0),
        new Position(0, 1)
      ]);

      const result = useCase.execute(selection, gameSession);

      expect(result.found).toBe(false);
      expect(result.word).toBeNull();
    });

    it('should mark word as found in puzzle', () => {
      const gameSession = createTestGameSession();
      const puzzle = gameSession.getPuzzle();
      const selection = new Selection([
        new Position(0, 0),
        new Position(0, 1),
        new Position(0, 2)
      ]);

      useCase.execute(selection, gameSession);

      expect(puzzle.getFoundWordCount()).toBe(1);
    });

    it('should return isComplete=false when puzzle not complete', () => {
      const gameSession = createTestGameSession();
      const selection = new Selection([
        new Position(0, 0),
        new Position(0, 1),
        new Position(0, 2)
      ]);

      const result = useCase.execute(selection, gameSession);

      expect(result.isComplete).toBe(false);
    });

    it('should return isComplete=true when all words found', () => {
      const gameSession = createTestGameSession();
      
      // Find first word
      const selection1 = new Selection([
        new Position(0, 0),
        new Position(0, 1),
        new Position(0, 2)
      ]);
      useCase.execute(selection1, gameSession);

      // Find second word
      const selection2 = new Selection([
        new Position(1, 0),
        new Position(1, 1),
        new Position(1, 2)
      ]);
      const result = useCase.execute(selection2, gameSession);

      expect(result.isComplete).toBe(true);
    });

    it('should not mark already found word again', () => {
      const gameSession = createTestGameSession();
      const selection = new Selection([
        new Position(0, 0),
        new Position(0, 1),
        new Position(0, 2)
      ]);

      // Find word first time
      const result1 = useCase.execute(selection, gameSession);
      expect(result1.found).toBe(true);

      // Try to find same word again
      const result2 = useCase.execute(selection, gameSession);
      expect(result2.found).toBe(false);
    });

    it('should return word entity when found', () => {
      const gameSession = createTestGameSession();
      const selection = new Selection([
        new Position(1, 0),
        new Position(1, 1),
        new Position(1, 2)
      ]);

      const result = useCase.execute(selection, gameSession);

      expect(result.word).toBeDefined();
      expect(result.word.getText()).toBe('DOG');
      expect(result.word.getId()).toBe('2');
    });
  });

  describe('Property: Found Word State Update', () => {
    it('should mark word as found in puzzle state', () => {
      const gameSession = createTestGameSession();
      const puzzle = gameSession.getPuzzle();
      const selection = new Selection([
        new Position(0, 0),
        new Position(0, 1),
        new Position(0, 2)
      ]);

      const result = useCase.execute(selection, gameSession);

      expect(result.found).toBe(true);
      expect(puzzle.isWordFound(result.word.getId())).toBe(true);
      expect(result.word.isFound()).toBe(true);
    });

    it('should update found word count', () => {
      const gameSession = createTestGameSession();
      const puzzle = gameSession.getPuzzle();

      expect(puzzle.getFoundWordCount()).toBe(0);

      const selection = new Selection([
        new Position(0, 0),
        new Position(0, 1),
        new Position(0, 2)
      ]);
      useCase.execute(selection, gameSession);

      expect(puzzle.getFoundWordCount()).toBe(1);
    });

    it('should maintain found state across multiple selections', () => {
      const gameSession = createTestGameSession();
      const puzzle = gameSession.getPuzzle();

      // Find first word
      const selection1 = new Selection([
        new Position(0, 0),
        new Position(0, 1),
        new Position(0, 2)
      ]);
      useCase.execute(selection1, gameSession);

      // Find second word
      const selection2 = new Selection([
        new Position(1, 0),
        new Position(1, 1),
        new Position(1, 2)
      ]);
      useCase.execute(selection2, gameSession);

      expect(puzzle.getFoundWordCount()).toBe(2);
      expect(puzzle.getFoundWords()).toHaveLength(2);
    });
  });
});
