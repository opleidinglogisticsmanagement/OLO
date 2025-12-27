/**
 * SidebarManager
 * 
 * Beheert alle sidebar-gerelateerde functionaliteit:
 * - Mobile menu open/close
 * - Week 2/3/4/5/6 submenu expand/collapse
 * - Nav link click handling (sluit sidebar op mobile)
 */

// #region agent log
(function(){try{const _d={location:'SidebarManager.js:1',message:'SidebarManager.js loading started',data:{hasPath:typeof path!=='undefined',hasModule:typeof module!=='undefined',hasRequire:typeof require!=='function'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(_d)}).catch(()=>{});}catch(e){}})();
// #endregion

class SidebarManager {
    constructor(moduleId) {
        this.moduleId = moduleId;
        this.mobileMenuHandlers = {
            openSidebar: null,
            closeSidebar: null,
            navLinkClose: []
        };
    }

    /**
     * Initialiseer alle sidebar functionaliteit
     * Moet worden aangeroepen nadat de DOM geladen is
     */
    init() {
        this.setupMobileMenu();
        this.setupWeek2Submenu();
        this.setupWeek3Submenu();
        this.setupWeek4Submenu();
        this.setupWeek5Submenu();
        this.setupWeek6Submenu();
        this.setupOperationsProcesstrategieSubmenu();
    }

