/**
 * VraagvoorspellingDeel1LessonPage
 * 
 * Specifieke pagina voor Vraagvoorspelling (deel 1)
 */

// Wait for BaseLessonPage to be available before defining the class
(function() {
    const maxWait = 5000; // 5 seconds
    const startTime = Date.now();
    
    function checkAndDefine() {
        if (typeof BaseLessonPage !== 'undefined') {
            // BaseLessonPage is available, define the class
            defineClass();
        } else if (Date.now() - startTime < maxWait) {
            // Still waiting, check again in 50ms
            setTimeout(checkAndDefine, 50);
        } else {
            // Timeout - log error but don't throw (allow retry)
            console.error('[VraagvoorspellingDeel1LessonPage] ❌ BaseLessonPage not available after waiting. Class will not be defined.');
            
        }
    }
    
    function defineClass() {

        class VraagvoorspellingDeel1LessonPage extends BaseLessonPage {
    constructor() {
        super('vraagvoorspelling-deel1', 'Vraagvoorspelling (deel 1)', 'Vraagvoorspelling (deel 1)');
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
                    storageKey: 'vraagvoorspelling-deel1-learning-objectives'
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
                    console.error('[VraagvoorspellingDeel1LessonPage] ❌ Content not loaded properly');
                    return false;
                }
                
                if (!this.content.theorie) {
                    console.warn('[VraagvoorspellingDeel1LessonPage] ⚠️ Theorie section missing in content');
                }
                
                return true;
            }
        }
        
        // Export the class
        try {
            if (typeof module !== 'undefined' && module.exports) {
                module.exports = VraagvoorspellingDeel1LessonPage;
            } else {
                window.VraagvoorspellingDeel1LessonPage = VraagvoorspellingDeel1LessonPage;
            }
            console.log('[VraagvoorspellingDeel1LessonPage] ✅ Exported to window');
            
        } catch (error) {
            console.error('[VraagvoorspellingDeel1LessonPage] ❌ Error exporting:', error);
            
            try {
                window.VraagvoorspellingDeel1LessonPage = VraagvoorspellingDeel1LessonPage;
            } catch (e) {
                console.error('[VraagvoorspellingDeel1LessonPage] ❌ Failed to force export:', e);
            }
        }
    }
    
    // Start checking for BaseLessonPage
    checkAndDefine();
})();

