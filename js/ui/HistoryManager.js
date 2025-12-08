/**
 * HistoryManager
 * 
 * Manager voor browser History API integratie
 * Handelt URL updates af zonder page reload en browser back/forward navigatie
 * Werkt samen met RouterService en ContentLoaderService voor SPA navigatie
 * 
 * Dit is onderdeel van de SPA implementatie - Fase 2.3
 */

class HistoryManager {
    constructor(routerService, contentLoaderService) {
        this.routerService = routerService;
        this.contentLoaderService = contentLoaderService;
        this.isNavigating = false; // Flag om dubbele navigatie te voorkomen
        this.onNavigateCallback = null; // Callback voor wanneer navigatie gebeurt
        this.popStateHandler = null; // Reference naar popstate handler voor cleanup
    }

    /**
     * Initialiseer de History Manager
     * Luistert naar popstate events (browser back/forward)
     * Slaat callback op voor navigatie events
     * Roept handleInitialRoute() aan voor eerste load
     * 
     * @param {Function} onNavigateCallback - Callback functie die wordt aangeroepen bij navigatie
     *                                        Callback ontvangt { moduleId, hash }
     */
    init(onNavigateCallback) {
        if (!onNavigateCallback || typeof onNavigateCallback !== 'function') {
            throw new Error('HistoryManager.init() requires a valid callback function');
        }

        this.onNavigateCallback = onNavigateCallback;

        // Luister naar popstate events (browser back/forward)
        this.popStateHandler = (event) => this.handlePopState(event);
        window.addEventListener('popstate', this.popStateHandler);

        // Handle initial route (bij eerste page load)
        const initialRoute = this.handleInitialRoute();
        
        // Gebruik replaceState voor eerste load om dubbele history entry te voorkomen
        if (initialRoute.moduleId) {
            const url = this.moduleIdToUrl(initialRoute.moduleId, initialRoute.hash);
            const state = { moduleId: initialRoute.moduleId, hash: initialRoute.hash };
            window.history.replaceState(state, '', url);
        }

        return initialRoute;
    }

    /**
     * Bepaal de huidige route bij page load
     * Gebruikt routerService.getCurrentRoute() om huidige URL te parsen
     * Retourneert { moduleId, hash } voor eerste load
     * Handelt direct URL access af (bijv. gebruiker opent '/week2.html' direct)
     * 
     * @returns {Object} Object met moduleId en hash properties
     */
    handleInitialRoute() {
        try {
            const route = this.routerService.getCurrentRoute();
            
            // Valideer dat de route bestaat
            if (route.moduleId && !this.routerService.isValidRoute(route.moduleId)) {
                console.warn(`[HistoryManager] Invalid route on initial load: ${route.moduleId}, defaulting to start`);
                return { moduleId: 'start', hash: null };
            }

            return route;
        } catch (error) {
            console.error('[HistoryManager] Error handling initial route:', error);
            // Fallback naar start pagina
            return { moduleId: 'start', hash: null };
        }
    }

    /**
     * Navigeer naar een nieuwe route zonder page reload
     * Gebruikt pushState (of replaceState als replace = true)
     * Update URL in browser zonder reload
     * Roept onNavigateCallback aan met { moduleId, hash }
     * 
     * @param {string} moduleId - De module ID om naar te navigeren (e.g., 'week-2', 'start')
     * @param {string|null} hash - Optionele hash anchor (e.g., '#probleem-verkennen')
     * @param {boolean} replace - Als true, gebruik replaceState i.p.v. pushState (geen history entry)
     * @throws {Error} Als route niet bestaat
     */
    navigate(moduleId, hash = null, replace = false) {
        // Valideer route
        if (!this.routerService.isValidRoute(moduleId)) {
            throw new Error(`Invalid route: ${moduleId}`);
        }

        // Voorkom dubbele navigatie
        if (this.isNavigating) {
            console.warn('[HistoryManager] Navigation already in progress, ignoring duplicate call');
            return;
        }

        this.isNavigating = true;

        try {
            // Converteer moduleId naar URL format
            const url = this.moduleIdToUrl(moduleId, hash);
            
            // Maak state object voor history
            const state = { moduleId, hash };

            // Update browser history
            if (replace) {
                window.history.replaceState(state, '', url);
            } else {
                window.history.pushState(state, '', url);
            }

            // Roep callback aan voor navigatie
            if (this.onNavigateCallback) {
                this.onNavigateCallback(moduleId, hash);
            }
        } catch (error) {
            console.error(`[HistoryManager] Error navigating to ${moduleId}:`, error);
            throw error;
        } finally {
            this.isNavigating = false;
        }
    }

