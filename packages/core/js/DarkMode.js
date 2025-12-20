/**
 * DarkMode Utility
 * 
 * Centrale dark mode management voor het hele platform
 * Toekomstbestendig met Tailwind dark mode class-strategie
 */

class DarkMode {
    constructor() {
        this.storageKey = 'darkModePreference';
        this.init();
    }

    /**
     * Initialiseer dark mode op basis van voorkeur
     */
    init() {
        // Check localStorage eerst, dan system preference
        const storedPreference = localStorage.getItem(this.storageKey);
        
        if (storedPreference !== null) {
            // Gebruik opgeslagen voorkeur
            this.setDarkMode(storedPreference === 'true');
        } else {
            // Gebruik system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setDarkMode(prefersDark);
            // Sla system preference op
            localStorage.setItem(this.storageKey, prefersDark.toString());
        }

        // Luister naar system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Alleen updaten als gebruiker geen expliciete voorkeur heeft
            if (localStorage.getItem(this.storageKey) === null) {
                this.setDarkMode(e.matches);
            }
        });
    }

    /**
     * Toggle dark mode
     */
    toggle() {
        const isDark = document.documentElement.classList.contains('dark');
        this.setDarkMode(!isDark);
        // Sla voorkeur op
        localStorage.setItem(this.storageKey, (!isDark).toString());
    }

    /**
     * Zet dark mode aan/uit
     * @param {boolean} enabled - True voor dark mode, false voor light mode
     */
    setDarkMode(enabled) {
        if (enabled) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Dispatch event voor andere componenten
        window.dispatchEvent(new CustomEvent('darkModeChange', { 
            detail: { enabled } 
        }));
    }

    /**
     * Check of dark mode actief is
     * @returns {boolean}
     */
    isDark() {
        return document.documentElement.classList.contains('dark');
    }

    /**
     * Reset naar system preference
     */
    resetToSystem() {
        localStorage.removeItem(this.storageKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setDarkMode(prefersDark);
    }
}

// Maak globale instance
if (typeof window !== 'undefined') {
    window.DarkMode = new DarkMode();
}

// Export voor module systemen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkMode;
}

