/**
 * InteractiveManager
 * 
 * Handles all interactive components functionality:
 * - Accordions, tabs, clickable steps
 * - MC questions and navigation buttons
 * - Drag-and-drop handlers
 */

class InteractiveManager {
    constructor(moduleId) {
        this.moduleId = moduleId;
    }

    /**
     * Initialiseer alle interactieve componenten functionaliteit
     * Moet worden aangeroepen nadat de DOM geladen is
     */
    init() {
        this.setupInteractiveComponents();
        this.setupMCQuestionAndNavigationHandlers();
        this.setupDragAndDropHandlers();
    }

    /**
     * Setup event delegation for accordions and tabs
     * This ensures they work even when content is dynamically rendered
     */
    setupInteractiveComponents() {
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
        if (this.moduleId !== 'register') {
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
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveManager;
} else {
    window.InteractiveManager = InteractiveManager;
}
