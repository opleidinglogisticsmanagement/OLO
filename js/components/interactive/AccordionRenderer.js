/**
 * AccordionRenderer
 * 
 * Utility voor het renderen van accordion componenten
 * Ondersteunt: geneste accordions, plus icon, defaultOpen, en mixed content (strings + content items)
 */

class AccordionRenderer {
    /**
     * Render een accordion component
     * @param {Object} item - Accordion item met items array
     * @param {boolean} isNested - Whether this accordion is nested inside another accordion
     * @returns {string} HTML string
     */
    static renderAccordion(item, isNested = false) {
        if (!item.items || !Array.isArray(item.items) || item.items.length === 0) {
            console.warn('Accordion item missing items array:', item);
            return '';
        }

        const accordionId = `accordion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const usePlusIcon = item.usePlusIcon === true; // Use plus icon if explicitly set to true
        
        const accordionItems = item.items.map((accordionItem, index) => {
            const itemId = `${accordionId}-item-${index}`;
            const contentId = `${accordionId}-content-${index}`;
            // Check if item should be open: use item defaultOpen, then accordionItem defaultOpen, then default behavior
            const isOpen = accordionItem.defaultOpen === true || (!usePlusIcon && index === 0 && item.defaultOpen !== false);
            
            // Render content - can be string, array of strings, or array of content items
            let contentHtml = '';
            if (Array.isArray(accordionItem.content)) {
                // Check if it contains any content items (objects with type property)
                const hasContentItems = accordionItem.content.some(item => 
                    typeof item === 'object' && 
                    item !== null && 
                    item.type !== undefined
                );
                
                if (hasContentItems && typeof window.ContentRenderer !== 'undefined') {
                    // Render as content items (can be mixed with strings)
                    contentHtml = accordionItem.content.map(item => {
                        if (typeof item === 'object' && item !== null && item.type !== undefined) {
                            // It's a content item, render it
                            console.log('[AccordionRenderer] Rendering content item in accordion:', item.type);
                            // If it's an accordion, mark it as nested
                            if (item.type === 'accordion') {
                                return AccordionRenderer.renderAccordion(item, true);
                            }
                            const rendered = ContentRenderer.renderContentItems([item]);
                            console.log('[AccordionRenderer] Rendered content item, length:', rendered ? rendered.length : 0);
                            return rendered;
                        } else if (typeof item === 'string') {
                            // It's a string, render as HTML if it starts with <, otherwise as paragraph
                            if (item.trim().startsWith('<')) {
                                return item; // Already HTML
                            }
                            return `<p class="text-gray-700 dark:text-gray-300 mb-3">${item}</p>`;
                        }
                        return '';
                    }).join('');
                } else {
                    // Render as strings
                    contentHtml = accordionItem.content.map(text => {
                        if (typeof text === 'string' && text.trim().startsWith('<')) {
                            return text; // Already HTML
                        }
                        return `<p class="text-gray-700 dark:text-gray-300 mb-3">${text}</p>`;
                    }).join('');
                }
            } else if (typeof accordionItem.content === 'string') {
                contentHtml = `<p class="text-gray-700 dark:text-gray-300 mb-3">${accordionItem.content}</p>`;
            }

            // Choose icon based on usePlusIcon setting
            const iconClass = usePlusIcon 
                ? `fas fa-plus transform transition-transform duration-200 ${isOpen ? 'rotate-45' : ''} text-gray-600 dark:text-gray-300`
                : `fas fa-chevron-down transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-600 dark:text-gray-300`;

            // Different styling for nested accordions (like clickable steps - no border, seamless)
            const containerClass = isNested 
                ? `mb-3 overflow-hidden` 
                : `border border-gray-200 dark:border-gray-700 rounded-lg mb-3 overflow-hidden transition-colors duration-200`;
            const buttonClass = isNested
                ? `w-full px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 transition-colors duration-200 flex items-center justify-between text-left font-semibold text-lg text-gray-600 dark:text-gray-300 cursor-pointer touch-manipulation`
                : `w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors duration-200 flex items-center justify-between text-left cursor-pointer touch-manipulation`;
            const contentBgClass = isNested
                ? `bg-white dark:bg-gray-800`
                : `bg-white dark:bg-gray-800`;

            return `
                <div class="${containerClass}">
                    <button
                        class="${buttonClass}"
                        onclick="InteractiveRenderer.toggleAccordion('${contentId}', '${itemId}', ${usePlusIcon})"
                        aria-expanded="${isOpen}"
                        aria-controls="${contentId}"
                        id="${itemId}"
                    >
                        ${isNested ? `<span class="dark:text-gray-200">${accordionItem.title}</span>` : `<span class="font-semibold text-gray-900 dark:text-white text-lg">${accordionItem.title}</span>`}
                        <i class="${iconClass}" id="${itemId}-icon"></i>
                    </button>
                    <div
                        id="${contentId}"
                        class="accordion-content overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} ${contentBgClass}"
                        aria-hidden="${!isOpen}"
                        style="${isOpen ? '' : 'display: none;'}"
                    >
                        <div class="px-6 py-4">
                            ${contentHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="accordion-container mb-6" id="${accordionId}">
                ${accordionItems}
            </div>
        `;
    }

    /**
     * Toggle accordion item open/closed
     * @param {string} contentId - ID of the content div
     * @param {string} buttonId - ID of the button
     * @param {boolean} usePlusIcon - Whether to use plus icon rotation
     */
    static toggleAccordion(contentId, buttonId, usePlusIcon = false) {
        const content = document.getElementById(contentId);
        const button = document.getElementById(buttonId);
        const icon = document.getElementById(`${buttonId}-icon`);
        
        if (!content || !button) {
            console.warn('Accordion elements not found:', { contentId, buttonId, content: !!content, button: !!button });
            return;
        }

        const isOpen = content.classList.contains('max-h-[5000px]') || content.style.display === 'block';
        
        if (isOpen) {
            // Close
            content.classList.remove('max-h-[5000px]', 'opacity-100');
            content.classList.add('max-h-0', 'opacity-0');
            content.setAttribute('aria-hidden', 'true');
            button.setAttribute('aria-expanded', 'false');
            if (icon) {
                if (usePlusIcon) {
                    icon.classList.remove('rotate-45');
                } else {
                    icon.classList.remove('rotate-180');
                }
            }
            setTimeout(() => {
                content.style.display = 'none';
            }, 300);
        } else {
            // Open
            content.style.display = 'block';
            content.setAttribute('aria-hidden', 'false');
            button.setAttribute('aria-expanded', 'true');
            if (icon) {
                if (usePlusIcon) {
                    icon.classList.add('rotate-45');
                } else {
                    icon.classList.add('rotate-180');
                }
            }
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                content.classList.remove('max-h-0', 'opacity-0');
                content.classList.add('max-h-[5000px]', 'opacity-100');
            });
        }
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccordionRenderer;
} else {
    window.AccordionRenderer = AccordionRenderer;
}

