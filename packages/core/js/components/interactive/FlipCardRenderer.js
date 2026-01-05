/**
 * FlipCardRenderer
 * 
 * Utility voor het renderen van flip-card componenten
 * Een kaart met voorkant (vraag/stelling) en achterkant (antwoord/reactie)
 */

class FlipCardRenderer {
    /**
     * Vaste formaten voor flip cards
     * Small: 250x300px
     * Medium: 350x400px (standaard)
     * Large: 450x500px
     */
    static CARD_SIZES = {
        small: { width: 250, height: 300 },
        medium: { width: 350, height: 400 },
        large: { width: 450, height: 500 }
    };

    /**
     * Render een flip-card component
     * @param {Object} item - Flip card item met front en back properties
     * @param {string} item.size - Optioneel: 'small', 'medium' (standaard), of 'large'
     * @returns {string} HTML string
     */
    static renderFlipCard(item) {
        if (!item.front || !item.back) {
            console.warn('Flip card missing front or back:', item);
            return '';
        }

        const cardId = `flip-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Bepaal het formaat (standaard: medium)
        const size = item.size && this.CARD_SIZES[item.size] ? item.size : 'medium';
        const dimensions = this.CARD_SIZES[size];
        const sizeClass = `flip-card-${size}`;
        
        // Render front content - kan string of array van content items zijn
        const frontContent = this.renderCardContent(item.front, 'front');
        
        // Render back content - kan string of array van content items zijn
        const backContent = this.renderCardContent(item.back, 'back');
        
        // Optionele titel
        const titleHtml = item.title ? 
            `<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">${HtmlUtils.escapeHtml(item.title)}</h3>` : '';

        const html = `
            <div class="flip-card-container mb-6 ${sizeClass}" id="${cardId}" data-flip-card-id="${cardId}" data-flip-card-size="${size}">
                ${titleHtml}
                <div class="flip-card-inner" onclick="FlipCardRenderer.flipCard('${cardId}')">
                    <div class="flip-card-front">
                        <div class="flip-card-content">
                            <div class="flip-card-content-wrapper">
                                ${frontContent}
                            </div>
                            <div class="flip-card-hint text-sm text-gray-500 dark:text-gray-400 italic">
                                <i class="fas fa-hand-pointer mr-2"></i>Klik om te draaien
                            </div>
                        </div>
                    </div>
                    <div class="flip-card-back">
                        <div class="flip-card-content">
                            <div class="flip-card-content-wrapper">
                                ${backContent}
                            </div>
                            <div class="flip-card-hint text-sm text-gray-500 dark:text-gray-400 italic">
                                <i class="fas fa-redo mr-2"></i>Klik om terug te draaien
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
     * Pas het vaste formaat toe op een flip card
     * @param {string} cardId - ID van de flip card container
     */
    static applyCardSize(cardId) {
        const card = document.getElementById(cardId);
        if (!card) return;
        
        const size = card.getAttribute('data-flip-card-size') || 'medium';
        const dimensions = this.CARD_SIZES[size];
        if (!dimensions) return;
        
        const front = card.querySelector('.flip-card-front');
        const back = card.querySelector('.flip-card-back');
        const inner = card.querySelector('.flip-card-inner');
        
        if (!front || !back || !inner) return;
        
        // Pas de vaste afmetingen toe
        front.style.width = dimensions.width + 'px';
        front.style.height = dimensions.height + 'px';
        front.style.minWidth = dimensions.width + 'px';
        front.style.maxWidth = dimensions.width + 'px';
        back.style.width = dimensions.width + 'px';
        back.style.height = dimensions.height + 'px';
        inner.style.width = dimensions.width + 'px';
        inner.style.height = dimensions.height + 'px';
        card.style.height = dimensions.height + 'px';
    }

    /**
     * @deprecated Gebruik applyCardSize() in plaats daarvan - vaste formaten worden nu gebruikt
     * Maak de flip-card vierkant op basis van de content breedte
     * @param {string} cardId - ID van de flip card
     */
    static makeCardSquare(cardId) {
        const card = document.getElementById(cardId);
        if (!card) {
            console.warn('[FlipCard] Card not found:', cardId);
            return;
        }
        
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
            // Tijdelijk verwijder width constraints en overflow om natuurlijke grootte te meten
            const originalFrontOverflow = front.style.overflow;
            const originalBackOverflow = back.style.overflow;
            const originalBackContentOverflow = back.querySelector('.flip-card-content')?.style.overflow;
            
            front.style.minWidth = 'auto';
            front.style.maxWidth = 'none';
            front.style.width = 'auto';
            front.style.height = 'auto';
            front.style.overflow = 'visible';
            
            back.style.minWidth = 'auto';
            back.style.maxWidth = 'none';
            back.style.width = 'auto';
            back.style.height = 'auto';
            back.style.overflow = 'visible';
            
            const backContent = back.querySelector('.flip-card-content');
            if (backContent) {
                backContent.style.overflow = 'visible';
                backContent.style.height = 'auto';
            }
            
            // Forceer een reflow om accurate metingen te krijgen
            void front.offsetWidth;
            void back.offsetWidth;
            
            // Wacht nog even voor content rendering - gebruik meerdere timeouts voor betere rendering
            setTimeout(() => {
                // Wacht nog een extra keer voor volledige rendering van alle content (met name tekst)
                // Verhoogde timeout voor betere rendering
                setTimeout(() => {
                    // Meet de natuurlijke breedte en hoogte van de content
                    // Gebruik een betere methode om de werkelijke content grootte te krijgen
                    const padding = 24 * 2; // 24px padding links en rechts (48px totaal)
                    const frontContent = front.querySelector('.flip-card-content');
                    
                    // Meet front: gebruik scrollWidth/scrollHeight
                    const frontWidth = front.scrollWidth;
                    let frontHeight = frontContent ? frontContent.scrollHeight : front.scrollHeight;
                    
                    // Meet ook de achterkant content - gebruik een betere methode
                    const backWidth = back.scrollWidth;
                    let backHeight = 0;
                    
                    if (backContent) {
                    // Wacht nog even zodat alle content volledig is gerenderd
                    // Meet de scrollHeight van de content - dit is de meest betrouwbare meting
                    // Maar wacht even zodat alle content (inclusief afbeeldingen) volledig is geladen
                    let contentScrollHeight = backContent.scrollHeight;
                    
                    // Als de content nog niet volledig is geladen, wacht even en meet opnieuw
                    // Dit voorkomt dat we een te grote hoogte meten
                    if (contentScrollHeight < 100) { // Als de hoogte te klein is, wacht even
                        setTimeout(() => {
                            contentScrollHeight = backContent.scrollHeight;
                        }, 100);
                    }
                    
                    // Gebruik de offsetHeight van de back card - dit is de totale hoogte inclusief padding
                    const backOffsetHeight = back.offsetHeight;
                    
                    // Voeg padding toe aan scrollHeight
                    const backStyles = window.getComputedStyle(back);
                    const backPaddingTop = parseFloat(backStyles.paddingTop) || 0;
                    const backPaddingBottom = parseFloat(backStyles.paddingBottom) || 0;
                    
                    // scrollHeight geeft de content hoogte zonder padding, voeg padding toe
                    // Maar gebruik een kleinere buffer omdat scrollHeight na sizing vaak kleiner blijkt te zijn
                    // Verminder met 5px om rekening te houden met het verschil tussen initiële en finale meting
                    backHeight = contentScrollHeight + backPaddingTop + backPaddingBottom - 5;
                } else {
                    backHeight = back.scrollHeight;
                }
                
                // Bepaal de benodigde afmetingen: gebruik de grootste dimensie van zowel voorkant als achterkant
                const maxWidth = Math.max(frontWidth, backWidth);
                const maxHeight = Math.max(frontHeight, backHeight);
                
                // Gebruik NIET een vierkante vorm - gebruik de werkelijke breedte en hoogte apart
                // Dit voorkomt dat de kaart onnodig groot wordt (bijv. 662x662px in plaats van 198x662px)
                const extraSpace = 0; // Geen extra ruimte - gebruik exact de gemeten hoogte
                const targetWidth = Math.max(maxWidth, 200); // Minimaal 200px breedte (kleiner dan 300px CSS min-width)
                const targetHeight = Math.max(maxHeight, 200); // Minimaal 200px hoogte
                // Gebruik de breedte en hoogte apart, niet als vierkant
                // targetSize wordt alleen gebruikt voor logging, niet voor sizing
                const targetSize = targetHeight; // Voor backwards compatibility in logs
                
                // Herstel overflow settings
                front.style.overflow = originalFrontOverflow || 'hidden';
                back.style.overflow = originalBackOverflow || 'hidden';
                if (backContent) {
                    backContent.style.overflow = originalBackContentOverflow || 'visible';
                }
                
                // Stel de breedte en hoogte in
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
                    }, 200); // Extra timeout voor volledige rendering
                }, 200);
        }, 300);
    }

    /**
     * Initialiseer alle flipcards in de DOM met vaste formaten
     * Deze functie wordt aangeroepen na het renderen van content
     */
    static initializeAllFlipCards() {
        const flipCards = document.querySelectorAll('[data-flip-card-id]');
        
        flipCards.forEach((card) => {
            const cardId = card.getAttribute('data-flip-card-id');
            if (cardId) {
                // Wacht even zodat alle content volledig is gerenderd
                setTimeout(() => {
                    this.applyCardSize(cardId);
                }, 100);
            }
        });
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

