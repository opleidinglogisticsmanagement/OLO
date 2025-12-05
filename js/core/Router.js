/**
 * Router Component
 * 
 * Verantwoordelijk voor SPA navigatie, anchor scrolling en script loading
 * Geëxtraheerd uit BaseLessonPage.js om de "God Class" op te splitsen
 */

class Router {
    constructor() {
        // Scroll state (voorheen in BaseLessonPage)
        this.activeScrollId = null;
        this.initialScrollComplete = false;
        this.scrollVerificationTimeout = null;
        this.isAutoScrolling = false;
        this.userInterruptedScroll = false;
        this.pendingAnchor = null;
    }

    /**
     * Setup SPA Router
     * Onderschept klikken op links en laadt de juiste class dynamisch
     */
    setupSPARouter() {
        console.log('[SPA] Router setup active');
        // Gebruik capture phase om clicks te onderscheppen voordat andere handlers dat doen
        document.addEventListener('click', async (e) => {
            // Check of dit een sidebar toggle click is (chevron)
            // Als dat zo is, laten we het event doorgaan zodat de specifieke toggle handler het kan oppakken
            // Check in capture phase (before other handlers)
            const chevronElement = e.target.closest('[id*="-chevron"]');
            const chevronContainer = e.target.closest('[id*="-chevron-container"]');
            if (chevronElement || chevronContainer) {
                console.log('[SPA] Chevron click detected, ignoring router');
                // Don't prevent default or stop propagation - let the submenu toggle handler handle it
                return;
            }

            const link = e.target.closest('a');
            if (!link) return;
            
            // Gebruik volledige URL object voor robuuste parsing
            const href = link.href;
            const urlObj = new URL(href, window.location.origin);
            
            // Check 1: Same origin?
            if (urlObj.origin !== window.location.origin) return;
            
            // Check 2: Is het een HTML pagina? (of root)
            // Negeer links die niet op .html eindigen (tenzij root /)
            const isHtml = urlObj.pathname.endsWith('.html') || urlObj.pathname.endsWith('/') || urlObj.pathname.indexOf('.') === -1;
            if (!isHtml) return;
            
            // Check 3: Interne anchor navigatie op ZELFDE pagina?
            if (urlObj.pathname === window.location.pathname) {
                // Als er een hash is, is het een interne scroll -> laat browser afhandelen (of onze eigen smooth scroll)
                if (urlObj.hash) {
                    console.log('[SPA] Internal anchor navigation, ignoring router:', urlObj.hash);
                    return;
                }
                // Zelfde pagina zonder hash = reload -> we doen een SPA refresh
            }
            
            // Check 4: Speciale uitzonderingen
            if (link.hasAttribute('download') || link.target === '_blank') return;

            console.log('[SPA] Intercepting navigation to:', href);
            e.preventDefault();
            e.stopPropagation(); // Stop verdere bubbling
            
            // Bepaal bestandsnaam
            let filename = urlObj.pathname.split('/').pop();
            if (!filename || filename === '') filename = 'index.html';

            // Update URL in browser zonder reload
            history.pushState(null, '', href);

            // Laad de juiste pagina class
            try {
                await this.loadPageByFilename(filename);
            } catch (error) {
                console.error('[SPA] Error loading page:', error);
                alert(`Fout bij laden pagina: ${error.message}`);
                // Fallback: hard reload als SPA navigatie faalt
                window.location.href = href;
            }
            
            // Als er een hash in de nieuwe URL zit, scroll er naar toe na laden
            // De init() methode van de pagina class zal dit ook proberen, dus we wachten
            // tot de pagina volledig geladen is voordat we scrollen
            if (urlObj.hash) {
                // Wacht langer om te zorgen dat content volledig geladen is
                // De init() methode zal dit ook proberen, maar we doen dit als backup
                setTimeout(() => {
                    // Check of we nog steeds op dezelfde pagina zijn (niet genavigeerd naar andere pagina)
                    if (window.location.hash === urlObj.hash) {
                        this.scrollToAnchor(urlObj.hash);
                    }
                }, 800);
            }
        }, true); // Capture: true!

        // Ondersteuning voor Terug/Vooruit knoppen in browser
        window.addEventListener('popstate', () => {
            const filename = window.location.pathname.split('/').pop() || 'index.html';
            console.log('[SPA] Popstate detected, loading:', filename);
            this.loadPageByFilename(filename);
        });
    }

