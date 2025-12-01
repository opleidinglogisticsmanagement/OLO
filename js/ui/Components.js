/**
 * Components Class
 * 
 * Verantwoordelijk voor het setup van alle UI componenten
 * Geëxtraheerd uit BaseLessonPage.js om de "God Class" op te splitsen
 */

class Components {
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

    /**
     * Setup event delegation for accordions and tabs
     * This ensures they work even when content is dynamically rendered
     * @param {string} moduleId - ID of the current module (for checking if register page)
     */
    setupInteractiveComponents(moduleId) {
        // Use a global flag to prevent multiple event listeners across all instances
        if (window._interactiveComponentsSetup) {
            return; // Already setup globally
        }
        window._interactiveComponentsSetup = true;
        
        // Setup event delegation that works reliably for both desktop and mobile
        // Use a single event listener on document that handles all accordions, tabs, and clickable steps
        // IMPORTANT: Only handle specific interactive components - let other buttons with inline onclick work normally
        const handleInteractiveClick = (e) => {
            // Only handle buttons that match our specific patterns
            // Don't interfere with other buttons that use inline onclick (like exercise buttons)
            
            const clickedButton = e.target.closest('button');
            if (!clickedButton) return; // Not a button click, let event continue
            
            // Check both onclick attribute (if still present) and data-onclick (if stored)
            let onclickAttr = clickedButton.getAttribute('onclick');
            if (!onclickAttr) {
                onclickAttr = clickedButton.getAttribute('data-onclick');
            }
            if (!onclickAttr) return; // No onclick data, let event continue
            
            // Early return for buttons we don't handle - let their inline onclick work normally
            // Only handle: toggleAccordion, toggleClickableStep, switchTab
            const isAccordionButton = onclickAttr.includes('toggleAccordion');
            const isClickableStepButton = onclickAttr.includes('toggleClickableStep');
            const isTabButton = onclickAttr.includes('switchTab');
            
            if (!isAccordionButton && !isClickableStepButton && !isTabButton) {
                // This is not one of our buttons (e.g., exercise buttons), let inline onclick work
                return;
            }
            
            // Check for accordion buttons
            if (isAccordionButton && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.toggleAccordion) {
                const match = onclickAttr.match(/toggleAccordion\('([^']+)',\s*'([^']+)',\s*([^)]+)\)/);
                if (match) {
                    // CRITICAL: Remove inline onclick FIRST to prevent it from executing
                    // This must happen in capture phase before the inline onclick runs
                    clickedButton.removeAttribute('onclick');
                    
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    const contentId = match[1];
                    const buttonId = match[2];
                    const usePlusIcon = match[3] === 'true';
                    
                    try {
                        window.InteractiveRenderer.toggleAccordion(contentId, buttonId, usePlusIcon);
                    } catch (err) {
                        console.error('Error toggling accordion:', err);
                    }
                    return false;
                }
            }
            
            // Check for clickable step buttons (used in week4)
            if (isClickableStepButton && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.toggleClickableStep) {
                // Match with or without allowMultiple parameter
                const match = onclickAttr.match(/toggleClickableStep\('([^']+)',\s*(\d+)(?:,\s*(true|false))?\)/);
                if (match) {
                    // CRITICAL: Remove inline onclick FIRST to prevent it from executing
                    clickedButton.removeAttribute('onclick');
                    
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    const stepsId = match[1];
                    const stepIndex = parseInt(match[2]);
                    // Default to true (allow multiple) if not specified
                    const allowMultiple = match[3] === undefined ? true : match[3] === 'true';
                    
                    try {
                        window.InteractiveRenderer.toggleClickableStep(stepsId, stepIndex, allowMultiple);
                    } catch (err) {
                        console.error('Error toggling clickable step:', err);
                    }
                    return false;
                }
            }
            
            // Check for tab buttons
            if (isTabButton && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.switchTab) {
                const match = onclickAttr.match(/switchTab\('([^']+)',\s*(\d+)\)/);
                if (match) {
                    // CRITICAL: Remove inline onclick FIRST to prevent it from executing
                    clickedButton.removeAttribute('onclick');
                    
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    const tabsId = match[1];
                    const tabIndex = parseInt(match[2]);
                    
                    try {
                        window.InteractiveRenderer.switchTab(tabsId, tabIndex);
                    } catch (err) {
                        console.error('Error switching tab:', err);
                    }
                    return false;
                }
            }
        };
        
