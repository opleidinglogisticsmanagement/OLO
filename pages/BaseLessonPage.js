/**
 * BaseLessonPage Template
 * 
 * Basis template voor alle week pages
 * Collega's kunnen deze gebruiken als startpunt voor hun eigen content
 */

class BaseLessonPage {
    constructor(moduleId, moduleTitle, moduleSubtitle) {
        this.moduleId = moduleId;
        this.moduleTitle = moduleTitle;
        this.moduleSubtitle = moduleSubtitle;
        this.layout = new window.Layout();
        this.router = new window.Router();
        this.components = new window.Components();
    }

    /**
     * Render de complete pagina
     */
    render() {
        return `
            <!-- Skip to content link for accessibility -->
            <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus-ring">
                Spring naar hoofdinhoud
            </a>

            <div id="app" class="h-screen flex overflow-hidden">
                ${this.layout.renderSidebar(this.getModules(), this.moduleId)}
                <div class="flex-1 flex flex-col lg:ml-80 h-full">
                    ${this.layout.renderHeader(this.moduleTitle)}
                    ${this.renderMainContent()}
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
     * Get all modules configuration
     */
    getModules() {
        return [
            { id: 'start', title: 'Start', href: 'index.html' },
            { id: 'week-1', title: 'Week 1', href: 'week1.html' },
            { 
                id: 'week-2', 
                title: 'Week 2', 
                href: 'week2.html',
                subItems: [
                    { id: 'probleem-verkennen', title: 'Probleem verkennen', anchor: '#probleem-verkennen' },
                    { id: 'doelstelling-opstellen', title: 'Doelstelling opstellen', anchor: '#doelstelling-opstellen' },
                    { id: 'opdrachtgever-onderzoeker', title: 'Opdrachtgever-onderzoeker relatie', anchor: '#opdrachtgever-onderzoeker' },
                    { id: 'vormen-praktijkgericht', title: 'Vormen van praktijkgericht onderzoek', anchor: '#vormen-praktijkgericht' }
                ]
            },
            { 
                id: 'week-3', 
                title: 'Week 3', 
                href: 'week3.html',
                subItems: [
                    { id: 'onderzoeksmodel', title: 'Onderzoeksmodel', anchor: '#onderzoeksmodel' },
                    { id: 'onderzoeksmodel-why', title: 'Onderzoeksmodel, why?', anchor: '#onderzoeksmodel-why' },
                    { id: 'onderzoeksvragen', title: 'Onderzoeksvragen', anchor: '#onderzoeksvragen' },
                    { id: 'ai-onderzoeksassistent', title: 'AI-Onderzoeksassistent', anchor: '#ai-onderzoeksassistent' }
                ]
            },
            { 
                id: 'week-4', 
                title: 'Week 4', 
                href: 'week4.html',
                subItems: [
                    { id: 'definieren-begrippen', title: 'Definiëren van begrippen', anchor: '#definieren-begrippen' },
                    { id: 'literatuuronderzoek', title: 'Het uitvoeren van literatuuronderzoek', anchor: '#literatuuronderzoek' }
                ]
            },
            { 
                id: 'week-5', 
                title: 'Week 5', 
                href: 'week5.html',
                subItems: [
                    { id: 'selecteren-beoordelen', title: 'Selecteren en beoordelen', anchor: '#selecteren-beoordelen' },
                    { id: 'slim-bronnen-beheren', title: 'Slim bronnen beheren', anchor: '#slim-bronnen-beheren' },
                    { id: 'theoretisch-kader-schrijven', title: 'Theoretisch kader schrijven', anchor: '#theoretisch-kader-schrijven' }
                ]
            },
            { id: 'week-6', title: 'Week 6', href: 'week6.html' },
            { id: 'week-7', title: 'Week 7', href: 'week7.html' },
            { id: 'register', title: 'Begrippenlijst', href: 'register.html' },
            { id: 'flashcards', title: 'Oefenen', href: 'flashcards.html' },
            { id: 'afsluiting', title: 'Afsluiting', href: 'afsluiting.html' }
        ];
    }


    /**
     * Render hoofdcontent gebied
     */
    renderMainContent() {
        return `
            <main id="main-content" class="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
                    <article class="space-y-6 sm:space-y-8 fade-in">
                        ${this.renderModuleIntro()}
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
        return `
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <!-- Icon above title on mobile, beside on desktop -->
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-book text-blue-600 dark:text-blue-400 text-base sm:text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">${this.moduleTitle}: ${this.moduleSubtitle}</h1>
                        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                            Welkom bij ${this.moduleTitle}! Deze module behandelt ${this.moduleSubtitle.toLowerCase()}.
                        </p>
                        <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-3 sm:p-4 rounded-r-lg">
                            <div class="flex items-start space-x-2 sm:space-x-3">
                                <i class="fas fa-info-circle text-blue-600 dark:text-blue-400 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                                <div class="min-w-0">
                                    <h3 class="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-200 mb-1">Module Informatie</h3>
                                    <p class="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                                        Deze module bevat verschillende secties met theorie, voorbeelden en opdrachten.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render content secties - dit is waar collega's content kunnen toevoegen
     * Deze methode kan worden overschreven door subklassen
     */
    renderContentSections() {
        return `
            <!-- Leerdoelen Sectie -->
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-bullseye text-green-600 dark:text-green-400 text-base sm:text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">Leerdoelen</h2>
                        <div class="prose max-w-none">
                            <p class="text-gray-600 dark:text-gray-300 mb-4">Na het voltooien van deze module kun je:</p>
                            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                                <p class="text-gray-600 dark:text-gray-300 text-sm">
                                    <i class="fas fa-edit mr-2"></i>
                                    <strong>Voor collega's:</strong> Voeg hier de specifieke leerdoelen toe voor ${this.moduleTitle}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Theorie Sectie -->
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-book text-purple-600 dark:text-purple-400 text-base sm:text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">Theorie</h2>
                        <div class="prose max-w-none">
                            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
                                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Theorie Content</h3>
                                <p class="text-gray-600 dark:text-gray-300 text-sm">
                                    <i class="fas fa-edit mr-2"></i>
                                    <strong>Voor collega's:</strong> Voeg hier de theorie content toe voor ${this.moduleSubtitle}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Video Sectie -->
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-play text-red-600 dark:text-red-400 text-base sm:text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">Video</h2>
                        <div class="bg-black dark:bg-black rounded-lg aspect-video flex items-center justify-center mb-4 w-full">
                            <div class="text-center text-white">
                                <i class="fas fa-play-circle text-6xl mb-4 opacity-75"></i>
                                <p class="text-lg font-medium">Video Player</p>
                                <p class="text-sm opacity-75">Video content komt hier</p>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <i class="fas fa-edit mr-2"></i>
                            <strong>Voor collega's:</strong> Voeg hier video content toe voor ${this.moduleSubtitle}.
                        </p>
                    </div>
                </div>
            </section>

        `;
    }

    /**
     * Render navigatie buttons
     */
    renderNavigation() {
        const prevModule = this.getPreviousModule();
        const nextModule = this.getNextModule();

        return `
            <div class="mt-12 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                ${prevModule ? `
                    <button class="nav-button flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 w-full sm:w-auto bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus-ring transition-colors" data-nav-href="${prevModule.href}">
                        <i class="fas fa-arrow-left"></i>
                        <span>Vorige: ${prevModule.title}</span>
                    </button>
                ` : `
                    <button class="nav-button flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 w-full sm:w-auto bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus-ring transition-colors" data-nav-href="index.html">
                        <i class="fas fa-arrow-left"></i>
                        <span>Terug naar Start</span>
                    </button>
                `}
                
                ${nextModule ? `
                    <button class="nav-button flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 w-full sm:w-auto bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus-ring transition-colors" data-nav-href="${nextModule.href}">
                        <span>Volgende: ${nextModule.title}</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                ` : `
                    <div></div>
                `}
            </div>
        `;
    }

