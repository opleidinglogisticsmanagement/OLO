/**
 * ContentTemplateRenderer
 * 
 * Verantwoordelijk voor het renderen van default content templates
 * Gebruikt door BaseLessonPage als fallback template voor nieuwe pagina's
 */

class ContentTemplateRenderer {
    /**
     * Get standard section wrapper classes
     * Centralized styling for all content sections to ensure visual consistency
     * @param {Object} options - Options object
     * @param {boolean} options.isSticky - Whether section should be sticky (default: false)
     * @param {boolean} options.hasExtraPadding - Whether to add sm:pr-[70px] for scroll-to-top button space (default: true)
     * @param {string} options.marginTop - Top margin class (e.g., 'mt-8') (default: '')
     * @returns {string} Tailwind classes
     */
    getSectionWrapperClasses(options = {}) {
        const {
            isSticky = false,
            hasExtraPadding = true,
            marginTop = ''
        } = options;
        
        const base = 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover-lift transition-colors duration-200 w-full max-w-full overflow-hidden box-border min-w-0 mb-6 sm:mb-8';
        const sticky = isSticky ? ' sticky top-[56px] sm:top-[64px] z-30' : '';
        // Note: hasExtraPadding is now handled in renderSection for the content div
        const margin = marginTop ? ` ${marginTop}` : '';
        
        return `${base}${sticky}${margin}`;
    }

    /**
     * Get standard icon container classes
     * Centralized styling for section icons to ensure visual consistency
     * @param {string} colorScheme - Color scheme (blue, green, purple, indigo, red) (default: 'blue')
     * @returns {string} Tailwind classes
     */
    getIconContainerClasses(colorScheme = 'blue') {
        const colorMap = {
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
            green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
            red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        };
        
        const colors = colorMap[colorScheme] || colorMap.blue;
        return `w-10 h-10 sm:w-12 sm:h-12 ${colors} rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4`;
    }

