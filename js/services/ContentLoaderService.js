/**
 * ContentLoaderService
 * 
 * Service voor het laden en renderen van content zonder de hele pagina te reloaden.
 * Deze service gebruikt RouterService om te bepalen welke pagina te laden en
 * rendert alleen het content gebied (#main-content), terwijl sidebar en header blijven staan.
 * 
 * Dit is onderdeel van de SPA implementatie - Fase 2.2
 */

class ContentLoaderService {
    constructor(routerService, historyManager = null) {
        this.routerService = routerService;
        this.historyManager = historyManager;
        this.currentPageInstance = null; // Huidige WeekLessonPage instantie
    }

    /**
     * Laad een pagina op basis van moduleId
     * Maakt een nieuwe WeekLessonPage instantie, laadt content, en initialiseert deze
     * 
     * @param {string} moduleId - De module ID (e.g., 'week-1', 'week-2')
     * @param {string|null} hash - Optionele hash anchor (e.g., '#probleem-verkennen')
     * @returns {Promise<BaseLessonPage>} De geladen page instance
     * @throws {Error} Als route niet bestaat of loading faalt
     */
    async loadPage(moduleId, hash = null) {
        try {
            // 1. Get route from router
            const route = this.routerService.getRoute(moduleId);
            
            if (!route) {
                throw new Error(`Route not found for moduleId: ${moduleId}`);
            }

            if (!route.pageClass) {
                throw new Error(`Route ${moduleId} does not have a pageClass (e.g., dashboard pages)`);
            }

            // 2. Create page instance
            // WeekLessonPage classes typically take no constructor arguments
            // They set moduleId, title, subtitle in their constructor
            const PageClass = route.pageClass;
            const pageInstance = new PageClass();

            // 2.5. Set historyManager on page instance and its managers (for SPA navigation)
            if (this.historyManager && pageInstance) {
                pageInstance.historyManager = this.historyManager;
                // Also update managers that need historyManager
                if (pageInstance.scrollManager) {
                    pageInstance.scrollManager.historyManager = this.historyManager;
                }
                if (pageInstance.interactiveManager) {
                    pageInstance.interactiveManager.historyManager = this.historyManager;
                }
            }

            // 3. Load content if method exists
            if (typeof pageInstance.loadContent === 'function') {
                try {
                    await pageInstance.loadContent();
                } catch (loadError) {
                    console.error(`[ContentLoaderService] Failed to load content for ${moduleId}:`, loadError);
                    throw new Error(`Failed to load content for ${moduleId}: ${loadError.message}`);
                }
            }

            // 4. Store current page instance for cleanup
            this.currentPageInstance = pageInstance;

            // 5. Handle hash if provided (some pages handle this in their custom init)
            // We'll handle hash separately after rendering, not here

            return pageInstance;
        } catch (error) {
            console.error(`[ContentLoaderService] Error loading page ${moduleId}:`, error);
            throw error;
        }
    }

    /**
     * Render alleen het content gebied van een page instance
     * 
     * @param {BaseLessonPage} pageInstance - De page instance om te renderen
     * @returns {string} HTML string voor alleen het content gebied
     */
    renderContent(pageInstance) {
        if (!pageInstance) {
            throw new Error('Page instance is required for rendering');
        }

        if (typeof pageInstance.renderMainContent !== 'function') {
            throw new Error('Page instance does not have renderMainContent method');
        }

        try {
            return pageInstance.renderMainContent();
        } catch (error) {
            console.error('[ContentLoaderService] Error rendering content:', error);
            throw new Error(`Failed to render content: ${error.message}`);
        }
    }

    /**
     * Attach event listeners voor een page instance
     * 
     * @param {BaseLessonPage} pageInstance - De page instance om event listeners voor te attach-en
     */
    attachEventListeners(pageInstance) {
        if (!pageInstance) {
            throw new Error('Page instance is required for attaching event listeners');
        }

        if (typeof pageInstance.attachEventListeners !== 'function') {
            console.warn('[ContentLoaderService] Page instance does not have attachEventListeners method');
            return;
        }

        try {
            pageInstance.attachEventListeners();
        } catch (error) {
            console.error('[ContentLoaderService] Error attaching event listeners:', error);
            throw new Error(`Failed to attach event listeners: ${error.message}`);
        }
    }

    /**
     * Combinatie method: laadt page, rendert content, en attach event listeners
     * Handige wrapper voor complete content loading flow
     * 
     * @param {string} moduleId - De module ID (e.g., 'week-1', 'week-2')
     * @param {string|null} hash - Optionele hash anchor (e.g., '#probleem-verkennen')
     * @returns {Promise<Object>} Object met html string en pageInstance
     * @throws {Error} Als loading of rendering faalt
     */
    async loadAndRender(moduleId, hash = null) {
        try {
            // 1. Load page
            const pageInstance = await this.loadPage(moduleId, hash);

            // 2. Render content
            const html = this.renderContent(pageInstance);

            // 3. Attach event listeners (will be called after HTML is inserted into DOM)
            // Note: We return the pageInstance so event listeners can be attached after DOM update

            return {
                html: html,
                pageInstance: pageInstance
            };
        } catch (error) {
            console.error(`[ContentLoaderService] Error in loadAndRender for ${moduleId}:`, error);
            
            // Try to render error state if page instance exists and has renderErrorState
            if (this.currentPageInstance && typeof this.currentPageInstance.renderErrorState === 'function') {
                try {
                    const errorHtml = this.currentPageInstance.renderErrorState(error.message);
                    return {
                        html: errorHtml,
                        pageInstance: this.currentPageInstance
                    };
                } catch (renderError) {
                    console.error('[ContentLoaderService] Error rendering error state:', renderError);
                }
            }

            // Fallback: return simple error HTML
            const errorHtml = `
                <main id="main-content" class="flex-1 custom-scrollbar bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
                        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                            <h2 class="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                                Fout bij laden van content
                            </h2>
                            <p class="text-red-700 dark:text-red-300">
                                ${error.message || 'Er is een onbekende fout opgetreden bij het laden van de pagina.'}
                            </p>
                        </div>
                    </div>
                </main>
            `;

            return {
                html: errorHtml,
                pageInstance: null
            };
        }
    }

    /**
     * Cleanup van huidige page instance
     * Kan gebruikt worden voordat nieuwe page wordt geladen
     * Optioneel: cleanup van event listeners, timers, etc.
     */
    cleanup() {
        if (this.currentPageInstance) {
            // Optioneel: cleanup logic hier
            // Bijvoorbeeld: remove event listeners, clear timers, etc.
            
            // Reset reference
            this.currentPageInstance = null;
        }
    }

    /**
     * Get huidige page instance
     * 
     * @returns {BaseLessonPage|null} Huidige page instance of null
     */
    getCurrentPageInstance() {
        return this.currentPageInstance;
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentLoaderService;
} else {
    window.ContentLoaderService = ContentLoaderService;
}
