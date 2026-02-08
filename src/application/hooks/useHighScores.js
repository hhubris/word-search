import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContainer } from '../container.js';

/**
 * useHighScores hook
 * Manages high score data fetching and mutations using TanStack Query
 */
export function useHighScores() {
  const queryClient = useQueryClient();
  const container = getContainer();
  const { getHighScoresUseCase, saveHighScoreUseCase } = container;

  /**
   * Query for fetching all high scores
   */
  const {
    data: highScores,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['highScores'],
    queryFn: () => getHighScoresUseCase.execute(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });

  /**
   * Query for fetching high scores for a specific difficulty
   * @param {string} difficulty - Difficulty level (EASY, MEDIUM, HARD)
   */
  const useHighScoresForDifficulty = (difficulty) => {
    return useQuery({
      queryKey: ['highScores', difficulty],
      queryFn: () => getHighScoresUseCase.executeForDifficulty(difficulty),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      enabled: !!difficulty,
    });
  };

  /**
   * Mutation for saving a high score
   */
  const saveHighScoreMutation = useMutation({
    mutationFn: ({ initials, score, difficulty }) => {
      return saveHighScoreUseCase.execute(initials, score, difficulty);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch all high scores
      queryClient.invalidateQueries({ queryKey: ['highScores'] });
      
      // Invalidate specific difficulty query
      queryClient.invalidateQueries({ 
        queryKey: ['highScores', variables.difficulty] 
      });
    },
  });

  /**
   * Save a high score
   * @param {string} initials - Player initials (max 3 chars)
   * @param {number} score - Score value
   * @param {string} difficulty - Difficulty level
   * @returns {Promise} Promise that resolves with updated high scores
   */
  const saveHighScore = async (initials, score, difficulty) => {
    return saveHighScoreMutation.mutateAsync({ initials, score, difficulty });
  };

  /**
   * Get high scores for a specific difficulty from cache
   * @param {string} difficulty - Difficulty level
   * @returns {Array} High scores array or empty array
   */
  const getHighScoresForDifficulty = (difficulty) => {
    if (!highScores) return [];
    return highScores[difficulty] || [];
  };

  /**
   * Check if a score qualifies as a high score
   * @param {number} score - Score to check
   * @param {string} difficulty - Difficulty level
   * @returns {boolean} True if score qualifies
   */
  const isHighScore = (score, difficulty) => {
    const scores = getHighScoresForDifficulty(difficulty);
    
    // If less than 10 scores, always qualifies
    if (scores.length < 10) return true;
    
    // Check if score is higher than the lowest high score
    const lowestScore = scores[scores.length - 1];
    return score > lowestScore.score;
  };

  /**
   * Get the rank a score would have
   * @param {number} score - Score to check
   * @param {string} difficulty - Difficulty level
   * @returns {number|null} Rank (1-10) or null if doesn't qualify
   */
  const getScoreRank = (score, difficulty) => {
    const scores = getHighScoresForDifficulty(difficulty);
    
    // Find position where this score would be inserted
    let rank = 1;
    for (const highScore of scores) {
      if (score > highScore.score) {
        return rank;
      }
      rank++;
    }
    
    // If we get here, score is lower than all existing scores
    // Only qualifies if there are less than 10 scores
    return scores.length < 10 ? rank : null;
  };

  return {
    // Query state
    highScores,
    isLoading,
    isError,
    error,
    
    // Actions
    saveHighScore,
    refetch,
    
    // Mutation state
    isSaving: saveHighScoreMutation.isPending,
    saveError: saveHighScoreMutation.error,
    
    // Helpers
    getHighScoresForDifficulty,
    isHighScore,
    getScoreRank,
    useHighScoresForDifficulty,
  };
}