        // Remove all inline onclick handlers from accordion/step/tab buttons immediately
        // This prevents double execution when both inline onclick and delegated handler fire
        // Store the onclick data in data attributes so the delegated handler can still use it
        const removeInlineOnclicks = () => {
            const buttons = document.querySelectorAll('button[onclick*="toggleAccordion"], button[onclick*="toggleClickableStep"], button[onclick*="switchTab"]');
            buttons.forEach(button => {
                const onclick = button.getAttribute('onclick');
                if (onclick && !button.hasAttribute('data-onclick-stored')) {
                    // Store onclick data before removing it
                    button.setAttribute('data-onclick', onclick);
                    button.setAttribute('data-onclick-stored', 'true');
                    button.removeAttribute('onclick');
                }
            });
        };
        
        // Remove onclicks immediately and whenever DOM changes
        removeInlineOnclicks();
        
        // Use MutationObserver to catch dynamically added buttons
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(() => {
                removeInlineOnclicks();
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // Add event listener in capture phase to execute BEFORE any remaining inline onclick handlers
        // This provides an additional safety net
        document.addEventListener('click', handleInteractiveClick, true);
        
        // Verify InteractiveRenderer is available
        let attempts = 0;
        const checkInteractiveRenderer = () => {
            if (typeof window.InteractiveRenderer !== 'undefined') {
                console.log('InteractiveRenderer is available - accordions and tabs should work');
            } else {
                attempts++;
                // Stop na 20 pogingen (2 seconden) om oneindige lussen op pagina's zonder interactieve elementen te voorkomen
                // zoals register.html, index.html, etc.
                if (attempts < 20) {
                    // Alleen loggen bij de eerste paar keer om console spam te voorkomen
                    if (attempts <= 3) {
                        console.warn('InteractiveRenderer not yet available - retrying...');
                    }
                    setTimeout(checkInteractiveRenderer, 100);
                } else {
                    console.log('InteractiveRenderer niet gevonden na timeout - waarschijnlijk niet nodig op deze pagina.');
                }
            }
        };
        
        // Alleen checken als we niet op de register pagina zijn (die heeft geen interactive renderer nodig)
        if (moduleId !== 'register') {
            checkInteractiveRenderer();
        }
    }

    /**
     * Setup event delegation for MC question answers and navigation buttons
     * This ensures they work even when HTML is dynamically inserted via innerHTML
     */
    setupMCQuestionAndNavigationHandlers() {
        // Use a global flag to prevent multiple event listeners
        if (window._mcAndNavHandlersSetup) {
            return; // Already setup globally
        }
        window._mcAndNavHandlersSetup = true;
        
        // Handle MC question answer selection (change events)
        document.addEventListener('change', (e) => {
            // Check if this is a radio button for MC questions
            const radio = e.target;
            if (radio.type === 'radio' && radio.name && radio.closest('.mc-question')) {
                // Get vraagId and answerId from data attributes (preferred method)
                const vraagId = radio.getAttribute('data-question-id') || radio.name;
                const answerId = radio.getAttribute('data-answer-id') || radio.value;
                
                if (vraagId && answerId && typeof window.MCQuestionRenderer !== 'undefined' && window.MCQuestionRenderer.handleAnswer) {
                    try {
                        window.MCQuestionRenderer.handleAnswer(vraagId, answerId);
                    } catch (err) {
                        console.error('Error handling MC answer:', err);
                    }
                }
            }
        }, true); // Use capture phase to catch events early
        
        // Handle navigation button clicks (using data-nav-href attribute)
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.nav-button');
            if (target) {
                const href = target.getAttribute('data-nav-href');
                if (href) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = href;
                    return;
                }
            }
            
            // Fallback: Handle navigation buttons with onclick attribute (for backward compatibility)
            const button = e.target.closest('button');
            if (button) {
                const onclickAttr = button.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes('window.location.href')) {
                    // Extract URL from onclick attribute
                    const match = onclickAttr.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
                    if (match) {
                        e.preventDefault();
                        e.stopPropagation();
                        const url = match[1];
                        window.location.href = url;
                    }
                }
            }
        }, false);
        
        // Handle "Volgende vraag" button clicks (using class selector)
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.next-mc-question-btn');
            if (target) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.MCQuestionRenderer !== 'undefined' && window.MCQuestionRenderer.loadNextQuestion) {
                    try {
                        window.MCQuestionRenderer.loadNextQuestion();
                    } catch (err) {
                        console.error('Error loading next question:', err);
                    }
                }
                return;
            }
            
            // Fallback: Handle buttons with onclick attribute (for backward compatibility)
            const button = e.target.closest('button');
            if (button) {
                const onclickAttr = button.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes('MCQuestionRenderer.loadNextQuestion')) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof window.MCQuestionRenderer !== 'undefined' && window.MCQuestionRenderer.loadNextQuestion) {
                        try {
                            window.MCQuestionRenderer.loadNextQuestion();
                        } catch (err) {
                            console.error('Error loading next question:', err);
                        }
                    }
                }
            }
        }, false);
        
        // Handle exercise check buttons (true/false and matching exercises)
        // This ensures buttons work even when content is dynamically rendered (e.g., in accordions)
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            
            const onclickAttr = button.getAttribute('onclick');
            if (!onclickAttr) return;
            
            // Check for true/false exercise check button
            if (onclickAttr.includes('checkTrueFalseExercise')) {
                const match = onclickAttr.match(/checkTrueFalseExercise\(['"]([^'"]+)['"]\)/);
                if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.checkTrueFalseExercise) {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        const exerciseId = match[1];
                        window.InteractiveRenderer.checkTrueFalseExercise(exerciseId);
                    } catch (err) {
                        console.error('Error checking true/false exercise:', err);
                    }
                    return;
                }
            }
            
            // Check for matching exercise check button
            if (onclickAttr.includes('checkMatchingExercise')) {
                const match = onclickAttr.match(/checkMatchingExercise\(['"]([^'"]+)['"]\)/);
                if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.checkMatchingExercise) {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        const exerciseId = match[1];
                        window.InteractiveRenderer.checkMatchingExercise(exerciseId);
                    } catch (err) {
                        console.error('Error checking matching exercise:', err);
                    }
                    return;
                }
            }
            
            // Check for SMART checklist "Bekijk analyse" button
            if (onclickAttr.includes('showSMARTResult')) {
                const match = onclickAttr.match(/showSMARTResult\(['"]([^'"]+)['"]\)/);
                if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.showSMARTResult) {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        const checklistId = match[1];
                        window.InteractiveRenderer.showSMARTResult(checklistId);
                    } catch (err) {
                        console.error('Error showing SMART result:', err);
                    }
                    return;
                }
            }
            
            // Check for Concept Quality checklist "Bekijk analyse" button
            if (onclickAttr.includes('showConceptQualityResult')) {
                const match = onclickAttr.match(/showConceptQualityResult\(['"]([^'"]+)['"]\)/);
                if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.showConceptQualityResult) {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        const checklistId = match[1];
                        window.InteractiveRenderer.showConceptQualityResult(checklistId);
                    } catch (err) {
                        console.error('Error showing concept quality result:', err);
                    }
                    return;
                }
            }
        }, false);
    }
    
    /**
     * Setup event delegation for drag-and-drop in matching exercises
     * This ensures drag-and-drop works even when content is dynamically rendered (e.g., in accordions)
     */
    setupDragAndDropHandlers() {
        // Use a global flag to prevent multiple event listeners
        if (window._dragAndDropHandlersSetup) {
            return; // Already setup globally
        }
        window._dragAndDropHandlersSetup = true;
        
        // Handle dragstart events for matching exercise items
        // Use capture phase to ensure we catch events before inline handlers
        document.addEventListener('dragstart', (e) => {
            const target = e.target;
            // Check if this is a draggable matching item
            if (target.draggable === true && target.classList.contains('matching-item')) {
                const ondragstartAttr = target.getAttribute('ondragstart');
                if (ondragstartAttr && ondragstartAttr.includes('handleDragStart')) {
                    // Extract exerciseId and itemIndex from the ondragstart attribute
                    const match = ondragstartAttr.match(/handleDragStart\(event,\s*['"]([^'"]+)['"],\s*(\d+)\)/);
                    if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.handleDragStart) {
                        // Remove the inline handler to prevent double execution
                        target.removeAttribute('ondragstart');
                        try {
                            const exerciseId = match[1];
                            const itemIndex = parseInt(match[2]);
                            window.InteractiveRenderer.handleDragStart(e, exerciseId, itemIndex);
                        } catch (err) {
                            console.error('Error handling drag start:', err);
                        }
                    }
                }
            }
        }, true); // Use capture phase
        
        // Handle dragover events for drop zones (categories)
        // Use capture phase to ensure we catch events before inline handlers
        document.addEventListener('dragover', (e) => {
            // Find drop zone - could be the target itself or a parent
            const dropZone = e.target.closest('[ondragover]') || e.target.closest('[id$="-category-0"]') || 
                            e.target.closest('[id$="-category-1"]') || e.target.closest('[id$="-category-2"]') ||
                            e.target.closest('[id$="-category-3"]') || e.target.closest('[id$="-category-4"]');
            
            if (dropZone) {
                const ondragoverAttr = dropZone.getAttribute('ondragover');
                if (ondragoverAttr && ondragoverAttr.includes('allowDrop')) {
                    // Extract exerciseId from the parent exercise container
                    const exerciseContainer = dropZone.closest('.matching-exercise');
                    if (exerciseContainer && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.allowDrop) {
                        // Remove the inline handler to prevent double execution (only once)
                        if (!dropZone.hasAttribute('data-dragover-handled')) {
                            dropZone.removeAttribute('ondragover');
                            dropZone.setAttribute('data-dragover-handled', 'true');
                        }
                        try {
                            e.preventDefault(); // Always prevent default to allow drop
                            window.InteractiveRenderer.allowDrop(e);
                        } catch (err) {
                            console.error('Error handling dragover:', err);
                        }
                    }
                } else {
                    // If no ondragover attribute but it's a category container, still allow drop
                    const exerciseContainer = dropZone.closest('.matching-exercise');
                    if (exerciseContainer && dropZone.id && dropZone.id.includes('-category-')) {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                    }
                }
            }
        }, true); // Use capture phase
        
        // Handle drop events for drop zones (categories)
        // Use capture phase to ensure we catch events before inline handlers
        document.addEventListener('drop', (e) => {
            // Find drop zone - could be the target itself or a parent
            // Try multiple strategies to find the drop zone
            let dropZone = e.target.closest('[ondrop]');
            if (!dropZone) {
                // Try finding by ID pattern (category containers)
                dropZone = e.target.closest('[id$="-category-0"]') || 
                          e.target.closest('[id$="-category-1"]') || 
                          e.target.closest('[id$="-category-2"]') ||
                          e.target.closest('[id$="-category-3"]') || 
                          e.target.closest('[id$="-category-4"]');
            }
            
            if (dropZone) {
                const ondropAttr = dropZone.getAttribute('ondrop');
                if (ondropAttr && ondropAttr.includes('handleDrop')) {
                    // Extract exerciseId and categoryIndex from the ondrop attribute
                    const match = ondropAttr.match(/handleDrop\(event,\s*['"]([^'"]+)['"],\s*(\d+)\)/);
                    if (match && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.handleDrop) {
                        // Remove the inline handler to prevent double execution (only once)
                        if (!dropZone.hasAttribute('data-drop-handled')) {
                            dropZone.removeAttribute('ondrop');
                            dropZone.setAttribute('data-drop-handled', 'true');
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                            const exerciseId = match[1];
                            const categoryIndex = parseInt(match[2]);
                            window.InteractiveRenderer.handleDrop(e, exerciseId, categoryIndex);
                        } catch (err) {
                            console.error('Error handling drop:', err);
                        }
                        return false;
                    }
                } else if (dropZone.id && dropZone.id.includes('-category-')) {
                    // Fallback: extract exerciseId and categoryIndex from ID if ondrop attribute was removed
                    const idMatch = dropZone.id.match(/^(.+)-category-(\d+)$/);
                    if (idMatch && typeof window.InteractiveRenderer !== 'undefined' && window.InteractiveRenderer.handleDrop) {
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                            const exerciseId = idMatch[1];
                            const categoryIndex = parseInt(idMatch[2]);
                            window.InteractiveRenderer.handleDrop(e, exerciseId, categoryIndex);
                        } catch (err) {
                            console.error('Error handling drop (fallback):', err);
                        }
                        return false;
                    }
                }
            }
        }, true); // Use capture phase
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

    /**
     * Setup dark mode toggle
     */
    setupDarkModeToggle() {
        // Retry mechanisme - wacht tot DarkMode.js geladen is
        const trySetup = (attempts = 0) => {
            const darkModeToggle = document.getElementById('dark-mode-toggle');
            const sunIcon = document.getElementById('dark-mode-icon-sun');
            const moonIcon = document.getElementById('dark-mode-icon-moon');
            
            if (!darkModeToggle) {
                // Toggle button bestaat nog niet (mogelijk nog niet gerenderd)
                if (attempts < 10) {
                    setTimeout(() => trySetup(attempts + 1), 100);
                }
                return;
            }
            
            if (window.DarkMode) {
                // Update icons on initial load
                this.updateDarkModeIcons(sunIcon, moonIcon);
                
                // Toggle dark mode on click
                darkModeToggle.addEventListener('click', () => {
                    window.DarkMode.toggle();
                    this.updateDarkModeIcons(sunIcon, moonIcon);
                });
                
                // Listen for dark mode changes (e.g., from other pages or system preference)
                window.addEventListener('darkModeChange', () => {
                    this.updateDarkModeIcons(sunIcon, moonIcon);
                });
            } else {
                // DarkMode.js nog niet geladen, probeer opnieuw
                if (attempts < 10) {
                    setTimeout(() => trySetup(attempts + 1), 100);
                } else {
                    console.warn('DarkMode.js kon niet worden geladen na 10 pogingen');
                }
            }
        };
        
        // Start setup (met kleine delay om zeker te zijn dat DOM klaar is)
        setTimeout(() => trySetup(), 50);
    }
    
    /**
     * Update dark mode icons based on current state
     */
    updateDarkModeIcons(sunIcon, moonIcon) {
        if (!sunIcon || !moonIcon || !window.DarkMode) return;
        
        const isDark = window.DarkMode.isDark();
        
        if (isDark) {
            // Dark mode: show moon, hide sun
            sunIcon.classList.add('rotate-90', 'scale-0', 'opacity-0');
            sunIcon.classList.remove('rotate-0', 'scale-100', 'opacity-100');
            moonIcon.classList.remove('rotate-0', 'scale-0', 'opacity-0');
            moonIcon.classList.add('rotate-0', 'scale-100', 'opacity-100');
        } else {
            // Light mode: show sun, hide moon
            sunIcon.classList.remove('rotate-90', 'scale-0', 'opacity-0');
            sunIcon.classList.add('rotate-0', 'scale-100', 'opacity-100');
            moonIcon.classList.add('rotate-0', 'scale-0', 'opacity-0');
            moonIcon.classList.remove('rotate-0', 'scale-100', 'opacity-100');
        }
    }

    /**
     * Setup global search functionality
     */
    async setupSearchFunctionality() {
        const searchInput = document.getElementById('global-search-input');
        const resultsDropdown = document.getElementById('search-results-dropdown');
        const searchToggleBtn = document.getElementById('search-toggle-btn');
        const searchOverlay = document.getElementById('search-overlay');
        const closeSearchBtn = document.getElementById('close-search-btn');
        
        if (!searchInput || !resultsDropdown) return;
        
        // Initialize search service (lazy load)
        if (window.SearchService && !window.SearchService.isInitialized) {
            // Start init in background
            window.SearchService.init().catch(console.error);
        }
        
        // Toggle Search Overlay Logic
        if (searchToggleBtn && searchOverlay) {
            const openSearch = () => {
                searchOverlay.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
                searchOverlay.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
                // Focus input after transition starts
                setTimeout(() => searchInput.focus(), 50);
            };

            const closeSearch = () => {
                searchOverlay.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
                searchOverlay.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                // Optional: Clear results when closing, but keep query text for now
                resultsDropdown.classList.add('hidden');
            };

            searchToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openSearch();
            });

            if (closeSearchBtn) {
                closeSearchBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeSearch();
                });
            }
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !searchOverlay.classList.contains('opacity-0')) {
                    closeSearch();
                }
            });
        }
        
        let debounceTimer;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (query.length < 2) {
                    resultsDropdown.classList.add('hidden');
                    resultsDropdown.innerHTML = '';
                    return;
                }
                
                if (window.SearchService) {
                    // Ensure initialized
                    if (!window.SearchService.isInitialized) {
                        window.SearchService.init().then(() => {
                            this.performSearch(query, resultsDropdown);
                        });
                    } else {
                        this.performSearch(query, resultsDropdown);
                    }
                }
            }, 300);
        });
        
        // Close dropdown on click outside
        document.addEventListener('click', (e) => {
            // Check if click is outside search input and dropdown
            const isOutsideSearch = !searchInput.contains(e.target) && !resultsDropdown.contains(e.target);
            
            // Also check if it's outside the toggle button (to prevent immediate closing when opening)
            const isOutsideToggle = !searchToggleBtn || !searchToggleBtn.contains(e.target);
            
            // If we have an overlay, check if we clicked the overlay background (outside the input container)
            // The input container is the first child of overlay
            let isOutsideContainer = true;
            if (searchOverlay && searchOverlay.contains(e.target)) {
                const container = searchOverlay.firstElementChild;
                if (container && container.contains(e.target)) {
                    isOutsideContainer = false;
                }
            }

            if (isOutsideSearch && isOutsideToggle) {
                resultsDropdown.classList.add('hidden');
                
                // If we clicked on the overlay background (and not the input container), close the whole search
                if (searchOverlay && !searchOverlay.classList.contains('opacity-0') && e.target === searchOverlay) {
                    searchOverlay.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
                    searchOverlay.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                }
            }
        });
        
        // Show results again on focus if there is a query
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.length >= 2 && resultsDropdown.children.length > 0) {
                resultsDropdown.classList.remove('hidden');
            }
        });
    }
    
    /**
     * Perform search and render results
     */
    performSearch(query, container) {
        const results = window.SearchService.search(query);
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Geen resultaten gevonden voor "${query}"
                </div>
            `;
        } else {
            container.innerHTML = results.map(result => `
                <a href="${result.url}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-blue-600 dark:text-blue-400">${result.context || result.week}</span>
                        <span class="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full uppercase tracking-wider">${result.type}</span>
                    </div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">${result.title}</div>
                    ${result.snippet ? `<div class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">${result.snippet}</div>` : ''}
                </a>
            `).join('');
        }
        
        container.classList.remove('hidden');
    }
}

// Export globally
window.Components = Components;

