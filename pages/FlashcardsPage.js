/**
 * FlashcardsPage (nu 'Oefenen')
 * 
 * Pagina voor het oefenen van begrippen met diverse modi:
 * 1. Flashcards: Studenten kunnen begrippen oefenen door kaartjes om te draaien
 * 2. Quiz: Meerkeuzevragen op basis van definities
 */

class FlashcardsPage extends BaseLessonPage {
    constructor() {
        super('flashcards', 'Oefenen', 'Kies een oefenmethode');
        this.terms = [];
        this.currentIndex = 0;
        this.isFlipped = false;
        this.currentMode = null; // 'flashcards', 'quiz', of null (keuzemenu)
        
        // Quiz state
        this.quizScore = 0;
        this.quizTotal = 0;
        this.weeklyHighscore = 0;
        this.newHighscore = false;
        this.currentQuizQuestion = null;
        this.quizFeedback = null; // null, 'correct', 'incorrect'
    }

    /**
     * Helper: Bereken het ISO weeknummer
     */
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    /**
     * Helper: Haal week highscore op
     */
    getWeeklyHighscore() {
        const now = new Date();
        const weekKey = `olo_highscore_${now.getFullYear()}_${this.getWeekNumber(now)}`;
        return parseInt(localStorage.getItem(weekKey) || '0');
    }

    /**
     * Helper: Check en sla highscore op
     * Returns true als het een nieuwe highscore is
     */
    checkAndSaveHighscore(score) {
        const now = new Date();
        const weekKey = `olo_highscore_${now.getFullYear()}_${this.getWeekNumber(now)}`;
        const currentHighscore = this.getWeeklyHighscore();

        if (score > currentHighscore) {
            localStorage.setItem(weekKey, score.toString());
            this.weeklyHighscore = score;
            return true;
        }
        return false;
    }

