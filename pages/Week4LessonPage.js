/**
 * Week4LessonPage
 * 
 * Specifieke pagina voor Week 4: Begripsbepaling + Voorbereiding literatuuronderzoek
 * Basis template voor collega's om content toe te voegen
 */

class Week4LessonPage extends BaseLessonPage {
    constructor() {
        super('week-4', 'Week 4', 'Begripsbepaling + Voorbereiding literatuuronderzoek');
        this.content = null;
        this.contentLoaded = false;
        // API key is no longer needed on client-side (handled by server)
        // Keeping for backward compatibility but not required
        this.apiKey = (window.AppConfig && window.AppConfig.geminiApiKey) || null;
        this.aiGenerator = null;
        this.mcQuestions = null;
        this.currentQuestion = null; // For one-at-a-time mode
        this.questionCounter = 0; // Track how many questions shown
        this.cachedTheoryContent = null; // Cache for theory content (Optie 2)
        this.prefetchedQuestion = null; // OPTIE 4: Prefetch next question
        this.isPrefetching = false; // Track if prefetch is in progress
        this.isGeneratingQuestion = false; // Track if first question is being generated
        this.segmentIndex = 0; // Track which text segment to use (for variety)
        this.usedSegments = []; // Track recently used segments to avoid repetition
        this.totalSegments = null; // Cache total number of segments
    }

