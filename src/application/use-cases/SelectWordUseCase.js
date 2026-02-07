/**
 * SelectWordUseCase
 * Use case for selecting a word in the puzzle
 */
export class SelectWordUseCase {
  constructor(wordSelectionService) {
    this.wordSelectionService = wordSelectionService;
  }

  /**
   * Execute the use case
   * @param {Selection} selection - Player's selection
   * @param {GameSession} gameSession - Current game session
   * @returns {Object} Result { found: boolean, word: Word|null, isComplete: boolean }
   */
  execute(selection, gameSession) {
    const puzzle = gameSession.getPuzzle();
    
    // Validate selection
    const word = this.wordSelectionService.validateSelection(selection, puzzle);
    
    if (word) {
      // Mark word as found
      puzzle.markWordFound(word.getId());
      
      // Check if puzzle is complete
      const isComplete = puzzle.isComplete();
      
      return {
        found: true,
        word: word,
        isComplete: isComplete
      };
    }
    
    return {
      found: false,
      word: null,
      isComplete: false
    };
  }
}
