import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useGameSession } from '../application/hooks/useGameSession';
import { useTimer } from '../application/hooks/useTimer';
import { Selection } from '../domain/value-objects/Selection';
import { Position } from '../domain/value-objects/Position';

export const Route = createFileRoute('/game')({
  component: GameScreen,
  validateSearch: (search) => {
    return {
      category: search.category || 'ANIMALS',
      difficulty: search.difficulty || 'MEDIUM',
    };
  },
});

function GameScreen() {
  const navigate = useNavigate();
  const { category, difficulty } = Route.useSearch();
  const { gameSession, startGame, selectWord, endGame, isLoading, error, isPuzzleComplete } = useGameSession();
  const { timeRemaining, formattedTime, start: startTimer, stop: stopTimer } = useTimer();
  
  // Selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  const [showGameOver, setShowGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [renderKey, setRenderKey] = useState(0); // Force re-render when words are found
  const gridRef = useRef(null);

  useEffect(() => {
    // Start the game when component mounts
    startGame(category, difficulty).then((session) => {
      // Start timer if there's a timer duration
      const timerDuration = session.getTimerDuration();
      if (timerDuration) {
        startTimer(timerDuration, () => {
          // Timer expired - end game
          handleGameEnd();
        });
      }
    });
  }, [category, difficulty]);

  // Check for puzzle completion
  useEffect(() => {
    if (isPuzzleComplete && gameSession && !gameSession.isEnded()) {
      handleGameEnd();
    }
  }, [isPuzzleComplete]);

  const handleGameEnd = () => {
    if (!gameSession || gameSession.isEnded()) return;
    
    stopTimer();
    const result = endGame();
    
    setFinalScore(result.score);
    setShowGameOver(true);
  };

  // Mouse/touch handlers for word selection
  const handleCellMouseDown = (row, col) => {
    if (!gameSession || gameSession.isEnded() || timeRemaining === 0) return;
    
    setIsSelecting(true);
    setSelectedPositions([new Position(row, col)]);
    setFeedback(null);
  };

  const handleCellMouseEnter = (row, col) => {
    if (!isSelecting || !gameSession || gameSession.isEnded() || timeRemaining === 0) return;
    
    const newPos = new Position(row, col);
    
    // Check if this is the previous position (backtracking)
    if (selectedPositions.length >= 2) {
      const secondToLast = selectedPositions[selectedPositions.length - 2];
      if (secondToLast.row === row && secondToLast.col === col) {
        // Remove the last position (backtrack)
        setSelectedPositions(prev => prev.slice(0, -1));
        return;
      }
    }
    
    // Check if this position is already in the selection
    const alreadySelected = selectedPositions.some(
      pos => pos.row === row && pos.col === col
    );
    
    if (alreadySelected) return;
    
    // If we have at least one position, enforce direction constraint
    if (selectedPositions.length > 0) {
      const lastPos = selectedPositions[selectedPositions.length - 1];
      const rowDiff = row - lastPos.row;
      const colDiff = col - lastPos.col;
      
      // Check if the new position is adjacent (1 step away in any direction)
      const isAdjacent = Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1 && (rowDiff !== 0 || colDiff !== 0);
      
      if (!isAdjacent) return;
      
      // If we have 2+ positions, enforce same direction
      if (selectedPositions.length >= 2) {
        const firstPos = selectedPositions[0];
        const secondPos = selectedPositions[1];
        const dirRow = secondPos.row - firstPos.row;
        const dirCol = secondPos.col - firstPos.col;
        
        // Normalize direction to -1, 0, or 1
        const normDirRow = dirRow === 0 ? 0 : dirRow / Math.abs(dirRow);
        const normDirCol = dirCol === 0 ? 0 : dirCol / Math.abs(dirCol);
        
        // Check if new position follows the same direction
        const normRowDiff = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
        const normColDiff = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
        
        if (normDirRow !== normRowDiff || normDirCol !== normColDiff) return;
      }
    }
    
    setSelectedPositions(prev => [...prev, newPos]);
  };

  const handleMouseUp = () => {
    if (!isSelecting || selectedPositions.length === 0) {
      setIsSelecting(false);
      return;
    }
    
    setIsSelecting(false);
    
    // Create selection and validate
    const selection = new Selection(selectedPositions);
    
    try {
      const result = selectWord(selection);
      
      if (result.found) {
        setFeedback({ type: 'success', message: `Found: ${result.word.getText()}!` });
        setTimeout(() => setFeedback(null), 2000);
        setRenderKey(k => k + 1); // Force re-render to update found word highlights
      } else {
        setFeedback({ type: 'error', message: 'Not a word in the list' });
        setTimeout(() => setFeedback(null), 1500);
      }
    } catch (err) {
      console.error('Selection error:', err);
      setFeedback({ type: 'error', message: err.message });
      setTimeout(() => setFeedback(null), 1500);
    }
    
    setSelectedPositions([]);
  };

  const isCellSelected = (row, col) => {
    return selectedPositions.some(pos => pos.row === row && pos.col === col);
  };

  // Memoize found word positions to avoid expensive lookups on every render
  const foundWordPositions = useMemo(() => {
    if (!gameSession) return new Set();
    
    const puzzle = gameSession.getPuzzle();
    const posSet = new Set();
    
    puzzle.words.forEach(word => {
      if (word.isFound()) {
        word.getPositions().forEach(pos => {
          posSet.add(`${pos.row},${pos.col}`);
        });
      }
    });
    
    return posSet;
  }, [gameSession, renderKey]); // Re-compute when renderKey changes (word found)

  const isCellInFoundWord = (row, col) => {
    return foundWordPositions.has(`${row},${col}`);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Generating puzzle...</h2>
          <p style={{ color: '#666' }}>Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', color: 'red', marginBottom: '10px' }}>Error</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
          <button
            onClick={() => navigate({ to: '/' })}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!gameSession) {
    return null;
  }

  const puzzle = gameSession.getPuzzle();
  const grid = puzzle.grid;
  const words = puzzle.words;
  const gridSize = grid.getSize();

  return (
    <div 
      style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f0f0f0' }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate({ to: '/' })}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            ← Back
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', color: '#4F46E5', margin: 0 }}>Word Search</h1>
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
              {category} • {difficulty}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            {timeRemaining !== null && (
              <div>
                <div style={{ fontSize: '12px', color: '#666' }}>Time</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: timeRemaining < 30 ? 'red' : '#333' }}>
                  {formattedTime}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feedback message */}
        <div style={{
          minHeight: '60px',
          marginBottom: '20px',
        }}>
          {feedback && (
            <div style={{
              backgroundColor: feedback.type === 'success' ? '#d1fae5' : '#fee2e2',
              color: feedback.type === 'success' ? '#059669' : '#dc2626',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 'bold',
              border: '2px solid',
              borderColor: feedback.type === 'success' ? '#10b981' : '#ef4444',
            }}>
              {feedback.message}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
          {/* Grid */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <div 
              ref={gridRef}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: '4px',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              {Array.from({ length: gridSize }).map((_, row) =>
                Array.from({ length: gridSize }).map((_, col) => {
                  const cell = grid.getCell(row, col);
                  const isSelected = isCellSelected(row, col);
                  const isInFoundWord = isCellInFoundWord(row, col);
                  
                  return (
                    <div
                      key={`${row}-${col}`}
                      onMouseDown={() => handleCellMouseDown(row, col)}
                      onMouseEnter={() => handleCellMouseEnter(row, col)}
                      style={{
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isInFoundWord 
                          ? '#d1fae5' 
                          : isSelected 
                            ? '#ddd6fe' 
                            : '#f9fafb',
                        border: '2px solid',
                        borderColor: isInFoundWord 
                          ? '#10b981' 
                          : isSelected 
                            ? '#7c3aed' 
                            : '#e5e7eb',
                        borderRadius: '4px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {cell ? cell.getLetter() : ''}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Word List */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
              Find these words:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[...words].sort((a, b) => a.getText().localeCompare(b.getText())).map((word, index) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                    backgroundColor: word.isFound() ? '#d1fae5' : '#f9fafb',
                    border: '1px solid',
                    borderColor: word.isFound() ? '#10b981' : '#e5e7eb',
                    borderRadius: '6px',
                    textDecoration: word.isFound() ? 'line-through' : 'none',
                    color: word.isFound() ? '#059669' : '#333',
                    fontWeight: '500',
                  }}
                >
                  {word.getText()}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '6px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Progress</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4F46E5' }}>
                {puzzle.getFoundWordCount()} / {puzzle.getTotalWordCount()}
              </div>
            </div>
          </div>
        </div>

        {/* Game Over Modal */}
        {showGameOver && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
            }}>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#4F46E5', marginBottom: '20px' }}>
                Game Over!
              </h2>
              <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>Your Score</div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#4F46E5' }}>
                  {finalScore}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => navigate({ 
                    to: '/high-scores', 
                    search: { newScore: true, score: finalScore, difficulty: difficulty }
                  })}
                  style={{
                    padding: '14px 24px',
                    backgroundColor: '#4F46E5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  View High Scores
                </button>
                <button
                  onClick={() => navigate({ to: '/' })}
                  style={{
                    padding: '14px 24px',
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
