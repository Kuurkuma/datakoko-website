# CSS Architecture

This project uses a modular CSS architecture for better maintainability and organization.

## Structure

```
css/
├── index.css              # Main entry point - imports all modules
├── modules/               # Modular CSS components
│   ├── variables.css      # CSS custom properties & design tokens
│   ├── base.css           # Base styles & reset
│   ├── layout.css         # Layout & structure
│   ├── header.css         # Header & navigation
│   ├── hero.css           # Hero section & CTA buttons
│   ├── sections.css       # Homepage sections (challenges, approach, services, benefits)
│   ├── tech-stack.css     # Tech stack display
│   ├── footer.css         # Footer styles
│   └── contact.css        # Contact page styles
└── styles.css             # Legacy file (kept for reference)
```

## Usage

The site imports `index.css` which uses `@import` to load all module files:

```html
<link rel="stylesheet" href="/css/index.css">
```

## Module Organization

### 1. Variables (`variables.css`)
- Color palette (light/dark themes)
- Layout tokens (borders, radius, padding)
- Shadows
- Spacing scale

### 2. Base (`base.css`)
- CSS reset
- Base typography
- Body & HTML setup
- Link styles
- Accessibility features

### 3. Layout (`layout.css`)
- Main content padding
- Container
- Page headers
- Breadcrumbs
- Section spacing

### 4. Components (`header.css`, `hero.css`, etc.)
- Individual UI components
- Self-contained styles
- Component-specific responsive rules

## Adding New Styles

1. Identify which module the styles belong to
2. Add styles to the appropriate module file
3. If creating a new component, create a new module file
4. Import the new module in `index.css`

## Naming Conventions

- **BEM-style** for component-specific classes: `.component-name`, `.component-name__element`, `.component-name--modifier`
- **Utility classes**: Use existing CSS variables
- **Semantic naming**: Describe what something *is*, not what it *looks like*

## Design Tokens

All design tokens are defined in `variables.css` as CSS custom properties:

```css
var(--primary-color)
var(--space-4)
var(--shadow-md)
etc.
```

Always use design tokens instead of hardcoded values for consistency.

## Dark Mode

Dark mode is handled automatically using `prefers-color-scheme` media query in `variables.css`. Color tokens automatically switch based on user preferences.
