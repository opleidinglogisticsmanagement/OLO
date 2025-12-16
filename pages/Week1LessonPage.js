/**
 * Week1LessonPage
 * 
 * Specifieke pagina voor Week 1: Neuro-psycho-immunologie
 * Basis template voor collega's om content toe te voegen
 */

// #region agent log
console.log('[DEBUG Week1] Script started, BaseLessonPage available:', !!window.BaseLessonPage);
fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Week1LessonPage.js:8',message:'Script started loading',data:{baseLessonPageAvailable:!!window.BaseLessonPage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

class Week1LessonPage extends BaseLessonPage {
    constructor() {
        super('week-1', 'Week 1', 'Onderzoeksplan Template');
        this.content = null;
        this.contentLoaded = false;
    }

    /**
     * Laad content uit JSON bestand met retry logica
     */
    async loadContent(retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Probeer verschillende paden
                const paths = [
                    './content/week1.content.json',
                    'content/week1.content.json',
                    '/content/week1.content.json'
                ];
                
                let lastError = null;
                for (const contentPath of paths) {
                    try {
                        console.log(`[Week1LessonPage] Loading content from: ${contentPath} (attempt ${attempt}/${retries})`);
                        const response = await fetch(contentPath, {
                            cache: 'no-cache',
                            headers: {
                                'Accept': 'application/json'
                            }
                        });
                        
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status} for path: ${contentPath}`);
                        }
                        
                        const contentType = response.headers.get('content-type');
                        if (!contentType || !contentType.includes('application/json')) {
                            console.warn(`[Week1LessonPage] Unexpected content-type: ${contentType}`);
                        }
                        
                        this.content = await response.json();
                        this.contentLoaded = true;
                        console.log('[Week1LessonPage] ✅ Content loaded successfully');
                        return; // Success, exit function
                    } catch (pathError) {
                        console.warn(`[Week1LessonPage] Failed to load from ${contentPath}:`, pathError.message);
                        lastError = pathError;
                        // Try next path
                    }
                }
                
                // All paths failed, throw last error
                throw lastError || new Error('All content paths failed');
            } catch (error) {
                console.error(`[Week1LessonPage] Error loading content (attempt ${attempt}/${retries}):`, error);
                
                if (attempt === retries) {
                    // Last attempt failed, use fallback
                    console.error('[Week1LessonPage] ❌ All attempts failed, using fallback content');
                    this.contentLoaded = false;
                    this.content = this.getFallbackContent();
                } else {
                    // Wait before retry (exponential backoff)
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    console.log(`[Week1LessonPage] Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
    }

    /**
     * Fallback content als JSON niet kan worden geladen
     */
    getFallbackContent() {
        return {
            intro: {
                title: "Week 1",
                subtitle: "Onderzoeksplan Template",
                description: "Welkom bij de module! Hier vind je het onderzoeksplan template dat je gedurende de module zult gebruiken."
            },
            leerdoelen: {
                title: "Leerdoelen",
                description: "Content kon niet worden geladen",
                items: [
                    "Het bestand week1.content.json kon niet worden geladen",
                    "Controleer of het bestand bestaat in de content folder",
                    "Controleer of er geen fouten zijn in de JSON structuur"
                ]
            },
            theorie: {
                title: "Theorie",
                content: [
                    {
                        type: "paragraph",
                        text: [
                            "Er is een probleem opgetreden bij het laden van de content. De pagina kon niet correct worden geladen."
                        ]
                    }
                ]
            },
            video: {
                title: "Video",
                description: "Video content kon niet worden geladen",
                url: "",
                info: "Content kon niet worden geladen. Controleer het JSON bestand."
            }
        };
    }

    /**
     * Render module introductie met content uit JSON
     */
    renderModuleIntro() {
        if (!this.content) {
            return this.renderErrorState();
        }

        return `
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift sticky top-[56px] sm:top-[64px] z-30 mb-6 sm:mb-8 transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-book text-blue-600 dark:text-blue-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${this.content.intro.title}: ${this.content.intro.subtitle}</h1>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">${this.content.intro.description}</p>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render content secties met content uit JSON
     */
    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }

        // Render theorie content
        let theorieHtml = '';
        const theorie = this.content.theorie;
        
        if (theorie && theorie.content && Array.isArray(theorie.content)) {
            theorieHtml = ContentRenderer.renderContentItems(theorie.content);
        }

        // Check of theorie bestaat en een title heeft
        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Theorie';

        return `
            <!-- Theorie Sectie -->
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start mb-6">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-file-alt text-purple-600 dark:text-purple-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">${theorieTitle}</h2>
                    </div>
                </div>
                <div class="prose max-w-none">
                    ${theorieHtml}
                </div>
            </section>
        `;
    }
    

    /**
     * Render error state als content niet kan worden geladen
     */
    renderErrorState() {
        return `
            <section class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <div class="flex items-start space-x-3">
                    <i class="fas fa-exclamation-triangle text-red-600 mt-1"></i>
                    <div>
                        <h3 class="font-semibold text-red-900 mb-1">Content Kon Niet Worden Geladen</h3>
                        <p class="text-red-800 text-sm">
                            Het bestand week1.content.json kon niet worden geladen. Controleer of het bestand bestaat en toegankelijk is.
                        </p>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Initialiseer de pagina met content loading
     */
    async init() {
        try {
            await this.loadContent();
            
            // Check of content correct is geladen
            if (!this.content || !this.contentLoaded) {
                console.error('[Week1LessonPage] ❌ Content not loaded properly');
                document.body.innerHTML = this.renderErrorState();
                return;
            }
            
            // Check of theorie sectie bestaat
            if (!this.content.theorie) {
                console.warn('[Week1LessonPage] ⚠️ Theorie section missing in content');
            }
            
            document.body.innerHTML = this.render();
            this.attachEventListeners();
        } catch (error) {
            console.error('[Week1LessonPage] ❌ Error during initialization:', error);
            document.body.innerHTML = this.renderErrorState();
        }
    }
}

// Export immediately after class definition to ensure it's always executed
// #region agent log
console.log('[DEBUG Week1] Reached export, class defined:', typeof Week1LessonPage !== 'undefined');
fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Week1LessonPage.js:232',message:'Reached export statement',data:{classDefined:typeof Week1LessonPage!=='undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Week1LessonPage;
    } else {
        window.Week1LessonPage = Week1LessonPage;
    }
    // #region agent log
    console.log('[DEBUG Week1] Export successful, window.Week1LessonPage:', !!window.Week1LessonPage, 'at', new Date().toISOString());
    fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Week1LessonPage.js:243',message:'Export successful',data:{exported:!!window.Week1LessonPage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.log('[Week1LessonPage] ✅ Exported to window');
} catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Week1LessonPage.js:235',message:'Export error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.error('[Week1LessonPage] ❌ Error exporting:', error);
    try {
        window.Week1LessonPage = Week1LessonPage;
    } catch (e) {
        console.error('[Week1LessonPage] ❌ Failed to force export:', e);
    }
}