    /**
     * Helper: Bepaal welke class geladen moet worden op basis van bestandsnaam
     */
    async loadPageByFilename(filename) {
        // Dynamisch bepalen van class naam en script pad op basis van bestandsnaam
        let className, scriptPath;
        
        if (filename === 'index.html') {
            className = 'IndexPage';
            scriptPath = 'pages/IndexPage.js';
        } else {
            // Converteer bestandsnaam naar class naam (bijv. week1.html -> Week1LessonPage)
            const baseName = filename.replace('.html', '');
            const capitalized = baseName.charAt(0).toUpperCase() + baseName.slice(1);
            
            // Speciale gevallen
            if (baseName === 'afsluiting') {
                className = 'AfsluitingLessonPage';
            } else if (baseName.startsWith('week')) {
                className = capitalized + 'LessonPage';
            } else {
                // Voor register, flashcards, etc.
                className = capitalized + 'Page';
            }
            
            scriptPath = `pages/${className}.js`;
        }

        // Specifieke behandeling voor index.html
        if (filename === 'index.html') {
            // Gebruik IndexPage in plaats van BaseLessonPage voor de index
            // Check of IndexPage al bestaat, zo niet, laad het script
            if (typeof window.IndexPage === 'undefined') {
                await this.loadScript('pages/IndexPage.js');
            }
            
            // Wacht even en check opnieuw (polling) om race conditions te voorkomen
            if (typeof window.IndexPage === 'undefined') {
                // Poll maximaal 20x met 50ms interval (totaal 1000ms)
                for (let i = 0; i < 20; i++) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    if (typeof window.IndexPage !== 'undefined') break;
                }
            }
            
            // Check nogmaals of de class nu wel bestaat
            if (typeof window.IndexPage === 'undefined') {
                console.error('[SPA] IndexPage not found after loading script. Falling back to BaseLessonPage.');
                // Fallback naar BaseLessonPage als IndexPage niet geladen kan worden
                const pageInstance = new BaseLessonPage('start', 'Start', 'Opzetten van Logistieke Onderzoeken');
                await pageInstance.init();
                return;
            }
            
            // Instantieer IndexPage
            const pageInstance = new window.IndexPage();
            await pageInstance.init();
            return;
        }

        // Check of de class al bestaat, zo niet, laad het script
        if (typeof window[className] === 'undefined') {
            await this.loadScript(scriptPath);
        }

        // Wacht even en check opnieuw (polling) om race conditions te voorkomen
        if (typeof window[className] === 'undefined') {
             // Poll maximaal 20x met 50ms interval (totaal 1000ms)
             for (let i = 0; i < 20; i++) {
                 await new Promise(resolve => setTimeout(resolve, 50));
                 if (typeof window[className] !== 'undefined') break;
             }
        }

        // Check nogmaals of de class nu wel bestaat
        if (typeof window[className] === 'undefined') {
             console.error(`[SPA] Class ${className} not found after loading script ${scriptPath}. Window keys:`, Object.keys(window).filter(k => k.includes('LessonPage') || k.includes('Page')));
             throw new Error(`Class ${className} not found after loading script ${scriptPath}. Controleer of de class correct aan window is toegewezen (ook als module.exports bestaat).`);
        }

        // Cleanup oude pagina instantie als we naar een andere pagina navigeren
        // Check of er een Week4LessonPage instantie is die opgeruimd moet worden
        if (window.currentWeek4Page && filename !== 'week4.html') {
            if (typeof window.currentWeek4Page.cleanup === 'function') {
                window.currentWeek4Page.cleanup();
            }
            window.currentWeek4Page = null;
        }
        
