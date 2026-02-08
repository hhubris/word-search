import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import fc from 'fast-check';
import { DifficultySelector } from './DifficultySelector';

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

describe('DifficultySelector', () => {
  // Feature: word-search-game, Property 22: Selection State Management
  // For any combination of category and difficulty selections, the selected item should be marked as active in the application state.
  test('Property 22: selected difficulty is marked as active', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...DIFFICULTIES),
        (selectedDifficulty) => {
          const onDifficultySelect = vi.fn();
          const { container } = render(
            <DifficultySelector 
              selectedDifficulty={selectedDifficulty} 
              onDifficultySelect={onDifficultySelect} 
            />
          );

          // Find the button for the selected difficulty
          const buttons = container.querySelectorAll('button');
          const selectedButton = Array.from(buttons).find(
            btn => btn.querySelector('div').textContent === selectedDifficulty.charAt(0) + selectedDifficulty.slice(1).toLowerCase()
          );

          // Verify the selected difficulty has active styling
          expect(selectedButton).toBeDefined();
          expect(selectedButton.style.border).toContain('2px solid');
          expect(selectedButton.style.backgroundColor).toBe('var(--accent-color)');

          // Verify non-selected difficulties don't have active styling
          const otherButtons = Array.from(buttons).filter(btn => btn !== selectedButton);
          otherButtons.forEach(btn => {
            expect(btn.style.border).toContain('1px solid');
            expect(btn.style.backgroundColor).toBe('var(--bg-secondary)');
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('renders all 3 difficulties', () => {
    const onDifficultySelect = vi.fn();
    render(<DifficultySelector selectedDifficulty={null} onDifficultySelect={onDifficultySelect} />);
    
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  test('displays correct descriptions for each difficulty', () => {
    const onDifficultySelect = vi.fn();
    render(<DifficultySelector selectedDifficulty={null} onDifficultySelect={onDifficultySelect} />);
    
    expect(screen.getByText('8 words, no timer, horizontal and vertical only')).toBeInTheDocument();
    expect(screen.getByText('12 words, 5 minute timer, includes diagonals')).toBeInTheDocument();
    expect(screen.getByText('16 words, 3 minute timer, all eight directions')).toBeInTheDocument();
  });

  test('calls onDifficultySelect when a difficulty is clicked', () => {
    const onDifficultySelect = vi.fn();
    render(<DifficultySelector selectedDifficulty={null} onDifficultySelect={onDifficultySelect} />);
    
    fireEvent.click(screen.getByText('Medium'));
    expect(onDifficultySelect).toHaveBeenCalledWith('MEDIUM');
  });

  test('highlights selected difficulty', () => {
    const onDifficultySelect = vi.fn();
    const { container } = render(
      <DifficultySelector selectedDifficulty="HARD" onDifficultySelect={onDifficultySelect} />
    );
    
    const hardButton = screen.getByText('Hard').closest('button');
    expect(hardButton.style.border).toContain('2px solid');
    expect(hardButton.style.backgroundColor).toBe('var(--accent-color)');
  });
});
