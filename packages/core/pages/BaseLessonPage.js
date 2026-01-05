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
        
        // Initialize content properties
        this.content = null;
        this.contentLoaded = false;
        
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
     * Map moduleId to content filename
     * @returns {string} Content filename
     */
    getContentFileName() {
        
        // Special cases
        if (this.moduleId === 'afsluiting') {
            return 'afsluiting.content.json';
        }
        if (this.moduleId === 'register') {
            return 'register.json';
        }
        
        // Standard week pages: week-1 -> week1.content.json
        if (this.moduleId.startsWith('week-')) {
            const weekNumber = this.moduleId.replace('week-', '');
            return `week${weekNumber}.content.json`;
        }
        
        // Fallback: use moduleId directly
        const fileName = `${this.moduleId}.content.json`;
        
        return fileName;
    }

    /**
     * Laad content uit JSON bestand met retry logica
     * @param {number} retries - Aantal retry pogingen
     */
    async loadContent(retries = 3) {
        
        const contentFileName = this.getContentFileName();
        
        // Build paths based on current location
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Probeer verschillende paden (relatief, absoluut, en vanaf root)
                const paths = [
                    `./content/${contentFileName}`,
                    `content/${contentFileName}`,
                    `${basePath}content/${contentFileName}`,
                    `/content/${contentFileName}`,
                    // Try with current origin for absolute URLs
                    `${window.location.origin}/content/${contentFileName}`,
                    `${window.location.origin}${basePath}content/${contentFileName}`
                ];

                let lastError = null;
                for (const contentPath of paths) {
                    try {
                        console.log(`[${this.constructor.name}] Loading content from: ${contentPath} (attempt ${attempt}/${retries})`);

                        // Add timeout to prevent hanging
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
                        
                        const response = await fetch(contentPath, {
                            cache: 'no-cache',
                            headers: {
                                'Accept': 'application/json'
                            },
                            signal: controller.signal
                        });
                        
                        clearTimeout(timeoutId);

                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status} for path: ${contentPath}`);
                        }
                        
                        const contentType = response.headers.get('content-type');
                        if (!contentType || !contentType.includes('application/json')) {
                            console.warn(`[${this.constructor.name}] Unexpected content-type: ${contentType}`);
                        }
                        
                        const jsonData = await response.json();

                        // Validate JSON structure if ContentValidator is available
                        if (typeof window.ContentValidator !== 'undefined') {
                            const isValid = ContentValidator.validateAndLog(jsonData, this.moduleId, false);
                            if (!isValid) {
                                console.warn(`[${this.constructor.name}] ⚠️ Content validation found issues, but continuing...`);
                            }
                        }
                        
                        this.content = jsonData;
                        this.contentLoaded = true;
                        console.log(`[${this.constructor.name}] ✅ Content loaded successfully from: ${contentPath}`);
                        
                        return; // Success, exit function
                    } catch (pathError) {
                        
                        if (pathError.name === 'AbortError') {
                            console.warn(`[${this.constructor.name}] Timeout loading from ${contentPath}`);
                            lastError = new Error(`Timeout: ${contentPath}`);
                        } else {
                            console.warn(`[${this.constructor.name}] Failed to load from ${contentPath}:`, pathError.message);
                            lastError = pathError;
                        }
                        // Try next path
                    }
                }
                
                // All paths failed, throw last error
                throw lastError || new Error('All content paths failed');
            } catch (error) {
                const errorDetails = {
                    moduleId: this.moduleId,
                    attempt: `${attempt}/${retries}`,
                    fileName: contentFileName,
                    errorType: error.name || 'Unknown',
                    errorMessage: error.message || 'Unknown error',
                    stack: error.stack
                };
                
                console.error(`[${this.constructor.name}] Error loading content (attempt ${attempt}/${retries}):`, errorDetails);

                if (attempt === retries) {
                    // Last attempt failed, use fallback
                    console.error(`[${this.constructor.name}] ❌ All attempts failed, using fallback content`);
                    console.error(`[${this.constructor.name}] Error details:`, {
                        moduleId: this.moduleId,
                        fileName: contentFileName,
                        lastError: error.message,
                        triedPaths: [
                            `./content/${contentFileName}`,
                            `content/${contentFileName}`,
                            `${basePath}content/${contentFileName}`,
                            `/content/${contentFileName}`
                        ]
                    });
                    this.contentLoaded = false;
                    this.content = this.getFallbackContent();
                    
                } else {
                    // Wait before retry (exponential backoff)
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    console.log(`[${this.constructor.name}] Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
    }

    /**
     * Fallback content als JSON niet kan worden geladen
     * @returns {Object} Fallback content object
     */
    getFallbackContent() {
        return {
            intro: {
                title: this.moduleTitle,
                subtitle: this.moduleSubtitle,
                description: `De content voor deze module kon niet correct worden geladen. Controleer of het bestand ${this.getContentFileName()} bestaat en toegankelijk is.`
            },
            leerdoelen: {
                title: "Leerdoelen",
                description: "Content kon niet worden geladen",
                items: [
                    `Het bestand ${this.getContentFileName()} kon niet worden geladen`,
                    "Controleer of het bestand bestaat in de content folder",
                    "Controleer of er geen fouten zijn in de JSON structuur"
                ]
            },
            theorie: {
                title: "Theorie",
                content: [
                    {
                        type: "paragraph",
                        text: [
                            "Er is een probleem opgetreden bij het laden van de content. De pagina kon niet correct worden geladen."
                        ]
                    }
                ]
            },
            video: {
                title: "Video",
                description: "Video content kon niet worden geladen",
                url: "",
                info: "Content kon niet worden geladen. Controleer het JSON bestand."
            }
        };
    }

    /**
     * Render error state als content niet kan worden geladen
     * @returns {string} HTML string
     */
    renderErrorState() {
        return `
            <section class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-6 rounded-r-lg">
                <div class="flex items-start space-x-3">
                    <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 mt-1"></i>
                    <div>
                        <h3 class="font-semibold text-red-900 dark:text-red-200 mb-1">Content Kon Niet Worden Geladen</h3>
                        <p class="text-red-800 dark:text-red-300 text-sm">
                            Het bestand ${this.getContentFileName()} kon niet worden geladen. Controleer of het bestand bestaat en toegankelijk is.
                        </p>
                    </div>
                </div>
            </section>
        `;
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
        const contentSections = this.renderContentSections();
        
        return `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 box-border overflow-x-hidden">
                <article class="space-y-6 sm:space-y-8 fade-in box-border overflow-x-hidden">
                    ${this.renderModuleIntro()}
                    ${contentSections}
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
     * Uses ContentTemplateRenderer with content data if available
     */
    renderModuleIntro() {
        return this.contentTemplateRenderer.renderModuleIntro(this.moduleTitle, this.moduleSubtitle, this.content);
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
     * Initialiseer de pagina met content loading en lifecycle hooks
     */
    async init() {
        
        try {
            // Load content
            await this.loadContent();

            // Hook: afterContentLoaded - voor validatie of extra checks
            if (typeof this.afterContentLoaded === 'function') {
                const shouldContinue = await this.afterContentLoaded();
                if (shouldContinue === false) {
                    return; // Stop initialization if hook returns false
                }
            }
            
            // Render page
            document.body.innerHTML = this.render();
            
            // Attach event listeners
            this.attachEventListeners();
            
            // Hook: afterEventListeners - voor hash handling, MC generation, etc.
            if (typeof this.afterEventListeners === 'function') {
                await this.afterEventListeners();
            }
            
        } catch (error) {
            console.error(`[${this.constructor.name}] ❌ Error during initialization:`, error);
            
            document.body.innerHTML = this.renderErrorState();
        }
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
        
        // Initialize all flip cards after a short delay to ensure DOM is ready
        if (typeof FlipCardRenderer !== 'undefined') {
            setTimeout(() => {
                FlipCardRenderer.initializeAllFlipCards();
            }, 600);
        }
    }

    /**
     * Show quota exceeded message with friendly orange styling
     * Can be used by all lesson pages
     */
    showQuotaExceededMessage() {
        const container = document.getElementById('mc-questions-container');
        if (container) {
            container.innerHTML = `
                <div class="border border-orange-200 dark:border-orange-800 rounded-lg p-5 bg-orange-50 dark:bg-orange-900/20">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-info-circle text-orange-600 dark:text-orange-400 mt-1"></i>
                        <div class="flex-1">
                            <h3 class="font-semibold text-orange-900 dark:text-orange-200 mb-1">AI-coach daglimiet bereikt</h3>
                            <p class="text-orange-800 dark:text-orange-300 text-sm mb-3">De AI-coach heeft zijn daglimiet bereikt. Probeer het morgen opnieuw of ga zelf aan de slag met de theorie.</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Export voor gebruik in andere modules

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseLessonPage;
} else {
    window.BaseLessonPage = BaseLessonPage;
}

