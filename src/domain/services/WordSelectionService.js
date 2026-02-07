import { getDirection } from '../value-objects/Direction.js';
import { Position } from '../value-objects/Position.js';

/**
 * WordSelectionService
 * Domain service for validating and processing word selections
 */
export class WordSelectionService {
  /**
   * Validate if a selection matches any word in the puzzle
   * @param {Selection} selection - Player's selection
   * @param {Puzzle} puzzle - Current puzzle
   * @returns {Word|null} Matched word or null if invalid
   */
  validateSelection(selection, puzzle) {
    if (selection.isEmpty() || selection.length() < 3) {
      return null;
    }

    // Get the text from the selection
    const grid = puzzle.getGrid();
    const selectedText = selection.getText(grid);

    // Find matching word in puzzle
    const word = puzzle.findWordByText(selectedText);
    
    if (!word || word.isFound()) {
      return null;
    }

    // Verify the selection positions match the word positions
    const wordPositions = word.getPositions();
    const selectionPositions = selection.getPositions();

    if (wordPositions.length !== selectionPositions.length) {
      return null;
    }

    // Check if all positions match
    const allMatch = wordPositions.every((wordPos, index) => 
      wordPos.equals(selectionPositions[index])
    );

    return allMatch ? word : null;
  }

  /**
   * Determine the direction between two positions
   * @param {Position} startPos - Starting position
   * @param {Position} currentPos - Current position
   * @returns {Object|null} Direction object or null if invalid
   */
  determineDirection(startPos, currentPos) {
    if (!startPos || !currentPos) {
      return null;
    }

    if (startPos.equals(currentPos)) {
      return null;
    }

    return getDirection(startPos, currentPos);
  }

  /**
   * Restrict a position to lie along a specific direction from start
   * @param {Position} startPos - Starting position
   * @param {Object} direction - Direction object
   * @param {Position} currentPos - Current position to validate
   * @returns {Position|null} Valid position along direction or null
   */
  restrictToDirection(startPos, direction, currentPos) {
    if (!startPos || !direction || !currentPos) {
      return null;
    }

    // Calculate the delta from start to current
    const deltaRow = currentPos.row - startPos.row;
    const deltaCol = currentPos.col - startPos.col;

    // Check if the position lies along the direction
    // For horizontal/vertical: one delta should be 0, other should match direction
    // For diagonal: both deltas should have same magnitude and match direction signs

    if (direction.dx === 0) {
      // Vertical direction
      if (deltaCol !== 0) return null;
      if (Math.sign(deltaRow) !== Math.sign(direction.dy) && deltaRow !== 0) {
        return null;
      }
      return currentPos;
    }

    if (direction.dy === 0) {
      // Horizontal direction
      if (deltaRow !== 0) return null;
      if (Math.sign(deltaCol) !== Math.sign(direction.dx) && deltaCol !== 0) {
        return null;
      }
      return currentPos;
    }

    // Diagonal direction - both deltas must have same magnitude
    if (Math.abs(deltaRow) !== Math.abs(deltaCol)) {
      return null;
    }

    // Check signs match direction
    if (deltaRow !== 0 && Math.sign(deltaRow) !== Math.sign(direction.dy)) {
      return null;
    }
    if (deltaCol !== 0 && Math.sign(deltaCol) !== Math.sign(direction.dx)) {
      return null;
    }

    return currentPos;
  }
}
