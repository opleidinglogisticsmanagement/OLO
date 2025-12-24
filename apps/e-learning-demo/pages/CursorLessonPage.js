/**
 * CursorLessonPage
 * 
 * Fase 2: Cursor
 * Meta-e-learning voor collega-docenten om te leren hoe ze Cursor effectief inzetten als AI-copiloot
 */

class CursorLessonPage extends BaseLessonPage {
    constructor() {
        super('cursor', 'Fase 2: Cursor', 'Je persoonlijke AI-copiloot');
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
        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Cursor als Bouwpartner';

        // Use ContentTemplateRenderer for consistent section styling
        return this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'laptop-code',
            'blue'
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
            console.error('[CursorLessonPage] ❌ Content not loaded properly');
            return false; // Stop initialization
        }
        
        // Check of theorie sectie bestaat
        if (!this.content.theorie) {
            console.warn('[CursorLessonPage] ⚠️ Theorie section missing in content');
        }
        
        return true; // Continue initialization
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CursorLessonPage;
    } else {
        window.CursorLessonPage = CursorLessonPage;
    }
    console.log('[CursorLessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[CursorLessonPage] ❌ Error exporting:', error);
    try {
        window.CursorLessonPage = CursorLessonPage;
    } catch (e) {
        console.error('[CursorLessonPage] ❌ Failed to force export:', e);
    }
}

