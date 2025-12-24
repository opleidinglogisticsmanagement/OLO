/**
 * GenAILessonPage
 * 
 * GenAI in de e-learning
 * Meta-e-learning voor collega-docenten om te leren hoe ze GenAI kunnen inzetten
 */

class GenAILessonPage extends BaseLessonPage {
    constructor() {
        super('genai', 'GenAI in de e-learning', 'Krachtige AI-mogelijkheden voor interactief onderwijs');
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
        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'GenAI mogelijkheden en setup';

        // Use ContentTemplateRenderer for consistent section styling
        return this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'robot',
            'orange'
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
            console.error('[GenAILessonPage] ❌ Content not loaded properly');
            return false; // Stop initialization
        }
        
        // Check of theorie sectie bestaat
        if (!this.content.theorie) {
            console.warn('[GenAILessonPage] ⚠️ Theorie section missing in content');
        }
        
        return true; // Continue initialization
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GenAILessonPage;
    } else {
        window.GenAILessonPage = GenAILessonPage;
    }
    console.log('[GenAILessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[GenAILessonPage] ❌ Error exporting:', error);
    try {
        window.GenAILessonPage = GenAILessonPage;
    } catch (e) {
        console.error('[GenAILessonPage] ❌ Failed to force export:', e);
    }
}

