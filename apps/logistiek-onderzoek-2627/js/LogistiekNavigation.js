/**
 * App-specifieke navigatie voor logistiek-onderzoek-2627
 */
(function () {
    const WEEK1_LABEL = 'Onderzoeksplan template';
    const CASUS_LABEL = 'Casus magazijnoptimalisatie';
    const CASUS_HREF = 'casus.html';

    const CASUS_NAV_BLOCK = `
                        <a href="${CASUS_HREF}" class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-warehouse text-teal-600 dark:text-teal-400 text-sm"></i>
                                </div>
                                <span class="font-medium text-gray-900 dark:text-white">${CASUS_LABEL}</span>
                            </div>
                        </a>`;

    const CASUS_NAV_INLINE = `
                <a href="${CASUS_HREF}" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors text-gray-600 dark:text-gray-300">
                    <div class="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center" data-bg-inactive="bg-teal-100 dark:bg-teal-900/30" data-icon-inactive="text-teal-600 dark:text-teal-400">
                        <i class="fas fa-warehouse text-sm text-teal-600 dark:text-teal-400"></i>
                    </div>
                    <span class="font-medium">${CASUS_LABEL}</span>
                </a>`;

    /**
     * Voeg casus-navigatie toe direct na het week1 / template-menu-item
     * @param {string} html - Navigatie-HTML
     * @returns {string}
     */
    function injectCasusNavItem(html) {
        if (html.includes(CASUS_HREF)) {
            return html;
        }

        const week1BlockPattern = /(<a href="week1\.html"[\s\S]*?<\/a>)/;
        if (week1BlockPattern.test(html)) {
            return html.replace(week1BlockPattern, `$1\n${CASUS_NAV_INLINE}`);
        }

        return html;
    }

    if (typeof NavigationService !== 'undefined') {
        const originalGetModules = NavigationService.prototype.getModulesForApp;
        NavigationService.prototype.getModulesForApp = function (appId) {
            const modules = originalGetModules.call(this, appId);
            const mapped = modules.map((module) => (
                module.id === 'week-1' ? { ...module, title: WEEK1_LABEL } : module
            ));

            if (mapped.some((module) => module.id === 'casus')) {
                return mapped;
            }

            const week1Index = mapped.findIndex((module) => module.id === 'week-1');
            const casusModule = { id: 'casus', title: CASUS_LABEL, href: CASUS_HREF };

            if (week1Index === -1) {
                return [...mapped, casusModule];
            }

            return [
                ...mapped.slice(0, week1Index + 1),
                casusModule,
                ...mapped.slice(week1Index + 1)
            ];
        };
    }

    if (typeof LayoutRenderer !== 'undefined') {
        const originalRenderNav = LayoutRenderer.prototype.renderLogistiekOnderzoekNavigation;
        LayoutRenderer.prototype.renderLogistiekOnderzoekNavigation = function () {
            let html = originalRenderNav.call(this);
            html = html.replace('>Week 1</span>', `>${WEEK1_LABEL}</span>`);
            return injectCasusNavItem(html);
        };
    }

    window.LogistiekNavigation = {
        CASUS_LABEL,
        CASUS_HREF,
        CASUS_NAV_BLOCK
    };
})();
