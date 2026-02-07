import { Grid } from '../entities/Grid.js';
import { Word } from '../entities/Word.js';
import { Puzzle } from '../entities/Puzzle.js';
import { Position } from '../value-objects/Position.js';
import { Direction, getDirectionsForDifficulty } from '../value-objects/Direction.js';
import { getDifficultyConfig } from '../value-objects/Difficulty.js';

/**
 * PuzzleGeneratorService
 * Domain service for generating word search puzzles
 */
export class PuzzleGeneratorService {
  constructor() {
    this.maxAttempts = 200;
    this.maxGridSize = 12;
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
    const allowedDirections = getDirectionsForDifficulty(difficulty);
    
    for (let attempt = 0; attempt < this.maxAttempts; attempt++) {
      try {
        // Get words for category
        const availableWords = wordRepository.getWordsByCategory(category);
        
        // Select random words
        const selectedWords = this.selectRandomWords(availableWords, config.wordCount);
        
        // Determine grid size based on longest word
        const gridSize = this.calculateGridSize(selectedWords);
        
        if (gridSize > this.maxGridSize) {
          continue; // Try again with different words
        }
        
        // Create grid
        const grid = new Grid(gridSize);
        
        // Place words on grid
        const placedWords = this.placeWords(grid, selectedWords, allowedDirections);
        
        if (placedWords.length < config.wordCount) {
          continue; // Couldn't place all words, try again
        }
        
        // Check intersection requirement (at least 50%)
        if (!this.meetsIntersectionRequirement(placedWords)) {
          continue; // Not enough intersections, try again
        }
        
        // Fill empty cells
        this.fillEmptyCells(grid);
        
        // Create and return puzzle
        return new Puzzle(grid, placedWords, category, difficulty);
        
      } catch (error) {
        // Continue to next attempt
        continue;
      }
    }
    
    throw new Error(`Failed to generate puzzle after ${this.maxAttempts} attempts`);
  }

