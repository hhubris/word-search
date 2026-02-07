import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getContainer } from '../application/container';

export const Route = createFileRoute('/high-scores')({
  component: HighScoresScreen,
  validateSearch: (search) => {
    return {
      newScore: search.newScore === true,
      score: search.score || null,
      difficulty: search.difficulty || null,
    };
  },
});

function HighScoresScreen() {
  const navigate = useNavigate();
  const { newScore, score, difficulty } = Route.useSearch();
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
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f0f0f0' }}>
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
            ← Back to Home
          </button>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#4F46E5', margin: 0 }}>High Scores</h1>
          <div style={{ width: '120px' }}></div>
        </div>

        {/* Initials Form */}
        {showInitialsForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
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
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  width: '120px',
                }}
              />
              <button
                onClick={handleSaveScore}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#4F46E5',
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
                  backgroundColor: '#f0f0f0',
                  color: '#666',
                  border: '1px solid #ddd',
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
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '15px', textAlign: 'center' }}>
              Easy
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {highScores.EASY.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No scores yet</p>
              ) : (
                highScores.EASY.map((score, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: index === 0 ? '#fef3c7' : '#f9fafb',
                      border: '1px solid',
                      borderColor: index === 0 ? '#f59e0b' : '#e5e7eb',
                      borderRadius: '6px',
                    }}
                  >
                    <span style={{ fontWeight: 'bold', color: '#666' }}>#{index + 1}</span>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>{score.getInitials()}</span>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>{score.getScore()}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Medium */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '15px', textAlign: 'center' }}>
              Medium
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {highScores.MEDIUM.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No scores yet</p>
              ) : (
                highScores.MEDIUM.map((score, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: index === 0 ? '#fef3c7' : '#f9fafb',
                      border: '1px solid',
                      borderColor: index === 0 ? '#f59e0b' : '#e5e7eb',
                      borderRadius: '6px',
                    }}
                  >
                    <span style={{ fontWeight: 'bold', color: '#666' }}>#{index + 1}</span>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>{score.getInitials()}</span>
                    <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{score.getScore()}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Hard */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '15px', textAlign: 'center' }}>
              Hard
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {highScores.HARD.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No scores yet</p>
              ) : (
                highScores.HARD.map((score, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: index === 0 ? '#fef3c7' : '#f9fafb',
                      border: '1px solid',
                      borderColor: index === 0 ? '#f59e0b' : '#e5e7eb',
                      borderRadius: '6px',
                    }}
                  >
                    <span style={{ fontWeight: 'bold', color: '#666' }}>#{index + 1}</span>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>{score.getInitials()}</span>
                    <span style={{ fontWeight: 'bold', color: '#dc2626' }}>{score.getScore()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
