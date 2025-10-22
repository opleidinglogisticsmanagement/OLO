/**
 * AfsluitingLessonPage
 * 
 * Specifieke pagina voor Afsluiting: Eindbeoordeling & Certificering
 */

class AfsluitingLessonPage extends BaseLessonPage {
    constructor() {
        super('afsluiting', 'Afsluiting', 'Eindbeoordeling & Certificering');
    }

    async init() {
        document.body.innerHTML = this.render();
        this.attachEventListeners();
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AfsluitingLessonPage;
}
