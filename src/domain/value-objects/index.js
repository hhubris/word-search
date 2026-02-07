/**
 * Domain value objects
 * Export all value objects and enums
 */

export { Position } from './Position.js';
export { 
  Direction, 
  getDirectionsForDifficulty, 
  getDirection, 
  getNextPosition 
} from './Direction.js';
export { 
  Difficulty, 
  DifficultyConfig, 
  getDifficultyConfig, 
  getAllDifficulties 
} from './Difficulty.js';
export { 
  Category, 
  CategoryDisplayNames, 
  getAllCategories, 
  getCategoryDisplayName 
} from './Category.js';
export { Selection } from './Selection.js';
