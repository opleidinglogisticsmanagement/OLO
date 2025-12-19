/**
 * Week7LessonPage
 * 
 * Specifieke pagina voor Week 7: Rapportage 1
 * Basis template voor collega's om content toe te voegen
 */

// Export will be set immediately after class definition
class Week7LessonPage extends BaseLessonPage {
    constructor() {
        super('week-7', 'Week 7', 'Rapportage');
        // content and contentLoaded are now initialized in BaseLessonPage
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
        this.segmentIndex = 0; // Track which text segment to use (for variety)
        this.usedSegments = []; // Track recently used segments to avoid repetition
        this.totalSegments = null; // Cache total number of segments
    }

    // loadContent(), getFallbackContent(), and renderErrorState() are now in BaseLessonPage

    // renderModuleIntro() is now handled by BaseLessonPage using ContentTemplateRenderer

    /**
     * Render content secties met content uit JSON
     * Uses ContentTemplateRenderer for consistent styling
     */
    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }

        // Render leerdoelen sectie (with support for interactive checklist)
        let leerdoelenContent = '';
        if (this.content.leerdoelen.interactive && this.content.leerdoelen.items && this.content.leerdoelen.items.length > 0) {
            // Use interactive checklist
            leerdoelenContent = ContentRenderer.renderLearningObjectivesChecklist({
                title: this.content.leerdoelen.title,
                description: this.content.leerdoelen.description,
                items: this.content.leerdoelen.items,
                storageKey: 'week7-learning-objectives'
            });
        } else {
            // Use standard list
            leerdoelenContent = `
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
            `;
        }

        // Render theorie sectie
        const theorieContent = this.content.theorie.content 
            ? ContentRenderer.renderContentItems(this.content.theorie.content, { enableModal: true })
            : (this.content.theorie.paragraphs ? this.content.theorie.paragraphs.map(paragraph => `
                <p class="text-gray-700 dark:text-gray-300 mb-4">${paragraph}</p>
            `).join('') : '');
        const theorieTitle = this.content.theorie?.title || 'Theorie';

        // Build sections - if interactive checklist, we need to render it differently
        let leerdoelenSection = '';
        if (this.content.leerdoelen.interactive && this.content.leerdoelen.items && this.content.leerdoelen.items.length > 0) {
            // Interactive checklist already includes the section wrapper, so we use it directly
            leerdoelenSection = leerdoelenContent;
        } else {
            // Use ContentTemplateRenderer for standard section
            leerdoelenSection = this.contentTemplateRenderer.renderSection(
                this.content.leerdoelen.title,
                leerdoelenContent,
                'bullseye',
                'green',
                { headingSize: 'text-lg sm:text-xl' }
            );
        }

        return `
            ${leerdoelenSection}
            ${this.contentTemplateRenderer.renderSection(
                theorieTitle,
                theorieContent,
                'book',
                'purple'
            )}
            ${this.content.mcVragen ? this.renderMCQuestionsSection() : ''}
        `;
    }

    /**
     * Render error state als content niet kan worden geladen
     */
    // renderErrorState() is now in BaseLessonPage

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
        
        // Anders toon loading state - binnen een sectie
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

    /**
     * Genereer MC vragen met AI
     */
    async generateMCQuestions() {
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
                console.log('[Week7LessonPage] Extracting theory content (first time)...');
                this.cachedTheoryContent = this.aiGenerator.extractTheoryText(this.content.theorie.content || []);
                console.log('[Week7LessonPage] Cached theory content length:', this.cachedTheoryContent?.length || 0);
            } else {
                console.log('[Week7LessonPage] Using cached theory content');
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
                console.log('[Week7LessonPage] Total segments available:', this.totalSegments);
            }

            // Generate ONE question at a time for endless mode
            console.log('Generating single question... (question #' + (this.questionCounter + 1) + ')');
            
            // Get next available segment index (avoids recently used segments)
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            console.log('[Week7LessonPage] Using segment index:', nextSegmentIndex);
            
            // Get theory segment for this question (ensures variety by using different parts of text)
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            console.log('[Week7LessonPage] Theory segment length:', theorySegment.length);
            console.log('[Week7LessonPage] Theory segment preview:', theorySegment.substring(0, 100) + '...');
            
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            console.log('Generated question:', generatedQuestions);
            
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
                console.log('[Week7LessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
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
            
            // Check for QUOTA_EXCEEDED error
            if (error.quotaExceeded || error.message === 'QUOTA_EXCEEDED' || error.message.includes('QUOTA_EXCEEDED')) {
                this.showQuotaExceededMessage();
            } else {
                const errorMessage = error.message || 'Er is een fout opgetreden bij het genereren van vragen. Probeer de pagina te verversen.';
                this.showErrorInContainer(errorMessage);
            }
        }
    }

    /**
     * Update MC questions section in DOM - ONE QUESTION AT A TIME
     */
    updateMCQuestionsSection() {
        const container = document.getElementById('mc-questions-container');
        if (container && container.parentElement) {
            const mcSection = container.closest('section');
            if (mcSection && this.currentQuestion) {
                // Render single question
                const newSection = MCQuestionRenderer.render(this.content.mcVragen, 'mc-questions-container', this.currentQuestion);
                mcSection.outerHTML = newSection;
            }
        }
    }

    /**
     * OPTIE 4: Prefetch next question in background
     * This improves UX by generating the next question while user is still answering current one
     */
    async prefetchNextQuestion() {
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
            console.log('[Week7LessonPage] Prefetching next question in background...');

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
            
            if (generatedQuestions && generatedQuestions.length > 0) {
                // Store prefetched question
                this.prefetchedQuestion = generatedQuestions[0];
                this.prefetchedQuestion.id = `question-${this.questionCounter + 1}`;
                // Store segment index for this prefetched question
                this.prefetchedQuestion._segmentIndex = nextSegmentIndex;
                console.log('[Week7LessonPage] ✅ Next question prefetched successfully (segment:', nextSegmentIndex + ')');
            }
        } catch (error) {
            console.warn('[Week7LessonPage] Prefetch failed (will generate on-demand):', error.message);
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
        const mcConfig = this.content.mcVragen;
        
        if (!mcConfig.generateFromTheory) {
            return;
        }

        try {
            // OPTIE 4: Check if we have a prefetched question
            if (this.prefetchedQuestion) {
                console.log('[Week7LessonPage] ✅ Using prefetched question (instant!)');
                
                // Get segment index from prefetched question
                const prefetchedSegmentIndex = this.prefetchedQuestion._segmentIndex ?? this.segmentIndex;
                
                // Track this segment as used
                this.usedSegments.push(prefetchedSegmentIndex);
                // Keep track of recently used segments
                const maxTrackedSegments = Math.min(this.totalSegments - 1, Math.max(2, Math.floor(this.totalSegments / 2)));
                if (this.usedSegments.length > maxTrackedSegments) {
                    this.usedSegments.shift();
                }
                console.log('[Week7LessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
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
            console.log('[Week7LessonPage] No prefetched question, generating on-demand...');
            
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
                console.log('[Week7LessonPage] Extracting theory content for next question...');
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
                console.log('[Week7LessonPage] Total segments available:', this.totalSegments);
            }
            
            // Get next available segment index
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            console.log('[Week7LessonPage] Using segment index:', nextSegmentIndex);
            
            // Get theory segment for this question (ensures variety by using different parts of text)
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            console.log('[Week7LessonPage] Theory segment length:', theorySegment.length);
            console.log('[Week7LessonPage] Theory segment preview:', theorySegment.substring(0, 100) + '...');
            
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            
            if (generatedQuestions && generatedQuestions.length > 0) {
                // Track this segment as used
                this.usedSegments.push(nextSegmentIndex);
                // Keep only last 3 used segments
                if (this.usedSegments.length > 3) {
                    this.usedSegments.shift();
                }
                console.log('[Week7LessonPage] Used segments (last 3):', this.usedSegments);
                
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
     * Attach event listeners (override base class)
     */
    attachEventListeners() {
        super.attachEventListeners();
        
        // Listen for "next question" event (global event, can be set up immediately)
        window.addEventListener('loadNextMCQuestion', () => {
            this.loadNextQuestion();
        });
    }

    /**
     * Lifecycle hook: Called after event listeners are attached
     * Handles auto-generation of MC questions if configured
     */
    async afterEventListeners() {
        // Generate MC questions if needed (after DOM is ready)
        if (this.content && this.content.mcVragen && this.content.mcVragen.generateFromTheory) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                this.generateMCQuestions();
            }, 100);
        }
    }
}

// Export immediately after class definition
(function() {
    try {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = Week7LessonPage;
        } else {
            window.Week7LessonPage = Week7LessonPage;
        }
        console.log('[Week7LessonPage] ✅ Exported to window');
    } catch (error) {
        console.error('[Week7LessonPage] ❌ Error exporting:', error);
        try {
            window.Week7LessonPage = Week7LessonPage;
        } catch (e) {
            console.error('[Week7LessonPage] ❌ Failed to force export:', e);
        }
    }
})();
