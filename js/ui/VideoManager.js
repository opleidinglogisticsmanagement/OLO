/**
 * VideoManager
 * 
 * Handles all video error detection functionality including:
 * - Detecting when video iframes fail to load (especially Mediasite)
 * - Showing fallback messages when videos are blocked
 * - Monitoring dynamically added iframes via MutationObserver
 * - Retry mechanism with progressive delays
 */

class VideoManager {
    constructor() {
        // Geen constructor parameters nodig
    }

    /**
     * Initialiseer alle video functionaliteit
     * Moet worden aangeroepen nadat de DOM geladen is
     */
    init() {
        this.setupVideoErrorDetection();
    }

    /**
     * Setup video error detection for blocked or failed video embeds
     * This detects when videos (especially Mediasite) cannot be embedded
     */
    setupVideoErrorDetection() {
        // Use a global flag to prevent multiple event listeners
        if (window._videoErrorDetectionSetup) {
            return;
        }
        window._videoErrorDetectionSetup = true;
        
        // Function to check if a video iframe failed to load
        const checkVideoLoad = (iframe) => {
            const container = iframe.closest('[id$="-container"]');
            if (!container) return;
            
            const fallback = container.querySelector('[id$="-fallback"]');
            if (!fallback) return;
            
            // Check after a delay if the iframe loaded successfully
            setTimeout(() => {
                try {
                    // Try to access iframe content - if blocked, this will throw an error
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (!iframeDoc) {
                        // If we can't access the document, it might be blocked
                        // Check if fallback is still hidden (meaning video might have loaded)
                        // If fallback is visible, don't do anything
                        if (fallback.classList.contains('hidden')) {
                            // Try one more time after a longer delay
                            setTimeout(() => {
                                try {
                                    const checkDoc = iframe.contentDocument || iframe.contentWindow?.document;
                                    if (!checkDoc && fallback.classList.contains('hidden')) {
                                        // Still can't access, likely blocked - show fallback
                                        iframe.classList.add('hidden');
                                        fallback.classList.remove('hidden');
                                    }
                                } catch (e) {
                                    // Cross-origin or blocked - show fallback
                                    iframe.classList.add('hidden');
                                    fallback.classList.remove('hidden');
                                }
                            }, 3000);
                        }
                    }
                } catch (e) {
                    // Cross-origin restriction or blocked - this is expected for some video platforms
                    // Don't show fallback immediately, wait a bit more
                    setTimeout(() => {
                        // Check if iframe has any visible content by checking its dimensions
                        // If iframe is still there but we can't access it, it might be working
                        // Only show fallback if we're certain it failed
                        const rect = iframe.getBoundingClientRect();
                        if (rect.height < 50 && fallback.classList.contains('hidden')) {
                            // Iframe is very small, likely failed
                            iframe.classList.add('hidden');
                            fallback.classList.remove('hidden');
                        }
                    }, 4000);
                }
            }, 2000);
        };
        
        // Use MutationObserver to detect when new video iframes are added to the DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if the added node is a video iframe or contains one
                        const iframes = node.querySelectorAll ? node.querySelectorAll('iframe[data-video-url]') : [];
                        if (node.tagName === 'IFRAME' && node.hasAttribute('data-video-url')) {
                            checkVideoLoad(node);
                        }
                        iframes.forEach(iframe => checkVideoLoad(iframe));
                    }
                });
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also check existing iframes on page load
        setTimeout(() => {
            document.querySelectorAll('iframe[data-video-url]').forEach(iframe => {
                checkVideoLoad(iframe);
            });
        }, 1000);
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoManager;
} else {
    window.VideoManager = VideoManager;
}


