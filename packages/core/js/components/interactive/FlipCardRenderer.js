/**
 * FlipCardRenderer
 * 
 * Utility voor het renderen van flip-card componenten
 * Een kaart met voorkant (vraag/stelling) en achterkant (antwoord/reactie)
 */

class FlipCardRenderer {
    /**
     * Render een flip-card component
     * @param {Object} item - Flip card item met front en back properties
     * @returns {string} HTML string
     */
    static renderFlipCard(item) {
        if (!item.front || !item.back) {
            console.warn('Flip card missing front or back:', item);
            return '';
        }

        const cardId = `flip-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render front content - kan string of array van content items zijn
        const frontContent = this.renderCardContent(item.front, 'front');
        
        // Render back content - kan string of array van content items zijn
        const backContent = this.renderCardContent(item.back, 'back');
        
        // Optionele titel
        const titleHtml = item.title ? 
            `<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">${HtmlUtils.escapeHtml(item.title)}</h3>` : '';

        const html = `
            <div class="flip-card-container mb-6" id="${cardId}">
                ${titleHtml}
                <div class="flip-card-inner" onclick="FlipCardRenderer.flipCard('${cardId}')">
                    <div class="flip-card-front">
                        <div class="flip-card-content">
                            ${frontContent}
                            <div class="flip-card-hint mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
                                <i class="fas fa-hand-pointer mr-2"></i>Klik om te draaien
                            </div>
                        </div>
                    </div>
                    <div class="flip-card-back">
                        <div class="flip-card-content">
                            ${backContent}
                            <div class="flip-card-hint mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
                                <i class="fas fa-redo mr-2"></i>Klik om terug te draaien
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script>
                (function() {
                    function initFlipCard() {
                        if (typeof FlipCardRenderer !== 'undefined') {
                            FlipCardRenderer.makeCardSquare('${cardId}');
                        } else {
                            // Wacht tot FlipCardRenderer beschikbaar is
                            setTimeout(initFlipCard, 50);
                        }
                    }
                    // Wacht tot DOM klaar is
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', function() {
                            setTimeout(initFlipCard, 100);
                        });
                    } else {
                        setTimeout(initFlipCard, 100);
                    }
                })();
            </script>
        `;
        
        return html;
    }

    /**
     * Render card content (front of back)
     * @param {string|Array} content - Content als string of array van content items
     * @param {string} side - 'front' of 'back'
     * @returns {string} HTML string
     */
    static renderCardContent(content, side) {
        if (typeof content === 'string') {
            // Als het HTML is (begint met <), return direct
            if (content.trim().startsWith('<')) {
                return content;
            }
            // Anders als paragraph
            return `<p class="text-gray-700 dark:text-gray-300">${HtmlUtils.escapeHtml(content)}</p>`;
        }
        
        if (Array.isArray(content)) {
            // Check of het content items zijn (objects met type property)
            const hasContentItems = content.some(item => 
                typeof item === 'object' && 
                item !== null && 
                item.type !== undefined
            );
            
            if (hasContentItems && typeof window.ContentRenderer !== 'undefined') {
                // Render als content items
                return ContentRenderer.renderContentItems(content);
            } else {
                // Render als strings
                return content.map(text => {
                    if (typeof text === 'string' && text.trim().startsWith('<')) {
                        return text;
                    }
                    return `<p class="text-gray-700 dark:text-gray-300 mb-3">${HtmlUtils.escapeHtml(text)}</p>`;
                }).join('');
            }
        }
        
        return '';
    }

    /**
     * Flip de kaart (toggle tussen front en back)
     * @param {string} cardId - ID van de flip card container
     */
    static flipCard(cardId) {
        const card = document.getElementById(cardId);
        if (!card) return;
        
        const inner = card.querySelector('.flip-card-inner');
        if (!inner) return;
        
        // Toggle flipped class
        inner.classList.toggle('flipped');
    }

