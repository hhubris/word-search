# Word Search Game

A browser-based word search puzzle game built with React 19, following Clean Architecture principles. Features multiple categories, difficulty levels, high score tracking, and theme customization.

## Features

### Game Modes
- **8 Word Categories**: Animals, Sports, Science, Food, Geography, Technology, Music, Movies
- **3 Difficulty Levels**:
  - **Easy**: 8 words, 12-minute timer, horizontal and vertical directions only
  - **Medium**: 12 words, 5-minute timer, includes diagonal directions
  - **Hard**: 16 words, 3-minute timer, all eight directions

### Gameplay
- Interactive word selection with mouse drag
- Visual feedback with SVG circles around found words
- Forgiving diagonal selection for better UX
- Direction change support when returning to start cell
- Real-time timer countdown
- Score calculation based on words found, time remaining, and difficulty multiplier

### Customization
- **Theme Switching**: Light, Dark, and System modes
- **Persistent Storage**: High scores and theme preferences saved in browser
- **High Score Tracking**: Top 10 scores per difficulty level

### Technical Features
- 530 comprehensive tests (unit + property-based)
- Clean Architecture with clear separation of concerns
- Responsive design with Tailwind CSS v4
- Type-safe routing with TanStack Router
- Efficient state management with TanStack Query

## Tech Stack

- **React 19** - UI framework with modern hooks
- **Vite** - Fast build tool and dev server
- **TanStack Router** - Type-safe routing solution
- **TanStack Query** - Data fetching and state management
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vitest** - Fast unit test runner
- **fast-check** - Property-based testing library
- **@blex41/word-search** - Puzzle generation library

## Project Structure

```
src/
├── domain/              # Domain Layer (Pure business logic)
│   ├── entities/        # Core domain objects (Grid, Puzzle, GameSession, etc.)
│   ├── value-objects/   # Immutable value types (Position, Direction, etc.)
│   └── services/        # Domain services (PuzzleGenerator, Scoring, etc.)
├── application/         # Application Layer (Use cases)
│   ├── use-cases/       # Application use cases
│   ├── hooks/           # Custom React hooks
│   └── container.js     # Dependency injection
├── infrastructure/      # Infrastructure Layer (External concerns)
│   ├── storage/         # Browser storage adapters
│   ├── repositories/    # Data access implementations
│   └── wordLists/       # Static word lists (150+ words per category)
├── components/          # Presentation Layer (UI)
│   ├── ui/             # Reusable UI components (ThemeSwitcher, ButtonBar)
│   ├── home/           # Home screen components
│   ├── game/           # Game screen components (PuzzleGrid, WordList, Timer)
│   └── highscores/     # High scores screen components
├── routes/             # TanStack Router route definitions
└── test/              # Test setup and utilities
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run only property tests
pnpm test:property

# Run only unit tests
pnpm test:unit
```

## Architecture

The application follows **Clean Architecture** principles with clear separation of concerns:

### Layer Structure

1. **Domain Layer** (Core Business Logic)
   - Entities: Grid, Puzzle, GameSession, Word, HighScore
   - Value Objects: Position, Direction, Selection, Difficulty, Category
   - Services: PuzzleGeneratorService, ScoringService, WordSelectionService

2. **Application Layer** (Use Cases)
   - StartGameUseCase, SelectWordUseCase, EndGameUseCase
   - SaveHighScoreUseCase, GetHighScoresUseCase
   - ChangeThemeUseCase
   - Custom hooks: useGameSession, useTimer, useHighScores, useTheme

3. **Infrastructure Layer** (External Dependencies)
   - LocalStorageAdapter for browser storage
   - Repository implementations (WordRepository, HighScoreRepository, ThemeRepository)
   - Word lists (150+ words per category, filtered to 3-8 characters)

4. **Presentation Layer** (UI Components)
   - Route components (Home, Game, High Scores)
   - UI components (PuzzleGrid, WordList, Timer, ThemeSwitcher)
   - Styled with Tailwind CSS v4

### Dependency Flow

Dependencies flow inward: **Presentation → Application → Domain**

The domain layer has no dependencies on outer layers, ensuring testability and maintainability.

## Testing Strategy

### Dual Testing Approach

- **Unit Tests**: Verify specific examples, edge cases, and UI interactions
- **Property-Based Tests**: Verify universal properties across all possible inputs

### Test Coverage

- **530 total tests** across all layers
- **22 correctness properties** validated with property-based testing
- **Domain Layer**: 100% coverage (pure logic)
- **Application Layer**: 95% coverage (use cases)
- **Infrastructure Layer**: 90% coverage (storage, repositories)
- **Presentation Layer**: 80% coverage (UI components)

### Property Examples

- Word Data Integrity: All words 3-8 characters, 100+ per category
- Puzzle Direction Constraints: Words only in allowed directions per difficulty
- Grid Size Constraint: Square grids, max 20x20
- Timer Countdown: Decreases by 1 second per elapsed second
- High Score Sorting: Always sorted highest to lowest

## Development Decisions

Key architectural decisions are documented in `.kiro/decisions/`:

- **DR 001**: Remove button bar in favor of standalone components
- **DR 002**: Increase max grid size from 12x12 to 20x20
- **DR 003**: Reduce word count from 500+ to 150+ per category
- **DR 004**: Use inline styles (reversed by DR 006)
- **DR 005**: Use @blex41/word-search library for puzzle generation
- **DR 006**: Adopt Tailwind CSS v4 for styling
- **DR 007**: Add 12-minute timer to Easy difficulty for consistent scoring

## Scoring System

Score calculation formula:
```
Base Score = Words Found × 100
Time Bonus = Remaining Seconds × 10
Difficulty Multiplier = 1x (Easy), 1.5x (Medium), 2x (Hard)

Final Score = (Base Score + Time Bonus) × Difficulty Multiplier
```

## Documentation

Comprehensive documentation available in `.kiro/specs/word-search-game/`:

- **requirements.md**: Detailed requirements with acceptance criteria
- **design.md**: Technical design with architecture and correctness properties
- **tasks.md**: Implementation plan with 22 tasks (all complete)

## License

MIT
