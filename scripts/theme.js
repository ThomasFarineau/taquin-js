document.addEventListener('DOMContentLoaded', () => {
    applyInitialTheme();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        updateThemeBasedOnSystemPreference();
    });
});

document.querySelector('.theme-switcher').addEventListener('click', () => {
    const isDarkMode = localStorage.getItem('dark-mode') === 'true';
    if (isDarkMode) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('dark-mode', 'false');
    } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.setItem('dark-mode', 'true');
    }
})

function applyInitialTheme() {
    const cachedTheme = localStorage.getItem('dark-mode');
    if (cachedTheme) {
        document.documentElement.classList.add(cachedTheme === 'true' ? 'dark' : 'light');
    } else {
        updateThemeBasedOnSystemPreference();
    }
}

function updateThemeBasedOnSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('dark-mode', 'true');
    } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        localStorage.setItem('dark-mode', 'false');
    }
}
