# Implementation Plan: Word Search Game

## Overview

This implementation plan breaks down the word search game into incremental coding tasks following Clean Architecture principles. The implementation proceeds from the domain layer outward, ensuring core business logic is solid before building infrastructure and UI layers. Each major component includes property-based tests to validate correctness properties from the design document.

The project setup (Task 1) is already complete with React 19, Vite, TanStack Router, and TanStack Query installed. Note: Tailwind CSS v4 was initially installed but inline styles are used instead (see Decision Record 004).

## Tasks

- [x] 1. Project setup and dependencies
  - Already complete: React 19, Vite, TanStack Router, TanStack Query, Tailwind CSS v4 installed
  - Note: Tailwind CSS v4 is now the official styling approach (see Decision Record 006)

- [ ] 2. Create domain layer foundation
  - [x] 2.1 Implement core value objects and enums
    - Create `src/domain/value-objects/Position.js` with Position class
    - Create `src/domain/value-objects/Direction.js` with Direction enum and helper functions
    - Create `src/domain/value-objects/Difficulty.js` with Difficulty enum and DifficultyConfig
    - Create `src/domain/value-objects/Category.js` with Category enum
    - Create `src/domain/value-objects/Selection.js` with Selection class
    - _Requirements: 1.1, 2.1, 3.1, 3.2, 3.3_
  
  - [x] 2.2 Write property test for Direction determination
    - **Property 7: Selection Direction Determination**
    - **Validates: Requirements 6.2**
  
  - [x] 2.3 Write unit tests for value objects
    - Test Position equality and addition
    - Test Direction helpers for each difficulty
    - Test Selection text extraction
    - _Requirements: 1.1, 2.1, 6.2_

- [ ] 3. Implement domain entities
  - [x] 3.1 Create Cell and Grid entities
    - Create `src/domain/entities/Cell.js` with Cell class
    - Create `src/domain/entities/Grid.js` with Grid class and methods
    - _Requirements: 3.6_
  
  - [x] 3.2 Create Word entity
    - Create `src/domain/entities/Word.js` with Word class
    - Implement getPositions() method to calculate all cell positions
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 3.3 Create Puzzle entity
    - Create `src/domain/entities/Puzzle.js` with Puzzle class
    - Implement word tracking and completion logic
    - _Requirements: 3.4, 6.5, 6.6_
  
  - [x] 3.4 Create GameSession entity
    - Create `src/domain/entities/GameSession.js` with GameSession class
    - Implement timer logic and score calculation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.1, 8.2_
  
  - [x] 3.5 Create HighScore entity
    - Create `src/domain/entities/HighScore.js` with HighScore class
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [x] 3.6 Write property test for Grid size constraint
    - **Property 3: Grid Size Constraint**
    - Validate that generated puzzles have square grids not exceeding 20x20
    - **Validates: Requirements 3.4**
    - **Note:** Max grid size increased from 12x12 to 20x20 per Decision Record 002
  
  - [x] 3.7 Write unit tests for entities
    - Test Grid cell access and validation
    - Test Word position calculation
    - Test Puzzle completion detection
    - Test GameSession timer calculations
    - _Requirements: 3.6, 7.4, 8.1_

- [ ] 4. Implement domain services
  - [x] 4.1 Create WordSelectionService
    - Create `src/domain/services/WordSelectionService.js`
    - Implement validateSelection() method
    - Implement determineDirection() method
    - Implement restrictToDirection() method
    - _Requirements: 6.2, 6.3, 6.4_
  
  - [x] 4.2 Write property tests for word selection
    - **Property 8: Selection Direction Restriction**
    - **Property 9: Word Validation**
    - **Validates: Requirements 6.3, 6.4**
  
  - [x] 4.3 Create ScoringService
    - Create `src/domain/services/ScoringService.js`
    - Implement calculateScore() with difficulty multipliers and time bonuses
    - _Requirements: 8.1, 8.2_
  
  - [x] 4.4 Write unit tests for ScoringService
    - Test score calculation for each difficulty
    - Test time bonus calculations
    - Test score with all words found vs partial completion
    - _Requirements: 8.1, 8.2_
  
  - [x] 4.5 Create PuzzleGeneratorService (core logic)
    - Create `src/domain/services/PuzzleGeneratorService.js`
    - Implement placeWord() method with direction constraints
    - Implement findIntersections() method
    - Implement fillEmptyCells() method
    - Implement validateGridSize() method
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  
  - [x] 4.6 Write property tests for puzzle generation
    - **Property 2: Puzzle Direction Constraints**
    - **Property 3: Grid Size Constraint**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
    - **Note:** Properties renumbered after removing intersection and accidental word tests per Decision Record 005