    /**
     * Laad content uit JSON bestand
     */
    async loadContent() {
        try {
            // Add timestamp to prevent caching issues
            const response = await fetch(`./content/week4.content.json?v=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.content = await response.json();
            this.contentLoaded = true;
        } catch (error) {
            console.error('Error loading content:', error);
            this.contentLoaded = false;
            this.content = this.getFallbackContent(error.message);
        }
    }

    /**
     * Fallback content als JSON niet kan worden geladen
     */
    getFallbackContent(errorMessage = "") {
        return {
            intro: {
                title: "Week 4",
                subtitle: "Begripsbepaling + Voorbereiding literatuuronderzoek",
                description: `De content voor deze module kon niet correct worden geladen. Controleer of het bestand week4.content.json bestaat en toegankelijk is.<br><br><strong>Foutmelding:</strong> ${errorMessage}`
            },
            leerdoelen: {
                title: "Leerdoelen",
                description: "Content kon niet worden geladen",
                items: [
                    "Het bestand week4.content.json kon niet worden geladen",
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
                    },
                    // Dummy headings to prevent navigation errors
                    {
                        type: "heading",
                        text: "Definiëren van begrippen (Niet beschikbaar)",
                        level: 2,
                        id: "definieren-begrippen"
                    },
                    {
                        type: "paragraph",
                        text: ["Content niet beschikbaar."]
                    },
                    {
                        type: "heading",
                        text: "Het uitvoeren van literatuuronderzoek (Niet beschikbaar)",
                        level: 2,
                        id: "literatuuronderzoek"
                    },
                    {
                        type: "paragraph",
                        text: ["Content niet beschikbaar."]
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
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift transition-colors duration-200">
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

        return `
            <!-- Leerdoelen Sectie -->
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-bullseye text-green-600 dark:text-green-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        ${this.content.leerdoelen.interactive && this.content.leerdoelen.items && this.content.leerdoelen.items.length > 0
                            ? ContentRenderer.renderLearningObjectivesChecklist({
                                title: this.content.leerdoelen.title,
                                description: this.content.leerdoelen.description,
                                items: this.content.leerdoelen.items,
                                storageKey: 'week4-learning-objectives'
                            })
                            : `
                                <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">${this.content.leerdoelen.title}</h2>
                                <div class="prose max-w-none">
                                    ${this.content.leerdoelen.description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${this.content.leerdoelen.description}</p>` : ''}
                                    ${this.content.leerdoelen.items && this.content.leerdoelen.items.length > 0 ? `
                                        <ul class="space-y-2">
                                            ${this.content.leerdoelen.items.map(item => `
                                                <li class="flex items-start space-x-3">
                                                    <i class="fas fa-check text-green-500 dark:text-green-400 mt-1"></i>
                                                    <span class="text-gray-700 dark:text-gray-300">${item}</span>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    ` : ''}
                                </div>
                            `
                        }
                    </div>
                </div>
            </section>

            <!-- Theorie Sectie met subsecties -->
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-book text-purple-600 dark:text-purple-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">${this.content.theorie.title}</h2>
                        <div class="prose max-w-none">
                            ${this.renderTheorieContentWithSections()}
                        </div>
                    </div>
                </div>
            </section>

            ${this.content.mcVragen ? this.renderMCQuestionsSection() : ''}

        `;
    }

    /**
     * Render theorie content met sectie IDs voor navigatie
     */
    renderTheorieContentWithSections() {
        if (!this.content || !this.content.theorie || !this.content.theorie.content) {
            return '';
        }
        
        const content = this.content.theorie.content;
        let html = '';
        let currentSection = null;
        let sectionContent = [];
        
        // Process content items and group into sections based on heading items with IDs
        for (let i = 0; i < content.length; i++) {
            const item = content[i];
            
            // Check if this is a heading with an ID (section marker)
            if (item.type === 'heading' && item.id) {
                // Close previous section
                if (currentSection && sectionContent.length > 0) {
                    html += ContentRenderer.renderContentItems(sectionContent, { enableModal: true });
                    sectionContent = [];
                }
                // Start new section - render the heading (which has the ID)
                html += ContentRenderer.renderContentItems([item], { enableModal: true });
                currentSection = item.id;
            } else {
                // Add item to current section (or render intro content before first section)
                if (currentSection) {
                    sectionContent.push(item);
                } else {
                    // This is intro content before first section, render it directly
                    html += ContentRenderer.renderContentItems([item], { enableModal: true });
                }
            }
        }
        
        // Close last section if there is one
        if (currentSection && sectionContent.length > 0) {
            html += ContentRenderer.renderContentItems(sectionContent, { enableModal: true });
        }
        
        return html;
    }

    /**
     * Render error state als content niet kan worden geladen
     */
    renderErrorState() {
        return `
            <section class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-6 rounded-r-lg">
                <div class="flex items-start space-x-3">
                    <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 mt-1"></i>
                    <div>
                        <h3 class="font-semibold text-red-900 dark:text-red-200 mb-1">Content Kon Niet Worden Geladen</h3>
                        <p class="text-red-800 dark:text-red-300 text-sm">
                            Het bestand week4.content.json kon niet worden geladen. Controleer of het bestand bestaat en toegankelijk is.
                        </p>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render MC vragen sectie - ONE QUESTION AT A TIME MODE
     * @returns {string} HTML string
     */
    renderMCQuestionsSection() {
        const mcConfig = this.content.mcVragen;
        
        // Als er een huidige vraag is, render die
        if (this.currentQuestion) {
            MCQuestionRenderer.storeQuestionData([this.currentQuestion]);
            return MCQuestionRenderer.render(mcConfig, 'mc-questions-container', this.currentQuestion);
        }
        
        // Als er een loading state is (vraag wordt gegenereerd), toon die
        if (this.isGeneratingQuestion) {
            return `
                <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift mt-8 transition-colors duration-200">
                    <div class="flex flex-col sm:flex-row items-start">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                            <i class="fas fa-question-circle text-indigo-600 dark:text-indigo-400 text-lg"></i>
                        </div>
                        <div class="flex-1 min-w-0 w-full sm:w-auto">
                            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">${mcConfig.title || 'Test je kennis'}</h2>
                            <div id="mc-questions-container" class="space-y-6">
                                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-900/50">
                                    <div class="flex items-center justify-center space-x-3 py-8">
                                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                                        <p class="text-gray-600 dark:text-gray-300">AI-generatie vraag...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
        }
        
        // Anders toon knop om eerste vraag te starten
        return `
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift mt-8 transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-question-circle text-indigo-600 dark:text-indigo-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">${mcConfig.title || 'Test je kennis'}</h2>
                        <div id="mc-questions-container" class="space-y-6">
                            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-900/50 text-center">
                                <p class="text-gray-700 dark:text-gray-300 mb-4">Klik op de knop hieronder om te beginnen met de eerste vraag.</p>
                                <button id="start-mc-questions-btn" data-action="start-first-question" class="px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus-ring transition-colors flex items-center justify-center space-x-2 mx-auto">
                                    <i class="fas fa-play"></i>
                                    <span>Start eerste vraag</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Genereer MC vragen met AI
     */
    async generateMCQuestions() {
        // Check of we nog op week 4 zijn - alleen blokkeren als we zeker weten dat we NIET op week 4 zijn
        // Als window.currentWeek4Page === this, dan zijn we op week 4
        if (window.currentWeek4Page !== this) {
            console.log('[Week4LessonPage] Stopping question generation - not the current week 4 page instance');
            return;
        }
        
        if (!this.content || !this.content.mcVragen) {
            return;
        }

        const mcConfig = this.content.mcVragen;
        
        // Als vragen al handmatig zijn toegevoegd, gebruik die
        if (mcConfig.vragen && Array.isArray(mcConfig.vragen)) {
            this.mcQuestions = mcConfig.vragen;
            MCQuestionRenderer.storeQuestionData(this.mcQuestions);
            
            // Update DOM
            const container = document.getElementById('mc-questions-container');
            if (container && container.parentElement) {
                const mcSection = container.closest('section');
                if (mcSection) {
                    const configWithQuestions = {
                        ...mcConfig,
                        vragen: this.mcQuestions
                    };
                    const newSection = MCQuestionRenderer.render(configWithQuestions);
                    mcSection.outerHTML = newSection;
                }
            }
            return;
        }

        // Genereer vragen met AI
        if (!mcConfig.generateFromTheory) {
            return;
        }

        try {
            console.log('Starting MC question generation...');
            
            if (!this.aiGenerator) {
                // API key no longer required - server handles it
                this.aiGenerator = new AIGenerator();
            }

            // OPTIE 2: Use cached theory content if available, otherwise extract and cache
            if (!this.cachedTheoryContent) {
                console.log('[Week4LessonPage] Extracting theory content (first time)...');
                this.cachedTheoryContent = this.aiGenerator.extractTheoryText(this.content.theorie.content || []);
                console.log('[Week4LessonPage] Cached theory content length:', this.cachedTheoryContent?.length || 0);
            } else {
                console.log('[Week4LessonPage] Using cached theory content');
            }

            const theoryContent = this.cachedTheoryContent;
            
            if (!theoryContent || theoryContent.trim().length === 0) {
                console.warn('Geen theorie content gevonden om vragen van te genereren');
                this.showErrorInContainer('Geen theorie content gevonden om vragen van te genereren.');
                return;
            }

            // Calculate total segments once (now uses getTotalSegments method)
            if (this.totalSegments === null) {
                this.totalSegments = this.aiGenerator.getTotalSegments(theoryContent);
                console.log('[Week4LessonPage] Total segments available:', this.totalSegments);
            }

            // Generate ONE question at a time for endless mode
            console.log('Generating single question... (question #' + (this.questionCounter + 1) + ')');
            
            // Get next available segment index (avoids recently used segments)
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            console.log('[Week4LessonPage] Using segment index:', nextSegmentIndex);
            
            // Get theory segment for this question (ensures variety by using different parts of text)
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            console.log('[Week4LessonPage] Theory segment length:', theorySegment.length);
            console.log('[Week4LessonPage] Theory segment preview:', theorySegment.substring(0, 100) + '...');
            
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            console.log('Generated question:', generatedQuestions);
            
            // Check opnieuw of we nog de actieve week 4 instantie zijn na async operatie
            if (window.currentWeek4Page !== this) {
                console.log('[Week4LessonPage] Stopping - navigated away during generation');
                this.isGeneratingQuestion = false;
                return;
            }
            
            if (generatedQuestions && generatedQuestions.length > 0) {
                // Track this segment as used
                this.usedSegments.push(nextSegmentIndex);
                // Keep track of recently used segments
                // For small numbers of segments, keep fewer to allow rotation
                // For larger numbers, keep more to avoid repetition
                const maxTrackedSegments = Math.min(this.totalSegments - 1, Math.max(2, Math.floor(this.totalSegments / 2)));
                if (this.usedSegments.length > maxTrackedSegments) {
                    this.usedSegments.shift();
                }
                console.log('[Week4LessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
                // Store in questions array for reference, but show only one
                if (!this.mcQuestions) {
                    this.mcQuestions = [];
                }
                this.mcQuestions.push(generatedQuestions[0]);
                
                // Set current question to display
                this.currentQuestion = generatedQuestions[0];
                this.currentQuestion.id = `question-${++this.questionCounter}`;
                MCQuestionRenderer.storeQuestionData([this.currentQuestion]);

                // Update DOM with single question
                this.updateMCQuestionsSection();
                
                // OPTIE 4: Prefetch next question in background
                this.prefetchNextQuestion();
            } else {
                throw new Error('No question generated');
            }
        } catch (error) {
            console.error('Error generating MC questions:', error);
            const errorMessage = error.message || 'Er is een fout opgetreden bij het genereren van vragen. Probeer de pagina te verversen.';
            this.isGeneratingQuestion = false; // Reset flag bij error
            this.showErrorInContainer(errorMessage);
        }
    }

    /**
     * Update MC questions section in DOM - ONE QUESTION AT A TIME
     */
    updateMCQuestionsSection() {
        const container = document.getElementById('mc-questions-container');
        if (container && container.parentElement) {
            const mcSection = container.closest('section');
            if (mcSection) {
                // Als er een vraag is, render die
                if (this.currentQuestion) {
                    const newSection = MCQuestionRenderer.render(this.content.mcVragen, 'mc-questions-container', this.currentQuestion);
                    mcSection.outerHTML = newSection;
                } else if (this.isGeneratingQuestion) {
                    // Als we aan het genereren zijn, toon loading state
                    const newSection = this.renderMCQuestionsSection();
                    mcSection.outerHTML = newSection;
                }
            }
        }
    }

    /**
     * OPTIE 4: Prefetch next question in background
     * This improves UX by generating the next question while user is still answering current one
     */
    async prefetchNextQuestion() {
        // Check of we nog de actieve week 4 instantie zijn
        if (window.currentWeek4Page !== this) {
            console.log('[Week4LessonPage] Stopping prefetch - not the current week 4 page instance');
            this.isPrefetching = false;
            return;
        }
        
        // Don't prefetch if already prefetching or if we already have a prefetched question
        if (this.isPrefetching || this.prefetchedQuestion) {
            return;
        }

        const mcConfig = this.content.mcVragen;
        if (!mcConfig.generateFromTheory) {
            return;
        }

        try {
            this.isPrefetching = true;
            console.log('[Week4LessonPage] Prefetching next question in background...');

            if (!this.aiGenerator) {
                this.aiGenerator = new AIGenerator();
            }

            // Use cached theory content
            if (!this.cachedTheoryContent) {
                this.cachedTheoryContent = this.aiGenerator.extractTheoryText(this.content.theorie.content || []);
            }

            const theoryContent = this.cachedTheoryContent;
            
            if (!theoryContent || theoryContent.trim().length === 0) {
                return;
            }

            // Generate ONE question in background
            // Use next available segment index for variety
            if (this.totalSegments === null) {
                this.totalSegments = this.aiGenerator.getTotalSegments(theoryContent);
            }
            
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            
            // Check opnieuw of we nog de actieve week 4 instantie zijn na async operatie
            if (window.currentWeek4Page !== this) {
                console.log('[Week4LessonPage] Stopping prefetch - navigated away during generation');
                this.isPrefetching = false;
                return;
            }
            
            if (generatedQuestions && generatedQuestions.length > 0) {
                // Store prefetched question
                this.prefetchedQuestion = generatedQuestions[0];
                this.prefetchedQuestion.id = `question-${this.questionCounter + 1}`;
                // Store segment index for this prefetched question
                this.prefetchedQuestion._segmentIndex = nextSegmentIndex;
                console.log('[Week4LessonPage] ✅ Next question prefetched successfully (segment:', nextSegmentIndex + ')');
            }
        } catch (error) {
            console.warn('[Week4LessonPage] Prefetch failed (will generate on-demand):', error.message);
            // Don't show error to user - prefetch is optional
        } finally {
            this.isPrefetching = false;
        }
    }

    /**
     * Load next AI-generated question
     * OPTIE 4: Use prefetched question if available, otherwise generate on-demand
     */
    async loadNextQuestion() {
        // Check of we nog de actieve week 4 instantie zijn
        if (window.currentWeek4Page !== this) {
            console.log('[Week4LessonPage] Ignoring loadNextQuestion - not the current week 4 page instance');
            return;
        }
        
        const mcConfig = this.content.mcVragen;
        
        if (!mcConfig.generateFromTheory) {
            return;
        }

        try {
            // OPTIE 4: Check if we have a prefetched question
            if (this.prefetchedQuestion) {
                console.log('[Week4LessonPage] ✅ Using prefetched question (instant!)');
                
                // Get segment index from prefetched question
                const prefetchedSegmentIndex = this.prefetchedQuestion._segmentIndex ?? this.segmentIndex;
                
                // Track this segment as used
                this.usedSegments.push(prefetchedSegmentIndex);
                // Keep track of recently used segments
                const maxTrackedSegments = Math.min(this.totalSegments - 1, Math.max(2, Math.floor(this.totalSegments / 2)));
                if (this.usedSegments.length > maxTrackedSegments) {
                    this.usedSegments.shift();
                }
                console.log('[Week4LessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
                // Store in questions array
                if (!this.mcQuestions) {
                    this.mcQuestions = [];
                }
                this.mcQuestions.push(this.prefetchedQuestion);
                
                // Use prefetched question
                this.currentQuestion = this.prefetchedQuestion;
                this.currentQuestion.id = `question-${++this.questionCounter}`;
                MCQuestionRenderer.storeQuestionData([this.currentQuestion]);

                // Clear prefetched question
                this.prefetchedQuestion = null;

                // Update DOM with new question (instant!)
                this.updateMCQuestionsSection();
                
                // Prefetch next question in background
                this.prefetchNextQuestion();
                
                return; // Done! Much faster than generating on-demand
            }

            // No prefetched question - generate on-demand
            console.log('[Week4LessonPage] No prefetched question, generating on-demand...');
            
            // Show loading state
            const container = document.getElementById('mc-questions-container');
            if (container) {
                container.innerHTML = `
                    <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-900/50">
                        <div class="flex items-center justify-center space-x-3 py-8">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                            <p class="text-gray-600 dark:text-gray-300">AI-generatie nieuwe vraag...</p>
                        </div>
                    </div>
                `;
            }

            if (!this.aiGenerator) {
                this.aiGenerator = new AIGenerator();
            }

            // OPTIE 2: Use cached theory content if available
            if (!this.cachedTheoryContent) {
                console.log('[Week4LessonPage] Extracting theory content for next question...');
                this.cachedTheoryContent = this.aiGenerator.extractTheoryText(this.content.theorie.content || []);
            }

            const theoryContent = this.cachedTheoryContent;
            
            if (!theoryContent || theoryContent.trim().length === 0) {
                this.showErrorInContainer('Geen theorie content gevonden om vragen van te genereren.');
                return;
            }

            // Generate ONE new question
            console.log('Generating next question... (question #' + (this.questionCounter + 1) + ')');
            
            // Calculate total segments once (now uses getTotalSegments method)
            if (this.totalSegments === null) {
                this.totalSegments = this.aiGenerator.getTotalSegments(theoryContent);
                console.log('[Week4LessonPage] Total segments available:', this.totalSegments);
            }
            
            // Get next available segment index
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            console.log('[Week4LessonPage] Using segment index:', nextSegmentIndex);
            
            // Get theory segment for this question (ensures variety by using different parts of text)
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            console.log('[Week4LessonPage] Theory segment length:', theorySegment.length);
            console.log('[Week4LessonPage] Theory segment preview:', theorySegment.substring(0, 100) + '...');
            
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            
            // Check opnieuw of we nog de actieve week 4 instantie zijn na async operatie
            if (window.currentWeek4Page !== this) {
                console.log('[Week4LessonPage] Stopping loadNextQuestion - navigated away during generation');
                return;
            }
            
            if (generatedQuestions && generatedQuestions.length > 0) {
                // Track this segment as used
                this.usedSegments.push(nextSegmentIndex);
                // Keep only last 3 used segments
                if (this.usedSegments.length > 3) {
                    this.usedSegments.shift();
                }
                console.log('[Week4LessonPage] Used segments (last 3):', this.usedSegments);
                
                // Store in questions array
                if (!this.mcQuestions) {
                    this.mcQuestions = [];
                }
                this.mcQuestions.push(generatedQuestions[0]);
                
                // Set new current question
                this.currentQuestion = generatedQuestions[0];
                this.currentQuestion.id = `question-${++this.questionCounter}`;
                MCQuestionRenderer.storeQuestionData([this.currentQuestion]);

                // Update DOM with new question
                this.updateMCQuestionsSection();
                
                // OPTIE 4: Prefetch next question in background
                this.prefetchNextQuestion();
            } else {
                throw new Error('No question generated');
            }
        } catch (error) {
            console.error('Error generating next question:', error);
            const errorMessage = error.message || 'Er is een fout opgetreden bij het genereren van de volgende vraag.';
            this.showErrorInContainer(errorMessage);
        }
    }

    /**
     * Get next available segment index (avoids recently used segments)
     * @returns {number} Segment index to use
     */
    getNextAvailableSegmentIndex() {
        if (this.totalSegments === null || this.totalSegments === 0) {
            return 0;
        }
        
        // If we haven't used any segments yet, start with segment 0
        if (this.usedSegments.length === 0) {
            return 0;
        }
        
        // Find segments that haven't been used recently
        const availableSegments = [];
        for (let i = 0; i < this.totalSegments; i++) {
            if (!this.usedSegments.includes(i)) {
                availableSegments.push(i);
            }
        }
        
        // If we have unused segments, pick one randomly for variety
        if (availableSegments.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableSegments.length);
            return availableSegments[randomIndex];
        }
        
        // All segments have been used recently
        // Use the least recently used segment (first in usedSegments array)
        // This ensures we cycle through all segments before repeating
        const lruSegment = this.usedSegments[0];
        
        // Calculate next segment after LRU
        let nextSegment = (lruSegment + 1) % this.totalSegments;
        
        // If the next segment is still in recently used, try the one after that
        if (this.usedSegments.includes(nextSegment) && this.usedSegments.length < this.totalSegments) {
            nextSegment = (nextSegment + 1) % this.totalSegments;
        }
        
        return nextSegment;
    }

    /**
     * Show error message in MC questions container
     * @param {string} message - Error message to display
     */
    showErrorInContainer(message) {
        const container = document.getElementById('mc-questions-container');
        if (container) {
            container.innerHTML = `
                <div class="border border-red-200 dark:border-red-800 rounded-lg p-5 bg-red-50 dark:bg-red-900/20">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 mt-1"></i>
                        <div>
                            <h3 class="font-semibold text-red-900 dark:text-red-200 mb-1">Fout bij genereren</h3>
                            <p class="text-red-800 dark:text-red-300 text-sm">${message}</p>
                            <button onclick="location.reload()" class="mt-3 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm">
                                Pagina verversen
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Attach event listeners (override base class)
     * Image modal functionality is now in BaseLessonPage
     */
    /**
     * Check of we nog op week 4 pagina zijn
     */
    isOnWeek4Page() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        // Check of we op week4.html zijn (met of zonder hash)
        // Ook check via moduleId als fallback
        const isWeek4Path = currentPath.includes('week4.html') || currentHash.includes('week-4') || currentHash.includes('#week-4');
        const isWeek4Module = this.moduleId === 'week-4';
        return isWeek4Path || isWeek4Module;
    }

    attachEventListeners() {
        super.attachEventListeners();
        
        // Listen for "next question" event - alleen op week 4
        if (!this._loadNextQuestionListenerAdded) {
            this._loadNextQuestionListenerAdded = true;
            window.addEventListener('loadNextMCQuestion', () => {
                // Check of we nog de actieve week 4 instantie zijn
                if (window.currentWeek4Page === this) {
                    this.loadNextQuestion();
                }
            });
        }
        
        // Event listener voor "Start eerste vraag" knop
        // Gebruik event delegation omdat de knop dynamisch wordt toegevoegd
        // Voorkom dat de listener meerdere keren wordt toegevoegd
        if (!this._startQuestionListenerAdded) {
            this._startQuestionListenerAdded = true;
            // Gebruik capture phase om zeker te zijn dat we het event oppakken
            // Bind this context correct
            const self = this;
            document.addEventListener('click', (e) => {
                // Check of de klik op de button zelf of op een child element (zoals icon) is
                const button = e.target.closest('[data-action="start-first-question"]');
                if (button) {
                    console.log('[Week4LessonPage] Button click detected');
                    
                    // Als de button zichtbaar is, betekent dat we op week 4 zijn
                    // Gebruik de opgeslagen referentie (meest betrouwbaar)
                    const pageInstance = window.currentWeek4Page;
                    if (!pageInstance) {
                        console.warn('[Week4LessonPage] Ignoring click - no currentWeek4Page instance. Pathname:', window.location.pathname, 'Hash:', window.location.hash);
                        return;
                    }
                    
                    // Check of de button daadwerkelijk op de pagina staat (is zichtbaar)
                    // Dit is een betere check dan URL parsing
                    const buttonInDOM = document.querySelector('[data-action="start-first-question"]');
                    if (!buttonInDOM || buttonInDOM !== button) {
                        console.warn('[Week4LessonPage] Ignoring click - button not in DOM or mismatch');
                        return;
                    }
                    
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[Week4LessonPage] Start button clicked - proceeding');
                    
                    if (typeof pageInstance.startFirstQuestion === 'function') {
                        pageInstance.startFirstQuestion();
                    } else {
                        console.error('[Week4LessonPage] startFirstQuestion method not found');
                    }
                }
            }, true); // Capture phase
        }
    }
    
    /**
     * Start de eerste MC vraag na klik op knop
     */
    async startFirstQuestion() {
        console.log('[Week4LessonPage] startFirstQuestion called');
        
        if (!this.content || !this.content.mcVragen) {
            console.warn('[Week4LessonPage] No content or mcVragen found');
            return;
        }
        
        console.log('[Week4LessonPage] Starting question generation...');
        
        // Zet flag dat we aan het genereren zijn
        this.isGeneratingQuestion = true;
        
        // Update de sectie om loading state te tonen
        this.updateMCQuestionsSection();
        
        try {
            // Genereer de eerste vraag
            await this.generateMCQuestions();
        } catch (error) {
            console.error('[Week4LessonPage] Error in startFirstQuestion:', error);
            this.isGeneratingQuestion = false;
            this.showErrorInContainer('Er is een fout opgetreden bij het starten van de vraag.');
        }
        
        // Reset flag (wordt al gedaan in generateMCQuestions bij succes)
        this.isGeneratingQuestion = false;
    }

    /**
     * Initialiseer de pagina met content loading
     */
    async init() {
        await super.init();
        
        // Bewaar referentie naar huidige instantie voor inline onclick handlers
        // Reset eerst oude referenties van andere instanties
        if (window.currentWeek4Page && window.currentWeek4Page !== this) {
            // Stop prefetch van oude instantie
            if (window.currentWeek4Page.isPrefetching) {
                window.currentWeek4Page.isPrefetching = false;
            }
        }
        window.currentWeek4Page = this;
        
        // Handle hash in URL after content is loaded
        if (window.location.hash) {
            // Immediately try to scroll to anchor, BaseLessonPage.scrollToAnchor handles retries
            this.scrollToAnchor(window.location.hash);
        }
    }
    
    /**
     * Cleanup methode om te worden aangeroepen bij navigatie weg van week 4
     */
    cleanup() {
        // Stop prefetch processen
        this.isPrefetching = false;
        this.prefetchedQuestion = null;
        
        // Reset referentie als dit de huidige instantie is
        if (window.currentWeek4Page === this) {
            window.currentWeek4Page = null;
        }
        
        console.log('[Week4LessonPage] Cleanup completed');
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Week4LessonPage;
}
// Altijd aan window toevoegen voor browser gebruik
window.Week4LessonPage = Week4LessonPage;
