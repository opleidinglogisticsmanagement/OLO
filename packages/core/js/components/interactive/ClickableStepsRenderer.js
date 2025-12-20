/**
 * ClickableStepsRenderer
 * 
 * Utility voor het renderen van clickable steps componenten
 * Ondersteunt: geneste content items, allowMultiple, en mixed content (strings + content items)
 */

class ClickableStepsRenderer {
    /**
     * Render een klikbare stappen component
     * Laat studenten klikken op stappen om content te zien (alleen eerste stap is uitklapbaar)
     * @param {Object} item - Clickable steps item met steps array
     * @returns {string} HTML string
     */
    static renderClickableSteps(item) {
        if (!item.steps || !Array.isArray(item.steps) || item.steps.length === 0) {
            console.warn('Clickable steps item missing steps array:', item);
            return '';
        }

        const stepsId = `clickable-steps-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        // Allow multiple steps to be open at the same time (default: true for clickableSteps)
        const allowMultiple = item.allowMultiple !== false; // Default to true
        
        // Debug: log that we're rendering clickable steps
        console.log('Rendering clickable steps:', item.steps.length, 'steps', 'allowMultiple:', allowMultiple);
        
        // Render content for steps (expandable)
        const renderStepContent = (stepContent) => {
            if (!stepContent) return '';
            
            if (Array.isArray(stepContent)) {
                // Always check if any item contains HTML tags (like <table>, <div>, etc.)
                const hasHtmlTags = stepContent.some(item => {
                    if (typeof item === 'string') {
                        return /<[a-z][\s\S]*>/i.test(item);
                    }
                    return false;
                });
                
                // If HTML tags are found, render all content as raw HTML
                if (hasHtmlTags) {
                    return stepContent.map(item => {
                        // If it's an object with a type, render it using ContentRenderer
                        if (typeof item === 'object' && item !== null && item.type) {
                            if (typeof window.ContentRenderer !== 'undefined') {
                                return ContentRenderer.renderContentItems([item]);
                            }
                            return '';
                        }
                        // If it's a string, return as is (HTML will be preserved)
                        if (typeof item === 'string') {
                            return item;
                        }
                        return '';
                    }).join('');
                }
                
                // Otherwise, render normally (for text content)
                return stepContent.map(item => {
                    // If it's an object with a type, render it using ContentRenderer
                    if (typeof item === 'object' && item !== null && item.type) {
                        if (typeof window.ContentRenderer !== 'undefined') {
                            return ContentRenderer.renderContentItems([item]);
                        }
                        return '';
                    }
                    // If it's a string starting with HTML, return as is
                    if (typeof item === 'string' && item.trim().startsWith('<')) {
                        return item;
                    }
                    // Otherwise wrap in paragraph
                    return `<p class="text-gray-700 dark:text-gray-300 mb-3">${item}</p>`;
                }).join('');
            } else if (typeof stepContent === 'string') {
                // Check if string contains HTML tags
                if (/<[a-z][\s\S]*>/i.test(stepContent)) {
                    return stepContent;
                }
                if (stepContent.trim().startsWith('<')) {
                    return stepContent;
                }
                return `<p class="text-gray-700 dark:text-gray-300 mb-3">${stepContent}</p>`;
            }
            return '';
        };

        // Render clickable buttons for all steps, with content boxes after active steps
        const stepButtons = item.steps.map((step, index) => {
            const stepId = `${stepsId}-step-${index}`;
            const hasContent = step.content && (
                Array.isArray(step.content) ? step.content.length > 0 : 
                typeof step.content === 'string' ? step.content.trim().length > 0 :
                typeof step.content === 'object' ? true : false
            );
            
            // Get content HTML for this step
            let stepContentHtml = '';
            if (hasContent) {
                stepContentHtml = renderStepContent(step.content);
            }
            
            // Determine if step is open (all steps closed by default)
            const isOpen = false;
            
            const buttonHtml = `
                <button
                    class="w-full px-6 py-4 font-semibold text-lg transition-colors duration-200 ${isOpen ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500'} text-left cursor-pointer touch-manipulation"
                    ${hasContent ? `onclick="InteractiveRenderer.toggleClickableStep('${stepsId}', ${index}, ${allowMultiple})"` : ''}
                    ${!hasContent ? 'disabled' : ''}
                    id="${stepId}-button"
                    aria-expanded="${isOpen}"
                    aria-controls="${stepId}-content"
                >
                    <div class="flex items-center justify-between">
                        <span>${step.label || `Stap ${index + 1}`}</span>
                        ${hasContent ? `
                            <i class="fas fa-chevron-down transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}" id="${stepId}-icon"></i>
                        ` : `
                            <span class="text-xs text-gray-400 dark:text-gray-500 italic">(Binnenkort beschikbaar)</span>
                        `}
                    </div>
                </button>
            `;

            // Wrap button and content in a container for consistent spacing
            if (hasContent) {
                return `
                    <div class="clickable-step-wrapper">
                        ${buttonHtml}
                        <div
                            id="${stepId}-content"
                            class="clickable-step-content overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}"
                            style="${isOpen ? 'display: block;' : 'display: none;'}"
                            aria-hidden="${!isOpen}"
                        >
                            <div class="px-6 py-4">
                                ${stepContentHtml}
                            </div>
                        </div>
                    </div>
                `;
            }
            
            return `<div class="clickable-step-wrapper">${buttonHtml}</div>`;
        }).join('');

        return `
            <div class="clickable-steps-container mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-200" id="${stepsId}">
                <div class="space-y-0">
                    ${stepButtons}
                </div>
            </div>
        `;
    }

    /**
     * Toggle clickable step open/closed
     * @param {string} stepsId - ID of the steps container
     * @param {number} stepIndex - Index of the step to toggle
     * @param {boolean} allowMultiple - Whether multiple steps can be open at the same time
     */
    static toggleClickableStep(stepsId, stepIndex, allowMultiple = true) {
        const stepsContainer = document.getElementById(stepsId);
        if (!stepsContainer) return;

        const stepId = `${stepsId}-step-${stepIndex}`;
        const content = document.getElementById(`${stepId}-content`);
        const button = document.getElementById(`${stepId}-button`);
        const icon = document.getElementById(`${stepId}-icon`);
        
        if (!content || !button) return;

        const isOpen = content.style.display !== 'none' && content.classList.contains('opacity-100');
        
        if (isOpen) {
            // Close this step
            content.style.display = 'none';
            content.classList.remove('max-h-[5000px]', 'opacity-100');
            content.classList.add('max-h-0', 'opacity-0');
            content.setAttribute('aria-hidden', 'true');
            button.setAttribute('aria-expanded', 'false');
            
            // Update button styling
            button.classList.remove('bg-white', 'dark:bg-gray-800', 'text-green-600', 'dark:text-green-400');
            button.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
            
            // Rotate icon
            if (icon) {
                icon.classList.remove('rotate-180');
            }
        } else {
            // Only close all other steps if allowMultiple is false
            if (!allowMultiple) {
                const allSteps = stepsContainer.querySelectorAll('.clickable-step-content');
                
                allSteps.forEach((stepContent) => {
                    // Extract index from the content ID
                    const contentId = stepContent.id;
                    const match = contentId.match(/-step-(\d+)-content/);
                    if (!match) return;
                    
                    const currentIndex = parseInt(match[1], 10);
                    
                    // Skip the step we're about to open
                    if (currentIndex === stepIndex) return;
                    
                    const stepButtonId = stepContent.id.replace('-content', '-button');
                    const stepButton = document.getElementById(stepButtonId);
                    const stepIconId = stepContent.id.replace('-content', '-icon');
                    const stepIcon = document.getElementById(stepIconId);
                    
                    stepContent.style.display = 'none';
                    stepContent.classList.remove('max-h-[5000px]', 'opacity-100');
                    stepContent.classList.add('max-h-0', 'opacity-0');
                    stepContent.setAttribute('aria-hidden', 'true');
                    
                    if (stepButton) {
                        stepButton.setAttribute('aria-expanded', 'false');
                        stepButton.classList.remove('bg-white', 'dark:bg-gray-800', 'text-green-600', 'dark:text-green-400');
                        stepButton.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
                    }
                    
                    if (stepIcon) {
                        stepIcon.classList.remove('rotate-180');
                    }
                });
            }
            
            // Open this step
            content.style.display = 'block';
            content.classList.remove('max-h-0', 'opacity-0');
            content.classList.add('max-h-[5000px]', 'opacity-100');
            content.setAttribute('aria-hidden', 'false');
            button.setAttribute('aria-expanded', 'true');
            
            // Update button styling
            button.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
            button.classList.add('bg-white', 'dark:bg-gray-800', 'text-green-600', 'dark:text-green-400');
            
            // Rotate icon
            if (icon) {
                icon.classList.add('rotate-180');
            }
        }
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClickableStepsRenderer;
} else {
    window.ClickableStepsRenderer = ClickableStepsRenderer;
}

