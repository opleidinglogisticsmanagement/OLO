/**
 * HeaderManager
 * 
 * Handles all header-related functionality including:
 * - Global search functionality
 * - Dark mode toggle
 */

class HeaderManager {
    constructor() {
        // Geen constructor parameters nodig
    }

    /**
     * Initialiseer alle header functionaliteit
     * Moet worden aangeroepen nadat de DOM geladen is
     */
    async init() {
        await this.setupSearchFunctionality();
        this.setupDarkModeToggle();
    }

    /**
     * Setup global search functionality
     */
    async setupSearchFunctionality() {
        const searchInput = document.getElementById('global-search-input');
        const resultsDropdown = document.getElementById('search-results-dropdown');
        const searchToggleBtn = document.getElementById('search-toggle-btn');
        const searchOverlay = document.getElementById('search-overlay');
        const closeSearchBtn = document.getElementById('close-search-btn');
        
        if (!searchInput || !resultsDropdown) return;
        
        // Initialize search service (lazy load)
        if (window.SearchService && !window.SearchService.isInitialized) {
            // Start init in background
            window.SearchService.init().catch(console.error);
        }
        
        // Toggle Search Overlay Logic
        if (searchToggleBtn && searchOverlay) {
            const openSearch = () => {
                searchOverlay.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
                searchOverlay.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
                // Focus input after transition starts
                setTimeout(() => searchInput.focus(), 50);
            };

            const closeSearch = () => {
                searchOverlay.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
                searchOverlay.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                // Optional: Clear results when closing, but keep query text for now
                resultsDropdown.classList.add('hidden');
            };

            searchToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openSearch();
            });

            if (closeSearchBtn) {
                closeSearchBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeSearch();
                });
            }
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !searchOverlay.classList.contains('opacity-0')) {
                    closeSearch();
                }
            });
        }
        
        let debounceTimer;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (query.length < 2) {
                    resultsDropdown.classList.add('hidden');
                    resultsDropdown.innerHTML = '';
                    return;
                }
                
                if (window.SearchService) {
                    // Ensure initialized
                    if (!window.SearchService.isInitialized) {
                        window.SearchService.init().then(() => {
                            this.performSearch(query, resultsDropdown);
                        });
                    } else {
                        this.performSearch(query, resultsDropdown);
                    }
                }
            }, 300);
        });
        
        // Close dropdown on click outside
        document.addEventListener('click', (e) => {
            // Check if click is outside search input and dropdown
            const isOutsideSearch = !searchInput.contains(e.target) && !resultsDropdown.contains(e.target);
            
            // Also check if it's outside the toggle button (to prevent immediate closing when opening)
            const isOutsideToggle = !searchToggleBtn || !searchToggleBtn.contains(e.target);
            
            // If we have an overlay, check if we clicked the overlay background (outside the input container)
            // The input container is the first child of overlay
            let isOutsideContainer = true;
            if (searchOverlay && searchOverlay.contains(e.target)) {
                const container = searchOverlay.firstElementChild;
                if (container && container.contains(e.target)) {
                    isOutsideContainer = false;
                }
            }

            if (isOutsideSearch && isOutsideToggle) {
                resultsDropdown.classList.add('hidden');
                
                // If we clicked on the overlay background (and not the input container), close the whole search
                if (searchOverlay && !searchOverlay.classList.contains('opacity-0') && e.target === searchOverlay) {
                    searchOverlay.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
                    searchOverlay.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                }
            }
        });
        
        // Show results again on focus if there is a query
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.length >= 2 && resultsDropdown.children.length > 0) {
                resultsDropdown.classList.remove('hidden');
            }
        });
    }

    /**
     * Perform search and render results
     */
    performSearch(query, container) {
        const results = window.SearchService.search(query);
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Geen resultaten gevonden voor "${query}"
                </div>
            `;
        } else {
            container.innerHTML = results.map(result => `
                <a href="${result.url}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-blue-600 dark:text-blue-400">${result.context || result.week}</span>
                        <span class="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full uppercase tracking-wider">${result.type}</span>
                    </div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">${result.title}</div>
                    ${result.snippet ? `<div class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">${result.snippet}</div>` : ''}
                </a>
            `).join('');
        }
        
        container.classList.remove('hidden');
    }

    /**
     * Setup dark mode toggle functionality
     */
    setupDarkModeToggle() {
        // Retry mechanisme - wacht tot DarkMode.js geladen is
        const trySetup = (attempts = 0) => {
            const darkModeToggle = document.getElementById('dark-mode-toggle');
            const sunIcon = document.getElementById('dark-mode-icon-sun');
            const moonIcon = document.getElementById('dark-mode-icon-moon');
            
            if (!darkModeToggle) {
                // Toggle button bestaat nog niet (mogelijk nog niet gerenderd)
                if (attempts < 10) {
                    setTimeout(() => trySetup(attempts + 1), 100);
                }
                return;
            }
            
            if (window.DarkMode) {
                // Update icons on initial load
                this.updateDarkModeIcons(sunIcon, moonIcon);
                
                // Toggle dark mode on click
                darkModeToggle.addEventListener('click', () => {
                    window.DarkMode.toggle();
                    this.updateDarkModeIcons(sunIcon, moonIcon);
                });
                
                // Listen for dark mode changes (e.g., from other pages or system preference)
                window.addEventListener('darkModeChange', () => {
                    this.updateDarkModeIcons(sunIcon, moonIcon);
                });
            } else {
                // DarkMode.js nog niet geladen, probeer opnieuw
                if (attempts < 10) {
                    setTimeout(() => trySetup(attempts + 1), 100);
                } else {
                    console.warn('DarkMode.js kon niet worden geladen na 10 pogingen');
                }
            }
        };
        
        // Start setup (met kleine delay om zeker te zijn dat DOM klaar is)
        setTimeout(() => trySetup(), 50);
    }

    /**
     * Update dark mode icons based on current state
     */
    updateDarkModeIcons(sunIcon, moonIcon) {
        if (!sunIcon || !moonIcon || !window.DarkMode) return;
        
        const isDark = window.DarkMode.isDark();
        
        if (isDark) {
            // Dark mode: show moon, hide sun
            sunIcon.classList.add('rotate-90', 'scale-0', 'opacity-0');
            sunIcon.classList.remove('rotate-0', 'scale-100', 'opacity-100');
            moonIcon.classList.remove('rotate-0', 'scale-0', 'opacity-0');
            moonIcon.classList.add('rotate-0', 'scale-100', 'opacity-100');
        } else {
            // Light mode: show sun, hide moon
            sunIcon.classList.remove('rotate-90', 'scale-0', 'opacity-0');
            sunIcon.classList.add('rotate-0', 'scale-100', 'opacity-100');
            moonIcon.classList.add('rotate-0', 'scale-0', 'opacity-0');
            moonIcon.classList.remove('rotate-0', 'scale-100', 'opacity-100');
        }
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderManager;
} else {
    window.HeaderManager = HeaderManager;
}
