/**
 * Week4LessonPage
 * 
 * Specifieke pagina voor Week 4: Innovatie & Technologie
 */

class Week4LessonPage extends BaseLessonPage {
    constructor() {
        super('week-4', 'Week 4', 'Innovatie & Technologie');
    }

    async init() {
        document.body.innerHTML = this.render();
        this.attachEventListeners();
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Week4LessonPage;
}
