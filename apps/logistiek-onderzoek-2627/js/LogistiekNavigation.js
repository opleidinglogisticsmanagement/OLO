/**
 * App-specifieke navigatie voor logistiek-onderzoek-2627.
 * Fase-sidebar, vorige/volgende knoppen en blokkade van oude week-URL's.
 */
(function () {
    'use strict';

    const config = window.PhaseNavigationConfig;
    if (!config) {
        console.warn('[LogistiekNavigation] PhaseNavigationConfig niet geladen');
        return;
    }

    const {
        WEEK1_LABEL,
        CASUS_LABEL,
        CASUS_HREF,
        isApp2627,
        getNavigationServiceModules,
        getPreviousSequentialModule,
        getNextSequentialModule,
        renderSidebarNavigation
    } = config;

    /**
     * Navigeer naar een fase-URL via AppRouter of volledige pagina-load
     * @param {string} href
     */
    function navigateToHref(href) {
        const mapped = config.mapLegacyHref(href);
        const fileName = (mapped.split('#')[0].split('?')[0].split('/').pop()) || mapped;
        const hash = mapped.includes('#') ? mapped.split('#')[1].split('?')[0] : null;

        if (window.appRouter) {
            window.appRouter.navigate(fileName, hash);
            return;
        }

        window.location.href = mapped;
    }

    /**
     * Oude Week* pagina-classes doorverwijzen naar Fase* classes
     */
    function aliasLegacyPageClasses() {
        if (window.OnderzoeksplanLessonPage) {
            window.Week1LessonPage = window.OnderzoeksplanLessonPage;
        }
        if (window.Fase1LessonPage) {
            window.Week2LessonPage = window.Fase1LessonPage;
            window.Week3LessonPage = window.Fase1LessonPage;
        }
        if (window.Fase2LessonPage) {
            window.Week4LessonPage = window.Fase2LessonPage;
        }
        if (window.Fase3LessonPage) {
            window.Week5LessonPage = window.Fase3LessonPage;
        }
        if (window.Fase4LessonPage) {
            window.Week6LessonPage = window.Fase4LessonPage;
        }
        if (window.AfrondingLessonPage) {
            window.Week7LessonPage = window.AfrondingLessonPage;
        }
    }

    if (typeof NavigationService !== 'undefined') {
        const originalGetModules = NavigationService.prototype.getModulesForApp;

        NavigationService.prototype.getModulesForApp = function (appId) {
            if (!isApp2627()) {
                const modules = originalGetModules.call(this, appId);
                return modules.map((module) => (
                    module.id === 'week-1' ? { ...module, title: WEEK1_LABEL } : module
                ));
            }

            const modules = getNavigationServiceModules();
            this.modules = modules;
            return modules;
        };

        NavigationService.prototype.getPreviousModule = function (moduleId) {
            if (!isApp2627()) {
                this.reinitialize();
                const currentIndex = this.modules.findIndex((module) => module.id === moduleId);
                return this.modules[currentIndex - 1] || null;
            }
            return getPreviousSequentialModule(moduleId);
        };

        NavigationService.prototype.getNextModule = function (moduleId) {
            if (!isApp2627()) {
                this.reinitialize();
                const currentIndex = this.modules.findIndex((module) => module.id === moduleId);
                return this.modules[currentIndex + 1] || null;
            }
            return getNextSequentialModule(moduleId);
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

    /**
     * Onderknoppen zelf opbouwen (niet via oude week-lijst in NavigationService)
     */
    function patchNavigationRenderer() {
        if (typeof NavigationRenderer === 'undefined') {
            setTimeout(patchNavigationRenderer, 20);
            return;
        }

        NavigationRenderer.prototype.renderNavigation = function () {
            const prevModule = getPreviousSequentialModule(this.moduleId);
            const nextModule = getNextSequentialModule(this.moduleId);
            const prevHref = prevModule ? prevModule.href : 'index.html';
            const prevText = prevModule ? `Vorige: ${prevModule.title}` : 'Terug naar Start';

            return `
            <div class="mt-12 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <button class="nav-button flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 w-full sm:w-auto bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus-ring transition-colors" data-nav-href="${prevHref}">
                    <i class="fas fa-arrow-left"></i>
                    <span>${prevText}</span>
                </button>
                ${nextModule ? `
                <button class="nav-button flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 w-full sm:w-auto bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus-ring transition-colors" data-nav-href="${nextModule.href}">
                    <span>Volgende: ${nextModule.title}</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
                ` : '<div></div>'}
            </div>
            `;
        };
    }

    patchNavigationRenderer();
    aliasLegacyPageClasses();
    setTimeout(aliasLegacyPageClasses, 100);
    setTimeout(aliasLegacyPageClasses, 500);

    document.addEventListener('click', (event) => {
        const button = event.target.closest('.nav-button');
        const link = event.target.closest('a[href]');
        const rawHref = button
            ? button.getAttribute('data-nav-href')
            : (link ? link.getAttribute('href') : null);

        if (!rawHref) {
            return;
        }

        const isLegacyWeekUrl = /week[1-7]\.html/i.test(rawHref);
        if (!button && !isLegacyWeekUrl) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        navigateToHref(rawHref);
    }, true);

    window.LogistiekNavigation = {
        CASUS_LABEL,
        CASUS_HREF,
        isApp2627,
        aliasLegacyPageClasses,
        navigateToHref
    };
})();
