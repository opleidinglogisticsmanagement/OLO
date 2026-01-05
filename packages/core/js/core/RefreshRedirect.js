/**
 * RefreshRedirect
 * 
 * Detecteert hard refresh op elke pagina en redirect naar index.html
 * Dit moet worden geladen VOOR andere scripts om te voorkomen dat de pagina wordt geladen
 */

(function() {
    'use strict';
    
    // Detect hard refresh
    const isHardRefresh = (() => {
        // Moderne browsers: gebruik Performance Navigation API
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        if (navigationEntry) {
            return navigationEntry.type === 'reload';
        }
        // Fallback voor oudere browsers: gebruik performance.navigation (deprecated maar werkt)
        if (performance.navigation) {
            return performance.navigation.type === 1; // TYPE_RELOAD
        }
        return false;
    })();
    
    // Check if we're on index page
    const currentPath = window.location.pathname;
    const isIndexPage = currentPath.endsWith('index.html') || 
                       currentPath === '/' || 
                       currentPath.endsWith('/') ||
                       (currentPath.includes('index.html') && !currentPath.includes('/pages/'));
    
    // Als het een hard refresh is en we niet op index.html zijn, redirect
    if (isHardRefresh && !isIndexPage) {
        // Extract the app directory from the path generically
        // Works for any app name by finding the directory containing the current HTML file
        let appDir = '';
        
        // Strategy 1: If path contains /apps/, extract everything up to and including the app name
        const appsMatch = currentPath.match(/\/(apps\/[^\/]+)\//);
        if (appsMatch) {
            const appPath = '/' + appsMatch[1] + '/';
            appDir = currentPath.substring(0, currentPath.indexOf(appPath) + appPath.length);
        } else {
            // Strategy 2: Find the directory containing the current HTML file
            // Remove the filename and use the directory as app directory
            const lastSlash = currentPath.lastIndexOf('/');
            if (lastSlash > 0) {
                appDir = currentPath.substring(0, lastSlash + 1);
            } else {
                // Strategy 3: Fallback to root
                appDir = '/';
            }
        }
        
        const redirectUrl = appDir + 'index.html';
        console.log('[RefreshRedirect] 🔄 Hard refresh detected on non-index page, redirecting to:', redirectUrl);
        window.location.replace(redirectUrl);
        return; // Stop execution
    }
})();

