# Design Document: Word Search Game

## Overview

This document describes the technical design for a browser-based word search game built with React 19, following Clean Architecture principles. The application provides an interactive puzzle-solving experience with multiple categories, difficulty levels, high score tracking, and theme customization.

### Architecture Philosophy

The design follows Clean Architecture with clear separation between:
- **Domain Layer**: Core business logic and entities (puzzle generation, game rules, scoring)
- **Application Layer**: Use cases and application services (game flow, high score management)
- **Infrastructure Layer**: External concerns (browser storage, routing, UI components)
- **Presentation Layer**: React components and UI logic

This separation ensures testability, maintainability, and independence from frameworks and external dependencies.

### Technology Stack

- **React 19**: UI framework with modern hooks and concurrent features
- **Vite**: Fast build tool and development server
- **TanStack Router**: Type-safe routing solution
- **TanStack Query**: Data fetching and state management
- **Tailwind CSS v4**: Utility-first CSS framework for component styling
- **JavaScript**: Implementation language (no TypeScript)

## Architecture

### Layer Structure

```
src/
├── domain/              # Domain Layer (Pure business logic)
│   ├── entities/        # Core domain objects
│   ├── value-objects/   # Immutable value types
│   └── services/        # Domain services
├── application/         # Application Layer (Use cases)
│   ├── use-cases/       # Application use cases
│   └── ports/           # Interface definitions
├── infrastructure/      # Infrastructure Layer (External concerns)
│   ├── storage/         # Browser storage adapters
│   ├── repositories/    # Data access implementations
│   └── word-data/       # Static word lists
└── presentation/        # Presentation Layer (UI)
    ├── components/      # React components
    ├── hooks/           # Custom React hooks
    ├── routes/          # Route definitions
    └── styles/          # Style constants and theme definitions
```

### Dependency Flow

Dependencies flow inward: Presentation → Application → Domain. The domain layer has no dependencies on outer layers. Infrastructure implements interfaces (ports) defined in the application layer.

## Components and Interfaces

### Domain Layer

#### Entities

**Grid Entity**
```javascript
class Grid {
  constructor(size, cells) {
    this.size = size;           // number (e.g., 20 for 20x20)
    this.cells = cells;         // 2D array of Cell objects
  }
  
  getCell(row, col) { }
  setCell(row, col, cell) { }
  isValidPosition(row, col) { }
}

class Cell {
  constructor(letter, isPartOfWord = false) {
    this.letter = letter;       // string (single character)
    this.isPartOfWord = isPartOfWord;  // boolean
    this.wordIds = [];          // array of word IDs this cell belongs to
  }
}
```

**Word Entity**
```javascript
class Word {
  constructor(id, text, startPos, direction) {
    this.id = id;               // string (unique identifier)
    this.text = text;           // string (the word)
    this.startPos = startPos;   // Position {row, col}
    this.direction = direction; // Direction enum
    this.found = false;         // boolean
  }
  
  getPositions() { }            // Returns array of all cell positions
  markFound() { }
}
```

**Puzzle Entity**
```javascript
class Puzzle {
  constructor(grid, words, category, difficulty) {
    this.grid = grid;           // Grid entity
    this.words = words;         // array of Word entities
    this.category = category;   // string
    this.difficulty = difficulty; // Difficulty enum
    this.foundWords = new Set(); // Set of found word IDs
  }
  
  markWordFound(wordId) { }
  isComplete() { }              // Returns true if all words found
  getFoundWordCount() { }
  getRemainingWords() { }
}
```

**GameSession Entity**
```javascript
class GameSession {
  constructor(puzzle, difficulty, startTime) {
    this.puzzle = puzzle;       // Puzzle entity
    this.difficulty = difficulty; // Difficulty enum
    this.startTime = startTime; // timestamp
    this.endTime = null;        // timestamp or null
    this.score = null;          // number or null
    this.timerDuration = this.getTimerDuration(); // seconds or null
  }
  
  getTimerDuration() { }        // Returns timer duration based on difficulty
  getRemainingTime(currentTime) { }
  isTimeExpired(currentTime) { }
  calculateScore(endTime) { }
  endGame(endTime) { }
}
```

**HighScore Entity**
```javascript
class HighScore {
  constructor(initials, score, difficulty, timestamp) {
    this.initials = initials;   // string (max 3 chars)
    this.score = score;         // number
    this.difficulty = difficulty; // Difficulty enum
    this.timestamp = timestamp; // timestamp
  }
}
```

