/**
 * Centrale navigatieconfiguratie voor het fasenleerpad (fase-URL's).
 * Eén bron van waarheid voor sidebar, vorige/volgende en redirects.
 * Live: https://logistiekonderzoek.vercel.app/
 */
(function () {
    'use strict';

    const WEEK1_LABEL = 'Onderzoeksplan template';
    const WEEK1_HREF = 'onderzoeksplan.html';
    const CASUS_LABEL = 'Casus magazijnoptimalisatie';
    const CASUS_HREF = 'casus.html';

    /** @type {Record<string, string>} Oude week-URL → nieuwe fase-URL */
    const WEEK_REDIRECTS = {
        'week1.html': 'onderzoeksplan.html',
        'week6.html': 'fase4.html',
        'week7.html': 'afronding.html',
        'week5.html': 'fase3.html',
        'week2.html': 'fase1.html',
        'week3.html': 'fase1.html'
    };

    /** Anchors op week4 die naar fase3 horen */
    const WEEK4_FASE3_ANCHORS = ['#literatuuronderzoek'];

    /** App-identiteit */
    window.APP_ID = 'logistiek-onderzoek';

    /**
     * Gebruik het fasenleerpad (dit bestand wordt alleen geladen in de gemigreerde app).
     * @returns {boolean}
     */
    function isApp2627() {
        return true;
    }

    /**
     * Fase-modules met subitems (href's worden stapsgewijs gemigreerd)
     * @returns {Array<Object>}
     */
    function getPhaseModules() {
        return [
            { id: 'start', title: 'Start', href: 'index.html', icon: 'fa-home', colors: { icon: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' } },
            { id: 'week-1', title: WEEK1_LABEL, href: WEEK1_HREF, icon: 'fa-play-circle', colors: { icon: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' } },
            { id: 'casus', title: CASUS_LABEL, href: CASUS_HREF, icon: 'fa-warehouse', colors: { icon: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30' } },
            {
                id: 'fase-1',
                title: 'Fase 01 – Eerste aanzet',
                href: 'fase1.html',
                icon: 'fa-layer-group',
                colors: { icon: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                subItems: [
                    { id: 'probleem-verkennen', title: 'Probleem verkennen', anchor: '#probleem-verkennen' },
                    { id: 'interviewen', title: 'Interviewen', anchor: '#interviewen' },
                    { id: 'doelstelling-opstellen', title: 'Doelstelling opstellen', anchor: '#doelstelling-opstellen' },
                    { id: 'opdrachtgever-onderzoeker', title: 'Opdrachtgever-onderzoeker relatie', anchor: '#opdrachtgever-onderzoeker' },
                    { id: 'vormen-praktijkgericht', title: 'Vormen van praktijkgericht onderzoek', anchor: '#vormen-praktijkgericht' },
                    { id: 'onderzoeksmodel', title: 'Onderzoeksmodel', anchor: '#onderzoeksmodel' },
                    { id: 'onderzoeksmodel-why', title: 'Onderzoeksmodel, why?', anchor: '#onderzoeksmodel-why' },
                    { id: 'hoofdvraag', title: 'Hoofdvraag', anchor: '#hoofdvraag' },
                    { id: 'ai-onderzoeksassistent', title: 'AI-Onderzoeksassistent', anchor: '#ai-onderzoeksassistent' }
                ]
            },
            {
                id: 'fase-2',
                title: 'Fase 02 – De verfijning',
                href: 'fase2.html',
                icon: 'fa-layer-group',
                colors: { icon: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
                subItems: [
                    { id: 'definieren-begrippen', title: 'Definiëren van begrippen', anchor: '#definieren-begrippen' },
                    { id: 'deelvragen', title: 'Deelvragen', anchor: '#deelvragen' }
                ]
            },
            {
                id: 'fase-3',
                title: 'Fase 03 – Literatuuronderzoek',
                href: 'fase3.html',
                icon: 'fa-layer-group',
                colors: { icon: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
                subItems: [
                    { id: 'literatuuronderzoek', title: 'Het uitvoeren van literatuuronderzoek', anchor: '#literatuuronderzoek' },
                    { id: 'selecteren-beoordelen', title: 'Selecteren en beoordelen', anchor: '#van-informatieberg-naar-theoretisch-kader' },
                    { id: 'slim-bronnen-beheren', title: 'Slim bronnen beheren', anchor: '#slim-bronnen-beheren' },
                    { id: 'theoretisch-kader-schrijven', title: 'Theoretisch kader schrijven', anchor: '#theoretisch-kader-schrijven' }
                ]
            },
            {
                id: 'fase-4',
                title: 'Fase 04 – Onderzoekstechnisch ontwerp',
                href: 'fase4.html',
                icon: 'fa-layer-group',
                colors: { icon: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
                subItems: [
                    { id: 'kernbeslissingen', title: 'Kernbeslissingen', anchor: '#kernbeslissingen' },
                    { id: 'onderzoekstrategie', title: 'Onderzoeksstrategie', anchor: '#onderzoekstrategie' },
                    { id: 'dataverzamelingsplan', title: 'Het dataverzamelingsplan', anchor: '#dataverzamelingsplan' }
                ]
            },
            {
                id: 'afronding',
                title: 'Afronding',
                href: 'afronding.html',
                icon: 'fa-flag-checkered',
                colors: { icon: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-900/30' },
                subItems: [
                    { id: 'schrijven-en-visualiseren', title: 'Schrijven en visualiseren', anchor: '#schrijven-en-visualiseren' },
                    { id: 'de-rode-draad', title: 'De rode draad', anchor: '#de-rode-draad' },
                    { id: 'schrijfvaardigheidseisen-en-rubric', title: 'Schrijfvaardigheidseisen en rubric', anchor: '#schrijfvaardigheidseisen-en-rubric' },
                    { id: 'planning-maken', title: 'Planning maken', anchor: '#planning-maken' }
                ]
            },
            { id: 'register', title: 'Begrippenlijst', href: 'register.html', icon: 'fa-list-ul', colors: { icon: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' } }
        ];
    }

    /**
     * Modules voor NavigationService (zonder icon/colors)
     * @returns {Array<Object>}
     */
    function getNavigationServiceModules() {
        return getPhaseModules().map((module) => {
            const entry = {
                id: module.id,
                title: module.title,
                href: module.href
            };
            if (module.subItems) {
                entry.subItems = module.subItems.map((sub) => ({
                    id: sub.id,
                    title: sub.title,
                    anchor: sub.anchor
                }));
            }
            return entry;
        });
    }

    /**
     * Bepaal actieve fase op basis van moduleId of huidige pagina
     * @param {string} currentModuleId
     * @returns {string|null}
     */
    function resolveActivePhaseId(currentModuleId) {
        const page = (window.location.pathname || '').split('/').pop() || '';
        const legacyMap = {
            'week2.html': 'fase-1',
            'week3.html': 'fase-1',
            'fase1.html': 'fase-1',
            'week4.html': 'fase-2',
            'fase2.html': 'fase-2',
            'week5.html': 'fase-3',
            'fase3.html': 'fase-3',
            'week6.html': 'fase-4',
            'fase4.html': 'fase-4',
            'week7.html': 'afronding',
            'afronding.html': 'afronding'
        };
        if (legacyMap[page]) {
            return legacyMap[page];
        }
        const direct = getPhaseModules().find((m) => m.id === currentModuleId);
        if (direct && direct.id.startsWith('fase-')) {
            return direct.id;
        }
        if (currentModuleId === 'afronding' || currentModuleId === 'week-7') {
            return 'afronding';
        }
        return null;
    }

    /**
     * Render sidebar-navigatie HTML (index-stijl met fase-submenus)
     * @param {string} [currentModuleId='']
     * @returns {string}
     */
    function renderSidebarNavigation(currentModuleId = '') {
        const activePhaseId = resolveActivePhaseId(currentModuleId);
        const currentPage = (window.location.pathname || '').split('/').pop() || '';

        const renderSubItem = (sub, parentHref) => {
            const href = `${sub.href || parentHref}${sub.anchor}`;
            const isSubCurrent = window.location.hash === sub.anchor;
            return `
                <a href="${href}" class="nav-sub-item flex items-center space-x-3 pl-11 pr-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors ${isSubCurrent ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}" data-anchor="${sub.anchor}">
                    <div class="w-6 h-6 ${isSubCurrent ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'} rounded flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-circle text-xs ${isSubCurrent ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}"></i>
                    </div>
                    <span class="text-sm font-medium">${sub.title}</span>
                </a>`;
        };

        const renderPhaseItem = (module) => {
            const isActive = activePhaseId === module.id;
            const chevronId = `${module.id}-chevron`;
            const subItemsId = `${module.id}-subitems`;
            const subItemsHtml = module.subItems.map((sub) => renderSubItem(sub, module.href)).join('');

            return `
                <div class="${module.id}-nav-item">
                    <a href="${module.href}" class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/30' : ''}">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 ${module.colors.bg} rounded-lg flex items-center justify-center">
                                <i class="fas ${module.icon} ${module.colors.icon} text-sm"></i>
                            </div>
                            <span class="font-medium text-gray-900 dark:text-white flex-1">${module.title}</span>
                            <i class="fas fa-chevron-down text-xs text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}" id="${chevronId}"></i>
                        </div>
                    </a>
                    <div class="${module.id}-subitems ${isActive ? '' : 'hidden'}" id="${subItemsId}">
                        ${subItemsHtml}
                    </div>
                </div>`;
        };

        const renderSimpleItem = (module) => {
            const isCurrent = module.id === currentModuleId
                || (module.href && currentPage === module.href)
                || (module.id === 'start' && (currentPage === 'index.html' || currentPage === ''));
            const blockStyle = module.id === 'start' || module.id === 'week-1' || module.id === 'casus';

            if (blockStyle) {
                return `
                    <a href="${module.href}" class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors ${isCurrent ? 'bg-blue-50 dark:bg-blue-900/30' : ''}">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 ${module.colors.bg} rounded-lg flex items-center justify-center">
                                <i class="fas ${module.icon} ${module.colors.icon} text-sm"></i>
                            </div>
                            <span class="font-medium text-gray-900 dark:text-white">${module.title}</span>
                        </div>
                    </a>`;
            }

            return `
                <a href="${module.href}" class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors ${isCurrent ? 'bg-blue-50 dark:bg-blue-900/30' : ''}">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 ${module.colors.bg} rounded-lg flex items-center justify-center">
                            <i class="fas ${module.icon} ${module.colors.icon} text-sm"></i>
                        </div>
                        <span class="font-medium text-gray-900 dark:text-white">${module.title}</span>
                    </div>
                </a>`;
        };

        const items = getPhaseModules().map((module) => {
            if (module.subItems && module.subItems.length > 0) {
                return renderPhaseItem(module);
            }
            return renderSimpleItem(module);
        }).join('\n');

        return `
            <nav class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6" aria-label="Module navigatie">
                <div class="space-y-2">
                    <div class="px-3 py-2 mb-2">
                        <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">E-Learning</span>
                    </div>
                    ${items}
                </div>
            </nav>`;
    }

    /** Oude week-moduleId → huidige fase-moduleId */
    const LEGACY_MODULE_IDS = {
        'week-2': 'fase-1',
        'week-3': 'fase-1',
        'week-4': 'fase-2',
        'week-5': 'fase-3',
        'week-6': 'fase-4',
        'week-7': 'afronding'
    };

    /**
     * Vertaal oude week-moduleId naar huidige fase-moduleId
     * @param {string} moduleId
     * @returns {string}
     */
    function resolveSequentialModuleId(moduleId) {
        return LEGACY_MODULE_IDS[moduleId] || moduleId;
    }

    /**
     * Leerpad voor vorige/volgende knoppen (zonder begrippenlijst)
     * @returns {Array<Object>}
     */
    function getSequentialModules() {
        return getNavigationServiceModules().filter((module) => module.id !== 'register');
    }

    /**
     * Vorige module in het leerpad
     * @param {string} moduleId
     * @returns {Object|null}
     */
    function getPreviousSequentialModule(moduleId) {
        const modules = getSequentialModules();
        const id = resolveSequentialModuleId(moduleId);
        const currentIndex = modules.findIndex((module) => module.id === id);
        return currentIndex > 0 ? modules[currentIndex - 1] : null;
    }

    /**
     * Volgende module in het leerpad
     * @param {string} moduleId
     * @returns {Object|null}
     */
    function getNextSequentialModule(moduleId) {
        const modules = getSequentialModules();
        const id = resolveSequentialModuleId(moduleId);
        const currentIndex = modules.findIndex((module) => module.id === id);
        if (currentIndex < 0 || currentIndex >= modules.length - 1) {
            return null;
        }
        return modules[currentIndex + 1];
    }

    /**
     * Vertaal oude week-URL naar huidige fase-URL (behoud hash/query)
     * @param {string} href
     * @returns {string}
     */
    function mapLegacyHref(href) {
        if (!href) {
            return href;
        }

        const hashIndex = href.indexOf('#');
        const queryIndex = href.indexOf('?');
        const cutCandidates = [hashIndex, queryIndex].filter((index) => index >= 0);
        const cutIndex = cutCandidates.length > 0 ? Math.min.apply(null, cutCandidates) : -1;
        const filePart = cutIndex >= 0 ? href.slice(0, cutIndex) : href;
        const rest = cutIndex >= 0 ? href.slice(cutIndex) : '';
        const fileName = filePart.split('/').pop();

        if (fileName === 'week4.html') {
            const hashMatch = rest.match(/#[^?]*/);
            const hash = hashMatch ? hashMatch[0] : '';
            const target = WEEK4_FASE3_ANCHORS.some((anchor) => hash === anchor || hash.startsWith(anchor))
                ? 'fase3.html'
                : 'fase2.html';
            return target + rest;
        }

        const target = WEEK_REDIRECTS[fileName];
        return target ? target + rest : href;
    }

    /**
     * Staat de oude week-2-tot-7-sidebar in de DOM?
     * @returns {boolean}
     */
    function hasLegacyWeekSidebar() {
        return !!(document.querySelector('.week-2-nav-item') || document.querySelector('.week-3-nav-item'));
    }

    /**
     * Vervang de sidebar-nav door de fase-navigatie
     * @param {string} [moduleId='']
     * @returns {boolean}
     */
    function refreshSidebarNavigation(moduleId = '') {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) {
            return false;
        }

        const html = renderSidebarNavigation(moduleId);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newNav = doc.querySelector('nav');
        const oldNav = sidebar.querySelector('nav[aria-label="Module navigatie"]')
            || sidebar.querySelector('nav');

        if (!newNav || !oldNav) {
            return false;
        }

        oldNav.replaceWith(newNav);

        if (window.PhaseSidebar) {
            window.PhaseSidebar.initPhaseSubmenus(moduleId);
        }

        return true;
    }

    /**
     * Redirect oude week-URL naar fase-URL (behoud hash)
     * @param {string} weekFile - Bestandsnaam, bijv. week6.html
     * @returns {boolean} true als redirect is uitgevoerd
     */
    function redirectWeekUrl(weekFile) {
        const hash = window.location.hash || '';
        if (weekFile === 'week4.html') {
            const target = WEEK4_FASE3_ANCHORS.some((a) => hash === a || hash.startsWith(a))
                ? 'fase3.html'
                : 'fase2.html';
            window.location.replace(target + hash + window.location.search);
            return true;
        }
        const target = WEEK_REDIRECTS[weekFile];
        if (!target) {
            return false;
        }
        window.location.replace(target + hash + window.location.search);
        return true;
    }

    window.PhaseNavigationConfig = {
        WEEK1_LABEL,
        CASUS_LABEL,
        CASUS_HREF,
        WEEK_REDIRECTS,
        isApp2627,
        getPhaseModules,
        getNavigationServiceModules,
        getSequentialModules,
        getPreviousSequentialModule,
        getNextSequentialModule,
        resolveSequentialModuleId,
        resolveActivePhaseId,
        renderSidebarNavigation,
        refreshSidebarNavigation,
        hasLegacyWeekSidebar,
        mapLegacyHref,
        redirectWeekUrl
    };
})();
