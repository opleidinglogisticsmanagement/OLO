/**
 * AppRouter-uitbreidingen voor logistiek-onderzoek-2627 (fase-URL's).
 * Registreert fase-routes zonder packages/core te wijzigen.
 */
(function () {
    'use strict';

    if (typeof AppRouter === 'undefined' || !window.PhaseNavigationConfig) {
        return;
    }

    if (!PhaseNavigationConfig.isApp2627()) {
        return;
    }

    const originalInit = AppRouter.prototype.init;

    /**
     * Registreer fase-routes op de router
     * @param {AppRouter} router
     */
    function registerPhaseRoutes(router) {
        router.routes['onderzoeksplan.html'] = () => router.loadWeekPage('week-1', 'OnderzoeksplanLessonPage');
        router.routes['week1.html'] = () => router.loadWeekPage('week-1', 'OnderzoeksplanLessonPage');
        router.routes['fase1.html'] = () => router.loadWeekPage('fase-1', 'Fase1LessonPage');
        router.routes['week2.html'] = () => router.loadWeekPage('fase-1', 'Fase1LessonPage');
        router.routes['week3.html'] = () => router.loadWeekPage('fase-1', 'Fase1LessonPage');
        router.routes['fase2.html'] = () => router.loadWeekPage('fase-2', 'Fase2LessonPage');
        router.routes['week4.html'] = () => router.loadWeekPage('fase-2', 'Fase2LessonPage');
        router.routes['fase3.html'] = () => router.loadWeekPage('fase-3', 'Fase3LessonPage');
        router.routes['week5.html'] = () => router.loadWeekPage('fase-3', 'Fase3LessonPage');
        router.routes['fase4.html'] = () => router.loadWeekPage('fase-4', 'Fase4LessonPage');
        router.routes['week6.html'] = () => router.loadWeekPage('fase-4', 'Fase4LessonPage');
        router.routes['afronding.html'] = () => router.loadWeekPage('afronding', 'AfrondingLessonPage');
        router.routes['week7.html'] = () => router.loadWeekPage('afronding', 'AfrondingLessonPage');
    }

    AppRouter.prototype.init = function () {
        registerPhaseRoutes(this);
        return originalInit.call(this);
    };
})();
