/**
 * RouterService
 * 
 * Service voor route definitie en URL parsing
 * Definieert routes en bepaalt welke pagina te laden op basis van de URL
 * Dit is de basis voor de SPA functionaliteit
 */

class RouterService {
    constructor() {
        // Definieer routes: moduleId → { pageClass, title, subtitle, isDashboard }
        this.routes = {
            'start': { 
                pageClass: null, // index.html is geen BaseLessonPage
                title: 'Start',
                isDashboard: true 
            },
            'week-1': { 
                pageClass: Week1LessonPage,
                title: 'Week 1',
                subtitle: 'Neuro-psycho-immunologie'
            },
            'week-2': { 
                pageClass: Week2LessonPage,
                title: 'Week 2',
                subtitle: 'Onderzoek uitvoeren'
            },
            'week-3': { 
                pageClass: Week3LessonPage,
                title: 'Week 3',
                subtitle: 'Onderzoeksmodel + Onderzoeksvragen'
            },
            'week-4': { 
                pageClass: Week4LessonPage,
                title: 'Week 4',
                subtitle: 'Begripsbepaling + Voorbereiding literatuuronderzoek'
            },
            'week-5': { 
                pageClass: Week5LessonPage,
                title: 'Week 5',
                subtitle: 'Uitvoeren literatuuronderzoek + Theoretisch kader'
            },
            'week-6': { 
                pageClass: Week6LessonPage,
                title: 'Week 6',
                subtitle: 'Onderzoeksstrategie + dataverzamelingsplan'
            },
            'week-7': { 
                pageClass: Week7LessonPage,
                title: 'Week 7',
                subtitle: 'Rapportage'
            },
            'register': { 
                pageClass: RegisterPage,
                title: 'Begrippenlijst',
                subtitle: 'Alle belangrijke concepten'
            },
            'afsluiting': { 
                pageClass: AfsluitingLessonPage,
                title: 'Afsluiting',
                subtitle: 'Eindbeoordeling & Certificering'
            }
        };
    }

    /**
     * Get route configuration for a moduleId
     * @param {string} moduleId - The module ID (e.g., 'week-1', 'start')
     * @returns {Object|null} Route configuration or null if route doesn't exist
     */
    getRoute(moduleId) {
        return this.routes[moduleId] || null;
    }

    /**
     * Parse a URL to extract moduleId and hash
     * Supports various URL formats:
     * - 'week1.html' → { moduleId: 'week-1', hash: null }
     * - 'week2.html#probleem-verkennen' → { moduleId: 'week-2', hash: '#probleem-verkennen' }
     * - 'index.html' → { moduleId: 'start', hash: null }
     * - '/week3.html' → { moduleId: 'week-3', hash: null }
     * - '/week4.html#section' → { moduleId: 'week-4', hash: '#section' }
     * - '/' or '' → { moduleId: 'start', hash: null }
     * - '#section' → { moduleId: null, hash: '#section' }
     * 
     * @param {string} url - URL to parse (pathname or full URL)
     * @returns {Object} Object with moduleId and hash properties
     */
    parseUrl(url) {
        // Handle empty or null URL - default to start
        if (!url || url === '') {
            return { moduleId: 'start', hash: null };
        }

        // Extract pathname if full URL is provided
        let pathname = url;
        let hash = null;

        // Check if URL contains hash
        const hashIndex = url.indexOf('#');
        if (hashIndex !== -1) {
            pathname = url.substring(0, hashIndex);
            hash = url.substring(hashIndex);
        }

        // Remove leading slash if present
        pathname = pathname.replace(/^\//, '');

        // If pathname is empty or just '/', default to start (root/index)
        if (!pathname || pathname === '') {
            return { moduleId: 'start', hash: hash || null };
        }

        // Extract filename
        const filename = pathname.split('/').pop() || pathname;

        // Map filenames to module IDs
        const filenameToModuleId = {
            'index.html': 'start',
            'week1.html': 'week-1',
            'week2.html': 'week-2',
            'week3.html': 'week-3',
            'week4.html': 'week-4',
            'week5.html': 'week-5',
            'week6.html': 'week-6',
            'week7.html': 'week-7',
            'register.html': 'register',
            'afsluiting.html': 'afsluiting'
        };

        const moduleId = filenameToModuleId[filename] || null;

        return {
            moduleId: moduleId,
            hash: hash || null
        };
    }

    /**
     * Get current route from window.location
     * Uses window.location.pathname and window.location.hash
     * 
     * @returns {Object} Object with moduleId and hash properties
     */
    getCurrentRoute() {
        const pathname = window.location.pathname;
        const hash = window.location.hash || null;
        
        // Combine pathname and hash for parsing
        const url = pathname + (hash || '');
        
        return this.parseUrl(url);
    }

    /**
     * Navigate to a module (without page reload - to be implemented later)
     * For now: logs the navigation and returns route configuration
     * 
     * @param {string} moduleId - The module ID to navigate to
     * @param {string|null} hash - Optional hash anchor (e.g., '#probleem-verkennen')
     * @returns {Object} Route configuration
     * @throws {Error} If route doesn't exist
     */
    navigateTo(moduleId, hash = null) {
        if (!this.isValidRoute(moduleId)) {
            throw new Error(`Invalid route: ${moduleId}`);
        }

        const route = this.getRoute(moduleId);
        
        // Log navigation (will be replaced with actual navigation in later phases)
        console.log(`[RouterService] Navigate to: ${moduleId}${hash ? hash : ''}`, route);
        
        return route;
    }

    /**
     * Check if a moduleId is a valid route
     * 
     * @param {string} moduleId - The module ID to validate
     * @returns {boolean} True if route exists, false otherwise
     */
    isValidRoute(moduleId) {
        return moduleId in this.routes;
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RouterService;
} else {
    window.RouterService = RouterService;
}
