/**
 * LayoutRenderer
 * 
 * Verantwoordelijk voor het renderen van de layout (sidebar en header)
 * Geëxtraheerd uit BaseLessonPage voor betere code organisatie
 */

class LayoutRenderer {
    constructor(moduleId, moduleTitle) {
        this.moduleId = moduleId;
        this.moduleTitle = moduleTitle;
        
        // Detect which app we're in based on URL path, href, and hostname
        // Check hostname first (for Vercel deployments where each app has its own domain)
        // Then check href and pathname (for local development)
        const pathname = window.location.pathname;
        const href = window.location.href;
        const hostname = window.location.hostname;
        
        if (hostname.includes('operations-management') || href.includes('operations-management') || pathname.includes('operations-management')) {
            this.appId = 'operations-management';
            this.appTitle = 'Operations Management';
        } else if (hostname.includes('e-learning-demo') || href.includes('e-learning-demo') || pathname.includes('e-learning-demo')) {
            this.appId = 'e-learning-demo';
            this.appTitle = 'E-Learning Demo';
        } else if (hostname.includes('edubook-logistiek') || href.includes('edubook-logistiek') || pathname.includes('edubook-logistiek')) {
            this.appId = 'edubook-logistiek';
            this.appTitle = 'Edubook-Logistiek';
        } else if (hostname.includes('logistiek-onderzoek') || href.includes('logistiek-onderzoek') || pathname.includes('logistiek-onderzoek')) {
            this.appId = 'logistiek-onderzoek';
            this.appTitle = 'Opzetten van Logistieke Onderzoeken (OLO)';
        } else {
            // Default to logistiek-onderzoek for backward compatibility
            this.appId = 'logistiek-onderzoek';
            this.appTitle = 'Opzetten van Logistieke Onderzoeken (OLO)';
        }
    }

    /**
     * Render sidebar met navigatie
     */
    renderSidebar() {
        return `
            <aside id="sidebar" class="w-full lg:w-80 lg:max-w-[330px] bg-white dark:bg-gray-800 shadow-lg transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out fixed inset-y-0 z-40" aria-label="Navigatie menu" style="view-transition-name: sidebar;">
                <div class="h-full flex flex-col">
                    ${this.renderSidebarHeader()}
                    ${this.renderModuleNavigation()}
                </div>
            </aside>
        `;
    }

