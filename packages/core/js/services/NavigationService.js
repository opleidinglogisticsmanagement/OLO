/**
 * NavigationService
 * 
 * Service voor navigatie tussen modules
 * Bevat de modules array en methods om vorige/volgende module op te halen
 */

class NavigationService {
    constructor() {
        // Detect which app we're in based on URL path
        const pathname = window.location.pathname;
        if (pathname.includes('operations-management')) {
            this.appId = 'operations-management';
            this.modules = this.getOperationsManagementModules();
        } else {
            // Default modules voor logistiek-onderzoek en andere apps
            this.appId = 'logistiek-onderzoek';
            this.modules = [
                { id: 'week-1', title: 'Week 1', href: 'week1.html' },
                { id: 'week-2', title: 'Week 2', href: 'week2.html' },
                { id: 'week-3', title: 'Week 3', href: 'week3.html' },
                { id: 'week-4', title: 'Week 4', href: 'week4.html' },
                { id: 'week-5', title: 'Week 5', href: 'week5.html' },
                { id: 'week-6', title: 'Week 6', href: 'week6.html' },
                { id: 'week-7', title: 'Week 7', href: 'week7.html' },
                { id: 'register', title: 'Begrippenlijst', href: 'register.html' },
                { id: 'afsluiting', title: 'Afsluiting', href: 'afsluiting.html' }
            ];
        }
    }

    /**
     * Get modules array for Operations Management app
     * @returns {Array} Modules array
     */
    getOperationsManagementModules() {
        return [
            { id: 'start', title: 'Start', href: 'index.html' },
            { id: 'operations-processtrategie', title: 'Operations en processtrategie', href: 'operations-processtrategie.html' },
            { id: 'vraagvoorspelling-deel1', title: 'Vraagvoorspelling (deel 1)', href: 'vraagvoorspelling-deel1.html' },
            { id: 'vraagvoorspelling-deel2', title: 'Vraagvoorspelling (deel 2)', href: 'vraagvoorspelling-deel2.html' },
            { id: 'productieplanning', title: 'Productieplanning', href: 'productieplanning.html' },
            { id: 'voorraadbeheer-deel1', title: 'Voorraadbeheer (deel 1)', href: 'voorraadbeheer-deel1.html' },
            { id: 'voorraadbeheer-deel2', title: 'Voorraadbeheer (deel 2)', href: 'voorraadbeheer-deel2.html' },
            { id: 'voorraadbeheer-deel3', title: 'Voorraadbeheer (deel 3)', href: 'voorraadbeheer-deel3.html' },
            { id: 'capaciteitsmanagement-deel1', title: 'Capaciteitsmanagement (deel 1)', href: 'capaciteitsmanagement-deel1.html' },
            { id: 'capaciteitsmanagement-deel2', title: 'Capaciteitsmanagement (deel 2)', href: 'capaciteitsmanagement-deel2.html' },
            { id: 'operations-planning-scheduling', title: 'Operations planning en scheduling', href: 'operations-planning-scheduling.html' }
        ];
    }

    /**
     * Get previous module
     * @param {string} moduleId - Current module ID
     * @returns {Object|null} Previous module object or null
     */
    getPreviousModule(moduleId) {
        const currentIndex = this.modules.findIndex(module => module.id === moduleId);
        return this.modules[currentIndex - 1] || null;
    }

    /**
     * Get next module
     * @param {string} moduleId - Current module ID
     * @returns {Object|null} Next module object or null
     */
    getNextModule(moduleId) {
        const currentIndex = this.modules.findIndex(module => module.id === moduleId);
        return this.modules[currentIndex + 1] || null;
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationService;
} else {
    window.NavigationService = NavigationService;
}





