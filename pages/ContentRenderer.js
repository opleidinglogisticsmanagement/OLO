/**
 * ContentRenderer
 * 
 * Centrale utility voor het renderen van content items
 * Ondersteunt: paragraph, image, url, document, highlight
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
                case 'image':
                    currentImageIndex++;
                    const isLastImage = currentImageIndex === lastImageIndex;
                    return this.renderImage(item, { ...options, isLastImage });
                case 'url':
                    return this.renderUrl(item);
                case 'document':
                    return this.renderDocument(item);
                case 'highlight':
                    return this.renderHighlight(item);
                case 'html':
                    return this.renderHtml(item);
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
            return item.text.map(textItem => {
                const trimmedText = textItem.trim();
                // Als text begint met HTML tag, render direct
                if (trimmedText.startsWith('<')) {
                    return trimmedText;
                }
                // Anders wrap in <p> tag
                return `<p class="text-gray-700 mb-4">${textItem}</p>`;
            }).join('');
        } else {
            const trimmedText = String(item.text).trim();
            if (trimmedText.startsWith('<')) {
                return trimmedText;
            }
            return `<p class="text-gray-700 mb-4">${item.text}</p>`;
        }
    }

    /**
     * Render een image item
     * @param {Object} item - Image item met src en alt
     * @param {Object} options - Opties zoals isLastImage en enableModal
     * @returns {string} HTML string
     */
    static renderImage(item, options = {}) {
        const { isLastImage = false, enableModal = true } = options;

        if (!item.src || !item.alt) {
            console.warn('Image item missing src or alt:', item);
            return '';
        }

        const escapedAlt = item.alt.replace(/'/g, "\\'");
        const escapedSrc = item.src.replace(/'/g, "\\'");

        // Laatste image krijgt modal functionaliteit als enabled
        if (isLastImage && enableModal) {
            return `<div class="mb-4 relative overflow-hidden rounded-lg group cursor-pointer" onclick="window.openImageModal('${escapedSrc}', '${escapedAlt}')">
                <img src="${item.src}" alt="${item.alt}" class="rounded-lg w-full h-auto max-h-[600px] object-contain transition-transform duration-300 group-hover:scale-110">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <i class="fas fa-search-plus text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </div>
            </div>`;
        }

        // Normale image met hover zoom
        return `<div class="mb-4 overflow-hidden rounded-lg group">
            <img src="${item.src}" alt="${item.alt}" class="rounded-lg w-full h-auto max-h-[600px] object-contain transition-transform duration-300 group-hover:scale-105">
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
        const bgColor = item.bgColor || 'bg-blue-50';
        const borderColor = item.borderColor || 'border-blue-500';
        const titleColor = item.titleColor || 'text-blue-900';
        const contentColor = item.contentColor || 'text-blue-800';

        return `<div class="${bgColor} border-l-4 ${borderColor} p-4 rounded-r-lg mt-4 mb-4">
            <div class="flex items-start space-x-3">
                <i class="${iconClass} ${icon} text-blue-600 mt-1"></i>
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
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentRenderer;
} else {
    window.ContentRenderer = ContentRenderer;
}

