/**
 * Week5LessonPage
 * 
 * Specifieke pagina voor Week 5: Uitvoeren literatuuronderzoek + Theoretisch kader
 * Basis template voor collega's om content toe te voegen
 */

class Week5LessonPage extends BaseLessonPage {
    constructor() {
        super('week-5', 'Week 5', 'Uitvoeren literatuuronderzoek + Theoretisch kader');
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
        console.log('[Week5LessonPage] Loading content...');
        try {
            const timestamp = new Date().getTime();
            const response = await fetch(`./content/week5.content.json?v=${timestamp}`, { cache: "no-store" });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.content = await response.json();
            this.contentLoaded = true;
        } catch (error) {
            console.error('Error loading content:', error);
            this.contentLoaded = false;
            this.content = this.getFallbackContent();
        }
    }

    /**
     * Fallback content als JSON niet kan worden geladen
     */
    getFallbackContent() {
        return {
            intro: {
                title: "Week 5",
                subtitle: "Uitvoeren literatuuronderzoek + Theoretisch kader",
                description: "De content voor deze module kon niet correct worden geladen. Controleer of het bestand week5.content.json bestaat en toegankelijk is."
            },
            leerdoelen: {
                title: "Leerdoelen",
                description: "Content kon niet worden geladen",
                items: [
                    "Het bestand week5.content.json kon niet worden geladen",
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
                                storageKey: 'week5-learning-objectives'
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
                            Het bestand week5.content.json kon niet worden geladen. Controleer of het bestand bestaat en toegankelijk is.
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
        // Check of we nog op week 5 zijn - alleen blokkeren als we zeker weten dat we NIET op week 5 zijn
        // Als window.currentWeek5Page === this, dan zijn we op week 5
        if (window.currentWeek5Page !== this) {
            console.log('[Week5LessonPage] Stopping question generation - not the current week 5 page instance');
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
                console.log('[Week5LessonPage] Extracting theory content (first time)...');
                this.cachedTheoryContent = this.aiGenerator.extractTheoryText(this.content.theorie.content || []);
                console.log('[Week5LessonPage] Cached theory content length:', this.cachedTheoryContent?.length || 0);
            } else {
                console.log('[Week5LessonPage] Using cached theory content');
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
                console.log('[Week5LessonPage] Total segments available:', this.totalSegments);
            }

            // Generate ONE question at a time for endless mode
            console.log('Generating single question... (question #' + (this.questionCounter + 1) + ')');
            
            // Get next available segment index (avoids recently used segments)
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            console.log('[Week5LessonPage] Using segment index:', nextSegmentIndex);
            
            // Get theory segment for this question (ensures variety by using different parts of text)
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            console.log('[Week5LessonPage] Theory segment length:', theorySegment.length);
            console.log('[Week5LessonPage] Theory segment preview:', theorySegment.substring(0, 100) + '...');
            
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            console.log('Generated question:', generatedQuestions);
            
            // Check opnieuw of we nog de actieve week 5 instantie zijn na async operatie
            if (window.currentWeek5Page !== this) {
                console.log('[Week5LessonPage] Stopping - navigated away during generation');
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
                console.log('[Week5LessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
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
        // Check of we nog de actieve week 5 instantie zijn
        if (window.currentWeek5Page !== this) {
            console.log('[Week5LessonPage] Stopping prefetch - not the current week 5 page instance');
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
            console.log('[Week5LessonPage] Prefetching next question in background...');

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
            
            // Check opnieuw of we nog de actieve week 5 instantie zijn na async operatie
            if (window.currentWeek5Page !== this) {
                console.log('[Week5LessonPage] Stopping prefetch - navigated away during generation');
                this.isPrefetching = false;
                return;
            }
            
            if (generatedQuestions && generatedQuestions.length > 0) {
                // Store prefetched question
                this.prefetchedQuestion = generatedQuestions[0];
                this.prefetchedQuestion.id = `question-${this.questionCounter + 1}`;
                // Store segment index for this prefetched question
                this.prefetchedQuestion._segmentIndex = nextSegmentIndex;
                console.log('[Week5LessonPage] ✅ Next question prefetched successfully (segment:', nextSegmentIndex + ')');
            }
        } catch (error) {
            console.warn('[Week5LessonPage] Prefetch failed (will generate on-demand):', error.message);
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
        // Check of we nog de actieve week 5 instantie zijn
        if (window.currentWeek5Page !== this) {
            console.log('[Week5LessonPage] Ignoring loadNextQuestion - not the current week 5 page instance');
            return;
        }
        
        const mcConfig = this.content.mcVragen;
        
        if (!mcConfig.generateFromTheory) {
            return;
        }

        try {
            // OPTIE 4: Check if we have a prefetched question
            if (this.prefetchedQuestion) {
                console.log('[Week5LessonPage] ✅ Using prefetched question (instant!)');
                
                // Get segment index from prefetched question
                const prefetchedSegmentIndex = this.prefetchedQuestion._segmentIndex ?? this.segmentIndex;
                
                // Track this segment as used
                this.usedSegments.push(prefetchedSegmentIndex);
                // Keep track of recently used segments
                const maxTrackedSegments = Math.min(this.totalSegments - 1, Math.max(2, Math.floor(this.totalSegments / 2)));
                if (this.usedSegments.length > maxTrackedSegments) {
                    this.usedSegments.shift();
                }
                console.log('[Week5LessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
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
            console.log('[Week5LessonPage] No prefetched question, generating on-demand...');
            
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
                console.log('[Week5LessonPage] Extracting theory content for next question...');
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
                console.log('[Week5LessonPage] Total segments available:', this.totalSegments);
            }
            
            // Get next available segment index
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            console.log('[Week5LessonPage] Using segment index:', nextSegmentIndex);
            
            // Get theory segment for this question (ensures variety by using different parts of text)
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            console.log('[Week5LessonPage] Theory segment length:', theorySegment.length);
            console.log('[Week5LessonPage] Theory segment preview:', theorySegment.substring(0, 100) + '...');
            
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            
            // Check opnieuw of we nog de actieve week 5 instantie zijn na async operatie
            if (window.currentWeek5Page !== this) {
                console.log('[Week5LessonPage] Stopping loadNextQuestion - navigated away during generation');
                return;
            }
            
            if (generatedQuestions && generatedQuestions.length > 0) {
                // Track this segment as used
                this.usedSegments.push(nextSegmentIndex);
                // Keep track of recently used segments
                const maxTrackedSegments = Math.min(this.totalSegments - 1, Math.max(2, Math.floor(this.totalSegments / 2)));
                if (this.usedSegments.length > maxTrackedSegments) {
                    this.usedSegments.shift();
                }
                console.log('[Week5LessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
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
    attachEventListeners() {
        super.attachEventListeners();
        
        // Listen for "next question" event - alleen op week 5
        if (!this._loadNextQuestionListenerAdded) {
            this._loadNextQuestionListenerAdded = true;
        window.addEventListener('loadNextMCQuestion', () => {
                // Check of we nog de actieve week 5 instantie zijn
                if (window.currentWeek5Page === this) {
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
                    console.log('[Week5LessonPage] Button click detected');
                    
                    // Als de button zichtbaar is, betekent dat we op week 5 zijn
                    // Gebruik de opgeslagen referentie (meest betrouwbaar)
                    const pageInstance = window.currentWeek5Page;
                    if (!pageInstance) {
                        console.warn('[Week5LessonPage] Ignoring click - no currentWeek5Page instance. Pathname:', window.location.pathname, 'Hash:', window.location.hash);
                        return;
                    }
                    
                    // Check of de button daadwerkelijk op de pagina staat (is zichtbaar)
                    // Dit is een betere check dan URL parsing
                    const buttonInDOM = document.querySelector('[data-action="start-first-question"]');
                    if (!buttonInDOM || buttonInDOM !== button) {
                        console.warn('[Week5LessonPage] Ignoring click - button not in DOM or mismatch');
                        return;
                    }
                    
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[Week5LessonPage] Start button clicked - proceeding');
                    
                    if (typeof pageInstance.startFirstQuestion === 'function') {
                        pageInstance.startFirstQuestion();
                    } else {
                        console.error('[Week5LessonPage] startFirstQuestion method not found');
                    }
                }
            }, true); // Capture phase
        }
    }
    
    /**
     * Start de eerste MC vraag na klik op knop
     */
    async startFirstQuestion() {
        console.log('[Week5LessonPage] startFirstQuestion called');
        
        if (!this.content || !this.content.mcVragen) {
            console.warn('[Week5LessonPage] No content or mcVragen found');
            return;
        }
        
        console.log('[Week5LessonPage] Starting question generation...');
        
        // Zet flag dat we aan het genereren zijn
        this.isGeneratingQuestion = true;
        
        // Update de sectie om loading state te tonen
        this.updateMCQuestionsSection();
        
        try {
            // Genereer de eerste vraag
            await this.generateMCQuestions();
        } catch (error) {
            console.error('[Week5LessonPage] Error in startFirstQuestion:', error);
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
        if (window.currentWeek5Page && window.currentWeek5Page !== this) {
            // Stop prefetch van oude instantie
            if (window.currentWeek5Page.isPrefetching) {
                window.currentWeek5Page.isPrefetching = false;
            }
        }
        window.currentWeek5Page = this;
        
        // Voeg kopieerknoppen toe aan tabellen
        this.addCopyButtonsToTables();
        
        // Handle hash in URL after content is loaded
        if (window.location.hash) {
            // Immediately try to scroll to anchor, Router.scrollToAnchor handles retries
            this.router.scrollToAnchor(window.location.hash);
        }
    }
    
    /**
     * Voeg kopieerknoppen toe aan alle tabellen in de content
     */
    addCopyButtonsToTables() {
        // Functie om kopieerknop aan een tabel toe te voegen
        const addCopyButtonToTable = (table) => {
            // Check of er al een kopieerknop is toegevoegd
            if (table.closest('.table-wrapper-with-copy') || table.parentElement.querySelector('.table-copy-button')) {
                return;
            }
            
            // Zoek de h3 titel die direct boven deze specifieke tabel staat
            // Aanpak: zoek in de DOM structuur omhoog vanaf de tabel
            let titleElement = null;
            
            // Zoek omhoog in de DOM tree vanaf de tabel
            let currentElement = table.parentElement;
            let depth = 0;
            const maxDepth = 15;
            
            while (currentElement && depth < maxDepth) {
                // Zoek naar h3 in de parent of zijn siblings
                const h3s = currentElement.querySelectorAll('h3');
                
                // Check alle h3's in deze container
                for (let h3 of Array.from(h3s)) {
                    // Check of deze h3 al een button heeft
                    const flexParent = h3.closest('.flex.justify-between');
                    const hasButton = flexParent ? flexParent.querySelector('.table-copy-button') : 
                                    h3.parentElement.querySelector('.table-copy-button');
                    
                    if (!hasButton) {
                        // Check of deze h3 voor de tabel staat (in de DOM)
                        const h3Index = Array.from(currentElement.children).indexOf(h3);
                        const tableIndex = Array.from(currentElement.children).indexOf(table.parentElement);
                        
                        // Als h3 voor de tabel staat in de DOM, gebruik deze
                        if (h3Index < tableIndex || h3Index === 0) {
                            titleElement = h3;
                            break;
                        }
                    }
                }
                
                if (titleElement) break;
                
                // Check previous siblings voor h3
                let sibling = currentElement.previousElementSibling;
                while (sibling && !titleElement) {
                    const h3s = sibling.querySelectorAll('h3');
                    for (let h3 of Array.from(h3s)) {
                        const flexParent = h3.closest('.flex.justify-between');
                        const hasButton = flexParent ? flexParent.querySelector('.table-copy-button') : 
                                        h3.parentElement.querySelector('.table-copy-button');
                        if (!hasButton) {
                            titleElement = h3;
                            break;
                        }
                    }
                    sibling = sibling.previousElementSibling;
                }
                
                if (titleElement) break;
                
                currentElement = currentElement.parentElement;
                depth++;
            }
            
            // Fallback: zoek op visuele afstand als DOM zoeken faalt
            if (!titleElement) {
                const allH3s = Array.from(document.querySelectorAll('h3'));
                const tableRect = table.getBoundingClientRect();
                
                for (let h3 of allH3s) {
                    const h3Rect = h3.getBoundingClientRect();
                    const distance = tableRect.top - h3Rect.bottom;
                    
                    if (distance >= 0 && distance < 500) {
                        const flexParent = h3.closest('.flex.justify-between');
                        const hasButton = flexParent ? flexParent.querySelector('.table-copy-button') : 
                                        h3.parentElement.querySelector('.table-copy-button');
                        
                        if (!hasButton) {
                            titleElement = h3;
                            break;
                        }
                    }
                }
            }
            
            // Maak de kopieerknop met dezelfde styling als bouwsteengenerator
            const copyButton = document.createElement('button');
            copyButton.className = 'table-copy-button text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors flex items-center';
            copyButton.innerHTML = '<i class="fas fa-copy mr-2"></i> Kopieer tabel';
            copyButton.setAttribute('aria-label', 'Kopieer tabel');
            copyButton.setAttribute('title', 'Kopieer tabel naar klembord');
            
            // Voeg click event toe
            copyButton.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this.copyTableToClipboard(table, copyButton);
            });
            
            // Als we een titel hebben gevonden, plaats de button in dezelfde regel (rechts uitgelijnd)
            if (titleElement) {
                // Check eerst of de h3 al in een flex container zit (voorkom dubbele wrappers)
                let flexParent = titleElement.closest('.flex.justify-between');
                
                if (flexParent && flexParent.classList.contains('items-center')) {
                    // Al in een flex container, voeg gewoon de button toe
                    flexParent.appendChild(copyButton);
                } else {
                    // Verwijder mb-4 van h3
                    titleElement.classList.remove('mb-4');
                    titleElement.classList.add('mb-0');
                    
                    // Maak een flex wrapper met justify-between (zoals in bouwsteengenerator) - titel links, button rechts
                    const flexWrapper = document.createElement('div');
                    flexWrapper.className = 'flex justify-between items-center mb-4';
                    
                    // Vervang de h3 met de flex wrapper
                    const titleParent = titleElement.parentElement;
                    titleParent.insertBefore(flexWrapper, titleElement);
                    flexWrapper.appendChild(titleElement);
                    flexWrapper.appendChild(copyButton);
                }
            } else {
                // Fallback: plaats button voor de overflow wrapper
                const overflowWrapper = table.parentElement;
                if (overflowWrapper.classList.contains('overflow-x-auto')) {
                    overflowWrapper.parentElement.insertBefore(copyButton, overflowWrapper);
                    copyButton.classList.add('mb-2');
                } else {
                    // Anders wrap de tabel
                    const wrapper = document.createElement('div');
                    wrapper.className = 'table-wrapper-with-copy';
                    const tableParent = table.parentElement;
                    tableParent.insertBefore(wrapper, table);
                    wrapper.appendChild(copyButton);
                    wrapper.appendChild(table);
                    copyButton.classList.add('mb-2');
                }
            }
        };
        
        // Voeg kopieerknoppen toe aan bestaande tabellen
        const processTables = () => {
            const tables = document.querySelectorAll('#app table');
            tables.forEach(table => {
                addCopyButtonToTable(table);
            });
        };
        
        // Wacht even tot de DOM volledig is geladen
        setTimeout(processTables, 100);
        
        // Observeer voor nieuwe tabellen (bijvoorbeeld in accordions die worden geopend)
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Check of het node zelf een tabel is
                            if (node.tagName === 'TABLE') {
                                addCopyButtonToTable(node);
                            }
                            // Check of het node tabellen bevat
                            const tables = node.querySelectorAll && node.querySelectorAll('table');
                            if (tables) {
                                tables.forEach(table => {
                                    addCopyButtonToTable(table);
                                });
                            }
                        }
                    });
                });
            });
            
            // Start observer op de app container
            const appContainer = document.getElementById('app');
            if (appContainer) {
                observer.observe(appContainer, {
                    childList: true,
                    subtree: true
                });
            }
        }
    }
    
    /**
     * Kopieer tabelinhoud naar klembord
     * @param {HTMLTableElement} table - De tabel om te kopiëren
     * @param {HTMLButtonElement} button - De button om feedback te geven
     */
    async copyTableToClipboard(table, button) {
        try {
            // Maak een kopie van de tabel voor HTML export
            const tableClone = table.cloneNode(true);
            
            // Verwijder eventuele buttons of andere interactieve elementen uit de clone
            const buttons = tableClone.querySelectorAll('button, .table-copy-button');
            buttons.forEach(btn => btn.remove());
            
            // Maak een schone HTML versie van de tabel met basis styling
            const htmlTable = `
                <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                    ${Array.from(tableClone.querySelectorAll('tr')).map(row => {
                        const cells = Array.from(row.querySelectorAll('th, td'));
                        return `<tr>${cells.map(cell => {
                            const isHeader = cell.tagName === 'TH';
                            const tag = isHeader ? 'th' : 'td';
                            const text = cell.textContent.trim();
                            const style = isHeader ? 'background-color: #f3f4f6; font-weight: bold;' : '';
                            return `<${tag} style="${style} border: 1px solid #d1d5db; padding: 8px;">${text}</${tag}>`;
                        }).join('')}</tr>`;
                    }).join('')}
                </table>
            `;
            
            // Maak ook een TSV versie voor Excel/Google Sheets
            const rows = Array.from(table.querySelectorAll('tr'));
            const tableData = rows.map(row => {
                const cells = Array.from(row.querySelectorAll('th, td'));
                return cells.map(cell => {
                    let text = cell.textContent.trim();
                    text = text.replace(/\s+/g, ' ');
                    return text;
                });
            });
            const tsv = tableData.map(row => row.join('\t')).join('\n');
            
            // Probeer eerst HTML te kopiëren (voor Word en andere rich text editors)
            // Probeer moderne Clipboard API met HTML support
            if (navigator.clipboard && navigator.clipboard.write) {
                try {
                    // Check of ClipboardItem wordt ondersteund
                    if (typeof ClipboardItem !== 'undefined') {
                        const clipboardItem = new ClipboardItem({
                            'text/html': new Blob([htmlTable], { type: 'text/html' }),
                            'text/plain': new Blob([tsv], { type: 'text/plain' })
                        });
                        await navigator.clipboard.write([clipboardItem]);
                    } else {
                        // Fallback: gebruik execCommand voor HTML support
                        await this.copyTableAsHTML(table, htmlTable, tsv);
                    }
                } catch (htmlError) {
                    // Fallback naar execCommand methode
                    await this.copyTableAsHTML(table, htmlTable, tsv);
                }
            } else {
                // Oudere browsers: gebruik execCommand
                await this.copyTableAsHTML(table, htmlTable, tsv);
            }
            
            // Geef visuele feedback (gebruik dezelfde stijl als bouwsteengenerator)
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check mr-2"></i> Gekopieerd!';
            button.classList.remove('text-gray-700', 'dark:text-gray-300');
            button.classList.add('text-green-600', 'dark:text-green-400');
            
            // Reset na 2 seconden
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('text-green-600', 'dark:text-green-400');
                button.classList.add('text-gray-700', 'dark:text-gray-300');
            }, 2000);
            
        } catch (error) {
            console.error('Error copying table to clipboard:', error);
            
            // Fallback: toon error message
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i> Fout';
            button.classList.remove('text-gray-700', 'dark:text-gray-300');
            button.classList.add('text-red-600', 'dark:text-red-400');
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('text-red-600', 'dark:text-red-400');
                button.classList.add('text-gray-700', 'dark:text-gray-300');
            }, 2000);
        }
    }
    
    /**
     * Kopieer tabel als HTML met execCommand (fallback methode)
     * @param {HTMLTableElement} table - De originele tabel
     * @param {string} htmlTable - De HTML string van de tabel
     * @param {string} tsv - De TSV string als fallback
     */
    async copyTableAsHTML(table, htmlTable, tsv) {
        // Maak een tijdelijk element om de HTML in te plakken
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '-9999px';
        tempDiv.innerHTML = htmlTable;
        document.body.appendChild(tempDiv);
        
        // Selecteer de inhoud
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        try {
            // Probeer te kopiëren met execCommand
            const successful = document.execCommand('copy');
            if (!successful) {
                throw new Error('execCommand copy failed');
            }
        } finally {
            // Cleanup
            selection.removeAllRanges();
            document.body.removeChild(tempDiv);
        }
    }
    
    /**
     * Cleanup methode om te worden aangeroepen bij navigatie weg van week 5
     */
    cleanup() {
        // Stop prefetch processen
        this.isPrefetching = false;
        this.prefetchedQuestion = null;
        
        // Reset referentie als dit de huidige instantie is
        if (window.currentWeek5Page === this) {
            window.currentWeek5Page = null;
        }
        
        console.log('[Week5LessonPage] Cleanup completed');
    }
}

console.log('Week5LessonPage.js executed');

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Week5LessonPage;
}

// Altijd aan window toevoegen voor browser gebruik
window.Week5LessonPage = Week5LessonPage;
console.log('Week5LessonPage assigned to window.Week5LessonPage', window.Week5LessonPage);
