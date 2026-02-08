# Decision Record: Use Inline Styles Instead of Tailwind CSS v4

**Date:** 2026-02-08  
**Status:** Reversed (see Decision Record 006)  
**Decision Maker:** Development Team

**NOTE**: This decision was reversed by Decision Record 006. The project now uses Tailwind CSS v4 for styling.

## Context

The original requirements specified using Tailwind CSS v4 for styling (Requirement 13.5). During implementation, Tailwind CSS v4 (beta) was not loading properly in the Vite build configuration. Rather than delay development to troubleshoot the Tailwind integration, the team proceeded with inline styles to maintain development velocity.

This created a discrepancy between requirements (Tailwind CSS v4) and implementation (inline styles).

## Decision

We decided to accept inline styles as the official styling approach for this project and update the requirements accordingly, rather than requiring Tailwind CSS v4.

## Rationale

1. **Tailwind CSS v4 Beta Issues**: Tailwind CSS v4 is in beta and has integration issues with Vite
2. **Development Velocity**: Inline styles allowed immediate progress without debugging build configuration
3. **Simplicity**: Inline styles are straightforward and require no build configuration
4. **Bundle Size**: No additional CSS framework dependency reduces bundle size
5. **React Paradigm**: Inline styles align well with React's component-based architecture
6. **Maintainability**: For a project of this size, inline styles are manageable
7. **Performance**: No CSS parsing or class name resolution overhead

## Consequences

### Positive
- No build configuration issues
- Smaller bundle size (no CSS framework)
- Faster development (no class name lookups)
- Direct style-to-component mapping
- No CSS specificity conflicts
- Works immediately without setup

### Negative
- No utility class reusability
- Styles are not easily themeable via CSS variables
- Harder to maintain consistent spacing/sizing scales
- No responsive design utilities (must use media queries manually)
- Verbose component code with style objects
- No design system enforcement

## Implementation

**Current Approach**:
```javascript
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px'
  }
};

<div style={styles.container}>...</div>
```

**Styling Patterns**:
- Style objects defined at component level
- Conditional styles using spread operator
- Theme colors defined as constants
- Responsive behavior via JavaScript (window.innerWidth)

## Alternative Considered

**Option 1: Fix Tailwind CSS v4 Integration**
- Pros: Utility classes, design system, responsive utilities
- Cons: Time investment, beta stability issues, larger bundle
- Rejected: Not worth the time investment for MVP

**Option 2: Use Tailwind CSS v3**
- Pros: Stable, well-documented, proven
- Cons: Still requires build configuration, larger bundle
- Rejected: Inline styles already working

**Option 3: Use CSS Modules**
- Pros: Scoped styles, separate CSS files
- Cons: Additional build step, more files to manage
- Rejected: Inline styles simpler for this project size

## Future Considerations

If the project grows significantly, consider:
1. Migrating to Tailwind CSS v4 (when stable)
2. Implementing CSS-in-JS library (styled-components, emotion)
3. Creating a design system with CSS variables

For MVP, inline styles are sufficient.

## Files Affected

- `.kiro/specs/word-search-game/requirements.md` - Update Requirement 13.5
- `.kiro/specs/word-search-game/design.md` - Update Technology Stack section
- `.kiro/specs/word-search-game/tasks.md` - Update Task 17 (styling tasks)
- All React components - Using inline styles

## Related Requirements

- Requirement 13.5: Styling approach
- Requirement 10.4: Theme application (still achievable with inline styles)
