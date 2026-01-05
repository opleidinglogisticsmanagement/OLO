/**
 * Week1LessonPage
 * 
 * Specifieke pagina voor Week 1
 * Basis template voor content toe te voegen
 */

class Week1LessonPage extends BaseLessonPage {
    constructor() {
        super('week-1', 'Week 1', 'Welkom bij Edubook-Logistiek');
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

