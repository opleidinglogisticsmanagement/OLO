/**
 * IndexPageButtonUpdater
 * 
 * Utility om de start button tekst op de index pagina te updaten
 * op basis van configuratie in AppConfig.navigation.indexPage.startButton
 */

class IndexPageButtonUpdater {
    /**
     * Update de start button tekst op de index pagina
     */
    static updateStartButton() {
        // Wacht tot DOM geladen is
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateStartButton());
            return;
        }
        
        // Zoek de start button (verschillende mogelijke selectors)
        const buttonSelectors = [
            'a[data-start-button]',                    // Preferred: data attribute
            'a[href*="operations-processtrategie"]',  // Operations Management
            'a[href*="week1"]',                       // Andere apps
            '.action-buttons a',                      // Algemene selector
            '#start-button'                           // Als er een ID is
        ];
        
        let button = null;
        for (const selector of buttonSelectors) {
            button = document.querySelector(selector);
            if (button) break;
        }
        
        if (!button) {
            // Button niet gevonden, probeer het later opnieuw (voor SPA routing)
            setTimeout(() => this.updateStartButton(), 500);
            return;
        }
        
        // Lees configuratie
        const buttonText = this.getStartButtonText();
        if (buttonText) {
            const span = button.querySelector('span');
            if (span) {
                span.textContent = buttonText;
            } else {
                // Als er geen span is, update de hele button tekst (behoud icon)
                const icon = button.querySelector('i');
                if (icon) {
                    button.innerHTML = icon.outerHTML + ' <span>' + buttonText + '</span>';
                } else {
                    button.textContent = buttonText;
                }
            }
        }
    }
    
    /**
     * Haal de start button tekst op uit configuratie
     * @returns {string} Button tekst of standaard tekst
     */
    static getStartButtonText() {
        if (typeof window !== 'undefined' && 
            window.AppConfig && 
            window.AppConfig.navigation && 
            window.AppConfig.navigation.indexPage &&
            window.AppConfig.navigation.indexPage.startButton) {
            return window.AppConfig.navigation.indexPage.startButton;
        }
        // Standaard tekst
        return 'Start met de E-Learning';
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IndexPageButtonUpdater;
} else {
    window.IndexPageButtonUpdater = IndexPageButtonUpdater;
    
    // Auto-update bij laden
    if (typeof window !== 'undefined') {
        // Update direct als DOM al geladen is
        if (document.readyState !== 'loading') {
            IndexPageButtonUpdater.updateStartButton();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                IndexPageButtonUpdater.updateStartButton();
            });
        }
        
        // Ook update na SPA navigatie (voor AppRouter)
        if (window.AppRouter) {
            const originalLoadIndexPage = window.AppRouter.prototype.loadIndexPage;
            if (originalLoadIndexPage) {
                window.AppRouter.prototype.loadIndexPage = async function(...args) {
                    const result = await originalLoadIndexPage.apply(this, args);
                    // Update button na index page geladen
                    setTimeout(() => {
                        IndexPageButtonUpdater.updateStartButton();
                    }, 100);
                    return result;
                };
            }
        }
    }
}