- [x] 5. Checkpoint - Domain layer complete
  - Ensure all domain tests pass, ask the user if questions arise.

- [ ] 6. Create infrastructure layer - word data
  - [x] 6.1 Generate word lists for all categories
    - Create `src/infrastructure/wordLists/animals.json` with 150+ words (3-8 chars)
    - Create `src/infrastructure/wordLists/sports.json` with 150+ words (3-8 chars)
    - Create `src/infrastructure/wordLists/science.json` with 150+ words (3-8 chars)
    - Create `src/infrastructure/wordLists/food.json` with 150+ words (3-8 chars)
    - Create `src/infrastructure/wordLists/geography.json` with 150+ words (3-8 chars)
    - Create `src/infrastructure/wordLists/technology.json` with 150+ words (3-8 chars)
    - Create `src/infrastructure/wordLists/music.json` with 150+ words (3-8 chars)
    - Create `src/infrastructure/wordLists/movies.json` with 150+ words (3-8 chars)
    - Create `src/infrastructure/wordLists/index.js` to export all word lists
    - _Requirements: 1.4, 1.5_
    - **Note:** Word count reduced from 500+ to 150+ per Decision Record 003
  
  - [x] 6.2 Write property test for word data integrity
    - **Property 1: Word Data Integrity**
    - **Validates: Requirements 1.4, 1.5**

- [ ] 7. Create infrastructure layer - storage and repositories
  - [x] 7.1 Implement LocalStorageAdapter
    - Create `src/infrastructure/storage/LocalStorageAdapter.js`
    - Implement get(), set(), remove() methods with error handling
    - _Requirements: 12.1, 12.2_
  
  - [x] 7.2 Implement WordRepositoryImpl
    - Create `src/infrastructure/repositories/WordRepositoryImpl.js`
    - Implement getWordsByCategory() and getAllCategories()
    - _Requirements: 1.1, 1.4, 1.5_
  
  - [x] 7.3 Write unit tests for WordRepositoryImpl
    - Test category retrieval
    - Test word filtering by length
    - _Requirements: 1.1, 1.4, 1.5_
  
  - [x] 7.4 Implement HighScoreRepositoryImpl
    - Create `src/infrastructure/repositories/HighScoreRepositoryImpl.js`
    - Implement getHighScores(), saveHighScore(), getTopScores()
    - Ensure top 10 limit per difficulty
    - _Requirements: 9.1, 9.2, 9.4, 12.1, 12.3_
  
  - [x] 7.5 Write property tests for high score repository
    - **Property 14: High Score Separation by Difficulty**
    - **Property 15: High Score List Size Limit**
    - **Property 16: High Score Sorting**
    - **Property 19: Data Persistence Round Trip (High Scores)**
    - **Validates: Requirements 9.1, 9.2, 9.6, 12.1, 12.3**
  
  - [x] 7.6 Implement ThemeRepositoryImpl
    - Create `src/infrastructure/repositories/ThemeRepositoryImpl.js`
    - Implement getTheme() and saveTheme()
    - _Requirements: 10.5, 12.2, 12.4_
  
  - [x] 7.7 Write property test for theme persistence
    - **Property 20: Data Persistence Round Trip (Theme)**
    - **Validates: Requirements 10.5, 12.2, 12.4**

