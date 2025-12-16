/**
 * BaseLessonPage Template
 * 
 * Basis template voor alle week pages
 * Collega's kunnen deze gebruiken als startpunt voor hun eigen content
 * 
 * Structuur na refactoring:
 * - LayoutRenderer: Rendering van sidebar en header
 * - ContentTemplateRenderer: Rendering van default content templates
 * - NavigationRenderer: Rendering van navigatie buttons (vorige/volgende module)
 * - SidebarManager: Sidebar functionaliteit (mobile menu, submenu's)
 * - HeaderManager: Header functionaliteit (search, dark mode)
 * - ScrollManager: Scroll functionaliteit (scroll to top, anchor scrolling)
 * - ImageModalManager: Image modal functionaliteit
 * - InteractiveManager: Interactieve componenten (accordions, tabs, drag-drop, MC questions)
 * - VideoManager: Video error detection
 */

class BaseLessonPage {
    constructor(moduleId, moduleTitle, moduleSubtitle) {
        this.moduleId = moduleId;
        this.moduleTitle = moduleTitle;
        this.moduleSubtitle = moduleSubtitle;
        this.layoutRenderer = new LayoutRenderer(moduleId, moduleTitle);
        this.sidebarManager = new SidebarManager(moduleId);
        this.headerManager = new HeaderManager();
        this.scrollManager = new ScrollManager(moduleId);
        this.imageModalManager = new ImageModalManager();
        this.interactiveManager = new InteractiveManager(moduleId);
        this.videoManager = new VideoManager();
        this.tableCopyManager = new TableCopyManager();
        this.navigationService = new NavigationService();
        this.contentTemplateRenderer = new ContentTemplateRenderer();
        this.navigationRenderer = new NavigationRenderer(this.navigationService, moduleId);
    }

    /**
     * Render de complete pagina (voor backward compatibility)
     * @deprecated Gebruik renderContent() voor SPA mode
     */
    render() {
        return `
            <!-- Skip to content link for accessibility -->
            <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus-ring">
                Spring naar hoofdinhoud
            </a>

            <div id="app" class="min-h-screen flex">
                ${this.layoutRenderer.renderSidebar()}
                <div class="flex-1 flex flex-col lg:ml-80 relative">
                    ${this.layoutRenderer.renderHeader()}
                    <div class="flex-1 overflow-y-auto custom-scrollbar pt-[56px] sm:pt-[64px]">
                        ${this.renderMainContent()}
                    </div>
                </div>
            </div>

            <!-- Overlay for mobile menu -->
            <div id="overlay" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-30 hidden lg:hidden transition-opacity"></div>

            <!-- Scroll to top button -->
            <button 
                id="scroll-to-top-btn" 
                class="fixed bottom-8 right-8 bg-blue-600 dark:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 z-50 opacity-0 pointer-events-none flex items-center justify-center" 
                aria-label="Naar boven scrollen"
                title="Naar boven">
                <i class="fas fa-arrow-up text-xl"></i>
            </button>
        `;
    }

    /**
     * Render alleen de content (voor SPA mode)
     * Sidebar en header worden niet opnieuw gerenderd
     */
    renderContent() {
        // Return only the inner content, not the main wrapper
        // The main wrapper is already in index.html
        return `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
                ${this.renderModuleIntro()}
                <div class="h-6 sm:h-8"></div>
                <article class="space-y-6 sm:space-y-8 fade-in">
                    ${this.renderContentSections()}
                </article>

                ${this.renderNavigation()}
            </div>
        `;
    }

    /**
     * Render hoofdcontent gebied
     */
    renderMainContent() {
        return `
            <main id="main-content" class="flex-1 custom-scrollbar bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
                    ${this.renderModuleIntro()}
                    <div class="h-6 sm:h-8"></div>
                    <article class="space-y-6 sm:space-y-8 fade-in">
                        ${this.renderContentSections()}
                    </article>

                    ${this.renderNavigation()}
                </div>
            </main>
        `;
    }

    /**
     * Render module introductie
     */
    renderModuleIntro() {
        return this.contentTemplateRenderer.renderModuleIntro(this.moduleTitle, this.moduleSubtitle);
    }

    /**
     * Render content secties - dit is waar collega's content kunnen toevoegen
     * Deze methode kan worden overschreven door subklassen
     */
    renderContentSections() {
        return this.contentTemplateRenderer.renderContentSections(this.moduleTitle, this.moduleSubtitle);
    }

    /**
     * Render navigatie buttons
     */
    renderNavigation() {
        return this.navigationRenderer.renderNavigation();
    }


    /**
     * Initialiseer de pagina
     */
    init() {
        document.body.innerHTML = this.render();
        this.attachEventListeners();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Initialize all managers (in dependency order)
        this.sidebarManager.init();
        this.headerManager.init();
        this.scrollManager.init();
        this.imageModalManager.init();
        this.interactiveManager.init();
        this.videoManager.init();
        this.tableCopyManager.init();
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseLessonPage;
} else {
    window.BaseLessonPage = BaseLessonPage;
}