    /**
     * Reset de kaart naar voorkant
     * @param {string} cardId - ID van de flip card
     */
    static resetFlipCard(cardId) {
        const card = document.getElementById(cardId);
        if (!card) return;
        
        const inner = card.querySelector('.flip-card-inner');
        if (!inner) return;
        
        inner.classList.remove('flipped');
    }

    /**
     * Maak de flip-card vierkant op basis van de content breedte
     * @param {string} cardId - ID van de flip card
     */
    static makeCardSquare(cardId) {
        const card = document.getElementById(cardId);
        if (!card) return;
        
        const front = card.querySelector('.flip-card-front');
        const back = card.querySelector('.flip-card-back');
        const inner = card.querySelector('.flip-card-inner');
        
        if (!front || !back || !inner) return;
        
        // Reset eerst eventuele eerdere aanpassingen
        front.style.width = '';
        front.style.height = '';
        front.style.minWidth = '';
        front.style.maxWidth = '';
        back.style.width = '';
        back.style.height = '';
        inner.style.width = '';
        inner.style.height = '';
        card.style.height = '';
        
        // Wacht even zodat de content volledig geladen is (inclusief afbeeldingen)
        setTimeout(() => {
            // Tijdelijk verwijder width constraints om natuurlijke breedte te meten
            front.style.minWidth = 'auto';
            front.style.maxWidth = 'none';
            front.style.width = 'auto';
            
            // Forceer een reflow om accurate metingen te krijgen
            void front.offsetWidth;
            
            // Meet de natuurlijke breedte en hoogte van de front content
            // Gebruik scrollWidth/scrollHeight voor de werkelijke content grootte
            const padding = 24 * 2; // 24px padding links en rechts
            const naturalWidth = front.scrollWidth;
            const naturalHeight = front.scrollHeight;
            
            // Maak de kaart vierkant: gebruik de grootste dimensie
            const targetSize = Math.max(naturalWidth, naturalHeight);
            
            // Stel de breedte en hoogte in voor een vierkante vorm
            front.style.width = targetSize + 'px';
            front.style.height = targetSize + 'px';
            front.style.minWidth = targetSize + 'px';
            front.style.maxWidth = targetSize + 'px';
            inner.style.width = targetSize + 'px';
            inner.style.height = targetSize + 'px';
            
            // Back moet dezelfde afmetingen hebben
            back.style.width = targetSize + 'px';
            back.style.height = targetSize + 'px';
            
            // Zorg dat de container de juiste hoogte heeft om overlap te voorkomen
            card.style.height = targetSize + 'px';
            
            // Pas afbeeldingen op de achterkant aan om binnen de kaart te passen
            this.adjustBackImages(back, targetSize - padding);
        }, 300);
    }
    
    /**
     * Pas afbeeldingen op de achterkant aan om binnen de kaart te passen
     * @param {HTMLElement} back - Het back element
     * @param {number} maxSize - Maximale grootte (breedte/hoogte) voor afbeeldingen
     */
    static adjustBackImages(back, maxSize) {
        if (!back) return;
        
        // Zoek alle afbeeldingen in de back content
        const images = back.querySelectorAll('img');
        images.forEach(img => {
            // Behoud de klikbaarheid (image-modal-container)
            const container = img.closest('.image-modal-container');
            if (container) {
                // Zorg dat de container niet groter wordt dan maxSize
                container.style.maxWidth = maxSize + 'px';
                container.style.maxHeight = maxSize + 'px';
                container.style.width = '100%';
                container.style.height = 'auto';
            }
            
            // Pas de afbeelding zelf aan
            img.style.maxWidth = '100%';
            img.style.maxHeight = maxSize + 'px';
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.style.objectFit = 'contain';
        });
    }
}

// Export voor gebruik in andere modules
if (typeof window !== 'undefined') {
    window.FlipCardRenderer = FlipCardRenderer;
}

