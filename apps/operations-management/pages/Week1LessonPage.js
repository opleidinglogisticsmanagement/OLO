/**
 * Week1LessonPage
 * 
 * Specifieke pagina voor Week 1 - Operations Management
 * Basis template voor collega's om content toe te voegen
 */

class Week1LessonPage extends BaseLessonPage {
    constructor() {
        super('week-1', 'Week 1', 'Operations Management - Week 1');
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

        let sections = '';

        // Render leerdoelen sectie (if available)
        if (this.content.leerdoelen) {
            let leerdoelenContent = '';
            if (this.content.leerdoelen.interactive && this.content.leerdoelen.items && this.content.leerdoelen.items.length > 0) {
                // Use interactive checklist
                leerdoelenContent = ContentRenderer.renderLearningObjectivesChecklist({
                    title: this.content.leerdoelen.title,
                    description: this.content.leerdoelen.description,
                    items: this.content.leerdoelen.items,
                    storageKey: 'week1-learning-objectives'
                });
            } else {
                // Use standard list
                leerdoelenContent = `
                    ${this.content.leerdoelen.description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${this.content.leerdoelen.description}</p>` : ''}
                    ${this.content.leerdoelen.items && this.content.leerdoelen.items.length > 0 ? `
                        <ul class="space-y-2">
                            ${this.content.leerdoelen.items.map(item => `
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-check text-green-500 dark:text-green-400 mt-1"></i>
                                    <span class="text-gray-700 dark:text-gray-300">${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    ` : ''}
                `;
            }

            sections += this.contentTemplateRenderer.renderSection(
                this.content.leerdoelen.title || 'Leerdoelen',
                leerdoelenContent,
                'target',
                'green'
            );
        }

        // Render theorie content
        let theorieHtml = '';
        const theorie = this.content.theorie;
        
        if (theorie && theorie.content && Array.isArray(theorie.content)) {
            theorieHtml = ContentRenderer.renderContentItems(theorie.content);
        }

        // Check of theorie bestaat en een title heeft
        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Theorie';

        // Use ContentTemplateRenderer for consistent section styling
        sections += this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'book',
            'blue'
        );

        return sections;
    }

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

