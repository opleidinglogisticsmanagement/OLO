/**
 * SPA (Single Page Application) Core
 * 
 * Main entry point for the SPA functionality
 * Manages layout rendering, content loading, and navigation
 * 
 * This is part of the SPA implementation - Phase 2.5
 */

class SPA {
    constructor() {
        // Verify RouterService is available
        if (typeof RouterService === 'undefined') {
            throw new Error('RouterService is not defined. Make sure RouterService.js is loaded before SPA.js');
        }
        
        this.routerService = new RouterService();
        this.historyManager = new HistoryManager(this.routerService, null); // contentLoaderService will be set after creation
        this.contentLoaderService = new ContentLoaderService(this.routerService, this.historyManager);
        // Update historyManager's contentLoaderService reference
        this.historyManager.contentLoaderService = this.contentLoaderService;
        this.currentModuleId = null;
        this.layoutRenderer = null;
        this.sidebarManager = null;
        this.headerManager = null;
        this.isInitialized = false;
    }

    /**
     * Initialiseer de SPA
     * Render layout één keer, initialiseer HistoryManager, en laad eerste pagina
     */
    async init() {
        if (this.isInitialized) {
            console.warn('[SPA] Already initialized');
            return;
        }

        try {
            // Show loading screen
            this.showLoadingScreen();

            // Render layout één keer
            const initialRoute = this.historyManager.handleInitialRoute();
            const moduleId = initialRoute.moduleId || 'start';
            await this.renderLayout(moduleId);

            // Initialiseer HistoryManager met navigatie callback
            this.historyManager.init((moduleId, hash) => {
                this.handleNavigation(moduleId, hash);
            });

            // Laad eerste pagina op basis van URL
            await this.loadInitialPage();

            // Setup event listeners voor layout
            this.setupLayoutEventListeners(moduleId);

            // Hide loading screen
            this.hideLoadingScreen();

            this.isInitialized = true;
            console.log('[SPA] Initialized successfully');
        } catch (error) {
            console.error('[SPA] Error during initialization:', error);
            this.hideLoadingScreen();
            this.showError('Fout bij initialiseren van de applicatie. Probeer de pagina te verversen.');
        }
    }

