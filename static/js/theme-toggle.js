/**
 * Theme Toggle Component
 * Manages auto/light/dark theme switching with localStorage persistence
 */

// Initialize theme on page load
(function() {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    applyTheme(savedTheme);
})();

function applyTheme(theme) {
    if (theme === 'auto') {
        // Remove data-theme attribute to use CSS media query
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
    initThemeToggle();
}

function initThemeToggle() {
    const themeOptions = document.querySelectorAll('.theme-option');
    if (themeOptions.length === 0) return;

    // Set initial state
    updateThemeButtons();

    // Handle theme option clicks
    themeOptions.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            localStorage.setItem('theme', theme);
            applyTheme(theme);
            updateThemeButtons();
        });
    });

    // Listen to system theme changes when in auto mode
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', () => {
        const savedTheme = localStorage.getItem('theme') || 'auto';
        if (savedTheme === 'auto') {
            // Force a re-render by toggling a class
            document.documentElement.classList.add('theme-transitioning');
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transitioning');
            }, 10);
        }
    });
}

function updateThemeButtons() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const savedTheme = localStorage.getItem('theme') || 'auto';

    themeOptions.forEach(button => {
        const buttonTheme = button.getAttribute('data-theme');
        if (buttonTheme === savedTheme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}
