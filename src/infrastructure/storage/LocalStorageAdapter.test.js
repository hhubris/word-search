import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageAdapter } from './LocalStorageAdapter.js';

describe('LocalStorageAdapter', () => {
  let adapter;
  let mockStorage;

  beforeEach(() => {
    // Create a mock localStorage
    mockStorage = {
      data: {},
      get length() {
        return Object.keys(this.data).length;
      },
      getItem(key) {
        return this.data[key] || null;
      },
      setItem(key, value) {
        this.data[key] = value;
      },
      removeItem(key) {
        delete this.data[key];
      },
      clear() {
        this.data = {};
      },
      key(index) {
        const keys = Object.keys(this.data);
        return keys[index] || null;
      }
    };

    // Mock window.localStorage
    global.window = { localStorage: mockStorage };
    adapter = new LocalStorageAdapter();
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      expect(adapter.get('nonexistent')).toBeNull();
    });

    it('should retrieve and parse stored value', () => {
      mockStorage.setItem('test', JSON.stringify({ foo: 'bar' }));
      const result = adapter.get('test');
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should handle primitive values', () => {
      mockStorage.setItem('string', JSON.stringify('hello'));
      mockStorage.setItem('number', JSON.stringify(42));
      mockStorage.setItem('boolean', JSON.stringify(true));

      expect(adapter.get('string')).toBe('hello');
      expect(adapter.get('number')).toBe(42);
      expect(adapter.get('boolean')).toBe(true);
    });

    it('should return null on parse error', () => {
      mockStorage.setItem('invalid', 'not valid json');
      expect(adapter.get('invalid')).toBeNull();
    });

    it('should return null when localStorage is not available', () => {
      global.window = undefined;
      const noStorageAdapter = new LocalStorageAdapter();
      expect(noStorageAdapter.get('test')).toBeNull();
    });
  });

  describe('set', () => {
    it('should store a value', () => {
      const result = adapter.set('test', { foo: 'bar' });
      expect(result).toBe(true);
      expect(mockStorage.getItem('test')).toBe(JSON.stringify({ foo: 'bar' }));
    });

    it('should store primitive values', () => {
      adapter.set('string', 'hello');
      adapter.set('number', 42);
      adapter.set('boolean', true);

      expect(mockStorage.getItem('string')).toBe(JSON.stringify('hello'));
      expect(mockStorage.getItem('number')).toBe(JSON.stringify(42));
      expect(mockStorage.getItem('boolean')).toBe(JSON.stringify(true));
    });

    it('should overwrite existing value', () => {
      adapter.set('test', 'first');
      adapter.set('test', 'second');
      expect(adapter.get('test')).toBe('second');
    });

    it('should return false when localStorage is not available', () => {
      global.window = undefined;
      const noStorageAdapter = new LocalStorageAdapter();
      expect(noStorageAdapter.set('test', 'value')).toBe(false);
    });

    it('should handle circular references gracefully', () => {
      const circular = { a: 1 };
      circular.self = circular;
      
      const result = adapter.set('circular', circular);
      expect(result).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove a value', () => {
      adapter.set('test', 'value');
      const result = adapter.remove('test');
      
      expect(result).toBe(true);
      expect(adapter.get('test')).toBeNull();
    });

    it('should return true even if key does not exist', () => {
      const result = adapter.remove('nonexistent');
      expect(result).toBe(true);
    });

    it('should return false when localStorage is not available', () => {
      global.window = undefined;
      const noStorageAdapter = new LocalStorageAdapter();
      expect(noStorageAdapter.remove('test')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all storage', () => {
      adapter.set('key1', 'value1');
      adapter.set('key2', 'value2');
      
      const result = adapter.clear();
      
      expect(result).toBe(true);
      expect(adapter.get('key1')).toBeNull();
      expect(adapter.get('key2')).toBeNull();
    });

    it('should return false when localStorage is not available', () => {
      global.window = undefined;
      const noStorageAdapter = new LocalStorageAdapter();
      expect(noStorageAdapter.clear()).toBe(false);
    });
  });

  describe('isAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(adapter.isAvailable()).toBe(true);
    });

    it('should return false when localStorage is not available', () => {
      global.window = undefined;
      const noStorageAdapter = new LocalStorageAdapter();
      expect(noStorageAdapter.isAvailable()).toBe(false);
    });
  });

  describe('keys', () => {
    it('should return all keys', () => {
      adapter.set('key1', 'value1');
      adapter.set('key2', 'value2');
      
      const keys = adapter.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });

    it('should return empty array when localStorage is not available', () => {
      global.window = undefined;
      const noStorageAdapter = new LocalStorageAdapter();
      expect(noStorageAdapter.keys()).toEqual([]);
    });
  });
});
