/**
 * AppInit
 * 
 * Centraal opstartpunt voor alle pagina's.
 * Initialiseert Tailwind configuratie en laadt de juiste pagina class.
 */

(function() {
    'use strict';

    /**
     * Bepaal welke pagina class geïnstantieerd moet worden op basis van het huidige pad
     * @returns {Object} { className: string, moduleId: string }
     */
    function determinePageClass() {
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop() || 'index.html';
        
        // Normaliseer filename (verwijder query params en hash)
        const cleanFilename = filename.split('?')[0].split('#')[0];
        
        if (cleanFilename === 'index.html' || cleanFilename === '' || pathname === '/') {
            return {
                className: 'StartLessonPage',
                moduleId: 'start'
            };
        }
        
        // Converteer bestandsnaam naar class naam
        const baseName = cleanFilename.replace('.html', '');
        const capitalized = baseName.charAt(0).toUpperCase() + baseName.slice(1);
        
        let className;
        let moduleId = baseName;
        
        // Speciale gevallen
        if (baseName === 'afsluiting') {
            className = 'AfsluitingLessonPage';
            moduleId = 'afsluiting';
        } else if (baseName.startsWith('week')) {
            // week1 -> Week1LessonPage, week2 -> Week2LessonPage, etc.
            className = capitalized + 'LessonPage';
            moduleId = baseName.replace('week', 'week-');
        } else if (baseName === 'register') {
            className = 'RegisterPage';
            moduleId = 'register';
        } else if (baseName === 'flashcards') {
            className = 'FlashcardsPage';
            moduleId = 'flashcards';
        } else {
            // Fallback: probeer capitalized + Page
            className = capitalized + 'Page';
            moduleId = baseName;
        }
        
        return { className, moduleId };
    }

    /**
     * Initialiseer Tailwind configuratie
     */
    function initTailwind() {
        if (typeof tailwind !== 'undefined') {
            tailwind.config = {
                darkMode: 'class',
            };
        } else {
            console.warn('[AppInit] Tailwind CSS not loaded yet');
        }
    }

    /**
     * Initialiseer de pagina
     */
    function initPage() {
        const { className, moduleId } = determinePageClass();
        
        console.log(`[AppInit] Initializing page: ${className} (moduleId: ${moduleId})`);
        
        // Check of de class beschikbaar is
        if (typeof window[className] === 'undefined') {
            console.error(`[AppInit] Class ${className} is not available. Make sure the script is loaded.`);
            
            // Fallback: probeer BaseLessonPage
            if (typeof window.BaseLessonPage !== 'undefined') {
                console.warn(`[AppInit] Falling back to BaseLessonPage`);
                const page = new window.BaseLessonPage(moduleId, className, '');
                page.init().catch(err => {
                    console.error('[AppInit] Error initializing page:', err);
                });
            } else {
                console.error('[AppInit] BaseLessonPage is also not available. Cannot initialize page.');
            }
            return;
        }
        
        // Instantieer de pagina class
        try {
            const PageClass = window[className];
            const page = new PageClass();
            
            // Roep init() aan
            if (typeof page.init === 'function') {
                page.init().catch(err => {
                    console.error(`[AppInit] Error initializing ${className}:`, err);
                });
            } else {
                console.warn(`[AppInit] ${className} does not have an init() method`);
            }
        } catch (error) {
            console.error(`[AppInit] Error instantiating ${className}:`, error);
        }
    }

    /**
     * Hoofdfunctie: wacht tot DOM klaar is en initialiseer alles
     */
    function init() {
        // Wacht tot DOM volledig geladen is
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initTailwind();
                initPage();
            });
        } else {
            // DOM is al geladen
            initTailwind();
            initPage();
        }
    }

    // Start initialisatie
    init();
})();

