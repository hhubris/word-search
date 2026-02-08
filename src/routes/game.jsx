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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-2.5">Generating puzzle...</h2>
          <p className="text-secondary">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-error mb-2.5">Error</h2>
          <p className="text-secondary mb-5">{error}</p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-5 py-2.5 bg-accent text-white border-none rounded-md cursor-pointer"
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
    <div className="min-h-screen bg-primary p-5">
      <div className="max-w-[1200px] mx-auto relative">
        {/* Theme Switcher in top right */}
        <div className="absolute top-0 right-0 z-10">
          <ThemeSwitcher />
        </div>
        
        {/* Header */}
        <div className="bg-secondary p-5 rounded-lg mb-5 flex justify-between items-center border border-border">
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-5 py-2.5 bg-tertiary border border-border rounded-md cursor-pointer text-primary"
          >
            ← Back
          </button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl text-accent m-0">Word Search</h1>
            <p className="text-sm text-secondary mt-1 mb-0">
              {category} • {difficulty}
            </p>
          </div>

          <div className="min-w-[120px]">
            <Timer timeRemaining={timeRemaining} formattedTime={formattedTime} />
          </div>
        </div>

        {/* Feedback message */}
        <div className="min-h-[60px] mb-5">
          {feedback && (
            <div className={`p-4 rounded-lg text-center font-bold border-2 ${
              feedback.type === 'success' 
                ? 'bg-success-light text-success border-success' 
                : 'bg-error-light text-error border-error'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-5">
          {/* Grid */}
          <div className="bg-secondary p-5 rounded-lg border border-border">
            <PuzzleGrid 
              grid={grid} 
              foundWords={foundWords}
              onSelectionComplete={handleSelectionComplete}
            />
          </div>

          {/* Word List */}
          <div className="bg-secondary p-5 rounded-lg border border-border">
            <WordList words={words} foundWordIds={foundWordIds} />
            
            <div className="mt-5 p-4 bg-tertiary rounded-md border border-border">
              <div className="text-sm text-secondary mb-1">Progress</div>
              <div className="text-2xl font-bold text-accent">
                {puzzle.getFoundWordCount()} / {puzzle.getTotalWordCount()}
              </div>
            </div>
          </div>
        </div>

        {/* Game Over Modal */}
        {showGameOver && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]">
            <div className="bg-secondary p-10 rounded-xl max-w-[400px] w-[90%] text-center border-2 border-border">
              <h2 className="text-[32px] font-bold text-accent mb-5">
                Game Over!
              </h2>
              <div className="mb-8">
                <div className="text-base text-secondary mb-2.5">Your Score</div>
                <div className="text-5xl font-bold text-accent mb-5">
                  {finalScore}
                </div>
                <div className="text-lg font-bold text-primary mb-4">
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
                  className="px-5 py-3 text-2xl font-bold text-center uppercase border-2 border-accent rounded-md w-[120px] mb-5 bg-secondary text-primary"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleSaveAndNavigate}
                  disabled={initials.length === 0}
                  className={`px-6 py-3.5 text-base font-bold rounded-md ${
                    initials.length === 0 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-accent cursor-pointer'
                  } text-white border-none`}
                >
                  Save & View High Scores
                </button>
                <button
                  onClick={() => navigate({ to: '/' })}
                  className="px-6 py-3.5 bg-tertiary text-primary border border-border rounded-md text-base font-semibold cursor-pointer"
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
