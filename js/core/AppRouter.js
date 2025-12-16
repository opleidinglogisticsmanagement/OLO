/**
 * AppRouter
 * 
 * Client-side router voor SPA functionaliteit
 * Laadt alleen content, niet de hele pagina
 * Sidebar en header blijven persistent
 */

class AppRouter {
    constructor() {
        this.currentPage = null;
        this.currentPageInstance = null;
        this.isNavigating = false;
        this.pageCache = new Map();
        
        // Route mapping
        this.routes = {
            'index.html': () => this.loadIndexPage(),
            'week1.html': () => this.loadWeekPage('week-1', 'Week1LessonPage'),
            'week2.html': () => this.loadWeekPage('week-2', 'Week2LessonPage'),
            'week3.html': () => this.loadWeekPage('week-3', 'Week3LessonPage'),
            'week4.html': () => this.loadWeekPage('week-4', 'Week4LessonPage'),
            'week5.html': () => this.loadWeekPage('week-5', 'Week5LessonPage'),
            'week6.html': () => this.loadWeekPage('week-6', 'Week6LessonPage'),
            'week7.html': () => this.loadWeekPage('week-7', 'Week7LessonPage'),
            'register.html': () => this.loadWeekPage('register', 'RegisterPage'),
            'afsluiting.html': () => this.loadWeekPage('afsluiting', 'AfsluitingLessonPage')
        };
    }

