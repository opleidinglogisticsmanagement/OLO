/**
 * NavigationInitializer
 * 
 * Initialiseert de navigatie sidebar dynamisch op basis van LayoutRenderer
 * Dit voorkomt dat hardcoded navigatie in index.html out-of-sync raakt
 */

class NavigationInitializer {
    constructor() {
        // Detect which app we're in based on URL path
        const pathname = window.location.pathname;
        if (pathname.includes('operations-management')) {
            this.appId = 'operations-management';
            this.appTitle = 'Operations Management';
        } else if (pathname.includes('e-learning-demo')) {
            this.appId = 'e-learning-demo';
            this.appTitle = 'E-Learning Demo';
        } else if (pathname.includes('edubook-logistiek')) {
            this.appId = 'edubook-logistiek';
            this.appTitle = 'Edubook-Logistiek';
        } else if (pathname.includes('logistiek-onderzoek')) {
            this.appId = 'logistiek-onderzoek';
            this.appTitle = 'Opzetten van Logistieke Onderzoeken (OLO)';
        } else {
            // Default to logistiek-onderzoek for backward compatibility
            this.appId = 'logistiek-onderzoek';
            this.appTitle = 'Opzetten van Logistieke Onderzoeken (OLO)';
        }
    }

    /**
     * Initialiseer navigatie voor index pagina
     * Vervangt hardcoded navigatie door dynamisch gegenereerde navigatie
     */
    init() {
        // Check if we're on index page
        const isIndexPage = window.location.pathname.endsWith('index.html') || 
                           window.location.pathname.endsWith('/') ||
                           (window.location.pathname.includes('index.html') && !window.location.pathname.includes('/pages/'));
        
        if (!isIndexPage) {
            return; // Only initialize on index page
        }

        // Prevent multiple initializations
        if (document.querySelector('[data-navigation-initialized="true"]')) {
            return; // Already initialized
        }

        // Wait for LayoutRenderer to be available
        if (!window.LayoutRenderer) {
            console.warn('[NavigationInitializer] LayoutRenderer not available yet, retrying...');
            setTimeout(() => this.init(), 100);
            return;
        }

        // Find the navigation container
        const navContainer = document.querySelector('nav[aria-label="Module navigatie"]') || 
                            document.querySelector('nav[aria-label="Navigatie"]');
        
        if (!navContainer) {
            console.warn('[NavigationInitializer] Navigation container not found');
            return;
        }

        // Create a temporary LayoutRenderer instance to generate navigation
        const layoutRenderer = new window.LayoutRenderer('start', this.appTitle);
        const generatedNavigation = layoutRenderer.renderModuleNavigation();

        // Parse the generated HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(generatedNavigation, 'text/html');
        const generatedNavElement = doc.querySelector('nav');

        if (generatedNavElement) {
            // Replace the inner content of the nav container
            navContainer.innerHTML = generatedNavElement.innerHTML;
            // Mark as initialized
            navContainer.setAttribute('data-navigation-initialized', 'true');
            console.log('[NavigationInitializer] ✅ Navigation dynamically generated and updated');
        } else {
            console.warn('[NavigationInitializer] Could not parse generated navigation');
        }
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationInitializer;
} else {
    window.NavigationInitializer = NavigationInitializer;
}