#### Value Objects

**Position**
```javascript
class Position {
  constructor(row, col) {
    this.row = row;             // number
    this.col = col;             // number
  }
  
  equals(other) { }
  add(direction) { }            // Returns new Position
}
```

**Direction**
```javascript
const Direction = {
  RIGHT: { row: 0, col: 1 },
  LEFT: { row: 0, col: -1 },
  DOWN: { row: 1, col: 0 },
  UP: { row: -1, col: 0 },
  DOWN_RIGHT: { row: 1, col: 1 },
  DOWN_LEFT: { row: 1, col: -1 },
  UP_RIGHT: { row: -1, col: 1 },
  UP_LEFT: { row: -1, col: -1 }
};

function getDirectionsForDifficulty(difficulty) {
  // Returns allowed directions based on difficulty
}
```

**Difficulty Enum**
```javascript
const Difficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

const DifficultyConfig = {
  EASY: { wordCount: 8, timerSeconds: 720, directions: ['RIGHT', 'DOWN'] },
  MEDIUM: { wordCount: 12, timerSeconds: 300, directions: ['RIGHT', 'DOWN', 'DOWN_RIGHT', 'DOWN_LEFT'] },
  HARD: { wordCount: 16, timerSeconds: 180, directions: Object.keys(Direction) }
};
```

**Category Enum**
```javascript
const Category = {
  ANIMALS: 'Animals',
  SPORTS: 'Sports',
  SCIENCE: 'Science',
  FOOD: 'Food',
  GEOGRAPHY: 'Geography',
  TECHNOLOGY: 'Technology',
  MUSIC: 'Music',
  MOVIES: 'Movies'
};
```

**Selection**
```javascript
class Selection {
  constructor(startPos, endPos) {
    this.startPos = startPos;   // Position
    this.endPos = endPos;       // Position
  }
  
  getDirection() { }            // Returns Direction or null
  getPositions() { }            // Returns array of Positions
  getText(grid) { }             // Extracts text from grid
}
```

#### Domain Services

**PuzzleGeneratorService**
**PuzzleGeneratorService**
```javascript
class PuzzleGeneratorService {
  generatePuzzle(category, difficulty, wordRepository) {
    // Wrapper around @blex41/word-search library
    // 1. Get word list for category
    // 2. Select required number of words based on difficulty
    // 3. Configure library with direction constraints
    // 4. Calculate appropriate grid size (max 20x20)
    // 5. Generate puzzle using library
    // 6. Convert library output to domain entities
    // Returns Puzzle entity
  }
  
  selectRandomWords(words, count) { }
  calculateGridSize(words) { }
  getDisabledDirections(difficulty) { }
  convertToPuzzle(ws, category, difficulty) { }
  determineDirection(start, end) { }
}
```
**Note:** Puzzle generation uses the `@blex41/word-search` library. See Decision Record 005.

**ScoringService**
```javascript
class ScoringService {
  calculateScore(gameSession) {
    // Base score: words found * 100
    // Time bonus: remaining time * 10 (if timed)
    // Difficulty multiplier: Easy 1x, Medium 1.5x, Hard 2x
    // Returns number
  }
}
```

**WordSelectionService**
```javascript
class WordSelectionService {
  validateSelection(selection, puzzle) {
    // Check if selection matches any word in puzzle
    // Returns Word entity or null
  }
  
  determineDirection(startPos, currentPos) {
    // Returns Direction or null
  }
  
  restrictToDirection(startPos, direction, currentPos) {
    // Returns valid Position along direction or null
  }
}
```

### Application Layer

#### Use Cases

**StartGameUseCase**
```javascript
class StartGameUseCase {
  constructor(puzzleGenerator, wordRepository) {
    this.puzzleGenerator = puzzleGenerator;
    this.wordRepository = wordRepository;
  }
  
  execute(category, difficulty) {
    // 1. Generate puzzle
    // 2. Create game session
    // 3. Return game session
  }
}
```

**SelectWordUseCase**
```javascript
class SelectWordUseCase {
  constructor(wordSelectionService) {
    this.wordSelectionService = wordSelectionService;
  }
  
  execute(selection, gameSession) {
    // 1. Validate selection against puzzle
    // 2. If valid, mark word as found
    // 3. Check if puzzle is complete
    // 4. Return result { found: boolean, word: Word|null, isComplete: boolean }
  }
}
```

