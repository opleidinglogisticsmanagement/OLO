/**
 * Fase-submenu's voor logistiek-onderzoek-2627 (sidebar expand/collapse).
 * Werkt samen met phase-navigation-config.js.
 */
(function () {
    'use strict';

    /**
     * Setup expand/collapse voor één fase-nav-item
     * @param {string} phaseId - bijv. fase-4
     * @param {string} activePhaseId - actieve fase module-id
     */
    function setupPhaseSubmenu(phaseId, activePhaseId) {
        const navItem = document.querySelector(`.${phaseId}-nav-item`);
        if (!navItem) {
            return;
        }

        const link = navItem.querySelector('a');
        const subItemsContainer = document.getElementById(`${phaseId}-subitems`);
        const chevron = document.getElementById(`${phaseId}-chevron`);

        if (!link || !subItemsContainer || !chevron) {
            return;
        }

        if (phaseId === activePhaseId) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }

        const toggleSubmenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isHidden = subItemsContainer.classList.contains('hidden');
            if (isHidden) {
                subItemsContainer.classList.remove('hidden');
                chevron.classList.add('rotate-180');
            } else {
                subItemsContainer.classList.add('hidden');
                chevron.classList.remove('rotate-180');
            }
        };

        chevron.addEventListener('click', toggleSubmenu, true);
        link.addEventListener('click', (e) => {
            const target = e.target;
            const isChevronClick = target === chevron
                || chevron.contains(target)
                || (target.tagName === 'I' && target.classList.contains('fa-chevron-down'));
            if (isChevronClick) {
                toggleSubmenu(e);
            }
        }, true);
    }

    /**
     * Initialiseer alle fase-submenu's na sidebar-render
     * @param {string} moduleId
     */
    function initPhaseSubmenus(moduleId) {
        if (!window.PhaseNavigationConfig || !PhaseNavigationConfig.isApp2627()) {
            return;
        }

        const activePhaseId = PhaseNavigationConfig.resolveActivePhaseId(moduleId);
        ['fase-1', 'fase-2', 'fase-3', 'fase-4'].forEach((phaseId) => {
            setupPhaseSubmenu(phaseId, activePhaseId);
        });
    }

    if (typeof SidebarManager !== 'undefined') {
        const originalInit = SidebarManager.prototype.init;
        SidebarManager.prototype.init = function () {
            originalInit.call(this);
            initPhaseSubmenus(this.moduleId);
        };
    }

    window.PhaseSidebar = { initPhaseSubmenus, setupPhaseSubmenu };
})();
