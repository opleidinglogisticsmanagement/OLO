/**
 * Week1LessonPage
 * 
 * Specifieke pagina voor Week 1: Neuro-psycho-immunologie
 * Basis template voor collega's om content toe te voegen
 */

class Week1LessonPage extends BaseLessonPage {
    constructor() {
        super('week-1', 'Week 1', 'Neuro-psycho-immunologie');
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
                subtitle: "Onderzoek Uitvoeren",
                description: "De content voor deze module kon niet correct worden geladen. Controleer of het bestand week1.content.json bestaat en toegankelijk is."
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
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sm:pr-[70px] hover-lift">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-book text-blue-600 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h1 class="text-2xl font-bold text-gray-900 mb-2">${this.content.intro.title}: ${this.content.intro.subtitle}</h1>
                        <p class="text-gray-600 mb-4">${this.content.intro.description}</p>
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

        return `
            <!-- Video Sectie -->
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sm:pr-[70px] hover-lift">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-play text-red-600 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">${this.content.video.title}</h2>
                        ${this.content.video.url ? `
                            <div class="rounded-lg overflow-hidden mb-4 relative bg-black dark:bg-black w-full video-responsive-container" style="max-width: 100%;">
                                <div class="video-responsive-wrapper" style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; background-color: #000;">
                                    <iframe 
                                        src="${this.content.video.url}" 
                                        title="Video player" 
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                        referrerpolicy="strict-origin-when-cross-origin"
                                        allowfullscreen
                                        class="video-responsive-iframe"
                                        style="position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; border: 0 !important; margin: 0 !important; padding: 0 !important; background-color: #000;"
                                        loading="lazy">
                                    </iframe>
                                </div>
                            </div>
                            <style>
                                .video-responsive-container iframe.video-responsive-iframe {
                                    position: absolute !important;
                                    top: 0 !important;
                                    left: 0 !important;
                                    width: 100% !important;
                                    height: 100% !important;
                                    border: 0 !important;
                                    margin: 0 !important;
                                    padding: 0 !important;
                                }
                                .video-responsive-wrapper {
                                    position: relative !important;
                                    width: 100% !important;
                                    padding-bottom: 56.25% !important;
                                    height: 0 !important;
                                    overflow: hidden !important;
                                }
                            </style>
                        ` : `
                            <div class="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
                                <div class="text-center text-white">
                                    <i class="fas fa-play-circle text-6xl mb-4 opacity-75"></i>
                                    <p class="text-lg font-medium">Video Player</p>
                                    <p class="text-sm opacity-75">Video content komt hier</p>
                                </div>
                            </div>
                        `}
                        ${this.content.video.info ? `
                            <p class="text-sm text-gray-600">
                                <i class="fas fa-info-circle mr-1"></i>
                                ${this.content.video.info}
                            </p>
                        ` : ''}
                    </div>
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
        await this.loadContent();
        document.body.innerHTML = this.render();
        this.attachEventListeners();
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Week1LessonPage;
}
