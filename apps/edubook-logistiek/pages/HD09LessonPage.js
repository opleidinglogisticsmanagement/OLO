/**
 * HD09LessonPage
 * 
 * Specifieke pagina voor HD 09 - Supply Chain Management
 * Basis template voor content toe te voegen
 */

class HD09LessonPage extends BaseLessonPage {
    constructor() {
        super('hd09', 'HD 09 - Supply Chain Management', 'Slim samenwerken: de kunst van supply chain management');
        // content and contentLoaded are now initialized in BaseLessonPage
    }

    // loadContent(), getFallbackContent(), and renderErrorState() are now in BaseLessonPage

    // renderModuleIntro() is now handled by BaseLessonPage using ContentTemplateRenderer

    /**
     * Render content secties met content uit JSON
     * Uses ContentTemplateRenderer for consistent styling
     */
    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }

        // Render theorie content
        let theorieHtml = '';
        const theorie = this.content.theorie;
        
        if (theorie && theorie.content && Array.isArray(theorie.content)) {
            theorieHtml = ContentRenderer.renderContentItems(theorie.content, { enableModal: true });
        }

        // Check of theorie bestaat en een title heeft
        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Theorie';

        // Use ContentTemplateRenderer for consistent section styling
        return this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'book',
            'purple'
        );
    }

    /**
     * Override renderContent om navigation buttons te verbergen
     * @returns {string} HTML string zonder navigation buttons
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
            </div>
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
            console.error('[HD09LessonPage] ❌ Content not loaded properly');
            return false; // Stop initialization
        }
        
        // Check of theorie sectie bestaat
        if (!this.content.theorie) {
            console.warn('[HD09LessonPage] ⚠️ Theorie section missing in content');
        }
        
        return true; // Continue initialization
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = HD09LessonPage;
    } else {
        window.HD09LessonPage = HD09LessonPage;
    }
    console.log('[HD09LessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[HD09LessonPage] ❌ Error exporting:', error);
    try {
        window.HD09LessonPage = HD09LessonPage;
    } catch (e) {
        console.error('[HD09LessonPage] ❌ Failed to force export:', e);
    }
}