    /**
     * Initialiseer de router
     */
    init() {
        // Detect hard refresh en redirect naar index
        const isHardRefresh = (() => {
            // Moderne browsers: gebruik Performance Navigation API
            const navigationEntry = performance.getEntriesByType('navigation')[0];
            if (navigationEntry) {
                return navigationEntry.type === 'reload';
            }
            // Fallback voor oudere browsers: gebruik performance.navigation (deprecated maar werkt)
            if (performance.navigation) {
                return performance.navigation.type === 1; // TYPE_RELOAD
            }
            return false;
        })();
        
        // Als het een hard refresh is en we niet al op index.html zijn, redirect
        const currentPath = window.location.pathname;
        const isIndexPage = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/');
        
        if (isHardRefresh && !isIndexPage) {
            console.log('[AppRouter] 🔄 Hard refresh detected, redirecting to index.html');
            window.location.href = 'index.html';
            return; // Stop verdere initialisatie
        }
        
        console.log('[AppRouter] 🚀 Initializing router');
        console.log('[AppRouter] Current path:', window.location.pathname);
        console.log('[AppRouter] Available routes:', Object.keys(this.routes));
        
        // Intercepteer alle link clicks
        this.interceptLinks();
        console.log('[AppRouter] ✅ Link interception active');
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            console.log('[AppRouter] 🔙 Browser navigation (back/forward):', window.location.pathname);
            this.handleRoute(window.location.pathname);
        });
        
        // Load initial page
        console.log('[AppRouter] 📄 Loading initial page');
        this.handleRoute(window.location.pathname);
    }

    /**
     * Intercepteer alle navigatie links
     */
    interceptLinks() {
        document.addEventListener('click', (e) => {
            // Check if click is on a chevron icon (for sidebar submenu expansion)
            // Chevrons have IDs like 'week-2-chevron', 'week-3-chevron', etc.
            // or have class 'fa-chevron-down'
            const target = e.target;
            const isChevronElement = target.id && target.id.endsWith('-chevron') ||
                                    (target.tagName === 'I' && target.classList && target.classList.contains('fa-chevron-down')) ||
                                    (target.tagName === 'I' && target.id && target.id.endsWith('-chevron'));
            
            // Also check if the click is within a chevron element
            const chevronElement = target.closest('[id$="-chevron"]') || 
                                   (target.closest('i') && target.closest('i').classList && target.closest('i').classList.contains('fa-chevron-down'));
            
            if (isChevronElement || chevronElement) {
                // Don't intercept chevron clicks - let SidebarManager handle them
                return;
            }
            
            const link = e.target.closest('a[href]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Skip external links, anchors, and special links
            if (href.startsWith('http') && !href.includes(window.location.hostname) ||
                href.startsWith('mailto:') || 
                href.startsWith('tel:') ||
                (href.startsWith('#') && !href.includes('.html')) ||
                link.hasAttribute('download') ||
                link.hasAttribute('target') && link.getAttribute('target') === '_blank') {
                return; // Allow normal navigation
            }
            
            // Check if it's a route we handle
            let fileName = href.split('/').pop() || 'index.html';
            // Remove hash if present for route matching
            if (fileName.includes('#')) {
                fileName = fileName.split('#')[0];
            }
            
            if (this.routes[fileName] || fileName === 'index.html') {
                console.log('[AppRouter] ✅ Link intercepted:', href, 'File:', fileName);
                e.preventDefault();
                e.stopPropagation();
                
                // Handle hash anchors
                if (href.includes('#')) {
                    const hashIndex = href.indexOf('#');
                    const path = href.substring(0, hashIndex);
                    const hash = href.substring(hashIndex + 1);
                    this.navigate(path || fileName, hash);
                } else {
                    this.navigate(href || fileName);
                }
            } else {
                console.log('[AppRouter] ⏭️ Link NOT intercepted (no route handler):', href, 'File:', fileName);
            }
        }, true); // Use capture phase
    }

    /**
     * Navigeer naar een nieuwe route
     */
    async navigate(path, hash = null) {
        if (this.isNavigating) return;
        
        this.isNavigating = true;
        
        try {
            // Normalize path
            let normalizedPath = path;
            if (!normalizedPath.startsWith('/') && !normalizedPath.startsWith('http')) {
                // Relative path
                const currentDir = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                normalizedPath = currentDir + normalizedPath;
            }
            
            // Update URL without reload
            const newUrl = normalizedPath + (hash ? '#' + hash : '');
            window.history.pushState({}, '', newUrl);
            
            await this.handleRoute(normalizedPath, hash);
        } catch (error) {
            console.error('[AppRouter] Navigation error:', error);
            // Fallback to normal navigation
            window.location.href = path + (hash ? '#' + hash : '');
        } finally {
            this.isNavigating = false;
        }
    }

    /**
     * Handle route change
     */
    async handleRoute(path, hash = null) {
        let fileName = path.split('/').pop() || 'index.html';
        // Remove query params and hash
        fileName = fileName.split('?')[0].split('#')[0];
        
        console.log('[AppRouter] 🗺️ Handling route:', path, 'File:', fileName, 'Hash:', hash);
        
        const routeHandler = this.routes[fileName];
        
        if (!routeHandler) {
            console.warn(`[AppRouter] ⚠️ No route handler for: ${fileName}`);
            console.warn(`[AppRouter] Falling back to normal navigation`);
            // Fallback to normal navigation
            window.location.href = path;
            return;
        }
        
        // Show loading state
        this.showLoadingState();
        
        try {
            console.log('[AppRouter] 🔄 Calling route handler for:', fileName);
            await routeHandler();
            console.log('[AppRouter] ✅ Route handler completed');
            
            // Handle hash after content is loaded
            if (hash) {
                setTimeout(() => {
                    this.scrollToHash('#' + hash);
                }, 300);
            }
            
            // Update active state in sidebar
            this.updateSidebarActiveState(fileName);
            
            // Update breadcrumbs
            this.updateBreadcrumbs();
            
        } catch (error) {
            console.error(`[AppRouter] ❌ Error loading route ${fileName}:`, error);
            this.showErrorState(error);
        }
    }

    /**
     * Laad index pagina
     */
    async loadIndexPage() {
        // For index.html, we need to fetch the HTML and extract the main content
        const response = await fetch('index.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const mainContent = doc.querySelector('#main-content') || doc.querySelector('main');
        if (mainContent) {
            const contentContainer = document.querySelector('#main-content') || document.querySelector('main');
            if (contentContainer) {
                contentContainer.innerHTML = mainContent.innerHTML;
            }
        }
        
        // Re-initialize any scripts needed for index page
        this.attachIndexPageScripts();
    }

    /**
     * Laad week pagina
     */
    async loadWeekPage(moduleId, pageClassName) {
        console.log('[AppRouter] 📚 Loading week page:', moduleId, pageClassName);
        
        // Check cache first
        const cacheKey = `${moduleId}-${pageClassName}`;
        if (this.pageCache.has(cacheKey)) {
            console.log('[AppRouter] 💾 Using cached content');
            const cachedContent = this.pageCache.get(cacheKey);
            this.updateContent(cachedContent);
            return;
        }
        
        // Load page class dynamically
        // Wait a bit if class is not immediately available (scripts might still be loading)
        let PageClass = window[pageClassName];
        console.log(`[AppRouter] 🔍 Looking for ${pageClassName}, available:`, !!PageClass);
        if (!PageClass) {
            console.warn(`[AppRouter] ⚠️ Page class ${pageClassName} not immediately available, waiting...`);
            const available = Object.keys(window).filter(k => k.includes('Page'));
            console.log('[AppRouter] Available window properties:', available);
            console.log('[AppRouter] All window properties with "Week":', Object.keys(window).filter(k => k.includes('Week')));
            
            // Wait up to 2 seconds for the class to become available
            for (let i = 0; i < 20; i++) {
                await new Promise(resolve => setTimeout(resolve, 100));
                PageClass = window[pageClassName];
                if (PageClass) {
                    console.log(`[AppRouter] ✅ Page class ${pageClassName} found after ${(i + 1) * 100}ms`);
                    break;
                }
                // Log available classes every 5 attempts
                if ((i + 1) % 5 === 0) {
                    const currentAvailable = Object.keys(window).filter(k => k.includes('Page'));
                    console.log(`[AppRouter] Still waiting... (${(i + 1) * 100}ms) Available:`, currentAvailable);
                }
            }
            
            if (!PageClass) {
                console.error(`[AppRouter] ❌ Page class ${pageClassName} not found after waiting`);
                const finalAvailable = Object.keys(window).filter(k => k.includes('Page'));
                console.error('[AppRouter] Final available window properties:', finalAvailable);
                console.error('[AppRouter] All window properties:', Object.keys(window).slice(0, 50)); // First 50 to avoid spam
                throw new Error(`Page class ${pageClassName} not found`);
            }
        } else {
            console.log(`[AppRouter] ✅ Page class ${pageClassName} found immediately`);
        }
        
        console.log('[AppRouter] ✅ Page class found:', pageClassName);
        
        // Create page instance
        const pageInstance = new PageClass();
        console.log('[AppRouter] ✅ Page instance created');
        
        // Load content (async)
        if (pageInstance.loadContent) {
            console.log('[AppRouter] ⏳ Loading content...');
            await pageInstance.loadContent();
            console.log('[AppRouter] ✅ Content loaded');
        }
        
        // Render only content (not layout)
        // Check if renderContent exists, otherwise extract from full render
        let content;
        if (pageInstance.renderContent) {
            console.log('[AppRouter] 🎨 Using renderContent() method');
            content = pageInstance.renderContent();
        } else {
            console.log('[AppRouter] ⚠️ renderContent() not found, extracting from render()');
            // Fallback: extract main-content from full render
            const fullRender = pageInstance.render();
            const parser = new DOMParser();
            const doc = parser.parseFromString(fullRender, 'text/html');
            const mainContent = doc.querySelector('#main-content') || doc.querySelector('main');
            if (mainContent) {
                // Extract inner HTML, not the main tag itself
                content = mainContent.innerHTML;
                console.log('[AppRouter] ✅ Extracted content from main-content element');
            } else {
                console.warn('[AppRouter] ⚠️ No main-content found in render(), using full render');
                content = fullRender;
            }
        }
        
        console.log('[AppRouter] 📝 Content rendered, length:', content.length);
        
        // Update DOM - replace innerHTML of main-content, not the element itself
        this.updateContent(content);
        
        // Attach event listeners (but skip layout managers - they're already initialized)
        console.log('[AppRouter] 🔌 Attaching content listeners');
        // Always call attachContentListeners to initialize managers
        // It will also call pageInstance.attachEventListeners() if it exists
        this.attachContentListeners(pageInstance);
        
        // Cache the content
        this.pageCache.set(cacheKey, content);
        console.log('[AppRouter] 💾 Content cached');
        
        // Store instance for cleanup
        this.currentPageInstance = pageInstance;
    }

    /**
     * Update alleen het content gebied
     */
    updateContent(html) {
        const contentContainer = document.querySelector('#main-content');
        if (!contentContainer) {
            console.error('[AppRouter] ❌ Content container not found');
            return;
        }
        
        console.log('[AppRouter] 📝 Updating content');
        console.log('[AppRouter] Content HTML length:', html.length);
        
        // Ensure background color is set before fade to prevent white flash
        const computedStyle = window.getComputedStyle(contentContainer);
        const currentBg = computedStyle.backgroundColor;
        const isDark = document.documentElement.classList.contains('dark');
        const targetBg = isDark ? 'rgb(17, 24, 39)' : 'rgb(249, 250, 251)';
        
        // Set background color explicitly if not already set
        if (!currentBg || currentBg === 'rgba(0, 0, 0, 0)' || currentBg === 'transparent') {
            contentContainer.style.backgroundColor = targetBg;
        }
        
        // Ensure minimum height to prevent layout shift
        if (!contentContainer.style.minHeight) {
            contentContainer.style.minHeight = '100vh';
        }
        
        // Fade out with longer duration for smoother transition
        contentContainer.style.transition = 'opacity 0.2s ease';
        contentContainer.style.opacity = '0';
        console.log('[AppRouter] ⬇️ Fade out started');
        
        // Wait for fade-out to complete before replacing content
        setTimeout(() => {
            console.log('[AppRouter] 🔄 Replacing content HTML');
            
            // Replace content while invisible
            contentContainer.innerHTML = html;
            
            // Ensure background persists after content replacement
            contentContainer.style.backgroundColor = targetBg;
            
            // Scroll to top immediately (while invisible)
            const scrollContainer = contentContainer.closest('.overflow-y-auto') || window;
            if (scrollContainer.scrollTo) {
                scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
            }
            
            // Force reflow to ensure new content is rendered
            void contentContainer.offsetHeight;
            
            // Fade in with slight delay to ensure content is ready
            setTimeout(() => {
                console.log('[AppRouter] ⬆️ Fade in started');
                contentContainer.style.opacity = '1';
                
                // Clean up inline styles after transition (let CSS handle it)
                setTimeout(() => {
                    // Keep background color but remove transition override
                    contentContainer.style.transition = '';
                }, 200);
            }, 10);
        }, 200); // Wait for fade-out to complete
    }

    /**
     * Toon loading state
     */
    showLoadingState() {
        console.log('[AppRouter] ⏳ Showing loading state');
        const contentContainer = document.querySelector('#main-content');
        if (contentContainer) {
            // Ensure container has background and opacity
            contentContainer.style.opacity = '1';
            contentContainer.style.backgroundColor = contentContainer.style.backgroundColor || 'rgb(249, 250, 251)'; // bg-gray-50
            contentContainer.innerHTML = `
                <div class="flex items-center justify-center min-h-[400px]">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p class="text-gray-600 dark:text-gray-300">Laden...</p>
                    </div>
                </div>
            `;
        } else {
            console.error('[AppRouter] ❌ Cannot show loading state - container not found');
        }
    }

    /**
     * Toon error state
     */
    showErrorState(error) {
        const contentContainer = document.querySelector('#main-content');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-exclamation-triangle text-red-600 mt-1"></i>
                        <div>
                            <h3 class="font-semibold text-red-900 dark:text-red-200 mb-1">Fout bij laden</h3>
                            <p class="text-red-800 dark:text-red-300 text-sm">${error.message || 'Er is een fout opgetreden bij het laden van de pagina.'}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Scroll naar hash anchor
     */
    scrollToHash(hash) {
        if (!hash) return;
        
        const element = document.querySelector(hash);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Update active state in sidebar
     */
    updateSidebarActiveState(fileName) {
        // Remove all active states
        document.querySelectorAll('#sidebar a').forEach(link => {
            link.classList.remove('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-700', 'dark:text-blue-300');
            const icon = link.querySelector('.w-8, .w-10');
            if (icon) {
                icon.classList.remove('bg-blue-100', 'dark:bg-blue-800');
                icon.classList.add('bg-gray-100', 'dark:bg-gray-700');
            }
        });
        
        // Find and activate current link
        const currentLink = document.querySelector(`#sidebar a[href="${fileName}"]`);
        if (currentLink) {
            currentLink.classList.add('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-700', 'dark:text-blue-300');
            const icon = currentLink.querySelector('.w-8, .w-10');
            if (icon) {
                icon.classList.remove('bg-gray-100', 'dark:bg-gray-700');
                icon.classList.add('bg-blue-100', 'dark:bg-blue-800');
            }
        }
    }

    /**
     * Attach content-specific event listeners
     * Note: Sidebar and header are persistent, but their event listeners need to be re-attached
     * because each page creates a new manager instance
     */
    attachContentListeners(pageInstance) {
        // Re-initialize all managers
        // Even though sidebar/header are persistent, their event listeners need to be re-attached
        // because each page instance creates new manager instances
        
        if (pageInstance.sidebarManager) {
            console.log('[AppRouter] 🔌 Re-initializing SidebarManager');
            pageInstance.sidebarManager.init();
        }
        if (pageInstance.headerManager) {
            console.log('[AppRouter] 🔌 Re-initializing HeaderManager');
            pageInstance.headerManager.init();
        }
        if (pageInstance.scrollManager) {
            pageInstance.scrollManager.init();
        }
        if (pageInstance.imageModalManager) {
            pageInstance.imageModalManager.init();
        }
        if (pageInstance.interactiveManager) {
            pageInstance.interactiveManager.init();
        }
        if (pageInstance.videoManager) {
            pageInstance.videoManager.init();
        }
        if (pageInstance.tableCopyManager) {
            pageInstance.tableCopyManager.init();
        }
        
        // Call page-specific attachEventListeners to attach content-specific listeners
        // This is important for pages like RegisterPage that need to populate content after rendering
        if (pageInstance.attachEventListeners) {
            pageInstance.attachEventListeners();
        }
    }

    /**
     * Attach scripts for index page
     */
    attachIndexPageScripts() {
        // Re-initialize search if needed
        if (window.SearchService && typeof setupSearch === 'function') {
            setupSearch();
        }
    }
    
    /**
     * Update breadcrumbs in header
     */
    updateBreadcrumbs() {
        const breadcrumbSpan = document.querySelector('#main-header nav[aria-label="Breadcrumb"] span');
        if (breadcrumbSpan && this.currentPageInstance) {
            const title = this.currentPageInstance.moduleTitle || 'Pagina';
            breadcrumbSpan.textContent = title;
        } else if (breadcrumbSpan) {
            // For index page
            breadcrumbSpan.textContent = 'Start';
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppRouter;
} else {
    window.AppRouter = AppRouter;
}

