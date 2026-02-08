import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import fc from 'fast-check';
import { HomeScreen } from './HomeScreen';

// Mock TanStack Router
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const CATEGORIES = ['ANIMALS', 'SPORTS', 'SCIENCE', 'FOOD', 'GEOGRAPHY', 'TECHNOLOGY', 'MUSIC', 'MOVIES'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

describe('HomeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  // Feature: word-search-game, Property 21: Start Button Enablement
  // For any combination of category and difficulty selections, the Start Game button should be enabled if and only if both a category and a difficulty have been selected.
  test('Property 21: Start button enabled iff both category and difficulty selected', () => {
    fc.assert(
      fc.property(
        fc.option(fc.constantFrom(...CATEGORIES), { nil: null }),
        fc.option(fc.constantFrom(...DIFFICULTIES), { nil: null }),
        (category, difficulty) => {
          // Set initial state in localStorage
          localStorage.clear();
          if (category) localStorage.setItem('word-search-last-category', category);
          if (difficulty) localStorage.setItem('word-search-last-difficulty', difficulty);

          const { unmount } = render(<HomeScreen />);
          
          const startButtons = screen.getAllByText('Start Game');
          const startButton = startButtons[0]; // Get the first (and should be only) button
          const shouldBeEnabled = category !== null && difficulty !== null;

          if (shouldBeEnabled) {
            expect(startButton).not.toBeDisabled();
          } else {
            expect(startButton).toBeDisabled();
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('initial button state is disabled when no selections', () => {
    render(<HomeScreen />);
    const startButton = screen.getByText('Start Game');
    expect(startButton).toBeDisabled();
  });

  test('button enabled after both selections', () => {
    render(<HomeScreen />);
    
    fireEvent.click(screen.getByText('Animals'));
    fireEvent.click(screen.getByText('Easy'));
    
    const startButton = screen.getByText('Start Game');
    expect(startButton).not.toBeDisabled();
  });

  test('button remains disabled with only category selected', () => {
    render(<HomeScreen />);
    
    fireEvent.click(screen.getByText('Animals'));
    
    const startButton = screen.getByText('Start Game');
    expect(startButton).toBeDisabled();
  });

  test('button remains disabled with only difficulty selected', () => {
    render(<HomeScreen />);
    
    fireEvent.click(screen.getByText('Easy'));
    
    const startButton = screen.getByText('Start Game');
    expect(startButton).toBeDisabled();
  });

  test('navigates to game screen on Start click', () => {
    render(<HomeScreen />);
    
    fireEvent.click(screen.getByText('Animals'));
    fireEvent.click(screen.getByText('Medium'));
    fireEvent.click(screen.getByText('Start Game'));
    
    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/game',
      search: { category: 'ANIMALS', difficulty: 'MEDIUM' }
    });
  });

  test('navigates to high scores screen on View High Scores click', () => {
    render(<HomeScreen />);
    
    fireEvent.click(screen.getByText('View High Scores'));
    
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/high-scores' });
  });

  test('loads saved preferences from localStorage', () => {
    localStorage.setItem('word-search-last-category', 'SPORTS');
    localStorage.setItem('word-search-last-difficulty', 'HARD');
    
    render(<HomeScreen />);
    
    const startButton = screen.getByText('Start Game');
    expect(startButton).not.toBeDisabled();
  });

  test('saves selections to localStorage', () => {
    render(<HomeScreen />);
    
    fireEvent.click(screen.getByText('Science'));
    fireEvent.click(screen.getByText('Easy'));
    
    expect(localStorage.getItem('word-search-last-category')).toBe('SCIENCE');
    expect(localStorage.getItem('word-search-last-difficulty')).toBe('EASY');
  });
});
