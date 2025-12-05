/**
 * Sanitizer
 * 
 * Utility voor het sanitizen van HTML content met DOMPurify
 * Voorkomt XSS aanvallen door alleen toegestane HTML tags toe te staan
 */

class Sanitizer {
    /**
     * Configuratie voor DOMPurify met toegestane HTML tags
     */
    static config = {
        ALLOWED_TAGS: [
            // Basis tekst formatting
            'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sub', 'sup',
            // Headings
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            // Lijsten
            'ul', 'ol', 'li', 'dl', 'dt', 'dd',
            // Links en media
            'a', 'img',
            // Code
            'code', 'pre', 'blockquote',
            // Divs en spans
            'div', 'span',
            // Tabel tags
            'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'colgroup', 'col'
        ],
        ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
            'width', 'height', 'colspan', 'rowspan', 'scope', 'headers'
        ]
    };

    /**
     * Sanitize HTML content met DOMPurify
     * @param {string} html - HTML string om te sanitizen
     * @returns {string} Gesanitized HTML string
     */
    static sanitize(html) {
        if (!html || typeof html !== 'string') {
            return '';
        }

        // Check of DOMPurify beschikbaar is
        if (typeof DOMPurify === 'undefined') {
            console.warn('DOMPurify is niet geladen. HTML wordt niet gesanitized.');
            return html;
        }

        // Sanitize met de configuratie
        return DOMPurify.sanitize(html, this.config);
    }
}

