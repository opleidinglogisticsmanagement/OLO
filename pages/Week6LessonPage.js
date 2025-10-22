/**
 * Week6LessonPage
 * 
 * Specifieke pagina voor Week 6: Ethiek & Professionaliteit
 */

class Week6LessonPage extends BaseLessonPage {
    constructor() {
        super('week-6', 'Week 6', 'Ethiek & Professionaliteit');
    }

    async init() {
        document.body.innerHTML = this.render();
        this.attachEventListeners();
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Week6LessonPage;
}
