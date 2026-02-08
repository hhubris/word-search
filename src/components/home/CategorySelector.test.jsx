import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import fc from 'fast-check';
import { CategorySelector } from './CategorySelector';

const CATEGORIES = ['ANIMALS', 'SPORTS', 'SCIENCE', 'FOOD', 'GEOGRAPHY', 'TECHNOLOGY', 'MUSIC', 'MOVIES'];

describe('CategorySelector', () => {
  // Feature: word-search-game, Property 22: Selection State Management
  // For any combination of category and difficulty selections, the selected item should be marked as active in the application state.
  test('Property 22: selected category is marked as active', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...CATEGORIES),
        (selectedCategory) => {
          const onCategorySelect = vi.fn();
          const { container } = render(
            <CategorySelector 
              selectedCategory={selectedCategory} 
              onCategorySelect={onCategorySelect} 
            />
          );

          // Find the button for the selected category
          const buttons = container.querySelectorAll('button');
          const selectedButton = Array.from(buttons).find(
            btn => btn.textContent === selectedCategory.charAt(0) + selectedCategory.slice(1).toLowerCase()
          );

          // Verify the selected category has active styling
          expect(selectedButton).toBeDefined();
          expect(selectedButton.style.border).toContain('2px solid');
          expect(selectedButton.style.backgroundColor).toBe('var(--accent-color)');
          expect(selectedButton.style.fontWeight).toBe('bold');

          // Verify non-selected categories don't have active styling
          const otherButtons = Array.from(buttons).filter(btn => btn !== selectedButton);
          otherButtons.forEach(btn => {
            expect(btn.style.border).toContain('1px solid');
            expect(btn.style.backgroundColor).toBe('var(--bg-secondary)');
            expect(btn.style.fontWeight).toBe('normal');
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('renders all 8 categories', () => {
    const onCategorySelect = vi.fn();
    render(<CategorySelector selectedCategory={null} onCategorySelect={onCategorySelect} />);
    
    expect(screen.getByText('Animals')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Geography')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
  });

  test('calls onCategorySelect when a category is clicked', () => {
    const onCategorySelect = vi.fn();
    render(<CategorySelector selectedCategory={null} onCategorySelect={onCategorySelect} />);
    
    fireEvent.click(screen.getByText('Animals'));
    expect(onCategorySelect).toHaveBeenCalledWith('ANIMALS');
  });

  test('highlights selected category', () => {
    const onCategorySelect = vi.fn();
    const { container } = render(
      <CategorySelector selectedCategory="SPORTS" onCategorySelect={onCategorySelect} />
    );
    
    const sportsButton = screen.getByText('Sports');
    expect(sportsButton.style.border).toContain('2px solid');
    expect(sportsButton.style.backgroundColor).toBe('var(--accent-color)');
  });
});
