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
    }

    /**
     * Setup mobile menu open/close functionaliteit
     */
    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        if (!mobileMenuButton || !sidebar || !overlay) return;

        const openSidebar = () => {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent body scroll when sidebar is open
        };

        const closeSidebar = () => {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
            document.body.style.overflow = ''; // Restore body scroll
        };

        mobileMenuButton.addEventListener('click', openSidebar);
        overlay.addEventListener('click', closeSidebar);

        // Close button in sidebar
        const sidebarCloseButton = document.getElementById('sidebar-close-button');
        if (sidebarCloseButton) {
            sidebarCloseButton.addEventListener('click', closeSidebar);
        }

        // Close sidebar when clicking a navigation link on mobile
        const navLinks = sidebar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Only close on mobile (when sidebar is overlay)
                if (window.innerWidth < 1024) {
                    closeSidebar();
                }
            });
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
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidebarManager;
} else {
    window.SidebarManager = SidebarManager;
}
