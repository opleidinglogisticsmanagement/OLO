/**
 * StartLessonPage
 * 
 * Specifieke pagina voor de Start/Home pagina met overzicht van de module
 */

class StartLessonPage extends BaseLessonPage {
    constructor() {
        super('start', 'Start', 'Opzetten van Logistieke Onderzoeken');
        // Constructor roept super() aan, dus this.layout, this.router en this.components zijn al geïnitialiseerd
    }

    /**
     * Initialiseer de pagina - overschrijft BaseLessonPage om sidebar bij te werken
     */
    async init() {
        // 1. Data laden (als er een loadContent methode is)
        if (this.loadContent) {
            await this.loadContent();
        }

        // 2. Check of de 'app shell' (sidebar + header) al bestaat
        const appContainer = document.getElementById('app');
        const sidebar = document.getElementById('sidebar');
        
        if (appContainer) {
            // SPA MODUS: Shell bestaat al
            // VERVANG de sidebar volledig met de juiste structuur van Layout
            if (sidebar) {
                // Render de sidebar opnieuw met de juiste structuur
                const newSidebarHTML = this.layout.renderSidebar(this.getModules(), this.moduleId);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newSidebarHTML;
                const newSidebar = tempDiv.querySelector('#sidebar');
                
                if (newSidebar) {
                    // Vervang de oude sidebar met de nieuwe
                    sidebar.replaceWith(newSidebar);
                }
            }
            
            // Update header als deze niet correct is
            const header = document.querySelector('header');
            if (header) {
                const newHeaderHTML = this.layout.renderHeader(this.moduleTitle);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newHeaderHTML;
                const newHeader = tempDiv.querySelector('header');
                
                if (newHeader) {
                    // Vervang de oude header met de nieuwe
                    header.replaceWith(newHeader);
                }
            }
            
            // Update alleen de content en titel
            this.router.updateMainContentOnly(() => this.renderMainContent(), this.moduleTitle, this.moduleSubtitle);
            this.router.updateActiveLink(this.moduleId);
        } else {
            // FULL LOAD MODUS: Render de hele pagina (eerste bezoek of refresh)
            document.body.innerHTML = this.render();
        }

        // 3. Event listeners koppelen (opnieuw nodig voor nieuwe content)
        this.attachEventListeners();
        
        // 4. Start de SPA router (onderschept links) - doe dit maar 1 keer
        if (!window.routerInitialized) {
            this.router.setupSPARouter();
            window.routerInitialized = true;
        }
    }