        // Instantieer de nieuwe pagina
        const pageInstance = new window[className]();
        await pageInstance.init();
    }

    /**
     * Load script with cache-busting timestamp
     * BELANGRIJK: Behoud de timestamp cache-busting logic!
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Voeg altijd een timestamp toe voor cache-busting
            const scriptUrl = src + '?t=' + Date.now();
            const normalizedSrc = new URL(scriptUrl, window.location.origin).href;
            
            // Check of script al bestaat met exact dezelfde src
            const exactMatch = Array.from(document.scripts).find(s => 
                s.src && (s.src === normalizedSrc || s.src === scriptUrl)
            );
            
            if (exactMatch) {
                // Script bestaat al met exact dezelfde URL
                resolve();
                return;
            }
            
            // Als er al een script bestaat met dezelfde bestandsnaam maar andere timestamp, verwijder die eerst
            const scriptName = src.split('?')[0];
            const oldScripts = Array.from(document.scripts).filter(s => {
                if (!s.src) return false;
                const oldScriptName = s.src.split('?')[0];
                return oldScriptName === scriptName && s.src !== normalizedSrc && s.src !== scriptUrl;
            });
            
            // Verwijder oude scripts met andere timestamp
            oldScripts.forEach(oldScript => {
                oldScript.remove();
            });
            
            // Laad het nieuwe script
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Update alleen het middelste gedeelte (voor SPA navigatie)
     * @param {Function} renderMainContentCallback - Callback die renderMainContent() aanroept
     * @param {string} moduleTitle - Titel van de module
     * @param {string} moduleSubtitle - Subtitel van de module
     */
    updateMainContentOnly(renderMainContentCallback, moduleTitle, moduleSubtitle) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        // We renderen de 'main content' string en halen daar de binnenkant uit
        // Dit is een simpele manier om je bestaande renderMainContent() te hergebruiken
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = renderMainContentCallback();
        
        // Vervang de inhoud van de bestaande main tag
        // Let op: renderMainContent geeft een <main>... </main> terug,
        // dus we pakken de innerHTML van het eerste kind van tempDiv
        if (tempDiv.firstElementChild) {
             mainContent.innerHTML = tempDiv.firstElementChild.innerHTML;
             // Scroll naar boven
             mainContent.scrollTop = 0;
        }
        
        // Update de document titel
        document.title = `${moduleTitle} - ${moduleSubtitle || 'OLO'}`;
    }

    /**
     * Update de actieve link in de sidebar
     * @param {string} moduleId - ID van de huidige module
     */
    updateActiveLink(moduleId) {
        // Verwijder active classes van alle links
        document.querySelectorAll('aside a').forEach(a => {
            a.classList.remove('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-700', 'dark:text-blue-300');
            a.classList.add('text-gray-600', 'dark:text-gray-300');
            
            // Reset icon kleuren
            const iconDiv = a.querySelector('div:first-child');
            if(iconDiv) {
                iconDiv.classList.remove('bg-blue-100', 'dark:bg-blue-800');
                iconDiv.classList.add('bg-gray-100', 'dark:bg-gray-700');
            }
        });

        // Zoek de link die matcht met de huidige pagina (moduleId of bestandsnaam)
        let targetHref = `${moduleId}.html`;
        if (moduleId === 'start') targetHref = 'index.html';
        if (moduleId.startsWith('week-')) targetHref = `${moduleId.replace('-', '')}.html`;
        
        const activeLink = document.querySelector(`aside a[href*="${targetHref}"]`);
        
        if (activeLink) {
            activeLink.classList.add('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-700', 'dark:text-blue-300');
            activeLink.classList.remove('text-gray-600', 'dark:text-gray-300');
             
             // Update icon kleuren
            const iconDiv = activeLink.querySelector('div:first-child');
            if(iconDiv) {
                iconDiv.classList.add('bg-blue-100', 'dark:bg-blue-800');
                iconDiv.classList.remove('bg-gray-100', 'dark:bg-gray-700');
            }
        }
    }

    /**
     * Setup smooth scrolling to anchors
     */
    setupAnchorScrolling() {
        // Use event delegation to handle clicks on navigation sub-items
        // This works even if elements are added dynamically
        const handleNavClick = (e) => {
            const navSubItem = e.target.closest('.nav-sub-item');
            if (navSubItem) {
                let anchor = navSubItem.getAttribute('data-anchor');
                const href = navSubItem.getAttribute('href');
                
                // If no data-anchor, extract from href
                if (!anchor && href && href.includes('#')) {
                    anchor = '#' + href.split('#')[1];
                }
                
                // Ensure anchor starts with #
                if (anchor && !anchor.startsWith('#')) {
                    anchor = '#' + anchor;
                }
                
                if (anchor && href) {
                    // Extract the page part from href (e.g., "week3.html" from "week3.html#anchor")
                    const targetPage = href.split('#')[0];
                    
                    // Check if we are currently on the target page
                    const isCurrentPage = window.location.pathname.includes(targetPage) || 
                                         window.location.pathname.endsWith(targetPage) ||
                                         window.location.href.includes(targetPage);
                    
                    if (isCurrentPage) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('[Router] Scrolling to anchor on current page:', anchor);
                        this.scrollToAnchor(anchor);
                        
                        // Update URL hash without scrolling
                        if (window.history && window.history.pushState) {
                            window.history.pushState(null, null, anchor);
                        }
                        
                        // Close sidebar on mobile after clicking
                        const sidebar = document.getElementById('sidebar');
                        const overlay = document.getElementById('overlay');
                        if (window.innerWidth < 1024 && sidebar && overlay) {
                            sidebar.classList.add('-translate-x-full');
                            overlay.classList.add('hidden');
                            document.body.style.overflow = '';
                        }
                    }
                    // If we're NOT on the target page, let the link navigate normally
                    // The hash will be handled when the new page loads
                }
            }
        };
        
        // Add event listener using delegation
        document.addEventListener('click', handleNavClick, true);
        
        // Handle user interaction to cancel auto-scroll
        const cancelScroll = () => {
            if (this.isAutoScrolling) {
                console.log('[Router] User interaction detected, cancelling auto-scroll');
                this.userInterruptedScroll = true;
                this.isAutoScrolling = false;
                // Clear any pending timeouts
                if (this.scrollVerificationTimeout) {
                    clearTimeout(this.scrollVerificationTimeout);
                    this.scrollVerificationTimeout = null;
                }
            }
        };
        
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.addEventListener('wheel', cancelScroll, { passive: true });
            mainContent.addEventListener('touchstart', cancelScroll, { passive: true });
            mainContent.addEventListener('keydown', cancelScroll, { passive: true });
        }
        
        // Handle hash in URL on page load (after content is loaded)
        // We rely on the subclass init() calling scrollToAnchor manually after loading content
        // This listener is a fallback for when the hash changes without reload
        window.addEventListener('hashchange', () => {
            if (window.location.hash) {
                this.scrollToAnchor(window.location.hash);
            }
        });
    }
    
    /**
     * Scroll to anchor with smooth behavior
     */
    scrollToAnchor(anchor) {
        // Ensure anchor starts with #
        const anchorId = anchor.startsWith('#') ? anchor : '#' + anchor;
        
        // Debounce: if we're already scrolling to the same anchor, cancel previous attempt
        if (this.isAutoScrolling && this.pendingAnchor === anchorId) {
            console.log('[Router] Already scrolling to', anchorId, '- skipping duplicate call');
            return;
        }
        
        console.log('[Router] scrollToAnchor called with:', anchorId);
        
        // Store pending anchor
        this.pendingAnchor = anchorId;
        
        // Generate a unique ID for this scroll attempt
        const currentScrollId = Date.now();
        this.activeScrollId = currentScrollId;
        
        // Reset state
        this.userInterruptedScroll = false;
        this.isAutoScrolling = true;
        
        // Clear any pending verification timeout
        if (this.scrollVerificationTimeout) {
            clearTimeout(this.scrollVerificationTimeout);
            this.scrollVerificationTimeout = null;
        }
        
        // Try multiple times in case content is still loading
        const attemptScroll = (attempts = 0) => {
            // Check if this attempt is still valid
            if (this.activeScrollId !== currentScrollId || this.userInterruptedScroll) {
                return;
            }

            const element = document.querySelector(anchorId);
            const mainContent = document.getElementById('main-content');
            const headerOffset = 100; // Height of sticky header + padding
            
            if (element && mainContent) {
                console.log('[Router] Element found:', element);
                
                // Calculate scroll position: find element's offsetTop relative to main-content
                let scrollPosition = 0;
                let currentElement = element;
                
                // Walk up the DOM tree until we reach main-content
                while (currentElement && currentElement !== mainContent && currentElement !== document.body) {
                    scrollPosition += currentElement.offsetTop;
                    currentElement = currentElement.offsetParent;
                }
                
                // Subtract header offset and ensure we don't scroll past 0
                const targetScroll = Math.max(0, scrollPosition - headerOffset);
                
                console.log('[Router] Calculated scroll position:', targetScroll, 'Current scroll:', mainContent.scrollTop);
                
                // Check if we are already close enough (prevents jitter)
                if (Math.abs(mainContent.scrollTop - targetScroll) < 10) {
                    console.log('[Router] Already at target position');
                    this.isAutoScrolling = false;
                    this.pendingAnchor = null;
                    return;
                }

                // Scroll the container
                mainContent.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
                
                // Verify scroll worked after expected duration of smooth scroll
                this.scrollVerificationTimeout = setTimeout(() => {
                    // Check valid again
                    if (this.activeScrollId !== currentScrollId || this.userInterruptedScroll) return;

                    const elementRect = element.getBoundingClientRect();
                    const containerRect = mainContent.getBoundingClientRect();
                    const elementTopRelative = elementRect.top - containerRect.top;
                    
                    // If element is not at the right position (e.g. content shifted), retry ONCE
                    // Only if significantly off (> 50px)
                    if (Math.abs(elementTopRelative - headerOffset) > 50) {
                        console.log('[Router] Scroll position incorrect, using fallback');
                        
                        // Use smooth behavior for fallback too
                        if (!this.userInterruptedScroll) {
                             mainContent.scrollTo({
                                top: targetScroll, // Try same target again
                                behavior: 'smooth'
                            });
                        }
                    }
                    
                    this.isAutoScrolling = false;
                    this.pendingAnchor = null;
                }, 1000);
                
            } else if (element && !mainContent) {
                // Fallback: if main-content doesn't exist, scroll window
                const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementTop - headerOffset,
                    behavior: 'smooth'
                });
                this.isAutoScrolling = false;
                this.pendingAnchor = null;
            } else if (attempts < 10) {
                // Element not found yet, retry after a delay
                setTimeout(() => attemptScroll(attempts + 1), 200);
            } else {
                // Max attempts reached, give up
                console.warn('[Router] Could not find element for anchor:', anchorId);
                this.isAutoScrolling = false;
                this.pendingAnchor = null;
            }
        };
        
        // Start attempting to scroll
        attemptScroll();
    }
}

// Export globally
window.Router = Router;