    /**
     * Setup mobile menu open/close functionaliteit
     */
    setupMobileMenu() {
        // #region agent log
        console.log('[SidebarManager] setupMobileMenu called', {moduleId:this.moduleId,windowWidth:window.innerWidth});
        // #endregion
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        // #region agent log
        console.log('[SidebarManager] DOM elements check', {mobileMenuButton:!!mobileMenuButton,sidebar:!!sidebar,overlay:!!overlay,sidebarClasses:sidebar?Array.from(sidebar.classList):null,hasTranslateX:sidebar?.classList.contains('-translate-x-full'),overlayHidden:overlay?.classList.contains('hidden')});
        // #endregion

        if (!mobileMenuButton || !sidebar || !overlay) {
            // #region agent log
            console.warn('[SidebarManager] Early return - missing elements', {mobileMenuButton:!!mobileMenuButton,sidebar:!!sidebar,overlay:!!overlay});
            // #endregion
            return;
        }
        
        // Ensure sidebar is closed on mobile after navigation
        if (window.innerWidth < 1024) {
            // #region agent log
            const beforeTransform = window.getComputedStyle(sidebar).transform;
            const beforeDisplay = window.getComputedStyle(sidebar).display;
            const beforeVisibility = window.getComputedStyle(sidebar).visibility;
            const beforeClasses = Array.from(sidebar.classList);
            console.log('[SidebarManager] Ensuring sidebar is closed on mobile', {
                currentHasTranslateX:sidebar.classList.contains('-translate-x-full'),
                hasLgTranslateX0:sidebar.classList.contains('lg:translate-x-0'),
                computedTransform:beforeTransform,
                computedDisplay:beforeDisplay,
                computedVisibility:beforeVisibility,
                sidebarRect:sidebar.getBoundingClientRect(),
                allClasses:beforeClasses
            });
            // #endregion
            
            // Remove lg:translate-x-0 if present (it might be overriding on mobile)
            sidebar.classList.remove('lg:translate-x-0');
            sidebar.classList.add('-translate-x-full');
            
            // Force transform via inline style as fallback
            const sidebarWidth = sidebar.offsetWidth || window.innerWidth;
            sidebar.style.transform = `translateX(-100%)`;
            
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
            
            // #region agent log
            const afterTransform = window.getComputedStyle(sidebar).transform;
            const afterRect = sidebar.getBoundingClientRect();
            console.log('[SidebarManager] After closing sidebar', {
                hasTranslateX:sidebar.classList.contains('-translate-x-full'),
                hasLgTranslateX0:sidebar.classList.contains('lg:translate-x-0'),
                computedTransform:afterTransform,
                inlineStyle:sidebar.style.transform,
                sidebarRect:afterRect,
                sidebarLeft:afterRect.left
            });
            // #endregion
        }

        // Remove old event listeners if they exist (prevent duplicate listeners)
        if (this.mobileMenuHandlers.openSidebar) {
            mobileMenuButton.removeEventListener('click', this.mobileMenuHandlers.openSidebar);
        }
        if (this.mobileMenuHandlers.closeSidebar) {
            overlay.removeEventListener('click', this.mobileMenuHandlers.closeSidebar);
        }
        // Remove old nav link listeners
        this.mobileMenuHandlers.navLinkClose.forEach(({link, handler}) => {
            link.removeEventListener('click', handler);
        });
        this.mobileMenuHandlers.navLinkClose = [];

        const openSidebar = () => {
            // #region agent log
            console.log('[SidebarManager] openSidebar called', {sidebarClassesBefore:Array.from(sidebar.classList),overlayClassesBefore:Array.from(overlay.classList)});
            // #endregion
            sidebar.classList.remove('-translate-x-full');
            // Remove inline transform to allow CSS classes to work
            sidebar.style.transform = '';
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent body scroll when sidebar is open
            // #region agent log
            console.log('[SidebarManager] openSidebar after', {sidebarClassesAfter:Array.from(sidebar.classList),overlayClassesAfter:Array.from(overlay.classList),hasTranslateX:sidebar.classList.contains('-translate-x-full'),computedTransform:window.getComputedStyle(sidebar).transform,inlineStyle:sidebar.style.transform});
            // #endregion
        };

        const closeSidebar = () => {
            sidebar.classList.remove('lg:translate-x-0'); // Remove desktop class if present
            sidebar.classList.add('-translate-x-full');
            // Force transform via inline style as fallback
            if (window.innerWidth < 1024) {
                sidebar.style.transform = `translateX(-100%)`;
            }
            overlay.classList.add('hidden');
            document.body.style.overflow = ''; // Restore body scroll
        };

        // Store handlers for cleanup
        this.mobileMenuHandlers.openSidebar = openSidebar;
        this.mobileMenuHandlers.closeSidebar = closeSidebar;

        // #region agent log
        console.log('[SidebarManager] Attaching event listeners', {mobileMenuButtonExists:!!mobileMenuButton,overlayExists:!!overlay});
        // #endregion
        
        // Wrap openSidebar to add logging and ensure it runs
        const wrappedOpenSidebar = (e) => {
            // #region agent log
            console.log('[SidebarManager] mobileMenuButton clicked!', {event:e,button:mobileMenuButton,target:e.target,currentTarget:e.currentTarget});
            // #endregion
            e.stopPropagation(); // Prevent event from bubbling to AppRouter
            openSidebar();
        };
        
        // Use capture phase to run BEFORE AppRouter's click handler
        mobileMenuButton.addEventListener('click', wrappedOpenSidebar, true);
        this.mobileMenuHandlers.openSidebar = wrappedOpenSidebar;
        
        // Also add a direct click test
        mobileMenuButton.onclick = (e) => {
            console.log('[SidebarManager] Direct onclick handler triggered!', e);
        }; // Update stored handler
        
        overlay.addEventListener('click', closeSidebar);
        
        // #region agent log
        console.log('[SidebarManager] Event listeners attached', {hasClickHandler:mobileMenuButton.onclick !== null});
        // #endregion

        // Close button in sidebar
        const sidebarCloseButton = document.getElementById('sidebar-close-button');
        if (sidebarCloseButton) {
            if (this.mobileMenuHandlers.sidebarCloseButton) {
                sidebarCloseButton.removeEventListener('click', this.mobileMenuHandlers.sidebarCloseButton);
            }
            this.mobileMenuHandlers.sidebarCloseButton = closeSidebar;
            sidebarCloseButton.addEventListener('click', closeSidebar);
        }

        // Close sidebar when clicking a navigation link on mobile
        const navLinks = sidebar.querySelectorAll('a');
        navLinks.forEach(link => {
            const navLinkHandler = () => {
                // Only close on mobile (when sidebar is overlay)
                if (window.innerWidth < 1024) {
                    closeSidebar();
                }
            };
            this.mobileMenuHandlers.navLinkClose.push({link, handler: navLinkHandler});
            link.addEventListener('click', navLinkHandler);
        });
    }