**EndGameUseCase**
```javascript
class EndGameUseCase {
  constructor(scoringService, highScoreRepository) {
    this.scoringService = scoringService;
    this.highScoreRepository = highScoreRepository;
  }
  
  execute(gameSession, endTime) {
    // 1. End game session
    // 2. Calculate score
    // 3. Check if score qualifies for high scores
    // 4. Return result { score: number, isHighScore: boolean, rank: number|null }
  }
}
```

**SaveHighScoreUseCase**
```javascript
class SaveHighScoreUseCase {
  constructor(highScoreRepository) {
    this.highScoreRepository = highScoreRepository;
  }
  
  execute(initials, score, difficulty) {
    // 1. Create HighScore entity
    // 2. Save to repository
    // 3. Return updated high scores list
  }
}
```

**GetHighScoresUseCase**
```javascript
class GetHighScoresUseCase {
  constructor(highScoreRepository) {
    this.highScoreRepository = highScoreRepository;
  }
  
  execute() {
    // Returns high scores grouped by difficulty
  }
}
```

**ChangeThemeUseCase**
```javascript
class ChangeThemeUseCase {
  constructor(themeRepository) {
    this.themeRepository = themeRepository;
  }
  
  execute(theme) {
    // 1. Validate theme
    // 2. Save to repository
    // 3. Apply theme to document
  }
}
```

#### Ports (Interfaces)

**IWordRepository**
```javascript
// Interface for accessing word data
{
  getWordsByCategory(category) { }  // Returns array of strings
  getAllCategories() { }            // Returns array of Category
}
```

**IHighScoreRepository**
```javascript
// Interface for high score persistence
{
  getHighScores(difficulty) { }     // Returns array of HighScore
  saveHighScore(highScore) { }      // Returns void
  getTopScores(difficulty, limit) { } // Returns array of HighScore
}
```

**IThemeRepository**
```javascript
// Interface for theme persistence
{
  getTheme() { }                    // Returns Theme enum
  saveTheme(theme) { }              // Returns void
}
```

### Infrastructure Layer

#### Storage Adapters

**LocalStorageAdapter**
```javascript
class LocalStorageAdapter {
  get(key) { }
  set(key, value) { }
  remove(key) { }
}
```

#### Repository Implementations

**WordRepositoryImpl**
```javascript
class WordRepositoryImpl {
  constructor() {
    this.wordData = {
      [Category.ANIMALS]: [...],  // 150+ words
      [Category.SPORTS]: [...],
      // ... other categories
    };
  }
  
  getWordsByCategory(category) {
    return this.wordData[category].filter(w => w.length >= 3 && w.length <= 8);
  }
  
  getAllCategories() {
    return Object.values(Category);
  }
}
```

**HighScoreRepositoryImpl**
```javascript
class HighScoreRepositoryImpl {
  constructor(storageAdapter) {
    this.storage = storageAdapter;
    this.storageKey = 'word-search-high-scores';
  }
  
  getHighScores(difficulty) {
    const allScores = this.storage.get(this.storageKey) || {};
    return (allScores[difficulty] || [])
      .map(data => new HighScore(data.initials, data.score, data.difficulty, data.timestamp))
      .sort((a, b) => b.score - a.score);
  }
  
  saveHighScore(highScore) {
    const allScores = this.storage.get(this.storageKey) || {};
    const difficultyScores = allScores[highScore.difficulty] || [];
    
    difficultyScores.push({
      initials: highScore.initials,
      score: highScore.score,
      difficulty: highScore.difficulty,
      timestamp: highScore.timestamp
    });
    
    // Keep only top 10
    difficultyScores.sort((a, b) => b.score - a.score);
    allScores[highScore.difficulty] = difficultyScores.slice(0, 10);
    
    this.storage.set(this.storageKey, allScores);
  }
  
  getTopScores(difficulty, limit = 10) {
    return this.getHighScores(difficulty).slice(0, limit);
  }
}
```

**ThemeRepositoryImpl**
```javascript
class ThemeRepositoryImpl {
  constructor(storageAdapter) {
    this.storage = storageAdapter;
    this.storageKey = 'word-search-theme';
  }
  
  getTheme() {
    return this.storage.get(this.storageKey) || Theme.SYSTEM;
  }
  
  saveTheme(theme) {
    this.storage.set(this.storageKey, theme);
  }
}
```

### Presentation Layer

#### Route Structure

