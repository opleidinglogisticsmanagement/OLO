/**
 * RegisterPage
 * 
 * Pagina voor het weergeven van een alfabetisch geordende begrippenlijst
 * Studenten kunnen op begrippen klikken om direct naar de relevante sectie te navigeren
 */

class RegisterPage extends BaseLessonPage {
    constructor() {
        super('register', 'Begrippenlijst', 'Alle belangrijke concepten');
        this.terms = [];
        this.filteredTerms = [];
        this.activeLetter = 'ALL';
    }

    /**
     * Laad begrippen uit JSON bestand
     */
    async loadTerms() {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:19',message:'loadTerms() called',data:{termsBefore:this.terms.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        try {
            // Voeg timestamp toe om caching te voorkomen
            const timestamp = new Date().getTime();
            const url = `./content/register.json?v=${timestamp}`;
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:23',message:'Before fetch',data:{url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            const response = await fetch(url);
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:26',message:'After fetch',data:{ok:response.ok,status:response.status,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            
            if (!response.ok) {
                throw new Error(`HTTP fout: ${response.status} ${response.statusText} bij laden van register.json`);
            }
            
            const data = await response.json();
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:32',message:'After JSON parse',data:{isArray:Array.isArray(data),dataLength:Array.isArray(data)?data.length:'N/A',dataType:typeof data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            
            if (!Array.isArray(data)) {
                throw new Error('Ongeldig data formaat: verwacht een array');
            }

            // Sorteer alfabetisch
            this.terms = data.sort((a, b) => a.term.localeCompare(b.term, 'nl'));
            this.filteredTerms = this.terms;
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:38',message:'After sorting',data:{termsCount:this.terms.length,filteredTermsCount:this.filteredTerms.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
        } catch (error) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:40',message:'Error caught in loadTerms',data:{errorMessage:error.message,errorName:error.name,termsAfterError:this.terms.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            console.error('Fout bij laden begrippenlijst:', error);
            this.error = error.message; // Sla error op voor weergave
            this.terms = [];
            this.filteredTerms = [];
        }
    }

    /**
     * Render module introductie
     */
    renderModuleIntro() {
        return `
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-book text-blue-600 dark:text-blue-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Begrippenlijst</h1>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">
                            Hier vind je alle <strong id="term-count">${this.terms.length}</strong> belangrijke begrippen uit de e-learning. Klik op een begrip om direct naar de sectie te navigeren waar dit concept wordt uitgelegd.
                        </p>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render content secties
     */
    renderContentSections() {
        return `
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift transition-colors duration-200">
                <!-- Zoekbalk en Filter -->
                <div class="mb-8">
                    <div class="flex flex-wrap gap-2 justify-center mb-6" id="alphabet-filter">
                        ${this.renderAlphabetFilter()}
                    </div>
                    <div class="relative">
                        <input type="text" id="term-search" placeholder="Zoek naar een begrip..." 
                            class="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors">
                        <i class="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
                    </div>
                </div>

                <!-- Lijst met begrippen -->
                <div id="terms-list" class="space-y-4">
                    <!-- Wordt gevuld door JavaScript -->
                    <div class="flex justify-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render alfabetische filter knoppen
     */
    renderAlphabetFilter() {
        const alphabet = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
        return alphabet.map(letter => `
            <button class="letter-filter w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 focus-ring
                ${letter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900'}"
                data-letter="${letter}"
                aria-label="Filter op letter ${letter}">
                ${letter}
            </button>
        `).join('');
    }

    /**
     * Render de lijst met begrippen
     */
    renderTermsList() {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:117',message:'renderTermsList() called',data:{termsCount:this.terms.length,filteredTermsCount:this.filteredTerms.length,hasError:!!this.error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        const container = document.getElementById('terms-list');
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:120',message:'Container check',data:{containerExists:!!container},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        if (!container) return;

        // Toon foutmelding als die er is
        if (this.error) {
            container.innerHTML = `
                <div class="text-center py-8 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <i class="fas fa-exclamation-circle mb-2 text-2xl"></i>
                    <p class="font-bold">Er is een fout opgetreden bij het laden van de begrippen.</p>
                    <p class="text-sm mt-1 opacity-80">${this.error}</p>
                </div>
            `;
            return;
        }

        if (this.filteredTerms.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <i class="fas fa-search mb-2 text-2xl"></i>
                    <p>Geen begrippen gevonden. Probeer een andere zoekterm of letter.</p>
                </div>
            `;
            return;
        }

        // Update term count if element exists
        const termCountEl = document.getElementById('term-count');
        if (termCountEl) {
            termCountEl.textContent = this.terms.length;
        }

        // Groepeer per letter voor duidelijkheid
        let currentLetter = '';
        let html = '';

        this.filteredTerms.forEach(item => {
            const firstLetter = item.term.charAt(0).toUpperCase();
            
            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;
                html += `
                    <div class="sticky top-0 bg-gray-50 dark:bg-gray-800 py-2 px-4 -mx-4 mb-2 mt-6 first:mt-0 border-b border-gray-200 dark:border-gray-700 z-10">
                        <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400">${currentLetter}</h3>
                    </div>
                `;
            }

            html += `
                <div class="group bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200">
                    <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                ${item.term}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                ${item.description}
                            </p>
                        </div>
                        <a href="${item.location.page}${item.location.anchor}" 
                           class="flex-shrink-0 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors focus-ring"
                           aria-label="Ga naar ${item.location.week}">
                            <i class="fas fa-book-open mr-1.5"></i>
                            ${item.location.week}
                        </a>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    /**
     * Filter begrippen op basis van letter en zoekterm
     */
    filterTerms(letter, searchQuery = '') {
        this.filteredTerms = this.terms.filter(item => {
            const matchesLetter = letter === 'ALL' || item.term.toUpperCase().startsWith(letter);
            const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesLetter && matchesSearch;
        });
        this.renderTermsList();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        super.attachEventListeners();

        // Letter filters
        document.querySelectorAll('.letter-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active state
                document.querySelectorAll('.letter-filter').forEach(b => {
                    b.classList.remove('bg-blue-600', 'text-white');
                    b.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
                });
                e.target.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
                e.target.classList.add('bg-blue-600', 'text-white');

                this.activeLetter = e.target.dataset.letter;
                const searchInput = document.getElementById('term-search');
                const searchValue = searchInput ? searchInput.value : '';
                this.filterTerms(this.activeLetter, searchValue);
            });
        });

        // Search input - ensure it works properly
        const searchInput = document.getElementById('term-search');
        if (searchInput) {
            // Store reference to 'this' for use in event handler
            const self = this;
            
            // Remove any existing event listeners by cloning and replacing
            const newSearchInput = searchInput.cloneNode(true);
            if (searchInput.parentNode) {
                searchInput.parentNode.replaceChild(newSearchInput, searchInput);
            }
            
            // Add event listener - filter on every input change
            newSearchInput.addEventListener('input', function(e) {
                const searchValue = e.target.value.trim();
                self.filterTerms(self.activeLetter, searchValue);
            });
        } else {
            console.error('Search input element (term-search) not found!');
        }
    }

    /**
     * Initialiseer de pagina
     */
    async init() {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:252',message:'init() called',data:{termsBeforeLoad:this.terms.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        await this.loadTerms();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:254',message:'After loadTerms() in init',data:{termsAfterLoad:this.terms.length,filteredTermsAfterLoad:this.filteredTerms.length,hasError:!!this.error,errorMessage:this.error||'none'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        document.body.innerHTML = this.render();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:256',message:'After render() in init',data:{termsCount:this.terms.length,bodyInnerHTMLLength:document.body.innerHTML.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        this.attachEventListeners();
        // Initial render of the list
        this.renderTermsList();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RegisterPage.js:260',message:'After renderTermsList() in init',data:{termsCount:this.terms.length,containerExists:!!document.getElementById('terms-list')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = RegisterPage;
    } else {
        window.RegisterPage = RegisterPage;
    }
    console.log('[RegisterPage] ✅ Exported to window');
} catch (error) {
    console.error('[RegisterPage] ❌ Error exporting:', error);
    // Force export even if there was an error
    try {
        window.RegisterPage = RegisterPage;
    } catch (e) {
        console.error('[RegisterPage] ❌ Failed to force export:', e);
    }
}

