/**
 * Sanitizer
 * 
 * Utility class voor het sanitizen van HTML content om XSS aanvallen te voorkomen.
 * Gebruikt DOMPurify indien beschikbaar, anders een fallback escape functie.
 */

class Sanitizer {
    /**
     * Sanitize HTML content
     * @param {string} html - De HTML string die gesanitized moet worden
     * @returns {string} Gesanitized HTML string
     */
    static sanitizeHTML(html) {
        if (!html) {
            return '';
        }

        // Convert to string if not already
        const htmlString = String(html);

        // Check if DOMPurify is available
        if (typeof window !== 'undefined' && window.DOMPurify) {
            // Use DOMPurify with safe configuration
            // Allow common HTML tags: p, b, i, u, strong, em, ul, ol, li, a, img, br, hr, h1-h6, span, div, blockquote, code, pre
            // Allow common attributes: href, src, alt, title, class, id, target, rel
            const config = {
                ALLOWED_TAGS: [
                    'p', 'b', 'i', 'u', 'strong', 'em', 'ul', 'ol', 'li', 
                    'a', 'img', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'span', 'div', 'blockquote', 'code', 'pre', 'table', 'thead', 
                    'tbody', 'tr', 'th', 'td', 'caption', 'colgroup', 'col'
                ],
                ALLOWED_ATTR: [
                    'href', 'src', 'alt', 'title', 'class', 'id', 'target', 
                    'rel', 'width', 'height', 'colspan', 'rowspan', 'scope',
                    'style' // Allow style for basic formatting, DOMPurify will sanitize it
                ],
                ALLOW_DATA_ATTR: false, // Disable data attributes for security
                KEEP_CONTENT: true, // Keep text content even if tags are removed
                RETURN_DOM: false, // Return string, not DOM
                RETURN_DOM_FRAGMENT: false,
                RETURN_TRUSTED_TYPE: false
            };

            try {
                return window.DOMPurify.sanitize(htmlString, config);
            } catch (error) {
                console.warn('[Sanitizer] DOMPurify error, falling back to escape:', error);
                return this.escapeHTML(htmlString);
            }
        } else {
            // Fallback: simple HTML escape
            console.warn('[Sanitizer] DOMPurify not available, using fallback escape. Consider loading DOMPurify for better security.');
            return this.escapeHTML(htmlString);
        }
    }

    /**
     * Escape HTML special characters (fallback method)
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHTML(text) {
        if (!text) {
            return '';
        }

        const textString = String(text);
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };

        return textString.replace(/[&<>"'/]/g, (char) => map[char]);
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sanitizer;
} else {
    window.Sanitizer = Sanitizer;
}

