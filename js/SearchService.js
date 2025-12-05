/**
 * SearchService
 * 
 * Verantwoordelijk voor het indexeren en doorzoeken van content
 * uit alle week-modules en de begrippenlijst.
 */

class SearchService {
    constructor() {
        this.index = [];
        this.isInitialized = false;
        this.isLoading = false;
        
        // Configuratie van te indexeren bestanden
        this.files = [
            { id: 'week-1', path: 'content/week1.content.json', url: 'week1.html', title: 'Week 1' },
            { id: 'week-2', path: 'content/week2.content.json', url: 'week2.html', title: 'Week 2' },
            { id: 'week-3', path: 'content/week3.content.json', url: 'week3.html', title: 'Week 3' },
            { id: 'week-4', path: 'content/week4.content.json', url: 'week4.html', title: 'Week 4' },
            { id: 'week-5', path: 'content/week5.content.json', url: 'week5.html', title: 'Week 5' },
            { id: 'week-6', path: 'content/week6.content.json', url: 'week6.html', title: 'Week 6' },
            { id: 'week-7', path: 'content/week7.content.json', url: 'week7.html', title: 'Week 7' },
            { id: 'register', path: 'content/register.json', url: 'register.html', title: 'Begrippenlijst' }
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
        // Reset index voordat we opnieuw indexeren
        this.index = [];
        
        const promises = this.files.map(file => this.fetchAndIndexFile(file));
        const results = await Promise.allSettled(promises);
        
        // Voeg succesvolle resultaten samen
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                this.index.push(...result.value);
            }
        });
    }

    /**
     * Haal een bestand op en indexeer de inhoud
     */
    async fetchAndIndexFile(fileInfo) {
        try {
            const response = await fetch(fileInfo.path);
            if (!response.ok) {
                // Stil falen als bestand niet bestaat (bv. week 7 nog niet klaar)
                if (response.status === 404) return [];
                throw new Error(`HTTP error ${response.status}`);
            }
            
            const data = await response.json();
            
            // Verschillende verwerking voor register vs content files
            if (fileInfo.id === 'register') {
                return this.indexRegister(data, fileInfo);
            } else {
                return this.indexContent(data, fileInfo);
            }
        } catch (error) {
            console.warn(`[SearchService] Kon ${fileInfo.path} niet indexeren:`, error);
            return [];
        }
    }

    /**
     * Indexeer de begrippenlijst
     */
    indexRegister(data, fileInfo) {
        if (!Array.isArray(data)) return [];
        
        return data.map(item => ({
            title: item.term,
            text: item.description,
            url: `${item.location?.page || fileInfo.url}${item.location?.anchor || ''}`,
            type: 'begrip',
            context: 'Begrippenlijst',
            week: item.location?.week || fileInfo.title
        }));
    }

    /**
     * Check of tekst een placeholder/template instructie is (voor collega's)
     */
    isPlaceholderText(text) {
        if (!text || typeof text !== 'string') return false;
        const lowerText = text.toLowerCase();
        const placeholderPatterns = [
            'voor collega\'s',
            'voor collega',
            'voeg hier',
            'formuleer hier',
            'formuleer pas wanneer',
            'wacht met het formuleren',
            'content komt hier',
            'deze module bevat verschillende secties',
            'voeg hier de specifieke',
            'voeg hier de theorie content toe',
            'voeg hier de theorie toe',
            'bestand kon niet worden geladen',
            'content kon niet worden geladen',
            'er is een probleem opgetreden',
            'controleer of het bestand bestaat'
        ];
        return placeholderPatterns.some(pattern => lowerText.includes(pattern));
    }

    /**
     * Check of content leeg of alleen placeholders bevat
     */
    hasRealContent(text) {
        if (!text || typeof text !== 'string') return false;
        const cleanText = text.trim();
        if (cleanText.length < 10) return false; // Te kort om echte content te zijn
        return !this.isPlaceholderText(cleanText);
    }

    /**
     * Indexeer een week content bestand
     */
    indexContent(data, fileInfo) {
        const items = [];
        
        // 1. Intro - alleen indexeren als het echte content is
        if (data.intro && data.intro.description && this.hasRealContent(data.intro.description)) {
            items.push({
                title: data.intro.title || fileInfo.title,
                subtitle: data.intro.subtitle,
                text: data.intro.description,
                url: fileInfo.url,
                type: 'intro',
                context: fileInfo.title,
                week: fileInfo.title
            });
        }

        // 2. Leerdoelen - alleen indexeren als er echte leerdoelen zijn (niet alleen instructies)
        if (data.leerdoelen) {
            // Filter placeholder instructies uit description
            let description = data.leerdoelen.description || '';
            if (this.isPlaceholderText(description)) {
                description = '';
            }
            
            // Negeer instruction veld (dat is altijd voor collega's)
            const leerdoelenItems = data.leerdoelen.items || [];
            const realItems = leerdoelenItems.filter(item => item && item.trim().length > 0);
            
            // Alleen indexeren als er echte leerdoelen zijn
            if (realItems.length > 0 || (description && this.hasRealContent(description))) {
                const leerdoelenText = [
                    description,
                    ...realItems
                ].filter(Boolean).join(' ');
                
                if (this.hasRealContent(leerdoelenText)) {
                    items.push({
                        title: data.leerdoelen.title || 'Leerdoelen',
                        text: leerdoelenText,
                        url: fileInfo.url,
                        type: 'leerdoelen',
                        context: fileInfo.title,
                        week: fileInfo.title
                    });
                }
            }
        }

        // 3. Video - alleen indexeren als het echte content is
        if (data.video) {
            const videoText = [
                data.video.description,
                data.video.info
            ].filter(Boolean).join(' ');
            
            // Alleen indexeren als er echte content is (niet placeholder)
            if (videoText && this.hasRealContent(videoText) && data.video.url) {
                items.push({
                    title: data.video.title || 'Video',
                    text: videoText,
                    url: fileInfo.url,
                    type: 'video',
                    context: `${fileInfo.title} - Video`,
                    week: fileInfo.title
                });
            }
        }

        // 4. Theorie Content (Recursief)
        if (data.theorie && data.theorie.content) {
            // Probeer huidige sectie/heading bij te houden voor betere deep-linking
            let currentAnchor = '';
            let currentSectionTitle = 'Theorie';

            const processContentItem = (item) => {
                // Update huidige sectie als we een heading met ID tegenkomen
                if (item.type === 'heading' && item.id) {
                    currentAnchor = `#${item.id}`;
                    currentSectionTitle = item.text;
                }

                // Indexeer op basis van type
                if (item.type === 'heading') {
                    items.push({
                        title: item.text,
                        text: '',
                        url: `${fileInfo.url}${item.id ? '#' + item.id : ''}`,
                        type: 'sectie',
                        context: fileInfo.title,
                        week: fileInfo.title
                    });
                } else if (item.type === 'paragraph') {
                    const text = Array.isArray(item.text) ? item.text.join(' ') : item.text;
                    // Alleen indexeren als het echte content is (niet placeholder)
                    if (text && this.hasRealContent(text)) {
                        items.push({
                            title: currentSectionTitle,
                            text: text,
                            url: `${fileInfo.url}${currentAnchor}`,
                            type: 'theorie',
                            context: `${fileInfo.title} > ${currentSectionTitle}`,
                            week: fileInfo.title
                        });
                    }
                } else if (item.type === 'accordion' || item.type === 'tabs') {
                    // Verwerk geneste items
                    const subItems = item.items || item.tabs || [];
                    subItems.forEach(subItem => {
                        // Titel van accordeon/tab
                        items.push({
                            title: subItem.title,
                            text: '',
                            url: `${fileInfo.url}${currentAnchor}`,
                            type: item.type,
                            context: `${fileInfo.title} > ${currentSectionTitle}`,
                            week: fileInfo.title
                        });

                        // Content van accordeon/tab
                        if (subItem.content) {
                            if (Array.isArray(subItem.content)) {
                                // Als het een array van content items is (zoals in tabs/accordion)
                                // Check of het strings zijn of objecten
                                subItem.content.forEach(contentPart => {
                                    if (typeof contentPart === 'string') {
                                        // Alleen indexeren als het echte content is (niet placeholder)
                                        if (this.hasRealContent(contentPart)) {
                                            items.push({
                                                title: subItem.title,
                                                text: contentPart,
                                                url: `${fileInfo.url}${currentAnchor}`,
                                                type: 'detail',
                                                context: `${fileInfo.title} > ${currentSectionTitle} > ${subItem.title}`,
                                                week: fileInfo.title
                                            });
                                        }
                                    } else if (typeof contentPart === 'object') {
                                        // Recursief verwerken als het een content object is
                                        processContentItem(contentPart);
                                    }
                                });
                            } 
                        }
                    });
                } else if (item.type === 'list') {
                    const listText = (item.items || []).join(' ');
                    // Alleen indexeren als het echte content is (niet placeholder)
                    if (listText && this.hasRealContent(listText)) {
                        items.push({
                            title: currentSectionTitle,
                            text: listText,
                            url: `${fileInfo.url}${currentAnchor}`,
                            type: 'lijst',
                            context: `${fileInfo.title} > ${currentSectionTitle}`,
                            week: fileInfo.title
                        });
                    }
                }
                // Andere types (image, etc.) slaan we over of voegen we toe indien relevant
            };

            data.theorie.content.forEach(processContentItem);
        }

        return items;
    }

    /**
     * Zoek in de index
     * @param {string} query - De zoekterm
     * @returns {Array} - Lijst met resultaten
     */
    search(query) {
        if (!query || query.trim().length < 2) return [];
        
        const normalizedQuery = query.toLowerCase().trim();
        const terms = normalizedQuery.split(/\s+/).filter(t => t.length > 0);
        
        // Score en filter resultaten
        const results = this.index.map(item => {
            let score = 0;
            const title = (item.title || '').toLowerCase();
            const subtitle = (item.subtitle || '').toLowerCase();
            const text = (item.text || '').toLowerCase();
            const context = (item.context || '').toLowerCase();

            // Exacte match in titel geeft hoge score
            if (title.includes(normalizedQuery)) score += 10;
            else if (terms.every(term => title.includes(term))) score += 5;
            
            // Match in subtitle/context
            if (subtitle.includes(normalizedQuery)) score += 4;
            if (context.includes(normalizedQuery)) score += 2;

            // Match in tekst
            if (text.includes(normalizedQuery)) score += 3;
            else {
                // Tel hoeveel termen voorkomen
                const matchCount = terms.filter(term => text.includes(term)).length;
                if (matchCount > 0) {
                    score += matchCount * 1;
                }
            }

            return { item, score };
        })
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(result => {
            // Highlight en snippet generatie
            const item = result.item;
            return {
                ...item,
                snippet: this.createSnippet(item.text, normalizedQuery)
            };
        });

        return results.slice(0, 10); // Top 10 resultaten
    }

    /**
     * Maak een snippet van de tekst met de zoekterm
     */
    createSnippet(text, query) {
        if (!text) return '';
        
        // Verwijder HTML tags voor snippet
        const cleanText = text.replace(/<[^>]*>/g, ' ');
        const lowerText = cleanText.toLowerCase();
        const index = lowerText.indexOf(query.split(' ')[0]); // Zoek eerste woord van query
        
        if (index === -1) return cleanText.substring(0, 100) + '...';
        
        const start = Math.max(0, index - 40);
        const end = Math.min(cleanText.length, index + query.length + 60);
        
        let snippet = cleanText.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < cleanText.length) snippet = snippet + '...';
        
        return snippet;
    }
}

// Maak globaal beschikbaar
window.SearchService = new SearchService();

