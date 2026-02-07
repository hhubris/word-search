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
            ← Back to Home
          </button>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-color)', margin: 0 }}>High Scores</h1>
          <div style={{ width: '120px' }}></div>
        </div>

        {/* Initials Form */}
        {showInitialsForm && (
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text-primary)' }}>
              Enter Your Initials
            </h2>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
              <input
                type="text"
                value={initials}
                onChange={(e) => setInitials(e.target.value.slice(0, 3))}
                placeholder="ABC"
                maxLength={3}
                style={{
                  padding: '12px 20px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  border: '2px solid var(--border-color)',
                  borderRadius: '6px',
                  width: '120px',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                onClick={handleSaveScore}
                style={{
                  padding: '12px 30px',
                  backgroundColor: 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                Save
              </button>
              <button
                onClick={() => setShowInitialsForm(false)}
                style={{
                  padding: '12px 30px',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* High Scores Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {/* Easy */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '15px', textAlign: 'center' }}>
              Easy
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {highScores.EASY.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No scores yet</p>
              ) : (
                highScores.EASY.map((score, index) => {
                  const isHighlighted = highlightScore && difficulty === 'EASY' && score.getScore() === highlightScore;
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: isHighlighted ? '#ddd6fe' : index === 0 ? '#fef3c7' : 'var(--bg-tertiary)',
                        border: isHighlighted ? '3px solid #7c3aed' : '1px solid',
                        borderColor: isHighlighted ? '#7c3aed' : index === 0 ? '#f59e0b' : 'var(--border-color)',
                        borderRadius: '6px',
                        transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>#{index + 1}</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{score.getInitials()}</span>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>{score.getScore()}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Medium */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '15px', textAlign: 'center' }}>
              Medium
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {highScores.MEDIUM.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No scores yet</p>
              ) : (
                highScores.MEDIUM.map((score, index) => {
                  const isHighlighted = highlightScore && difficulty === 'MEDIUM' && score.getScore() === highlightScore;
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: isHighlighted ? '#ddd6fe' : index === 0 ? '#fef3c7' : 'var(--bg-tertiary)',
                        border: isHighlighted ? '3px solid #7c3aed' : '1px solid',
                        borderColor: isHighlighted ? '#7c3aed' : index === 0 ? '#f59e0b' : 'var(--border-color)',
                        borderRadius: '6px',
                        transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>#{index + 1}</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{score.getInitials()}</span>
                      <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{score.getScore()}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Hard */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '15px', textAlign: 'center' }}>
              Hard
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {highScores.HARD.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No scores yet</p>
              ) : (
                highScores.HARD.map((score, index) => {
                  const isHighlighted = highlightScore && difficulty === 'HARD' && score.getScore() === highlightScore;
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: isHighlighted ? '#ddd6fe' : index === 0 ? '#fef3c7' : 'var(--bg-tertiary)',
                        border: isHighlighted ? '3px solid #7c3aed' : '1px solid',
                        borderColor: isHighlighted ? '#7c3aed' : index === 0 ? '#f59e0b' : 'var(--border-color)',
                        borderRadius: '6px',
                        transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>#{index + 1}</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{score.getInitials()}</span>
                      <span style={{ fontWeight: 'bold', color: '#dc2626' }}>{score.getScore()}</span>
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
