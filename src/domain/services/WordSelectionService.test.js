import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
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

  // Feature: word-search-game, Property 10: Selection Direction Restriction
  describe('Property 10: Selection Direction Restriction', () => {
    it('should restrict all positions to lie along the established direction', () => {
      const service = new WordSelectionService();

      fc.assert(
        fc.property(
          // Generate a start position and a direction
          fc.record({
            startRow: fc.integer({ min: 0, max: 11 }),
            startCol: fc.integer({ min: 0, max: 11 }),
            direction: fc.constantFrom(...Object.values(Direction)),
            distance: fc.integer({ min: 1, max: 5 })
          }),
          ({ startRow, startCol, direction, distance }) => {
            const startPos = new Position(startRow, startCol);
            
            // Calculate a position along the direction
            const targetRow = startRow + (direction.dy * distance);
            const targetCol = startCol + (direction.dx * distance);
            const targetPos = new Position(targetRow, targetCol);
            
            // Test restrictToDirection
            const result = service.restrictToDirection(startPos, direction, targetPos);
            
            // Should return the target position since it's along the direction
            expect(result).toEqual(targetPos);
            
            // Now test a position NOT along the direction
            // For horizontal/vertical, add perpendicular offset
            // For diagonal, break the equal delta requirement
            let offRow, offCol;
            if (direction.dy === 0) {
              // Horizontal - add vertical offset
              offRow = targetRow + 1;
              offCol = targetCol;
            } else if (direction.dx === 0) {
              // Vertical - add horizontal offset
              offRow = targetRow;
              offCol = targetCol + 1;
            } else {
              // Diagonal - break equal deltas
              offRow = targetRow + 1;
              offCol = targetCol; // Don't add to col, breaks diagonal
            }
            
            const offPos = new Position(offRow, offCol);
            
            // Should return null for position not along direction
            const offResult = service.restrictToDirection(startPos, direction, offPos);
            expect(offResult).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: word-search-game, Property 11: Word Validation
  describe('Property 11: Word Validation', () => {
    it('should validate selection matches word in puzzle word list', () => {
      const service = new WordSelectionService();

      fc.assert(
        fc.property(
          // Generate a word and its placement
          fc.record({
            wordText: fc.string({ minLength: 3, maxLength: 8 }).filter(s => /^[A-Z]+$/.test(s)),
            startRow: fc.integer({ min: 0, max: 5 }),
            startCol: fc.integer({ min: 0, max: 5 }),
            direction: fc.constantFrom(Direction.RIGHT, Direction.DOWN)
          }),
          ({ wordText, startRow, startCol, direction }) => {
            // Create grid and place the word
            const grid = new Grid(10);
            const startPos = new Position(startRow, startCol);
            
            // Place letters in grid
            const positions = [];
            for (let i = 0; i < wordText.length; i++) {
              const row = startRow + (direction.dy * i);
              const col = startCol + (direction.dx * i);
              
              // Skip if out of bounds
              if (row >= 10 || col >= 10) return;
              
              grid.setLetter(row, col, wordText[i]);
              positions.push(new Position(row, col));
            }
            
            // Create word and puzzle
            const word = new Word('1', wordText, startPos, direction);
            const puzzle = new Puzzle(grid, [word], 'Test', 'EASY');
            
            // Create selection matching the word
            const selection = new Selection(positions);
            
            // Property: Selection matching word positions should validate
            const result = service.validateSelection(selection, puzzle);
            expect(result).not.toBeNull();
            expect(result.getText()).toBe(wordText.toUpperCase());
            
            // Property: Selection with different text should not validate
            // Modify first letter
            const wrongPositions = [...positions];
            grid.setLetter(positions[0].row, positions[0].col, 'X');
            const wrongSelection = new Selection(wrongPositions);
            const wrongResult = service.validateSelection(wrongSelection, puzzle);
            
            // Should not match if text is different
            if (wordText[0] !== 'X') {
              expect(wrongResult).toBeNull();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return null for selections not matching any word', () => {
      const service = new WordSelectionService();

      fc.assert(
        fc.property(
          // Generate random positions that don't form a word
          fc.record({
            length: fc.integer({ min: 3, max: 8 }),
            startRow: fc.integer({ min: 0, max: 5 }),
            startCol: fc.integer({ min: 0, max: 5 })
          }),
          ({ length, startRow, startCol }) => {
            const grid = new Grid(10);
            
            // Place random letters
            const positions = [];
            for (let i = 0; i < length; i++) {
              const col = startCol + i;
              if (col >= 10) return; // Skip if out of bounds
              
              grid.setLetter(startRow, col, 'Z');
              positions.push(new Position(startRow, col));
            }
            
            // Create puzzle with a different word
            const word = new Word('1', 'CAT', new Position(8, 0), Direction.RIGHT);
            const puzzle = new Puzzle(grid, [word], 'Test', 'EASY');
            
            // Selection of 'ZZZ...' should not match 'CAT'
            const selection = new Selection(positions);
            const result = service.validateSelection(selection, puzzle);
            
            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
