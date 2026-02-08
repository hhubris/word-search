import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme.js';
import { resetContainer } from '../container.js';

describe('useTheme', () => {
  let mockMatchMedia;

  beforeEach(() => {
    // Reset container before each test
    resetContainer();

    // Mock matchMedia for system theme detection
    mockMatchMedia = vi.fn((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = mockMatchMedia;

    // Clear localStorage
    localStorage.clear();

    // Clear document classes
    document.documentElement.classList.remove('light', 'dark');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with SYSTEM theme by default', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('SYSTEM');
      expect(result.current.isSystem).toBe(true);
      expect(result.current.isLight).toBe(false);
      expect(result.current.isDark).toBe(false);
    });

    it('should load persisted theme from storage', () => {
      // Set theme in localStorage
      localStorage.setItem('word-search-theme', JSON.stringify('DARK'));

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('DARK');
      expect(result.current.isDark).toBe(true);
    });

    it('should apply theme to document on mount', () => {
      mockMatchMedia.mockReturnValue({
        matches: false, // Light mode
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });

      renderHook(() => useTheme());

      expect(document.documentElement.classList.contains('light')).toBe(true);
    });
  });

  describe('cycleTheme', () => {
    it('should cycle from LIGHT to DARK', () => {
      localStorage.setItem('word-search-theme', JSON.stringify('LIGHT'));
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.cycleTheme();
      });

      expect(result.current.theme).toBe('DARK');
      expect(result.current.isDark).toBe(true);
    });

    it('should cycle from DARK to SYSTEM', () => {
      localStorage.setItem('word-search-theme', JSON.stringify('DARK'));
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.cycleTheme();
      });

      expect(result.current.theme).toBe('SYSTEM');
      expect(result.current.isSystem).toBe(true);
    });

    it('should cycle from SYSTEM to LIGHT', () => {
      localStorage.setItem('word-search-theme', JSON.stringify('SYSTEM'));
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.cycleTheme();
      });

      expect(result.current.theme).toBe('LIGHT');
      expect(result.current.isLight).toBe(true);
    });

    it('should persist theme after cycling', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.cycleTheme();
      });

      const stored = JSON.parse(localStorage.getItem('word-search-theme'));
      expect(stored).toBe(result.current.theme);
    });
  });

  describe('setTheme', () => {
    it('should set specific theme', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('DARK');
      });

      expect(result.current.theme).toBe('DARK');
      expect(result.current.isDark).toBe(true);
    });

    it('should persist theme when set', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('LIGHT');
      });

      const stored = JSON.parse(localStorage.getItem('word-search-theme'));
      expect(stored).toBe('LIGHT');
    });
  });

  describe('theme application', () => {
    it('should apply LIGHT theme to document', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('LIGHT');
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should apply DARK theme to document', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('DARK');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('should apply SYSTEM theme based on prefers-color-scheme (dark)', () => {
      mockMatchMedia.mockReturnValue({
        matches: true, // Dark mode
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('SYSTEM');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should apply SYSTEM theme based on prefers-color-scheme (light)', () => {
      mockMatchMedia.mockReturnValue({
        matches: false, // Light mode
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('SYSTEM');
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('should remove previous theme class when changing themes', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('LIGHT');
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);

      act(() => {
        result.current.setTheme('DARK');
      });

      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('theme state helpers', () => {
    it('should correctly identify LIGHT theme', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('LIGHT');
      });

      expect(result.current.isLight).toBe(true);
      expect(result.current.isDark).toBe(false);
      expect(result.current.isSystem).toBe(false);
    });

    it('should correctly identify DARK theme', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('DARK');
      });

      expect(result.current.isLight).toBe(false);
      expect(result.current.isDark).toBe(true);
      expect(result.current.isSystem).toBe(false);
    });

    it('should correctly identify SYSTEM theme', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('SYSTEM');
      });

      expect(result.current.isLight).toBe(false);
      expect(result.current.isDark).toBe(false);
      expect(result.current.isSystem).toBe(true);
    });
  });

  describe('integration with ChangeThemeUseCase', () => {
    it('should use ChangeThemeUseCase for theme operations', () => {
      const { result } = renderHook(() => useTheme());

      // Initial theme should be from use case
      expect(result.current.theme).toBe('SYSTEM');

      // Cycling should use use case
      act(() => {
        result.current.cycleTheme();
      });

      expect(result.current.theme).toBe('LIGHT');

      // Setting should use use case
      act(() => {
        result.current.setTheme('DARK');
      });

      expect(result.current.theme).toBe('DARK');
    });
  });
});
