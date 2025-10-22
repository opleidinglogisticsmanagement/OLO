/**
 * Week3LessonPage
 * 
 * Specifieke pagina voor Week 3: Management & Leiderschap
 */

class Week3LessonPage extends BaseLessonPage {
    constructor() {
        super('week-3', 'Week 3', 'Management & Leiderschap');
    }

    async init() {
        document.body.innerHTML = this.render();
        this.attachEventListeners();
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Week3LessonPage;
}
