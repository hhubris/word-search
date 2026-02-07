import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameSession } from './useGameSession.js';
import { getContainer, resetContainer } from '../container.js';
import { Selection } from '../../domain/value-objects/Selection.js';

describe('useGameSession', () => {
  beforeEach(() => {
    resetContainer();
  });

  describe('initial state', () => {
    it('should initialize with null game session', () => {
      const { result } = renderHook(() => useGameSession());

      expect(result.current.gameSession).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should initialize with computed values', () => {
      const { result } = renderHook(() => useGameSession());

      expect(result.current.isGameActive).toBe(false);
      expect(result.current.completionPercentage).toBe(0);
      expect(result.current.isPuzzleComplete).toBe(false);
    });
  });

  describe('startGame', () => {
    it('should start a new game session', async () => {
      const { result } = renderHook(() => useGameSession());

      await act(async () => {
        await result.current.startGame('ANIMALS', 'MEDIUM');
      });

      expect(result.current.gameSession).not.toBeNull();
      expect(result.current.gameSession.getDifficulty()).toBe('MEDIUM');
      expect(result.current.isGameActive).toBe(true);
    });

    it('should set loading state during game start', async () => {
      const { result } = renderHook(() => useGameSession());

      await act(async () => {
        await result.current.startGame('SPORTS', 'MEDIUM');
      });

      // Loading state is synchronous, so we just verify it completes
      expect(result.current.isLoading).toBe(false);
      expect(result.current.gameSession).not.toBeNull();
    });

    it('should handle errors during game start', async () => {
      const { result } = renderHook(() => useGameSession());

      // Mock the use case to throw an error
      const container = getContainer();
      const originalExecute = container.startGameUseCase.execute;
      container.startGameUseCase.execute = vi.fn(() => {
        throw new Error('Test error');
      });

      await act(async () => {
        try {
          await result.current.startGame('INVALID', 'MEDIUM');
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Test error');
      expect(result.current.gameSession).toBeNull();

      // Restore
      container.startGameUseCase.execute = originalExecute;
    });

    it('should return the game session', async () => {
      const { result } = renderHook(() => useGameSession());

      let session;
      await act(async () => {
        session = await result.current.startGame('FOOD', 'HARD');
      });

      expect(session).toBe(result.current.gameSession);
    });
  });

  describe('selectWord', () => {
    it('should throw error if no active game session', () => {
      const { result } = renderHook(() => useGameSession());

      expect(() => {
        result.current.selectWord({});
      }).toThrow('No active game session');
    });

    it('should select a word in active game', async () => {
      const { result } = renderHook(() => useGameSession());

      await act(async () => {
        await result.current.startGame('ANIMALS', 'MEDIUM');
      });

      const puzzle = result.current.gameSession.getPuzzle();
      const words = puzzle.words;
      const word = words[0];
      const positions = word.getPositions();

      const selection = new Selection(positions);

      let selectResult;
      await act(async () => {
        selectResult = result.current.selectWord(selection);
      });

      expect(selectResult.found).toBe(true);
      expect(selectResult.word).not.toBeNull();
    });
  });

  describe('endGame', () => {
    it('should throw error if no active game session', () => {
      const { result } = renderHook(() => useGameSession());

      expect(() => {
        result.current.endGame();
      }).toThrow('No active game session');
    });

    it('should end the game and return score', async () => {
      const { result } = renderHook(() => useGameSession());

      await act(async () => {
        await result.current.startGame('SCIENCE', 'MEDIUM');
      });

      let endResult;
      await act(async () => {
        endResult = result.current.endGame();
      });

      expect(endResult).toHaveProperty('score');
      expect(endResult).toHaveProperty('isHighScore');
      expect(endResult).toHaveProperty('rank');
      expect(result.current.gameSession.isEnded()).toBe(true);
      expect(result.current.isGameActive).toBe(false);
    });

    it('should accept custom end time', async () => {
      const { result } = renderHook(() => useGameSession());

      await act(async () => {
        await result.current.startGame('TECHNOLOGY', 'HARD');
      });

      const customEndTime = Date.now() + 5000;

      await act(async () => {
        result.current.endGame(customEndTime);
      });

      expect(result.current.gameSession.getEndTime()).toBe(customEndTime);
    });
  });

  describe('resetGame', () => {
    it('should reset game session to null', async () => {
      const { result } = renderHook(() => useGameSession());

      await act(async () => {
        await result.current.startGame('MUSIC', 'MEDIUM');
      });

      expect(result.current.gameSession).not.toBeNull();

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.gameSession).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isGameActive).toBe(false);
    });
  });

  describe('computed values', () => {
    it('should calculate completion percentage', async () => {
      const { result } = renderHook(() => useGameSession());

      await act(async () => {
        await result.current.startGame('GEOGRAPHY', 'MEDIUM');
      });

      expect(result.current.completionPercentage).toBe(0);

      // Find and select a word
      const puzzle = result.current.gameSession.getPuzzle();
      const words = puzzle.words;
      const word = words[0];
      const positions = word.getPositions();

      const selection = new Selection(positions);

      await act(async () => {
        result.current.selectWord(selection);
      });

      const totalWords = puzzle.getTotalWordCount();
      const expectedPercentage = Math.round((1 / totalWords) * 100);
      expect(result.current.completionPercentage).toBe(expectedPercentage);
    });

    it('should detect puzzle completion', async () => {
      const { result } = renderHook(() => useGameSession());

      await act(async () => {
        await result.current.startGame('MOVIES', 'MEDIUM');
      });

      expect(result.current.isPuzzleComplete).toBe(false);

      // Select all words
      const puzzle = result.current.gameSession.getPuzzle();
      const words = puzzle.words;

      for (const word of words) {
        const positions = word.getPositions();
        const selection = new Selection(positions);

        await act(async () => {
          result.current.selectWord(selection);
        });
      }

      expect(result.current.isPuzzleComplete).toBe(true);
      expect(result.current.completionPercentage).toBe(100);
    });
  });

  describe('error handling', () => {
    it('should clear error on successful operation', async () => {
      const { result } = renderHook(() => useGameSession());

      // Cause an error
      const container = getContainer();
      const originalExecute = container.startGameUseCase.execute;
      container.startGameUseCase.execute = vi.fn(() => {
        throw new Error('First error');
      });

      await act(async () => {
        try {
          await result.current.startGame('TEST', 'MEDIUM');
        } catch (err) {
          // Expected
        }
      });

      expect(result.current.error).toBe('First error');

      // Restore and try again
      container.startGameUseCase.execute = originalExecute;

      await act(async () => {
        await result.current.startGame('SPORTS', 'MEDIUM');
      });

      expect(result.current.error).toBeNull();
    });
  });
});
