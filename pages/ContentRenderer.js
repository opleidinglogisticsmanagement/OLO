/**
 * ContentRenderer
 * 
 * Centrale utility voor het renderen van content items
 * Ondersteunt: paragraph, image, url, document, highlight, accordion
 */

class ContentRenderer {
    /**
     * Render een array van content items
     * @param {Array} contentItems - Array van content items uit JSON
     * @param {Object} options - Opties voor rendering (bijv. modal support)
     * @returns {string} HTML string
     */
    static renderContentItems(contentItems, options = {}) {
        if (!contentItems || !Array.isArray(contentItems)) {
            return '';
        }

        const imageItems = contentItems.filter(item => item.type === 'image');
        const lastImageIndex = imageItems.length - 1;
        let currentImageIndex = -1;

        return contentItems.map(item => {
            switch (item.type) {
                case 'paragraph':
                    return this.renderParagraph(item);
                case 'heading':
                    return this.renderHeading(item);
                case 'image':
                    currentImageIndex++;
                    const isLastImage = currentImageIndex === lastImageIndex;
                    // Modal functionaliteit alleen als expliciet aangegeven in item zelf
                    // Als item.enableModal undefined is, gebruik dan false (niet klikbaar)
                    const enableModalForItem = item.enableModal === true;
                    return this.renderImage(item, { ...options, isLastImage, enableModal: enableModalForItem });
                case 'url':
                    return this.renderUrl(item);
                case 'video':
                    return this.renderVideo(item);
                case 'document':
                    return this.renderDocument(item);
                case 'highlight':
                    return this.renderHighlight(item);
                case 'html':
                    return this.renderHtml(item);
                case 'accordion':
                    return this.renderAccordion(item);
                case 'smartChecklist':
                    return this.renderSMARTChecklist(item);
                case 'learningObjectivesChecklist':
                    return this.renderLearningObjectivesChecklist(item);
                case 'matchingExercise':
                    return this.renderMatchingExercise(item);
                case 'trueFalseExercise':
                    return this.renderTrueFalseExercise(item);
                case 'sourceEvaluationExercise':
                    return this.renderSourceEvaluationExercise(item);
                case 'sequenceExercise':
                    return this.renderSequenceExercise(item);
                case 'steps':
                    return this.renderSteps(item);
                case 'clickableSteps':
                    return this.renderClickableSteps(item);
                case 'tabs':
                    return this.renderTabs(item);
                case 'conceptQualityChecklist':
                    return this.renderConceptQualityChecklist(item);
                case 'booleanOperatorExercise':
                    return this.renderBooleanOperatorExercise(item);
                case 'aiQueryExercise':
                    return this.renderAIQueryExercise(item);
                case 'aiBouwsteenGenerator':
                    return this.renderAIBouwsteenGenerator(item);
                default:
                    console.warn(`Unknown content type: ${item.type}`);
                    return '';
            }
        }).join('');
    }

    /**
     * Render een paragraph item
     * @param {Object} item - Paragraph item met type en text
     * @returns {string} HTML string
     */
    static renderParagraph(item) {
        if (!item.text) {
            return '';
        }

        if (Array.isArray(item.text)) {
            // Join all text items first, then process for table copy buttons
            const joinedHtml = item.text.map(textItem => {
                const trimmedText = textItem.trim();
                // Als text begint met HTML tag, render direct
                if (trimmedText.startsWith('<')) {
                    return trimmedText;
                }
                // Anders wrap in <p> tag
                return `<p class="text-gray-700 dark:text-gray-300 mb-4">${textItem}</p>`;
            }).join('');
            
            // Process the joined HTML for table copy buttons
            return this.processTableWithCopyButton(joinedHtml);
        } else {
            const trimmedText = String(item.text).trim();
            if (trimmedText.startsWith('<')) {
                return this.processTableWithCopyButton(trimmedText);
            }
            return `<p class="text-gray-700 dark:text-gray-300 mb-4">${item.text}</p>`;
        }
    }

