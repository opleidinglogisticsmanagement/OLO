/**
 * CasusLessonPage
 * Aparte pagina voor de oefencasus magazijnoptimalisatie bij Organisatie X
 * @extends BaseLessonPage
 */
class CasusLessonPage extends BaseLessonPage {
    constructor() {
        super('casus', 'Casus magazijnoptimalisatie', 'Organisatie X');
    }

    /**
     * Render content secties met content uit JSON
     * @returns {string} HTML string
     */
    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }

        let theorieHtml = '';
        const theorie = this.content.theorie;

        if (theorie && theorie.content && Array.isArray(theorie.content)) {
            theorieHtml = ContentRenderer.renderContentItems(theorie.content, { enableModal: true });
        }

        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Casusbeschrijving';

        return this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'book',
            'green'
        );
    }

    /**
     * Valideer content na laden
     * @returns {Promise<boolean>}
     */
    async afterContentLoaded() {
        if (!this.content || !this.contentLoaded) {
            console.error('[CasusLessonPage] Content not loaded properly');
            return false;
        }

        if (!this.content.theorie) {
            console.warn('[CasusLessonPage] Theorie section missing in content');
        }

        return true;
    }
}

try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CasusLessonPage;
    } else {
        window.CasusLessonPage = CasusLessonPage;
    }
} catch (error) {
    console.error('[CasusLessonPage] Error exporting:', error);
    window.CasusLessonPage = CasusLessonPage;
}
