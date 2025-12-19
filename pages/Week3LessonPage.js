/**
 * Week3LessonPage
 * 
 * Specifieke pagina voor Week 3: Onderzoeksmodel + Onderzoeksvragen
 * Basis template voor collega's om content toe te voegen
 */

class Week3LessonPage extends BaseLessonPage {
    constructor() {
        super('week-3', 'Week 3', 'Onderzoeksmodel + Onderzoeksvragen');
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

        // Render leerdoelen sectie
        const leerdoelenContent = `
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

        // Render theorie sectie
        const theorieContent = this.content.theorie.content 
            ? ContentRenderer.renderContentItems(this.content.theorie.content, { enableModal: true })
            : (this.content.theorie.paragraphs ? this.content.theorie.paragraphs.map(paragraph => `
                <p class="text-gray-700 dark:text-gray-300 mb-4">${paragraph}</p>
            `).join('') : '');
        const theorieTitle = this.content.theorie?.title || 'Theorie';

        return `
            ${this.contentTemplateRenderer.renderSection(
                this.content.leerdoelen.title,
                leerdoelenContent,
                'bullseye',
                'green',
                { headingSize: 'text-lg sm:text-xl' }
            )}
            ${this.contentTemplateRenderer.renderSection(
                theorieTitle,
                theorieContent,
                'book',
                'purple'
            )}
            ${this.content.mcVragen ? this.renderMCQuestionsSection() : ''}
        `;
    }

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
            console.log('Starting MC question generation...');
            
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

            // OPTIE 2: Use cached theory content if available, otherwise extract and cache
            if (!this.cachedTheoryContent) {
                console.log('[Week3LessonPage] Extracting theory content (first time)...');
                this.cachedTheoryContent = this.aiGenerator.extractTheoryText(this.content.theorie.content || []);
                console.log('[Week3LessonPage] Cached theory content length:', this.cachedTheoryContent?.length || 0);
            } else {
                console.log('[Week3LessonPage] Using cached theory content');
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
                console.log('[Week3LessonPage] Total segments available:', this.totalSegments);
            }

            // Generate ONE question at a time for endless mode
            console.log('Generating single question... (question #' + (this.questionCounter + 1) + ')');
            
            // Get next available segment index (avoids recently used segments)
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            console.log('[Week3LessonPage] Using segment index:', nextSegmentIndex);
            
            // Get theory segment for this question (ensures variety by using different parts of text)
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            console.log('[Week3LessonPage] Theory segment length:', theorySegment.length);
            console.log('[Week3LessonPage] Theory segment preview:', theorySegment.substring(0, 100) + '...');
            
            console.log('[Week3LessonPage] Calling AIGenerator.generateMCQuestions...');
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            console.log('[Week3LessonPage] ✅ Generated question received:', generatedQuestions);
            
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
                console.log('[Week3LessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
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
            console.error('[Week3LessonPage] ❌ Error generating MC questions:', error);
            console.error('[Week3LessonPage] Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack?.substring(0, 500),
                hostname: window.location.hostname,
                isVercel: window.location.hostname.includes('vercel.app')
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
            console.log('[Week3LessonPage] Prefetching next question in background...');

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
                console.log('[Week3LessonPage] ✅ Next question prefetched successfully (segment:', nextSegmentIndex + ')');
            }
        } catch (error) {
            console.warn('[Week3LessonPage] Prefetch failed (will generate on-demand):', error.message);
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
                console.log('[Week3LessonPage] ✅ Using prefetched question (instant!)');
                
                // Get segment index from prefetched question
                const prefetchedSegmentIndex = this.prefetchedQuestion._segmentIndex ?? this.segmentIndex;
                
                // Track this segment as used
                this.usedSegments.push(prefetchedSegmentIndex);
                // Keep track of recently used segments
                const maxTrackedSegments = Math.min(this.totalSegments - 1, Math.max(2, Math.floor(this.totalSegments / 2)));
                if (this.usedSegments.length > maxTrackedSegments) {
                    this.usedSegments.shift();
                }
                console.log('[Week3LessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
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
            console.log('[Week3LessonPage] No prefetched question, generating on-demand...');
            
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
                console.log('[Week3LessonPage] Extracting theory content for next question...');
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
                console.log('[Week3LessonPage] Total segments available:', this.totalSegments);
            }
            
            // Get next available segment index
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            console.log('[Week3LessonPage] Using segment index:', nextSegmentIndex);
            
            // Get theory segment for this question (ensures variety by using different parts of text)
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            console.log('[Week3LessonPage] Theory segment length:', theorySegment.length);
            console.log('[Week3LessonPage] Theory segment preview:', theorySegment.substring(0, 100) + '...');
            
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            
            if (generatedQuestions && generatedQuestions.length > 0) {
                // Track this segment as used
                this.usedSegments.push(nextSegmentIndex);
                // Keep only last 3 used segments
                if (this.usedSegments.length > 3) {
                    this.usedSegments.shift();
                }
                console.log('[Week3LessonPage] Used segments (last 3):', this.usedSegments);
                
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
            
            // Check for QUOTA_EXCEEDED error
            if (error.quotaExceeded || error.message === 'QUOTA_EXCEEDED' || error.message.includes('QUOTA_EXCEEDED')) {
                this.showQuotaExceededMessage();
            } else {
                const errorMessage = error.message || 'Er is een fout opgetreden bij het genereren van de volgende vraag.';
                this.showErrorInContainer(errorMessage);
            }
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
     * Uses retry mechanism to handle async DOM updates in SPA mode
     */
    setupMCQuestionButton(retries = 5) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Week3LessonPage.js:570',message:'setupMCQuestionButton called',data:{retries,hostname:window.location.hostname,isVercel:window.location.hostname.includes('vercel.app')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        const generateBtn = document.getElementById('generate-mc-question-btn');
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Week3LessonPage.js:571',message:'Button lookup result',data:{buttonFound:!!generateBtn,buttonId:generateBtn?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (generateBtn) {
            // Check if button already has event listener (prevent duplicates)
            if (generateBtn.dataset.listenerAttached === 'true') {
                console.log('[Week3LessonPage] MC question button already has listener');
                return;
            }
            
            // Remove any existing listeners to prevent duplicates
            const newBtn = generateBtn.cloneNode(true);
            generateBtn.parentNode.replaceChild(newBtn, generateBtn);
            
            // Mark as having listener attached
            newBtn.dataset.listenerAttached = 'true';
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Disable button and show loading state
                newBtn.disabled = true;
                newBtn.innerHTML = `
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Genereren...</span>
                `;
                
                // Generate the question
                this.generateMCQuestions();
            });
            
            console.log('[Week3LessonPage] ✅ MC question button setup complete');
        } else if (retries > 0) {
            // Retry if button not found yet (DOM might still be updating)
            console.log(`[Week3LessonPage] ⏳ MC question button not found, retrying... (${retries} attempts left)`);
            setTimeout(() => {
                this.setupMCQuestionButton(retries - 1);
            }, 100);
        } else {
            console.warn('[Week3LessonPage] ⚠️ MC question button not found in DOM after all retries');
        }
    }

    /**
     * Lifecycle hook: Called after event listeners are attached
     * Handles hash navigation and MC question setup
     */
    async afterEventListeners() {
        // Ensure MC question button is setup (backup in case attachEventListeners was called too early)
        // This is especially important in SPA mode where DOM updates happen asynchronously
        setTimeout(() => {
            this.setupMCQuestionButton();
        }, 200);
        
        // Handle hash in URL after content is loaded
        if (window.location.hash) {
            setTimeout(() => {
                const element = document.querySelector(window.location.hash);
                if (element) {
                    const mainContent = document.getElementById('main-content');
                    const headerOffset = 100;
                    
                    if (mainContent) {
                        const elementRect = element.getBoundingClientRect();
                        const elementTop = elementRect.top + mainContent.scrollTop;
                        const offsetPosition = elementTop - headerOffset;
                        
                        mainContent.scrollTo({
                            top: Math.max(0, offsetPosition),
                            behavior: 'smooth'
                        });
                    } else {
                        const elementRect = element.getBoundingClientRect();
                        const offsetPosition = elementRect.top + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: Math.max(0, offsetPosition),
                            behavior: 'smooth'
                        });
                    }
                }
            }, 500); // Delay to ensure content is fully rendered
        }
        
        // MC questions are now generated on button click (not automatically)
        // This saves API tokens
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Week3LessonPage;
    } else {
        window.Week3LessonPage = Week3LessonPage;
    }
    console.log('[Week3LessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[Week3LessonPage] ❌ Error exporting:', error);
    try {
        window.Week3LessonPage = Week3LessonPage;
    } catch (e) {
        console.error('[Week3LessonPage] ❌ Failed to force export:', e);
    }
}