  /**
   * Select random words from available list
   * @param {Array} words - Available words
   * @param {number} count - Number of words to select
   * @returns {Array} Selected words
   */
  selectRandomWords(words, count) {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Calculate appropriate grid size for words
   * @param {Array} words - Words to place
   * @returns {number} Grid size
   */
  calculateGridSize(words) {
    const longestWord = Math.max(...words.map(w => w.length));
    const wordCount = words.length;
    
    // Larger grid for more words to allow intersections
    let size = longestWord + Math.ceil(wordCount / 2);
    size = Math.min(size, this.maxGridSize);
    return Math.max(8, size); // Minimum 8x8
  }

  /**
   * Place all words on the grid
   * @param {Grid} grid - Grid to place words on
   * @param {Array} words - Words to place
   * @param {Array} allowedDirections - Allowed directions
   * @returns {Array} Successfully placed Word entities
   */
  placeWords(grid, words, allowedDirections) {
    const placedWords = [];
    
    // Sort words by length (longest first) for better placement
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    
    for (const wordText of sortedWords) {
      const word = this.placeWord(grid, wordText, allowedDirections, placedWords);
      if (word) {
        placedWords.push(word);
      }
    }
    
    return placedWords;
  }

  /**
   * Attempt to place a single word on the grid
   * @param {Grid} grid - Grid to place word on
   * @param {string} wordText - Word text to place
   * @param {Array} allowedDirections - Allowed directions
   * @param {Array} existingWords - Already placed words
   * @returns {Word|null} Placed word or null if failed
   */
  placeWord(grid, wordText, allowedDirections, existingWords = []) {
    const attempts = 50;
    
    for (let i = 0; i < attempts; i++) {
      // Random direction from allowed
      const direction = allowedDirections[Math.floor(Math.random() * allowedDirections.length)];
      
      // Random starting position
      const maxRow = grid.getSize() - 1;
      const maxCol = grid.getSize() - 1;
      const startRow = Math.floor(Math.random() * (maxRow + 1));
      const startCol = Math.floor(Math.random() * (maxCol + 1));
      const startPos = new Position(startRow, startCol);
      
      // Check if word fits
      if (this.canPlaceWord(grid, wordText, startPos, direction, existingWords)) {
        // Place the word
        const wordId = `word-${Date.now()}-${Math.random()}`;
        const word = new Word(wordId, wordText, startPos, direction);
        
        // Mark cells on grid
        const positions = word.getPositions();
        for (let j = 0; j < positions.length; j++) {
          const pos = positions[j];
          const letter = wordText[j].toUpperCase();
          const cell = grid.getCell(pos.row, pos.col);
          
          if (cell && cell.isEmpty()) {
            grid.setLetter(pos.row, pos.col, letter);
          }
          
          // Add word ID to cell
          const updatedCell = grid.getCell(pos.row, pos.col);
          if (updatedCell) {
            updatedCell.addWordId(wordId);
          }
        }
        
        return word;
      }
    }
    
    return null;
  }

  /**
   * Check if a word can be placed at a position
   * @param {Grid} grid - Grid to check
   * @param {string} wordText - Word to place
   * @param {Position} startPos - Starting position
   * @param {Object} direction - Direction to place word
   * @param {Array} existingWords - Already placed words
   * @returns {boolean} True if word can be placed
   */
  canPlaceWord(grid, wordText, startPos, direction, existingWords) {
    const positions = [];
    let currentPos = startPos;
    
    // Calculate all positions
    for (let i = 0; i < wordText.length; i++) {
      if (!grid.isValidPosition(currentPos.row, currentPos.col)) {
        return false; // Out of bounds
      }
      positions.push(currentPos);
      currentPos = currentPos.add(direction);
    }
    
    // Check each position
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const cell = grid.getCell(pos.row, pos.col);
      const letter = wordText[i].toUpperCase();
      
      if (!cell.isEmpty()) {
        // Cell is occupied - must match the letter for intersection
        if (cell.getLetter() !== letter) {
          return false; // Letter mismatch
        }
      }
    }
    
    return true;
  }

  /**
   * Check if words meet intersection requirement (50%)
   * @param {Array} words - Placed words
   * @returns {boolean} True if requirement met
   */
  meetsIntersectionRequirement(words) {
    if (words.length === 0) return true;
    
    let wordsWithIntersections = 0;
    
    for (const word of words) {
      for (const otherWord of words) {
        if (word !== otherWord && word.intersectsWith(otherWord)) {
          wordsWithIntersections++;
          break; // Count each word only once
        }
      }
    }
    
    const intersectionRatio = wordsWithIntersections / words.length;
    return intersectionRatio >= 0.5;
  }

  /**
   * Fill empty cells with random letters
   * @param {Grid} grid - Grid to fill
   */
  fillEmptyCells(grid) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let row = 0; row < grid.getSize(); row++) {
      for (let col = 0; col < grid.getSize(); col++) {
        const cell = grid.getCell(row, col);
        if (cell && cell.isEmpty()) {
          const randomLetter = letters[Math.floor(Math.random() * letters.length)];
          grid.setLetter(row, col, randomLetter);
        }
      }
    }
  }

  /**
   * Validate grid size
   * @param {Grid} grid - Grid to validate
   * @returns {boolean} True if valid
   */
  validateGridSize(grid) {
    return grid.getSize() <= this.maxGridSize;
  }

  /**
   * Find intersections between a word and existing words
   * @param {Grid} grid - Current grid
   * @param {Word} word - Word to check
   * @param {Array} existingWords - Already placed words
   * @returns {Array} Array of intersection positions
   */
  findIntersections(grid, word, existingWords) {
    const intersections = [];
    
    for (const existingWord of existingWords) {
      const wordIntersections = word.getIntersections(existingWord);
      intersections.push(...wordIntersections);
    }
    
    return intersections;
  }
}
