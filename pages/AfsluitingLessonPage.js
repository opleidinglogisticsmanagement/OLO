/**
 * AfsluitingLessonPage
 * 
 * Specifieke pagina voor Afsluiting: Eindbeoordeling & Certificering
 */

class AfsluitingLessonPage extends BaseLessonPage {
    constructor() {
        super('afsluiting', 'Afsluiting', 'Eindbeoordeling & Certificering');
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
        this.segmentIndex = 0; // Track which text segment to use (for variety)
        this.usedSegments = []; // Track recently used segments to avoid repetition
        this.totalSegments = null; // Cache total number of segments
    }

    /**
     * Laad content uit JSON bestand met retry logica (optioneel - als bestand bestaat)
     */
    async loadContent(retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Probeer verschillende paden
                const paths = [
                    './content/afsluiting.content.json',
                    'content/afsluiting.content.json',
                    '/content/afsluiting.content.json'
                ];
                
                let lastError = null;
                for (const contentPath of paths) {
                    try {
                        console.log(`[AfsluitingLessonPage] Loading content from: ${contentPath} (attempt ${attempt}/${retries})`);
                        const response = await fetch(contentPath, {
                            cache: 'no-cache',
                            headers: {
                                'Accept': 'application/json'
                            }
                        });
                        
                        if (!response.ok) {
                            // Bestand bestaat niet - gebruik fallback (dit is OK voor Afsluiting)
                            console.log(`[AfsluitingLessonPage] File not found at ${contentPath}, using fallback content`);
                            this.content = this.getFallbackContent();
                            this.contentLoaded = true;
                            return;
                        }
                        
                        const contentType = response.headers.get('content-type');
                        if (!contentType || !contentType.includes('application/json')) {
                            console.warn(`[AfsluitingLessonPage] Unexpected content-type: ${contentType}`);
                        }
                        
                        this.content = await response.json();
                        this.contentLoaded = true;
                        console.log('[AfsluitingLessonPage] ✅ Content loaded successfully');
                        return; // Success, exit function
                    } catch (pathError) {
                        console.warn(`[AfsluitingLessonPage] Failed to load from ${contentPath}:`, pathError.message);
                        lastError = pathError;
                        // Try next path
                    }
                }
                
                // All paths failed - voor Afsluiting is dit OK, gebruik fallback
                console.log('[AfsluitingLessonPage] Content file not found, using fallback content');
                this.content = this.getFallbackContent();
                this.contentLoaded = true;
                return;
            } catch (error) {
                console.error(`[AfsluitingLessonPage] Error loading content (attempt ${attempt}/${retries}):`, error);
                
                if (attempt === retries) {
                    // Last attempt failed - voor Afsluiting is dit OK
                    console.log('[AfsluitingLessonPage] Using fallback content');
                    this.contentLoaded = true;
                    this.content = this.getFallbackContent();
                } else {
                    // Wait before retry (exponential backoff)
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    console.log(`[AfsluitingLessonPage] Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
    }

    /**
     * Fallback content als JSON niet bestaat
     */
    getFallbackContent() {
        return {
            intro: {
                title: "Afsluiting",
                subtitle: "Eindbeoordeling & Certificering",
                description: "Welkom bij de afsluiting van deze module."
            },
            leerdoelen: {
                title: "Leerdoelen",
                description: "",
                items: []
            },
            theorie: {
                title: "Theorie",
                content: [
                    {
                        type: "paragraph",
                        text: [
                            "Content voor de afsluiting kan hier worden toegevoegd."
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
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift transition-colors duration-200 sticky top-[56px] sm:top-[64px] z-30 mb-6 sm:mb-8">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-book text-blue-600 dark:text-blue-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${this.content.intro.title}: ${this.content.intro.subtitle}</h1>
                        ${this.content.intro.description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${this.content.intro.description}</p>` : ''}
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
            ${this.content.leerdoelen ? `
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
                                storageKey: 'afsluiting-learning-objectives'
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
            ` : ''}

            ${this.content.theorie ? `
            <!-- Theorie Sectie -->
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas fa-book text-purple-600 dark:text-purple-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">${this.content.theorie.title}</h2>
                        <div class="prose max-w-none">
                            ${this.content.theorie.content 
                                ? ContentRenderer.renderContentItems(this.content.theorie.content, { enableModal: true })
                                : (this.content.theorie.paragraphs ? this.content.theorie.paragraphs.map(paragraph => `
                                    <p class="text-gray-700 dark:text-gray-300 mb-4">${paragraph}</p>
                                `).join('') : '')
                            }
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}

            ${this.content.mcVragen ? this.renderMCQuestionsSection() : ''}

        `;
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
                            Er is een probleem opgetreden bij het laden van de content.
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
                console.log('[AfsluitingLessonPage] Extracting theory content (first time)...');
                this.cachedTheoryContent = this.aiGenerator.extractTheoryText(this.content.theorie.content || []);
                console.log('[AfsluitingLessonPage] Cached theory content length:', this.cachedTheoryContent?.length || 0);
            } else {
                console.log('[AfsluitingLessonPage] Using cached theory content');
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
                console.log('[AfsluitingLessonPage] Total segments available:', this.totalSegments);
            }

            // Generate ONE question at a time for endless mode
            console.log('Generating single question... (question #' + (this.questionCounter + 1) + ')');
            
            // Get next available segment index (avoids recently used segments)
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            console.log('[AfsluitingLessonPage] Using segment index:', nextSegmentIndex);
            
            // Get theory segment for this question (ensures variety by using different parts of text)
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            console.log('[AfsluitingLessonPage] Theory segment length:', theorySegment.length);
            console.log('[AfsluitingLessonPage] Theory segment preview:', theorySegment.substring(0, 100) + '...');
            
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
                console.log('[AfsluitingLessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
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
            console.log('[AfsluitingLessonPage] Prefetching next question in background...');

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
                console.log('[AfsluitingLessonPage] ✅ Next question prefetched successfully (segment:', nextSegmentIndex + ')');
            }
        } catch (error) {
            console.warn('[AfsluitingLessonPage] Prefetch failed (will generate on-demand):', error.message);
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
                console.log('[AfsluitingLessonPage] ✅ Using prefetched question (instant!)');
                
                // Get segment index from prefetched question
                const prefetchedSegmentIndex = this.prefetchedQuestion._segmentIndex ?? this.segmentIndex;
                
                // Track this segment as used
                this.usedSegments.push(prefetchedSegmentIndex);
                // Keep track of recently used segments
                const maxTrackedSegments = Math.min(this.totalSegments - 1, Math.max(2, Math.floor(this.totalSegments / 2)));
                if (this.usedSegments.length > maxTrackedSegments) {
                    this.usedSegments.shift();
                }
                console.log('[AfsluitingLessonPage] Used segments (last', maxTrackedSegments + '):', this.usedSegments);
                
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
            console.log('[AfsluitingLessonPage] No prefetched question, generating on-demand...');
            
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
                console.log('[AfsluitingLessonPage] Extracting theory content for next question...');
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
                console.log('[AfsluitingLessonPage] Total segments available:', this.totalSegments);
            }
            
            // Get next available segment index
            const nextSegmentIndex = this.getNextAvailableSegmentIndex();
            console.log('[AfsluitingLessonPage] Using segment index:', nextSegmentIndex);
            
            // Get theory segment for this question (ensures variety by using different parts of text)
            const theorySegment = this.aiGenerator.getTheorySegment(theoryContent, nextSegmentIndex);
            console.log('[AfsluitingLessonPage] Theory segment length:', theorySegment.length);
            console.log('[AfsluitingLessonPage] Theory segment preview:', theorySegment.substring(0, 100) + '...');
            
            const generatedQuestions = await this.aiGenerator.generateMCQuestions(theorySegment, 1, nextSegmentIndex);
            
            if (generatedQuestions && generatedQuestions.length > 0) {
                // Track this segment as used
                this.usedSegments.push(nextSegmentIndex);
                // Keep only last 3 used segments
                if (this.usedSegments.length > 3) {
                    this.usedSegments.shift();
                }
                console.log('[AfsluitingLessonPage] Used segments (last 3):', this.usedSegments);
                
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
        
        // Generate MC questions after content is loaded
        if (this.content && this.content.mcVragen) {
            this.generateMCQuestions();
        }
        
        // Listen for "next question" event
        window.addEventListener('loadNextMCQuestion', () => {
            this.loadNextQuestion();
        });
    }

    /**
     * Initialiseer de pagina met content loading
     */
    async init() {
        await this.loadContent();
        document.body.innerHTML = this.render();
        this.attachEventListeners();
        
        // Generate MC questions if needed (after DOM is ready)
        if (this.content && this.content.mcVragen && this.content.mcVragen.generateFromTheory) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                this.generateMCQuestions();
            }, 100);
        }
    }
}

// Export voor gebruik in andere modules
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AfsluitingLessonPage;
    } else {
        window.AfsluitingLessonPage = AfsluitingLessonPage;
    }
    console.log('[AfsluitingLessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[AfsluitingLessonPage] ❌ Error exporting:', error);
    // Force export even if there was an error
    try {
        window.AfsluitingLessonPage = AfsluitingLessonPage;
    } catch (e) {
        console.error('[AfsluitingLessonPage] ❌ Failed to force export:', e);
    }
}
