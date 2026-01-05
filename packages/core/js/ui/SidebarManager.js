/**
 * SidebarManager
 * 
 * Beheert alle sidebar-gerelateerde functionaliteit:
 * - Mobile menu open/close
 * - Week 2/3/4/5/6 submenu expand/collapse
 * - Nav link click handling (sluit sidebar op mobile)
 */

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
        this.setupHD09Submenu();
        this.setupOperationsProcesstrategieSubmenu();
        this.setupVraagvoorspellingDeel1Submenu();
        this.setupFase3Submenu();
    }

    /**
     * Setup mobile menu open/close functionaliteit
     */
    setupMobileMenu() {
        
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        if (!mobileMenuButton || !sidebar || !overlay) {
            
            return;
        }
        
        // Ensure sidebar is closed on mobile after navigation
        if (window.innerWidth < 1024) {

            // Remove lg:translate-x-0 if present (it might be overriding on mobile)
            sidebar.classList.remove('lg:translate-x-0');
            sidebar.classList.add('-translate-x-full');
            
            // Force transform via inline style as fallback
            const sidebarWidth = sidebar.offsetWidth || window.innerWidth;
            sidebar.style.transform = `translateX(-100%)`;
            
            overlay.classList.add('hidden');
            document.body.style.overflow = '';

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
            
            sidebar.classList.remove('-translate-x-full');
            // Remove inline transform to allow CSS classes to work
            sidebar.style.transform = '';
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent body scroll when sidebar is open
            
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

        // Wrap openSidebar to add logging and ensure it runs
        const wrappedOpenSidebar = (e) => {
            
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
     * Setup HD 09 submenu expand/collapse functionality
     */
    setupHD09Submenu() {
        const hd09NavItem = document.querySelector('.hd09-nav-item');
        if (!hd09NavItem) return;
        
        const hd09Link = hd09NavItem.querySelector('a');
        const subItemsContainer = document.getElementById('hd09-subitems-index') || document.getElementById('hd09-subitems');
        const chevron = document.getElementById('hd09-chevron-index') || document.getElementById('hd09-chevron');
        
        if (!hd09Link || !subItemsContainer || !chevron) return;
        
        // Check if we're on HD 09 page - if so, expand by default
        const isHD09Page = this.moduleId === 'hd09';
        if (isHD09Page) {
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
        hd09Link.addEventListener('click', (e) => {
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
    
    setupVraagvoorspellingDeel1Submenu() {
        // Try to find elements immediately first
        let navItem = document.querySelector('.vraagvoorspelling-deel1-nav-item');
        
        // If not found, try again after a short delay (for hash navigation cases)
        if (!navItem) {
            setTimeout(() => {
                navItem = document.querySelector('.vraagvoorspelling-deel1-nav-item');
                if (!navItem) {
                    return;
                }
                this._setupVraagvoorspellingDeel1SubmenuInternal(navItem);
            }, 50);
        } else {
            // Elements found immediately, setup right away
            this._setupVraagvoorspellingDeel1SubmenuInternal(navItem);
        }
    }
    
    _setupVraagvoorspellingDeel1SubmenuInternal(navItem) {
        const link = navItem.querySelector('a');
        const subItemsContainer = document.getElementById('vraagvoorspelling-deel1-submenu');
        const chevron = document.getElementById('vraagvoorspelling-deel1-chevron-index');
        
        if (!link || !subItemsContainer || !chevron) {
            return;
        }
        
        // Check if we're on Vraagvoorspelling Deel 1 page - if so, expand by default
        const isVraagvoorspellingDeel1Page = this.moduleId === 'vraagvoorspelling-deel1';
        if (isVraagvoorspellingDeel1Page) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Remove old event listeners if they exist (prevent duplicate listeners)
        // Use a data attribute to track if listeners are already attached
        if (chevron.dataset.listenersAttached === 'true') {
            return;
        }
        
        if (this.vraagvoorspellingDeel1Handlers) {
            if (this.vraagvoorspellingDeel1Handlers.chevronClick) {
                chevron.removeEventListener('click', this.vraagvoorspellingDeel1Handlers.chevronClick, true);
            }
            if (this.vraagvoorspellingDeel1Handlers.linkClick) {
                link.removeEventListener('click', this.vraagvoorspellingDeel1Handlers.linkClick, true);
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
                                   (target.id && target.id.includes('vraagvoorspelling-deel1-chevron')) ||
                                   (target.tagName === 'I' && target.classList && target.classList.contains('fa-chevron-down') && target.id === 'vraagvoorspelling-deel1-chevron-index');
            
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
        this.vraagvoorspellingDeel1Handlers = {
            chevronClick: chevronClickHandler,
            linkClick: linkClickHandler
        };
        
        chevron.addEventListener('click', chevronClickHandler, true); // Use capture phase to run before AppRouter
        link.addEventListener('click', linkClickHandler, true); // Use capture phase to run before AppRouter
        
        // Mark that listeners are attached
        chevron.dataset.listenersAttached = 'true';
    }
    
    setupFase3Submenu() {
        // Try to find elements immediately first
        let navItem = document.querySelector('.fase3-nav-item');
        
        // If not found, try again after a short delay (for hash navigation cases)
        if (!navItem) {
            setTimeout(() => {
                navItem = document.querySelector('.fase3-nav-item');
                if (!navItem) {
                    return;
                }
                this._setupFase3SubmenuInternal(navItem);
            }, 50);
        } else {
            // Elements found immediately, setup right away
            this._setupFase3SubmenuInternal(navItem);
        }
    }
    
    _setupFase3SubmenuInternal(navItem) {
        const link = navItem.querySelector('a');
        const subItemsContainer = document.getElementById('fase3-subitems-index');
        const chevron = document.getElementById('fase3-chevron-index');
        
        if (!link || !subItemsContainer || !chevron) {
            return;
        }
        
        // Check if we're on Fase3 page - if so, expand by default
        const isFase3Page = this.moduleId === 'fase3';
        if (isFase3Page) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        }
        
        // Remove old event listeners if they exist (prevent duplicate listeners)
        // Use a data attribute to track if listeners are already attached
        if (chevron.dataset.listenersAttached === 'true') {
            return;
        }
        
        if (this.fase3Handlers) {
            if (this.fase3Handlers.chevronClick) {
                chevron.removeEventListener('click', this.fase3Handlers.chevronClick, true);
            }
            if (this.fase3Handlers.linkClick) {
                link.removeEventListener('click', this.fase3Handlers.linkClick, true);
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
                                   (target.id && target.id.includes('fase3-chevron')) ||
                                   (target.tagName === 'I' && target.classList && target.classList.contains('fa-chevron-down') && target.id === 'fase3-chevron-index');
            
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
        this.fase3Handlers = {
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
