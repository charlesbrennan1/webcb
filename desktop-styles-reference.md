# Desktop Styles Preservation Reference

This document captures the current desktop appearance that must remain identical after mobile-first conversion.

## Key Desktop Layout Styles (Base - No Media Queries)

### Navigation
- `.nav`: `padding: var(--space-l) var(--space-xl)` (16px 24px)
- `.nav-links`: `display: flex; gap: var(--space-2xl)` (32px gap)
- `.mobile-menu-toggle`: `display: none` (hidden on desktop)

### Hero Section
- `.hero`: Grid layout with side-by-side content and image
- `.hero-actions`: Horizontal button layout
- `.hero-media`: Full size images

### Containers
- `.container`: `max-width: var(--max-width); padding: 0 var(--space-2xl)` (1200px, 32px padding)
- `.work-container`: `padding-top: 80px`

### Typography
- Base font sizes use clamp() for fluid scaling
- h1: `clamp(28px, 6vw, 72px)`
- h2: `clamp(24px, 3.5vw, 40px)`

### Work Cards
- Grid layout with multiple columns
- Full image visibility
- Normal spacing and interactions

## Current Media Query Breakpoints (Desktop-First)
- `@media (max-width: 768px)`: Mobile overrides
- `@media (max-width: 480px)`: Small mobile adjustments

## Key Desktop Behaviors to Preserve
1. Full navigation bar with horizontal links
2. Hero section with side-by-side layout
3. Multi-column work card grids
4. Normal image loading and display
5. Standard button and interaction sizes
6. Proper spacing between sections
7. Fixed header with backdrop blur

## Mobile Overrides That Will Become Base Styles
- Mobile hamburger menu functionality
- Single column layouts
- Centered text alignment
- Smaller images and buttons
- Reduced padding and spacing