# Theme System Usage

This project now includes a Redux-based theme switching system that allows users to toggle between light and dark themes.

## Features

- **Automatic Theme Detection**: Detects user's system preference on first visit
- **Persistent Storage**: Remembers user's theme choice in localStorage
- **CSS Variables**: Uses CSS custom properties for consistent theming
- **Smooth Transitions**: Includes transition effects when switching themes

## How to Use

### 1. Basic Theme Toggle Component

Import and use the `ThemeToggle` component anywhere in your app:

```tsx
import ThemeToggle from '../components/shared/ThemeToggle';

const MyComponent = () => {
    return (
        <div>
            <h1>My Component</h1>
            <ThemeToggle />
        </div>
    );
};
```

### 2. Using the useTheme Hook

For more control over theme state and actions:

```tsx
import { useTheme } from '../hooks/useTheme';

const MyComponent = () => {
    const { currentTheme, toggle, set, isDark, isLight } = useTheme();

    return (
        <div>
            <p>Current theme: {currentTheme}</p>
            <button onClick={toggle}>Toggle Theme</button>
            <button onClick={() => set('light')}>Force Light</button>
            <button onClick={() => set('dark')}>Force Dark</button>

            {isDark && <p>Dark mode is active</p>}
            {isLight && <p>Light mode is active</p>}
        </div>
    );
};
```

### 3. CSS Classes and Variables

The theme system automatically adds/removes the `dark` class on the `html` element. Use these CSS classes for theming:

```css
/* Light theme (default) */
:root {
    --color-primary: #042c28;
    --color-secondary: #00c7c8;
}

/* Dark theme */
.dark {
    --color-primary: #00c7c8;
    --color-secondary: #602eaf;
}
```

### 4. Tailwind CSS Dark Mode

Since the system adds the `dark` class to the HTML element, you can use Tailwind's dark mode utilities:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    Content that adapts to theme
</div>
```

## Redux Store Structure

The theme state is stored in Redux under the `theme` slice:

```typescript
interface ThemeState {
    currentTheme: 'light' | 'dark';
}
```

### Available Actions

- `toggleTheme()`: Switches between light and dark themes
- `setTheme(theme: 'light' | 'dark')`: Sets a specific theme

## File Structure

```
src/
├── store/
│   ├── themeSlice.ts      # Theme Redux slice
│   └── index.ts           # Store configuration
├── components/shared/
│   └── ThemeToggle.tsx    # Theme toggle component
├── hooks/
│   └── useTheme.ts        # Custom theme hook
└── theme.css              # CSS variables and theme styles
```

## Example Implementation

The homepage (`src/pages/public/Homepage.tsx`) demonstrates how to implement the theme toggle with proper styling and transitions.

## Browser Support

- Modern browsers with CSS custom properties support
- Automatic fallback to light theme for unsupported browsers
- System preference detection for initial theme selection
