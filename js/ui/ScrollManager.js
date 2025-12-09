/**
 * ScrollManager
 * 
 * Beheert alle scroll-gerelateerde functionaliteit:
 * - Scroll to top button (show/hide bij scroll positie)
 * - Anchor scrolling (smooth scroll naar anchors op dezelfde pagina)
 * - Hash handling in URL (scroll naar anchor bij page load)
 */

class ScrollManager {
    constructor(moduleId) {
        this.moduleId = moduleId;
    }

    /**
     * Initialiseer alle scroll functionaliteit
     * Moet worden aangeroepen nadat de DOM geladen is
     */
    init() {
        this.setupScrollToTopButton();
        this.setupAnchorScrolling();
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
                    // Determine which week we're currently on
                    const currentWeek = this.moduleId; // 'week-2', 'week-3', 'week-4', 'week-5', 'week-6', etc.
                    const isOnAnchorScrollingPage = currentWeek === 'week-2' || 
                                                   currentWeek === 'week-3' || 
                                                   currentWeek === 'week-4' || 
                                                   currentWeek === 'week-5' ||
                                                   currentWeek === 'week-6';
                    
                    // Determine which week the link points to
                    const linkPointsToWeek2 = href.includes('week2.html');
                    const linkPointsToWeek3 = href.includes('week3.html');
                    const linkPointsToWeek4 = href.includes('week4.html');
                    const linkPointsToWeek5 = href.includes('week5.html');
                    const linkPointsToWeek6 = href.includes('week6.html');
                    const linkIsOnlyAnchor = href.startsWith('#');
                    
                    // Map link to module ID
                    let linkWeekModuleId = null;
                    if (linkPointsToWeek2) linkWeekModuleId = 'week-2';
                    else if (linkPointsToWeek3) linkWeekModuleId = 'week-3';
                    else if (linkPointsToWeek4) linkWeekModuleId = 'week-4';
                    else if (linkPointsToWeek5) linkWeekModuleId = 'week-5';
                    else if (linkPointsToWeek6) linkWeekModuleId = 'week-6';
                    else if (linkIsOnlyAnchor) {
                        // If link is only an anchor, assume it's for the current page
                        linkWeekModuleId = currentWeek;
                    }
                    
                    // Only handle anchor scrolling if:
                    // 1. We're on a week 2/3/4/5 page
                    // 2. AND the link points to the SAME week (or is only an anchor, meaning same page)
                    const isSameWeek = linkWeekModuleId === currentWeek;
                    const shouldHandleAnchorScroll = isOnAnchorScrollingPage && isSameWeek;
                    
                    if (shouldHandleAnchorScroll) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('[ScrollManager] ✅ Handling anchor scroll on same page. Current:', currentWeek, 'Link:', linkWeekModuleId, 'Anchor:', anchor);
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
                    } else {
                        // Different week or not an anchor scrolling page - allow normal navigation
                        console.log('[ScrollManager] ⏭️ Allowing normal navigation. Current:', currentWeek, 'Link:', linkWeekModuleId, 'href:', href);
                        // Don't prevent default - let the browser navigate normally
                        // The hash will be handled when the target page loads
                    }
                }
            }
        };
        
        // Add event listener using delegation
        document.addEventListener('click', handleNavClick, true);
        
        // Handle hash in URL on page load (after content is loaded)
        // Only scroll if there's actually a hash in the URL
        const handleHashOnLoad = (attempt = 1, maxAttempts = 10) => {
            // Check if hash exists and is not empty
            const hash = window.location.hash;
            if (!hash || hash === '#' || hash.trim() === '') {
                // No hash, don't scroll - ensure we're at the top
                if (attempt === 1) {
                    // Only on first attempt, ensure we're at the top of the page
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.scrollTo({ top: 0, behavior: 'instant' });
                    }
                    window.scrollTo({ top: 0, behavior: 'instant' });
                }
                return; // Exit early if no hash
            }
            
            // Only handle hash scrolling for week-2, week-3, week-4, week-5, week-6
            if (this.moduleId === 'week-2' || this.moduleId === 'week-3' || this.moduleId === 'week-4' || this.moduleId === 'week-5' || this.moduleId === 'week-6') {
                const element = document.querySelector(hash);
                
                if (element) {
                    console.log(`[ScrollManager] ✅ Element found for ${hash} (attempt ${attempt})`);
                    this.scrollToAnchor(hash);
                } else if (attempt < maxAttempts) {
                    // Element not found yet, retry with increasing delay
                    const delay = Math.min(300 * attempt, 2000); // Max 2 seconds between attempts
                    console.log(`[ScrollManager] Element not found for ${hash}, retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})...`);
                    setTimeout(() => handleHashOnLoad(attempt + 1, maxAttempts), delay);
                } else {
                    console.warn(`[ScrollManager] ⚠️ Element with hash ${hash} not found after ${maxAttempts} attempts`);
                    // List available IDs for debugging
                    const availableIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
                    const relevantIds = availableIds.filter(id => 
                        id.includes('probleem') || id.includes('doelstelling') || 
                        id.includes('opdrachtgever') || id.includes('vormen') ||
                        id.includes('definieren') || id.includes('literatuur') ||
                        id.includes('selecteren') || id.includes('slim') || id.includes('theoretisch') ||
                        id.includes('kernbeslissingen') || id.includes('onderzoekstrategie') || id.includes('dataverzamelingsplan')
                    );
                    console.log('[ScrollManager] Available relevant IDs:', relevantIds);
                }
            }
        };
        
        // Only try to handle hash if there actually is one
        // Don't call multiple times if there's no hash - that's wasteful
        if (window.location.hash && window.location.hash !== '#' && window.location.hash.trim() !== '') {
            // Try after delays (in case content loads asynchronously)
            // Start with shorter delay, then increase
            setTimeout(() => handleHashOnLoad(1), 500);
            setTimeout(() => handleHashOnLoad(3), 1500);
            setTimeout(() => handleHashOnLoad(6), 3000);
        } else {
            // No hash - ensure we start at the top of the page
            setTimeout(() => {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.scrollTo({ top: 0, behavior: 'instant' });
                }
                window.scrollTo({ top: 0, behavior: 'instant' });
            }, 100);
        }
    }

    /**
     * Scroll to anchor with smooth behavior
     */
    scrollToAnchor(anchor) {
        // Ensure anchor starts with #
        const anchorId = anchor.startsWith('#') ? anchor : '#' + anchor;
        console.log('[ScrollManager] scrollToAnchor called with:', anchorId, 'on module:', this.moduleId);
        
        // Try multiple times in case content is still loading
        // Week 2, 3, and 6 may need more retries due to async content loading
        const maxAttempts = (this.moduleId === 'week-2' || this.moduleId === 'week-3' || this.moduleId === 'week-6') ? 20 : 15;
        
        const attemptScroll = (attempts = 0) => {
            const element = document.querySelector(anchorId);
            const mainContent = document.getElementById('main-content');
            const headerOffset = 100;
            
            console.log(`[ScrollManager] Attempt ${attempts + 1}/${maxAttempts}: Looking for element ${anchorId}`);
            
            if (element && mainContent) {
                console.log('[ScrollManager] ✅ Element found:', element.id || anchorId);
                
                // Calculate scroll position: find element's offsetTop relative to main-content
                let scrollPosition = 0;
                let currentElement = element;
                
                // Walk up the DOM tree until we reach main-content
                while (currentElement && currentElement !== mainContent && currentElement !== document.body) {
                    scrollPosition += currentElement.offsetTop;
                    currentElement = currentElement.offsetParent;
                }
                
                // Subtract header offset
                const targetScroll = Math.max(0, scrollPosition - headerOffset);
                
                console.log('[ScrollManager] Calculated scroll position:', targetScroll, 'Current scroll:', mainContent.scrollTop);
                
                // Scroll the container
                mainContent.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
                
                // Verify scroll worked after a delay
                setTimeout(() => {
                    const elementRect = element.getBoundingClientRect();
                    const containerRect = mainContent.getBoundingClientRect();
                    const elementTopRelative = elementRect.top - containerRect.top;
                    
                    console.log('[ScrollManager] Element position after scroll:', elementTopRelative, 'Expected offset:', headerOffset);
                    
                    // If element is not at the right position, use scrollIntoView as fallback
                    if (Math.abs(elementTopRelative - headerOffset) > 50) {
                        console.log('[ScrollManager] Scroll position incorrect, using scrollIntoView fallback');
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        });
                        
                        // Adjust for header after scrollIntoView
                        setTimeout(() => {
                            const currentScroll = mainContent.scrollTop;
                            mainContent.scrollTo({
                                top: Math.max(0, currentScroll - headerOffset),
                                behavior: 'smooth'
                            });
                        }, 400);
                    } else {
                        console.log('[ScrollManager] ✅ Scroll successful!');
                    }
                }, 600);
                
            } else if (element && !mainContent) {
                // Fallback: scroll window if no main-content container
                console.log('[ScrollManager] No main-content container, scrolling window');
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
                
                setTimeout(() => {
                    const elementRect = element.getBoundingClientRect();
                    const offsetPosition = elementRect.top + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: Math.max(0, offsetPosition),
                        behavior: 'smooth'
                    });
                }, 100);
                
            } else if (attempts < maxAttempts) {
                // Retry if element not found yet (content might still be loading)
                // Use increasing delay for retries, with longer initial delay for week 2/3/6
                const baseDelay = (this.moduleId === 'week-2' || this.moduleId === 'week-3' || this.moduleId === 'week-6') ? 200 : 100;
                const delay = Math.min(baseDelay * (attempts + 1), 2000); // Max 2 seconds between attempts
                console.log(`[ScrollManager] ⏳ Element not found, retrying in ${delay}ms... (attempt ${attempts + 1}/${maxAttempts})`);
                setTimeout(() => attemptScroll(attempts + 1), delay);
            } else {
                console.warn(`[ScrollManager] ⚠️ Element with anchor ${anchorId} not found after ${attempts} attempts.`);
                // List available IDs for debugging
                const availableIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
                const relevantIds = availableIds.filter(id => 
                    id.includes('probleem') || id.includes('doelstelling') || 
                    id.includes('opdrachtgever') || id.includes('vormen') ||
                    id.includes('definieren') || id.includes('literatuur') ||
                    id.includes('selecteren') || id.includes('slim') || id.includes('theoretisch') ||
                    id.includes('onderzoeksmodel') || id.includes('onderzoeksvragen') || id.includes('ai-onderzoeksassistent') ||
                    id.includes('kernbeslissingen') || id.includes('onderzoekstrategie') || id.includes('dataverzamelingsplan')
                );
                console.log('[ScrollManager] Available relevant IDs:', relevantIds);
                console.log('[ScrollManager] All IDs on page:', availableIds);
            }
        };
        
        // Start attempt with a small delay to ensure DOM is ready
        // Week 2, 3, and 6 may need a longer initial delay due to async content loading
        const initialDelay = (this.moduleId === 'week-2' || this.moduleId === 'week-3' || this.moduleId === 'week-6') ? 100 : 0;
        if (initialDelay > 0) {
            setTimeout(() => attemptScroll(), initialDelay);
        } else {
            attemptScroll();
        }
    }

    /**
     * Setup scroll to top button
     */
    setupScrollToTopButton() {
        const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
        const mainContent = document.getElementById('main-content');

        if (scrollToTopBtn) {
            // Smooth scroll to top on click
            scrollToTopBtn.addEventListener('click', () => {
                // Try scrolling main-content container first
                if (mainContent) {
                    mainContent.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                
                // Also scroll window/document to top (handles case where page itself scrolls)
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Fallback for older browsers
                document.documentElement.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Show/hide button based on scroll position
            const handleScroll = () => {
                // Check both main-content scroll and window scroll, use the maximum
                let mainContentScroll = 0;
                let windowScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
                
                if (mainContent) {
                    mainContentScroll = mainContent.scrollTop || 0;
                }
                
                // Use the maximum scroll position (in case both are scrolling)
                const scrollTop = Math.max(mainContentScroll, windowScroll);
                
                if (scrollTop > 300) {
                    // Show button when scrolled down more than 300px
                    scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                    scrollToTopBtn.classList.add('opacity-100');
                } else {
                    // Hide button when near the top
                    scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                    scrollToTopBtn.classList.remove('opacity-100');
                }
            };

            // Listen to both main-content scroll and window scroll
            if (mainContent) {
                mainContent.addEventListener('scroll', handleScroll, { passive: true });
            }
            window.addEventListener('scroll', handleScroll, { passive: true });
            
            // Check initial scroll position on page load (with small delay to ensure DOM is ready)
            setTimeout(() => {
                handleScroll();
            }, 100);
        }
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollManager;
} else {
    window.ScrollManager = ScrollManager;
}
