// @ts-nocheck
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
            if (!link) {
                return;
            }
            
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
            
            // Check if it's a known route or can be dynamically detected
            const isKnownRoute = this.routes[fileName] || fileName === 'index.html';
            const detectedClassName = this.detectPageClassName(fileName);
            const canDetectDynamically = detectedClassName !== null;
            
            if (isKnownRoute || canDetectDynamically) {
                console.log('[AppRouter] ✅ Link intercepted:', href, 'File:', fileName, 'Known route:', isKnownRoute, 'Can detect dynamically:', canDetectDynamically);
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
        
        if (this.isNavigating) {
            return;
        }
        
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
     * Detect page class name from file name
     * Examples:
     * - vraagvoorspelling-deel1.html -> VraagvoorspellingDeel1LessonPage
     * - operations-processtrategie.html -> OperationsProcesstrategieLessonPage
     * - week-1.html -> Week1LessonPage (already handled by routes)
     */
    detectPageClassName(fileName) {
        
        // Remove .html extension
        const baseName = fileName.replace('.html', '');
        
        // Skip if it's index.html or already in routes
        if (baseName === 'index' || this.routes[fileName]) {
            return null;
        }
        
        // Convert kebab-case to PascalCase and append LessonPage
        // vraagvoorspelling-deel1 -> VraagvoorspellingDeel1LessonPage
        const parts = baseName.split('-');
        const pascalCase = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
        const pageClassName = pascalCase + 'LessonPage';
        
        console.log(`[AppRouter] 🔍 Detected page class name: ${pageClassName} from ${fileName}`);
        return pageClassName;
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
            
            // Try to detect if this is a lesson page by checking the file name pattern
            // For example: vraagvoorspelling-deel1.html -> VraagvoorspellingDeel1LessonPage
            const moduleId = fileName.replace('.html', '').replace(/-/g, '');
            const possiblePageClassName = this.detectPageClassName(fileName);
            
            if (possiblePageClassName) {
                console.log(`[AppRouter] 🔍 Detected potential page class: ${possiblePageClassName} for ${fileName}`);
                // Show loading state
                this.showLoadingState();
                try {
                    await this.loadWeekPage(moduleId, possiblePageClassName);
                    console.log('[AppRouter] ✅ Dynamic route handler completed');
                    
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
                    return;
                } catch (error) {
                    console.error(`[AppRouter] ❌ Error loading dynamic route ${fileName}:`, error);
                    this.showErrorState(error);
                    return;
                }
            }
            
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
        
        // Initialize SidebarManager for index page (sidebar is persistent, but listeners need to be attached)
        // Create a minimal page instance just for the managers
        if (window.SidebarManager) {
            const sidebarManager = new window.SidebarManager('start');
            sidebarManager.init();
        }
        
        // Re-initialize any scripts needed for index page
        // Small delay to ensure DOM is updated after innerHTML replacement
        setTimeout(() => {
            this.attachIndexPageScripts();
        }, 100);
    }

    /**
     * Laad een script dynamisch
     */
    async loadScript(scriptPath) {
        return new Promise((resolve, reject) => {
            // Check if script is already loaded
            const existingScript = document.querySelector(`script[src="${scriptPath}"]`);
            if (existingScript) {
                console.log(`[AppRouter] Script already loaded: ${scriptPath}`);
                // Wait a bit to ensure it's fully executed
                setTimeout(() => resolve(), 100);
                return;
            }
            
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => {
                console.log(`[AppRouter] ✅ Script loaded: ${scriptPath}`);
                // Wait a bit for the script to execute
                setTimeout(() => resolve(), 100);
            };
            script.onerror = () => {
                console.error(`[AppRouter] ❌ Failed to load script: ${scriptPath}`);
                reject(new Error(`Failed to load script: ${scriptPath}`));
            };
            document.head.appendChild(script);
        });
    }
    
    /**
     * Wacht tot BaseLessonPage beschikbaar is
     */
    async waitForBaseLessonPage(maxWait = 2000) {
        if (typeof window.BaseLessonPage !== 'undefined') {
            return true;
        }
        
        console.log('[AppRouter] ⏳ Waiting for BaseLessonPage to be available...');
        // Try to load BaseLessonPage if it's not available
        if (!document.querySelector('script[src*="BaseLessonPage.js"]')) {
            console.log('[AppRouter] 📥 BaseLessonPage script not found, loading it...');
            try {
                await this.loadScript('/core/pages/BaseLessonPage.js');
            } catch (error) {
                console.warn('[AppRouter] ⚠️ Failed to load BaseLessonPage script:', error);
            }
        }
        
        const startTime = Date.now();
        while (Date.now() - startTime < maxWait) {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (typeof window.BaseLessonPage !== 'undefined') {
                console.log('[AppRouter] ✅ BaseLessonPage is now available');
                return true;
            }
        }
        
        console.error('[AppRouter] ❌ BaseLessonPage not available after waiting');
        return false;
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
            
            // Still need to create page instance and attach listeners
            // Load page class dynamically
            let PageClass = window[pageClassName];
            if (!PageClass) {
                console.warn(`[AppRouter] ⚠️ Page class ${pageClassName} not found for cached content`);
                return;
            }
            
            // Create page instance for event listeners
            const pageInstance = new PageClass();
            console.log('[AppRouter] ✅ Page instance created for cached content');
            
            // Attach event listeners even for cached content
            console.log('[AppRouter] 🔌 Attaching content listeners for cached content');
            await this.attachContentListeners(pageInstance);
            
            // Store instance
            this.currentPageInstance = pageInstance;
            return;
        }
        
        // Load page class dynamically
        // First, try to load the script if class is not available
        let PageClass = window[pageClassName];
        console.log(`[AppRouter] 🔍 Looking for ${pageClassName}, available:`, !!PageClass);
        
        if (!PageClass) {
            
            // First, ensure BaseLessonPage is available
            const baseLessonPageAvailable = await this.waitForBaseLessonPage();
            if (!baseLessonPageAvailable) {
                console.error('[AppRouter] ❌ Cannot proceed without BaseLessonPage');
                throw new Error('BaseLessonPage is required but not available');
            }
            
            // Try to load the script dynamically
            // Determine script path based on current location
            const currentPath = window.location.pathname;
            let scriptPath;
            
            // Check if we're in /apps/{appName}/ context
            if (currentPath.includes('/apps/')) {
                const appMatch = currentPath.match(/\/apps\/([^\/]+)/);
                if (appMatch) {
                    const appName = appMatch[1];
                    scriptPath = `/apps/${appName}/pages/${pageClassName}.js`;
                } else {
                    // Fallback: try /apps/pages/ route
                    scriptPath = `/apps/pages/${pageClassName}.js`;
                }
            } else if (currentPath.startsWith('/operations-management/') || currentPath.startsWith('/logistiek-onderzoek/') || currentPath.startsWith('/e-learning-demo/')) {
                // Direct app path (without /apps/)
                const appMatch = currentPath.match(/\/([^\/]+)\//);
                if (appMatch) {
                    const appName = appMatch[1];
                    scriptPath = `/${appName}/pages/${pageClassName}.js`;
                } else {
                    scriptPath = `pages/${pageClassName}.js`;
                }
            } else {
                // Try to detect app from path
                const pathParts = currentPath.split('/').filter(p => p);
                if (pathParts.length > 0 && pathParts[0] !== 'core' && pathParts[0] !== 'game') {
                    scriptPath = `/${pathParts[0]}/pages/${pageClassName}.js`;
                } else {
                    scriptPath = `pages/${pageClassName}.js`;
                }
            }
            
            console.log(`[AppRouter] 📥 Attempting to load script: ${scriptPath}`);
            try {
                await this.loadScript(scriptPath);
                // Wait a bit for the script to execute and export the class
                let attempts = 0;
                while (attempts < 30 && !PageClass) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    PageClass = window[pageClassName];
                    attempts++;
                }
                if (PageClass) {
                    console.log(`[AppRouter] ✅ Page class ${pageClassName} loaded after script load`);
                }
            } catch (error) {
                console.warn(`[AppRouter] ⚠️ Failed to load script ${scriptPath}, will wait for class to become available:`, error);
            }
        }
        
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
        await this.attachContentListeners(pageInstance);
        
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
            
            // Force width constraints on main-content
            contentContainer.style.width = '100%';
            contentContainer.style.maxWidth = '100%';
            contentContainer.style.boxSizing = 'border-box';
            contentContainer.style.overflowX = 'hidden';
            
            // Scroll to top immediately (while invisible)
            const scrollContainer = contentContainer.closest('.overflow-y-auto') || window;
            if (scrollContainer.scrollTo) {
                scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
            }
            
            // Force reflow to ensure new content is rendered
            void contentContainer.offsetHeight;
            
            // Normalize spacing and width constraints after rendering
            setTimeout(() => {
                // Force width constraints on all sections
                const sections = contentContainer.querySelectorAll('section');
                sections.forEach((section) => {
                    section.style.width = '100%';
                    section.style.maxWidth = '100%';
                    section.style.boxSizing = 'border-box';
                });
                
                // Normalize spacing: Remove all margins from sections and let space-y handle it
                const article = contentContainer.querySelector('article');
                if (article) {
                    // Remove margin-bottom from all sections
                    sections.forEach((section) => {
                        section.style.marginBottom = '0';
                    });
                    
                    // Ensure intro wrapper has no margins
                    const introWrapper = contentContainer.querySelector('.intro-section-wrapper');
                    if (introWrapper) {
                        introWrapper.style.marginBottom = '0';
                        introWrapper.style.marginTop = '0';
                    }
                    
                    // Force spacing on first section after intro wrapper
                    const firstSectionAfterIntro = introWrapper?.nextElementSibling;
                    if (firstSectionAfterIntro && firstSectionAfterIntro.tagName === 'SECTION') {
                        firstSectionAfterIntro.style.marginTop = window.innerWidth >= 640 ? '2rem' : '1.5rem';
                    }
                }
                
                // Force width constraints on max-w-4xl container but keep max-width limit
                const maxWidthContainer = contentContainer.querySelector('.max-w-4xl');
                if (maxWidthContainer) {
                    // Don't force width: 100%, let it be auto so max-width works correctly
                    maxWidthContainer.style.maxWidth = '56rem'; // Keep Tailwind's max-w-4xl value
                    maxWidthContainer.style.boxSizing = 'border-box';
                    maxWidthContainer.style.marginLeft = 'auto';
                    maxWidthContainer.style.marginRight = 'auto';
                }
                
                // Ensure article doesn't break out of container
                if (article) {
                    article.style.maxWidth = '100%';
                    article.style.boxSizing = 'border-box';
                }
            }, 100);
            
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
    async attachContentListeners(pageInstance) {
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
        
        // Call lifecycle hook after event listeners are attached
        // This is used for hash navigation, MC question generation, etc.
        if (typeof pageInstance.afterEventListeners === 'function') {
            console.log('[AppRouter] 🔗 Calling afterEventListeners() lifecycle hook');
            await pageInstance.afterEventListeners();
        }
    }

    /**
     * Attach scripts for index page
     */
    attachIndexPageScripts() {
        console.log('[AppRouter] attachIndexPageScripts called');
        console.log('[AppRouter] Checking for export-pdf-btn:', !!document.getElementById('export-pdf-btn'));
        
        // Re-initialize search if needed
        if (window.SearchService && typeof setupSearch === 'function') {
            setupSearch();
        }
        
        // Re-initialize PDF export if needed
        // Use the same initialization logic as initial page load
        if (typeof window.setupPDFExport === 'function' && typeof window.waitForPDFLibraries === 'function') {
            console.log('[AppRouter] Initializing PDF export for index page...');
            const initializePDFExport = async () => {
                try {
                    // Wait for libraries to be loaded (max 10 seconds)
                    await window.waitForPDFLibraries(100, 100);
                    console.log('[AppRouter] ✅ PDF libraries loaded, setting up export function');
                    window.setupPDFExport(3); // Pass retries parameter
                } catch (error) {
                    console.error('[AppRouter] ❌ PDF libraries could not be loaded:', error);
                    console.error('[AppRouter] Setting up PDF export anyway (user will see error on click)');
                    // Setup export function anyway, so user gets error message on click
                    window.setupPDFExport(3); // Pass retries parameter
                }
            };
            // Small delay to ensure DOM is ready after SPA navigation
            setTimeout(() => {
                initializePDFExport();
            }, 200);
        } else if (typeof window.setupPDFExport === 'function') {
            // Fallback if waitForPDFLibraries is not available
            console.log('[AppRouter] Setting up PDF export (libraries check not available)');
            setTimeout(() => {
                window.setupPDFExport(3); // Pass retries parameter
            }, 200);
        } else {
            console.warn('[AppRouter] setupPDFExport function not available');
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

