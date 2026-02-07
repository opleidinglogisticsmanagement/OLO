/**
 * WaaromICTOLessonPage
 * 
 * Specifieke pagina voor Waarom ICTO
 */

class WaaromICTOLessonPage extends BaseLessonPage {
    constructor() {
        super('waarom-icto', 'Waarom ICTO', 'Waarom ICTO');
    }

    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }

        let theorieHtml = '';
        const theorie = this.content.theorie;
        
        if (theorie && theorie.content && Array.isArray(theorie.content)) {
            theorieHtml = ContentRenderer.renderContentItems(theorie.content, { enableModal: true });
        }

        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Theorie';

        return this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'book',
            'purple'
        );
    }

    renderContent() {
        const contentSections = this.renderContentSections();
        
        return `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 box-border overflow-x-hidden">
                <article class="space-y-6 sm:space-y-8 fade-in box-border overflow-x-hidden">
                    ${this.renderModuleIntro()}
                    ${contentSections}
                </article>
            </div>
        `;
    }

    async afterContentLoaded() {
        if (!this.content || !this.contentLoaded) {
            console.error('[WaaromICTOLessonPage] ❌ Content not loaded properly');
            return false;
        }
        
        if (!this.content.theorie) {
            console.warn('[WaaromICTOLessonPage] ⚠️ Theorie section missing in content');
        }
        
        return true;
    }
}

try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = WaaromICTOLessonPage;
    } else {
        window.WaaromICTOLessonPage = WaaromICTOLessonPage;
    }
    console.log('[WaaromICTOLessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[WaaromICTOLessonPage] ❌ Error exporting:', error);
    try {
        window.WaaromICTOLessonPage = WaaromICTOLessonPage;
    } catch (e) {
        console.error('[WaaromICTOLessonPage] ❌ Failed to force export:', e);
    }
}
