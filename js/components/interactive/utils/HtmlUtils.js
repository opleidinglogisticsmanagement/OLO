/**
 * HtmlUtils
 * 
 * Utility functies voor HTML manipulatie en tekst normalisatie
 * Gebruikt door InteractiveRenderer en andere renderers
 */

class HtmlUtils {
    /**
     * Escape HTML om XSS te voorkomen
     * @param {string} text - Tekst die ge-escaped moet worden
     * @returns {string} Ge-escaped HTML string
     */
    static escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Normaliseer tekst voor vergelijking
     * Verwijdert interpunctie en normaliseert whitespace
     * @param {string} text - Tekst die genormaliseerd moet worden
     * @returns {string} Genormaliseerde tekst
     */
    static normalizeText(text) {
        if (!text) return '';
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .replace(/\s+/g, ' ');   // Normalize whitespace
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HtmlUtils;
} else {
    window.HtmlUtils = HtmlUtils;
}

