/**
 * NavigationService
 * 
 * Service voor navigatie tussen modules
 * Bevat de modules array en methods om vorige/volgende module op te halen
 */

class NavigationService {
    constructor() {
        this.appId = this.detectApp();
        this.modules = this.getModulesForApp(this.appId);
    }
    
    /**
     * Detect which app we're in based on URL
     * @returns {string} App ID
     */
    detectApp() {
        // Check multiple sources for app detection
        const pathname = window.location.pathname;
        const href = window.location.href;
        const hostname = window.location.hostname;
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:18',message:'detectApp() called',data:{pathname,href,hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Check pathname and href for app indicators
        if (pathname.includes('operations-management') || href.includes('operations-management')) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:25',message:'Detected operations-management',data:{detectedVia:'pathname_or_href'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return 'operations-management';
        } else if (pathname.includes('e-learning-demo') || href.includes('e-learning-demo')) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:27',message:'Detected e-learning-demo',data:{detectedVia:'pathname_or_href'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return 'e-learning-demo';
        } else if (pathname.includes('edubook-logistiek') || href.includes('edubook-logistiek')) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:29',message:'Detected edubook-logistiek',data:{detectedVia:'pathname_or_href'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return 'edubook-logistiek';
        } else if (pathname.includes('logistiek-onderzoek') || href.includes('logistiek-onderzoek')) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:31',message:'Detected logistiek-onderzoek',data:{detectedVia:'pathname_or_href'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return 'logistiek-onderzoek';
        }
        
        // Check hostname for Vercel deployments
        if (hostname.includes('operations-management')) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:34',message:'Detected operations-management via hostname',data:{hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return 'operations-management';
        } else if (hostname.includes('e-learning-demo')) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:36',message:'Detected e-learning-demo via hostname',data:{hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return 'e-learning-demo';
        } else if (hostname.includes('edubook-logistiek')) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:38',message:'Detected edubook-logistiek via hostname',data:{hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return 'edubook-logistiek';
        } else if (hostname.includes('logistiek-onderzoek')) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:40',message:'Detected logistiek-onderzoek via hostname',data:{hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return 'logistiek-onderzoek';
        }
        
        // Default to logistiek-onderzoek for backward compatibility
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:42',message:'Defaulting to logistiek-onderzoek (no match found)',data:{pathname,href,hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        return 'logistiek-onderzoek';
    }
    
    /**
     * Get modules array for specific app
     * @param {string} appId - App ID
     * @returns {Array} Modules array
     */
    getModulesForApp(appId) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:51',message:'getModulesForApp() called',data:{appId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        if (appId === 'operations-management') {
            return this.getOperationsManagementModules();
        } else {
            // Default modules voor logistiek-onderzoek en andere apps
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:55',message:'Returning default week 1-7 modules',data:{appId,reason:'Not operations-management'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion
            return [
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
     * Herinitialiseer modules (voor SPA navigatie)
     */
    reinitialize() {
        const newAppId = this.detectApp();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:93',message:'reinitialize() called',data:{oldAppId:this.appId,newAppId,changed:newAppId!==this.appId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        if (newAppId !== this.appId) {
            this.appId = newAppId;
            this.modules = this.getModulesForApp(this.appId);
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NavigationService.js:97',message:'App ID changed, modules updated',data:{appId:this.appId,modulesCount:this.modules.length,firstModule:this.modules[0]?.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
            // #endregion
        }
    }

    /**
     * Get previous module
     * @param {string} moduleId - Current module ID
     * @returns {Object|null} Previous module object or null
     */
    getPreviousModule(moduleId) {
        // Herinitialiseer modules als nodig (voor SPA navigatie)
        this.reinitialize();
        
        const currentIndex = this.modules.findIndex(module => module.id === moduleId);
        return this.modules[currentIndex - 1] || null;
    }

    /**
     * Get next module
     * @param {string} moduleId - Current module ID
     * @returns {Object|null} Next module object or null
     */
    getNextModule(moduleId) {
        // Herinitialiseer modules als nodig (voor SPA navigatie)
        this.reinitialize();
        
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





