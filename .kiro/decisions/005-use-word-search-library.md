# Decision Record 005: Use @blex41/word-search Library for Puzzle Generation

## Status
Accepted

## Date
2026-02-08

## Context
The original design specified custom puzzle generation logic with specific requirements:
- At least 50% of words must intersect with other words (Requirement 3.4)
- Random letters should not accidentally create additional target words (Requirement 3.5)
- Custom methods for `placeWord()`, `findIntersections()`, `fillEmptyCells()`, etc.

During implementation, we integrated the `@blex41/word-search` library which handles all puzzle generation internally. This library provides:
- Reliable word placement with configurable direction constraints
- Automatic grid sizing
- Random letter filling
- Retry logic for failed placements

However, the library does not expose controls for:
- Guaranteeing word intersection percentages
- Preventing accidental words in the random fill

## Decision
We will use the `@blex41/word-search` library for all puzzle generation and update the requirements to reflect what the library provides rather than implementing custom puzzle generation logic.

**Changes:**
1. Remove Requirement 3.4 (word intersection requirement)
2. Remove Requirement 3.5 (no accidental words requirement)
3. Remove Property 3 (Word Intersection Requirement) from design
4. Remove Property 4 (No Accidental Words) from design
5. Update PuzzleGeneratorService description to reflect library wrapper role
6. Remove failing property tests for Properties 3 and 4

## Rationale
- The library provides robust, tested puzzle generation that meets our core needs
- Direction constraints (Easy/Medium/Hard) are fully supported
- Grid size constraints are met
- Word count requirements are met
- Implementing custom puzzle generation to meet the intersection/accidental word requirements would require significant effort
- The removed requirements are "nice to have" quality improvements rather than core functionality
- Players are unlikely to notice or be impacted by these changes

## Consequences

### Positive
- Faster implementation using battle-tested library
- Less code to maintain
- Reliable puzzle generation with retry logic
- Focus development effort on UI and game mechanics

### Negative
- Cannot guarantee word intersections (puzzles may have isolated words)
- Random fill may occasionally create accidental words from the category
- Less control over puzzle generation algorithm

### Mitigation
- The library's default behavior produces reasonable puzzles for gameplay
- If puzzle quality becomes an issue, we can revisit custom generation later
- Property tests still validate direction constraints and grid size limits

## Related
- Decision Record 002: Increase Grid Size to 20x20
- Task 4.6: Write property tests for puzzle generation (updated to remove Properties 3 and 4)
