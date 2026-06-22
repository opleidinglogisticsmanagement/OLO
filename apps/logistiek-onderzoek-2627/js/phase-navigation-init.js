/**
 * Injecteert gedeelde fase-sidebar op statische pagina's (index, ai-leerpad, enz.).
 * Lesson pages gebruiken SidebarManager + LayoutRenderer.
 */
(function () {
    'use strict';

    const STATIC_PAGE_MODULE_IDS = {
        'index.html': 'start',
        '': 'start',
        'onderzoeksplan.html': 'week-1',
        'casus.html': 'casus',
        'register.html': 'register',
        'afsluiting.html': 'afsluiting',
        'instructies.html': 'instructies',
        'ai-leerpad.html': 'ai-leerpad',
        'gepersonaliseerd.html': 'gepersonaliseerd'
    };

    /**
     * Bepaal moduleId voor highlight op statische pagina's
     * @returns {string}
     */
    function resolveStaticPageModuleId() {
        const page = (window.location.pathname || '').split('/').pop() || 'index.html';
        return STATIC_PAGE_MODULE_IDS[page] || '';
    }

    /**
     * Vervang placeholder-nav door renderSidebarNavigation()
     */
    function initStaticPhaseNavigation() {
        const config = window.PhaseNavigationConfig;
        if (!config || !config.isApp2627()) {
            return;
        }

        const root = document.querySelector('[data-phase-nav-root]');
        if (!root || root.getAttribute('data-phase-nav-injected') === 'true') {
            return;
        }

        const moduleId = resolveStaticPageModuleId();
        const html = config.renderSidebarNavigation(moduleId);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newNav = doc.querySelector('nav');

        if (!newNav) {
            console.warn('[PhaseNavigationInit] Kon navigatie niet parsen');
            return;
        }

        newNav.setAttribute('data-phase-nav-injected', 'true');
        root.replaceWith(newNav);

        if (window.PhaseSidebar) {
            window.PhaseSidebar.initPhaseSubmenus(moduleId);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStaticPhaseNavigation);
    } else {
        initStaticPhaseNavigation();
    }

    window.PhaseNavigationInit = { initStaticPhaseNavigation, resolveStaticPageModuleId };
})();
