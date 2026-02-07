/**
 * LocalStorageAdapter
 * Adapter for browser localStorage with error handling
 */
export class LocalStorageAdapter {
  constructor() {
    this.storage = typeof window !== 'undefined' ? window.localStorage : null;
  }

  /**
   * Get a value from storage
   * @param {string} key - Storage key
   * @returns {any} Parsed value or null
   */
  get(key) {
    if (!this.storage) {
      console.warn('localStorage is not available');
      return null;
    }

    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Set a value in storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   * @returns {boolean} True if successful
   */
  set(key, value) {
    if (!this.storage) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      this.storage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
      
      // Check if quota exceeded
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
      }
      
      return false;
    }
  }

  /**
   * Remove a value from storage
   * @param {string} key - Storage key
   * @returns {boolean} True if successful
   */
  remove(key) {
    if (!this.storage) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all storage
   * @returns {boolean} True if successful
   */
  clear() {
    if (!this.storage) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Check if storage is available
   * @returns {boolean} True if available
   */
  isAvailable() {
    return this.storage !== null;
  }

  /**
   * Get all keys in storage
   * @returns {Array} Array of keys
   */
  keys() {
    if (!this.storage) {
      return [];
    }

    try {
      const keys = [];
      for (let i = 0; i < this.storage.length; i++) {
        keys.push(this.storage.key(i));
      }
      return keys;
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }
}
