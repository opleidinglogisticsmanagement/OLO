/**
 * PublicerenLessonPage
 * 
 * E-learning publiceren
 * Meta-e-learning voor collega-docenten om te leren hoe ze hun wijzigingen publiceren
 */

class PublicerenLessonPage extends BaseLessonPage {
    constructor() {
        super('publiceren', 'E-learning publiceren', 'Van wijziging naar live in een paar stappen');
        // content and contentLoaded are now initialized in BaseLessonPage
    }

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
        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Publiceren in de praktijk';

        // Use ContentTemplateRenderer for consistent section styling
        return this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'rocket',
            'teal'
        );
    }

    /**
     * Lifecycle hook: Called after content is loaded
     * Validates content and checks for required sections
     * @returns {Promise<boolean>} Return false to stop initialization
     */
    async afterContentLoaded() {
        // Check of content correct is geladen
        if (!this.content || !this.contentLoaded) {
            console.error('[PublicerenLessonPage] ❌ Content not loaded properly');
            return false; // Stop initialization
        }
        
        // Check of theorie sectie bestaat
        if (!this.content.theorie) {
            console.warn('[PublicerenLessonPage] ⚠️ Theorie section missing in content');
        }
        
        return true; // Continue initialization
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PublicerenLessonPage;
    } else {
        window.PublicerenLessonPage = PublicerenLessonPage;
    }
    console.log('[PublicerenLessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[PublicerenLessonPage] ❌ Error exporting:', error);
    try {
        window.PublicerenLessonPage = PublicerenLessonPage;
    } catch (e) {
        console.error('[PublicerenLessonPage] ❌ Failed to force export:', e);
    }
}

