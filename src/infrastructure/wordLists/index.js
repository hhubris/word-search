// Word lists for the word search game
// Each category contains 150+ words with 3-8 characters

import animals from './animals.json';
import sports from './sports.json';
import science from './science.json';
import food from './food.json';
import geography from './geography.json';
import technology from './technology.json';
import music from './music.json';
import movies from './movies.json';

export const WORD_LISTS = {
  animals,
  sports,
  science,
  food,
  geography,
  technology,
  music,
  movies
};

export const CATEGORIES = Object.keys(WORD_LISTS);
