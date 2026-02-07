# Word Search Game

A browser-based word search puzzle game built with React 19, Vite, TanStack Router, TanStack Query, and Tailwind CSS v4.

## Features

- 8 word categories: Animals, Sports, Science, Food, Geography, Technology, Music, Movies
- 3 difficulty levels: Easy, Medium, Hard
- Persistent high scores
- Theme switching (Light, Dark, System)
- Timer-based gameplay for Medium and Hard difficulties

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **TanStack Router** - Routing
- **TanStack Query** - State management
- **Tailwind CSS v4** - Styling
- **Vitest** - Testing framework
- **fast-check** - Property-based testing

## Project Structure

```
src/
├── components/       # Presentation layer
│   ├── ui/          # Reusable UI components
│   ├── home/        # Home screen components
│   ├── game/        # Game screen components
│   └── highscores/  # High scores screen components
├── domain/          # Business logic
├── application/     # State management and hooks
│   └── hooks/
├── infrastructure/  # External dependencies
├── routes/          # TanStack Router routes
└── test/           # Test setup
```

## Getting Started

### Prerequisites

- Node.js 22
- pnpm (recommended)

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

The application follows Clean Architecture principles with clear separation of concerns:

- **Presentation Layer**: React components and routing
- **Application Layer**: State management, hooks, and application logic
- **Domain Layer**: Core business logic (puzzle generation, scoring, validation)
- **Infrastructure Layer**: External dependencies (local storage, word lists)

## Development

This project uses:
- **Clean Architecture** for maintainability
- **Property-Based Testing** for correctness validation
- **Unit Testing** for specific scenarios and UI interactions

See `.kiro/specs/word-search-game/` for detailed requirements, design, and implementation tasks.