```javascript
// Using TanStack Router
const routeTree = {
  '/': HomeRoute,
  '/game': GameRoute,
  '/high-scores': HighScoresRoute
};
```

#### Key Components

**HomeScreen**
- Displays theme switcher in top right corner
- Displays application title
- Shows category selection (8 buttons in 2 rows)
- Shows difficulty selection (3 buttons with descriptions)
- Manages Start Game button state
- Handles navigation to game screen

**GameScreen**
- Renders puzzle grid (left side)
- Renders word list (right side, alphabetical)
- Displays timer (if applicable)
- Handles mouse interactions for word selection
- Shows game completion overlay with score
- Handles navigation after game end

**HighScoresScreen**
- Displays three columns (Easy, Medium, Hard)
- Shows top 10 scores per difficulty
- Highlights newly added scores
- Provides input for initials (when qualifying)
- Handles navigation back to home

**PuzzleGrid Component**
- Renders grid cells
- Handles mouse down/move/up events
- Highlights selected cells
- Shows found words with circles
- Manages selection state

**WordList Component**
- Displays words alphabetically
- Crosses out found words
- Updates in real-time

**Timer Component**
- Displays countdown
- Updates every second
- Stops at zero or game completion

#### Custom Hooks

**useGameSession**
```javascript
function useGameSession(category, difficulty) {
  // Manages game session state
  // Returns { gameSession, selectWord, endGame, remainingTime }
}
```

**useTimer**
```javascript
function useTimer(duration, onExpire) {
  // Manages countdown timer
  // Returns { remainingTime, isRunning, stop }
}
```

**useHighScores**
```javascript
function useHighScores() {
  // Uses TanStack Query to fetch/mutate high scores
  // Returns { highScores, saveHighScore, isLoading }
}
```

**useTheme**
```javascript
function useTheme() {
  // Manages theme state and persistence
  // Returns { theme, setTheme }
}
```

## Data Models

### Storage Schema

**High Scores (localStorage key: 'word-search-high-scores')**
```javascript
{
  "EASY": [
    { "initials": "ABC", "score": 1500, "difficulty": "EASY", "timestamp": 1234567890 },
    // ... up to 10 entries
  ],
  "MEDIUM": [ /* ... */ ],
  "HARD": [ /* ... */ ]
}
```

**Theme (localStorage key: 'word-search-theme')**
```javascript
"LIGHT" | "DARK" | "SYSTEM"
```

### Word Data Structure

Each category contains an array of 150+ words:
```javascript
{
  "Animals": ["cat", "dog", "elephant", ...],
  "Sports": ["soccer", "tennis", "golf", ...],
  // ... other categories
}
```

Words are filtered to ensure:
- Minimum length: 3 characters
- Maximum length: 8 characters
- Uppercase for grid placement


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas where properties can be consolidated:

- **Word validation properties** (1.4, 1.5) can be combined into a single comprehensive property about word data integrity
- **Puzzle generation direction properties** (3.1, 3.2, 3.3) can be unified into one property that validates directions based on difficulty
- **Timer initialization properties** (7.2, 7.3) are specific examples that validate the same underlying configuration system
- **Selection state properties** (1.3, 2.5) test the same state management pattern and can be combined
- **Storage persistence properties** (12.1, 12.2, 12.3, 12.4) test the same round-trip persistence pattern

### Core Properties

**Property 1: Word Data Integrity**
*For any* category in the system, all words returned by the repository should be between 3 and 8 characters in length (inclusive), and each category should have at least 100 usable words for puzzle generation.
**Validates: Requirements 1.4, 1.5**
**Note:** Word lists contain 150+ words, but after filtering to 3-8 characters, usable counts vary by category.

**Property 2: Puzzle Direction Constraints**
*For any* generated puzzle, all words should be placed only in directions allowed by the selected difficulty (Easy: horizontal and vertical only; Medium: horizontal, vertical, and two diagonal directions; Hard: all eight directions).
**Validates: Requirements 3.1, 3.2, 3.3**

**Property 3: Grid Size Constraint**
*For any* generated puzzle, the grid dimensions should be square and not exceed 20x20.
**Validates: Requirements 3.4**
**Note:** Previously Property 5, renumbered after removing intersection and accidental word properties.

**Property 4: Puzzle Matches Configuration**
*For any* category and difficulty selection, the generated puzzle should contain exactly the number of words specified for that difficulty (Easy: 8, Medium: 12, Hard: 16) and all words should come from the selected category.
**Validates: Requirements 4.4**
**Note:** Previously Property 6, renumbered.

