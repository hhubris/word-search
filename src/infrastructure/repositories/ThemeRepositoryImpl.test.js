import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeRepositoryImpl, Theme } from './ThemeRepositoryImpl.js';

// Mock storage adapter
class MockStorageAdapter {
  constructor() {
    this.data = {};
  }

  get(key) {
    return this.data[key] || null;
  }

  set(key, value) {
    this.data[key] = value;
    return true;
  }

  remove(key) {
    delete this.data[key];
    return true;
  }
}

describe('ThemeRepositoryImpl', () => {
  let repository;
  let storage;

  beforeEach(() => {
    storage = new MockStorageAdapter();
    repository = new ThemeRepositoryImpl(storage);
  });

  describe('getTheme', () => {
    it('should return SYSTEM as default when no theme is stored', () => {
      expect(repository.getTheme()).toBe(Theme.SYSTEM);
    });

    it('should return stored theme', () => {
      repository.saveTheme(Theme.LIGHT);
      expect(repository.getTheme()).toBe(Theme.LIGHT);
    });

    it('should return SYSTEM for invalid stored theme', () => {
      storage.set('word-search-theme', 'INVALID');
      expect(repository.getTheme()).toBe(Theme.SYSTEM);
    });
  });

  describe('saveTheme', () => {
    it('should save LIGHT theme', () => {
      const result = repository.saveTheme(Theme.LIGHT);
      expect(result).toBe(true);
      expect(repository.getTheme()).toBe(Theme.LIGHT);
    });

    it('should save DARK theme', () => {
      const result = repository.saveTheme(Theme.DARK);
      expect(result).toBe(true);
      expect(repository.getTheme()).toBe(Theme.DARK);
    });

    it('should save SYSTEM theme', () => {
      const result = repository.saveTheme(Theme.SYSTEM);
      expect(result).toBe(true);
      expect(repository.getTheme()).toBe(Theme.SYSTEM);
    });

    it('should reject invalid theme', () => {
      const result = repository.saveTheme('INVALID');
      expect(result).toBe(false);
    });

    it('should overwrite existing theme', () => {
      repository.saveTheme(Theme.LIGHT);
      repository.saveTheme(Theme.DARK);
      expect(repository.getTheme()).toBe(Theme.DARK);
    });
  });

  describe('isValidTheme', () => {
    it('should return true for valid themes', () => {
      expect(repository.isValidTheme(Theme.LIGHT)).toBe(true);
      expect(repository.isValidTheme(Theme.DARK)).toBe(true);
      expect(repository.isValidTheme(Theme.SYSTEM)).toBe(true);
    });

    it('should return false for invalid themes', () => {
      expect(repository.isValidTheme('INVALID')).toBe(false);
      expect(repository.isValidTheme('')).toBe(false);
      expect(repository.isValidTheme(null)).toBe(false);
    });
  });

  describe('getAvailableThemes', () => {
    it('should return all three themes', () => {
      const themes = repository.getAvailableThemes();
      expect(themes).toHaveLength(3);
      expect(themes).toContain(Theme.LIGHT);
      expect(themes).toContain(Theme.DARK);
      expect(themes).toContain(Theme.SYSTEM);
    });
  });

  describe('getNextTheme', () => {
    it('should cycle from LIGHT to DARK', () => {
      expect(repository.getNextTheme(Theme.LIGHT)).toBe(Theme.DARK);
    });

    it('should cycle from DARK to SYSTEM', () => {
      expect(repository.getNextTheme(Theme.DARK)).toBe(Theme.SYSTEM);
    });

    it('should cycle from SYSTEM to LIGHT', () => {
      expect(repository.getNextTheme(Theme.SYSTEM)).toBe(Theme.LIGHT);
    });

    it('should return LIGHT for invalid theme', () => {
      expect(repository.getNextTheme('INVALID')).toBe(Theme.LIGHT);
    });
  });

  describe('resetTheme', () => {
    it('should remove stored theme', () => {
      repository.saveTheme(Theme.DARK);
      repository.resetTheme();
      expect(repository.getTheme()).toBe(Theme.SYSTEM);
    });

    it('should return true on successful reset', () => {
      repository.saveTheme(Theme.DARK);
      expect(repository.resetTheme()).toBe(true);
    });
  });

  describe('Property: Data Persistence Round Trip (Theme)', () => {
    it('should persist and retrieve LIGHT theme correctly', () => {
      repository.saveTheme(Theme.LIGHT);
      const retrieved = repository.getTheme();
      expect(retrieved).toBe(Theme.LIGHT);
    });

    it('should persist and retrieve DARK theme correctly', () => {
      repository.saveTheme(Theme.DARK);
      const retrieved = repository.getTheme();
      expect(retrieved).toBe(Theme.DARK);
    });

    it('should persist and retrieve SYSTEM theme correctly', () => {
      repository.saveTheme(Theme.SYSTEM);
      const retrieved = repository.getTheme();
      expect(retrieved).toBe(Theme.SYSTEM);
    });

    it('should maintain theme across multiple operations', () => {
      repository.saveTheme(Theme.LIGHT);
      expect(repository.getTheme()).toBe(Theme.LIGHT);
      
      repository.saveTheme(Theme.DARK);
      expect(repository.getTheme()).toBe(Theme.DARK);
      
      repository.saveTheme(Theme.SYSTEM);
      expect(repository.getTheme()).toBe(Theme.SYSTEM);
    });
  });

  describe('Property: Theme Cycling', () => {
    it('should cycle through all themes in correct order', () => {
      let current = Theme.LIGHT;
      
      current = repository.getNextTheme(current);
      expect(current).toBe(Theme.DARK);
      
      current = repository.getNextTheme(current);
      expect(current).toBe(Theme.SYSTEM);
      
      current = repository.getNextTheme(current);
      expect(current).toBe(Theme.LIGHT);
    });

    it('should complete full cycle and return to start', () => {
      let current = Theme.LIGHT;
      
      // Cycle through 3 times
      for (let i = 0; i < 3; i++) {
        current = repository.getNextTheme(current);
      }
      
      expect(current).toBe(Theme.LIGHT);
    });
  });
});
