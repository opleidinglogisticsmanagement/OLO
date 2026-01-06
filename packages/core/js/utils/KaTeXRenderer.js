/**
 * KaTeXRenderer
 * 
 * Utility voor het renderen van LaTeX formules met KaTeX
 * Ondersteunt zowel inline als display (block) formules
 */

class KaTeXRenderer {
    /**
     * Render inline formula (in tekst)
     * @param {string} formula - LaTeX formula string
     * @returns {string} HTML string met gerenderde formule
     */
    static renderInline(formula) {
        if (!formula || typeof formula !== 'string') {
            console.warn('KaTeXRenderer.renderInline: Invalid formula', formula);
            return '';
        }
        
        try {
            if (typeof katex === 'undefined') {
                console.error('KaTeX library not loaded');
                return `<span class="text-red-600 dark:text-red-400">[KaTeX niet geladen: ${formula}]</span>`;
            }
            
            return katex.renderToString(formula, {
                throwOnError: false,
                displayMode: false,
                errorColor: '#cc0000'
            });
        } catch (e) {
            console.error('KaTeX render error:', e, 'Formula:', formula);
            return `<span class="text-red-600 dark:text-red-400">[Formule fout: ${formula}]</span>`;
        }
    }
    
    /**
     * Render display formula (centered, block)
     * @param {string} formula - LaTeX formula string
     * @returns {string} HTML string met gerenderde formule
     */
    static renderDisplay(formula) {
        if (!formula || typeof formula !== 'string') {
            console.warn('KaTeXRenderer.renderDisplay: Invalid formula', formula);
            return '';
        }
        
        try {
            if (typeof katex === 'undefined') {
                console.error('KaTeX library not loaded');
                return `<div class="text-red-600 dark:text-red-400 text-center my-4">[KaTeX niet geladen: ${formula}]</div>`;
            }
            
            return katex.renderToString(formula, {
                throwOnError: false,
                displayMode: true,
                errorColor: '#cc0000'
            });
        } catch (e) {
            console.error('KaTeX render error:', e, 'Formula:', formula);
            return `<div class="text-red-600 dark:text-red-400 text-center my-4">[Formule fout: ${formula}]</div>`;
        }
    }
    
    /**
     * Auto-render KaTeX formules in een HTML element
     * Detecteert \(...\) voor inline en \[...\] voor display
     * @param {HTMLElement} element - Element waarin formules gerenderd moeten worden
     */
    static autoRender(element) {
        if (!element) {
            return;
        }
        
        if (typeof renderMathInElement === 'undefined') {
            console.warn('KaTeX auto-render not available');
            return;
        }
        
        try {
            renderMathInElement(element, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\[', right: '\\]', display: true},
                    {left: '\\(', right: '\\)', display: false}
                ],
                throwOnError: false,
                errorColor: '#cc0000'
            });
        } catch (e) {
            console.error('KaTeX auto-render error:', e);
        }
    }
}

// Export voor gebruik in andere modules
if (typeof window !== 'undefined') {
    window.KaTeXRenderer = KaTeXRenderer;
}