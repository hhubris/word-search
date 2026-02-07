/**
 * Difficulty enum and configuration
 * Defines game difficulty levels and their constraints
 */

export const Difficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

/**
 * Configuration for each difficulty level
 */
export const DifficultyConfig = {
  EASY: {
    wordCount: 8,
    timerSeconds: null, // No timer for easy
    directions: ['RIGHT', 'DOWN'],
    description: '8 words, no timer, horizontal and vertical only'
  },
  MEDIUM: {
    wordCount: 12,
    timerSeconds: 300, // 5 minutes
    directions: ['RIGHT', 'DOWN', 'DOWN_RIGHT', 'DOWN_LEFT'],
    description: '12 words, 5 minute timer, includes diagonals'
  },
  HARD: {
    wordCount: 16,
    timerSeconds: 180, // 3 minutes
    directions: ['RIGHT', 'LEFT', 'DOWN', 'UP', 'DOWN_RIGHT', 'DOWN_LEFT', 'UP_RIGHT', 'UP_LEFT'],
    description: '16 words, 3 minute timer, all eight directions'
  }
};

/**
 * Get configuration for a difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {Object} Configuration object
 */
export function getDifficultyConfig(difficulty) {
  return DifficultyConfig[difficulty] || DifficultyConfig.EASY;
}

/**
 * Get all difficulty levels
 * @returns {Array} Array of difficulty strings
 */
export function getAllDifficulties() {
  return Object.values(Difficulty);
}
