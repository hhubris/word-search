import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getContainer } from '../application/container';
import { ThemeSwitcher } from '../components/ui/ThemeSwitcher';

export const Route = createFileRoute('/high-scores')({
  component: HighScoresScreen,
  validateSearch: (search) => {
    return {
      newScore: search.newScore === true,
      score: search.score || null,
      difficulty: search.difficulty || null,
      highlightScore: search.highlightScore || null,
    };
  },
});

function HighScoresScreen() {
  const navigate = useNavigate();
  const { newScore, score, difficulty, highlightScore } = Route.useSearch();
  const [highScores, setHighScores] = useState({ EASY: [], MEDIUM: [], HARD: [] });
  const [initials, setInitials] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [showInitialsForm, setShowInitialsForm] = useState(newScore && score && difficulty);

  const container = getContainer();
  const { getHighScoresUseCase, saveHighScoreUseCase } = container;

  useEffect(() => {
    loadHighScores();
  }, []);

  useEffect(() => {
    // Auto-show form if coming from game with new score
    if (newScore && score && difficulty) {
      setShowInitialsForm(true);
      setSelectedDifficulty(difficulty);
    }
  }, [newScore, score, difficulty]);

  const loadHighScores = () => {
    const easy = getHighScoresUseCase.executeForDifficulty('EASY');
    const medium = getHighScoresUseCase.executeForDifficulty('MEDIUM');
    const hard = getHighScoresUseCase.executeForDifficulty('HARD');
    
    setHighScores({
      EASY: easy || [],
      MEDIUM: medium || [],
      HARD: hard || [],
    });
  };

  const handleSaveScore = () => {
    if (!initials || initials.length === 0 || initials.length > 3) {
      alert('Please enter 1-3 characters for your initials');
      return;
    }

    try {
      saveHighScoreUseCase.execute(initials.toUpperCase(), score, selectedDifficulty);
      setShowInitialsForm(false);
      loadHighScores();
    } catch (err) {
      alert('Error saving score: ' + err.message);
    }
  };

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
            ← Back to Home
          </button>
          <h1 className="text-[32px] font-bold text-accent m-0">High Scores</h1>
          <div className="w-[120px]"></div>
        </div>

        {/* Initials Form */}
        {showInitialsForm && (
          <div className="bg-secondary p-8 rounded-lg mb-5 text-center border border-border">
            <h2 className="text-2xl font-bold mb-5 text-primary">
              Enter Your Initials
            </h2>
            <div className="flex gap-2.5 justify-center items-center">
              <input
                type="text"
                value={initials}
                onChange={(e) => setInitials(e.target.value.slice(0, 3))}
                placeholder="ABC"
                maxLength={3}
                className="px-5 py-3 text-xl font-bold text-center uppercase border-2 border-border rounded-md w-[120px] bg-tertiary text-primary"
              />
              <button
                onClick={handleSaveScore}
                className="px-8 py-3 bg-accent text-white border-none rounded-md cursor-pointer font-bold text-base"
              >
                Save
              </button>
              <button
                onClick={() => setShowInitialsForm(false)}
                className="px-8 py-3 bg-tertiary text-secondary border border-border rounded-md cursor-pointer font-bold text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* High Scores Grid */}
        <div className="grid grid-cols-3 gap-5">
          {/* Easy */}
          <div className="bg-secondary p-5 rounded-lg border border-border">
            <h2 className="text-2xl font-bold text-difficulty-easy mb-4 text-center">
              Easy
            </h2>
            <div className="flex flex-col gap-2">
              {highScores.EASY.length === 0 ? (
                <p className="text-center text-secondary p-5">No scores yet</p>
              ) : (
                highScores.EASY.map((score, index) => {
                  const isHighlighted = highlightScore && difficulty === 'EASY' && score.getScore() === highlightScore;
                  return (
                    <div
                      key={index}
                      className={`flex justify-between px-3 py-3 rounded-md transition-all duration-300 ${
                        isHighlighted 
                          ? 'bg-highlight-bg border-[3px] border-highlight scale-105' 
                          : index === 0 
                            ? 'bg-warning-light border border-warning' 
                            : 'bg-tertiary border border-border'
                      }`}
                    >
                      <span className="font-bold text-secondary">#{index + 1}</span>
                      <span className="font-bold text-primary">{score.getInitials()}</span>
                      <span className="font-bold text-difficulty-easy">{score.getScore()}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Medium */}
          <div className="bg-secondary p-5 rounded-lg border border-border">
            <h2 className="text-2xl font-bold text-difficulty-medium mb-4 text-center">
              Medium
            </h2>
            <div className="flex flex-col gap-2">
              {highScores.MEDIUM.length === 0 ? (
                <p className="text-center text-secondary p-5">No scores yet</p>
              ) : (
                highScores.MEDIUM.map((score, index) => {
                  const isHighlighted = highlightScore && difficulty === 'MEDIUM' && score.getScore() === highlightScore;
                  return (
                    <div
                      key={index}
                      className={`flex justify-between px-3 py-3 rounded-md transition-all duration-300 ${
                        isHighlighted 
                          ? 'bg-highlight-bg border-[3px] border-highlight scale-105' 
                          : index === 0 
                            ? 'bg-warning-light border border-warning' 
                            : 'bg-tertiary border border-border'
                      }`}
                    >
                      <span className="font-bold text-secondary">#{index + 1}</span>
                      <span className="font-bold text-primary">{score.getInitials()}</span>
                      <span className="font-bold text-difficulty-medium">{score.getScore()}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Hard */}
          <div className="bg-secondary p-5 rounded-lg border border-border">
            <h2 className="text-2xl font-bold text-difficulty-hard mb-4 text-center">
              Hard
            </h2>
            <div className="flex flex-col gap-2">
              {highScores.HARD.length === 0 ? (
                <p className="text-center text-secondary p-5">No scores yet</p>
              ) : (
                highScores.HARD.map((score, index) => {
                  const isHighlighted = highlightScore && difficulty === 'HARD' && score.getScore() === highlightScore;
                  return (
                    <div
                      key={index}
                      className={`flex justify-between px-3 py-3 rounded-md transition-all duration-300 ${
                        isHighlighted 
                          ? 'bg-highlight-bg border-[3px] border-highlight scale-105' 
                          : index === 0 
                            ? 'bg-warning-light border border-warning' 
                            : 'bg-tertiary border border-border'
                      }`}
                    >
                      <span className="font-bold text-secondary">#{index + 1}</span>
                      <span className="font-bold text-primary">{score.getInitials()}</span>
                      <span className="font-bold text-difficulty-hard">{score.getScore()}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
