import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PuzzleGrid } from './PuzzleGrid.jsx';
import { Grid } from '../../domain/entities/Grid.js';
import { Word } from '../../domain/entities/Word.js';
import { Position } from '../../domain/value-objects/Position.js';
import { Direction } from '../../domain/value-objects/Direction.js';

describe('PuzzleGrid', () => {
  // Helper to create a test grid
  const createTestGrid = (size = 5) => {
    const grid = new Grid(size);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXY';
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        grid.setLetter(row, col, letters[(row * size + col) % letters.length]);
      }
    }
    
    return grid;
  };

  // Helper to create a test word
  const createTestWord = (id, text, startRow, startCol, direction) => {
    return new Word(
      id,
      text,
      new Position(startRow, startCol),
      direction
    );
  };

  describe('rendering', () => {
    it('should render all grid cells', () => {
      const grid = createTestGrid(3);
      render(<PuzzleGrid grid={grid} />);

      // Check that all 9 cells are rendered (3x3 grid)
      const cells = screen.getAllByText(/[A-Z]/);
      expect(cells).toHaveLength(9);
    });

    it('should render correct letters in cells', () => {
      const grid = createTestGrid(3);
      render(<PuzzleGrid grid={grid} />);

      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('should render grid with correct size', () => {
      const grid = createTestGrid(4);
      render(<PuzzleGrid grid={grid} />);

      const cells = screen.getAllByText(/[A-Z]/);
      expect(cells).toHaveLength(16); // 4x4 = 16 cells
    });

    it('should handle empty grid', () => {
      const grid = new Grid(2);
      const { container } = render(<PuzzleGrid grid={grid} />);

      // Should still render the component
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('selection state', () => {
    it('should highlight cell on mouse down', () => {
      const grid = createTestGrid(3);
      render(<PuzzleGrid grid={grid} />);

      const firstCell = screen.getByText('A');
      fireEvent.mouseDown(firstCell);

      // Cell should have selected styling
      expect(firstCell).toHaveStyle({ backgroundColor: '#3b82f6' });
    });

    it('should clear selection on mouse up', () => {
      const grid = createTestGrid(3);
      render(<PuzzleGrid grid={grid} />);

      const firstCell = screen.getByText('A');
      fireEvent.mouseDown(firstCell);
      fireEvent.mouseUp(firstCell);

      // Selection should be cleared
      expect(firstCell).not.toHaveStyle({ backgroundColor: '#3b82f6' });
    });

    it('should select multiple cells in a line', () => {
      const grid = createTestGrid(3);
      render(<PuzzleGrid grid={grid} />);

      const cellA = screen.getByText('A');
      const cellB = screen.getByText('B');

      fireEvent.mouseDown(cellA);
      fireEvent.mouseEnter(cellB);

      // Both cells should be selected
      expect(cellA).toHaveStyle({ backgroundColor: '#3b82f6' });
      expect(cellB).toHaveStyle({ backgroundColor: '#3b82f6' });
    });

    it('should call onSelectionComplete when selection is finished', () => {
      const grid = createTestGrid(3);
      const onSelectionComplete = vi.fn();
      render(<PuzzleGrid grid={grid} onSelectionComplete={onSelectionComplete} />);

      const cellA = screen.getByText('A');
      fireEvent.mouseDown(cellA);
      fireEvent.mouseUp(cellA);

      expect(onSelectionComplete).toHaveBeenCalledTimes(1);
      expect(onSelectionComplete).toHaveBeenCalledWith([{ row: 0, col: 0 }]);
    });

    it('should not call onSelectionComplete if no cells selected', () => {
      const grid = createTestGrid(3);
      const onSelectionComplete = vi.fn();
      const { container } = render(<PuzzleGrid grid={grid} onSelectionComplete={onSelectionComplete} />);

      fireEvent.mouseUp(container.firstChild);

      expect(onSelectionComplete).not.toHaveBeenCalled();
    });
  });

  describe('found word highlighting', () => {
    it('should highlight cells that are part of found words', () => {
      const grid = createTestGrid(5);
      const word = createTestWord('1', 'ABC', 0, 0, Direction.RIGHT);
      word.markFound();

      render(<PuzzleGrid grid={grid} foundWords={[word]} />);

      const cellA = screen.getByText('A');
      expect(cellA).toHaveStyle({ backgroundColor: '#10b981' });
    });

    it('should not highlight cells that are not part of found words', () => {
      const grid = createTestGrid(5);
      const word = createTestWord('1', 'ABC', 0, 0, Direction.RIGHT);
      word.markFound();

      render(<PuzzleGrid grid={grid} foundWords={[word]} />);

      const cellD = screen.getByText('D');
      expect(cellD).not.toHaveStyle({ backgroundColor: '#10b981' });
    });

    it('should handle multiple found words', () => {
      const grid = createTestGrid(5);
      const word1 = createTestWord('1', 'ABC', 0, 0, Direction.RIGHT);
      const word2 = createTestWord('2', 'FGH', 1, 0, Direction.RIGHT);
      word1.markFound();
      word2.markFound();

      render(<PuzzleGrid grid={grid} foundWords={[word1, word2]} />);

      const cellA = screen.getByText('A');
      const cellF = screen.getByText('F');

      expect(cellA).toHaveStyle({ backgroundColor: '#10b981' });
      expect(cellF).toHaveStyle({ backgroundColor: '#10b981' });
    });

    it('should handle empty foundWords array', () => {
      const grid = createTestGrid(3);
      render(<PuzzleGrid grid={grid} foundWords={[]} />);

      const cellA = screen.getByText('A');
      expect(cellA).not.toHaveStyle({ backgroundColor: '#10b981' });
    });
  });

  describe('direction restriction', () => {
    it('should restrict selection to horizontal direction', () => {
      const grid = createTestGrid(5);
      render(<PuzzleGrid grid={grid} />);

      const cellA = screen.getByText('A'); // (0,0)
      const cellB = screen.getByText('B'); // (0,1)
      const cellF = screen.getByText('F'); // (1,0)

      fireEvent.mouseDown(cellA);
      fireEvent.mouseEnter(cellB); // Horizontal move - should work
      
      expect(cellB).toHaveStyle({ backgroundColor: '#3b82f6' });

      fireEvent.mouseEnter(cellF); // Vertical move - should be ignored
      
      // cellF should not be selected because it's in a different direction
      expect(cellF).not.toHaveStyle({ backgroundColor: '#3b82f6' });
    });

    it('should allow selection in established direction only', () => {
      const grid = createTestGrid(5);
      const onSelectionComplete = vi.fn();
      render(<PuzzleGrid grid={grid} onSelectionComplete={onSelectionComplete} />);

      const cellA = screen.getByText('A'); // (0,0)
      const cellB = screen.getByText('B'); // (0,1)
      const cellC = screen.getByText('C'); // (0,2)

      fireEvent.mouseDown(cellA);
      fireEvent.mouseEnter(cellB);
      fireEvent.mouseEnter(cellC);
      fireEvent.mouseUp(cellC);

      // Should have selected 3 cells in a horizontal line
      expect(onSelectionComplete).toHaveBeenCalledWith([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ]);
    });
  });

  describe('mouse interactions', () => {
    it('should handle mouse leave by completing selection', () => {
      const grid = createTestGrid(3);
      const onSelectionComplete = vi.fn();
      const { container } = render(<PuzzleGrid grid={grid} onSelectionComplete={onSelectionComplete} />);

      const cellA = screen.getByText('A');

      fireEvent.mouseDown(cellA);
      fireEvent.mouseLeave(container.firstChild);

      expect(onSelectionComplete).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid mouse movements', () => {
      const grid = createTestGrid(5);
      render(<PuzzleGrid grid={grid} />);

      const cellA = screen.getByText('A');
      const cellB = screen.getByText('B');
      const cellC = screen.getByText('C');

      fireEvent.mouseDown(cellA);
      fireEvent.mouseEnter(cellB);
      fireEvent.mouseEnter(cellA); // Back to start
      fireEvent.mouseEnter(cellB);
      fireEvent.mouseEnter(cellC);

      // Should handle all movements without errors
      expect(cellC).toHaveStyle({ backgroundColor: '#3b82f6' });
    });

    it('should not select when not in selecting mode', () => {
      const grid = createTestGrid(3);
      render(<PuzzleGrid grid={grid} />);

      const cellA = screen.getByText('A');
      const cellB = screen.getByText('B');

      // Enter cell without mouse down first
      fireEvent.mouseEnter(cellB);

      expect(cellB).not.toHaveStyle({ backgroundColor: '#3b82f6' });
    });
  });

  describe('edge cases', () => {
    it('should handle single cell selection', () => {
      const grid = createTestGrid(3);
      const onSelectionComplete = vi.fn();
      render(<PuzzleGrid grid={grid} onSelectionComplete={onSelectionComplete} />);

      const cellA = screen.getByText('A');
      fireEvent.mouseDown(cellA);
      fireEvent.mouseUp(cellA);

      expect(onSelectionComplete).toHaveBeenCalledWith([{ row: 0, col: 0 }]);
    });

    it('should handle selection at grid boundaries', () => {
      const grid = createTestGrid(3);
      render(<PuzzleGrid grid={grid} />);

      // Get the last cell in the grid
      const cells = screen.getAllByText(/[A-Z]/);
      const lastCell = cells[cells.length - 1];

      fireEvent.mouseDown(lastCell);
      expect(lastCell).toHaveStyle({ backgroundColor: '#3b82f6' });
    });

    it('should handle very small grid (2x2)', () => {
      const grid = createTestGrid(2);
      render(<PuzzleGrid grid={grid} />);

      const cells = screen.getAllByText(/[A-Z]/);
      expect(cells).toHaveLength(4);
    });

    it('should handle selection returning to start cell', () => {
      const grid = createTestGrid(3);
      render(<PuzzleGrid grid={grid} />);

      const cellA = screen.getByText('A');
      const cellB = screen.getByText('B');

      fireEvent.mouseDown(cellA);
      fireEvent.mouseEnter(cellB);
      fireEvent.mouseEnter(cellA); // Back to start

      // Should only have start cell selected
      expect(cellA).toHaveStyle({ backgroundColor: '#3b82f6' });
    });
  });
});