    /**
     * Render layout (sidebar + header) één keer
     * 
     * @param {string} moduleId - De module ID voor active state (default: 'start')
     * @returns {Promise<void>}
     */
    async renderLayout(moduleId = 'start') {
        try {
            const route = this.routerService.getRoute(moduleId);
            const moduleTitle = route ? route.title : 'Start';

            // Create layout renderer
            this.layoutRenderer = new LayoutRenderer(moduleId, moduleTitle);

            // Get app container
            const appContainer = document.getElementById('app');
            if (!appContainer) {
                throw new Error('App container (#app) not found');
            }

            // Render layout HTML
            const layoutHtml = `
                <!-- Skip to content link for accessibility -->
                <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus-ring">
                    Spring naar hoofdinhoud
                </a>

                ${this.layoutRenderer.renderSidebar()}
                <div class="flex-1 flex flex-col lg:ml-80 relative">
                    ${this.layoutRenderer.renderHeader()}
                    <div class="flex-1 overflow-y-auto custom-scrollbar pt-[56px] sm:pt-[64px]">
                        <main id="main-content" class="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                            <!-- Content will be loaded here -->
                        </main>
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

            // Insert layout into app container
            appContainer.innerHTML = layoutHtml;

            console.log('[SPA] Layout rendered');
        } catch (error) {
            console.error('[SPA] Error rendering layout:', error);
            throw error;
        }
    }

    /**
     * Handle navigatie events (callback voor HistoryManager)
     * Laadt content, update DOM, attach event listeners, update sidebar active state
     * 
     * @param {string} moduleId - De module ID om naar te navigeren
     * @param {string|null} hash - Optionele hash anchor
     */
    async handleNavigation(moduleId, hash = null) {
        try {
            // Valideer route
            if (!this.routerService.isValidRoute(moduleId)) {
                console.error(`[SPA] Invalid route: ${moduleId}`);
                this.showError(`Route niet gevonden: ${moduleId}`);
                return;
            }

            // Show loading state
            this.showContentLoading();

            // Update current module ID
            this.currentModuleId = moduleId;

            // Load and render content
            let contentHtml = '';
            let pageInstance = null;

            if (moduleId === 'start') {
                // Special handling for start/dashboard page
                contentHtml = await this.renderStartPage();
            } else {
                // Load page via ContentLoaderService
                const result = await this.contentLoaderService.loadAndRender(moduleId, hash);
                contentHtml = result.html;
                pageInstance = result.pageInstance;
            }

            // Update content area
            this.updateContentArea(contentHtml);

            // Attach event listeners if page instance exists
            if (pageInstance) {
                this.contentLoaderService.attachEventListeners(pageInstance);
            } else if (moduleId === 'start') {
                // Setup event listeners for start page
                this.setupStartPageEventListeners();
            }

            // Update sidebar active state
            this.updateSidebarActiveState(moduleId);

            // Update header breadcrumbs
            this.updateHeaderBreadcrumbs(moduleId);

            // Handle hash anchor scrolling
            if (hash) {
                // Wait a bit for DOM to be ready
                setTimeout(() => {
                    this.scrollToAnchor(hash);
                }, 100);
            } else {
                // Scroll to top
                this.scrollToTop();
            }

            // Hide loading state
            this.hideContentLoading();

            console.log(`[SPA] Navigation to ${moduleId}${hash ? hash : ''} completed`);
        } catch (error) {
            console.error(`[SPA] Error handling navigation to ${moduleId}:`, error);
            this.hideContentLoading();
            this.showError(`Fout bij laden van pagina: ${error.message}`);
        }
    }

    /**
     * Laad eerste pagina op basis van URL
     */
    async loadInitialPage() {
        try {
            const initialRoute = this.historyManager.handleInitialRoute();
            const moduleId = initialRoute.moduleId || 'start';
            const hash = initialRoute.hash || null;

            console.log(`[SPA] Loading initial page: ${moduleId}${hash ? hash : ''}`);

            // Navigate to initial route
            await this.handleNavigation(moduleId, hash);
        } catch (error) {
            console.error('[SPA] Error loading initial page:', error);
            // Fallback naar start pagina
            await this.handleNavigation('start', null);
        }
    }

    /**
     * Update content area met nieuwe HTML
     * 
     * @param {string} html - HTML string om in te voegen
     */
    updateContentArea(html) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error('[SPA] Main content area not found');
            return;
        }

        // Smooth transition (fade out, update, fade in)
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.2s ease-in-out';

        setTimeout(() => {
            mainContent.innerHTML = html;
            mainContent.style.opacity = '1';
        }, 200);
    }

    /**
     * Setup event listeners voor layout (sidebar, header, etc.)
     * 
     * @param {string} moduleId - Huidige module ID voor active state
     */
    setupLayoutEventListeners(moduleId) {
        // Initialize SidebarManager
        this.sidebarManager = new SidebarManager(moduleId);
        this.sidebarManager.init();

        // Initialize HeaderManager
        this.headerManager = new HeaderManager();
        this.headerManager.init();

        // Setup SPA navigation for sidebar links
        this.setupSPANavigation();
    }

    /**
     * Setup SPA navigation voor sidebar links
     * Intercept clicks op links met data-spa-route attributen
     */
    setupSPANavigation() {
        // Use event delegation for sidebar links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-spa-route]');
            if (!link) return;

            const moduleId = link.getAttribute('data-spa-route');
            const hash = link.getAttribute('data-spa-hash') || null;

            if (moduleId && this.routerService.isValidRoute(moduleId)) {
                e.preventDefault();
                this.historyManager.navigate(moduleId, hash);
            }
        });
    }

    /**
     * Update sidebar active state
     * 
     * @param {string} moduleId - De module ID om als active te markeren
     */
    updateSidebarActiveState(moduleId) {
        // Remove active state from all links
        const allLinks = document.querySelectorAll('#sidebar a[data-spa-route]');
        allLinks.forEach(link => {
            link.classList.remove('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-700', 'dark:text-blue-300');
            link.classList.add('text-gray-600', 'dark:text-gray-300');
        });

        // Add active state to current module link
        const currentLink = document.querySelector(`#sidebar a[data-spa-route="${moduleId}"]`);
        if (currentLink) {
            currentLink.classList.add('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-700', 'dark:text-blue-300');
            currentLink.classList.remove('text-gray-600', 'dark:text-gray-300');
        }

        // Update sidebar manager with new moduleId
        if (this.sidebarManager) {
            this.sidebarManager.moduleId = moduleId;
        }
    }

    /**
     * Update header breadcrumbs
     * 
     * @param {string} moduleId - De module ID
     */
    updateHeaderBreadcrumbs(moduleId) {
        const route = this.routerService.getRoute(moduleId);
        if (!route) return;

        const breadcrumbNav = document.querySelector('#main-header nav[aria-label="Breadcrumb"]');
        if (breadcrumbNav) {
            breadcrumbNav.innerHTML = `
                <a href="/" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus-ring transition-colors" data-spa-route="start">Start</a>
                ${moduleId !== 'start' ? `
                    <i class="fas fa-chevron-right text-gray-400 dark:text-gray-500 text-xs"></i>
                    <span class="text-gray-900 dark:text-white font-medium">${route.title}</span>
                ` : ''}
            `;

            // Setup SPA navigation for breadcrumb link
            const breadcrumbLink = breadcrumbNav.querySelector('a[data-spa-route]');
            if (breadcrumbLink) {
                breadcrumbLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.historyManager.navigate('start', null);
                });
            }
        }

