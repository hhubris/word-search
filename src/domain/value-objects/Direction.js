/**
 * Direction enum and utilities
 * Defines all 8 possible directions for word placement
 */

export const Direction = {
  RIGHT: { dx: 1, dy: 0, name: 'RIGHT' },
  LEFT: { dx: -1, dy: 0, name: 'LEFT' },
  DOWN: { dx: 0, dy: 1, name: 'DOWN' },
  UP: { dx: 0, dy: -1, name: 'UP' },
  DOWN_RIGHT: { dx: 1, dy: 1, name: 'DOWN_RIGHT' },
  DOWN_LEFT: { dx: -1, dy: 1, name: 'DOWN_LEFT' },
  UP_RIGHT: { dx: 1, dy: -1, name: 'UP_RIGHT' },
  UP_LEFT: { dx: -1, dy: -1, name: 'UP_LEFT' }
};

/**
 * Get allowed directions for a difficulty level
 * @param {string} difficulty - 'EASY', 'MEDIUM', or 'HARD'
 * @returns {Array} Array of Direction objects
 */
export function getDirectionsForDifficulty(difficulty) {
  switch (difficulty) {
    case 'EASY':
      return [Direction.RIGHT, Direction.DOWN];
    case 'MEDIUM':
      return [
        Direction.RIGHT,
        Direction.DOWN,
        Direction.DOWN_RIGHT,
        Direction.DOWN_LEFT
      ];
    case 'HARD':
      return Object.values(Direction);
    default:
      return [];
  }
}

/**
 * Determine direction from two positions
 * @param {Position} start - Starting position
 * @param {Position} end - Ending position
 * @returns {Object|null} Direction object or null if invalid
 */
export function getDirection(start, end) {
  const dx = Math.sign(end.col - start.col);
  const dy = Math.sign(end.row - start.row);

  // If no movement, return null
  if (dx === 0 && dy === 0) return null;

  // Find matching direction
  for (const dir of Object.values(Direction)) {
    if (dir.dx === dx && dir.dy === dy) {
      return dir;
    }
  }

  return null;
}

/**
 * Get next position in a direction
 * @param {Position} current - Current position
 * @param {Object} direction - Direction object
 * @returns {Position} Next position
 */
export function getNextPosition(current, direction) {
  return current.add(direction);
}