    /**
     * Get previous module
     */
    getPreviousModule() {
        const modules = this.getModules();

        const currentIndex = modules.findIndex(module => module.id === this.moduleId);
        return modules[currentIndex - 1] || null;
    }

    /**
     * Get next module
     */
    getNextModule() {
        const modules = this.getModules();

        const currentIndex = modules.findIndex(module => module.id === this.moduleId);
        return modules[currentIndex + 1] || null;
    }

    /**
     * Initialiseer de pagina
     */
    async init() {
        // 1. Data laden
        if (this.loadContent) {
            await this.loadContent();
        }

        // 2. Check of de 'app shell' (sidebar + header) al bestaat
        const appContainer = document.getElementById('app');
        
        if (appContainer) {
            // SPA MODUS: Shell bestaat al, update alleen de content en titel
            this.router.updateMainContentOnly(() => this.renderMainContent(), this.moduleTitle, this.moduleSubtitle);
            this.router.updateActiveLink(this.moduleId);
        } else {
            // FULL LOAD MODUS: Render de hele pagina (eerste bezoek of refresh)
            document.body.innerHTML = this.render();
        }

        // 3. Event listeners koppelen (opnieuw nodig voor nieuwe content)
        this.attachEventListeners();
        
        // 4. Start de SPA router (onderschept links) - doe dit maar 1 keer
        if (!window.routerInitialized) {
            this.router.setupSPARouter();
            window.routerInitialized = true;
        }
    }


    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Mobile menu functionality
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        if (mobileMenuButton && sidebar && overlay) {
            const openSidebar = () => {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent body scroll when sidebar is open
            };

            const closeSidebar = () => {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
                document.body.style.overflow = ''; // Restore body scroll
            };

            mobileMenuButton.addEventListener('click', openSidebar);
            overlay.addEventListener('click', closeSidebar);

            // Close button in sidebar
            const sidebarCloseButton = document.getElementById('sidebar-close-button');
            if (sidebarCloseButton) {
                sidebarCloseButton.addEventListener('click', closeSidebar);
            }

            // Close sidebar when clicking a navigation link on mobile
            const navLinks = sidebar.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // Only close on mobile (when sidebar is overlay)
                    if (window.innerWidth < 1024) {
                        closeSidebar();
                    }
                });
            });
        }

        // Scroll to top button functionality
        this.components.setupScrollToTopButton();

        // Setup image modal functionality (available for all pages)
        this.components.setupImageModal();
        
        // Setup accordion and tabs event delegation (for dynamically rendered content)
        this.components.setupInteractiveComponents(this.moduleId);
        
        // Setup image click handlers (desktop only, mobile uses native pinch-to-zoom)
        this.components.setupImageClickHandlers();
        
        // Setup event delegation for MC questions and navigation buttons
        this.components.setupMCQuestionAndNavigationHandlers();
        
        // Setup drag-and-drop handlers for matching exercises
        this.components.setupDragAndDropHandlers();
        
        // Setup video error detection
        this.components.setupVideoErrorDetection();
        
        // Setup dark mode toggle
        this.components.setupDarkModeToggle();
        
        // Setup submenu functionality for all modules with sub-items
        this.setupSubmenuToggles();
        
        // Setup anchor scrolling
        this.router.setupAnchorScrolling();
        
        // Setup Global Search
        this.components.setupSearchFunctionality();
    }
    
    
    /**
     * Setup submenu expand/collapse functionality for all modules
     * Supports both dynamic navigation (from renderModuleNavigation) and static sidebar (from index.html)
     * Uses a global singleton pattern to ensure only one handler exists
     */
    setupSubmenuToggles() {
        // Use a global flag to ensure we only setup once
        if (window._submenuTogglesInitialized) {
            return; // Already initialized, skip
        }
        
        // Use event delegation on document to handle chevron clicks
        // This works regardless of when elements are added or removed
        const globalToggleHandler = (e) => {
            // Check if click is on a chevron container or chevron icon
            const chevronContainer = e.target.closest('[id*="-chevron-container"]');
            const chevronIcon = e.target.closest('[id*="-chevron-index"]');
            
            if (!chevronContainer && !chevronIcon) return;
            
            // Extract week number from ID (e.g., "week-2-chevron-container" -> "2")
            const id = (chevronContainer || chevronIcon).id;
            const match = id.match(/week-(\d+)-chevron/);
            if (!match) return;
            
            const weekNum = match[1];
            const subItemsContainer = document.getElementById(`week-${weekNum}-subitems-index`);
            const chevronElement = document.getElementById(`week-${weekNum}-chevron-index`);
            
            if (!subItemsContainer || !chevronElement) return;
            
            // Prevent default and stop propagation to prevent other handlers from interfering
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const isHidden = subItemsContainer.classList.contains('hidden');
            
            if (isHidden) {
                subItemsContainer.classList.remove('hidden');
                chevronElement.classList.add('rotate-180');
            } else {
                subItemsContainer.classList.add('hidden');
                chevronElement.classList.remove('rotate-180');
            }
        };
        
        // Attach the delegated event listener in capture phase to run before other handlers
        // Use document instead of sidebar to ensure it always works
        document.addEventListener('click', globalToggleHandler, true);
        
        // Store reference for potential cleanup (though we probably won't need it)
        window._submenuToggleHandler = globalToggleHandler;
        window._submenuTogglesInitialized = true;
        
        // Also setup for dynamic navigation (if modules are defined)
        const modules = this.getModules();
        
        modules.forEach(module => {
            // Only setup for modules with sub-items
            if (!module.subItems || module.subItems.length === 0) return;
            
            const navItemClass = `.${module.id}-nav-item`;
            const navItem = document.querySelector(navItemClass);
            if (!navItem) return;
            
            const link = navItem.querySelector('a');
            const subItemsContainer = document.getElementById(`${module.id}-subitems`);
            const chevron = document.getElementById(`${module.id}-chevron`);
            const chevronContainer = document.getElementById(`${module.id}-chevron-container`);
            
            if (!link || !subItemsContainer || !chevron) return;
            
            // Check if we're on this module's page - if so, expand by default
            const isCurrentPage = this.moduleId === module.id;
            if (isCurrentPage) {
                subItemsContainer.classList.remove('hidden');
                chevron.classList.add('rotate-180');
            }
            
            // Toggle submenu only when clicking the chevron icon
            const toggleHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isHidden = subItemsContainer.classList.contains('hidden');
                
                if (isHidden) {
                    subItemsContainer.classList.remove('hidden');
                    chevron.classList.add('rotate-180');
                } else {
                    subItemsContainer.classList.add('hidden');
                    chevron.classList.remove('rotate-180');
                }
            };
            
            // Add click listener to chevron container if it exists, otherwise fallback to chevron
            const triggerElement = chevronContainer || chevron;
            triggerElement.addEventListener('click', toggleHandler);
            
            // Allow normal navigation when clicking the link (not chevron)
            link.addEventListener('click', (e) => {
                // Only prevent if clicking the chevron or its container (handled above)
                if (e.target === triggerElement || triggerElement.contains(e.target)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                // Otherwise, allow normal navigation
            });
        });
    }
    
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseLessonPage;
} else {
    window.BaseLessonPage = BaseLessonPage;
}