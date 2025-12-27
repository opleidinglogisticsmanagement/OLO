/**
 * VraagvoorspellingDeel2LessonPage
 * 
 * Specifieke pagina voor Vraagvoorspelling (deel 2)
 */

class VraagvoorspellingDeel2LessonPage extends BaseLessonPage {
    constructor() {
        super('vraagvoorspelling-deel2', 'Vraagvoorspelling (deel 2)', 'Vraagvoorspelling (deel 2)');
    }

    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }

        let sections = '';

        if (this.content.leerdoelen) {
            let leerdoelenContent = '';
            if (this.content.leerdoelen.interactive && this.content.leerdoelen.items && this.content.leerdoelen.items.length > 0) {
                leerdoelenContent = ContentRenderer.renderLearningObjectivesChecklist({
                    title: this.content.leerdoelen.title,
                    description: this.content.leerdoelen.description,
                    items: this.content.leerdoelen.items,
                    storageKey: 'vraagvoorspelling-deel2-learning-objectives'
                });
            } else {
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

        let theorieHtml = '';
        const theorie = this.content.theorie;
        
        if (theorie && theorie.content && Array.isArray(theorie.content)) {
            theorieHtml = ContentRenderer.renderContentItems(theorie.content);
        }

        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Theorie';

        sections += this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'book',
            'blue'
        );

        return sections;
    }

    async afterContentLoaded() {
        if (!this.content || !this.contentLoaded) {
            console.error('[VraagvoorspellingDeel2LessonPage] ❌ Content not loaded properly');
            return false;
        }
        
        if (!this.content.theorie) {
            console.warn('[VraagvoorspellingDeel2LessonPage] ⚠️ Theorie section missing in content');
        }
        
        return true;
    }
}

try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = VraagvoorspellingDeel2LessonPage;
    } else {
        window.VraagvoorspellingDeel2LessonPage = VraagvoorspellingDeel2LessonPage;
    }
    console.log('[VraagvoorspellingDeel2LessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[VraagvoorspellingDeel2LessonPage] ❌ Error exporting:', error);
    try {
        window.VraagvoorspellingDeel2LessonPage = VraagvoorspellingDeel2LessonPage;
    } catch (e) {
        console.error('[VraagvoorspellingDeel2LessonPage] ❌ Failed to force export:', e);
    }
}


