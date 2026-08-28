/**
 * OnderzoeksplanLessonPage
 *
 * Onderzoeksplan template (onderzoeksplan.html)
 */

class OnderzoeksplanLessonPage extends BaseLessonPage {
    constructor() {
        super('week-1', 'Onderzoeksplan template', 'Aan de slag');
    }

    /**
     * @returns {string}
     */
    getContentFileName() {
        return 'onderzoeksplan.content.json';
    }

    /**
     * Geen aparte intro-sectie; de theorie bevat alle benodigde informatie.
     * @returns {string}
     */
    renderModuleIntro() {
        return '';
    }

    /**
     * Render content secties met content uit JSON
     * @returns {string}
     */
    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }

        let theorieHtml = '';
        const theorie = this.content.theorie;

        if (theorie && theorie.content && Array.isArray(theorie.content)) {
            theorieHtml = ContentRenderer.renderContentItems(theorie.content);
        }

        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Theorie';

        return this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'file-alt',
            'purple'
        );
    }

    /**
     * @returns {Promise<boolean>}
     */
    async afterContentLoaded() {
        if (!this.content || !this.contentLoaded) {
            console.error('[OnderzoeksplanLessonPage] Content not loaded properly');
            return false;
        }

        if (!this.content.theorie) {
            console.warn('[OnderzoeksplanLessonPage] Theorie section missing in content');
        }

        return true;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OnderzoeksplanLessonPage;
} else {
    window.OnderzoeksplanLessonPage = OnderzoeksplanLessonPage;
    window.Week1LessonPage = OnderzoeksplanLessonPage;
}