    /**
     * Laad begrippen uit JSON bestand
     */
    async loadTerms() {
        try {
            // Voeg timestamp toe en forceer geen cache
            const timestamp = new Date().getTime();
            const response = await fetch(`./content/register.json?v=${timestamp}`, {
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP fout: ${response.status} ${response.statusText} bij laden van register.json`);
            }
            
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Ongeldig data formaat: verwacht een array');
            }

            // Filter items zonder definitie eruit
            this.terms = data.filter(item => item.term && item.description);
            
            // Sorteer willekeurig (shuffle) voor flashcards
            this.terms = this.shuffleArray(this.terms);
            
        } catch (error) {
            console.error('Fout bij laden begrippenlijst:', error);
            this.error = error.message;
            this.terms = [];
        }
    }

    /**
     * Shuffle array (Fisher-Yates algorithm)
     */
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    /**
     * Start Flashcard modus
     */
    startFlashcards() {
        this.currentMode = 'flashcards';
        this.moduleSubtitle = 'Flashcards: Test je kennis';
        this.currentIndex = 0;
        this.isFlipped = false;
        this.terms = this.shuffleArray(this.terms); // Opnieuw schudden
        this.updatePage();
    }

    /**
     * Start Quiz modus
     */
    startQuiz() {
        this.currentMode = 'quiz';
        this.moduleSubtitle = 'Quiz: Begrippen Oefenen';
        this.quizScore = 0;
        this.quizTotal = 0;
        this.weeklyHighscore = this.getWeeklyHighscore();
        this.newHighscore = false;
        this.generateQuizQuestion();
        this.updatePage();
    }

    /**
     * Genereer een nieuwe quiz vraag
     */
    generateQuizQuestion() {
        if (this.terms.length < 4) {
            this.error = "Te weinig begrippen beschikbaar voor de quiz (minimaal 4 nodig).";
            return;
        }

        // Kies een willekeurig begrip als het juiste antwoord
        const correctTerm = this.terms[Math.floor(Math.random() * this.terms.length)];
        
        // Probeer afleiders te vinden die gerelateerd zijn (zelfde week/onderwerp)
        // Dit maakt de quiz moeilijker zoals gevraagd
        const relatedTerms = this.terms.filter(t => 
            t.term !== correctTerm.term && 
            t.location && correctTerm.location && 
            t.location.week === correctTerm.location.week
        );

        // Shuffle gerelateerde termen
        const shuffledRelated = this.shuffleArray(relatedTerms);
        
        // Kies zoveel mogelijk gerelateerde afleiders (max 3)
        const distractors = [...shuffledRelated.slice(0, 3)];
        
        // Als we nog niet genoeg afleiders hebben (minder dan 3), vul aan met willekeurige andere termen
        if (distractors.length < 3) {
            const otherTerms = this.terms.filter(t => 
                t.term !== correctTerm.term && 
                !distractors.includes(t)
            );
            const randomDistractors = this.shuffleArray(otherTerms).slice(0, 3 - distractors.length);
            distractors.push(...randomDistractors);
        }
        
        // Combineer en schud de opties
        const options = this.shuffleArray([correctTerm, ...distractors]);
        
        this.currentQuizQuestion = {
            correctTerm: correctTerm,
            options: options
        };
        
        this.quizFeedback = null;
    }

    /**
     * Verwerk quiz antwoord
     */
    handleQuizAnswer(selectedTerm) {
        if (this.quizFeedback !== null) return; // Al beantwoord

        const isCorrect = selectedTerm.term === this.currentQuizQuestion.correctTerm.term;
        this.quizFeedback = isCorrect ? 'correct' : 'incorrect';
        this.selectedAnswer = selectedTerm;
        
        if (isCorrect) {
            this.quizScore++;
            if (this.checkAndSaveHighscore(this.quizScore)) {
                this.newHighscore = true;
            }
        }
        this.quizTotal++;
        
        this.renderQuiz(); // Update weergave met feedback
    }

    /**
     * Update de hele pagina (opnieuw renderen en listeners attachen)
     */
    updatePage() {
        // Update header titel/subtitle in DOM direct als dat kan, anders volledige re-render
        document.body.innerHTML = this.render();
        this.attachEventListeners();
        
        if (this.currentMode === 'flashcards') {
            this.renderFlashcard();
        } else if (this.currentMode === 'quiz') {
            this.renderQuiz();
        }
    }

    /**
     * Terug naar hoofdmenu
     */
    resetToMenu() {
        this.currentMode = null;
        this.moduleSubtitle = 'Kies een oefenmethode';
        this.updatePage();
    }

    /**
     * Render module introductie
     */
    renderModuleIntro() {
        let icon = 'fa-graduation-cap';
        let desc = 'Kies hieronder hoe je de begrippen wilt oefenen.';
        
        if (this.currentMode === 'flashcards') {
            icon = 'fa-layer-group';
            desc = 'Draai de kaartjes om de definities te leren. Gebruik de pijltjestoetsen of knoppen om te navigeren.';
        } else if (this.currentMode === 'quiz') {
            icon = 'fa-question-circle';
            desc = 'Lees de omschrijving en kies het juiste begrip uit de vier opties.';
        }

        return `
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:pr-[70px] hover-lift transition-colors duration-200">
                <div class="flex flex-col sm:flex-row items-start">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <i class="fas ${icon} text-indigo-600 dark:text-indigo-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full sm:w-auto">
                        <div class="flex justify-between items-start">
                            <div>
                                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    ${this.currentMode === 'flashcards' ? 'Flashcards' : (this.currentMode === 'quiz' ? 'Begrippen Quiz' : 'Oefenen')}
                                </h1>
                                <p class="text-gray-600 dark:text-gray-300 mb-4">
                                    ${desc}
                                </p>
                            </div>
                            ${this.currentMode ? `
                                <button id="back-to-menu-btn" class="text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 flex items-center transition-colors">
                                    <i class="fas fa-arrow-left mr-1"></i> Terug naar overzicht
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render content secties op basis van modus
     */
    renderContentSections() {
        if (!this.currentMode) {
            return this.renderMenu();
        }

        return `
            <style>
                /* Flashcard Styles */
                .flashcard-perspective { perspective: 1000px; }
                .flashcard-inner {
                    position: relative; width: 100%; height: 100%; text-align: center;
                    transition: transform 0.6s; transform-style: preserve-3d; cursor: pointer;
                }
                .flashcard-inner.flipped { transform: rotateY(180deg); }
                .flashcard-front, .flashcard-back {
                    position: absolute; width: 100%; height: 100%;
                    -webkit-backface-visibility: hidden; backface-visibility: hidden;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    border-radius: 0.75rem; padding: 2rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                .flashcard-back { transform: rotateY(180deg); }

                /* Quiz Styles */
                .quiz-option {
                    transition: all 0.2s ease;
                }
                .quiz-option:hover:not(:disabled) {
                    transform: translateY(-2px);
                }
                .quiz-option.correct {
                    background-color: #d1fae5; border-color: #10b981; color: #065f46;
                }
                .dark .quiz-option.correct {
                    background-color: #064e3b; border-color: #059669; color: #d1fae5;
                }
                .quiz-option.incorrect {
                    background-color: #fee2e2; border-color: #ef4444; color: #991b1b;
                }
                .dark .quiz-option.incorrect {
                    background-color: #7f1d1d; border-color: #dc2626; color: #fee2e2;
                }
            </style>

            <section class="bg-transparent p-0 sm:p-6">
                <div id="exercise-container" class="max-w-3xl mx-auto">
                    <!-- Wordt gevuld door JavaScript -->
                    <div class="flex justify-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render het hoofdmenu (keuze tussen Flashcards en Quiz)
     */
    renderMenu() {
        return `
            <section class="mt-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <!-- Flashcards Option -->
                    <button id="mode-flashcards-btn" class="group flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 hover:shadow-md text-center h-full">
                        <div class="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-layer-group text-3xl text-indigo-600 dark:text-indigo-400"></i>
                        </div>
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Flashcards</h2>
                        <p class="text-gray-600 dark:text-gray-300">
                            Leer definities door kaartjes om te draaien. Ideaal om begrippen te stampen.
                        </p>
                        <div class="mt-6 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                            Start Oefening
                        </div>
                    </button>

                    <!-- Quiz Option -->
                    <button id="mode-quiz-btn" class="group flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-transparent hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-md text-center h-full">
                        <div class="w-20 h-20 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-question-circle text-3xl text-purple-600 dark:text-purple-400"></i>
                        </div>
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Begrippen Quiz</h2>
                        <p class="text-gray-600 dark:text-gray-300">
                            Test je kennis. Lees de omschrijving en selecteer het juiste begrip uit vier opties.
                        </p>
                        <div class="mt-6 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                            Start Quiz
                        </div>
                    </button>
                </div>
            </section>
        `;
    }

    /**
     * Render de Quiz interface
     */
    renderQuiz() {
        const container = document.getElementById('exercise-container');
        if (!container) return;

        if (this.error || !this.currentQuizQuestion) {
            container.innerHTML = this.renderErrorState();
            return;
        }

        const { correctTerm, options } = this.currentQuizQuestion;
        const isAnswered = this.quizFeedback !== null;

        let optionsHtml = options.map(option => {
            let stateClass = '';
            let icon = '';
            
            if (isAnswered) {
                if (option.term === correctTerm.term) {
                    stateClass = 'correct ring-2 ring-green-500';
                    icon = '<i class="fas fa-check text-green-600 dark:text-green-400 ml-auto"></i>';
                } else if (this.selectedAnswer && option.term === this.selectedAnswer.term) {
                    stateClass = 'incorrect ring-2 ring-red-500';
                    icon = '<i class="fas fa-times text-red-600 dark:text-red-400 ml-auto"></i>';
                } else {
                    stateClass = 'opacity-50';
                }
            }

            // Gebruik data attributes in plaats van inline handlers
            return `
                <button class="quiz-option w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${stateClass}"
                    data-term="${option.term.replace(/"/g, '&quot;')}"
                    ${isAnswered ? 'disabled' : ''}>
                    <span class="font-medium text-gray-900 dark:text-white">${option.term}</span>
                    ${icon}
                </button>
            `;
        }).join('');

        container.innerHTML = `
            <!-- Score Header -->
            <div class="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-4">
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Vraag ${this.quizTotal + (isAnswered ? 0 : 1)}
                    </div>
                    <div class="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        <i class="fas fa-trophy mr-1"></i> Week Record: ${this.weeklyHighscore}
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-sm font-bold ${this.quizScore > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}">
                        Score: ${this.quizScore}
                    </span>
                </div>
            </div>
            
            ${this.newHighscore ? `
                <div class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg flex items-center justify-center animate-bounce">
                    <i class="fas fa-crown text-yellow-500 text-xl mr-3"></i>
                    <span class="font-bold text-yellow-700 dark:text-yellow-400">Nieuw Week Record!</span>
                    <i class="fas fa-crown text-yellow-500 text-xl ml-3"></i>
                </div>
            ` : ''}

            <!-- Question Card -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border-t-4 border-purple-500 overflow-hidden mb-6">
                <div class="p-6 sm:p-8">
                    <h3 class="text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold mb-3">
                        Welk begrip hoort bij deze omschrijving?
                    </h3>
                    <p class="text-lg sm:text-xl text-gray-800 dark:text-gray-200 leading-relaxed">
                        "${correctTerm.description}"
                    </p>
                </div>
            </div>

            <!-- Options Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                ${optionsHtml}
            </div>

            <!-- Next Button (Visible after answer) -->
            ${isAnswered ? `
                <div class="flex justify-center animate-bounce-in">
                    <button id="next-quiz-btn" class="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg font-bold transition-colors flex items-center text-lg">
                        Volgende Vraag <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            ` : ''}
        `;

        // Attach event listeners to options manually (fixing CSP issue)
        if (!isAnswered) {
            container.querySelectorAll('.quiz-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    const term = btn.getAttribute('data-term');
                    this.handleQuizAnswer({ term: term });
                });
            });
        }

        // Attach next button listener if visible
        if (isAnswered) {
            document.getElementById('next-quiz-btn').addEventListener('click', () => {
                this.generateQuizQuestion();
                this.renderQuiz();
            });
        }
    }

    /**
     * Render de flashcard interface (ongewijzigd, maar verplaatst naar container)
     */
    renderFlashcard() {
        const container = document.getElementById('exercise-container');
        if (!container) return;

        if (this.error) {
            container.innerHTML = this.renderErrorState();
            return;
        }

        if (this.terms.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <i class="fas fa-search mb-2 text-2xl"></i>
                    <p>Geen begrippen gevonden.</p>
                </div>
            `;
            return;
        }

        const currentTerm = this.terms[this.currentIndex];

        container.innerHTML = `
            <!-- Progress Indicator -->
            <div class="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <span>Kaart ${this.currentIndex + 1} van ${this.terms.length}</span>
                <span>${Math.round(((this.currentIndex + 1) / this.terms.length) * 100)}% Voltooid</span>
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
                <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style="width: ${((this.currentIndex + 1) / this.terms.length) * 100}%"></div>
            </div>

            <!-- Flashcard Area -->
            <div class="flashcard-perspective w-full aspect-[4/3] sm:aspect-[16/9] mb-8">
                <div id="flashcard-card" class="flashcard-inner bg-white dark:bg-gray-800 ${this.isFlipped ? 'flipped' : ''}">
                    
                    <!-- Front: Term -->
                    <div class="flashcard-front bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700">
                        <div class="text-xs uppercase tracking-wider text-indigo-500 font-semibold mb-4">Begrip</div>
                        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center break-words max-w-full px-4">
                            ${currentTerm.term}
                        </h2>
                        <div class="absolute bottom-6 text-gray-400 text-sm animate-bounce">
                            <i class="fas fa-hand-pointer mr-2"></i> Klik om te draaien
                        </div>
                    </div>

                    <!-- Back: Definition -->
                    <div class="flashcard-back bg-indigo-50 dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-900">
                        <div class="text-xs uppercase tracking-wider text-indigo-500 font-semibold mb-4">Definitie</div>
                        <div class="prose dark:prose-invert max-w-none text-center overflow-y-auto max-h-full px-4 custom-scrollbar">
                            <p class="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                                ${currentTerm.description}
                            </p>
                        </div>
                        <div class="mt-6 pt-4 border-t border-indigo-100 dark:border-gray-700 w-full flex justify-center">
                            <a href="${currentTerm.location.page}${currentTerm.location.anchor}" 
                               id="flashcard-link"
                               class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
                                <i class="fas fa-book-open mr-1.5"></i>
                                Lees meer in ${currentTerm.location.week}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Controls -->
            <div class="flex justify-center gap-4">
                <button id="prev-card-btn" 
                    class="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                    ${this.currentIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left mr-2"></i> Vorige
                </button>
                
                <button id="shuffle-btn" 
                    class="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Schud kaarten">
                    <i class="fas fa-random"></i>
                </button>

                <button id="next-card-btn" 
                    class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                    ${this.currentIndex === this.terms.length - 1 ? 'disabled' : ''}>
                    Volgende <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        `;

        this.attachFlashcardListeners();
    }

    renderErrorState() {
        return `
            <div class="text-center py-8 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <i class="fas fa-exclamation-circle mb-2 text-2xl"></i>
                <p class="font-bold">Er is een fout opgetreden.</p>
                <p class="text-sm mt-1 opacity-80">${this.error || 'Onbekende fout'}</p>
            </div>
        `;
    }

    /**
     * Attach event listeners specific to flashcards
     */
    attachFlashcardListeners() {
        const card = document.getElementById('flashcard-card');
        const prevBtn = document.getElementById('prev-card-btn');
        const nextBtn = document.getElementById('next-card-btn');
        const shuffleBtn = document.getElementById('shuffle-btn');
        const link = document.getElementById('flashcard-link');

        if (card) {
            card.addEventListener('click', () => {
                this.isFlipped = !this.isFlipped;
                card.classList.toggle('flipped');
            });
        }

        if (link) {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                    this.isFlipped = false;
                    this.renderFlashcard();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentIndex < this.terms.length - 1) {
                    this.currentIndex++;
                    this.isFlipped = false;
                    this.renderFlashcard();
                }
            });
        }

        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => {
                this.terms = this.shuffleArray(this.terms);
                this.currentIndex = 0;
                this.isFlipped = false;
                this.renderFlashcard();
            });
        }
    }

    handleKeydown(e) {
        // Alleen werken als we in flashcard modus zijn
        if (this.currentMode !== 'flashcards') return;

        if (e.key === 'ArrowLeft') {
            const prevBtn = document.getElementById('prev-card-btn');
            if (prevBtn && !prevBtn.disabled) prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            const nextBtn = document.getElementById('next-card-btn');
            if (nextBtn && !nextBtn.disabled) nextBtn.click();
        } else if (e.key === ' ' || e.key === 'Enter') {
            // Flip card on space or enter if no button is focused
            if (document.activeElement.tagName !== 'BUTTON') {
                const card = document.getElementById('flashcard-card');
                if (card) {
                    e.preventDefault(); // Prevent scrolling
                    this.isFlipped = !this.isFlipped;
                    card.classList.toggle('flipped');
                }
            }
        }
    }

    /**
     * Attach base event listeners and initial render
     */
    attachEventListeners() {
        super.attachEventListeners();
        
        // Menu buttons
        const flashcardsBtn = document.getElementById('mode-flashcards-btn');
        const quizBtn = document.getElementById('mode-quiz-btn');
        const backBtn = document.getElementById('back-to-menu-btn');

        if (flashcardsBtn) {
            flashcardsBtn.addEventListener('click', () => this.startFlashcards());
        }

        if (quizBtn) {
            quizBtn.addEventListener('click', () => this.startQuiz());
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => this.resetToMenu());
        }
        
        // Keyboard nav (alleen eenmaal toevoegen)
        if (!this._keydownBound) {
            this._keydownBound = true;
            document.addEventListener('keydown', this.handleKeydown.bind(this));
        }
    }

    /**
     * Initialiseer de pagina
     */
    async init() {
        // Maak instantie globaal beschikbaar voor inline onclick handlers
        window.FlashcardsPageInstance = this;
        
        await this.loadTerms();
        document.body.innerHTML = this.render();
        this.attachEventListeners();
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlashcardsPage;
} else {
    window.FlashcardsPage = FlashcardsPage;
}
