/**
 * NavigationService
 * 
 * Service voor navigatie tussen modules
 * Bevat de modules array en methods om vorige/volgende module op te halen
 */

class NavigationService {
    constructor() {
        // Definieer modules array één keer
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



