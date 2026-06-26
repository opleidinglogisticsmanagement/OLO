/**
 * AppRouter-uitbreidingen voor logistiek-onderzoek-2627 (fase-URL's).
 * Registreert fase-routes zonder packages/core te wijzigen.
 */
(function () {
    'use strict';

    let installed = false;

    /**
     * @returns {boolean}
     */
    function isIndexPath() {
        const path = window.location.pathname || '';
        const file = path.split('/').pop() || 'index.html';
        return file === 'index.html' || file === '' || path.endsWith('/');
    }

    /**
     * Bewaar server-rendered index-content vóór AppRouter showLoadingState draait
     */
    function cacheServerIndexContent() {
        const main = document.querySelector('#main-content');
        if (!main || !(main.textContent || '').includes('Module Structuur')) {
            return;
        }
        window.__indexMainContentCache = main.innerHTML;
    }

    /**
     * Herstel gecachte index-content in #main-content
     * @returns {boolean}
     */
    function restoreServerIndexContent() {
        const main = document.querySelector('#main-content');
        const cached = window.__indexMainContentCache;
        if (!main || !cached) {
            return false;
        }
        main.innerHTML = cached;
        main.style.opacity = '1';
        return true;
    }

    /**
     * Voer post-index hooks uit zonder index.html opnieuw te fetchen
     * @param {AppRouter} router
     */
    function runIndexPageHooksWithoutFetch(router) {
        setTimeout(() => {
            if (window.SidebarManager) {
                const sidebarManager = new window.SidebarManager('start');
                sidebarManager.init();
            }
        }, 50);

        setTimeout(() => {
            if (typeof router.attachIndexPageScripts === 'function') {
                router.attachIndexPageScripts();
            }
        }, 100);
    }

    /**
     * Installeer AppRouter-patches zodra PhaseNavigationConfig beschikbaar is
     * @returns {boolean}
     */
    function installAppRouterExtensions() {
        if (installed) {
            return true;
        }

        if (typeof AppRouter === 'undefined' || !window.PhaseNavigationConfig) {
            return false;
        }

        if (!PhaseNavigationConfig.isApp2627()) {
            installed = true;
            return true;
        }

        const originalInit = AppRouter.prototype.init;
        const originalLoadIndexPage = AppRouter.prototype.loadIndexPage;
        const originalShowLoadingState = AppRouter.prototype.showLoadingState;

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

        AppRouter.prototype.showLoadingState = function () {
            if (window.__indexMainContentCache && !window.__initialIndexLoadComplete && isIndexPath()) {
                return;
            }
            return originalShowLoadingState.call(this);
        };

        AppRouter.prototype.loadIndexPage = async function () {
            const main = document.querySelector('#main-content');
            const mainIsLoadingOnly = main && (main.textContent || '').trim() === 'Laden...';
            const isInitialIndexLoad = window.__indexMainContentCache && !window.__initialIndexLoadComplete;

            if (isInitialIndexLoad) {
                if (mainIsLoadingOnly) {
                    restoreServerIndexContent();
                }
                window.__initialIndexLoadComplete = true;
                runIndexPageHooksWithoutFetch(this);
                return;
            }

            await originalLoadIndexPage.call(this);
        };

        if (typeof NavigationInitializer !== 'undefined') {
            const originalNavInit = NavigationInitializer.prototype.init;
            NavigationInitializer.prototype.init = function () {
                if (window.PhaseNavigationConfig && PhaseNavigationConfig.isApp2627()) {
                    return;
                }
                return originalNavInit.call(this);
            };
        }

        AppRouter.prototype.init = function () {
            registerPhaseRoutes(this);
            cacheServerIndexContent();
            return originalInit.call(this);
        };

        installed = true;
        return true;
    }

    if (!installAppRouterExtensions()) {
        const retryInstall = () => {
            if (installAppRouterExtensions()) {
                return;
            }
            setTimeout(retryInstall, 25);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', retryInstall);
        } else {
            retryInstall();
        }
    }
})();