**Property 5: Word List Alphabetical Sorting**
*For any* word list displayed in the game screen, the words should be sorted in alphabetical order.
**Validates: Requirements 5.2**
**Note:** Previously Property 7, renumbered.

**Property 6: Timer Display Based on Difficulty**
*For any* game session, a timer should be displayed if and only if the difficulty is Medium or Hard.
**Validates: Requirements 5.3, 5.4**
**Note:** Previously Property 8, renumbered.

**Property 7: Selection Direction Determination**
*For any* two positions in the grid, the direction between them should be correctly identified as one of the eight cardinal/diagonal directions or null if they don't form a valid line.
**Validates: Requirements 6.2**
**Note:** Previously Property 9, renumbered.

**Property 8: Selection Direction Restriction**
*For any* selection in progress with an established direction, all subsequent positions added to the selection should lie along that same direction from the starting position.
**Validates: Requirements 6.3**
**Note:** Previously Property 10, renumbered.

**Property 9: Word Validation**
*For any* selection of grid positions, the selection should be marked as valid if and only if the text formed by those positions matches a word in the puzzle's word list.
**Validates: Requirements 6.4**
**Note:** Previously Property 11, renumbered.

**Property 10: Found Word State Update**
*For any* valid word selection, the word should be marked as found in both the puzzle state and reflected in the UI (circled in grid, crossed out in list).
**Validates: Requirements 6.5, 6.6**
**Note:** Previously Property 12, renumbered.

**Property 11: Timer Countdown**
*For any* active game session with a timer, the remaining time should decrease by 1 second for each second of elapsed time until it reaches zero.
**Validates: Requirements 7.4**
**Note:** Previously Property 13, renumbered.

**Property 12: Game End Conditions**
*For any* game session, the game should end (timer stops, score calculated) if and only if either all words are found or the timer reaches zero (for timed difficulties).
**Validates: Requirements 7.5, 7.6, 8.1, 8.2**
**Note:** Previously Property 14, renumbered.

**Property 13: High Score Qualification**
*For any* completed game score and existing high scores for that difficulty, the score should qualify as a high score if and only if there are fewer than 10 existing scores or the score is greater than the lowest existing score.
**Validates: Requirements 8.4**
**Note:** Previously Property 15, renumbered.

**Property 14: High Score Separation by Difficulty**
*For any* high score list, scores should be grouped by difficulty level, and scores from one difficulty should never appear in another difficulty's list.
**Validates: Requirements 9.1**
**Note:** Previously Property 16, renumbered.

**Property 15: High Score List Size Limit**
*For any* difficulty level, the stored high scores should never exceed 10 entries.
**Validates: Requirements 9.2**
**Note:** Previously Property 17, renumbered.

**Property 16: High Score Sorting**
*For any* high score list for a given difficulty, the scores should be sorted in descending order (highest to lowest).
**Validates: Requirements 9.6**
**Note:** Previously Property 18, renumbered.

**Property 17: Theme Cycling**
*For any* current theme, clicking the theme button should cycle to the next theme in the sequence: Light → Dark → System → Light.
**Validates: Requirements 10.2**
**Note:** Previously Property 19, renumbered.

**Property 18: Theme Application**
*For any* theme change, the new theme should be immediately reflected in the application state.
**Validates: Requirements 10.4**
**Note:** Previously Property 20, renumbered.

**Property 19: Data Persistence Round Trip (High Scores)**
*For any* high score saved to storage, retrieving high scores from storage should include that score with all its properties (initials, score, difficulty, timestamp) intact.
**Validates: Requirements 9.4, 12.1, 12.3**
**Note:** Previously Property 21, renumbered.

**Property 20: Data Persistence Round Trip (Theme)**
*For any* theme saved to storage, retrieving the theme from storage should return the same theme value.
**Validates: Requirements 10.5, 12.2, 12.4**
**Note:** Previously Property 22, renumbered.

**Property 21: Start Button Enablement**
*For any* combination of category and difficulty selections, the Start Game button should be enabled if and only if both a category and a difficulty have been selected.
**Validates: Requirements 4.2**
**Note:** Previously Property 23, renumbered.

**Property 22: Selection State Management**
*For any* user selection (category or difficulty), the selected item should be marked as active in the application state.
**Validates: Requirements 1.3, 2.5**
**Note:** Previously Property 24, renumbered.

