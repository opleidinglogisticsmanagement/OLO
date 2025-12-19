/**
 * TabRenderer
 * 
 * Utility voor het renderen van tabs componenten
 * Ondersteunt: tabs met kleurcodering (groen, blauw, oranje) en responsive design
 */

class TabRenderer {
    /**
     * Render een tabs component
     * @param {Object} item - Tabs item met tabs array
     * @returns {string} HTML string
     */
    static renderTabs(item) {
        if (!item.tabs || !Array.isArray(item.tabs) || item.tabs.length === 0) {
            console.warn('Tabs item missing tabs array:', item);
            return '';
        }

        const tabsId = `tabs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const defaultTab = item.defaultTab || 0;
        
        // Bepaal kleur per tab op basis van index
        const getTabColor = (index) => {
            if (index === 0) {
                // Tab 1: Groen
                return {
                    active: 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400',
                    inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                };
            } else if (index === 1) {
                // Tab 2: Blauw
                return {
                    active: 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400',
                    inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                };
            } else {
                // Tab 3: Oranje
                return {
                    active: 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400',
                    inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                };
            }
        };
        
        const tabsButtons = item.tabs.map((tab, index) => {
            const tabId = `${tabsId}-tab-${index}`;
            const contentId = `${tabsId}-content-${index}`;
            const isActive = index === defaultTab;
            const colors = getTabColor(index);
            
            return `
                <button
                    class="tabs-button flex-1 px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-sm md:text-base transition-colors duration-200 ${isActive ? colors.active : colors.inactive} text-center cursor-pointer touch-manipulation active:bg-gray-200 dark:active:bg-gray-600 whitespace-normal break-words min-w-0"
                    onclick="InteractiveRenderer.switchTab('${tabsId}', ${index})"
                    aria-selected="${isActive}"
                    aria-controls="${contentId}"
                    id="${tabId}"
                    role="tab"
                    data-tab-index="${index}"
                    style="word-break: break-word; overflow-wrap: break-word;"
                >
                    ${tab.title}
                </button>
            `;
        }).join('');

        const tabsContent = item.tabs.map((tab, index) => {
            const contentId = `${tabsId}-content-${index}`;
            const isActive = index === defaultTab;
            
            // Render content - can be string or array
            let contentHtml = '';
            if (Array.isArray(tab.content)) {
                contentHtml = tab.content.map(text => {
                    if (typeof text === 'string' && text.trim().startsWith('<')) {
                        return text; // Already HTML
                    }
                    return `<p class="text-gray-700 dark:text-gray-300 mb-3">${text}</p>`;
                }).join('');
            } else if (typeof tab.content === 'string') {
                contentHtml = `<p class="text-gray-700 dark:text-gray-300 mb-3">${tab.content}</p>`;
            }

            return `
                <div
                    id="${contentId}"
                    class="tab-content ${isActive ? '' : 'hidden'}"
                    role="tabpanel"
                    aria-labelledby="${tabsId}-tab-${index}"
                >
                    <div class="px-6 py-4">
                        ${contentHtml}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="tabs-container mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-200" id="${tabsId}">
                <div class="flex flex-nowrap overflow-hidden -mb-px" role="tablist">
                    ${tabsButtons}
                </div>
                <div class="tab-content-container bg-white dark:bg-gray-800 transition-colors duration-200">
                    ${tabsContent}
                </div>
            </div>
            <style>
                /* Zorg dat tabs altijd binnen de breedte passen */
                .tabs-container {
                    width: 100%;
                    max-width: 100%;
                    overflow: hidden;
                }
                
                .tabs-container [role="tablist"] {
                    display: flex;
                    width: 100%;
                    max-width: 100%;
                    overflow: hidden;
                }
                
                .tabs-container .tabs-button {
                    flex: 1 1 0;
                    min-width: 0;
                    max-width: 100%;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    hyphens: auto;
                }
                
                /* Mobile responsive tabs */
                @media (max-width: 640px) {
                    .tabs-container .tabs-button {
                        padding: 0.5rem 0.375rem;
                        font-size: 0.75rem;
                        line-height: 1.3;
                    }
                }
                
                /* Tablet optimalisatie */
                @media (min-width: 641px) and (max-width: 1023px) {
                    .tabs-container .tabs-button {
                        padding: 0.75rem 0.5rem;
                        font-size: 0.875rem;
                    }
                }
                
                /* Desktop - kleinere padding en font voor lange teksten */
                @media (min-width: 1024px) {
                    .tabs-container .tabs-button {
                        padding: 0.875rem 0.75rem;
                        font-size: 0.9375rem;
                    }
                }
            </style>
        `;
    }

    /**
     * Switch between tabs
     * @param {string} tabsId - ID of the tabs container
     * @param {number} tabIndex - Index of the tab to switch to
     */
    static switchTab(tabsId, tabIndex) {
        const tabsContainer = document.getElementById(tabsId);
        if (!tabsContainer) {
            console.warn('Tabs container not found:', tabsId);
            return;
        }

        const tabs = tabsContainer.querySelectorAll('[role="tab"]');
        const contents = tabsContainer.querySelectorAll('[role="tabpanel"]');
        
        if (tabs.length === 0 || contents.length === 0) {
            console.warn('Tabs or content panels not found:', { tabsId, tabsCount: tabs.length, contentsCount: contents.length });
            return;
        }

        // Helper functie om kleuren per tab te bepalen
        const getTabColorClasses = (index) => {
            if (index === 0) {
                // Tab 1: Groen
                return {
                    active: ['bg-white', 'dark:bg-gray-800', 'text-green-600', 'dark:text-green-400'],
                    inactive: ['bg-gray-100', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-600']
                };
            } else if (index === 1) {
                // Tab 2: Blauw
                return {
                    active: ['bg-white', 'dark:bg-gray-800', 'text-blue-600', 'dark:text-blue-400'],
                    inactive: ['bg-gray-100', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-600']
                };
            } else {
                // Tab 3: Oranje
                return {
                    active: ['bg-white', 'dark:bg-gray-800', 'text-orange-600', 'dark:text-orange-400'],
                    inactive: ['bg-gray-100', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-600']
                };
            }
        };
        
        // Update all tabs
        tabs.forEach((tab, index) => {
            const isActive = index === tabIndex;
            tab.setAttribute('aria-selected', isActive);
            const colors = getTabColorClasses(index);
            
            // Verwijder alle mogelijke kleur classes
            tab.classList.remove(
                'bg-white', 'dark:bg-gray-800', 
                'text-green-600', 'dark:text-green-400',
                'text-blue-600', 'dark:text-blue-400',
                'text-orange-600', 'dark:text-orange-400',
                'bg-gray-100', 'dark:bg-gray-700', 
                'text-gray-600', 'dark:text-gray-300', 
                'hover:bg-gray-200', 'dark:hover:bg-gray-600'
            );
            
            if (isActive) {
                tab.classList.add(...colors.active);
            } else {
                tab.classList.add(...colors.inactive);
            }
        });

        // Update all content panels
        contents.forEach((content, index) => {
            if (index === tabIndex) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabRenderer;
} else {
    window.TabRenderer = TabRenderer;
}