    /**
     * Render a standard content section with consistent styling
     * @param {string} title - Section title
     * @param {string} content - Section content HTML
     * @param {string} icon - Icon name (book, bullseye, file-alt, question-circle, play) (default: 'book')
     * @param {string} colorScheme - Color scheme for icon (default: 'purple')
     * @param {Object} options - Additional options (marginTop, isSticky, etc.)
     * @returns {string} HTML string
     */
    renderSection(title, content, icon = 'book', colorScheme = 'purple', options = {}) {
        const classes = this.getSectionWrapperClasses({
            isSticky: options.isSticky || false,
            hasExtraPadding: options.hasExtraPadding !== false,
            marginTop: options.marginTop || ''
        });
        
        const iconMap = {
            book: 'fa-book',
            bullseye: 'fa-bullseye',
            'file-alt': 'fa-file-alt',
            'question-circle': 'fa-question-circle',
            play: 'fa-play'
        };
        
        const iconClass = iconMap[icon] || iconMap.book;
        const headingSize = options.headingSize || 'text-2xl';
        
        // Note: Extra padding (sm:pr-[70px]) removed to prevent overflow
        // The scroll-to-top button should be positioned absolutely and not require content padding
        
        return `
            <section class="${classes}" style="width: 100%; max-width: 100%; box-sizing: border-box;">
                <div class="flex flex-col sm:flex-row items-start box-border" style="width: 100%; max-width: 100%; box-sizing: border-box;">
                    <div class="${this.getIconContainerClasses(colorScheme)} flex-shrink-0">
                        <i class="fas ${iconClass} text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 box-border" style="width: 0; max-width: 100%; box-sizing: border-box;">
                        <h2 class="${headingSize} font-bold text-gray-900 dark:text-white mb-4">${title}</h2>
                        <div class="prose prose-sm sm:prose-base box-border overflow-hidden" style="max-width: 100%; box-sizing: border-box; word-wrap: break-word; overflow-wrap: break-word;">
                            <style>
                                .prose * {
                                    max-width: 100% !important;
                                    box-sizing: border-box !important;
                                }
                                .prose table {
                                    width: 100% !important;
                                    max-width: 100% !important;
                                    display: block !important;
                                    overflow-x: auto !important;
                                }
                                .prose img {
                                    max-width: 100% !important;
                                    height: auto !important;
                                }
                                .prose pre {
                                    max-width: 100% !important;
                                    overflow-x: auto !important;
                                }
                                .prose code {
                                    word-wrap: break-word !important;
                                    overflow-wrap: break-word !important;
                                }
                            </style>
                            ${content}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render module introductie with consistent styling
     * Supports both default template and content-based rendering
     * @param {string} moduleTitle - Module title
     * @param {string} moduleSubtitle - Module subtitle
     * @param {Object} content - Optional content object with intro data
     * @returns {string} HTML string
     */
    renderModuleIntro(moduleTitle, moduleSubtitle, content = null) {
        const classes = this.getSectionWrapperClasses({ 
            isSticky: true, 
            hasExtraPadding: true 
        });
        
        // Als content object wordt meegegeven, gebruik die data
        const title = content?.intro?.title || moduleTitle;
        const subtitle = content?.intro?.subtitle || moduleSubtitle;
        const description = content?.intro?.description || `Welkom bij ${moduleTitle}! Deze module behandelt ${moduleSubtitle.toLowerCase()}.`;
        
        // Chrome fix: Wrap sticky section in a div to ensure margin-bottom works
        // Chrome sometimes ignores margin-bottom on sticky elements, so we use a wrapper div
        // Use inline style with !important to override any conflicting styles
        return `
            <div class="intro-section-wrapper" style="margin-bottom: 1.5rem !important; margin-top: 0 !important; box-sizing: border-box;">
                <section class="${classes}" style="margin-bottom: 0 !important; box-sizing: border-box;">
                    <div class="flex flex-col sm:flex-row items-start">
                        <div class="${this.getIconContainerClasses('blue')}">
                            <i class="fas fa-book text-lg"></i>
                        </div>
                        <div class="flex-1 min-w-0 w-full sm:w-auto">
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${title}: ${subtitle}</h1>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">${description}</p>
                        </div>
                    </div>
                </section>
            </div>
            <style>
                @media (min-width: 640px) {
                    #main-content article .intro-section-wrapper {
                        margin-bottom: 2rem !important;
                    }
                }
            </style>
        `;
    }

    /**
     * Render default content secties template
     * Uses new helper methods for consistent styling
     * @param {string} moduleTitle - Module title
     * @param {string} moduleSubtitle - Module subtitle
     * @returns {string} HTML string
     */
    renderContentSections(moduleTitle, moduleSubtitle) {
        const leerdoelenContent = `
            <p class="text-gray-600 dark:text-gray-300 mb-4">Na het voltooien van deze module kun je:</p>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                    <i class="fas fa-edit mr-2"></i>
                    <strong>Voor collega's:</strong> Voeg hier de specifieke leerdoelen toe voor ${moduleTitle}.
                </p>
            </div>
        `;
        
        const theorieContent = `
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Theorie Content</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                    <i class="fas fa-edit mr-2"></i>
                    <strong>Voor collega's:</strong> Voeg hier de theorie content toe voor ${moduleSubtitle}.
                </p>
            </div>
        `;
        
        const videoContent = `
            <div class="bg-black dark:bg-black rounded-lg aspect-video flex items-center justify-center mb-4 w-full">
                <div class="text-center text-white">
                    <i class="fas fa-play-circle text-6xl mb-4 opacity-75"></i>
                    <p class="text-lg font-medium">Video Player</p>
                    <p class="text-sm opacity-75">Video content komt hier</p>
                </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300">
                <i class="fas fa-edit mr-2"></i>
                <strong>Voor collega's:</strong> Voeg hier video content toe voor ${moduleSubtitle}.
            </p>
        `;
        
        return `
            ${this.renderSection('Leerdoelen', leerdoelenContent, 'bullseye', 'green', { headingSize: 'text-lg sm:text-xl' })}
            ${this.renderSection('Theorie', theorieContent, 'book', 'purple', { headingSize: 'text-lg sm:text-xl' })}
            ${this.renderSection('Video', videoContent, 'play', 'red', { headingSize: 'text-lg sm:text-xl' })}
        `;
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentTemplateRenderer;
} else {
    window.ContentTemplateRenderer = ContentTemplateRenderer;
}

