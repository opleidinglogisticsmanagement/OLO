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

            <div id="app" class="min-h-screen flex">
                ${this.renderSidebar()}
                <div class="flex-1 flex flex-col lg:ml-0">
                    ${this.renderHeader()}
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
     * Render sidebar met navigatie
     */
    renderSidebar() {
        return `
            <aside id="sidebar" class="w-full sm:w-80 bg-white dark:bg-gray-800 shadow-lg transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static fixed inset-y-0 z-40" aria-label="Navigatie menu">
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
            <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3 flex-1 min-w-0">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                            <i class="fas fa-graduation-cap text-white text-lg"></i>
                        </div>
                        <div class="min-w-0 flex-1">
                            <h1 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">E-Learning</h1>
                            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words">Opzetten van Logistieke Onderzoeken (OLO)</p>
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
            { id: 'week-6', title: 'Week 6', href: 'week6.html' },
            { id: 'week-7', title: 'Week 7', href: 'week7.html' },
            { id: 'register', title: 'Begrippenlijst', href: 'register.html' },
            { id: 'afsluiting', title: 'Afsluiting', href: 'afsluiting.html' }
        ];

        const moduleItems = modules.map(module => {
            const isCurrent = module.id === this.moduleId;
            const hasSubItems = module.subItems && module.subItems.length > 0;
            const isWeek2 = module.id === 'week-2';
            const isWeek3 = module.id === 'week-3';
            const isWeek4 = module.id === 'week-4';
            const isWeek5 = module.id === 'week-5';
            
            // Special handling for Week 2, Week 3, Week 4 and Week 5 with sub-items
            if (hasSubItems && (isWeek2 || isWeek3 || isWeek4 || isWeek5)) {
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
                        <div class="${navItemClass.replace('-nav-item', '-subitems')} ${isCurrent ? '' : 'hidden'}" id="${subItemsId}">
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
            <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30 transition-colors duration-200 relative">
                <div class="flex items-center justify-between relative z-10 bg-white dark:bg-gray-800 transition-colors duration-200">
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
        const modules = [
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

        const currentIndex = modules.findIndex(module => module.id === this.moduleId);
        return modules[currentIndex - 1] || null;
    }

    /**
     * Get next module
     */
    getNextModule() {
        const modules = [
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

        const currentIndex = modules.findIndex(module => module.id === this.moduleId);
        return modules[currentIndex + 1] || null;
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
        this.setupScrollToTopButton();

        // Setup image modal functionality (available for all pages)
        this.setupImageModal();
        
        // Setup accordion and tabs event delegation (for dynamically rendered content)
        this.setupInteractiveComponents();
        
        // Setup image click handlers (desktop only, mobile uses native pinch-to-zoom)
        this.setupImageClickHandlers();
        
        // Setup event delegation for MC questions and navigation buttons
        this.setupMCQuestionAndNavigationHandlers();
        
        // Setup drag-and-drop handlers for matching exercises
        this.setupDragAndDropHandlers();
        
        // Setup video error detection
        this.setupVideoErrorDetection();
        
        // Setup dark mode toggle
        this.setupDarkModeToggle();
        
        // Setup Week 2, Week 3, Week 4 and Week 5 submenu functionality
        this.setupWeek2Submenu();
        this.setupWeek3Submenu();
        this.setupWeek4Submenu();
        this.setupWeek5Submenu();
        
        // Setup anchor scrolling
        this.setupAnchorScrolling();
        
        // Setup Global Search
        this.setupSearchFunctionality();
    }
    
    /**
     * Setup global search functionality
     */
    async setupSearchFunctionality() {
        const searchInput = document.getElementById('global-search-input');
        const resultsDropdown = document.getElementById('search-results-dropdown');
        const searchToggleBtn = document.getElementById('search-toggle-btn');
        const searchOverlay = document.getElementById('search-overlay');
        const closeSearchBtn = document.getElementById('close-search-btn');
        
        if (!searchInput || !resultsDropdown) return;
        
        // Initialize search service (lazy load)
        if (window.SearchService && !window.SearchService.isInitialized) {
            // Start init in background
            window.SearchService.init().catch(console.error);
        }
        
        // Toggle Search Overlay Logic
        if (searchToggleBtn && searchOverlay) {
            const openSearch = () => {
                searchOverlay.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
                searchOverlay.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
                // Focus input after transition starts
                setTimeout(() => searchInput.focus(), 50);
            };

            const closeSearch = () => {
                searchOverlay.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
                searchOverlay.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                // Optional: Clear results when closing, but keep query text for now
                resultsDropdown.classList.add('hidden');
            };

            searchToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openSearch();
            });

            if (closeSearchBtn) {
                closeSearchBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeSearch();
                });
            }
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !searchOverlay.classList.contains('opacity-0')) {
                    closeSearch();
                }
            });
        }
        
        let debounceTimer;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (query.length < 2) {
                    resultsDropdown.classList.add('hidden');
                    resultsDropdown.innerHTML = '';
                    return;
                }
                
                if (window.SearchService) {
                    // Ensure initialized
                    if (!window.SearchService.isInitialized) {
                        window.SearchService.init().then(() => {
                            this.performSearch(query, resultsDropdown);
                        });
                    } else {
                        this.performSearch(query, resultsDropdown);
                    }
                }
            }, 300);
        });
        
        // Close dropdown on click outside
        document.addEventListener('click', (e) => {
            // Check if click is outside search input and dropdown
            const isOutsideSearch = !searchInput.contains(e.target) && !resultsDropdown.contains(e.target);
            
            // Also check if it's outside the toggle button (to prevent immediate closing when opening)
            const isOutsideToggle = !searchToggleBtn || !searchToggleBtn.contains(e.target);
            
            // If we have an overlay, check if we clicked the overlay background (outside the input container)
            // The input container is the first child of overlay
            let isOutsideContainer = true;
            if (searchOverlay && searchOverlay.contains(e.target)) {
                const container = searchOverlay.firstElementChild;
                if (container && container.contains(e.target)) {
                    isOutsideContainer = false;
                }
            }

            if (isOutsideSearch && isOutsideToggle) {
                resultsDropdown.classList.add('hidden');
                
                // If we clicked on the overlay background (and not the input container), close the whole search
                if (searchOverlay && !searchOverlay.classList.contains('opacity-0') && e.target === searchOverlay) {
                    searchOverlay.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
                    searchOverlay.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                }
            }
        });
        
        // Show results again on focus if there is a query
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.length >= 2 && resultsDropdown.children.length > 0) {
                resultsDropdown.classList.remove('hidden');
            }
        });
    }
    
    /**
     * Perform search and render results
     */
    performSearch(query, container) {
        const results = window.SearchService.search(query);
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Geen resultaten gevonden voor "${query}"
                </div>
            `;
        } else {
            container.innerHTML = results.map(result => `
                <a href="${result.url}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-blue-600 dark:text-blue-400">${result.context || result.week}</span>
                        <span class="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full uppercase tracking-wider">${result.type}</span>
                    </div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">${result.title}</div>
                    ${result.snippet ? `<div class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">${result.snippet}</div>` : ''}
                </a>
            `).join('');
        }
        
        container.classList.remove('hidden');
    }
    
    /**
     * Setup Week 2 submenu expand/collapse functionality
     */
    setupWeek2Submenu() {
        const week2NavItem = document.querySelector('.week-2-nav-item');
        if (!week2NavItem) return;
        
        const week2Link = week2NavItem.querySelector('a');
        const subItemsContainer = document.getElementById('week-2-subitems');
        const chevron = document.getElementById('week-2-chevron');
        
        if (!week2Link || !subItemsContainer || !chevron) return;
        
        // Check if we're on Week 2 page - if so, expand by default
        const isWeek2Page = this.moduleId === 'week-2';
        if (isWeek2Page) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Toggle submenu only when clicking the chevron icon
        chevron.addEventListener('click', (e) => {
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
        });
        
        // Allow normal navigation when clicking the link (not chevron)
        week2Link.addEventListener('click', (e) => {
            // Only prevent if clicking the chevron (handled above)
            if (e.target === chevron || chevron.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
            }
            // Otherwise, allow normal navigation
        });
    }
    
    /**
     * Setup Week 3 submenu expand/collapse functionality
     */
    setupWeek3Submenu() {
        const week3NavItem = document.querySelector('.week-3-nav-item');
        if (!week3NavItem) return;
        
        const week3Link = week3NavItem.querySelector('a');
        const subItemsContainer = document.getElementById('week-3-subitems');
        const chevron = document.getElementById('week-3-chevron');
        
        if (!week3Link || !subItemsContainer || !chevron) return;
        
        // Check if we're on Week 3 page - if so, expand by default
        const isWeek3Page = this.moduleId === 'week-3';
        if (isWeek3Page) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Toggle submenu only when clicking the chevron icon
        chevron.addEventListener('click', (e) => {
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
        });
        
        // Allow normal navigation when clicking the link (not chevron)
        week3Link.addEventListener('click', (e) => {
            // Only prevent if clicking the chevron (handled above)
            if (e.target === chevron || chevron.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
            }
            // Otherwise, allow normal navigation
        });
    }
    
    /**
     * Setup Week 4 submenu expand/collapse functionality
     */
    setupWeek4Submenu() {
        const week4NavItem = document.querySelector('.week-4-nav-item');
        if (!week4NavItem) return;
        
        const week4Link = week4NavItem.querySelector('a');
        const subItemsContainer = document.getElementById('week-4-subitems');
        const chevron = document.getElementById('week-4-chevron');
        
        if (!week4Link || !subItemsContainer || !chevron) return;
        
        // Check if we're on Week 4 page - if so, expand by default
        const isWeek4Page = this.moduleId === 'week-4';
        if (isWeek4Page) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Toggle submenu only when clicking the chevron icon
        chevron.addEventListener('click', (e) => {
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
        });
        
        // Allow normal navigation when clicking the link (not chevron)
        week4Link.addEventListener('click', (e) => {
            // Only prevent if clicking the chevron (handled above)
            if (e.target === chevron || chevron.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
            }
            // Otherwise, allow normal navigation
        });
    }
    
    /**
     * Setup Week 5 submenu expand/collapse functionality
     */
    setupWeek5Submenu() {
        const week5NavItem = document.querySelector('.week-5-nav-item');
        if (!week5NavItem) return;
        
        const week5Link = week5NavItem.querySelector('a');
        const subItemsContainer = document.getElementById('week-5-subitems');
        const chevron = document.getElementById('week-5-chevron');
        
        if (!week5Link || !subItemsContainer || !chevron) return;
        
        // Check if we're on Week 5 page - if so, expand by default
        const isWeek5Page = this.moduleId === 'week-5';
        if (isWeek5Page) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Toggle submenu only when clicking the chevron icon
        chevron.addEventListener('click', (e) => {
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
        });
        
        // Allow normal navigation when clicking the link (not chevron)
        week5Link.addEventListener('click', (e) => {
            // Only prevent if clicking the chevron (handled above)
            if (e.target === chevron || chevron.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
            }
            // Otherwise, allow normal navigation
        });
    }
    
    /**
     * Setup smooth scrolling to anchors
     */
    setupAnchorScrolling() {
        // Use event delegation to handle clicks on navigation sub-items
        // This works even if elements are added dynamically
        const handleNavClick = (e) => {
            const navSubItem = e.target.closest('.nav-sub-item');
            if (navSubItem) {
                let anchor = navSubItem.getAttribute('data-anchor');
                const href = navSubItem.getAttribute('href');
                
                // If no data-anchor, extract from href
                if (!anchor && href && href.includes('#')) {
                    anchor = '#' + href.split('#')[1];
                }
                
                // Ensure anchor starts with #
                if (anchor && !anchor.startsWith('#')) {
                    anchor = '#' + anchor;
                }
                
                if (anchor && href) {
                    // If we're already on week2.html, week3.html, week4.html or week5.html, prevent navigation and scroll
                    const isWeek2Page = window.location.pathname.includes('week2.html') || 
                                       window.location.pathname.endsWith('week2.html') ||
                                       window.location.href.includes('week2.html');
                    const isWeek3Page = window.location.pathname.includes('week3.html') || 
                                       window.location.pathname.endsWith('week3.html') ||
                                       window.location.href.includes('week3.html');
                    const isWeek4Page = window.location.pathname.includes('week4.html') || 
                                       window.location.pathname.endsWith('week4.html') ||
                                       window.location.href.includes('week4.html');
                    const isWeek5Page = window.location.pathname.includes('week5.html') || 
                                       window.location.pathname.endsWith('week5.html') ||
                                       window.location.href.includes('week5.html');
                    
                    if (isWeek2Page || isWeek3Page || isWeek4Page || isWeek5Page) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('[BaseLessonPage] Scrolling to anchor:', anchor);
                        this.scrollToAnchor(anchor);
                        
                        // Update URL hash without scrolling
                        if (window.history && window.history.pushState) {
                            window.history.pushState(null, null, anchor);
                        }
                        
                        // Close sidebar on mobile after clicking
                        const sidebar = document.getElementById('sidebar');
                        const overlay = document.getElementById('overlay');
                        if (window.innerWidth < 1024 && sidebar && overlay) {
                            sidebar.classList.add('-translate-x-full');
                            overlay.classList.add('hidden');
                            document.body.style.overflow = '';
                        }
                    }
                    // If we're not on week2.html, let the link navigate normally
                    // The hash will be handled when the page loads via Week2LessonPage.init()
                }
            }
        };
        
        // Add event listener using delegation
        document.addEventListener('click', handleNavClick, true);
        
        // Handle hash in URL on page load (after content is loaded)
        const handleHashOnLoad = (attempt = 1, maxAttempts = 10) => {
            if (window.location.hash && (this.moduleId === 'week-2' || this.moduleId === 'week-3' || this.moduleId === 'week-4' || this.moduleId === 'week-5')) {
                const hash = window.location.hash;
                const element = document.querySelector(hash);
                
                if (element) {
                    console.log(`[BaseLessonPage] ✅ Element found for ${hash} (attempt ${attempt})`);
                    this.scrollToAnchor(hash);
                } else if (attempt < maxAttempts) {
                    // Element not found yet, retry with increasing delay
                    const delay = Math.min(300 * attempt, 2000); // Max 2 seconds between attempts
                    console.log(`[BaseLessonPage] Element not found for ${hash}, retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})...`);
                    setTimeout(() => handleHashOnLoad(attempt + 1, maxAttempts), delay);
                } else {
                    console.warn(`[BaseLessonPage] ⚠️ Element with hash ${hash} not found after ${maxAttempts} attempts`);
                    // List available IDs for debugging
                    const availableIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
                    const relevantIds = availableIds.filter(id => 
                        id.includes('probleem') || id.includes('doelstelling') || 
                        id.includes('opdrachtgever') || id.includes('vormen') ||
                        id.includes('definieren') || id.includes('literatuur') ||
                        id.includes('selecteren') || id.includes('slim') || id.includes('theoretisch')
                    );
                    console.log('[BaseLessonPage] Available relevant IDs:', relevantIds);
                }
            }
        };
        
        // Try after delays (in case content loads asynchronously)
        // Start with shorter delay, then increase
        setTimeout(() => handleHashOnLoad(1), 500);
        setTimeout(() => handleHashOnLoad(3), 1500);
        setTimeout(() => handleHashOnLoad(6), 3000);
    }
    
    /**
     * Scroll to anchor with smooth behavior
     */
    scrollToAnchor(anchor) {
        // Ensure anchor starts with #
        const anchorId = anchor.startsWith('#') ? anchor : '#' + anchor;
        console.log('[BaseLessonPage] scrollToAnchor called with:', anchorId);
        
        // Try multiple times in case content is still loading
        const attemptScroll = (attempts = 0) => {
            const element = document.querySelector(anchorId);
            const mainContent = document.getElementById('main-content');
            const headerOffset = 100;
            
            if (element && mainContent) {
                console.log('[BaseLessonPage] Element found:', element);
                
                // Calculate scroll position: find element's offsetTop relative to main-content
                let scrollPosition = 0;
                let currentElement = element;
                
                // Walk up the DOM tree until we reach main-content
                while (currentElement && currentElement !== mainContent && currentElement !== document.body) {
                    scrollPosition += currentElement.offsetTop;
                    currentElement = currentElement.offsetParent;
                }
                
                // Subtract header offset
                const targetScroll = Math.max(0, scrollPosition - headerOffset);
                
                console.log('[BaseLessonPage] Calculated scroll position:', targetScroll, 'Current scroll:', mainContent.scrollTop);
                
                // Scroll the container
                mainContent.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
                
                // Verify scroll worked after a delay
                setTimeout(() => {
                    const elementRect = element.getBoundingClientRect();
                    const containerRect = mainContent.getBoundingClientRect();
                    const elementTopRelative = elementRect.top - containerRect.top;
                    
                    // If element is not at the right position, use scrollIntoView as fallback
                    if (Math.abs(elementTopRelative - headerOffset) > 50) {
                        console.log('[BaseLessonPage] Scroll position incorrect, using scrollIntoView fallback');
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        });
                        
                        // Adjust for header after scrollIntoView
                        setTimeout(() => {
                            const currentScroll = mainContent.scrollTop;
                            mainContent.scrollTo({
                                top: Math.max(0, currentScroll - headerOffset),
                                behavior: 'smooth'
                            });
                        }, 400);
                    }
                }, 600);
                
            } else if (element && !mainContent) {
                // Fallback: scroll window if no main-content container
                console.log('[BaseLessonPage] No main-content container, scrolling window');
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
                
                setTimeout(() => {
                    const elementRect = element.getBoundingClientRect();
                    const offsetPosition = elementRect.top + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: Math.max(0, offsetPosition),
                        behavior: 'smooth'
                    });
                }, 100);
                
            } else if (attempts < 15) {
                // Retry if element not found yet (content might still be loading)
                // Use increasing delay for retries
                const delay = Math.min(300 * (attempts + 1), 2000); // Max 2 seconds between attempts
                console.log(`[BaseLessonPage] Element not found, retrying in ${delay}ms... (attempt ${attempts + 1}/15)`);
                setTimeout(() => attemptScroll(attempts + 1), delay);
            } else {
                console.warn(`[BaseLessonPage] ⚠️ Element with anchor ${anchorId} not found after ${attempts} attempts.`);
                // List available IDs for debugging
                const availableIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
                const relevantIds = availableIds.filter(id => 
                    id.includes('probleem') || id.includes('doelstelling') || 
                    id.includes('opdrachtgever') || id.includes('vormen') ||
                    id.includes('definieren') || id.includes('literatuur') ||
                    id.includes('selecteren') || id.includes('slim') || id.includes('theoretisch') ||
                    id.includes('onderzoeksmodel') || id.includes('onderzoeksvragen') || id.includes('ai-onderzoeksassistent')
                );
                console.log('[BaseLessonPage] Available relevant IDs:', relevantIds);
                console.log('[BaseLessonPage] All IDs on page:', availableIds);
            }
        };
        
        // Start attempt immediately
        attemptScroll();
    }
    
    /**
     * Setup dark mode toggle functionality
     */
    setupDarkModeToggle() {
        // Retry mechanisme - wacht tot DarkMode.js geladen is
        const trySetup = (attempts = 0) => {
            const darkModeToggle = document.getElementById('dark-mode-toggle');
            const sunIcon = document.getElementById('dark-mode-icon-sun');
            const moonIcon = document.getElementById('dark-mode-icon-moon');
            
            if (!darkModeToggle) {
                // Toggle button bestaat nog niet (mogelijk nog niet gerenderd)
                if (attempts < 10) {
                    setTimeout(() => trySetup(attempts + 1), 100);
                }
                return;
            }
            
            if (window.DarkMode) {
                // Update icons on initial load
                this.updateDarkModeIcons(sunIcon, moonIcon);
                
                // Toggle dark mode on click
                darkModeToggle.addEventListener('click', () => {
                    window.DarkMode.toggle();
                    this.updateDarkModeIcons(sunIcon, moonIcon);
                });
                
                // Listen for dark mode changes (e.g., from other pages or system preference)
                window.addEventListener('darkModeChange', () => {
                    this.updateDarkModeIcons(sunIcon, moonIcon);
                });
            } else {
                // DarkMode.js nog niet geladen, probeer opnieuw
                if (attempts < 10) {
                    setTimeout(() => trySetup(attempts + 1), 100);
                } else {
                    console.warn('DarkMode.js kon niet worden geladen na 10 pogingen');
                }
            }
        };
        
        // Start setup (met kleine delay om zeker te zijn dat DOM klaar is)
        setTimeout(() => trySetup(), 50);
    }
    
    /**
     * Update dark mode icons based on current state
     */
    updateDarkModeIcons(sunIcon, moonIcon) {
        if (!sunIcon || !moonIcon || !window.DarkMode) return;
        
        const isDark = window.DarkMode.isDark();
        
        if (isDark) {
            // Dark mode: show moon, hide sun
            sunIcon.classList.add('rotate-90', 'scale-0', 'opacity-0');
            sunIcon.classList.remove('rotate-0', 'scale-100', 'opacity-100');
            moonIcon.classList.remove('rotate-0', 'scale-0', 'opacity-0');
            moonIcon.classList.add('rotate-0', 'scale-100', 'opacity-100');
        } else {
            // Light mode: show sun, hide moon
            sunIcon.classList.remove('rotate-90', 'scale-0', 'opacity-0');
            sunIcon.classList.add('rotate-0', 'scale-100', 'opacity-100');
            moonIcon.classList.add('rotate-0', 'scale-0', 'opacity-0');
            moonIcon.classList.remove('rotate-0', 'scale-100', 'opacity-100');
        }
    }
    
    /**
     * Setup event delegation for accordions and tabs
     * This ensures they work even when content is dynamically rendered
     */
    setupInteractiveComponents() {
        // Use a global flag to prevent multiple event listeners across all instances
        if (window._interactiveComponentsSetup) {
            return; // Already setup globally
        }
        window._interactiveComponentsSetup = true;
        
        // Setup event delegation that works reliably for both desktop and mobile
        // Use a single event listener on document that handles all accordions, tabs, and clickable steps
        // IMPORTANT: Only handle specific interactive components - let other buttons with inline onclick work normally
        const handleInteractiveClick = (e) => {
            // Only handle buttons that match our specific patterns
            // Don't interfere with other buttons that use inline onclick (like exercise buttons)
            
            const clickedButton = e.target.closest('button');
            if (!clickedButton) return; // Not a button click, let event continue
            
            // Check both onclick attribute (if still present) and data-onclick (if stored)
            let onclickAttr = clickedButton.getAttribute('onclick');
            if (!onclickAttr) {
                onclickAttr = clickedButton.getAttribute('data-onclick');
            }
            if (!onclickAttr) return; // No onclick data, let event continue
            
            // Early return for buttons we don't handle - let their inline onclick work normally
            // Only handle: toggleAccordion, toggleClickableStep, switchTab
            const isAccordionButton = onclickAttr.includes('toggleAccordion');
            const isClickableStepButton = onclickAttr.includes('toggleClickableStep');
            const isTabButton = onclickAttr.includes('switchTab');
            
            if (!isAccordionButton && !isClickableStepButton && !isTabButton) {
                // This is not one of our buttons (e.g., exercise buttons), let inline onclick work
                return;
            }
            
            // Check for accordion buttons
            if (isAccordionButton && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.toggleAccordion) {
                const match = onclickAttr.match(/toggleAccordion\('([^']+)',\s*'([^']+)',\s*([^)]+)\)/);
                if (match) {
                    // CRITICAL: Remove inline onclick FIRST to prevent it from executing
                    // This must happen in capture phase before the inline onclick runs
                    clickedButton.removeAttribute('onclick');
                    
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    const contentId = match[1];
                    const buttonId = match[2];
                    const usePlusIcon = match[3] === 'true';
                    
                    try {
                        window.InteractiveRenderer.toggleAccordion(contentId, buttonId, usePlusIcon);
                    } catch (err) {
                        console.error('Error toggling accordion:', err);
                    }
                    return false;
                }
            }
            
            // Check for clickable step buttons (used in week4)
            if (isClickableStepButton && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.toggleClickableStep) {
                // Match with or without allowMultiple parameter
                const match = onclickAttr.match(/toggleClickableStep\('([^']+)',\s*(\d+)(?:,\s*(true|false))?\)/);
                if (match) {
                    // CRITICAL: Remove inline onclick FIRST to prevent it from executing
                    clickedButton.removeAttribute('onclick');
                    
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    const stepsId = match[1];
                    const stepIndex = parseInt(match[2]);
                    // Default to true (allow multiple) if not specified
                    const allowMultiple = match[3] === undefined ? true : match[3] === 'true';
                    
                    try {
                        window.InteractiveRenderer.toggleClickableStep(stepsId, stepIndex, allowMultiple);
                    } catch (err) {
                        console.error('Error toggling clickable step:', err);
                    }
                    return false;
                }
            }
            
            // Check for tab buttons
            if (isTabButton && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.switchTab) {
                const match = onclickAttr.match(/switchTab\('([^']+)',\s*(\d+)\)/);
                if (match) {
                    // CRITICAL: Remove inline onclick FIRST to prevent it from executing
                    clickedButton.removeAttribute('onclick');
                    
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    const tabsId = match[1];
                    const tabIndex = parseInt(match[2]);
                    
                    try {
                        window.InteractiveRenderer.switchTab(tabsId, tabIndex);
                    } catch (err) {
                        console.error('Error switching tab:', err);
                    }
                    return false;
                }
            }
        };
        
        // Remove all inline onclick handlers from accordion/step/tab buttons immediately
        // This prevents double execution when both inline onclick and delegated handler fire
        // Store the onclick data in data attributes so the delegated handler can still use it
        const removeInlineOnclicks = () => {
            const buttons = document.querySelectorAll('button[onclick*="toggleAccordion"], button[onclick*="toggleClickableStep"], button[onclick*="switchTab"]');
            buttons.forEach(button => {
                const onclick = button.getAttribute('onclick');
                if (onclick && !button.hasAttribute('data-onclick-stored')) {
                    // Store onclick data before removing it
                    button.setAttribute('data-onclick', onclick);
                    button.setAttribute('data-onclick-stored', 'true');
                    button.removeAttribute('onclick');
                }
            });
        };
        
        // Remove onclicks immediately and whenever DOM changes
        removeInlineOnclicks();
        
        // Use MutationObserver to catch dynamically added buttons
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(() => {
                removeInlineOnclicks();
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // Add event listener in capture phase to execute BEFORE any remaining inline onclick handlers
        // This provides an additional safety net
        document.addEventListener('click', handleInteractiveClick, true);
        
        // Verify InteractiveRenderer is available
        let attempts = 0;
        const checkInteractiveRenderer = () => {
            if (typeof window.InteractiveRenderer !== 'undefined') {
                console.log('InteractiveRenderer is available - accordions and tabs should work');
            } else {
                attempts++;
                // Stop na 20 pogingen (2 seconden) om oneindige lussen op pagina's zonder interactieve elementen te voorkomen
                // zoals register.html, index.html, etc.
                if (attempts < 20) {
                    // Alleen loggen bij de eerste paar keer om console spam te voorkomen
                    if (attempts <= 3) {
                        console.warn('InteractiveRenderer not yet available - retrying...');
                    }
                    setTimeout(checkInteractiveRenderer, 100);
                } else {
                    console.log('InteractiveRenderer niet gevonden na timeout - waarschijnlijk niet nodig op deze pagina.');
                }
            }
        };
        
        // Alleen checken als we niet op de register pagina zijn (die heeft geen interactive renderer nodig)
        if (this.moduleId !== 'register') {
            checkInteractiveRenderer();
        }
    }

    /**
     * Setup scroll to top button
     */
    setupScrollToTopButton() {
        const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
        const mainContent = document.getElementById('main-content');

        if (scrollToTopBtn) {
            // Smooth scroll to top on click
            scrollToTopBtn.addEventListener('click', () => {
                // Try scrolling main-content container first
                if (mainContent) {
                    mainContent.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                
                // Also scroll window/document to top (handles case where page itself scrolls)
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Fallback for older browsers
                document.documentElement.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Show/hide button based on scroll position
            const handleScroll = () => {
                // Check both main-content scroll and window scroll, use the maximum
                let mainContentScroll = 0;
                let windowScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
                
                if (mainContent) {
                    mainContentScroll = mainContent.scrollTop || 0;
                }
                
                // Use the maximum scroll position (in case both are scrolling)
                const scrollTop = Math.max(mainContentScroll, windowScroll);
                
                if (scrollTop > 300) {
                    // Show button when scrolled down more than 300px
                    scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                    scrollToTopBtn.classList.add('opacity-100');
                } else {
                    // Hide button when near the top
                    scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                    scrollToTopBtn.classList.remove('opacity-100');
                }
            };

            // Listen to both main-content scroll and window scroll
            if (mainContent) {
                mainContent.addEventListener('scroll', handleScroll, { passive: true });
            }
            window.addEventListener('scroll', handleScroll, { passive: true });
            
            // Check initial scroll position on page load (with small delay to ensure DOM is ready)
            setTimeout(() => {
                handleScroll();
            }, 100);
        }
    }

    /**
     * Setup image modal functionality
     */
    setupImageModal() {
        window.openImageModal = (src, alt) => {
            const modal = document.createElement('div');
            modal.id = 'image-modal';
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 cursor-pointer';
            modal.innerHTML = `
                <div class="relative max-w-7xl max-h-full">
                    <button class="absolute -top-10 right-0 text-white hover:text-gray-300 text-3xl font-bold" onclick="window.closeImageModal()">&times;</button>
                    <img src="${src}" alt="${alt}" class="max-w-full max-h-[90vh] object-contain rounded-lg">
                    <p class="text-white text-center mt-2">${alt}</p>
                </div>
            `;
            modal.onclick = (e) => {
                if (e.target === modal) {
                    window.closeImageModal();
                }
            };
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
        };
        
        window.closeImageModal = () => {
            const modal = document.getElementById('image-modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        };
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.closeImageModal();
            }
        });
    }
    
    /**
     * Setup image click handlers (desktop only)
     * On mobile, images are not clickable - users can use native pinch-to-zoom
     */
    setupImageClickHandlers() {
        // Function to check if device is mobile
        const isMobileDevice = () => {
            // Check viewport width (mobile = < 768px)
            if (window.innerWidth < 768) {
                return true;
            }
            // Check for touch capability (but not all touch devices are mobile)
            // Only consider it mobile if it's a small screen AND touch capable
            if ('ontouchstart' in window && window.innerWidth < 1024) {
                return true;
            }
            return false;
        };
        
        // Setup click handlers for images with modal containers
        const setupImageClicks = () => {
            const imageContainers = document.querySelectorAll('.image-modal-container');
            imageContainers.forEach(container => {
                // Remove any existing listeners by cloning
                const newContainer = container.cloneNode(true);
                container.parentNode.replaceChild(newContainer, container);
                
                // Only add click handler on desktop/tablet (not mobile)
                if (!isMobileDevice()) {
                    newContainer.style.cursor = 'pointer';
                    newContainer.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const src = newContainer.getAttribute('data-image-src');
                        const alt = newContainer.getAttribute('data-image-alt');
                        if (src && window.openImageModal) {
                            window.openImageModal(src, alt);
                        }
                    });
                } else {
                    // On mobile: remove cursor pointer and hover effects
                    newContainer.style.cursor = 'default';
                }
            });
        };
        
        // Setup immediately and on resize (in case user rotates device)
        setupImageClicks();
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setupImageClicks, 250);
        });
        
        // Also setup after content is loaded (for dynamically loaded content)
        setTimeout(setupImageClicks, 500);
    }
    
    /**
     * Setup event delegation for MC question answers and navigation buttons
     * This ensures they work even when HTML is dynamically inserted via innerHTML
     */
    setupMCQuestionAndNavigationHandlers() {
        // Use a global flag to prevent multiple event listeners
        if (window._mcAndNavHandlersSetup) {
            return; // Already setup globally
        }
        window._mcAndNavHandlersSetup = true;
        
        // Handle MC question answer selection (change events)
        document.addEventListener('change', (e) => {
            // Check if this is a radio button for MC questions
            const radio = e.target;
            if (radio.type === 'radio' && radio.name && radio.closest('.mc-question')) {
                // Get vraagId and answerId from data attributes (preferred method)
                const vraagId = radio.getAttribute('data-question-id') || radio.name;
                const answerId = radio.getAttribute('data-answer-id') || radio.value;
                
                if (vraagId && answerId && typeof window.MCQuestionRenderer !== 'undefined' && window.MCQuestionRenderer.handleAnswer) {
                    try {
                        window.MCQuestionRenderer.handleAnswer(vraagId, answerId);
                    } catch (err) {
                        console.error('Error handling MC answer:', err);
                    }
                }
            }
        }, true); // Use capture phase to catch events early
        
        // Handle navigation button clicks (using data-nav-href attribute)
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.nav-button');
            if (target) {
                const href = target.getAttribute('data-nav-href');
                if (href) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = href;
                    return;
                }
            }
            
            // Fallback: Handle navigation buttons with onclick attribute (for backward compatibility)
            const button = e.target.closest('button');
            if (button) {
                const onclickAttr = button.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes('window.location.href')) {
                    // Extract URL from onclick attribute
                    const match = onclickAttr.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
                    if (match) {
                        e.preventDefault();
                        e.stopPropagation();
                        const url = match[1];
                        window.location.href = url;
                    }
                }
            }
        }, false);
        
        // Handle "Volgende vraag" button clicks (using class selector)
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.next-mc-question-btn');
            if (target) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.MCQuestionRenderer !== 'undefined' && window.MCQuestionRenderer.loadNextQuestion) {
                    try {
                        window.MCQuestionRenderer.loadNextQuestion();
                    } catch (err) {
                        console.error('Error loading next question:', err);
                    }
                }
                return;
            }
            
            // Fallback: Handle buttons with onclick attribute (for backward compatibility)
            const button = e.target.closest('button');
            if (button) {
                const onclickAttr = button.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes('MCQuestionRenderer.loadNextQuestion')) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof window.MCQuestionRenderer !== 'undefined' && window.MCQuestionRenderer.loadNextQuestion) {
                        try {
                            window.MCQuestionRenderer.loadNextQuestion();
                        } catch (err) {
                            console.error('Error loading next question:', err);
                        }
                    }
                }
            }
        }, false);
        
        // Handle exercise check buttons (true/false and matching exercises)
        // This ensures buttons work even when content is dynamically rendered (e.g., in accordions)
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            
            const onclickAttr = button.getAttribute('onclick');
            if (!onclickAttr) return;
            
            // Check for true/false exercise check button
            if (onclickAttr.includes('checkTrueFalseExercise')) {
                const match = onclickAttr.match(/checkTrueFalseExercise\(['"]([^'"]+)['"]\)/);
                if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.checkTrueFalseExercise) {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        const exerciseId = match[1];
                        window.InteractiveRenderer.checkTrueFalseExercise(exerciseId);
                    } catch (err) {
                        console.error('Error checking true/false exercise:', err);
                    }
                    return;
                }
            }
            
            // Check for matching exercise check button
            if (onclickAttr.includes('checkMatchingExercise')) {
                const match = onclickAttr.match(/checkMatchingExercise\(['"]([^'"]+)['"]\)/);
                if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.checkMatchingExercise) {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        const exerciseId = match[1];
                        window.InteractiveRenderer.checkMatchingExercise(exerciseId);
                    } catch (err) {
                        console.error('Error checking matching exercise:', err);
                    }
                    return;
                }
            }
            
            // Check for SMART checklist "Bekijk analyse" button
            if (onclickAttr.includes('showSMARTResult')) {
                const match = onclickAttr.match(/showSMARTResult\(['"]([^'"]+)['"]\)/);
                if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.showSMARTResult) {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        const checklistId = match[1];
                        window.InteractiveRenderer.showSMARTResult(checklistId);
                    } catch (err) {
                        console.error('Error showing SMART result:', err);
                    }
                    return;
                }
            }
            
            // Check for Concept Quality checklist "Bekijk analyse" button
            if (onclickAttr.includes('showConceptQualityResult')) {
                const match = onclickAttr.match(/showConceptQualityResult\(['"]([^'"]+)['"]\)/);
                if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.showConceptQualityResult) {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        const checklistId = match[1];
                        window.InteractiveRenderer.showConceptQualityResult(checklistId);
                    } catch (err) {
                        console.error('Error showing concept quality result:', err);
                    }
                    return;
                }
            }
        }, false);
    }
    
    /**
     * Setup event delegation for drag-and-drop in matching exercises
     * This ensures drag-and-drop works even when content is dynamically rendered (e.g., in accordions)
     */
    setupDragAndDropHandlers() {
        // Use a global flag to prevent multiple event listeners
        if (window._dragAndDropHandlersSetup) {
            return; // Already setup globally
        }
        window._dragAndDropHandlersSetup = true;
        
        // Handle dragstart events for matching exercise items
        // Use capture phase to ensure we catch events before inline handlers
        document.addEventListener('dragstart', (e) => {
            const target = e.target;
            // Check if this is a draggable matching item
            if (target.draggable === true && target.classList.contains('matching-item')) {
                const ondragstartAttr = target.getAttribute('ondragstart');
                if (ondragstartAttr && ondragstartAttr.includes('handleDragStart')) {
                    // Extract exerciseId and itemIndex from the ondragstart attribute
                    const match = ondragstartAttr.match(/handleDragStart\(event,\s*['"]([^'"]+)['"],\s*(\d+)\)/);
                    if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.handleDragStart) {
                        // Remove the inline handler to prevent double execution
                        target.removeAttribute('ondragstart');
                        try {
                            const exerciseId = match[1];
                            const itemIndex = parseInt(match[2]);
                            window.InteractiveRenderer.handleDragStart(e, exerciseId, itemIndex);
                        } catch (err) {
                            console.error('Error handling drag start:', err);
                        }
                    }
                }
            }
        }, true); // Use capture phase
        
        // Handle dragover events for drop zones (categories)
        // Use capture phase to ensure we catch events before inline handlers
        document.addEventListener('dragover', (e) => {
            // Find drop zone - could be the target itself or a parent
            const dropZone = e.target.closest('[ondragover]') || e.target.closest('[id$="-category-0"]') || 
                            e.target.closest('[id$="-category-1"]') || e.target.closest('[id$="-category-2"]') ||
                            e.target.closest('[id$="-category-3"]') || e.target.closest('[id$="-category-4"]');
            
            if (dropZone) {
                const ondragoverAttr = dropZone.getAttribute('ondragover');
                if (ondragoverAttr && ondragoverAttr.includes('allowDrop')) {
                    // Extract exerciseId from the parent exercise container
                    const exerciseContainer = dropZone.closest('.matching-exercise');
                    if (exerciseContainer && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.allowDrop) {
                        // Remove the inline handler to prevent double execution (only once)
                        if (!dropZone.hasAttribute('data-dragover-handled')) {
                            dropZone.removeAttribute('ondragover');
                            dropZone.setAttribute('data-dragover-handled', 'true');
                        }
                        try {
                            e.preventDefault(); // Always prevent default to allow drop
                            window.InteractiveRenderer.allowDrop(e);
                        } catch (err) {
                            console.error('Error handling dragover:', err);
                        }
                    }
                } else {
                    // If no ondragover attribute but it's a category container, still allow drop
                    const exerciseContainer = dropZone.closest('.matching-exercise');
                    if (exerciseContainer && dropZone.id && dropZone.id.includes('-category-')) {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                    }
                }
            }
        }, true); // Use capture phase
        
        // Handle drop events for drop zones (categories)
        // Use capture phase to ensure we catch events before inline handlers
        document.addEventListener('drop', (e) => {
            // Find drop zone - could be the target itself or a parent
            // Try multiple strategies to find the drop zone
            let dropZone = e.target.closest('[ondrop]');
            if (!dropZone) {
                // Try finding by ID pattern (category containers)
                dropZone = e.target.closest('[id$="-category-0"]') || 
                          e.target.closest('[id$="-category-1"]') || 
                          e.target.closest('[id$="-category-2"]') ||
                          e.target.closest('[id$="-category-3"]') || 
                          e.target.closest('[id$="-category-4"]');
            }
            
            if (dropZone) {
                const ondropAttr = dropZone.getAttribute('ondrop');
                if (ondropAttr && ondropAttr.includes('handleDrop')) {
                    // Extract exerciseId and categoryIndex from the ondrop attribute
                    const match = ondropAttr.match(/handleDrop\(event,\s*['"]([^'"]+)['"],\s*(\d+)\)/);
                    if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.handleDrop) {
                        // Remove the inline handler to prevent double execution (only once)
                        if (!dropZone.hasAttribute('data-drop-handled')) {
                            dropZone.removeAttribute('ondrop');
                            dropZone.setAttribute('data-drop-handled', 'true');
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                            const exerciseId = match[1];
                            const categoryIndex = parseInt(match[2]);
                            window.InteractiveRenderer.handleDrop(e, exerciseId, categoryIndex);
                        } catch (err) {
                            console.error('Error handling drop:', err);
                        }
                        return false;
                    }
                } else if (dropZone.id && dropZone.id.includes('-category-')) {
                    // Fallback: extract exerciseId and categoryIndex from ID if ondrop attribute was removed
                    const idMatch = dropZone.id.match(/^(.+)-category-(\d+)$/);
                    if (idMatch && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.handleDrop) {
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                            const exerciseId = idMatch[1];
                            const categoryIndex = parseInt(idMatch[2]);
                            window.InteractiveRenderer.handleDrop(e, exerciseId, categoryIndex);
                        } catch (err) {
                            console.error('Error handling drop (fallback):', err);
                        }
                        return false;
                    }
                }
            }
        }, true); // Use capture phase
    }
    
    /**
     * Setup video error detection for blocked or failed video embeds
     * This detects when videos (especially Mediasite) cannot be embedded
     */
    setupVideoErrorDetection() {
        // Use a global flag to prevent multiple event listeners
        if (window._videoErrorDetectionSetup) {
            return;
        }
        window._videoErrorDetectionSetup = true;
        
        // Function to check if a video iframe failed to load
        const checkVideoLoad = (iframe) => {
            const container = iframe.closest('[id$="-container"]');
            if (!container) return;
            
            const fallback = container.querySelector('[id$="-fallback"]');
            if (!fallback) return;
            
            // Check after a delay if the iframe loaded successfully
            setTimeout(() => {
                try {
                    // Try to access iframe content - if blocked, this will throw an error
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (!iframeDoc) {
                        // If we can't access the document, it might be blocked
                        // Check if fallback is still hidden (meaning video might have loaded)
                        // If fallback is visible, don't do anything
                        if (fallback.classList.contains('hidden')) {
                            // Try one more time after a longer delay
                            setTimeout(() => {
                                try {
                                    const checkDoc = iframe.contentDocument || iframe.contentWindow?.document;
                                    if (!checkDoc && fallback.classList.contains('hidden')) {
                                        // Still can't access, likely blocked - show fallback
                                        iframe.classList.add('hidden');
                                        fallback.classList.remove('hidden');
                                    }
                                } catch (e) {
                                    // Cross-origin or blocked - show fallback
                                    iframe.classList.add('hidden');
                                    fallback.classList.remove('hidden');
                                }
                            }, 3000);
                        }
                    }
                } catch (e) {
                    // Cross-origin restriction or blocked - this is expected for some video platforms
                    // Don't show fallback immediately, wait a bit more
                    setTimeout(() => {
                        // Check if iframe has any visible content by checking its dimensions
                        // If iframe is still there but we can't access it, it might be working
                        // Only show fallback if we're certain it failed
                        const rect = iframe.getBoundingClientRect();
                        if (rect.height < 50 && fallback.classList.contains('hidden')) {
                            // Iframe is very small, likely failed
                            iframe.classList.add('hidden');
                            fallback.classList.remove('hidden');
                        }
                    }, 4000);
                }
            }, 2000);
        };
        
        // Use MutationObserver to detect when new video iframes are added to the DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if the added node is a video iframe or contains one
                        const iframes = node.querySelectorAll ? node.querySelectorAll('iframe[data-video-url]') : [];
                        if (node.tagName === 'IFRAME' && node.hasAttribute('data-video-url')) {
                            checkVideoLoad(node);
                        }
                        iframes.forEach(iframe => checkVideoLoad(iframe));
                    }
                });
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also check existing iframes on page load
        setTimeout(() => {
            document.querySelectorAll('iframe[data-video-url]').forEach(iframe => {
                checkVideoLoad(iframe);
            });
        }, 1000);
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseLessonPage;
} else {
    window.BaseLessonPage = BaseLessonPage;
}