    /**
     * Render sidebar header
     */
    renderSidebarHeader() {
        return `
            <div class="px-4 sm:px-6 h-[56px] sm:h-[64px] border-b border-gray-200 dark:border-gray-700 flex items-center">
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center space-x-3 flex-1 min-w-0">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                            <i class="fas fa-graduation-cap text-white text-lg"></i>
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words leading-tight m-0 font-bold">${this.appTitle}</p>
                        </div>
                    </div>
                    <!-- Close button for mobile -->
                    <button id="sidebar-close-button" class="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus-ring ml-2 flex-shrink-0" aria-label="Sluit navigatie menu">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render module navigatie
     */
    renderModuleNavigation() {
        // Render different navigation based on app
        if (this.appId === 'operations-management') {
            return this.renderOperationsManagementNavigation();
        } else if (this.appId === 'e-learning-demo') {
            return this.renderElearningDemoNavigation();
        } else if (this.appId === 'edubook-logistiek') {
            return this.renderEdubookLogistiekNavigation();
        } else {
            return this.renderLogistiekOnderzoekNavigation();
        }
    }

    /**
     * Render navigation for operations-management app
     */
    renderOperationsManagementNavigation() {
        const modules = [
            { id: 'start', title: 'Start', href: 'index.html' },
            {
                id: 'operations-processtrategie',
                title: 'Operations en processtrategie',
                href: 'operations-processtrategie.html',
                subItems: [
                    { id: 'introductie', title: 'Introductie', anchor: '#introductie' },
                    { id: 'operations-strategie', title: 'Operations Strategie', anchor: '#operations-strategie' },
                    { id: 'competitive-priorities', title: 'Competitive priorities', anchor: '#competitive-priorities' },
                    { id: 'procesbeslissingen', title: 'Procesbeslissingen', anchor: '#procesbeslissingen' }
                ]
            },
            {
                id: 'vraagvoorspelling-deel1',
                title: 'Vraagvoorspelling (deel 1)',
                href: 'vraagvoorspelling-deel1.html',
                subItems: [
                    { id: 'introductie', title: 'Introductie', anchor: '#introductie' },
                    { id: 'vraagvoorspelproces', title: 'Vraagvoorspelproces', anchor: '#vraagvoorspelproces' },
                    { id: 'kwaliteit-van-voorspellingen', title: 'Kwaliteit van voorspellingen', anchor: '#kwaliteit-van-voorspellingen' },
                    { id: 'kwalitatieve-inschatting-en-lineaire-regressie', title: 'Kwalitatieve inschatting en lineaire regressie', anchor: '#kwalitatieve-inschatting-en-lineaire-regressie' }
                ]
            },
            { id: 'vraagvoorspelling-deel2', title: 'Vraagvoorspelling (deel 2)', href: 'vraagvoorspelling-deel2.html' },
            { id: 'productieplanning', title: 'Productieplanning', href: 'productieplanning.html' },
            { id: 'voorraadbeheer-deel1', title: 'Voorraadbeheer (deel 1)', href: 'voorraadbeheer-deel1.html' },
            { id: 'voorraadbeheer-deel2', title: 'Voorraadbeheer (deel 2)', href: 'voorraadbeheer-deel2.html' },
            { id: 'voorraadbeheer-deel3', title: 'Voorraadbeheer (deel 3)', href: 'voorraadbeheer-deel3.html' },
            { id: 'capaciteitsmanagement-deel1', title: 'Capaciteitsmanagement (deel 1)', href: 'capaciteitsmanagement-deel1.html' },
            { id: 'capaciteitsmanagement-deel2', title: 'Capaciteitsmanagement (deel 2)', href: 'capaciteitsmanagement-deel2.html' },
            { id: 'operations-planning-scheduling', title: 'Operations planning en scheduling', href: 'operations-planning-scheduling.html' }
        ];

        return this.renderModuleNavigationItems(modules);
    }

    /**
     * Render navigation for e-learning-demo app
     */
    renderElearningDemoNavigation() {
        const modules = [
            { id: 'start', title: 'Start', href: 'index.html' },
            { id: 'module1', title: 'Het Fundament', href: 'module1.html' },
            { id: 'cursor', title: 'Cursor', href: 'cursor.html' },
            {
                id: 'fase3',
                title: 'De Catalogus',
                href: 'fase3.html',
                subItems: [
                    { id: 'basis-elementen', title: 'Basis Elementen', anchor: '#basis-elementen' },
                    { id: 'informatie-ordening', title: 'Informatie-ordening', anchor: '#informatie-ordening' },
                    { id: 'checklists', title: 'Checklists', anchor: '#checklists' },
                    { id: 'interactieve-oefeningen', title: 'Interactieve Oefeningen', anchor: '#interactieve-oefeningen' },
                    { id: 'geavanceerde-ai-tools', title: 'Geavanceerde AI-Tools', anchor: '#geavanceerde-ai-tools' }
                ]
            },
            { id: 'genai', title: 'GenAI in de e-learning', href: 'genai.html' },
            { id: 'content-schrijven', title: 'Content Schrijven', href: 'content-schrijven.html' },
            { id: 'formules-katex', title: 'Formules met KaTeX', href: 'formules-katex.html' },
            { id: 'publiceren', title: 'E-learning publiceren', href: 'publiceren.html' }
        ];

        return this.renderModuleNavigationItems(modules);
    }

    /**
     * Render navigation for edubook-logistiek app
     */
    renderEdubookLogistiekNavigation() {
        const modules = [
            { id: 'start', title: 'Start', href: 'index.html' },
            { 
                id: 'hd09', 
                title: 'HD 09 - Supply Chain', 
                href: 'hd09.html',
                subItems: [
                    { id: 'introductie', title: 'Introductie', anchor: '#introductie' },
                    { id: '9-1', title: '9.1 Supply Chain naar Demand Chain', anchor: '#9-1' },
                    { id: '9-2', title: '9.2 Samenwerking in de supply chain', anchor: '#9-2' },
                    { id: '9-3', title: '9.3 Horizontale en Verticale Samenwerking', anchor: '#9-3' },
                    { id: '9-4', title: '9.4 De Vijf Integratievormen', anchor: '#9-4' },
                    { id: '9-5', title: '9.5 The Extended Enterprise', anchor: '#9-5' },
                    { id: '9-6', title: '9.6 Supply Chain Maturity Models', anchor: '#9-6' },
                    { id: 'bronvermelding', title: 'Bronvermelding', anchor: '#bronvermelding' }
                ]
            }
        ];

        return this.renderModuleNavigationItems(modules);
    }

    /**
     * Render navigation for logistiek-onderzoek app
     */
    renderLogistiekOnderzoekNavigation() {
        const modules = [
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
            { 
                id: 'week-6', 
                title: 'Week 6', 
                href: 'week6.html',
                subItems: [
                    { id: 'kernbeslissingen', title: 'Kernbeslissingen', anchor: '#kernbeslissingen' },
                    { id: 'onderzoekstrategie', title: 'Onderzoeksstrategie', anchor: '#onderzoekstrategie' },
                    { id: 'dataverzamelingsplan', title: 'Het dataverzamelingsplan', anchor: '#dataverzamelingsplan' }
                ]
            },
            { id: 'week-7', title: 'Week 7', href: 'week7.html' },
            { id: 'register', title: 'Begrippenlijst', href: 'register.html' },
            { id: 'afsluiting', title: 'Afsluiting', href: 'afsluiting.html' }
        ];

        return this.renderModuleNavigationItems(modules);
    }

    /**
     * Render module navigation items from a modules array
     * @param {Array} modules - Array of module objects with id, title, href, and optional subItems
     */
    renderModuleNavigationItems(modules) {
        const moduleItems = modules.map(module => {
            const isCurrent = module.id === this.moduleId;
            const hasSubItems = module.subItems && module.subItems.length > 0;
            const isWeek2 = module.id === 'week-2';
            const isWeek3 = module.id === 'week-3';
            const isWeek4 = module.id === 'week-4';
            const isWeek5 = module.id === 'week-5';
            const isWeek6 = module.id === 'week-6';
            const isHD09 = module.id === 'hd09';
            const isOperationsProcesstrategie = module.id === 'operations-processtrategie';
            const isVraagvoorspellingDeel1 = module.id === 'vraagvoorspelling-deel1';
            const isFase3 = module.id === 'fase3';
            
            // Special handling for modules with sub-items
            if (hasSubItems && (isWeek2 || isWeek3 || isWeek4 || isWeek5 || isWeek6 || isHD09 || isOperationsProcesstrategie || isVraagvoorspellingDeel1 || isFase3)) {
                const subItemsHtml = module.subItems.map(subItem => {
                    const isSubCurrent = window.location.hash === subItem.anchor || 
                                        (isCurrent && window.location.hash === subItem.anchor);
                    return `
                        <a href="${module.href}${subItem.anchor}" 
                           class="nav-sub-item flex items-center space-x-3 pl-11 pr-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors ${isSubCurrent ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}"
                           data-anchor="${subItem.anchor}">
                            <div class="w-6 h-6 ${isSubCurrent ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'} rounded flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-circle text-xs ${isSubCurrent ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}"></i>
                            </div>
                            <span class="text-sm font-medium">${subItem.title}</span>
                        </a>
                    `;
                }).join('');
                
                let navItemClass, chevronId, subItemsId;
                if (isWeek2) {
                    navItemClass = 'week-2-nav-item';
                    chevronId = 'week-2-chevron';
                    subItemsId = 'week-2-subitems';
                } else if (isWeek3) {
                    navItemClass = 'week-3-nav-item';
                    chevronId = 'week-3-chevron';
                    subItemsId = 'week-3-subitems';
                } else if (isWeek4) {
                    navItemClass = 'week-4-nav-item';
                    chevronId = 'week-4-chevron';
                    subItemsId = 'week-4-subitems';
                } else if (isWeek5) {
                    navItemClass = 'week-5-nav-item';
                    chevronId = 'week-5-chevron';
                    subItemsId = 'week-5-subitems';
                } else if (isWeek6) {
                    navItemClass = 'week-6-nav-item';
                    chevronId = 'week-6-chevron';
                    subItemsId = 'week-6-subitems';
                } else if (isHD09) {
                    navItemClass = 'hd09-nav-item';
                    chevronId = 'hd09-chevron-index';
                    subItemsId = 'hd09-subitems-index';
                } else if (isOperationsProcesstrategie) {
                    navItemClass = 'operations-processtrategie-nav-item';
                    chevronId = 'operations-processtrategie-chevron-index';
                    subItemsId = 'operations-processtrategie-submenu';
                } else if (isVraagvoorspellingDeel1) {
                    navItemClass = 'vraagvoorspelling-deel1-nav-item';
                    chevronId = 'vraagvoorspelling-deel1-chevron-index';
                    subItemsId = 'vraagvoorspelling-deel1-submenu';
                } else if (isFase3) {
                    navItemClass = 'fase3-nav-item';
                    chevronId = 'fase3-chevron-index';
                    subItemsId = 'fase3-subitems-index';
                }
                
                return `
                    <div class="${navItemClass}">
                        <a href="${module.href}" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors ${isCurrent ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}">
                            <div class="w-8 h-8 ${isCurrent ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'} rounded-lg flex items-center justify-center">
                                <i class="fas fa-book text-sm ${isCurrent ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}"></i>
                            </div>
                            <span class="font-medium flex-1">${module.title}</span>
                            <i class="fas fa-chevron-down text-xs text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isCurrent ? 'rotate-180' : ''}" id="${chevronId}"></i>
                        </a>
                        <div class="${isOperationsProcesstrategie || isVraagvoorspellingDeel1 || isFase3 ? 'nav-sub-items' : (isHD09 ? 'hd09-subitems' : navItemClass.replace('-nav-item', '-subitems'))} ${isCurrent ? '' : 'hidden'}" id="${subItemsId}">
                            ${subItemsHtml}
                        </div>
                    </div>
                `;
            }
            
            // Regular module item without sub-items
            return `
                <a href="${module.href}" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors ${isCurrent ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}">
                    <div class="w-8 h-8 ${isCurrent ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'} rounded-lg flex items-center justify-center">
                        <i class="fas fa-book text-sm ${isCurrent ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}"></i>
                    </div>
                    <span class="font-medium">${module.title}</span>
                </a>
            `;
        }).join('');

        return `
            <nav class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6" aria-label="Module navigatie">
                <div class="space-y-2">
                    <div class="px-3 py-2 mb-2">
                        <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">E-Learning</span>
                    </div>
                    ${moduleItems}
                </div>
            </nav>
        `;
    }

    /**
     * Render header met breadcrumbs
     */
    renderHeader() {
        return `
            <header class="fixed top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 lg:left-80 left-0 right-0" id="main-header" style="view-transition-name: main-header;">
                <div class="px-4 sm:px-6 h-[56px] sm:h-[64px] transition-colors duration-200 flex items-center">
                    <div class="flex items-center justify-between relative z-10 bg-white dark:bg-gray-800 transition-colors duration-200 w-full">
                    <!-- Left section: Mobile menu & Breadcrumbs -->
                    <div class="flex items-center flex-1 min-w-0">
                        <!-- Mobile menu button -->
                        <button id="mobile-menu-button" class="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus-ring transition-colors mr-2" aria-label="Open navigatie menu">
                            <i class="fas fa-bars text-xl"></i>
                        </button>

                        <!-- Breadcrumbs - hidden on mobile, visible on tablet+ -->
                        <nav class="hidden sm:flex items-center space-x-2 text-sm flex-shrink-0" aria-label="Breadcrumb">
                            <a href="index.html" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus-ring transition-colors">Start</a>
                            <i class="fas fa-chevron-right text-gray-400 dark:text-gray-500 text-xs"></i>
                            <span class="text-gray-900 dark:text-white font-medium">${this.moduleTitle}</span>
                        </nav>
                        
                        <!-- Mobile title - only visible on mobile -->
                        <h1 class="lg:hidden text-base font-semibold text-gray-900 dark:text-white truncate flex-1">${this.moduleTitle}</h1>
                    </div>

                    <!-- Right section: Actions -->
                    <div class="flex items-center space-x-2 sm:space-x-3 ml-4">
                        <!-- Search Toggle Button -->
                        <button 
                            id="search-toggle-btn" 
                            class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                            aria-label="Zoeken">
                            <i class="fas fa-search text-lg"></i>
                        </button>
                        
                        <!-- Fancy Dark Mode Toggle -->
                        <button 
                            id="dark-mode-toggle" 
                            class="relative p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 focus-ring transition-all duration-300 group shadow-sm hover:shadow-md" 
                            aria-label="Toggle dark mode"
                            title="Dark mode">
                            <div class="relative w-6 h-6 flex items-center justify-center overflow-hidden">
                                <!-- Sun icon (light mode) -->
                                <i id="dark-mode-icon-sun" class="fas fa-sun text-yellow-500 absolute transform transition-all duration-500 rotate-0 scale-100 opacity-100 dark:rotate-90 dark:scale-0 dark:opacity-0"></i>
                                <!-- Moon icon (dark mode) -->
                                <i id="dark-mode-icon-moon" class="fas fa-moon text-blue-400 absolute transform transition-all duration-500 rotate-0 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100"></i>
                            </div>
                            <!-- Animated background glow effect -->
                            <span class="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                        </button>
                    </div>
                </div>

                <!-- Search Overlay (Hidden by default) -->
                <div id="search-overlay" class="absolute inset-0 bg-white dark:bg-gray-800 z-20 px-4 sm:px-6 flex items-center opacity-0 pointer-events-none transition-all duration-300 transform -translate-y-2">
                    <div class="relative w-full max-w-3xl mx-auto flex items-center">
                        <i class="fas fa-search text-gray-400 dark:text-gray-500 absolute left-3"></i>
                        <input 
                            type="text" 
                            id="global-search-input" 
                            class="block w-full pl-10 pr-10 py-2 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 sm:text-lg transition-colors duration-200" 
                            placeholder="Waar ben je naar op zoek?"
                            autocomplete="off"
                        >
                        <button id="close-search-btn" class="absolute right-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <i class="fas fa-times text-lg"></i>
                        </button>
                        
                        <!-- Results Dropdown -->
                        <div id="search-results-dropdown" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-b-lg border-x border-b border-gray-200 dark:border-gray-700 max-h-[70vh] overflow-auto hidden z-50 custom-scrollbar">
                            <!-- Results will be injected here -->
                        </div>
                    </div>
                </div>
            </header>
        `;
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LayoutRenderer;
} else {
    window.LayoutRenderer = LayoutRenderer;
}
