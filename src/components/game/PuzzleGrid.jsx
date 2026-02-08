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
      className="flex justify-center items-center p-5 select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative">
        <div 
          className="grid gap-0.5 bg-tertiary p-0.5 rounded"
          style={{
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
                  className={`
                    aspect-square flex justify-center items-center
                    text-xl font-bold cursor-pointer transition-all
                    min-w-[40px] min-h-[40px]
                    ${isSelected ? 'bg-blue-500 text-white' : 'bg-secondary text-primary'}
                  `}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                >
                  {cell.letter}
                </div>
              );
            })
          )}
        </div>

        {/* SVG overlay for found word circles */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            overflow: 'visible',
          }}
          viewBox={`0 0 ${grid.size} ${grid.size}`}
          preserveAspectRatio="none"
        >
          {foundWords.map((word, index) => {
            const positions = word.getPositions();
            if (positions.length === 0) return null;
            
            const start = positions[0];
            const end = positions[positions.length - 1];
            
            // Calculate center points for start and end
            const x1 = start.col + 0.5;
            const y1 = start.row + 0.5;
            const x2 = end.col + 0.5;
            const y2 = end.row + 0.5;
            
            // Calculate center point of the word
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            
            // Calculate length and angle
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            
            // Rounded rectangle dimensions
            const width = length + 0.7; // Extended length
            const height = 0.7; // Height of the rounded rect
            const radius = height / 2; // Fully rounded ends
            
            return (
              <rect
                key={`circle-${index}`}
                x={cx - width / 2}
                y={cy - height / 2}
                width={width}
                height={height}
                rx={radius}
                ry={radius}
                fill="none"
                stroke="#10b981"
                strokeWidth="0.08"
                transform={`rotate(${angle} ${cx} ${cy})`}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
