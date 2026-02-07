/**
 * SearchService
 * 
 * Verantwoordelijk voor het indexeren en doorzoeken van content
 * uit alle modules in ICTO-BMR.
 */

class SearchService {
    constructor() {
        this.index = [];
        this.isInitialized = false;
        this.isLoading = false;
        
        // Configuratie van te indexeren bestanden voor ICTO-BMR
        this.files = [
            { id: 'wat-is-icto', path: 'content/wat-is-icto.content.json', url: 'wat-is-icto.html', title: 'Wat is ICTO' },
            { id: 'wat-doet-icto', path: 'content/wat-doet-icto.content.json', url: 'wat-doet-icto.html', title: 'Wat doet ICTO' },
            { id: 'waarom-icto', path: 'content/waarom-icto.content.json', url: 'waarom-icto.html', title: 'Waarom ICTO' }
        ];
    }

    /**
     * Initialiseer de service en bouw de index op
     */
    async init() {
        if (this.isInitialized || this.isLoading) return;
        
        this.isLoading = true;
        try {
            await this.buildIndex();
            this.isInitialized = true;
            console.log(`[SearchService] Geïndexeerd: ${this.index.length} items`);
        } catch (error) {
            console.error('[SearchService] Fout bij initialisatie:', error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Bouw de zoekindex op door alle JSON bestanden op te halen
     */
    async buildIndex() {
        const promises = this.files.map(file => this.fetchAndIndexFile(file));
        const results = await Promise.allSettled(promises);
        
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`[SearchService] Fout bij indexeren van ${this.files[index].path}:`, result.reason);
            }
        });
    }

    /**
     * Haal een bestand op en indexeer de content
     */
    async fetchAndIndexFile(file) {
        try {
            const response = await fetch(file.path);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const content = await response.json();
            
            // Indexeer de content
            this.indexContent(file, content);
        } catch (error) {
            console.error(`[SearchService] Fout bij ophalen van ${file.path}:`, error);
            throw error;
        }
    }

    /**
     * Indexeer content uit een JSON bestand
     */
    indexContent(file, content) {
        // Indexeer intro sectie
        if (content.intro) {
            this.addToIndex(file, 'intro', content.intro.title || '', content.intro.subtitle || '', content.intro.description || '');
        }

        // Indexeer theorie sectie
        if (content.theorie && content.theorie.content) {
            this.indexContentItems(file, 'theorie', content.theorie.content);
        }

        // Indexeer andere secties (praktijk, reflectie, etc.)
        const sections = ['praktijk', 'reflectie', 'bronvermelding'];
        sections.forEach(section => {
            if (content[section] && content[section].content) {
                this.indexContentItems(file, section, content[section].content);
            }
        });
    }

    /**
     * Indexeer content items recursief
     */
    indexContentItems(file, section, items) {
        items.forEach(item => {
            if (item.type === 'paragraph' && item.text) {
                const text = Array.isArray(item.text) ? item.text.join(' ') : item.text;
                // Strip HTML tags voor zoeken
                const plainText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                if (plainText) {
                    this.addToIndex(file, section, '', '', plainText);
                }
            } else if (item.type === 'heading' && item.text) {
                this.addToIndex(file, section, item.text, '', '');
            } else if (item.content && Array.isArray(item.content)) {
                // Recursief indexeren voor geneste content
                this.indexContentItems(file, section, item.content);
            }
        });
    }

    /**
     * Voeg een item toe aan de index
     */
    addToIndex(file, section, title, subtitle, text) {
        this.index.push({
            file: file.id,
            url: file.url,
            title: file.title,
            section: section,
            contentTitle: title,
            contentSubtitle: subtitle,
            text: text.toLowerCase(),
            originalText: text
        });
    }

    /**
     * Zoek in de index
     */
    search(query) {
        if (!this.isInitialized) {
            console.warn('[SearchService] Index nog niet geïnitialiseerd');
            return [];
        }

        if (!query || query.trim().length < 2) {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();
        const results = this.index
            .filter(item => {
                return item.text.includes(searchTerm) ||
                       item.contentTitle.toLowerCase().includes(searchTerm) ||
                       item.contentSubtitle.toLowerCase().includes(searchTerm);
            })
            .map(item => ({
                url: item.url,
                title: item.contentTitle || item.title,
                context: item.title,
                type: item.section,
                snippet: this.extractSnippet(item.originalText, searchTerm)
            }));

        // Sorteer op relevantie (hoe vaak de term voorkomt)
        return results.sort((a, b) => {
            const aMatches = (a.title + ' ' + a.snippet).toLowerCase().split(searchTerm).length - 1;
            const bMatches = (b.title + ' ' + b.snippet).toLowerCase().split(searchTerm).length - 1;
            return bMatches - aMatches;
        });
    }

    /**
     * Extract een snippet rondom de zoekterm
     */
    extractSnippet(text, searchTerm, maxLength = 150) {
        if (!text) return '';
        
        const lowerText = text.toLowerCase();
        const index = lowerText.indexOf(searchTerm);
        
        if (index === -1) {
            return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
        }

        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + searchTerm.length + 50);
        let snippet = text.substring(start, end);
        
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';
        
        return snippet;
    }
}

// Maak beschikbaar als globale class
window.SearchService = SearchService;
