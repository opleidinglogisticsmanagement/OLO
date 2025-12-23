/**
 * DemoLessonPage
 * 
 * Demo pagina om te laten zien wat er mogelijk is in de e-learning
 * en om collega's uit te leggen hoe zij te werk moeten gaan
 */

class DemoLessonPage extends BaseLessonPage {
    constructor() {
        super('demo', 'Demo', 'E-Learning Demo en Handleiding');
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
            theorieHtml = ContentRenderer.renderContentItems(theorie.content);
        }

        // Check of theorie bestaat en een title heeft
        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Demo en Handleiding';

        // Use ContentTemplateRenderer for consistent section styling
        return this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'graduation-cap',
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
            console.error('[DemoLessonPage] ❌ Content not loaded properly');
            return false; // Stop initialization
        }
        
        // Check of theorie sectie bestaat
        if (!this.content.theorie) {
            console.warn('[DemoLessonPage] ⚠️ Theorie section missing in content');
        }
        
        return true; // Continue initialization
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DemoLessonPage;
    } else {
        window.DemoLessonPage = DemoLessonPage;
    }
    console.log('[DemoLessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[DemoLessonPage] ❌ Error exporting:', error);
    try {
        window.DemoLessonPage = DemoLessonPage;
    } catch (e) {
        console.error('[DemoLessonPage] ❌ Failed to force export:', e);
    }
}

