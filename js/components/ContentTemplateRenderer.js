/**
 * ContentTemplateRenderer
 * 
 * Verantwoordelijk voor het renderen van default content templates
 * Gebruikt door BaseLessonPage als fallback template voor nieuwe pagina's
 */

class ContentTemplateRenderer {
    /**
     * Render default module introductie template
     * @param {string} moduleTitle - Module title
     * @param {string} moduleSubtitle - Module subtitle
     * @returns {string} HTML string
     */
    renderModuleIntro(moduleTitle, moduleSubtitle) {
        return `
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <!-- Icon above title on mobile, beside on desktop -->
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-book text-blue-600 dark:text-blue-400 text-base sm:text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">${moduleTitle}: ${moduleSubtitle}</h1>
                        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                            Welkom bij ${moduleTitle}! Deze module behandelt ${moduleSubtitle.toLowerCase()}.
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
     * Render default content secties template
     * @param {string} moduleTitle - Module title
     * @param {string} moduleSubtitle - Module subtitle
     * @returns {string} HTML string
     */
    renderContentSections(moduleTitle, moduleSubtitle) {
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
                                    <strong>Voor collega's:</strong> Voeg hier de specifieke leerdoelen toe voor ${moduleTitle}.
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
                                    <strong>Voor collega's:</strong> Voeg hier de theorie content toe voor ${moduleSubtitle}.
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
                            <strong>Voor collega's:</strong> Voeg hier video content toe voor ${moduleSubtitle}.
                        </p>
                    </div>
                </div>
            </section>
        `;
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentTemplateRenderer;
} else {
    window.ContentTemplateRenderer = ContentTemplateRenderer;
}