- [ ] 8. Create application layer - use cases
  - [x] 8.1 Implement StartGameUseCase
    - Create `src/application/use-cases/StartGameUseCase.js`
    - Wire together puzzle generation and game session creation
    - _Requirements: 4.3, 4.4_
  
  - [x] 8.2 Write property test for puzzle configuration matching
    - **Property 4: Puzzle Matches Configuration**
    - **Validates: Requirements 4.4**
  
  - [x] 8.3 Implement SelectWordUseCase
    - Create `src/application/use-cases/SelectWordUseCase.js`
    - Integrate word selection validation and puzzle state updates
    - _Requirements: 6.4, 6.5, 6.6_
  
  - [x] 8.4 Write property test for found word state update
    - **Property 10: Found Word State Update**
    - **Validates: Requirements 6.5, 6.6**
  
  - [x] 8.5 Implement EndGameUseCase
    - Create `src/application/use-cases/EndGameUseCase.js`
    - Integrate scoring and high score qualification check
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 8.6 Write property tests for game end conditions
    - **Property 12: Game End Conditions**
    - **Property 13: High Score Qualification**
    - **Validates: Requirements 7.5, 7.6, 8.1, 8.2, 8.4**
  
  - [x] 8.7 Implement SaveHighScoreUseCase
    - Create `src/application/use-cases/SaveHighScoreUseCase.js`
    - Handle high score creation and persistence
    - _Requirements: 9.3, 9.4_
  
  - [x] 8.8 Implement GetHighScoresUseCase
    - Create `src/application/use-cases/GetHighScoresUseCase.js`
    - Retrieve and format high scores by difficulty
    - _Requirements: 9.1, 9.5, 9.6_
  
  - [x] 8.9 Implement ChangeThemeUseCase
    - Create `src/application/use-cases/ChangeThemeUseCase.js`
    - Handle theme cycling and persistence
    - _Requirements: 10.2, 10.4, 10.5_
  
  - [ ]* 8.10 Write property tests for theme management
    - **Property 17: Theme Cycling**
    - **Property 18: Theme Application**
    - **Validates: Requirements 10.2, 10.4**

- [x] 9. Checkpoint - Core logic complete
  - Ensure all domain, infrastructure, and application tests pass, ask the user if questions arise.

- [x] 10. Create dependency injection container
  - [x] 10.1 Set up service container
    - Create `src/application/container.js`
    - Wire all dependencies (repositories, services, use cases)
    - Export configured use cases for presentation layer
    - _Requirements: 13.6_

- [x] 11. Set up routing with TanStack Router
  - [x] 11.1 Configure router
    - Create `src/presentation/routes/index.js`
    - Define routes: '/' (home), '/game' (game screen), '/high-scores' (high scores)
    - Configure route tree
    - _Requirements: 13.3_
  
  - [x] 11.2 Create route components
    - Create `src/presentation/routes/HomeRoute.jsx`
    - Create `src/presentation/routes/GameRoute.jsx`
    - Create `src/presentation/routes/HighScoresRoute.jsx`
    - _Requirements: 4.3, 8.5, 8.6_

- [ ] 12. Implement presentation layer - custom hooks
  - [x] 12.1 Create useGameSession hook
    - Create `src/presentation/hooks/useGameSession.js`
    - Manage game session state and word selection
    - Integrate with SelectWordUseCase and EndGameUseCase
    - _Requirements: 6.1, 6.4, 8.1, 8.2_
  
  - [x] 12.2 Create useTimer hook
    - Create `src/presentation/hooks/useTimer.js`
    - Implement countdown logic with setInterval
    - Handle timer stop on game end
    - _Requirements: 7.4, 7.5_
  
  - [x]* 12.3 Write property test for timer countdown
    - **Property 11: Timer Countdown**
    - **Validates: Requirements 7.4**
  
  - [x] 12.4 Create useHighScores hook
    - Create `src/presentation/hooks/useHighScores.js`
    - Use TanStack Query for high score data fetching and mutations
    - Integrate with GetHighScoresUseCase and SaveHighScoreUseCase
    - _Requirements: 9.1, 9.4, 13.4_
  
  - [x] 12.5 Create useTheme hook
    - Create `src/presentation/hooks/useTheme.js`
    - Manage theme state and apply to document
    - Integrate with ChangeThemeUseCase
    - _Requirements: 10.2, 10.4, 10.5_

