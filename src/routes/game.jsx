import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useGameSession } from '../application/hooks/useGameSession';
import { useTimer } from '../application/hooks/useTimer';
import { Selection } from '../domain/value-objects/Selection';
import { getContainer } from '../application/container';
import { ThemeSwitcher } from '../components/ui/ThemeSwitcher';
import { PuzzleGrid } from '../components/game/PuzzleGrid';
import { WordList } from '../components/game/WordList';
import { Timer } from '../components/game/Timer';

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
  
  // Game state
  const [feedback, setFeedback] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [initials, setInitials] = useState('');
  const [foundWords, setFoundWords] = useState([]);

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
      
      // Initialize found words
      updateFoundWords(session);
    });
  }, [category, difficulty]);

  // Check for puzzle completion
  useEffect(() => {
    if (isPuzzleComplete && gameSession && !gameSession.isEnded()) {
      handleGameEnd();
    }
  }, [isPuzzleComplete]);

  // Update found words when game session changes
  useEffect(() => {
    if (gameSession) {
      updateFoundWords(gameSession);
    }
  }, [gameSession]);

  const updateFoundWords = (session) => {
    const puzzle = session.getPuzzle();
    const found = puzzle.words.filter(word => word.isFound());
    setFoundWords(found);
  };

  const handleGameEnd = () => {
    if (!gameSession || gameSession.isEnded()) return;
    
    stopTimer();
    const result = endGame();
    
    setFinalScore(result.score);
    setShowGameOver(true);
  };

  const handleSaveAndNavigate = () => {
    if (!initials || initials.length === 0) return;
    
    try {
      const container = getContainer();
      const { saveHighScoreUseCase } = container;
      saveHighScoreUseCase.execute(initials, finalScore, difficulty);
      
      // Navigate to high scores with the saved score highlighted
      navigate({ 
        to: '/high-scores', 
        search: { highlightScore: finalScore, difficulty: difficulty }
      });
    } catch (err) {
      console.error('Error saving score:', err);
      alert('Error saving score: ' + err.message);
    }
  };

  // Handle selection from PuzzleGrid component
  const handleSelectionComplete = (selectedCells) => {
    if (!gameSession || gameSession.isEnded() || timeRemaining === 0) return;
    
    // Create selection and validate
    const selection = new Selection(selectedCells);
    
    try {
      const result = selectWord(selection);
      
      if (result.found) {
        setFeedback({ type: 'success', message: `Found: ${result.word.getText()}!` });
        setTimeout(() => setFeedback(null), 2000);
        
        // Update found words
        updateFoundWords(gameSession);
      } else {
        setFeedback({ type: 'error', message: 'Not a word in the list' });
        setTimeout(() => setFeedback(null), 1500);
      }
    } catch (err) {
      console.error('Selection error:', err);
      setFeedback({ type: 'error', message: err.message });
      setTimeout(() => setFeedback(null), 1500);
    }
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
  const foundWordIds = foundWords.map(w => w.id);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        {/* Theme Switcher in top right */}
        <div style={{ position: 'absolute', top: '0', right: '0', zIndex: 10 }}>
          <ThemeSwitcher />
        </div>
        
        {/* Header */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => navigate({ to: '/' })}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            ← Back
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', color: 'var(--accent-color)', margin: 0 }}>Word Search</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>
              {category} • {difficulty}
            </p>
          </div>

          <Timer timeRemaining={timeRemaining} formattedTime={formattedTime} />
        </div>

        {/* Feedback message */}
        <div style={{ minHeight: '60px', marginBottom: '20px' }}>
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
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <PuzzleGrid 
              grid={grid} 
              foundWords={foundWords}
              onSelectionComplete={handleSelectionComplete}
            />
          </div>

          {/* Word List */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <WordList words={words} foundWordIds={foundWordIds} />
            
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '5px' }}>Progress</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-color)' }}>
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
              backgroundColor: 'var(--bg-secondary)',
              padding: '40px',
              borderRadius: '12px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              border: '2px solid var(--border-color)',
            }}>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '20px' }}>
                Game Over!
              </h2>
              <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '10px' }}>Your Score</div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '20px' }}>
                  {finalScore}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '15px' }}>
                  Enter Your Initials
                </div>
                <input
                  type="text"
                  value={initials}
                  onChange={(e) => setInitials(e.target.value.slice(0, 3).toUpperCase())}
                  placeholder="ABC"
                  maxLength={3}
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && initials.length > 0) {
                      handleSaveAndNavigate();
                    }
                  }}
                  style={{
                    padding: '12px 20px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    border: '2px solid var(--accent-color)',
                    borderRadius: '6px',
                    width: '120px',
                    marginBottom: '20px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={handleSaveAndNavigate}
                  disabled={initials.length === 0}
                  style={{
                    padding: '14px 24px',
                    backgroundColor: initials.length === 0 ? '#ccc' : 'var(--accent-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: initials.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Save & View High Scores
                </button>
                <button
                  onClick={() => navigate({ to: '/' })}
                  style={{
                    padding: '14px 24px',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Skip & Go Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
