# Decision Record: Remove ButtonBar Component

**Date:** 2026-02-07  
**Status:** Accepted  
**Decision Maker:** User

## Context

During the implementation of the theme system, we initially created a `ButtonBar` component that contained both the "High Scores" navigation button and the theme switcher. This button bar was positioned at the top of each screen.

## Decision

We decided to remove the ButtonBar component and instead place the theme switcher directly in the top right corner of each screen's main container.

## Rationale

The button bar felt out of place in the UI. It created visual clutter and didn't integrate well with the existing design patterns. The theme switcher works better as a small, unobtrusive element in the corner rather than part of a prominent button bar.

## Consequences

### Positive
- Cleaner, less cluttered UI
- Theme switcher is less distracting
- More consistent with modern UI patterns where theme toggles are typically small corner elements
- Better visual hierarchy - the theme switcher doesn't compete with primary actions

### Negative
- ButtonBar component code exists but is unused (can be deleted if needed)
- Theme switcher needs to be individually placed on each screen rather than using a shared component

## Implementation

- Created `ThemeSwitcher` component as a standalone element
- Positioned it absolutely in the top right corner of each screen
- Made it smaller (12px font, compact padding) to be less distracting
- Removed ButtonBar from all screens

## Files Affected

- `src/components/ui/ButtonBar.jsx` - Created but not used
- `src/components/ui/ThemeSwitcher.jsx` - Standalone component
- `src/routes/index.jsx` - Theme switcher in top right
- `src/routes/game.jsx` - Theme switcher in top right
- `src/routes/high-scores.jsx` - Theme switcher in top right
