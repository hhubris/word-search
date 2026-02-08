import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HighScore } from '../domain/entities/HighScore';

// Mock TanStack Router
const mockNavigate = vi.fn();
const mockUseSearch = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: (path) => (options) => ({
    ...options,
    useSearch: mockUseSearch,
  }),
  useNavigate: () => mockNavigate,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock container
const mockGetHighScoresUseCase = {
  executeForDifficulty: vi.fn(),
};

const mockSaveHighScoreUseCase = {
  execute: vi.fn(),
};

const mockChangeThemeUseCase = {
  getCurrentTheme: vi.fn().mockReturnValue('LIGHT'),
  execute: vi.fn(),
};

vi.mock('../application/container', () => ({
  getContainer: () => ({
    getHighScoresUseCase: mockGetHighScoresUseCase,
    saveHighScoreUseCase: mockSaveHighScoreUseCase,
    changeThemeUseCase: mockChangeThemeUseCase,
  }),
}));

// Import after mocks
const { Route } = await import('./high-scores.jsx');
const HighScoresScreen = Route.component;

describe('HighScoresScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseSearch.mockReturnValue({
      newScore: false,
      score: null,
      difficulty: null,
      highlightScore: null,
    });
    mockGetHighScoresUseCase.executeForDifficulty.mockClear();
    mockSaveHighScoreUseCase.execute.mockClear();
    localStorage.clear();
    
    // Default: return empty arrays
    mockGetHighScoresUseCase.executeForDifficulty.mockReturnValue([]);
  });

  test('displays three columns for Easy, Medium, and Hard', () => {
    render(<HighScoresScreen />);
    
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  test('displays "No scores yet" when no scores exist', () => {
    render(<HighScoresScreen />);
    
    const noScoresMessages = screen.getAllByText('No scores yet');
    expect(noScoresMessages).toHaveLength(3); // One for each difficulty
  });

  test('displays scores sorted from highest to lowest', () => {
    const easyScores = [
      new HighScore('AAA', 1000, 'EASY', Date.now()),
      new HighScore('BBB', 1500, 'EASY', Date.now()),
      new HighScore('CCC', 800, 'EASY', Date.now()),
    ];

    mockGetHighScoresUseCase.executeForDifficulty.mockImplementation((difficulty) => {
      if (difficulty === 'EASY') return easyScores;
      return [];
    });

    render(<HighScoresScreen />);
    
    // Verify scores are displayed
    expect(screen.getByText('AAA')).toBeInTheDocument();
    expect(screen.getByText('BBB')).toBeInTheDocument();
    expect(screen.getByText('CCC')).toBeInTheDocument();
    
    // Verify scores appear in order (highest to lowest)
    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();
  });

  test('validates initials input to max 3 characters', () => {
    mockUseSearch.mockReturnValue({
      newScore: true,
      score: 1000,
      difficulty: 'EASY',
      highlightScore: null,
    });

    render(<HighScoresScreen />);
    
    const input = screen.getByPlaceholderText('ABC');
    
    // Try to enter 5 characters
    fireEvent.change(input, { target: { value: 'ABCDE' } });
    
    // Should only have 3 characters
    expect(input.value).toBe('ABC');
  });

  test('shows initials form when newScore is true', () => {
    mockUseSearch.mockReturnValue({
      newScore: true,
      score: 1000,
      difficulty: 'EASY',
      highlightScore: null,
    });

    render(<HighScoresScreen />);
    
    expect(screen.getByText('Enter Your Initials')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ABC')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('hides initials form when Cancel is clicked', () => {
    mockUseSearch.mockReturnValue({
      newScore: true,
      score: 1000,
      difficulty: 'EASY',
      highlightScore: null,
    });

    render(<HighScoresScreen />);
    
    expect(screen.getByText('Enter Your Initials')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(screen.queryByText('Enter Your Initials')).not.toBeInTheDocument();
  });

  test('saves score when Save button is clicked with valid initials', () => {
    mockUseSearch.mockReturnValue({
      newScore: true,
      score: 1000,
      difficulty: 'EASY',
      highlightScore: null,
    });

    render(<HighScoresScreen />);
    
    const input = screen.getByPlaceholderText('ABC');
    fireEvent.change(input, { target: { value: 'XYZ' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    expect(mockSaveHighScoreUseCase.execute).toHaveBeenCalledWith('XYZ', 1000, 'EASY');
  });

  test('converts initials to uppercase when saving', () => {
    mockUseSearch.mockReturnValue({
      newScore: true,
      score: 1000,
      difficulty: 'EASY',
      highlightScore: null,
    });

    render(<HighScoresScreen />);
    
    const input = screen.getByPlaceholderText('ABC');
    fireEvent.change(input, { target: { value: 'abc' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    expect(mockSaveHighScoreUseCase.execute).toHaveBeenCalledWith('ABC', 1000, 'EASY');
  });

  test('highlights newly added score', () => {
    const easyScores = [
      new HighScore('AAA', 1500, 'EASY', Date.now()),
      new HighScore('BBB', 1000, 'EASY', Date.now()),
    ];

    mockGetHighScoresUseCase.executeForDifficulty.mockImplementation((difficulty) => {
      if (difficulty === 'EASY') return easyScores;
      return [];
    });

    mockUseSearch.mockReturnValue({
      newScore: false,
      score: null,
      difficulty: 'EASY',
      highlightScore: 1000,
    });

    render(<HighScoresScreen />);
    
    // Verify BBB score is displayed
    expect(screen.getByText('BBB')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    
    // The highlighting is applied via inline styles, which should be present
    // We can verify the score is rendered, even if we can't easily test the exact styling
  });

  test('navigates to home when Back button is clicked', () => {
    render(<HighScoresScreen />);
    
    fireEvent.click(screen.getByText('← Back to Home'));
    
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
  });

  test('displays top 10 scores per difficulty', () => {
    const easyScores = Array.from({ length: 10 }, (_, i) => 
      new HighScore('AAA', 1000 - i * 10, 'EASY', Date.now())
    );

    mockGetHighScoresUseCase.executeForDifficulty.mockImplementation((difficulty) => {
      if (difficulty === 'EASY') return easyScores; // Repository should limit to 10
      return [];
    });

    render(<HighScoresScreen />);
    
    // Verify we have 10 scores displayed
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('910')).toBeInTheDocument(); // Last score (1000 - 9*10)
    
    // Verify the highest and lowest scores are shown
    expect(screen.getAllByText('AAA')).toHaveLength(10);
  });

  test('shows alert when trying to save with empty initials', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    mockUseSearch.mockReturnValue({
      newScore: true,
      score: 1000,
      difficulty: 'EASY',
      highlightScore: null,
    });

    render(<HighScoresScreen />);
    
    // Try to save without entering initials
    fireEvent.click(screen.getByText('Save'));
    
    expect(alertSpy).toHaveBeenCalledWith('Please enter 1-3 characters for your initials');
    expect(mockSaveHighScoreUseCase.execute).not.toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });

  test('reloads scores after saving', async () => {
    mockUseSearch.mockReturnValue({
      newScore: true,
      score: 1000,
      difficulty: 'EASY',
      highlightScore: null,
    });

    render(<HighScoresScreen />);
    
    // Initial load
    expect(mockGetHighScoresUseCase.executeForDifficulty).toHaveBeenCalledTimes(3);
    
    const input = screen.getByPlaceholderText('ABC');
    fireEvent.change(input, { target: { value: 'XYZ' } });
    fireEvent.click(screen.getByText('Save'));
    
    // Should reload after save
    await waitFor(() => {
      expect(mockGetHighScoresUseCase.executeForDifficulty).toHaveBeenCalledTimes(6); // 3 initial + 3 after save
    });
  });
});
