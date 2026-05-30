/**
 * GepersonaliseerdLessonPage
 *
 * Pagina voor gepersonaliseerd leren op basis van leerdoelen.
 * Laadt leerdoelen-registry.json en toont voortgang per leerdoel.
 * Links naar content in week2.html via anchors.
 *
 * @extends BaseLessonPage
 */
(function() {
    'use strict';
    if (typeof BaseLessonPage === 'undefined') {
        console.error('[GepersonaliseerdLessonPage] BaseLessonPage is niet geladen. Laad eerst de core scripts.');
        return;
    }
    window.GepersonaliseerdLessonPage = class GepersonaliseerdLessonPage extends BaseLessonPage {
    constructor() {
        super('gepersonaliseerd', 'Gepersonaliseerd leren', 'Van probleem naar doelstelling');
        this.progressData = [];
    }

    /**
     * Gebruik leerdoelen-registry.json in plaats van standaard content bestand
     * @returns {string}
     */
    getContentFileName() {
        return 'leerdoelen-registry.json';
    }

    /**
     * Laad content en voortgang
     */
    async loadContent(retries = 3) {
        await super.loadContent(retries);
        await this._loadProgress();
    }

    /**
     * Laad voortgang uit ProgressService
     * @private
     */
    async _loadProgress() {
        try {
            if (window.ProgressService) {
                this.progressData = await window.ProgressService.getProgress();
            }
        } catch (err) {
            console.warn('[GepersonaliseerdLessonPage] Kon voortgang niet laden:', err);
            this.progressData = [];
        }
    }

    /**
     * Check of een leerdoel voltooid is
     * @param {string} goalId
     * @returns {boolean}
     */
    _isCompleted(goalId) {
        const item = this.progressData.find((p) => p.goal_id === goalId);
        return item && item.status === 'completed';
    }

    /**
     * Render content secties: onderwerp met leerdoelen en voortgang
     * @returns {string}
     */
    renderContentSections() {
        if (!this.content || !this.content.onderwerpen) {
            return this.renderErrorState();
        }

        const onderwerp = this.content.onderwerpen[0];
        if (!onderwerp) {
            return this.renderErrorState();
        }

        const contentUrl = onderwerp.contentUrl || 'week2.html';
        const leerdoelenHtml = onderwerp.leerdoelen
            .map((ld) => this._renderLeerdoel(ld, contentUrl))
            .join('');

        const completedCount = onderwerp.leerdoelen.filter((ld) =>
            this._isCompleted(ld.id)
        ).length;
        const totalCount = onderwerp.leerdoelen.length;
        const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return `
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">${onderwerp.titel}</h2>
                <p class="text-gray-600 dark:text-gray-300 mb-6">${onderwerp.beschrijving || ''}</p>
                <div class="mb-6">
                    <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Voortgang</span>
                        <span>${completedCount} van ${totalCount} leerdoelen</span>
                    </div>
                    <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-purple-600 dark:bg-purple-500 rounded-full transition-all duration-500" style="width: ${progressPct}%"></div>
                    </div>
                </div>
                <div class="space-y-4">
                    ${leerdoelenHtml}
                </div>
            </section>
        `;
    }

    /**
     * Render één leerdoel met checkbox, tekst en link naar content
     * @param {Object} ld - Leerdoel object
     * @param {string} contentUrl - Basis URL voor content (bijv. week2.html)
     * @returns {string}
     */
    _renderLeerdoel(ld, contentUrl) {
        const completed = this._isCompleted(ld.id);
        const anchor = ld.contentRefs?.[0]?.anchor;
        const contentLink = anchor ? `${contentUrl}#${anchor}` : contentUrl;

        return `
            <div class="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" data-goal-id="${ld.id}">
                <div class="flex-shrink-0 pt-0.5">
                    <button type="button" class="gepersonaliseerd-checkbox w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        completed
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'border-gray-400 dark:border-gray-500 hover:border-purple-500'
                    }" data-goal-id="${ld.id}" aria-label="${completed ? 'Afvinken' : 'Markeer als voltooid'}">
                        ${completed ? '<i class="fas fa-check text-sm"></i>' : ''}
                    </button>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-gray-700 dark:text-gray-300 ${completed ? 'line-through opacity-75' : ''}">${ld.text}</p>
                    <div class="flex flex-wrap gap-3 mt-2">
                        <a href="ai-leerpad.html?goalId=${encodeURIComponent(ld.id)}" class="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium">
                            <i class="fas fa-robot"></i>
                            Start AI-leerpad
                        </a>
                        <a href="${contentLink}" class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:underline text-sm font-medium">
                            <i class="fas fa-book-open"></i>
                            Bekijk content
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Hook: na content geladen, attach checkbox listeners
     */
    async afterEventListeners() {
        this._attachCheckboxListeners();
    }

    /**
     * Attach click listeners aan checkboxes
     * @private
     */
    _attachCheckboxListeners() {
        document.querySelectorAll('.gepersonaliseerd-checkbox').forEach((btn) => {
            btn.addEventListener('click', (e) => this._onCheckboxClick(e));
        });
    }

    /**
     * Handler voor checkbox click: toggle voltooid en sla op
     * @param {Event} e
     */
    async _onCheckboxClick(e) {
        const btn = e.currentTarget;
        const goalId = btn.getAttribute('data-goal-id');
        if (!goalId || !window.ProgressService) return;

        const completed = this._isCompleted(goalId);
        const newStatus = completed ? 'not_started' : 'completed';

        try {
            await window.ProgressService.saveProgress(
                goalId,
                newStatus === 'completed' ? 100 : 0,
                newStatus
            );
            this.progressData = await window.ProgressService.getProgress();
            this._refreshContent();
        } catch (err) {
            console.error('[GepersonaliseerdLessonPage] Kon voortgang niet opslaan:', err);
        }
    }

    /**
     * Vernieuw de content (na checkbox toggle)
     * @private
     */
    _refreshContent() {
        const mainContent = document.querySelector('#main-content');
        if (!mainContent) return;

        const article = mainContent.querySelector('article');
        if (!article) return;

        article.innerHTML = this.renderContentSections();
        this._attachCheckboxListeners();
    }
};
})();
