# Decision Record: Adopt Tailwind CSS v4 for Styling

**Date:** 2026-02-08  
**Status:** Accepted  
**Decision Maker:** Development Team

## Context

Decision Record 004 established inline styles as the official styling approach after Tailwind CSS v4 (beta) integration issues. However, during implementation, the team successfully integrated Tailwind CSS v4 with Vite and found it provided significant benefits over inline styles.

The application was initially styled with inline styles, but the team decided to convert all components to use Tailwind CSS v4 utility classes instead.

## Decision

We decided to adopt Tailwind CSS v4 as the official styling approach for this project, reversing Decision Record 004.

## Rationale

1. **Integration Success**: Tailwind CSS v4 now works properly with Vite using the @tailwindcss/vite plugin
2. **Utility-First Benefits**: Tailwind's utility classes provide faster development and better consistency
3. **Design System**: Built-in spacing, color, and sizing scales enforce design consistency
4. **Responsive Design**: Responsive utilities (sm:, md:, lg:) are easier than JavaScript media queries
5. **Maintainability**: Utility classes are more maintainable than scattered inline style objects
6. **Theme Support**: CSS variables integrate well with Tailwind for light/dark theme switching
7. **Bundle Optimization**: Tailwind's purge feature removes unused CSS in production

## Consequences

### Positive
- Consistent design system with spacing/sizing scales
- Faster development with utility classes
- Better responsive design support
- Easier theme customization via CSS variables
- Smaller production bundle (unused CSS purged)
- Industry-standard approach (easier onboarding)

### Negative
- Larger development bundle (full Tailwind CSS)
- Learning curve for Tailwind utility classes
- Verbose className strings in JSX
- Build configuration required

## Implementation

**Tailwind Configuration**:
```javascript
// vite.config.js
import tailwindcss from '@tailwindcss/vite';

export default {
  plugins: [react(), tailwindcss()]
};
```

**Theme Variables** (src/index.css):
```css
@import "tailwindcss";

:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --accent-color: #4a90e2;
  /* ... */
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #e0e0e0;
  --accent-color: #64b5f6;
  /* ... */
}

.bg-primary { background-color: var(--bg-primary) !important; }
.bg-secondary { background-color: var(--bg-secondary) !important; }
.text-primary { color: var(--text-primary) !important; }
/* ... */
```

**Component Example**:
```jsx
<div className="min-h-screen bg-primary p-5">
  <div className="max-w-[800px] mx-auto bg-secondary p-10 rounded-lg">
    <h1 className="text-5xl accent-color mb-2.5">Word Search</h1>
  </div>
</div>
```

## Migration Process

All components were converted from inline styles to Tailwind CSS:
1. Replaced inline style objects with className strings
2. Created custom CSS utility classes for theme-aware colors
3. Used Tailwind responsive utilities instead of JavaScript media queries
4. Maintained visual consistency during conversion
5. Verified all 530 tests still pass after conversion

## Reverses

This decision **reverses Decision Record 004** (Use Inline Styles Instead of Tailwind CSS v4).

## Files Affected

- `.kiro/specs/word-search-game/requirements.md` - Updated Requirement 13.5
- `.kiro/specs/word-search-game/design.md` - Updated Technology Stack section
- `.kiro/specs/word-search-game/tasks.md` - Updated Task 17 (styling tasks)
- `src/index.css` - Tailwind configuration and theme variables
- All React components - Converted to Tailwind utility classes

## Related Requirements

- Requirement 13.5: Styling approach (now Tailwind CSS v4)
- Requirement 10.4: Theme application (using CSS variables with Tailwind)

## Future Considerations

- Consider creating a custom Tailwind plugin for theme utilities
- Explore Tailwind's JIT mode for faster development builds
- Document common utility class patterns for team consistency
