/**
 * Week1LessonPage
 * 
 * Specifieke pagina voor Week 1
 * Basis template voor collega's om content toe te voegen
 */

class Week1LessonPage extends BaseLessonPage {
    constructor() {
        super('week-1', 'Week 1', 'Onderzoeksplan Template');
        // content and contentLoaded are now initialized in BaseLessonPage
    }

    // loadContent(), getFallbackContent(), and renderErrorState() are now in BaseLessonPage

    /**
     * Render module introductie met content uit JSON
     */
    renderModuleIntro() {
        if (!this.content) {
            return this.renderErrorState();
        }

        return `
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift sticky top-[56px] sm:top-[64px] z-30 mb-6 sm:mb-8 transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-book text-blue-600 dark:text-blue-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${this.content.intro.title}: ${this.content.intro.subtitle}</h1>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">${this.content.intro.description}</p>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render content secties met content uit JSON
     */
    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }

        // Render theorie content
        let theorieHtml = '';
        const theorie = this.content.theorie;
        
        if (theorie && theorie.content && Array.isArray(theorie.content)) {
            theorieHtml = ContentRenderer.renderContentItems(theorie.content);
        }

        // Check of theorie bestaat en een title heeft
        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Theorie';

        return `
            <!-- Theorie Sectie -->
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-file-alt text-purple-600 dark:text-purple-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">${theorieTitle}</h2>
                        <div class="prose max-w-none">
                            ${theorieHtml}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    

    // renderErrorState() is now in BaseLessonPage

    /**
     * Lifecycle hook: Called after content is loaded
     * Validates content and checks for required sections
     * @returns {Promise<boolean>} Return false to stop initialization
     */
    async afterContentLoaded() {
        // Check of content correct is geladen
        if (!this.content || !this.contentLoaded) {
            console.error('[Week1LessonPage] ❌ Content not loaded properly');
            return false; // Stop initialization
        }
        
        // Check of theorie sectie bestaat
        if (!this.content.theorie) {
            console.warn('[Week1LessonPage] ⚠️ Theorie section missing in content');
        }
        
        return true; // Continue initialization
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Week1LessonPage;
    } else {
        window.Week1LessonPage = Week1LessonPage;
    }
    console.log('[Week1LessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[Week1LessonPage] ❌ Error exporting:', error);
    try {
        window.Week1LessonPage = Week1LessonPage;
    } catch (e) {
        console.error('[Week1LessonPage] ❌ Failed to force export:', e);
    }
}