    /**
     * Render hoofdcontent gebied - overschrijft BaseLessonPage
     */
    renderMainContent() {
        return `
            <main id="main-content" class="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <div class="max-w-4xl mx-auto px-6 py-8">
                    <!-- Lesson Content -->
                    <article class="space-y-8 fade-in">
                        <!-- Course Title Section -->
                        <section class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white mb-8">
                            <h1 class="text-4xl font-bold mb-4">Opzetten van Logistieke Onderzoeken</h1>
                            <p class="text-blue-100 text-lg">Een praktijkgerichte module over het opzetten en uitvoeren van logistiek onderzoek</p>
                        </section>

                        <!-- General Information Section -->
                        <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-lift transition-colors duration-200">
                            <div class="flex flex-col sm:flex-row items-start">
                                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                                    <i class="fas fa-info-circle text-green-600 dark:text-green-400 text-lg"></i>
                                </div>
                                <div class="flex-1 min-w-0 w-full sm:w-auto">
                                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Over dit vak</h3>
                                    <div class="prose max-w-none">
                                        <p class="text-gray-700 dark:text-gray-300 mb-4">
                                            In deze module leer je hoe je een praktijkgericht logistiek onderzoek opzet en uitvoert. 
                                            Je leert hoe je een praktijkprobleem verkent en afbakent, hoe je een doelstelling formuleert, 
                                            en hoe je je onderzoeksopdracht positioneert binnen een groter onderzoeks- of innovatieproject.
                                        </p>
                                        <p class="text-gray-700 dark:text-gray-300 mb-4">
                                            Door middel van concrete voorbeelden en praktische opdrachten ga je aan de slag met het opzetten 
                                            van een logistiek onderzoek dat uitvoerbaar is binnen de beschikbare tijd en aansluit bij de vraag 
                                            van de opdrachtgever.
                                        </p>
                                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-6">Wat ga je leren?</h4>
                                        <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                            <li>Het verkennen en afbakenen van praktijkproblemen binnen een organisatie</li>
                                            <li>Het formuleren van doelstellingen voor praktijkgericht onderzoek</li>
                                            <li>Het positioneren van je onderzoeksopdracht binnen grotere projecten</li>
                                            <li>Het werken met opdrachtgevers en stakeholders</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Learning Outcome -->
                        <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-lift transition-colors duration-200">
                            <div class="flex flex-col sm:flex-row items-start">
                                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                                    <i class="fas fa-bullseye text-blue-600 dark:text-blue-400 text-lg"></i>
                                </div>
                                <div class="flex-1 min-w-0 w-full sm:w-auto">
                                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Leeruitkomst</h3>
                                    <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                        De student is als individu of onderdeel van een duo in staat om een gefundeerd onderzoeksplan op te stellen 
                                        waarin een knowledge gap wordt beschreven en gemaakte keuzes in de onderzoeksstrategie kunnen worden onderbouwd 
                                        aan de hand van een vraagstuk binnen de logistieke context. 
                                    </p>
                                </div>
                            </div>
                        </section>

                        <!-- Module Structure Section -->
                        <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-lift transition-colors duration-200">
                            <div class="flex flex-col sm:flex-row items-start">
                                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                                    <i class="fas fa-book text-green-600 dark:text-green-400 text-lg"></i>
                                </div>
                                <div class="flex-1 min-w-0 w-full sm:w-auto">
                                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Module Structuur</h3>
                                    
                                    <div class="prose max-w-none">
                                        <p class="text-gray-700 dark:text-gray-300 mb-4">
                                            Deze module is opgebouwd uit 7 weken, waarin je stap voor stap leert hoe je een logistiek onderzoek opzet. 
                                            Elke week bouwt voort op de kennis en vaardigheden uit de voorgaande week.
                                        </p>
                                        
                                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Overzicht van de weken</h4>
                                        <div class="flex flex-col gap-3 mb-6">
                                            <a href="week1.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block">
                                                <div class="flex items-center justify-between">
                                                    <div class="flex-1">
                                                        <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                            Week 1: Geen onderwijs i.v.m. studiereis
                                                        </h5>
                                                        <p class="text-gray-500 dark:text-gray-400 text-xs italic">
                                                            Geen onderwijs of voorbereiding deze week.
                                                        </p>
                                                    </div>
                                                    <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                                </div>
                                            </a>
                                            <a href="week2.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block">
                                                <div class="flex items-center justify-between">
                                                    <div class="flex-1">
                                                        <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                            Week 2: Van probleem naar doelstelling
                                                        </h5>
                                                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                            Je leert hoe je een praktijkprobleem verkent en afbakent, en hoe je een doelstelling formuleert met het a- en b-gedeelte. Je leert ook hoe je een doelstelling SMART maakt.
                                                        </p>
                                                    </div>
                                                    <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                                </div>
                                            </a>
                                            <a href="week3.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block">
                                                <div class="flex items-center justify-between">
                                                    <div class="flex-1">
                                                        <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                            Week 3: Onderzoeksmodel + Onderzoeksvragen
                                                        </h5>
                                                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                            Je leert hoe je een onderzoeksmodel opstelt en onderzoeksvragen formuleert voor je onderzoek.
                                                        </p>
                                                    </div>
                                                    <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                                </div>
                                            </a>
                                            <a href="week4.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block">
                                                <div class="flex items-center justify-between">
                                                    <div class="flex-1">
                                                        <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                            Week 4: Begripsbepaling + Voorbereiding literatuuronderzoek
                                                        </h5>
                                                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                            Je leert hoe je begrippen bepaalt en voorbereidt op het literatuuronderzoek.
                                                        </p>
                                                    </div>
                                                    <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                                </div>
                                            </a>
                                            <a href="week5.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block">
                                                <div class="flex items-center justify-between">
                                                    <div class="flex-1">
                                                        <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                            Week 5: Uitvoeren literatuuronderzoek + Theoretisch kader
                                                        </h5>
                                                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                            Je voert literatuuronderzoek uit en werkt aan je theoretisch kader.
                                                        </p>
                                                    </div>
                                                    <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                                </div>
                                            </a>
                                            <a href="week6.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block">
                                                <div class="flex items-center justify-between">
                                                    <div class="flex-1">
                                                        <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                            Week 6: Onderzoeksstrategie + dataverzamelingsplan
                                                        </h5>
                                                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                            Je bepaalt je onderzoeksstrategie en maakt een dataverzamelingsplan.
                                                        </p>
                                                    </div>
                                                    <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                                </div>
                                            </a>
                                            <a href="week7.html" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer focus-ring hover-lift block">
                                                <div class="flex items-center justify-between">
                                                    <div class="flex-1">
                                                        <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                                                            Week 7: Rapportage 1
                                                        </h5>
                                                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                                                            Je werkt aan de eerste rapportage van je onderzoeksplan.
                                                        </p>
                                                    </div>
                                                    <i class="fas fa-arrow-right text-sm text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"></i>
                                                </div>
                                            </a>
                                        </div>
                                        
                                        <!-- PDF Export Button -->
                                        <div class="mt-6 mb-8 flex justify-center">
                                            <button 
                                                id="export-pdf-btn" 
                                                class="flex items-center space-x-3 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus-ring transition-colors shadow-md hover:shadow-lg"
                                                aria-label="Exporteer alle content naar PDF">
                                                <i class="fas fa-file-pdf text-xl"></i>
                                                <span class="font-semibold">Exporteer alle content naar PDF</span>
                                            </button>
                                        </div>
                                        
                                        <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-r-lg mb-6">
                                            <div class="flex items-start space-x-3">
                                                <i class="fas fa-lightbulb text-blue-600 dark:text-blue-400 mt-1"></i>
                                                <div>
                                                    <h5 class="font-semibold text-blue-900 dark:text-blue-200 mb-1">Belangrijke Tip</h5>
                                                    <p class="text-blue-800 dark:text-blue-300 text-sm">
                                                        Neem de tijd om elke week goed door te nemen. Praktijkgericht onderzoek vraagt om zorgvuldige 
                                                        voorbereiding en afbakening. Begin daarom met het grondig verkennen van het probleem voordat 
                                                        je aan de slag gaat met het formuleren van doelstellingen.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </article>

                    <!-- Action Buttons -->
                    <div class="mt-12 flex justify-center items-center space-x-6">
                        <a href="week1.html" class="flex items-center space-x-2 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus-ring transition-colors">
                            <i class="fas fa-play"></i>
                            <span>Start Module</span>
                        </a>
                        
                        <a href="afsluiting.html" class="flex items-center space-x-2 px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 focus-ring transition-colors">
                            <i class="fas fa-graduation-cap"></i>
                            <span>Naar Afsluiting</span>
                        </a>
                    </div>
                </div>
            </main>
        `;
    }

    /**
     * Attach event listeners - overschrijft BaseLessonPage om PDF export te ondersteunen
     */
    attachEventListeners() {
        // Roep eerst de parent method aan voor basis event listeners
        super.attachEventListeners();

        // PDF Export functionality
        const exportPdfBtn = document.getElementById('export-pdf-btn');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', async () => {
                // Disable button tijdens export
                exportPdfBtn.disabled = true;
                exportPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin text-xl"></i><span class="font-semibold">Exporteren...</span>';
                
                try {
                    const exporter = new PDFExporter();
                    await exporter.exportAllContentToPDF();
                } catch (error) {
                    console.error('PDF export error:', error);
                    alert('Er is een fout opgetreden bij het exporteren. Probeer het opnieuw.');
                } finally {
                    // Re-enable button
                    exportPdfBtn.disabled = false;
                    exportPdfBtn.innerHTML = '<i class="fas fa-file-pdf text-xl"></i><span class="font-semibold">Exporteer alle content naar PDF</span>';
                }
            });
        }
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StartLessonPage;
} else {
    window.StartLessonPage = StartLessonPage;
}

