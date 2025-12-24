/**
 * FormulesKaTeXLessonPage
 * 
 * Formules met KaTeX
 * Meta-e-learning voor collega-docenten om te leren hoe ze wiskundige formules toevoegen
 */

class FormulesKaTeXLessonPage extends BaseLessonPage {
    constructor() {
        super('formules-katex', 'Formules met KaTeX', 'Wiskundige formules in je e-learning');
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
        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'KaTeX Formules';

        // Use ContentTemplateRenderer for consistent section styling
        return this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'calculator',
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
            console.error('[FormulesKaTeXLessonPage] ❌ Content not loaded properly');
            return false; // Stop initialization
        }
        
        // Check of theorie sectie bestaat
        if (!this.content.theorie) {
            console.warn('[FormulesKaTeXLessonPage] ⚠️ Theorie section missing in content');
        }
        
        return true; // Continue initialization
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = FormulesKaTeXLessonPage;
    } else {
        window.FormulesKaTeXLessonPage = FormulesKaTeXLessonPage;
    }
    console.log('[FormulesKaTeXLessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[FormulesKaTeXLessonPage] ❌ Error exporting:', error);
    try {
        window.FormulesKaTeXLessonPage = FormulesKaTeXLessonPage;
    } catch (e) {
        console.error('[FormulesKaTeXLessonPage] ❌ Failed to force export:', e);
    }
}