    /**
     * Event handler voor browser back/forward
     * Parse URL uit event.state of window.location
     * Roept onNavigateCallback aan met nieuwe route
     * Zorgt dat content wordt geladen bij back/forward
     * 
     * @param {PopStateEvent} event - Het popstate event
     */
    handlePopState(event) {
        try {
            let moduleId = null;
            let hash = null;

            // Probeer state uit event te halen (als we die hebben opgeslagen)
            if (event.state && event.state.moduleId) {
                moduleId = event.state.moduleId;
                hash = event.state.hash || null;
            } else {
                // Fallback: parse huidige URL
                const route = this.routerService.getCurrentRoute();
                moduleId = route.moduleId;
                hash = route.hash;
            }

            // Valideer route
            if (!moduleId || !this.routerService.isValidRoute(moduleId)) {
                console.warn(`[HistoryManager] Invalid route in popstate: ${moduleId}, defaulting to start`);
                moduleId = 'start';
                hash = null;
            }

            // Voorkom dubbele navigatie
            if (this.isNavigating) {
                return;
            }

            this.isNavigating = true;

            try {
                // Roep callback aan voor navigatie
                if (this.onNavigateCallback) {
                    this.onNavigateCallback(moduleId, hash);
                }
            } catch (error) {
                console.error('[HistoryManager] Error handling popstate:', error);
            } finally {
                this.isNavigating = false;
            }
        } catch (error) {
            console.error('[HistoryManager] Error in handlePopState:', error);
            // Fallback naar start pagina
            if (this.onNavigateCallback) {
                this.onNavigateCallback('start', null);
            }
        }
    }

    /**
     * Helper om huidige URL te krijgen
     * Retourneert { pathname, hash } object
     * Gebruikt window.location.pathname en window.location.hash
     * 
     * @returns {Object} Object met pathname en hash properties
     */
    getCurrentUrl() {
        return {
            pathname: window.location.pathname,
            hash: window.location.hash || null
        };
    }

    /**
     * Update alleen de URL zonder navigatie callback
     * Handig voor URL updates zonder content reload (bijv. anchor scrolling)
     * Gebruikt pushState of replaceState
     * 
     * @param {string} moduleId - De module ID
     * @param {string|null} hash - Optionele hash anchor
     * @param {boolean} replace - Als true, gebruik replaceState i.p.v. pushState
     */
    updateUrl(moduleId, hash = null, replace = false) {
        // Valideer route
        if (!this.routerService.isValidRoute(moduleId)) {
            console.warn(`[HistoryManager] Cannot update URL for invalid route: ${moduleId}`);
            return;
        }

        try {
            const url = this.moduleIdToUrl(moduleId, hash);
            const state = { moduleId, hash };

            if (replace) {
                window.history.replaceState(state, '', url);
            } else {
                window.history.pushState(state, '', url);
            }
        } catch (error) {
            console.error(`[HistoryManager] Error updating URL for ${moduleId}:`, error);
        }
    }

    /**
     * Converteer moduleId naar URL format
     * Helper method voor interne gebruik
     * 
     * @param {string} moduleId - De module ID
     * @param {string|null} hash - Optionele hash anchor
     * @returns {string} URL string (bijv. '/week2.html' of '/week2.html#probleem-verkennen')
     */
    moduleIdToUrl(moduleId, hash = null) {
        // Mapping van moduleId naar filename
        const moduleIdToFilename = {
            'start': 'index.html',
            'week-1': 'week1.html',
            'week-2': 'week2.html',
            'week-3': 'week3.html',
            'week-4': 'week4.html',
            'week-5': 'week5.html',
            'week-6': 'week6.html',
            'week-7': 'week7.html',
            'register': 'register.html',
            'afsluiting': 'afsluiting.html'
        };

        const filename = moduleIdToFilename[moduleId];
        
        if (!filename) {
            throw new Error(`Unknown moduleId: ${moduleId}`);
        }

        // Voor start pagina, gebruik '/' of '/index.html'
        if (moduleId === 'start') {
            return hash ? `/${hash}` : '/';
        }

        // Voor andere pagina's, gebruik '/filename.html' of '/filename.html#hash'
        return hash ? `/${filename}${hash}` : `/${filename}`;
    }

    /**
     * Cleanup method om event listeners te verwijderen
     * Handig voor testing of wanneer HistoryManager niet meer nodig is
     */
    destroy() {
        if (this.popStateHandler) {
            window.removeEventListener('popstate', this.popStateHandler);
            this.popStateHandler = null;
        }
        this.onNavigateCallback = null;
        this.isNavigating = false;
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryManager;
} else {
    window.HistoryManager = HistoryManager;
}