    /**
     * Process HTML content to add copy buttons for tables with h3 titles
     * @param {string} html - HTML string to process
     * @returns {string} Processed HTML with copy buttons
     */
    static processTableWithCopyButton(html) {
        // Check if this HTML contains an h3 tag - if not, return as is
        if (!html.includes('<h3')) {
            return html;
        }
        
        // Use a more robust approach: find all h3 elements, then find the complete table structure after each
        // This ensures we always match the correct table for each h3
        const h3Pattern = /<h3([^>]*)>([^<]+)<\/h3>/gi;
        let processedHtml = html;
        let h3Match;
        let tableCounter = 0;
        const replacements = [];
        const h3Matches = [];
        
        // First, collect all h3 matches with their positions
        while ((h3Match = h3Pattern.exec(html)) !== null) {
            h3Matches.push({
                index: h3Match.index,
                fullMatch: h3Match[0],
                attrs: h3Match[1],
                text: h3Match[2],
                endIndex: h3Match.index + h3Match[0].length
            });
        }
        
        // Process each h3 and find its associated table
        for (let i = 0; i < h3Matches.length; i++) {
            const h3 = h3Matches[i];
            const searchStart = h3.endIndex;
            const searchEnd = i < h3Matches.length - 1 ? h3Matches[i + 1].index : html.length;
            const searchArea = html.substring(searchStart, searchEnd);
            
            // Find the div with overflow-x-auto that contains a table
            const divStartPattern = /<div[^>]*class="[^"]*overflow-x-auto[^"]*"[^>]*>/;
            const divMatch = searchArea.match(divStartPattern);
            
            if (divMatch) {
                const divStartInSearch = divMatch.index;
                const divStartInHtml = searchStart + divStartInSearch;
                
                // Find the matching closing </div> tag for this div
                // We need to count opening and closing div tags to find the right closing tag
                let divDepth = 1;
                let pos = divStartInSearch + divMatch[0].length;
                let closingDivIndex = -1;
                
                while (pos < searchArea.length && divDepth > 0) {
                    const nextOpenDiv = searchArea.indexOf('<div', pos);
                    const nextCloseDiv = searchArea.indexOf('</div>', pos);
                    
                    if (nextCloseDiv === -1) break;
                    
                    if (nextOpenDiv !== -1 && nextOpenDiv < nextCloseDiv) {
                        divDepth++;
                        pos = nextOpenDiv + 4;
                    } else {
                        divDepth--;
                        if (divDepth === 0) {
                            closingDivIndex = nextCloseDiv;
                            break;
                        }
                        pos = nextCloseDiv + 6;
                    }
                }
                
                if (closingDivIndex !== -1) {
                    // Found the complete div structure
                    const divEndInHtml = searchStart + closingDivIndex + 6; // +6 for </div>
                    const fullDivContent = html.substring(divStartInHtml, divEndInHtml);
                    
                    // Check if this div contains a table
                    if (fullDivContent.includes('<table')) {
                        tableCounter++;
                        // Use a more unique ID that includes timestamp and counter, plus a random component
                        const uniqueId = `${Date.now()}-${tableCounter}-${Math.random().toString(36).substr(2, 9)}`;
                        const tableId = `copyable-table-${uniqueId}`;
                        
                        // Find the table tag within the div and add the ID
                        const tableTagPattern = /<table([^>]*)>/;
                        const tableWithId = fullDivContent.replace(tableTagPattern, `<table$1 id="${tableId}">`);
                        
                        // Get the whitespace/content between h3 and div to preserve it
                        const whitespaceBetween = html.substring(h3.endIndex, divStartInHtml);
                        
                        // Create the full match from h3 to end of div
                        const fullMatch = html.substring(h3.index, divEndInHtml);
                        
                        // Create replacement with flex container for h3 and button, then whitespace, then the table with ID
                        const replacement = `<div class="flex items-center justify-between mb-4">
                                <h3${h3.attrs}>${h3.text}</h3>
                                <button 
                                    class="copy-table-btn ml-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 flex-shrink-0" 
                                    data-table-id="${tableId}"
                                    aria-label="Kopieer tabel"
                                    title="Kopieer tabel naar klembord">
                                    <i class="fas fa-copy"></i>
                                    <span class="hidden sm:inline">Kopieer tabel</span>
                                </button>
                            </div>
                            ${whitespaceBetween}${tableWithId}`;
                        
                        replacements.push({
                            original: fullMatch,
                            replacement: replacement
                        });
                    }
                }
            }
        }
        
        // Apply replacements in reverse order to maintain string indices
        for (let i = replacements.length - 1; i >= 0; i--) {
            processedHtml = processedHtml.replace(replacements[i].original, replacements[i].replacement);
        }
        
        return processedHtml;
    }

