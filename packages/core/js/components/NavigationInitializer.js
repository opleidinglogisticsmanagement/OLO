/**
 * NavigationInitializer
 * 
 * Initialiseert de navigatie sidebar dynamisch op basis van LayoutRenderer
 * Dit voorkomt dat hardcoded navigatie in index.html out-of-sync raakt
 */

class NavigationInitializer {
    constructor() {
        // #region agent log
        const pathname = window.location.pathname;
        const href = window.location.href;
        const hostname = window.location.hostname;
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationInitializer.js:11',message:'NavigationInitializer constructor called',data:{pathname,href,hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Detect which app we're in based on URL path
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
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationInitializer.js:28',message:'App detection result',data:{appId:this.appId,appTitle:this.appTitle,pathnameMatched:pathname.includes('operations-management')||pathname.includes('e-learning-demo')||pathname.includes('edubook-logistiek')||pathname.includes('logistiek-onderzoek')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
    }

    /**
     * Initialiseer navigatie voor index pagina
     * Vervangt hardcoded navigatie door dynamisch gegenereerde navigatie
     */
    init() {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationInitializer.js:35',message:'init() called',data:{appId:this.appId,pathname:window.location.pathname,alreadyInitialized:!!document.querySelector('[data-navigation-initialized="true"]')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        // Check if we're on index page
        const isIndexPage = window.location.pathname.endsWith('index.html') || 
                           window.location.pathname.endsWith('/') ||
                           (window.location.pathname.includes('index.html') && !window.location.pathname.includes('/pages/'));
        
        if (!isIndexPage) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationInitializer.js:42',message:'Not index page, returning early',data:{isIndexPage,pathname:window.location.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            return; // Only initialize on index page
        }

        // Prevent multiple initializations
        if (document.querySelector('[data-navigation-initialized="true"]')) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationInitializer.js:46',message:'Already initialized, returning early',data:{appId:this.appId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
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

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationInitializer.js:66',message:'Creating LayoutRenderer instance',data:{appId:this.appId,appTitle:this.appTitle},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion

        // Create a temporary LayoutRenderer instance to generate navigation
        const layoutRenderer = new window.LayoutRenderer('start', this.appTitle);
        const generatedNavigation = layoutRenderer.renderModuleNavigation();

        // Parse the generated HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(generatedNavigation, 'text/html');
        const generatedNavElement = doc.querySelector('nav');

        if (generatedNavElement) {
            // #region agent log
            const navContentPreview = generatedNavElement.innerHTML.substring(0, 200);
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationInitializer.js:77',message:'Replacing navigation content',data:{appId:this.appId,navContentPreview},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            
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

