/**
 * NavigationRenderer
 * 
 * Verantwoordelijk voor het renderen van navigatie buttons (vorige/volgende module)
 * Gebruikt NavigationService om vorige/volgende module data op te halen
 */

class NavigationRenderer {
    /**
     * Constructor
     * @param {NavigationService} navigationService - Service voor navigatie tussen modules
     * @param {string} moduleId - Huidige module ID
     */
    constructor(navigationService, moduleId) {
        this.navigationService = navigationService;
        this.moduleId = moduleId;
    }

    /**
     * Render navigatie buttons
     * @returns {string} HTML string voor navigatie buttons
     */
    renderNavigation() {
        const prevModule = this.navigationService.getPreviousModule(this.moduleId);
        const nextModule = this.navigationService.getNextModule(this.moduleId);

        return `
            <div class="mt-12 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                ${prevModule ? `
                    <button class="nav-button flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 w-full sm:w-auto bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus-ring transition-colors" data-spa-route="${prevModule.id}" href="${prevModule.href}">
                        <i class="fas fa-arrow-left"></i>
                        <span>Vorige: ${prevModule.title}</span>
                    </button>
                ` : `
                    <button class="nav-button flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 w-full sm:w-auto bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus-ring transition-colors" data-spa-route="start" href="index.html">
                        <i class="fas fa-arrow-left"></i>
                        <span>Terug naar Start</span>
                    </button>
                `}
                
                ${nextModule ? `
                    <button class="nav-button flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 w-full sm:w-auto bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus-ring transition-colors" data-spa-route="${nextModule.id}" href="${nextModule.href}">
                        <span>Volgende: ${nextModule.title}</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                ` : `
                    <div></div>
                `}
            </div>
        `;
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationRenderer;
} else {
    window.NavigationRenderer = NavigationRenderer;
}