    /**
     * Render een heading item
     * @param {Object} item - Heading item met text, level (optioneel, default h2), en id (optioneel)
     * @returns {string} HTML string
     */
    static renderHeading(item) {
        if (!item.text) {
            return '';
        }
        
        const level = item.level || 2; // Default h2
        const id = item.id || '';
        const idAttr = id ? ` id="${id}"` : '';
        const scrollMargin = id ? ' scroll-mt-20' : '';
        
        return `<h${level} class="text-2xl font-bold text-gray-900 dark:text-white mb-0 mt-8${scrollMargin}"${idAttr}>${item.text}</h${level}>`;
    }

    /**
     * Render een image item
     * @param {Object} item - Image item met src, alt, en optioneel align, showAltText, enableModal en size
     * @param {Object} options - Opties zoals isLastImage en enableModal
     * @returns {string} HTML string
     */
    static renderImage(item, options = {}) {
        const { isLastImage = false, enableModal = false } = options;

        if (!item.src || !item.alt) {
            console.warn('Image item missing src or alt:', item);
            return '';
        }

        const escapedAlt = item.alt.replace(/'/g, "\\'");
        const escapedSrc = item.src.replace(/'/g, "\\'");
        
        // Support voor alignment (left, right, center)
        const align = item.align || 'left';
        const showAltText = item.showAltText !== false; // Default true, tenzij expliciet false
        
        // Size presets
        const sizePresets = {
            'tiny': { maxWidth: '150px', maxHeight: '120px' },
            'xsmall': { maxWidth: '200px', maxHeight: '160px' },
            'small': { maxWidth: '300px', maxHeight: '250px' },
            'medium': { maxWidth: '500px', maxHeight: '400px' },
            'large': { maxWidth: '700px', maxHeight: '600px' },
            'xlarge': { maxWidth: '900px', maxHeight: '750px' },
            'full': { maxWidth: '100%', maxHeight: '800px' },
            'auto': { maxWidth: '100%', maxHeight: 'none' }
        };
        
        // Bepaal size (default: medium)
        const size = item.size || 'medium';
        const sizeConfig = sizePresets[size] || sizePresets['medium'];
        
        // Custom maxWidth/maxHeight overschrijven presets als opgegeven
        const maxWidth = item.maxWidth ? `${item.maxWidth}px` : sizeConfig.maxWidth;
        const maxHeight = item.maxHeight ? `${item.maxHeight}px` : sizeConfig.maxHeight;
        
        // Maximale breedte voor rechts/centrum uitgelijnde afbeeldingen (alleen als size niet custom is)
        const maxWidthClass = (align === 'right' || align === 'center' && !item.maxWidth && size === 'medium') ? 'max-w-md' : '';
        
        // Alignment classes
        let alignClass = 'items-start';
        let imageContainerClass = 'mb-4';
        if (align === 'right') {
            alignClass = 'items-end';
            imageContainerClass += ' flex justify-end';
        } else if (align === 'center') {
            alignClass = 'items-center';
            imageContainerClass += ' flex justify-center';
        }
        
        // Bepaal of modal functionaliteit moet worden gebruikt
        // Op mobiel (< 768px): gebruik native pinch-to-zoom in plaats van modal
        // Op desktop/tablet: gebruik modal voor betere UX
        // Dit wordt gedaan met CSS media queries en JavaScript check
        const shouldUseModal = enableModal; // Will be filtered by CSS/JS for mobile
        
        // Container voor afbeelding en alt tekst
        // Alleen klikbaar met vergrootglas als enableModal expliciet true is EN niet op mobiel
        // Responsive: width 100% zodat afbeelding zich aanpast aan container, max-width als constraint
        const imageStyle = `width: 100%; max-width: ${maxWidth}; max-height: ${maxHeight}; height: auto;`;
        const imageHtml = shouldUseModal
            ? `<div class="relative overflow-hidden rounded-lg group image-modal-container" data-image-src="${escapedSrc}" data-image-alt="${escapedAlt}">
                <img src="${item.src}" alt="${item.alt}" class="rounded-lg h-auto w-full object-contain transition-transform duration-300 group-hover:scale-110 desktop-only-hover" style="${imageStyle}">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center desktop-only-hover">
                    <i class="fas fa-search-plus text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </div>
            </div>`
            : `<div class="overflow-hidden rounded-lg">
                <img src="${item.src}" alt="${item.alt}" class="rounded-lg h-auto w-full object-contain" style="${imageStyle}">
            </div>`;
        
        // Alt tekst onder afbeelding (als showAltText true is)
        // Voor kleinere afbeeldingen (niet full/auto), beperk alt-tekst tot afbeeldingbreedte
        const constrainAltText = size !== 'full' && size !== 'auto';
        const altTextHtml = showAltText 
            ? constrainAltText
                ? `<p class="text-sm text-gray-600 dark:text-gray-400 mt-2" style="max-width: ${maxWidth}; word-wrap: break-word; ${align === 'right' ? 'text-align: right; margin-left: auto;' : align === 'center' ? 'text-align: center; margin-left: auto; margin-right: auto;' : ''}">${item.alt}</p>`
                : `<p class="text-sm text-gray-600 dark:text-gray-400 mt-2">${item.alt}</p>`
            : '';
        
        // Combineer alles
        if (align === 'right' || align === 'center') {
            // Voor rechts/centrum: zet afbeelding en alt-tekst in een container met responsive max-width
            // Container past zich aan aan schermgrootte, maar respecteert max-width constraint
            return `<div class="${imageContainerClass}">
                <div class="responsive-image-container" style="max-width: ${maxWidth}; width: 100%; ${align === 'right' ? 'margin-left: auto;' : 'margin-left: auto; margin-right: auto;'}">
                    ${imageHtml}
                    ${altTextHtml}
                </div>
            </div>`;
        }
        
        // Links uitgelijnd (default)
        return `<div class="${imageContainerClass}">
            ${imageHtml}
            ${altTextHtml}
        </div>`;
    }

    /**
     * Render een URL link item
     * @param {Object} item - URL item met url, text, en optioneel target
     * @returns {string} HTML string
     */
    static renderUrl(item) {
        if (!item.url || !item.text) {
            console.warn('URL item missing url or text:', item);
            return '';
        }

        const target = item.target || '_blank';
        const classes = item.classes || 'text-blue-600 hover:text-blue-800 underline font-medium';
        
        return `<p class="mb-4">
            <a href="${item.url}" target="${target}" class="${classes}">${item.text}</a>
        </p>`;
    }

    /**
     * Render een embedded video item
     * @param {Object} item - Video item met url, title (optioneel), description (optioneel), en showLink (optioneel)
     * @returns {string} HTML string
     */
    static renderVideo(item) {
        if (!item.url) {
            console.warn('Video item missing url:', item);
            return '';
        }

        const title = item.title || '';
        const description = item.description || '';
        const showLink = item.showLink !== false; // Default true, kan worden uitgeschakeld
        const videoId = `video-${Math.random().toString(36).substr(2, 9)}`;
        
        // Handle Mediasite URLs - convert to embed format if needed
        let embedUrl = item.url;
        if (item.url.includes('media.windesheim.nl/Mediasite/Play/')) {
            // Mediasite URLs can be used directly, but ensure they work in iframes
            // If URL doesn't have embed path, try adding embed parameter
            if (!item.url.includes('/embed/') && !item.url.includes('?embed')) {
                // Try adding embed=true parameter for better compatibility
                const separator = item.url.includes('?') ? '&' : '?';
                embedUrl = `${item.url}${separator}embed=true`;
            }
        }
        
        return `
            <div class="mb-6">
                ${title ? `<h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${title}</h4>` : ''}
                <div class="rounded-lg overflow-hidden mb-2 relative bg-black dark:bg-black w-full video-responsive-container" id="${videoId}-container" style="max-width: 100%;">
                    <div class="video-responsive-wrapper" style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; background-color: #000;">
                        <iframe 
                            id="${videoId}"
                            src="${embedUrl}" 
                            title="${title || 'Video'}"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                            class="video-responsive-iframe"
                            style="position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; border: 0 !important; margin: 0 !important; padding: 0 !important; background-color: #000;"
                            data-video-url="${item.url}"
                            loading="lazy">
                        </iframe>
                    </div>
                    <div id="${videoId}-fallback" class="hidden absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center p-6 z-10">
                        <div class="text-center">
                            <i class="fas fa-exclamation-triangle text-yellow-600 dark:text-yellow-400 text-4xl mb-4"></i>
                            <p class="text-gray-700 dark:text-gray-200 font-semibold mb-2">Video kan niet worden geladen</p>
                            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">De video kan mogelijk niet worden ingesloten. Probeer de video te openen in een nieuw tabblad.</p>
                            <a href="${item.url}" target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium">
                                <i class="fas fa-external-link-alt mr-2"></i>Open video in nieuw tabblad
                            </a>
                        </div>
                    </div>
                </div>
                ${description ? `<p class="text-sm text-gray-600 dark:text-gray-300 mb-2">${description}</p>` : ''}
                ${showLink ? `<p class="text-sm mb-0">
                    <a href="${item.url}" target="_blank" class="text-blue-600 hover:text-blue-800 underline font-medium">
                        <i class="fas fa-external-link-alt mr-1"></i>Open video in nieuw tabblad
                    </a>
                </p>` : ''}
            </div>
            <style>
                /* Override global iframe styles for video containers */
                .video-responsive-container iframe.video-responsive-iframe {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    border: 0 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .video-responsive-wrapper {
                    position: relative !important;
                    width: 100% !important;
                    padding-bottom: 56.25% !important;
                    height: 0 !important;
                    overflow: hidden !important;
                }
            </style>
        `;
    }

    /**
     * Render een document link item
     * @param {Object} item - Document item met src, text, en optioneel icon
     * @returns {string} HTML string
     */
    static renderDocument(item) {
        if (!item.src || !item.text) {
            console.warn('Document item missing src or text:', item);
            return '';
        }

        const icon = item.icon || 'fa-file';
        const iconClass = item.iconClass || 'fas';
        const classes = item.classes || 'text-blue-600 hover:text-blue-800 underline font-medium';
        
        return `<p class="mb-4">
            <i class="${iconClass} ${icon} mr-2"></i>
            <a href="${item.src}" target="_blank" class="${classes}">${item.text}</a>
        </p>`;
    }

    /**
     * Render een highlight box item
     * @param {Object} item - Highlight item met title, content, en optioneel icon
     * @returns {string} HTML string
     */
    static renderHighlight(item) {
        if (!item.content) {
            console.warn('Highlight item missing content:', item);
            return '';
        }

        const title = item.title || '';
        const icon = item.icon || 'fa-info-circle';
        const iconClass = item.iconClass || 'fas';
        // Default colors with dark mode support - always add dark mode classes
        const bgColor = item.bgColor ? 
            (item.bgColor.includes('dark:') ? item.bgColor : `${item.bgColor} dark:bg-gray-800`) : 
            'bg-blue-50 dark:bg-blue-900/20';
        const borderColor = item.borderColor ? 
            (item.borderColor.includes('dark:') ? item.borderColor : `${item.borderColor} dark:border-gray-600`) : 
            'border-blue-500 dark:border-blue-400';
        const titleColor = item.titleColor ? 
            (item.titleColor.includes('dark:') ? item.titleColor : `${item.titleColor} dark:text-white`) : 
            'text-blue-900 dark:text-blue-200';
        const contentColor = item.contentColor ? 
            (item.contentColor.includes('dark:') ? item.contentColor : `${item.contentColor} dark:text-gray-300`) : 
            'text-blue-800 dark:text-blue-300';

        return `<div class="${bgColor} border-l-4 ${borderColor} p-4 rounded-r-lg mt-4 mb-4 transition-colors duration-200">
            <div class="flex items-start space-x-3">
                <i class="${iconClass} ${icon} text-blue-600 dark:text-blue-400 mt-1"></i>
                <div>
                    ${title ? `<h3 class="font-semibold ${titleColor} mb-1">${title}</h3>` : ''}
                    <div class="${contentColor} text-sm">
                        ${Array.isArray(item.content) 
                            ? item.content.map(c => `<p class="mb-2">${c}</p>`).join('')
                            : `<p>${item.content}</p>`
                        }
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * Render raw HTML content
     * @param {Object} item - HTML item met html property
     * @returns {string} HTML string
     */
    static renderHtml(item) {
        if (!item.html) {
            return '';
        }
        return item.html;
    }

    /**
     * Render accordion component (delegates to InteractiveRenderer)
     * @param {Object} item - Accordion item
     * @param {boolean} isNested - Whether this accordion is nested (passed through from parent)
     * @returns {string} HTML string
     */
    static renderAccordion(item, isNested = false) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderAccordion(item, isNested);
        }
        console.warn('InteractiveRenderer not loaded. Accordion will not render.');
        return '';
    }

    /**
     * Render SMART checklist component (delegates to InteractiveRenderer)
     * @param {Object} item - SMART checklist item
     * @returns {string} HTML string
     */
    static renderSMARTChecklist(item) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderSMARTChecklist(item);
        }
        console.warn('InteractiveRenderer not loaded. SMART checklist will not render.');
        return '';
    }

    /**
     * Render learning objectives checklist component (delegates to InteractiveRenderer)
     * @param {Object} item - Learning objectives checklist item
     * @returns {string} HTML string
     */
    static renderLearningObjectivesChecklist(item) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderLearningObjectivesChecklist(item);
        }
        console.warn('InteractiveRenderer not loaded. Learning objectives checklist will not render.');
        return '';
    }

    /**
     * Render matching exercise component (delegates to InteractiveRenderer)
     * @param {Object} item - Matching exercise item
     * @returns {string} HTML string
     */
    static renderMatchingExercise(item) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderMatchingExercise(item);
        }
        console.warn('InteractiveRenderer not loaded. Matching exercise will not render.');
        return '';
    }

    /**
     * Render true/false exercise component (delegates to InteractiveRenderer)
     * @param {Object} item - True/false exercise item
     * @returns {string} HTML string
     */
    static renderTrueFalseExercise(item) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderTrueFalseExercise(item);
        }
        console.warn('InteractiveRenderer not loaded. True/false exercise will not render.');
        return '';
    }

    /**
     * Render een bronbeoordelingsoefening
     */
    static renderSourceEvaluationExercise(item) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderSourceEvaluationExercise(item);
        }
        console.warn('InteractiveRenderer not loaded. Source evaluation exercise will not render.');
        return '';
    }

    /**
     * Render een sequence oefening
     */
    static renderSequenceExercise(item) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderSequenceExercise(item);
        }
        console.warn('InteractiveRenderer not loaded. Sequence exercise will not render.');
        return '';
    }

    /**
     * Render gestructureerde stappen (zonder bullets, met inspringing en spacing)
     * @param {Object} item - Steps item met steps array
     * @returns {string} HTML string
     */
    static renderSteps(item) {
        if (!item.steps || !Array.isArray(item.steps) || item.steps.length === 0) {
            return '';
        }

        const stepsHtml = item.steps.map(step => {
            // Als step een string is, wrap in <p>
            // Als step een object is met text property, gebruik die
            const stepText = typeof step === 'string' ? step : (step.text || '');
            return `<p class="mb-0">${stepText}</p>`;
        }).join('');

        return `<div class="ml-4 space-y-4 mb-4">${stepsHtml}</div>`;
    }

    /**
     * Render klikbare stappen component (delegates to InteractiveRenderer)
     * @param {Object} item - Clickable steps item met steps array
     * @returns {string} HTML string
     */
    static renderClickableSteps(item) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderClickableSteps(item);
        }
        console.warn('InteractiveRenderer not loaded. Clickable steps will not render.');
        return '';
    }

    /**
     * Render tabs component (delegates to InteractiveRenderer)
     * @param {Object} item - Tabs item met tabs array
     * @returns {string} HTML string
     */
    static renderTabs(item) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderTabs(item);
        }
        console.warn('InteractiveRenderer not loaded. Tabs will not render.');
        return '';
    }

    /**
     * Render concept quality checklist component (delegates to InteractiveRenderer)
     * @param {Object} item - Concept quality checklist item
     * @returns {string} HTML string
     */
    static renderConceptQualityChecklist(item) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderConceptQualityChecklist(item);
        }
        console.warn('InteractiveRenderer not loaded. Concept quality checklist will not render.');
        return '';
    }

    /**
     * Render boolean operator exercise component (delegates to InteractiveRenderer)
     * @param {Object} item - Boolean operator exercise item
     * @returns {string} HTML string
     */
    static renderBooleanOperatorExercise(item) {
        console.log('[ContentRenderer] renderBooleanOperatorExercise called', item);
        if (typeof window.InteractiveRenderer !== 'undefined') {
            const result = InteractiveRenderer.renderBooleanOperatorExercise(item);
            console.log('[ContentRenderer] renderBooleanOperatorExercise result length:', result ? result.length : 0);
            return result;
        }
        console.warn('InteractiveRenderer not loaded. Boolean operator exercise will not render.');
        return '';
    }

    /**
     * Render AI query exercise component (delegates to InteractiveRenderer)
     * @param {Object} item - AI query exercise item
     * @returns {string} HTML string
     */
    static renderAIQueryExercise(item) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderAIQueryExercise(item);
        }
        console.warn('InteractiveRenderer not loaded. AI query exercise will not render.');
        return '';
    }

    /**
     * Render AI Bouwsteen Generator component (delegates to InteractiveRenderer)
     * @param {Object} item - AI Bouwsteen Generator item
     * @returns {string} HTML string
     */
    static renderAIBouwsteenGenerator(item) {
        if (typeof window.InteractiveRenderer !== 'undefined') {
            return InteractiveRenderer.renderAIBouwsteenGenerator(item);
        }
        console.warn('InteractiveRenderer not loaded. AI Bouwsteen Generator will not render.');
        return '';
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentRenderer;
} else {
    window.ContentRenderer = ContentRenderer;
}

