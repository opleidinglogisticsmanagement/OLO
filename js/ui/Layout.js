/**
 * Layout Component
 * 
 * Verantwoordelijk voor het renderen van de Sidebar en Header
 * Geëxtraheerd uit BaseLessonPage.js om de "God Class" op te splitsen
 */

class Layout {
    /**
     * Render sidebar met navigatie
     */
    renderSidebar(modules, currentModuleId) {
        return `
            <aside id="sidebar" class="w-full sm:w-80 bg-white dark:bg-gray-800 shadow-lg transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 z-40" aria-label="Navigatie menu">
                <div class="h-full flex flex-col">
                    ${this.renderSidebarHeader()}
                    ${this.renderModuleNavigation(modules, currentModuleId)}
                </div>
            </aside>
        `;
    }

    /**
     * Render sidebar header
     */
    renderSidebarHeader() {
        return `
            <div class="h-16 px-6 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center space-x-3 flex-1 min-w-0">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                            <i class="fas fa-graduation-cap text-white text-lg"></i>
                        </div>
                        <div class="min-w-0 flex-1">
                            <h1 class="text-sm font-bold text-gray-900 dark:text-white leading-tight">Opzetten van Logistieke<br>Onderzoeken (OLO)</h1>
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
    renderModuleNavigation(modules, currentModuleId) {
        const moduleItems = modules.map(module => {
            const isCurrent = module.id === currentModuleId;
            const hasSubItems = module.subItems && module.subItems.length > 0;
            
            // Generic handling for modules with sub-items
            if (hasSubItems) {
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
                
                const navItemClass = `${module.id}-nav-item`;
                const chevronId = `${module.id}-chevron`;
                const subItemsId = `${module.id}-subitems`;
                
                return `
                    <div class="${navItemClass}">
                        <a href="${module.href}" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors ${isCurrent ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}">
                            <div class="w-8 h-8 ${isCurrent ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'} rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-book text-sm ${isCurrent ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}"></i>
                            </div>
                            <span class="font-medium flex-1">${module.title}</span>
                            <div class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10 flex-shrink-0" id="${chevronId}-container">
                                <i class="fas fa-chevron-down text-xs text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isCurrent ? 'rotate-180' : ''}" id="${chevronId}"></i>
                            </div>
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
                    <div class="w-8 h-8 ${isCurrent ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'} rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-book text-sm ${isCurrent ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}"></i>
                    </div>
                    <span class="font-medium">${module.title}</span>
                </a>
            `;
        }).join('');

        return `
            <nav class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6" aria-label="Module navigatie" style="scrollbar-gutter: stable;">
                <div class="space-y-2">
                    <div class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">E-Learning</div>
                    ${moduleItems}
                </div>
            </nav>
        `;
    }

    /**
     * Render header met breadcrumbs
     */
    renderHeader(title) {
        return `
            <header class="h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 flex items-center sticky top-0 z-30 transition-colors duration-200 relative">
                <div class="flex items-center justify-between w-full relative z-10 bg-white dark:bg-gray-800 transition-colors duration-200">
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
                            <span class="text-gray-900 dark:text-white font-medium">${title}</span>
                        </nav>
                        
                        <!-- Mobile title - only visible on mobile -->
                        <h1 class="lg:hidden text-base font-semibold text-gray-900 dark:text-white truncate flex-1">${title}</h1>
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

// Export globally
window.Layout = Layout;

