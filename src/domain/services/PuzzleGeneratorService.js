import WordSearch from '@blex41/word-search';
import { Grid } from '../entities/Grid.js';
import { Word } from '../entities/Word.js';
import { Puzzle } from '../entities/Puzzle.js';
import { Position } from '../value-objects/Position.js';
import { Direction } from '../value-objects/Direction.js';
import { getDifficultyConfig } from '../value-objects/Difficulty.js';

/**
 * PuzzleGeneratorService
 * Domain service for generating word search puzzles using @blex41/word-search
 */
export class PuzzleGeneratorService {
  constructor() {
    this.maxAttempts = 50; // Increased for better word placement success
  }

  /**
   * Generate a complete puzzle
   * @param {string} category - Word category
   * @param {string} difficulty - Difficulty level
   * @param {Object} wordRepository - Repository to get words from
   * @returns {Puzzle} Generated puzzle
   */
  generatePuzzle(category, difficulty, wordRepository) {
    const config = getDifficultyConfig(difficulty);
    
    // Get words for category
    const availableWords = wordRepository.getWordsByCategory(category);
    
    // Select random words
    const selectedWords = this.selectRandomWords(availableWords, config.wordCount);
    
    // Map difficulty to disabled directions
    const disabledDirections = this.getDisabledDirections(difficulty);
    
    // Calculate grid size (aim for square grid that fits words)
    const gridSize = this.calculateGridSize(selectedWords);
    
    // Create word search puzzle using the library
    const options = {
      cols: gridSize,
      rows: gridSize,
      disabledDirections: disabledDirections,
      dictionary: selectedWords,
      maxWords: config.wordCount,
      backwardsProbability: 0.3,
      upperCase: true,
      diacritics: false,
      maxRetries: this.maxAttempts
    };
    
    const ws = new WordSearch(options);
    
    // Convert library output to our domain entities
    return this.convertToPuzzle(ws, category, difficulty);
  }

  /**
   * Select random words from available words
   * @param {Array} words - Available words
   * @param {number} count - Number of words to select
   * @returns {Array} Selected words
   */
  selectRandomWords(words, count) {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Calculate appropriate grid size
   * @param {Array} words - Selected words
   * @returns {number} Grid size
   */
  calculateGridSize(words) {
    const longestWord = Math.max(...words.map(w => w.length));
    const wordCount = words.length;
    
    // Calculate based on word count and longest word
    // More words need more space
    let size;
    if (wordCount <= 8) {
      size = Math.max(10, longestWord + 2);
    } else if (wordCount <= 12) {
      size = Math.max(12, longestWord + 3);
    } else {
      size = Math.max(14, longestWord + 4);
    }
    
    return Math.min(20, size); // Cap at 20 for performance
  }

  /**
   * Get disabled directions based on difficulty
   * @param {string} difficulty - Difficulty level
   * @returns {Array} Disabled direction codes
   */
  getDisabledDirections(difficulty) {
    switch (difficulty) {
      case 'EASY':
        // Only horizontal and vertical (RIGHT and DOWN)
        // Disable: LEFT, UP, and all diagonals
        return ['W', 'N', 'NE', 'NW', 'SE', 'SW'];
      case 'MEDIUM':
        // Allow: RIGHT, DOWN, DOWN_RIGHT, DOWN_LEFT
        // Disable: LEFT, UP, UP_RIGHT, UP_LEFT
        return ['W', 'N', 'NE', 'NW'];
      case 'HARD':
        // All directions allowed
        return [];
      default:
        return [];
    }
  }

  /**
   * Convert WordSearch library output to our Puzzle entity
   * @param {WordSearch} ws - WordSearch instance
   * @param {string} category - Word category
   * @param {string} difficulty - Difficulty level
   * @returns {Puzzle} Puzzle entity
   */
  convertToPuzzle(ws, category, difficulty) {
    const libraryGrid = ws.grid;
    const libraryWords = ws.words;
    
    // Create our Grid entity
    const gridSize = libraryGrid.length;
    const grid = new Grid(gridSize);
    
    // Fill grid with letters
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        grid.setLetter(row, col, libraryGrid[row][col]);
      }
    }
    
    // Convert library words to our Word entities
    const words = libraryWords.map((libWord, index) => {
      // Get start and end positions
      const startPos = new Position(libWord.path[0].y, libWord.path[0].x);
      const endPos = new Position(
        libWord.path[libWord.path.length - 1].y,
        libWord.path[libWord.path.length - 1].x
      );
      
      // Determine direction
      const direction = this.determineDirection(startPos, endPos);
      
      // Create Word entity
      const word = new Word(
        `word-${index}`,
        libWord.clean,
        startPos,
        direction
      );
      
      // Link word to grid cells
      libWord.path.forEach(pos => {
        const cell = grid.getCell(pos.y, pos.x);
        if (cell) {
          cell.addWordId(word.getId());
        }
      });
      
      return word;
    });
    
    // Create and return Puzzle with category and difficulty
    return new Puzzle(grid, words, category, difficulty);
  }

  /**
   * Determine direction from start to end position
   * @param {Position} start - Start position
   * @param {Position} end - End position
   * @returns {Object} Direction object
   */
  determineDirection(start, end) {
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    
    // Normalize to -1, 0, or 1
    const rowDir = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
    const colDir = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
    
    // Map to our Direction enum
    if (rowDir === 0 && colDir === 1) return Direction.RIGHT;
    if (rowDir === 0 && colDir === -1) return Direction.LEFT;
    if (rowDir === 1 && colDir === 0) return Direction.DOWN;
    if (rowDir === -1 && colDir === 0) return Direction.UP;
    if (rowDir === 1 && colDir === 1) return Direction.DOWN_RIGHT;
    if (rowDir === 1 && colDir === -1) return Direction.DOWN_LEFT;
    if (rowDir === -1 && colDir === 1) return Direction.UP_RIGHT;
    if (rowDir === -1 && colDir === -1) return Direction.UP_LEFT;
    
    return Direction.RIGHT; // Default
  }
}
