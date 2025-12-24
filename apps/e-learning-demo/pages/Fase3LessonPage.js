/**
 * Fase3LessonPage
 * 
 * De Catalogus
 * Meta-e-learning voor collega-docenten om alle beschikbare bouwstenen te leren kennen
 */

class Fase3LessonPage extends BaseLessonPage {
    constructor() {
        super('fase3', 'De Catalogus', 'Alle beschikbare bouwstenen');
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
        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'De Catalogus van Bouwstenen';

        // Use ContentTemplateRenderer for consistent section styling
        return this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'book',
            'green'
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
            console.error('[Fase3LessonPage] ❌ Content not loaded properly');
            return false; // Stop initialization
        }
        
        // Check of theorie sectie bestaat
        if (!this.content.theorie) {
            console.warn('[Fase3LessonPage] ⚠️ Theorie section missing in content');
        }
        
        return true; // Continue initialization
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Fase3LessonPage;
    } else {
        window.Fase3LessonPage = Fase3LessonPage;
    }
    console.log('[Fase3LessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[Fase3LessonPage] ❌ Error exporting:', error);
    try {
        window.Fase3LessonPage = Fase3LessonPage;
    } catch (e) {
        console.error('[Fase3LessonPage] ❌ Failed to force export:', e);
    }
}