### Edge Cases and Examples

The following are specific examples and edge cases that should be tested with unit tests rather than property-based tests:

**Example 1: Available Categories**
The system should provide exactly these eight categories: Animals, Sports, Science, Food, Geography, Technology, Music, Movies.
**Validates: Requirements 1.1**

**Example 2: Available Difficulties**
The system should provide exactly these three difficulties: Easy, Medium, Hard.
**Validates: Requirements 2.1**

**Example 3: Easy Difficulty Configuration**
Easy difficulty should display "8 words, 12 minute timer, horizontal and vertical only" and initialize timer to 720 seconds (12 minutes).
**Validates: Requirements 2.2, 7.1**

**Example 4: Medium Difficulty Configuration**
Medium difficulty should display "12 words, 5 minute timer, includes diagonals" and initialize timer to 300 seconds.
**Validates: Requirements 2.3, 7.2**

**Example 5: Hard Difficulty Configuration**
Hard difficulty should display "16 words, 3 minute timer, all eight directions" and initialize timer to 180 seconds.
**Validates: Requirements 2.4, 7.3**

**Example 6: Initial Start Button State**
When the home screen loads with no selections, the Start Game button should be disabled.
**Validates: Requirements 4.1**

**Example 7: Start Game Navigation**
When the enabled Start Game button is clicked, the application should navigate to the game screen route.
**Validates: Requirements 4.3**

**Example 8: High Score Navigation (Qualifying)**
When a player achieves a qualifying high score, clicking after game completion should navigate to the high score entry screen.
**Validates: Requirements 8.5**

**Example 9: Home Navigation (Non-Qualifying)**
When a player achieves a non-qualifying score, clicking after game completion should navigate to the home screen.
**Validates: Requirements 8.6**

**Example 10: Available Themes**
The system should provide exactly these three theme options: Light Mode, Dark Mode, System Mode.
**Validates: Requirements 10.1**

**Example 11: Default Application Title**
The application title should default to "Word Search".
**Validates: Requirements 11.7**

**Example 12: High Score Initials Input**
When a player achieves a qualifying score, the system should prompt for initials with a maximum length of 3 characters.
**Validates: Requirements 9.3**

## Error Handling

### Puzzle Generation Failures

**Scenario**: Puzzle generator cannot create a valid puzzle within reasonable attempts
- **Detection**: Track generation attempts, fail after 100 attempts
- **Response**: Log error, retry with different word selection
- **User Impact**: Show loading state, fallback to simpler word selection if needed

**Scenario**: Selected words cannot fit in 20x20 grid
- **Detection**: Grid size exceeds maximum during placement
- **Response**: Remove longest word and retry, or select different words
- **User Impact**: Transparent to user, may take slightly longer to generate

### Storage Failures

**Scenario**: localStorage is full or unavailable
- **Detection**: Try-catch around storage operations
- **Response**: Fall back to in-memory storage, warn user that data won't persist
- **User Impact**: Display notification that scores won't be saved

**Scenario**: Corrupted data in localStorage
- **Detection**: JSON parse errors or invalid data structure
- **Response**: Clear corrupted data, start fresh
- **User Impact**: Previous high scores lost, display notification

### Timer Edge Cases

**Scenario**: Timer reaches exactly zero while player is selecting a word
- **Detection**: Check timer on every state update
- **Response**: Complete the current selection validation, then end game
- **User Impact**: Fair gameplay, current selection is honored

**Scenario**: Browser tab is backgrounded during timed game
- **Detection**: Compare elapsed time on tab focus
- **Response**: Update timer based on actual elapsed time
- **User Impact**: Timer continues accurately even when tab is inactive

### Selection Edge Cases

**Scenario**: Player drags outside grid boundaries
- **Detection**: Check position validity on mouse move
- **Response**: Ignore positions outside grid, maintain last valid position
- **User Impact**: Selection stops at grid edge

**Scenario**: Player selects same letter twice in a row
- **Detection**: Check if new position equals previous position
- **Response**: Ignore duplicate position
- **User Impact**: Selection doesn't include duplicates

**Scenario**: Rapid clicking/selection attempts
- **Detection**: Debounce selection validation
- **Response**: Process only completed selections
- **User Impact**: Smooth interaction without lag

### Input Validation