    /**
     * Setup Week 2 submenu expand/collapse functionality
     */
    setupWeek2Submenu() {
        const week2NavItem = document.querySelector('.week-2-nav-item');
        if (!week2NavItem) return;
        
        const week2Link = week2NavItem.querySelector('a');
        const subItemsContainer = document.getElementById('week-2-subitems');
        const chevron = document.getElementById('week-2-chevron');
        
        if (!week2Link || !subItemsContainer || !chevron) return;
        
        // Check if we're on Week 2 page - if so, expand by default
        const isWeek2Page = this.moduleId === 'week-2';
        if (isWeek2Page) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Toggle submenu only when clicking the chevron icon
        // Use capture phase to ensure this runs before AppRouter's link interceptor
        chevron.addEventListener('click', (e) => {
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
        }, true); // Use capture phase to run before AppRouter
        
        // Handle chevron clicks on the link itself (in capture phase to run before AppRouter)
        week2Link.addEventListener('click', (e) => {
            // Check if click is on chevron or within chevron
            const target = e.target;
            const isChevronClick = target === chevron || 
                                   chevron.contains(target) ||
                                   (target.id && target.id.endsWith('-chevron')) ||
                                   (target.tagName === 'I' && target.classList && target.classList.contains('fa-chevron-down'));
            
            if (isChevronClick) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle submenu
                const isHidden = subItemsContainer.classList.contains('hidden');
                if (isHidden) {
                    subItemsContainer.classList.remove('hidden');
                    chevron.classList.add('rotate-180');
                } else {
                    subItemsContainer.classList.add('hidden');
                    chevron.classList.remove('rotate-180');
                }
            }
            // Otherwise, allow normal navigation (AppRouter will handle it)
        }, true); // Use capture phase to run before AppRouter
    }

    /**
     * Setup Week 3 submenu expand/collapse functionality
     */
    setupWeek3Submenu() {
        const week3NavItem = document.querySelector('.week-3-nav-item');
        if (!week3NavItem) return;
        
        const week3Link = week3NavItem.querySelector('a');
        const subItemsContainer = document.getElementById('week-3-subitems');
        const chevron = document.getElementById('week-3-chevron');
        
        if (!week3Link || !subItemsContainer || !chevron) return;
        
        // Check if we're on Week 3 page - if so, expand by default
        const isWeek3Page = this.moduleId === 'week-3';
        if (isWeek3Page) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Toggle submenu only when clicking the chevron icon
        // Use capture phase to ensure this runs before AppRouter's link interceptor
        chevron.addEventListener('click', (e) => {
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
        }, true); // Use capture phase to run before AppRouter
        
        // Handle chevron clicks on the link itself (in capture phase to run before AppRouter)
        week3Link.addEventListener('click', (e) => {
            // Check if click is on chevron or within chevron
            const isChevronClick = e.target === chevron || 
                                   chevron.contains(e.target) ||
                                   (e.target.id && e.target.id.endsWith('-chevron')) ||
                                   (e.target.tagName === 'I' && e.target.classList && e.target.classList.contains('fa-chevron-down'));
            
            if (isChevronClick) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle submenu
                const isHidden = subItemsContainer.classList.contains('hidden');
                if (isHidden) {
                    subItemsContainer.classList.remove('hidden');
                    chevron.classList.add('rotate-180');
                } else {
                    subItemsContainer.classList.add('hidden');
                    chevron.classList.remove('rotate-180');
                }
            }
            // Otherwise, allow normal navigation (AppRouter will handle it)
        }, true); // Use capture phase to run before AppRouter
    }

    /**
     * Setup Week 4 submenu expand/collapse functionality
     */
    setupWeek4Submenu() {
        const week4NavItem = document.querySelector('.week-4-nav-item');
        if (!week4NavItem) return;
        
        const week4Link = week4NavItem.querySelector('a');
        const subItemsContainer = document.getElementById('week-4-subitems');
        const chevron = document.getElementById('week-4-chevron');
        
        if (!week4Link || !subItemsContainer || !chevron) return;
        
        // Check if we're on Week 4 page - if so, expand by default
        const isWeek4Page = this.moduleId === 'week-4';
        if (isWeek4Page) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Toggle submenu only when clicking the chevron icon
        // Use capture phase to ensure this runs before AppRouter's link interceptor
        chevron.addEventListener('click', (e) => {
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
        }, true); // Use capture phase to run before AppRouter
        
        // Handle chevron clicks on the link itself (in capture phase to run before AppRouter)
        week4Link.addEventListener('click', (e) => {
            // Check if click is on chevron or within chevron
            const isChevronClick = e.target === chevron || 
                                   chevron.contains(e.target) ||
                                   (e.target.id && e.target.id.endsWith('-chevron')) ||
                                   (e.target.tagName === 'I' && e.target.classList && e.target.classList.contains('fa-chevron-down'));
            
            if (isChevronClick) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle submenu
                const isHidden = subItemsContainer.classList.contains('hidden');
                if (isHidden) {
                    subItemsContainer.classList.remove('hidden');
                    chevron.classList.add('rotate-180');
                } else {
                    subItemsContainer.classList.add('hidden');
                    chevron.classList.remove('rotate-180');
                }
            }
            // Otherwise, allow normal navigation (AppRouter will handle it)
        }, true); // Use capture phase to run before AppRouter
    }

    /**
     * Setup Week 5 submenu expand/collapse functionality
     */
    setupWeek5Submenu() {
        const week5NavItem = document.querySelector('.week-5-nav-item');
        if (!week5NavItem) return;
        
        const week5Link = week5NavItem.querySelector('a');
        const subItemsContainer = document.getElementById('week-5-subitems');
        const chevron = document.getElementById('week-5-chevron');
        
        if (!week5Link || !subItemsContainer || !chevron) return;
        
        // Check if we're on Week 5 page - if so, expand by default
        const isWeek5Page = this.moduleId === 'week-5';
        if (isWeek5Page) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Toggle submenu only when clicking the chevron icon
        // Use capture phase to ensure this runs before AppRouter's link interceptor
        chevron.addEventListener('click', (e) => {
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
        }, true); // Use capture phase to run before AppRouter
        
        // Handle chevron clicks on the link itself (in capture phase to run before AppRouter)
        week5Link.addEventListener('click', (e) => {
            // Check if click is on chevron or within chevron
            const isChevronClick = e.target === chevron || 
                                   chevron.contains(e.target) ||
                                   (e.target.id && e.target.id.endsWith('-chevron')) ||
                                   (e.target.tagName === 'I' && e.target.classList && e.target.classList.contains('fa-chevron-down'));
            
            if (isChevronClick) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle submenu
                const isHidden = subItemsContainer.classList.contains('hidden');
                if (isHidden) {
                    subItemsContainer.classList.remove('hidden');
                    chevron.classList.add('rotate-180');
                } else {
                    subItemsContainer.classList.add('hidden');
                    chevron.classList.remove('rotate-180');
                }
            }
            // Otherwise, allow normal navigation (AppRouter will handle it)
        }, true); // Use capture phase to run before AppRouter
    }

    /**
     * Setup Week 6 submenu expand/collapse functionality
     */
    setupWeek6Submenu() {
        const week6NavItem = document.querySelector('.week-6-nav-item');
        if (!week6NavItem) return;
        
        const week6Link = week6NavItem.querySelector('a');
        const subItemsContainer = document.getElementById('week-6-subitems');
        const chevron = document.getElementById('week-6-chevron');
        
        if (!week6Link || !subItemsContainer || !chevron) return;
        
        // Check if we're on Week 6 page - if so, expand by default
        const isWeek6Page = this.moduleId === 'week-6';
        if (isWeek6Page) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Toggle submenu only when clicking the chevron icon
        // Use capture phase to ensure this runs before AppRouter's link interceptor
        chevron.addEventListener('click', (e) => {
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
        }, true); // Use capture phase to run before AppRouter
        
        // Handle chevron clicks on the link itself (in capture phase to run before AppRouter)
        week6Link.addEventListener('click', (e) => {
            // Check if click is on chevron or within chevron
            const isChevronClick = e.target === chevron || 
                                   chevron.contains(e.target) ||
                                   (e.target.id && e.target.id.endsWith('-chevron')) ||
                                   (e.target.tagName === 'I' && e.target.classList && e.target.classList.contains('fa-chevron-down'));
            
            if (isChevronClick) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle submenu
                const isHidden = subItemsContainer.classList.contains('hidden');
                if (isHidden) {
                    subItemsContainer.classList.remove('hidden');
                    chevron.classList.add('rotate-180');
                } else {
                    subItemsContainer.classList.add('hidden');
                    chevron.classList.remove('rotate-180');
                }
            }
            // Otherwise, allow normal navigation (AppRouter will handle it)
        }, true); // Use capture phase to run before AppRouter
    }

    /**
     * Setup Operations Processtrategie submenu expand/collapse functionality
     */
    setupOperationsProcesstrategieSubmenu() {
        // Try to find elements immediately first
        let navItem = document.querySelector('.operations-processtrategie-nav-item');
        
        // If not found, try again after a short delay (for hash navigation cases)
        if (!navItem) {
            setTimeout(() => {
                navItem = document.querySelector('.operations-processtrategie-nav-item');
                if (!navItem) {
                    return;
                }
                this._setupOperationsProcesstrategieSubmenuInternal(navItem);
            }, 50);
        } else {
            // Elements found immediately, setup right away
            this._setupOperationsProcesstrategieSubmenuInternal(navItem);
        }
    }
    
    _setupOperationsProcesstrategieSubmenuInternal(navItem) {
        const link = navItem.querySelector('a');
        const subItemsContainer = document.getElementById('operations-processtrategie-submenu');
        const chevron = document.getElementById('operations-processtrategie-chevron-index');
        
        if (!link || !subItemsContainer || !chevron) {
            return;
        }
        
        // Check if we're on Operations Processtrategie page - if so, expand by default
        const isOperationsProcesstrategiePage = this.moduleId === 'operations-processtrategie';
        if (isOperationsProcesstrategiePage) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Remove old event listeners if they exist (prevent duplicate listeners)
        // Use a data attribute to track if listeners are already attached
        if (chevron.dataset.listenersAttached === 'true') {
            return;
        }
        
        if (this.operationsProcesstrategieHandlers) {
            if (this.operationsProcesstrategieHandlers.chevronClick) {
                chevron.removeEventListener('click', this.operationsProcesstrategieHandlers.chevronClick, true);
            }
            if (this.operationsProcesstrategieHandlers.linkClick) {
                link.removeEventListener('click', this.operationsProcesstrategieHandlers.linkClick, true);
            }
        }
        
        // Toggle submenu only when clicking the chevron icon
        // Use capture phase to ensure this runs before AppRouter's link interceptor
        const chevronClickHandler = (e) => {
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
        
        // Handle chevron clicks on the link itself (in capture phase to run before AppRouter)
        const linkClickHandler = (e) => {
            // Check if click is on chevron or within chevron
            const target = e.target;
            const isChevronClick = target === chevron || 
                                   chevron.contains(target) ||
                                   (target.id && target.id.includes('operations-processtrategie-chevron')) ||
                                   (target.tagName === 'I' && target.classList && target.classList.contains('fa-chevron-down') && target.id === 'operations-processtrategie-chevron-index');
            
            if (isChevronClick) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle submenu
                const isHidden = subItemsContainer.classList.contains('hidden');
                if (isHidden) {
                    subItemsContainer.classList.remove('hidden');
                    chevron.classList.add('rotate-180');
                } else {
                    subItemsContainer.classList.add('hidden');
                    chevron.classList.remove('rotate-180');
                }
            }
            // Otherwise, allow normal navigation (AppRouter will handle it)
        };
        
        // Store handlers for cleanup
        this.operationsProcesstrategieHandlers = {
            chevronClick: chevronClickHandler,
            linkClick: linkClickHandler
        };
        
        chevron.addEventListener('click', chevronClickHandler, true); // Use capture phase to run before AppRouter
        link.addEventListener('click', linkClickHandler, true); // Use capture phase to run before AppRouter
        
        // Mark that listeners are attached
        chevron.dataset.listenersAttached = 'true';
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidebarManager;
} else {
    window.SidebarManager = SidebarManager;
}
