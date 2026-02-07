import { useState, useCallback } from 'react';
import { getContainer } from '../container.js';

/**
 * useGameSession hook
 * Manages game session state and word selection
 */
export function useGameSession() {
  const [gameSession, setGameSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0);

  const container = getContainer();
  const { startGameUseCase, selectWordUseCase, endGameUseCase } = container;

  /**
   * Start a new game
   * @param {string} category - Word category
   * @param {string} difficulty - Difficulty level
   */
  const startGame = useCallback(async (category, difficulty) => {
    setIsLoading(true);
    setError(null);

    try {
      const session = startGameUseCase.execute(category, difficulty);
      setGameSession(session);
      return session;
    } catch (err) {
      setError(err.message || 'Failed to start game');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [startGameUseCase]);

  /**
   * Select a word on the grid
   * @param {Selection} selection - Player's word selection
   * @returns {Object} Result { isValid: boolean, isCorrect: boolean, word: Word|null }
   */
  const selectWord = useCallback((selection) => {
    if (!gameSession) {
      throw new Error('No active game session');
    }

    try {
      const result = selectWordUseCase.execute(selection, gameSession);
      
      // Trigger re-render
      setUpdateCounter(c => c + 1);
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to select word');
      throw err;
    }
  }, [gameSession, selectWordUseCase]);

  /**
   * End the current game
   * @param {number} endTime - End timestamp (optional)
   * @returns {Object} Result { score: number, isHighScore: boolean, rank: number|null }
   */
  const endGame = useCallback((endTime) => {
    if (!gameSession) {
      throw new Error('No active game session');
    }

    try {
      const result = endGameUseCase.execute(gameSession, endTime);
      
      // Trigger re-render
      setUpdateCounter(c => c + 1);
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to end game');
      throw err;
    }
  }, [gameSession, endGameUseCase]);

  /**
   * Reset the game session
   */
  const resetGame = useCallback(() => {
    setGameSession(null);
    setError(null);
  }, []);

  /**
   * Check if game is active
   * @returns {boolean} True if game is active
   */
  const isGameActive = () => {
    return gameSession !== null && !gameSession.isEnded();
  };

  /**
   * Get puzzle completion percentage
   * @returns {number} Percentage (0-100)
   */
  const getCompletionPercentage = () => {
    if (!gameSession) return 0;
    
    const puzzle = gameSession.getPuzzle();
    const found = puzzle.getFoundWordCount();
    const total = puzzle.getTotalWordCount();
    
    return total > 0 ? Math.round((found / total) * 100) : 0;
  };

  /**
   * Check if puzzle is complete
   * @returns {boolean} True if all words found
   */
  const isPuzzleComplete = () => {
    if (!gameSession) return false;
    return gameSession.getPuzzle().isComplete();
  };

  return {
    // State
    gameSession,
    isLoading,
    error,

    // Actions
    startGame,
    selectWord,
    endGame,
    resetGame,

    // Computed
    isGameActive: isGameActive(),
    completionPercentage: getCompletionPercentage(),
    isPuzzleComplete: isPuzzleComplete(),
  };
}
