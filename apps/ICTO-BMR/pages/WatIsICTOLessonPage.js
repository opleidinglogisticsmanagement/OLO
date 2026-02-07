/**
 * WatIsICTOLessonPage
 * 
 * Specifieke pagina voor Wat is ICTO
 */

class WatIsICTOLessonPage extends BaseLessonPage {
    constructor() {
        super('wat-is-icto', 'Wat is ICTO', 'Wat is ICTO');
        // content and contentLoaded are now initialized in BaseLessonPage
        // API key is no longer needed on client-side (handled by server)
        this.aiGenerator = null;
        this.mcQuestions = null;
        this.currentQuestion = null; // For one-at-a-time mode
        this.questionCounter = 0; // Track how many questions shown
        this.cachedTheoryContent = null; // Cache for theory content
        this.prefetchedQuestion = null; // Prefetch next question
        this.isPrefetching = false; // Track if prefetch is in progress
        this.segmentIndex = 0; // Track which text segment to use (for variety)
        this.usedSegments = []; // Track recently used segments to avoid repetition
        this.totalSegments = null; // Cache total number of segments
    }

    /**
     * Render content secties met content uit JSON
     * Uses ContentTemplateRenderer for consistent styling
     */
    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }

        // Render theorie content
        let theorieHtml = '';
        const theorie = this.content.theorie;
        
        if (theorie && theorie.content && Array.isArray(theorie.content)) {
            theorieHtml = ContentRenderer.renderContentItems(theorie.content, { enableModal: true });
        }

        // Check of theorie bestaat en een title heeft
        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Theorie';

        // Use ContentTemplateRenderer for consistent section styling
        return `
            ${this.contentTemplateRenderer.renderSection(
                theorieTitle,
                theorieHtml,
                'book',
                'purple'
            )}
            ${this.content.mcVragen ? this.renderMCQuestionsSection() : ''}
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
        
        // Anders toon een knop om de vraag te genereren (bespaart API tokens)
        // Use ContentTemplateRenderer for consistent styling
        const mcContent = `
            <div id="mc-questions-container" class="space-y-6">
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/50 text-center">
                    <p class="text-gray-600 dark:text-gray-300 mb-4">Klik op de knop hieronder om een AI-gegenereerde vraag te maken op basis van de theorie.</p>
                    <button 
                        id="generate-mc-question-btn" 
                        class="px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors font-medium flex items-center justify-center space-x-2 mx-auto"
                        aria-label="Genereer MC vraag">
                        <i class="fas fa-magic"></i>
                        <span>Genereer vraag</span>
                    </button>
                </div>
            </div>
        `;
        
        return this.contentTemplateRenderer.renderSection(
            mcConfig.title || 'Test je kennis',
            mcContent,
            'question-circle',
            'indigo',
            { marginTop: 'mt-8', headingSize: 'text-lg sm:text-xl' }
        );
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
            console.log('[WatIsICTOLessonPage] Starting MC question generation...');
            
            // Show loading state in container
            const container = document.getElementById('mc-questions-container');
            if (container) {
                container.innerHTML = `
                    <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-900/50">
                        <div class="flex items-center justify-center space-x-3 py-8">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                            <p class="text-gray-600 dark:text-gray-300">AI-generatie vraag...</p>
                        </div>
                    </div>
                `;
            }
            
            if (!this.aiGenerator) {
                // API key no longer required - server handles it
                this.aiGenerator = new AIGenerator();
            }

            // Use cached theory content if available, otherwise extract and cache
            if (!this.cachedTheoryContent) {
                console.log('[WatIsICTOLessonPage] Extracting theory content (first time)...');
                this.cachedTheoryContent = this.aiGenerator.extractTheoryText(this.content.theorie.content || []);
                console.log('[WatIsICTOLessonPage] Cached theory content length:', this.cachedTheoryContent?.length || 0);
            } else {
                console.log('[WatIsICTOLessonPage] Using cached theory content');
            }

            const theoryContent = this.cachedTheoryContent;
            
            if (!theoryContent || theoryContent.trim().length === 0) {
                console.warn('[WatIsICTOLessonPage] Geen theorie content gevonden om vragen van te genereren');
                this.showErrorInContainer('Geen theorie content gevonden om vragen van te genereren.');
                return;
            }

            // Calculate total segments once
            if (this.totalSegments === null) {
                this.totalSegments = this.aiGenerator.getTotalSegments(theoryContent);
                console.log('[WatIsICTOLessonPage] Total segments available:', this.totalSegments);
            }

            // Generate ONE question at a time for endless mode
            console.log('[WatIsICTOLessonPage] Generating single question... (question #' + (this.questionCounter + 1) + ')');
            
            // Get next available segment index (avoids recently used segments)
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            console.log('[WatIsICTOLessonPage] Using segment index:', nextSegmentIndex);
            
            // Get theory segment for this question (ensures variety by using different parts of text)
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            console.log('[WatIsICTOLessonPage] Theory segment length:', theorySegment.length);
            console.log('[WatIsICTOLessonPage] Theory segment preview:', theorySegment.substring(0, 100) + '...');
            
            console.log('[WatIsICTOLessonPage] Calling AIGenerator.generateMCQuestions...');
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            console.log('[WatIsICTOLessonPage] ✅ Generated question received:', generatedQuestions);
            
            if (generatedQuestions && generatedQuestions.length > 0) {
                // Track this segment as used
                this.usedSegments.push(nextSegmentIndex);
                // Keep track of recently used segments
                const maxTrackedSegments = Math.min(this.totalSegments - 1, Math.max(2, Math.floor(this.totalSegments / 2)));
                if (this.usedSegments.length > maxTrackedSegments) {
                    this.usedSegments.shift();
                }
                console.log('[WatIsICTOLessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
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
                
                // Prefetch next question in background
                this.prefetchNextQuestion();
            } else {
                throw new Error('No question generated');
            }
        } catch (error) {
            console.error('[WatIsICTOLessonPage] ❌ Error generating MC questions:', error);
            console.error('[WatIsICTOLessonPage] Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack?.substring(0, 500)
            });
            
            // Check for QUOTA_EXCEEDED error
            if (error.quotaExceeded || error.message === 'QUOTA_EXCEEDED' || error.message.includes('QUOTA_EXCEEDED')) {
                this.showQuotaExceededMessage();
            } else {
                const errorMessage = error.message || 'Er is een fout opgetreden bij het genereren van vragen. Probeer de pagina te verversen.';
                this.showErrorInContainer(errorMessage);
            }
            
            // Re-enable the generate button if it exists
            const generateBtn = document.getElementById('generate-mc-question-btn');
            if (generateBtn) {
                generateBtn.disabled = false;
                generateBtn.innerHTML = `
                    <i class="fas fa-magic"></i>
                    <span>Genereer vraag</span>
                `;
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
     * Prefetch next question in background
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
            console.log('[WatIsICTOLessonPage] Prefetching next question in background...');

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

            // Get next available segment index
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            
            if (generatedQuestions && generatedQuestions.length > 0) {
                // Track this segment as used
                this.usedSegments.push(nextSegmentIndex);
                const maxTrackedSegments = Math.min(this.totalSegments - 1, Math.max(2, Math.floor(this.totalSegments / 2)));
                if (this.usedSegments.length > maxTrackedSegments) {
                    this.usedSegments.shift();
                }
                
                this.prefetchedQuestion = generatedQuestions[0];
                console.log('[WatIsICTOLessonPage] ✅ Prefetched question ready');
            }
        } catch (error) {
            console.warn('[WatIsICTOLessonPage] Prefetch failed (non-critical):', error.message);
        } finally {
            this.isPrefetching = false;
        }
    }

    /**
     * Load next question (called when user clicks "Volgende vraag" button)
     */
    async loadNextQuestion() {
        // If we have a prefetched question, use it immediately
        if (this.prefetchedQuestion) {
            console.log('[WatIsICTOLessonPage] Using prefetched question');
            
            // Store in questions array
            if (!this.mcQuestions) {
                this.mcQuestions = [];
            }
            this.mcQuestions.push(this.prefetchedQuestion);
            
            // Set new current question
            this.currentQuestion = this.prefetchedQuestion;
            this.currentQuestion.id = `question-${++this.questionCounter}`;
            MCQuestionRenderer.storeQuestionData([this.currentQuestion]);

            // Update DOM with prefetched question
            this.updateMCQuestionsSection();
            
            // Clear prefetched question
            this.prefetchedQuestion = null;
            
            // Prefetch next question in background
            this.prefetchNextQuestion();
            
            return; // Done! Much faster than generating on-demand
        }

        // No prefetched question - generate on-demand
        console.log('[WatIsICTOLessonPage] No prefetched question, generating on-demand...');
        
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

        // Use cached theory content if available
        if (!this.cachedTheoryContent) {
            console.log('[WatIsICTOLessonPage] Extracting theory content for next question...');
            this.cachedTheoryContent = this.aiGenerator.extractTheoryText(this.content.theorie.content || []);
        }

        const theoryContent = this.cachedTheoryContent;
        
        if (!theoryContent || theoryContent.trim().length === 0) {
            this.showErrorInContainer('Geen theorie content gevonden om vragen van te genereren.');
            return;
        }

        // Generate ONE new question
        console.log('[WatIsICTOLessonPage] Generating next question... (question #' + (this.questionCounter + 1) + ')');
        
        // Calculate total segments once
        if (this.totalSegments === null) {
            this.totalSegments = this.aiGenerator.getTotalSegments(theoryContent);
            console.log('[WatIsICTOLessonPage] Total segments available:', this.totalSegments);
        }
        
        // Get next available segment index
        const nextSegmentIndex = this.getNextAvailableSegmentIndex();
        console.log('[WatIsICTOLessonPage] Using segment index:', nextSegmentIndex);
        
        // Get theory segment for this question
        const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
        
        const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
        
        if (generatedQuestions && generatedQuestions.length > 0) {
            // Track this segment as used
            this.usedSegments.push(nextSegmentIndex);
            const maxTrackedSegments = Math.min(this.totalSegments - 1, Math.max(2, Math.floor(this.totalSegments / 2)));
            if (this.usedSegments.length > maxTrackedSegments) {
                this.usedSegments.shift();
            }
            console.log('[WatIsICTOLessonPage] Used segments:', this.usedSegments);
            
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
            
            // Prefetch next question in background
            this.prefetchNextQuestion();
        } else {
            throw new Error('No question generated');
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

        // If we haven't used all segments yet, find an unused one
        if (this.usedSegments.length < this.totalSegments) {
            // Try to find a segment that hasn't been used recently
            for (let i = 0; i < this.totalSegments; i++) {
                if (!this.usedSegments.includes(i)) {
                    return i;
                }
            }
        }

        // All segments have been used - cycle through them
        // Find the least recently used segment
        const leastRecentlyUsed = this.usedSegments[0] ?? 0;
        return leastRecentlyUsed;
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
                        <div class="flex-1">
                            <h3 class="font-semibold text-red-900 dark:text-red-200 mb-1">Fout bij genereren</h3>
                            <p class="text-red-800 dark:text-red-300 text-sm mb-3">${message}</p>
                            <div class="flex space-x-2">
                                <button 
                                    id="retry-generate-mc-question-btn"
                                    class="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors text-sm font-medium flex items-center space-x-2">
                                    <i class="fas fa-redo"></i>
                                    <span>Opnieuw proberen</span>
                                </button>
                                <button 
                                    onclick="location.reload()" 
                                    class="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm">
                                    Pagina verversen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Setup retry button
            const retryBtn = document.getElementById('retry-generate-mc-question-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    this.generateMCQuestions();
                });
            }
        }
    }

    /**
     * Show quota exceeded message
     */
    showQuotaExceededMessage() {
        const container = document.getElementById('mc-questions-container');
        if (container) {
            container.innerHTML = `
                <div class="border border-yellow-200 dark:border-yellow-800 rounded-lg p-5 bg-yellow-50 dark:bg-yellow-900/20">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-exclamation-triangle text-yellow-600 dark:text-yellow-400 mt-1"></i>
                        <div class="flex-1">
                            <h3 class="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">API Quota Bereikt</h3>
                            <p class="text-yellow-800 dark:text-yellow-300 text-sm mb-3">
                                De dagelijkse limiet voor AI-vraag generatie is bereikt. Probeer het morgen opnieuw of werk verder met de theorie content.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Override renderContent om navigation buttons te verbergen
     * @returns {string} HTML string zonder navigation buttons
     */
    renderContent() {
        const contentSections = this.renderContentSections();
        
        return `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 box-border overflow-x-hidden">
                <article class="space-y-6 sm:space-y-8 fade-in box-border overflow-x-hidden">
                    ${this.renderModuleIntro()}
                    ${contentSections}
                </article>
            </div>
        `;
    }

    /**
     * Attach event listeners (override base class)
     */
    attachEventListeners() {
        super.attachEventListeners();
        
        // Listen for "next question" event (global event, can be set up immediately)
        window.addEventListener('loadNextMCQuestion', () => {
            this.loadNextQuestion();
        });
        
        // Setup button to generate MC questions - use setTimeout to ensure DOM is ready
        // This is especially important when content is loaded via AppRouter (SPA mode)
        setTimeout(() => {
            this.setupMCQuestionButton();
        }, 100);
    }

    /**
     * Setup MC question generator button
     * Separated into its own method so it can be called after DOM is ready
     */
    setupMCQuestionButton(retries = 5) {
        const generateBtn = document.getElementById('generate-mc-question-btn');
        if (generateBtn) {
            // Check if button already has event listener (prevent duplicates)
            if (generateBtn.dataset.listenerAttached === 'true') {
                console.log('[WatIsICTOLessonPage] MC question button already has listener');
                return;
            }
            
            // Remove any existing listeners to prevent duplicates
            const newBtn = generateBtn.cloneNode(true);
            generateBtn.parentNode.replaceChild(newBtn, generateBtn);
            
            // Mark as having listener attached
            newBtn.dataset.listenerAttached = 'true';
            
            // Add click event listener
            newBtn.addEventListener('click', () => {
                newBtn.disabled = true;
                newBtn.innerHTML = `
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Genereren...</span>
                `;
                this.generateMCQuestions();
            });
            
            console.log('[WatIsICTOLessonPage] ✅ MC question button setup complete');
        } else if (retries > 0) {
            // Retry if button not found (DOM might not be ready yet)
            console.log('[WatIsICTOLessonPage] MC question button not found, retrying... (' + retries + ' retries left)');
            setTimeout(() => {
                this.setupMCQuestionButton(retries - 1);
            }, 200);
        } else {
            console.warn('[WatIsICTOLessonPage] ⚠️ MC question button not found after retries');
        }
    }

    /**
     * Lifecycle hook: Called after content is loaded
     * @returns {Promise<boolean>} Return false to stop initialization
     */
    async afterContentLoaded() {
        if (!this.content || !this.contentLoaded) {
            console.error('[WatIsICTOLessonPage] ❌ Content not loaded properly');
            return false;
        }
        
        if (!this.content.theorie) {
            console.warn('[WatIsICTOLessonPage] ⚠️ Theorie section missing in content');
        }
        
        return true;
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = WatIsICTOLessonPage;
    } else {
        window.WatIsICTOLessonPage = WatIsICTOLessonPage;
    }
    console.log('[WatIsICTOLessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[WatIsICTOLessonPage] ❌ Error exporting:', error);
    try {
        window.WatIsICTOLessonPage = WatIsICTOLessonPage;
    } catch (e) {
        console.error('[WatIsICTOLessonPage] ❌ Failed to force export:', e);
    }
}
