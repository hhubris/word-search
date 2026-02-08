import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHighScores } from './useHighScores.js';
import { resetContainer } from '../container.js';

// Create wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useHighScores', () => {
  beforeEach(() => {
    resetContainer();
    // Clear localStorage
    localStorage.clear();
  });

  it('should fetch high scores on mount', async () => {
    const { result } = renderHook(() => useHighScores(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have high scores object with all difficulties
    expect(result.current.highScores).toBeDefined();
    expect(result.current.highScores).toHaveProperty('EASY');
    expect(result.current.highScores).toHaveProperty('MEDIUM');
    expect(result.current.highScores).toHaveProperty('HARD');
  });

  it('should save a high score and invalidate cache', async () => {
    const { result } = renderHook(() => useHighScores(), {
      wrapper: createWrapper(),
    });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Save a high score
    await act(async () => {
      await result.current.saveHighScore('ABC', 1000, 'EASY');
    });

    // Wait for mutation to complete and cache to update
    await waitFor(() => {
      const easyScores = result.current.getHighScoresForDifficulty('EASY');
      return easyScores.length > 0;
    });

    // High scores should be updated
    const easyScores = result.current.getHighScoresForDifficulty('EASY');
    expect(easyScores).toHaveLength(1);
    expect(easyScores[0].initials).toBe('ABC');
    expect(easyScores[0].score).toBe(1000);
  });

  it('should check if score qualifies as high score', async () => {
    const { result } = renderHook(() => useHighScores(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // With no scores, any score qualifies
    expect(result.current.isHighScore(100, 'EASY')).toBe(true);

    // Add 10 scores
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await result.current.saveHighScore('TST', 1000 - i * 100, 'EASY');
      });
    }

    await waitFor(() => {
      const easyScores = result.current.getHighScoresForDifficulty('EASY');
      return easyScores.length === 10;
    });

    // Score higher than lowest should qualify
    expect(result.current.isHighScore(200, 'EASY')).toBe(true);

    // Score lower than lowest should not qualify
    expect(result.current.isHighScore(50, 'EASY')).toBe(false);
  });

  it('should calculate score rank correctly', async () => {
    const { result } = renderHook(() => useHighScores(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add some scores
    await act(async () => {
      await result.current.saveHighScore('AAA', 1000, 'MEDIUM');
    });
    await act(async () => {
      await result.current.saveHighScore('BBB', 800, 'MEDIUM');
    });
    await act(async () => {
      await result.current.saveHighScore('CCC', 600, 'MEDIUM');
    });

    await waitFor(() => {
      const mediumScores = result.current.getHighScoresForDifficulty('MEDIUM');
      return mediumScores.length === 3;
    });

    // Check ranks
    expect(result.current.getScoreRank(1200, 'MEDIUM')).toBe(1);
    expect(result.current.getScoreRank(900, 'MEDIUM')).toBe(2);
    expect(result.current.getScoreRank(700, 'MEDIUM')).toBe(3);
    expect(result.current.getScoreRank(500, 'MEDIUM')).toBe(4);
  });

  it('should return null rank for non-qualifying score when list is full', async () => {
    const { result } = renderHook(() => useHighScores(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Fill up the high score list (10 scores)
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await result.current.saveHighScore('TST', 1000 - i * 50, 'HARD');
      });
    }

    await waitFor(() => {
      const hardScores = result.current.getHighScoresForDifficulty('HARD');
      return hardScores.length === 10;
    });

    // Score lower than all should return null
    expect(result.current.getScoreRank(100, 'HARD')).toBeNull();
  });

  it('should get high scores for specific difficulty', async () => {
    const { result } = renderHook(() => useHighScores(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add scores to different difficulties
    await act(async () => {
      await result.current.saveHighScore('AAA', 1000, 'EASY');
    });
    await act(async () => {
      await result.current.saveHighScore('BBB', 2000, 'MEDIUM');
    });

    await waitFor(() => {
      const easyScores = result.current.getHighScoresForDifficulty('EASY');
      const mediumScores = result.current.getHighScoresForDifficulty('MEDIUM');
      return easyScores.length > 0 && mediumScores.length > 0;
    });

    // Get scores for specific difficulty
    const easyScores = result.current.getHighScoresForDifficulty('EASY');
    const mediumScores = result.current.getHighScoresForDifficulty('MEDIUM');

    expect(easyScores).toHaveLength(1);
    expect(easyScores[0].score).toBe(1000);

    expect(mediumScores).toHaveLength(1);
    expect(mediumScores[0].score).toBe(2000);
  });

  it('should return empty array for difficulty with no scores', async () => {
    const { result } = renderHook(() => useHighScores(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const scores = result.current.getHighScoresForDifficulty('EASY');
    expect(scores).toEqual([]);
  });
});