**Scenario**: Invalid initials input (special characters, numbers)
- **Detection**: Validate input against allowed characters (A-Z)
- **Response**: Filter out invalid characters, allow only letters
- **User Impact**: Only valid characters appear in input field

**Scenario**: Empty initials submission
- **Detection**: Check initials length before saving
- **Response**: Require at least one character, default to "AAA" if empty
- **User Impact**: Cannot submit without entering initials

## Testing Strategy

### Dual Testing Approach

This project requires both **unit tests** and **property-based tests** to ensure comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, error conditions, and integration points
- **Property-based tests** verify universal properties across all possible inputs
- Together they provide complementary coverage: unit tests catch concrete bugs, property tests verify general correctness

### Property-Based Testing

**Library**: Use **fast-check** for JavaScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each test must reference its design document property
- Tag format: `// Feature: word-search-game, Property {number}: {property_text}`

**Property Test Implementation**:
- Each correctness property (1-24) must be implemented as a single property-based test
- Tests should generate random valid inputs and verify the property holds
- Use custom generators for domain objects (Grid, Word, Puzzle, etc.)

**Example Property Test Structure**:
```javascript
// Feature: word-search-game, Property 1: Word Data Integrity
test('all words in all categories meet length requirements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...Object.values(Category)),
      (category) => {
        const words = wordRepository.getWordsByCategory(category);
        expect(words.length).toBeGreaterThanOrEqual(500);
        expect(words.every(w => w.length >= 3 && w.length <= 8)).toBe(true);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Focus Areas**:
- Specific configuration examples (difficulty settings, category lists)
- Navigation flows (route transitions)
- Error handling scenarios
- Edge cases (timer expiration during selection, storage failures)
- Component integration (Grid + WordList interaction)
- UI state management (button enablement, theme application)

**Test Organization**:
```
src/
├── domain/
│   ├── services/
│   │   ├── PuzzleGeneratorService.test.js
│   │   ├── ScoringService.test.js
│   │   └── WordSelectionService.test.js
│   └── entities/
│       └── *.test.js
├── application/
│   └── use-cases/
│       └── *.test.js
├── infrastructure/
│   └── repositories/
│       └── *.test.js
└── presentation/
    ├── components/
    │   └── *.test.js
    └── hooks/
        └── *.test.js
```

### Custom Generators for Property Tests

**Grid Generator**:
```javascript
const gridGenerator = fc.record({
  size: fc.integer({ min: 8, max: 12 }),
  cells: fc.array(fc.array(fc.record({
    letter: fc.char().filter(c => /[A-Z]/.test(c)),
    isPartOfWord: fc.boolean()
  })))
});
```

**Word Generator**:
```javascript
const wordGenerator = fc.record({
  id: fc.uuid(),
  text: fc.stringOf(fc.char().filter(c => /[A-Z]/.test(c)), { minLength: 3, maxLength: 8 }),
  startPos: fc.record({ row: fc.nat(11), col: fc.nat(11) }),
  direction: fc.constantFrom(...Object.keys(Direction)),
  found: fc.boolean()
});
```

**Puzzle Generator**:
```javascript
const puzzleGenerator = (difficulty) => fc.record({
  grid: gridGenerator,
  words: fc.array(wordGenerator, { 
    minLength: DifficultyConfig[difficulty].wordCount,
    maxLength: DifficultyConfig[difficulty].wordCount
  }),
  category: fc.constantFrom(...Object.values(Category)),
  difficulty: fc.constant(difficulty)
});
```

### Integration Testing

**Key Integration Points**:
- Puzzle generation → Grid rendering
- Word selection → Puzzle state update → UI update
- Game completion → Score calculation → High score check → Navigation
- Theme change → Storage → UI update
- High score save → Storage → Retrieval → Display

### Test Coverage Goals

- **Domain Layer**: 100% coverage (pure logic, highly testable)
- **Application Layer**: 95% coverage (use cases, critical paths)
- **Infrastructure Layer**: 90% coverage (storage, repositories)
- **Presentation Layer**: 80% coverage (UI components, focus on logic)

### Testing Tools

- **Test Runner**: Vitest (fast, Vite-native)
- **Property Testing**: fast-check
- **React Testing**: @testing-library/react
- **Mocking**: Vitest mocks for storage and external dependencies

### Continuous Testing

- Run unit tests on every file save (watch mode during development)
- Run property tests before commits (pre-commit hook)
- Run full test suite in CI/CD pipeline
- Generate coverage reports and enforce minimum thresholds

