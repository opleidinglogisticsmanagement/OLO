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
        this.navConfig = this.getNavigationConfig();
    }

    /**
     * Haal navigatie configuratie op uit AppConfig
     * @returns {Object|null} Navigatie configuratie of null
     */
    getNavigationConfig() {
        // Lees configuratie opnieuw bij elke call (voor dynamische updates)
        if (typeof window !== 'undefined' && window.AppConfig && window.AppConfig.navigation) {
            return window.AppConfig.navigation;
        }
        return null;
    }

    /**
     * Genereer button tekst op basis van configuratie
     * @param {string} type - 'previous' of 'next'
     * @param {Object|null} module - Module object of null
     * @returns {string} Button tekst
     */
    getButtonText(type, module) {
        // Als er configuratie is, gebruik die
        if (this.navConfig && this.navConfig.buttonTexts) {
            if (type === 'previous') {
                return module ? this.navConfig.buttonTexts.previous : this.navConfig.buttonTexts.backToStart;
            }
            if (type === 'next') {
                return module ? this.navConfig.buttonTexts.next : '';
            }
        }
        
        // Fallback naar standaard gedrag (backward compatibility)
        if (type === 'previous') {
            return module ? `Vorige: ${module.title}` : 'Terug naar Start';
        }
        if (type === 'next') {
            return module ? `Volgende: ${module.title}` : '';
        }
        
        return '';
    }

    /**
     * Render navigatie buttons
     * @returns {string} HTML string voor navigatie buttons
     */
    renderNavigation() {
        // Lees configuratie opnieuw (kan zijn veranderd)
        this.navConfig = this.getNavigationConfig();
        
        const prevModule = this.navigationService.getPreviousModule(this.moduleId);
        const nextModule = this.navigationService.getNextModule(this.moduleId);

        const prevButtonText = this.getButtonText('previous', prevModule);
        const nextButtonText = this.getButtonText('next', nextModule);

        return `
            <div class="mt-12 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                ${prevModule ? `
                    <button class="nav-button flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 w-full sm:w-auto bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus-ring transition-colors" data-nav-href="${prevModule.href}">
                        <i class="fas fa-arrow-left"></i>
                        <span>${prevButtonText}</span>
                    </button>
                ` : `
                    <button class="nav-button flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 w-full sm:w-auto bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus-ring transition-colors" data-nav-href="index.html">
                        <i class="fas fa-arrow-left"></i>
                        <span>${prevButtonText}</span>
                    </button>
                `}
                
                ${nextModule ? `
                    <button class="nav-button flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 w-full sm:w-auto bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus-ring transition-colors" data-nav-href="${nextModule.href}">
                        <span>${nextButtonText}</span>
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
