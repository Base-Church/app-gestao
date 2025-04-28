// Check system preference for dark mode
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}

// Toggle dark mode
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

// Menu Toggle
const menuButton = document.getElementById('menu-button');
const menuDropdown = document.getElementById('menu-dropdown');
const musicOnlyOption = document.getElementById('music-only-option');

// Show/hide menu
menuButton.addEventListener('click', () => {
    menuDropdown.classList.toggle('hidden');
});

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
        menuDropdown.classList.add('hidden');
    }
});

// Show "Adicionar repertório" option only for music prefix
const urlParams = new URLSearchParams(window.location.search);
const escalaCode = urlParams.get('ec');
if (escalaCode && escalaCode.startsWith('music-')) {
    musicOnlyOption.classList.remove('hidden');
}