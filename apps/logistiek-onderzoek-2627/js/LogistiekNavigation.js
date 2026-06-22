/**
 * App-specifieke navigatie voor logistiek-onderzoek-2627.
 * Gebruikt phase-navigation-config.js voor fase-URL's.
 */
(function () {
    'use strict';

    const config = window.PhaseNavigationConfig;
    if (!config) {
        console.warn('[LogistiekNavigation] PhaseNavigationConfig niet geladen');
        return;
    }

    const { WEEK1_LABEL, CASUS_LABEL, CASUS_HREF, isApp2627, getNavigationServiceModules, renderSidebarNavigation } = config;

    if (typeof NavigationService !== 'undefined') {
        const originalGetModules = NavigationService.prototype.getModulesForApp;

        NavigationService.prototype.getModulesForApp = function (appId) {
            if (!isApp2627()) {
                const modules = originalGetModules.call(this, appId);
                return modules.map((module) => (
                    module.id === 'week-1' ? { ...module, title: WEEK1_LABEL } : module
                ));
            }

            return getNavigationServiceModules();
        };
    }

    if (typeof LayoutRenderer !== 'undefined') {
        const originalRenderNav = LayoutRenderer.prototype.renderLogistiekOnderzoekNavigation;

        LayoutRenderer.prototype.renderLogistiekOnderzoekNavigation = function () {
            if (!isApp2627()) {
                let html = originalRenderNav.call(this);
                html = html.replace('>Week 1</span>', `>${WEEK1_LABEL}</span>`);
                return html;
            }

            return renderSidebarNavigation(this.moduleId);
        };

        const originalIconColors = LayoutRenderer.prototype._getModuleIconColors;
        LayoutRenderer.prototype._getModuleIconColors = function (module, isCurrent) {
            if (!isApp2627()) {
                return originalIconColors.call(this, module, isCurrent);
            }

            const phaseModule = config.getPhaseModules().find((m) => m.id === module.id);
            if (phaseModule && phaseModule.colors) {
                if (isCurrent) {
                    return { iconClass: 'text-blue-600 dark:text-blue-300', bgClass: 'bg-blue-100 dark:bg-blue-800' };
                }
                return { iconClass: phaseModule.colors.icon, bgClass: phaseModule.colors.bg };
            }

            return originalIconColors.call(this, module, isCurrent);
        };
    }

    window.LogistiekNavigation = {
        CASUS_LABEL,
        CASUS_HREF,
        isApp2627
    };
})();