        // Update mobile title
        const mobileTitle = document.querySelector('#main-header h1.lg\\:hidden');
        if (mobileTitle) {
            mobileTitle.textContent = route.title;
        }
    }

    /**
     * Render start/dashboard page
     * 
     * @returns {Promise<string>} HTML string voor start page
     */
    async renderStartPage() {
        // This is the content from index.html's main-content area
        // We'll load it from the original index.html or render it directly
        return `
            <div class="max-w-4xl mx-auto px-6 py-8">
                <!-- Lesson Content -->
                <article class="space-y-8 fade-in">
                    <!-- Course Title Section -->
                    <section class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white mb-8">
                        <h1 class="text-4xl font-bold mb-4">Opzetten van Logistieke Onderzoeken</h1>
                        <p class="text-blue-100 text-lg">Een praktijkgerichte module over het opzetten en uitvoeren van logistiek onderzoek</p>
                    </section>

                    <!-- General Information Section -->
                    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-lift transition-colors duration-200">
                        <div class="flex flex-col sm:flex-row items-start">
                            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                                <i class="fas fa-info-circle text-green-600 dark:text-green-400 text-lg"></i>
                            </div>
                            <div class="flex-1 min-w-0 w-full sm:w-auto">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Over dit vak</h3>
                                <div class="prose max-w-none">
                                    <p class="text-gray-700 dark:text-gray-300 mb-4">
                                        In deze module leer je hoe je een praktijkgericht logistiek onderzoek opzet en uitvoert. 
                                        Je leert hoe je een praktijkprobleem verkent en afbakent, hoe je een doelstelling formuleert, 
                                        en hoe je je onderzoeksopdracht positioneert binnen een groter onderzoeks- of innovatieproject.
                                    </p>
                                    <p class="text-gray-700 dark:text-gray-300 mb-4">
                                        Door middel van concrete voorbeelden en praktische opdrachten ga je aan de slag met het opzetten 
                                        van een logistiek onderzoek dat uitvoerbaar is binnen de beschikbare tijd en aansluit bij de vraag 
                                        van de opdrachtgever.
                                    </p>
                                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-6">Wat ga je leren?</h4>
                                    <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>Het verkennen en afbakenen van praktijkproblemen binnen een organisatie</li>
                                        <li>Het formuleren van doelstellingen voor praktijkgericht onderzoek</li>
                                        <li>Het positioneren van je onderzoeksopdracht binnen grotere projecten</li>
                                        <li>Het werken met opdrachtgevers en stakeholders</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Learning Outcome -->
                    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-lift transition-colors duration-200">
                        <div class="flex flex-col sm:flex-row items-start">
                            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                                <i class="fas fa-bullseye text-blue-600 dark:text-blue-400 text-lg"></i>
                            </div>
                            <div class="flex-1 min-w-0 w-full sm:w-auto">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Leeruitkomst</h3>
                                <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                    De student is als individu of onderdeel van een duo in staat om een gefundeerd onderzoeksplan op te stellen 
                                    waarin een knowledge gap wordt beschreven en gemaakte keuzes in de onderzoeksstrategie kunnen worden onderbouwd 
                                    aan de hand van een vraagstuk binnen de logistieke context. 
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Module Structure Section -->
                    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-lift transition-colors duration-200">
                        <div class="flex flex-col sm:flex-row items-start">
                            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                                <i class="fas fa-book text-green-600 dark:text-green-400 text-lg"></i>
                            </div>
                            <div class="flex-1 min-w-0 w-full sm:w-auto">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Module Structuur</h3>
                                
                                <div class="prose max-w-none">
                                    <p class="text-gray-700 dark:text-gray-300 mb-4">
                                        Deze module is opgebouwd uit 7 weken, waarin je stap voor stap leert hoe je een logistiek onderzoek opzet. 
                                        Elke week bouwt voort op de kennis en vaardigheden uit de voorgaande week.
                                    </p>
                                    
                                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Overzicht van de weken</h4>
                                    <div class="flex flex-col gap-3 mb-6">
                                        <a href="week1.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block" data-spa-route="week-1">
                                            <div class="flex items-center justify-between">
                                                <div class="flex-1">
                                                    <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                        Week 1: Geen onderwijs i.v.m. studiereis
                                                    </h5>
                                                    <p class="text-gray-500 dark:text-gray-400 text-xs italic">
                                                        Geen onderwijs of voorbereiding deze week.
                                                    </p>
                                                </div>
                                                <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                            </div>
                                        </a>
                                        <a href="week2.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block" data-spa-route="week-2">
                                            <div class="flex items-center justify-between">
                                                <div class="flex-1">
                                                    <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                        Week 2: Van probleem naar doelstelling
                                                    </h5>
                                                    <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                        Je leert hoe je een praktijkprobleem verkent en afbakent, en hoe je een doelstelling formuleert met het a- en b-gedeelte. Je leert ook hoe je een doelstelling SMART maakt.
                                                    </p>
                                                </div>
                                                <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                            </div>
                                        </a>
                                        <a href="week3.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block" data-spa-route="week-3">
                                            <div class="flex items-center justify-between">
                                                <div class="flex-1">
                                                    <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                        Week 3: Onderzoeksmodel + Onderzoeksvragen
                                                    </h5>
                                                    <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                        Je leert hoe je een onderzoeksmodel opstelt en onderzoeksvragen formuleert voor je onderzoek.
                                                    </p>
                                                </div>
                                                <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                            </div>
                                        </a>
                                        <a href="week4.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block" data-spa-route="week-4">
                                            <div class="flex items-center justify-between">
                                                <div class="flex-1">
                                                    <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                        Week 4: Begripsbepaling + Voorbereiding literatuuronderzoek
                                                    </h5>
                                                    <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                        Je leert hoe je begrippen bepaalt en voorbereidt op het literatuuronderzoek.
                                                    </p>
                                                </div>
                                                <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                            </div>
                                        </a>
                                        <a href="week5.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block" data-spa-route="week-5">
                                            <div class="flex items-center justify-between">
                                                <div class="flex-1">
                                                    <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                        Week 5: Uitvoeren literatuuronderzoek + Theoretisch kader
                                                    </h5>
                                                    <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                        Je voert literatuuronderzoek uit en werkt aan je theoretisch kader.
                                                    </p>
                                                </div>
                                                <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                            </div>
                                        </a>
                                        <a href="week6.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block" data-spa-route="week-6">
                                            <div class="flex items-center justify-between">
                                                <div class="flex-1">
                                                    <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                        Week 6: Onderzoeksstrategie + dataverzamelingsplan
                                                    </h5>
                                                    <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                        Je bepaalt je onderzoeksstrategie en maakt een dataverzamelingsplan.
                                                    </p>
                                                </div>
                                                <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                            </div>
                                        </a>
                                        <a href="week7.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block" data-spa-route="week-7">
                                            <div class="flex items-center justify-between">
                                                <div class="flex-1">
                                                    <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                        Week 7: Rapportage 1
                                                    </h5>
                                                    <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                        Je werkt aan de eerste rapportage van je onderzoeksplan.
                                                    </p>
                                                </div>
                                                <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                            </div>
                                        </a>
                                    </div>
                                    
                                    <!-- PDF Export Button -->
                                    <div class="mt-6 mb-8 flex justify-center">
                                        <button 
                                            id="export-pdf-btn" 
                                            class="flex items-center space-x-3 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus-ring transition-colors shadow-md hover:shadow-lg"
                                            aria-label="Exporteer alle content naar PDF">
                                            <i class="fas fa-file-pdf text-xl"></i>
                                            <span class="font-semibold">Exporteer alle content naar PDF</span>
                                        </button>
                                    </div>
                                    
                                    <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-r-lg mb-6">
                                        <div class="flex items-start space-x-3">
                                            <i class="fas fa-lightbulb text-blue-600 dark:text-blue-400 mt-1"></i>
                                            <div>
                                                <h5 class="font-semibold text-blue-900 dark:text-blue-200 mb-1">Belangrijke Tip</h5>
                                                <p class="text-blue-800 dark:text-blue-300 text-sm">
                                                    Neem de tijd om elke week goed door te nemen. Praktijkgericht onderzoek vraagt om zorgvuldige 
                                                    voorbereiding en afbakening. Begin daarom met het grondig verkennen van het probleem voordat 
                                                    je aan de slag gaat met het formuleren van doelstellingen.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </article>

                <!-- Action Buttons -->
                <div class="mt-12 flex justify-center items-center space-x-6">
                    <a href="week1.html" class="flex items-center space-x-2 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus-ring transition-colors" data-spa-route="week-1">
                        <i class="fas fa-play"></i>
                        <span>Start Module</span>
                    </a>
                    
                    <a href="afsluiting.html" class="flex items-center space-x-2 px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 focus-ring transition-colors" data-spa-route="afsluiting">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Naar Afsluiting</span>
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners voor start page
     */
    setupStartPageEventListeners() {
        // PDF Export functionality
        const exportPdfBtn = document.getElementById('export-pdf-btn');
        if (exportPdfBtn && window.PDFExporter) {
            exportPdfBtn.addEventListener('click', async () => {
                exportPdfBtn.disabled = true;
                exportPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin text-xl"></i><span class="font-semibold">Exporteren...</span>';
                
                try {
                    const exporter = new PDFExporter();
                    await exporter.exportAllContentToPDF();
                } catch (error) {
                    console.error('PDF export error:', error);
                    alert('Er is een fout opgetreden bij het exporteren. Probeer het opnieuw.');
                } finally {
                    exportPdfBtn.disabled = false;
                    exportPdfBtn.innerHTML = '<i class="fas fa-file-pdf text-xl"></i><span class="font-semibold">Exporteer alle content naar PDF</span>';
                }
            });
        }
    }

    /**
     * Scroll naar anchor
     * 
     * @param {string} hash - Hash anchor (e.g., '#probleem-verkennen')
     */
    scrollToAnchor(hash) {
        if (!hash || !hash.startsWith('#')) return;

        const element = document.querySelector(hash);
        if (element) {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                const elementTop = element.offsetTop;
                mainContent.scrollTo({
                    top: elementTop - 20,
                    behavior: 'smooth'
                });
            } else {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    /**
     * Scroll naar top
     */
    scrollToTop() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.style.display = 'flex';
        }
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
        const appEl = document.getElementById('app');
        if (appEl) {
            appEl.style.display = 'flex';
        }
    }

    /**
     * Show content loading state
     */
    showContentLoading() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.opacity = '0.5';
        }
    }

    /**
     * Hide content loading state
     */
    hideContentLoading() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.opacity = '1';
        }
    }

    /**
     * Show error message
     * 
     * @param {string} message - Error message
     */
    showError(message) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <h2 class="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            Fout
                        </h2>
                        <p class="text-red-700 dark:text-red-300 mb-4">
                            ${message}
                        </p>
                        <button 
                            onclick="location.reload()" 
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus-ring transition-colors">
                            Pagina verversen
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SPA;
} else {
    window.SPA = SPA;
}

