import { describe, it, expect } from 'vitest';
import { WordRepositoryImpl } from './WordRepositoryImpl.js';

describe('WordRepositoryImpl', () => {
  const repository = new WordRepositoryImpl();

  describe('getAllCategories', () => {
    it('should return all 8 categories', () => {
      const categories = repository.getAllCategories();
      expect(categories).toHaveLength(8);
    });

    it('should return capitalized category names', () => {
      const categories = repository.getAllCategories();
      categories.forEach(category => {
        expect(category[0]).toBe(category[0].toUpperCase());
      });
    });

    it('should include expected categories', () => {
      const categories = repository.getAllCategories();
      expect(categories).toContain('Animals');
      expect(categories).toContain('Sports');
      expect(categories).toContain('Science');
      expect(categories).toContain('Food');
      expect(categories).toContain('Geography');
      expect(categories).toContain('Technology');
      expect(categories).toContain('Music');
      expect(categories).toContain('Movies');
    });
  });

  describe('getWordsByCategory', () => {
    it('should return words for valid category', () => {
      const words = repository.getWordsByCategory('Animals');
      expect(words.length).toBeGreaterThan(0);
    });

    it('should return uppercase words', () => {
      const words = repository.getWordsByCategory('Animals');
      words.forEach(word => {
        expect(word).toBe(word.toUpperCase());
      });
    });

    it('should filter words to 3-8 characters', () => {
      const words = repository.getWordsByCategory('Animals');
      words.forEach(word => {
        expect(word.length).toBeGreaterThanOrEqual(3);
        expect(word.length).toBeLessThanOrEqual(8);
      });
    });

    it('should handle case-insensitive category names', () => {
      const words1 = repository.getWordsByCategory('Animals');
      const words2 = repository.getWordsByCategory('animals');
      const words3 = repository.getWordsByCategory('ANIMALS');
      
      expect(words1).toEqual(words2);
      expect(words2).toEqual(words3);
    });

    it('should return empty array for invalid category', () => {
      const words = repository.getWordsByCategory('InvalidCategory');
      expect(words).toEqual([]);
    });

    it('should return sufficient words per category', () => {
      // Each category should have enough words for puzzle generation
      // After filtering to 3-8 chars, counts may vary
      expect(repository.getWordsByCategory('Animals').length).toBeGreaterThan(100);
      expect(repository.getWordsByCategory('Sports').length).toBeGreaterThan(100);
      expect(repository.getWordsByCategory('Science').length).toBeGreaterThan(100);
      expect(repository.getWordsByCategory('Food').length).toBeGreaterThan(100);
      expect(repository.getWordsByCategory('Geography').length).toBeGreaterThan(100);
      expect(repository.getWordsByCategory('Technology').length).toBeGreaterThan(100);
      expect(repository.getWordsByCategory('Music').length).toBeGreaterThan(100);
      expect(repository.getWordsByCategory('Movies').length).toBeGreaterThan(100);
    });
  });

  describe('getWordCount', () => {
    it('should return correct word count', () => {
      const count = repository.getWordCount('Animals');
      const words = repository.getWordsByCategory('Animals');
      expect(count).toBe(words.length);
    });

    it('should return 0 for invalid category', () => {
      const count = repository.getWordCount('InvalidCategory');
      expect(count).toBe(0);
    });
  });

  describe('hasCategory', () => {
    it('should return true for valid category', () => {
      expect(repository.hasCategory('Animals')).toBe(true);
      expect(repository.hasCategory('Sports')).toBe(true);
    });

    it('should return false for invalid category', () => {
      expect(repository.hasCategory('InvalidCategory')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(repository.hasCategory('animals')).toBe(true);
      expect(repository.hasCategory('ANIMALS')).toBe(true);
      expect(repository.hasCategory('Animals')).toBe(true);
    });
  });
});

// Property-based tests
import * as fc from 'fast-check';

describe('Property-Based Tests', () => {
  const repository = new WordRepositoryImpl();

  // Feature: word-search-game, Property 1: Word Data Integrity
  describe('Property 1: Word Data Integrity', () => {
    it('should have sufficient words per category and all words 3-8 chars', () => {
      fc.assert(
        fc.property(
          // Test all categories
          fc.constantFrom(
            'Animals',
            'Sports',
            'Science',
            'Food',
            'Geography',
            'Technology',
            'Music',
            'Movies'
          ),
          (category) => {
            const words = repository.getWordsByCategory(category);

            // Property 1a: Sufficient words per category (at least 100 for puzzle generation)
            // Note: Raw JSON files have 150+ words, but after filtering to 3-8 chars,
            // counts vary by category. Minimum requirement is 100 words.
            expect(words.length).toBeGreaterThanOrEqual(100);

            // Property 1b: Every word should be between 3 and 8 characters
            words.forEach(word => {
              expect(word.length).toBeGreaterThanOrEqual(3);
              expect(word.length).toBeLessThanOrEqual(8);
            });

            // Additional validation: All words should be uppercase
            words.forEach(word => {
              expect(word).toBe(word.toUpperCase());
            });

            // Additional validation: No empty words
            words.forEach(word => {
              expect(word.length).toBeGreaterThan(0);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
