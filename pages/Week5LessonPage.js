/**
 * Week5LessonPage
 * 
 * Specifieke pagina voor Week 5: Onderzoek & Methodologie
 */

class Week5LessonPage extends BaseLessonPage {
    constructor() {
        super('week-5', 'Week 5', 'Onderzoek & Methodologie');
    }

    async init() {
        document.body.innerHTML = this.render();
        this.attachEventListeners();
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Week5LessonPage;
}
