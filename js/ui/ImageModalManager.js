/**
 * ImageModalManager
 * 
 * Handles all image modal functionality including:
 * - Opening/closing image modals
 * - Image click handlers (desktop only)
 * - Mobile detection and native pinch-to-zoom support
 */

class ImageModalManager {
    constructor() {
        // Geen constructor parameters nodig
    }

    /**
     * Initialiseer alle image modal functionaliteit
     * Moet worden aangeroepen nadat de DOM geladen is
     */
    init() {
        this.setupImageModal();
        this.setupImageClickHandlers();
    }

    /**
     * Setup image modal functionality
     */
    setupImageModal() {
        window.openImageModal = (src, alt) => {
            const modal = document.createElement('div');
            modal.id = 'image-modal';
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 cursor-pointer';
            modal.innerHTML = `
                <div class="relative max-w-7xl max-h-full">
                    <button class="absolute -top-10 right-0 text-white hover:text-gray-300 text-3xl font-bold" onclick="window.closeImageModal()">&times;</button>
                    <img src="${src}" alt="${alt}" class="max-w-full max-h-[90vh] object-contain rounded-lg">
                    <p class="text-white text-center mt-2">${alt}</p>
                </div>
            `;
            modal.onclick = (e) => {
                if (e.target === modal) {
                    window.closeImageModal();
                }
            };
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
        };
        
        window.closeImageModal = () => {
            const modal = document.getElementById('image-modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        };
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.closeImageModal();
            }
        });
    }
    
    /**
     * Setup image click handlers (desktop only)
     * On mobile, images are not clickable - users can use native pinch-to-zoom
     */
    setupImageClickHandlers() {
        // Function to check if device is mobile
        const isMobileDevice = () => {
            // Check viewport width (mobile = < 768px)
            if (window.innerWidth < 768) {
                return true;
            }
            // Check for touch capability (but not all touch devices are mobile)
            // Only consider it mobile if it's a small screen AND touch capable
            if ('ontouchstart' in window && window.innerWidth < 1024) {
                return true;
            }
            return false;
        };
        
        // Setup click handlers for images with modal containers
        const setupImageClicks = () => {
            const imageContainers = document.querySelectorAll('.image-modal-container');
            imageContainers.forEach(container => {
                // Remove any existing listeners by cloning
                const newContainer = container.cloneNode(true);
                container.parentNode.replaceChild(newContainer, container);
                
                // Only add click handler on desktop/tablet (not mobile)
                if (!isMobileDevice()) {
                    newContainer.style.cursor = 'pointer';
                    newContainer.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const src = newContainer.getAttribute('data-image-src');
                        const alt = newContainer.getAttribute('data-image-alt');
                        if (src && window.openImageModal) {
                            window.openImageModal(src, alt);
                        }
                    });
                } else {
                    // On mobile: remove cursor pointer and hover effects
                    newContainer.style.cursor = 'default';
                }
            });
        };
        
        // Setup immediately and on resize (in case user rotates device)
        setupImageClicks();
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setupImageClicks, 250);
        });
        
        // Also setup after content is loaded (for dynamically loaded content)
        setTimeout(setupImageClicks, 500);
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageModalManager;
} else {
    window.ImageModalManager = ImageModalManager;
}