- [ ] 13. Implement presentation layer - UI components (Grid and Word List)
  - [x] 13.1 Create PuzzleGrid component
    - Create `src/presentation/components/PuzzleGrid.jsx`
    - Render grid cells with letters
    - Handle mouse down/move/up events for selection
    - Highlight selected cells and found words
    - _Requirements: 5.1, 6.1, 6.2, 6.3, 6.5_
  
  - [x] 13.2 Write unit tests for PuzzleGrid
    - Test cell rendering
    - Test selection state updates
    - Test found word highlighting
    - _Requirements: 6.1, 6.5_
  
  - [x] 13.3 Create WordList component
    - Create `src/presentation/components/WordList.jsx`
    - Display words in alphabetical order
    - Cross out found words
    - _Requirements: 5.2, 6.6_
  
  - [x] 13.4 Write property test for word list sorting
    - **Property 5: Word List Alphabetical Sorting**
    - **Validates: Requirements 5.2**

- [ ] 14. Implement presentation layer - UI components (Timer and Game Screen)
  - [x] 14.1 Create Timer component
    - Create `src/presentation/components/Timer.jsx`
    - Display countdown in MM:SS format
    - Update every second
    - _Requirements: 5.3, 7.2, 7.3, 7.4_
  
  - [x] 14.2 Write property test for timer display
    - **Property 6: Timer Display Based on Difficulty**
    - **Validates: Requirements 5.3, 5.4**
  
  - [x] 14.3 Create GameScreen component
    - Create `src/presentation/components/GameScreen.jsx`
    - Layout: Grid on left, WordList on right, Timer at top
    - Show score overlay on game completion
    - Handle click to navigate after game end
    - _Requirements: 5.1, 5.2, 5.3, 8.3, 8.4, 8.5, 8.6_
  
  - [ ] 14.4 Write integration tests for GameScreen
    - Test game flow: selection → validation → completion
    - Test timer expiration handling
    - Test navigation after game end
    - _Requirements: 6.4, 7.5, 8.4_

- [ ] 15. Implement presentation layer - UI components (Home Screen)
  - [x] 15.1 Create CategorySelector component
    - Create `src/presentation/components/CategorySelector.jsx`
    - Display 8 category buttons in 2 rows
    - Highlight selected category
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 15.2 Write property test for selection state
    - **Property 22: Selection State Management**
    - **Validates: Requirements 1.3, 2.5**
  
  - [x] 15.3 Create DifficultySelector component
    - Create `src/presentation/components/DifficultySelector.jsx`
    - Display 3 difficulty buttons with descriptions
    - Highlight selected difficulty
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 15.4 Create HomeScreen component
    - Create `src/presentation/components/HomeScreen.jsx`
    - Layout: Theme switcher in top right, title, CategorySelector, DifficultySelector, Start button
    - Manage Start button enabled state
    - Handle Start button click to navigate to game
    - _Requirements: 4.1, 4.2, 4.3, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
    - **Note:** Button bar removed per Decision Record 001
  
  - [x] 15.5 Write property test for Start button enablement
    - **Property 21: Start Button Enablement**
    - **Validates: Requirements 4.2**
  
  - [x] 15.6 Write unit tests for HomeScreen
    - Test initial button state (disabled)
    - Test button enablement after selections
    - Test navigation on Start click
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 16. Implement presentation layer - UI components (High Scores and Theme)
  - [x] 16.1 Create HighScoresScreen component
    - Create `src/presentation/components/HighScoresScreen.jsx`
    - Display three columns: Easy, Medium, Hard
    - Show top 10 scores per difficulty, sorted highest to lowest
    - Highlight newly added scores
    - Include initials input form when qualifying
    - _Requirements: 9.1, 9.2, 9.3, 9.5, 9.6, 9.7, 9.8_
  
  - [x] 16.2 Write unit tests for HighScoresScreen
    - Test score display and sorting
    - Test initials input validation (max 3 chars)
    - Test new score highlighting
    - _Requirements: 9.3, 9.6, 9.8_
  
  - [ ] 16.3 Create ThemeSwitcher component
    - Create `src/presentation/components/ThemeSwitcher.jsx`
    - Button to cycle through themes
    - Apply theme to document root
    - Position in top right corner of screens
    - _Requirements: 10.1, 10.2, 10.4_
    - **Note:** Standalone component, not in button bar per Decision Record 001
  
  - [ ] 16.4 Create ButtonBar component (OBSOLETE)
    - **Status:** Not implemented - removed per Decision Record 001
    - Original plan was to create button bar with high scores and theme switcher
    - Implementation uses standalone ThemeSwitcher in top right corner instead
    - This task can be skipped

