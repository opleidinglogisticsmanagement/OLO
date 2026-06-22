/**
 * App-specifieke navigatielabels voor logistiek-onderzoek
 */
(function () {
    const WEEK1_LABEL = 'Onderzoeksplan template';

    if (typeof NavigationService !== 'undefined') {
        const originalGetModules = NavigationService.prototype.getModulesForApp;
        NavigationService.prototype.getModulesForApp = function (appId) {
            const modules = originalGetModules.call(this, appId);
            return modules.map((module) => (
                module.id === 'week-1' ? { ...module, title: WEEK1_LABEL } : module
            ));
        };
    }

    if (typeof LayoutRenderer !== 'undefined') {
        const originalRenderNav = LayoutRenderer.prototype.renderLogistiekOnderzoekNavigation;
        LayoutRenderer.prototype.renderLogistiekOnderzoekNavigation = function () {
            const html = originalRenderNav.call(this);
            return html.replace('>Week 1</span>', `>${WEEK1_LABEL}</span>`);
        };
    }
})();
