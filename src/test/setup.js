import { expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Setup localStorage mock for jsdom
beforeEach(() => {
  const localStorageMock = {
    data: {},
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
    get length() {
      return Object.keys(this.data).length;
    },
    key(index) {
      const keys = Object.keys(this.data);
      return keys[index] || null;
    }
  };

  global.localStorage = localStorageMock;
  global.window = global.window || {};
  global.window.localStorage = localStorageMock;
});

// Cleanup after each test case
afterEach(() => {
  cleanup();
});