- [ ] 17. Implement component styling
  - [x] 17.1 Define style constants and theme variables
    - Create `src/index.css` with Tailwind CSS v4 configuration
    - Define CSS variables for light/dark/system theme color palettes
    - Create custom utility classes for theme-aware colors
    - _Requirements: 10.1, 11.3, 13.5_
    - **Note:** Using Tailwind CSS v4 per Decision Record 006
  
  - [x] 17.2 Style all components
    - Apply Tailwind CSS utility classes to all components
    - Ensure responsive design with Tailwind responsive utilities
    - Implement theme-aware styling using custom CSS variables
    - Style grid cells, word list, buttons, overlays
    - _Requirements: 10.4, 13.5_
    - **Note:** Using Tailwind CSS v4 per Decision Record 006 (reverses Decision Record 004)

- [ ] 18. Checkpoint - UI complete
  - Ensure all presentation tests pass, manually test UI flows, ask the user if questions arise.

- [ ] 19. Wire everything together in main app
  - [ ] 19.1 Set up main App component
    - Create/update `src/App.jsx`
    - Integrate TanStack Router
    - Set up TanStack Query provider
    - Apply initial theme from storage
    - _Requirements: 12.4, 13.1, 13.3, 13.4_
  
  - [ ] 19.2 Update main entry point
    - Update `src/main.jsx`
    - Mount App component
    - _Requirements: 13.1, 13.2_

- [ ] 20. Error handling and edge cases
  - [ ] 20.1 Add error boundaries
    - Create `src/presentation/components/ErrorBoundary.jsx`
    - Wrap main app with error boundary
    - Display user-friendly error messages
    - _Requirements: 13.6_
  
  - [ ] 20.2 Implement storage error handling
    - Add try-catch blocks in storage adapter
    - Fall back to in-memory storage if localStorage unavailable
    - Display notifications for storage failures
    - _Requirements: 12.1, 12.2_
  
  - [ ] 20.3 Handle puzzle generation failures
    - Add retry logic with attempt limits
    - Fall back to simpler word selection if needed
    - Display loading states
    - _Requirements: 3.7_
  
  - [ ] 20.4 Write unit tests for error scenarios
    - Test storage failures
    - Test puzzle generation retries
    - Test timer edge cases (tab backgrounding)
    - Test selection edge cases (outside grid, rapid clicks)

- [ ] 21. Final integration and polish
  - [ ] 21.1 Add loading states
    - Show loading spinner during puzzle generation
    - Show loading state for high scores
    - _Requirements: 4.4_
  
  - [ ] 21.2 Add animations and transitions
    - Animate word found (circle appearance)
    - Animate score overlay
    - Smooth theme transitions
    - _Requirements: 6.5, 8.3, 10.4_
  
  - [ ] 21.3 Optimize performance
    - Memoize expensive computations
    - Optimize grid rendering
    - Debounce rapid interactions
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 21.4 Run full test suite
    - Execute all unit tests
    - Execute all property tests (100+ iterations each)
    - Verify test coverage meets goals
    - Fix any failing tests

- [ ] 22. Final checkpoint - Complete application
  - Ensure all tests pass, manually test all user flows, verify all requirements are met, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and integration points
- Checkpoints ensure incremental validation at major milestones
- The implementation follows Clean Architecture: Domain → Infrastructure → Application → Presentation
- All property tests should run with minimum 100 iterations
- Test tags should reference design document properties: `// Feature: word-search-game, Property {N}: {title}`

