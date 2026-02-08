import { useState, useCallback, useRef } from 'react';

/**
 * PuzzleGrid Component
 * Renders grid cells with letters and handles word selection interactions
 * 
 * Requirements: 5.1, 6.1, 6.2, 6.3, 6.5
 */
export function PuzzleGrid({ grid, foundWords = [], onSelectionComplete }) {
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const selectionDirection = useRef(null);
  const startCell = useRef(null);

  // Create a map of found word positions for highlighting
  const foundPositions = useRef(new Set());
  
  // Update found positions when foundWords changes
  if (foundWords.length > 0) {
    foundPositions.current = new Set();
    foundWords.forEach(word => {
      const positions = word.getPositions();
      positions.forEach(pos => {
        foundPositions.current.add(`${pos.row},${pos.col}`);
      });
    });
  }

  /**
   * Determine direction between two cells
   */
  const determineDirection = useCallback((start, end) => {
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;

    // Same cell
    if (rowDiff === 0 && colDiff === 0) return null;

    // Normalize to get direction
    const rowDir = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
    const colDir = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

    // Check if it's a valid straight line
    if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff)) {
      return null; // Not a valid diagonal
    }

    return { row: rowDir, col: colDir };
  }, []);

  /**
   * Get all cells along a direction from start to end
   */
  const getCellsInDirection = useCallback((start, end, direction) => {
    const cells = [start];
    let current = { ...start };

    while (current.row !== end.row || current.col !== end.col) {
      current = {
        row: current.row + direction.row,
        col: current.col + direction.col,
      };

      // Check if still within grid bounds
      if (current.row < 0 || current.row >= grid.size || 
          current.col < 0 || current.col >= grid.size) {
        break;
      }

      cells.push({ ...current });

      // Safety check to prevent infinite loops
      if (cells.length > grid.size * 2) break;
    }

    return cells;
  }, [grid.size]);

  /**
   * Handle mouse down on a cell
   */
  const handleMouseDown = useCallback((row, col) => {
    setIsSelecting(true);
    startCell.current = { row, col };
    selectionDirection.current = null;
    setSelectedCells([{ row, col }]);
  }, []);

  /**
   * Handle mouse enter on a cell while selecting
   */
  const handleMouseEnter = useCallback((row, col) => {
    if (!isSelecting || !startCell.current) return;

    const currentCell = { row, col };

    // If this is the start cell, just keep it selected
    if (row === startCell.current.row && col === startCell.current.col) {
      setSelectedCells([startCell.current]);
      return;
    }

    // Determine or validate direction
    const newDirection = determineDirection(startCell.current, currentCell);
    
    if (!newDirection) {
      // Invalid direction, keep current selection
      return;
    }

    // If we don't have a direction yet, set it
    if (!selectionDirection.current) {
      selectionDirection.current = newDirection;
    }

    // Check if current cell is in the same direction
    const expectedDirection = selectionDirection.current;
    if (newDirection.row !== expectedDirection.row || newDirection.col !== expectedDirection.col) {
      // Different direction, don't update selection
      return;
    }

    // Get all cells from start to current in the direction
    const cells = getCellsInDirection(startCell.current, currentCell, expectedDirection);
    setSelectedCells(cells);
  }, [isSelecting, determineDirection, getCellsInDirection]);

  /**
   * Handle mouse up - complete selection
   */
  const handleMouseUp = useCallback(() => {
    if (isSelecting && selectedCells.length > 0) {
      // Call the callback with selected cells
      if (onSelectionComplete) {
        onSelectionComplete(selectedCells);
      }
    }

    // Reset selection state
    setIsSelecting(false);
    setSelectedCells([]);
    startCell.current = null;
    selectionDirection.current = null;
  }, [isSelecting, selectedCells, onSelectionComplete]);

  /**
   * Check if a cell is selected
   */
  const isCellSelected = useCallback((row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  }, [selectedCells]);

  /**
   * Check if a cell is part of a found word
   */
  const isCellFound = useCallback((row, col) => {
    return foundPositions.current.has(`${row},${col}`);
  }, []);

  return (
    <div 
      style={styles.container}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        style={{
          ...styles.grid,
          gridTemplateColumns: `repeat(${grid.size}, 1fr)`,
        }}
      >
        {Array.from({ length: grid.size }).map((_, row) =>
          Array.from({ length: grid.size }).map((_, col) => {
            const cell = grid.getCell(row, col);
            const isSelected = isCellSelected(row, col);
            const isFound = isCellFound(row, col);

            return (
              <div
                key={`${row}-${col}`}
                style={{
                  ...styles.cell,
                  ...(isSelected ? styles.selectedCell : {}),
                  ...(isFound ? styles.foundCell : {}),
                }}
                onMouseDown={() => handleMouseDown(row, col)}
                onMouseEnter={() => handleMouseEnter(row, col)}
              >
                {cell.letter}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    userSelect: 'none',
  },
  grid: {
    display: 'grid',
    gap: '2px',
    backgroundColor: '#ccc',
    padding: '2px',
    borderRadius: '4px',
  },
  cell: {
    aspectRatio: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    minWidth: '40px',
    minHeight: '40px',
  },
  selectedCell: {
    backgroundColor: '#3b82f6',
    color: '#fff',
  },
  foundCell: {
    backgroundColor: '#10b981',
    color: '#fff',
  },
};
