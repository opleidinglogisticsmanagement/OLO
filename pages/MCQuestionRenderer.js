/**
 * MCQuestionRenderer
 * 
 * Renderer voor Multiple Choice vragen
 * Ondersteunt feedback bij goed/fout antwoord
 */

class MCQuestionRenderer {
    /**
     * Shuffle array (Fisher-Yates algorithm)
     */
    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Shuffle answers and update correct answer ID
     * This randomizes the position of the correct answer (not always B)
     */
    static shuffleAnswers(vraag) {
        const answers = [...vraag.antwoorden];
        const shuffled = this.shuffleArray(answers);
        
        // Update answer IDs to a, b, c, d in order
        // The 'correct' flag is preserved, so it can be in any position now
        const answerLetters = ['a', 'b', 'c', 'd'];
        shuffled.forEach((answer, index) => {
            answer.id = answerLetters[index];
        });
        
        return {
            ...vraag,
            antwoorden: shuffled
        };
    }

    /**
     * Render een MC vragen sectie - ONE QUESTION AT A TIME MODE
     * @param {Object} mcConfig - Configuratie object met vragen
     * @param {string} containerId - ID van de container waar vragen gerenderd worden
     * @param {Object} currentQuestion - Huidige vraag object (voor one-at-a-time mode)
     */
    static render(mcConfig, containerId = 'mc-questions-container', currentQuestion = null) {
        const title = mcConfig.title || 'Test je kennis';
        const description = mcConfig.description || 'Beantwoord de onderstaande vragen om te controleren of je de theorie goed begrijpt.';

        // If currentQuestion is provided, render only that question (one-at-a-time mode)
        if (currentQuestion) {
            const shuffledQuestion = this.shuffleAnswers(currentQuestion);
            return `
                <!-- MC Vragen Sectie -->
                <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift mt-8">
                    <div class="flex items-start space-x-4">
                        <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="fas fa-question-circle text-indigo-600 text-lg"></i>
                        </div>
                        <div class="flex-1">
                            <h2 class="text-xl font-semibold text-gray-900 mb-4">${this.escapeHtml(title)}</h2>
                            ${description ? `<p class="text-gray-600 mb-6">${this.escapeHtml(description)}</p>` : ''}
                            
                            <div id="${containerId}" class="space-y-6">
                                ${this.renderQuestion(shuffledQuestion, 0, true)}
                            </div>
                        </div>
                    </div>
                </section>
            `;
        }

        // Legacy mode: render all questions
        if (!mcConfig || !mcConfig.vragen || !Array.isArray(mcConfig.vragen)) {
            return '';
        }

        return `
            <!-- MC Vragen Sectie -->
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift mt-8">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-question-circle text-indigo-600 text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">${this.escapeHtml(title)}</h2>
                        ${description ? `<p class="text-gray-600 mb-6">${this.escapeHtml(description)}</p>` : ''}
                        
                        <div id="${containerId}" class="space-y-6">
                            ${mcConfig.vragen.map((vraag, index) => {
                                const shuffled = this.shuffleAnswers(vraag);
                                return this.renderQuestion(shuffled, index);
                            }).join('')}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render een individuele vraag
     * @param {Object} vraag - Vraag object
     * @param {number} index - Index van de vraag
     * @param {boolean} oneAtATime - Of dit één-voor-één mode is (met "Volgende vraag" button)
     * @returns {string} HTML string
     */
    static renderQuestion(vraag, index, oneAtATime = false) {
        const vraagId = vraag.id || `vraag-${index + 1}`;
        const vraagText = vraag.vraag || 'Vraag';
        
        return `
            <div class="mc-question" data-question-id="${vraagId}">
                <div class="border border-gray-200 rounded-lg p-5 bg-gray-50">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">
                        ${oneAtATime ? 'Vraag:' : `Vraag ${index + 1}:`} ${this.escapeHtml(vraagText)}
                    </h3>
                    
                    <div class="space-y-3 mb-4">
                        ${vraag.antwoorden.map((antwoord, answerIndex) => 
                            this.renderAnswerOption(vraagId, antwoord, answerIndex)
                        ).join('')}
                    </div>
                    
                    <div id="feedback-${vraagId}" class="feedback-container hidden mt-4"></div>
                    
                    ${oneAtATime ? `
                        <div id="next-question-btn-${vraagId}" class="hidden mt-4">
                            <button onclick="MCQuestionRenderer.loadNextQuestion()" 
                                    class="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus-ring transition-colors flex items-center justify-center space-x-2">
                                <i class="fas fa-arrow-right"></i>
                                <span>Volgende AI-gegenereerde vraag</span>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Render een antwoordoptie
     * @param {string} vraagId - ID van de vraag
     * @param {Object} antwoord - Antwoord object
     * @param {number} answerIndex - Index van het antwoord
     * @returns {string} HTML string
     */
    static renderAnswerOption(vraagId, antwoord, answerIndex) {
        const optionId = `${vraagId}-${antwoord.id}`;
        const optionLetter = antwoord.id.toUpperCase();
        
        return `
            <label class="flex items-start space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors mc-option" 
                   data-question-id="${vraagId}" 
                   data-answer-id="${antwoord.id}"
                   data-is-correct="${antwoord.correct === true}">
                <input type="radio" 
                       name="${vraagId}" 
                       id="${optionId}"
                       value="${antwoord.id}"
                       class="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 focus-ring"
                       data-is-correct="${antwoord.correct === true}"
                       onchange="MCQuestionRenderer.handleAnswer('${vraagId}', '${antwoord.id}')">
                <span class="flex-1">
                    <span class="font-medium text-gray-900">${optionLetter}.</span>
                    <span class="ml-2 text-gray-700">${this.escapeHtml(antwoord.tekst)}</span>
                </span>
            </label>
        `;
    }

    /**
     * Handle antwoord selectie
     * @param {string} vraagId - ID van de vraag
     * @param {string} answerId - ID van het geselecteerde antwoord
     */
    static handleAnswer(vraagId, answerId) {
        const questionElement = document.querySelector(`[data-question-id="${vraagId}"]`);
        const feedbackContainer = document.getElementById(`feedback-${vraagId}`);
        
        if (!questionElement || !feedbackContainer) {
            return;
        }

        // Get the selected option element and check if it's correct
        const selectedOption = questionElement.querySelector(`[data-answer-id="${answerId}"]`);
        const selectedRadio = selectedOption ? selectedOption.querySelector('input[type="radio"]') : null;
        const isCorrect = selectedRadio ? selectedRadio.getAttribute('data-is-correct') === 'true' : false;

        // Disable all options for this question
        const allOptions = questionElement.querySelectorAll('.mc-option');
        allOptions.forEach(option => {
            const radio = option.querySelector('input[type="radio"]');
            if (radio) {
                radio.disabled = true;
            }
            option.classList.add('opacity-60');
            option.classList.remove('cursor-pointer', 'hover:bg-blue-50');
        });

        // Get feedback from data attributes or from question config
        const vraagData = this.getQuestionData(vraagId);
        const feedbackGoed = vraagData?.feedbackGoed || 'Goed gedaan! Dit is het juiste antwoord.';
        const feedbackFout = vraagData?.feedbackFout || 'Niet helemaal juist. Bekijk de theorie nog eens.';

        // Show feedback
        if (isCorrect) {
            selectedOption.classList.add('bg-green-50', 'border-green-500');
            feedbackContainer.className = 'feedback-container mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg';
            feedbackContainer.innerHTML = `
                <div class="flex items-start space-x-3">
                    <i class="fas fa-check-circle text-green-600 mt-1"></i>
                    <div>
                        <p class="font-semibold text-green-900 mb-1">Correct!</p>
                        <p class="text-green-800 text-sm">${this.escapeHtml(feedbackGoed)}</p>
                    </div>
                </div>
            `;
            feedbackContainer.classList.remove('hidden');
        } else {
            selectedOption.classList.add('bg-red-50', 'border-red-500');
            
            // Find and highlight correct answer
            const correctOption = questionElement.querySelector('[data-is-correct="true"]');
            if (correctOption) {
                correctOption.classList.add('bg-green-50', 'border-green-500');
            }
            
            feedbackContainer.className = 'feedback-container mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg';
            feedbackContainer.innerHTML = `
                <div class="flex items-start space-x-3">
                    <i class="fas fa-times-circle text-red-600 mt-1"></i>
                    <div>
                        <p class="font-semibold text-red-900 mb-1">Niet helemaal juist</p>
                        <p class="text-red-800 text-sm">${this.escapeHtml(feedbackFout)}</p>
                    </div>
                </div>
            `;
            feedbackContainer.classList.remove('hidden');
        }
        
        // Show "Next Question" button if in one-at-a-time mode
        const nextBtn = document.getElementById(`next-question-btn-${vraagId}`);
        if (nextBtn) {
            nextBtn.classList.remove('hidden');
        }
    }

    /**
     * Get question data from the rendered DOM
     * @param {string} vraagId - ID van de vraag
     * @returns {Object|null} Question data
     */
    static getQuestionData(vraagId) {
        const questionElement = document.querySelector(`[data-question-id="${vraagId}"]`);
        if (!questionElement) {
            return null;
        }
        
        // Try to get from data attribute or find in global questions array
        if (window.mcQuestionsData && window.mcQuestionsData[vraagId]) {
            return window.mcQuestionsData[vraagId];
        }
        
        return null;
    }

    /**
     * Store question data globally for later retrieval
     * @param {Array} vragen - Array van vragen
     */
    static storeQuestionData(vragen) {
        if (!window.mcQuestionsData) {
            window.mcQuestionsData = {};
        }
        
        vragen.forEach(vraag => {
            const vraagId = vraag.id || `vraag-${vragen.indexOf(vraag) + 1}`;
            window.mcQuestionsData[vraagId] = {
                feedbackGoed: vraag.feedbackGoed,
                feedbackFout: vraag.feedbackFout
            };
        });
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show loading state
     * @param {string} containerId - ID of container
     * @returns {string} Loading HTML
     */
    static renderLoadingState(containerId) {
        return `
            <div id="${containerId}" class="space-y-6">
                <div class="border border-gray-200 rounded-lg p-5 bg-gray-50">
                    <div class="flex items-center justify-center space-x-3 py-8">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        <p class="text-gray-600">AI-generatie vragen...</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Load next AI-generated question (called from button click)
     */
    static loadNextQuestion() {
        // Trigger event that Week2LessonPage will listen to
        const event = new CustomEvent('loadNextMCQuestion');
        window.dispatchEvent(event);
    }

    /**
     * Show error state
     * @param {string} errorMessage - Error message to display
     * @returns {string} Error HTML
     */
    static renderErrorState(errorMessage) {
        return `
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mt-4">
                <div class="flex items-start space-x-3">
                    <i class="fas fa-exclamation-triangle text-red-600 mt-1"></i>
                    <div>
                        <h3 class="font-semibold text-red-900 mb-1">Fout bij het laden van vragen</h3>
                        <p class="text-red-800 text-sm">${this.escapeHtml(errorMessage)}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MCQuestionRenderer;
} else {
    window.MCQuestionRenderer = MCQuestionRenderer;
}

