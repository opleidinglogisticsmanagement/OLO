/**
 * AILeerpadPage
 *
 * AI-gebaseerd leerpad per leerdoel:
 * 1. Instaptoets (bepaal niveau)
 * 2. Stof + oefeningen (interactief)
 * 3. Eindtoets
 * 4. Leerdoel behaald (bij voldoende score)
 *
 * @extends BaseLessonPage
 */
(function () {
    'use strict';
    if (typeof BaseLessonPage === 'undefined') {
        console.error('[AILeerpadPage] BaseLessonPage niet geladen');
        return;
    }

    class AILeerpadPage extends BaseLessonPage {
        constructor() {
            super('ai-leerpad', 'AI Leerpad', 'Gepersonaliseerd leren');
            this.goalId = null;
            this.goal = null;
            this.onderwerp = null;
            this.contentJson = null;
            this.contentSnippets = '';
            this.contentItems = [];
            this.exercises = [];
            this.steps = [];
            this.currentStepIndex = 0;
            this.step2Phase = 'content'; // 'content' | 'reflection' | 'feedback'
            this.reflectionQuestion = '';
            this.reflectionFeedback = null;
            this.reflectionNextStep = null;
            this.exerciseCompleted = false;
            this.step = 1;
            this.entryQuestions = [];
            this.entryAnswers = {};
            this.entryScore = 0;
            this.entryBloomScores = null;
            this.entryAnalysis = null;
            this.entryLoading = true;
            this.entryUnavailable = false;
            this.level = 0;
            this.finalQuestions = [];
            this.finalAnswers = {};
            this.finalScore = 0;
            this.passed = false;
        }

        getContentFileName() {
            return 'leerdoelen-registry.json';
        }

        async loadContent(retries = 3) {
            await super.loadContent(retries);
            this.goalId = this._getGoalIdFromUrl();
            if (!this.goalId) {
                this.goal = { text: 'Onbekend leerdoel', contentRefs: [] };
                return;
            }
            this.onderwerp = this.content?.onderwerpen?.[0];
            this.goal = this.onderwerp?.leerdoelen?.find((ld) => ld.id === this.goalId) || null;
            if (!this.goal) return;
            const anchors = (this.goal.contentRefs || []).map((r) => r.anchor).filter(Boolean);
            if (anchors.length === 0) return;
            const contentFile = this.onderwerp.contentFile || 'week2.content.json';
            try {
                const res = await fetch(`content/${contentFile}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                this.contentJson = await res.json();
                if (window.ContentExtractor) {
                    this.contentSnippets = window.ContentExtractor.getPlainTextForAI(this.contentJson, anchors);
                    this.contentItems = window.ContentExtractor.getContentItemsByAnchors(this.contentJson, anchors);
                    this.exercises = window.ContentExtractor.getExercisesByAnchors(this.contentJson, anchors);
                    this.steps = window.ContentExtractor.getStepsByAnchors(this.contentJson, anchors);
                }
            } catch (e) {
                console.error('[AILeerpadPage] Content laden mislukt:', e);
            }
        }

        _getGoalIdFromUrl() {
            const params = new URLSearchParams(window.location.search);
            return params.get('goalId') || params.get('goal');
        }

        renderContentSections() {
            if (!this.goal) {
                return `
                    <section class="bg-white dark:bg-gray-800 rounded-xl p-6">
                        <p class="text-red-600 dark:text-red-400">Geen leerdoel geselecteerd. Ga terug naar <a href="gepersonaliseerd.html" class="underline">Gepersonaliseerd leren</a>.</p>
                    </section>
                `;
            }
            const steps = [
                { n: 1, label: 'Instaptoets', icon: 'fa-clipboard-question' },
                { n: 2, label: 'Stof & oefeningen', icon: 'fa-book-open' },
                { n: 3, label: 'Eindtoets', icon: 'fa-check-double' },
                { n: 4, label: 'Resultaat', icon: 'fa-trophy' }
            ];
            const stepsHtml = steps
                .map(
                    (s) => `
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${this.step >= s.n ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}">
                        ${this.step > s.n ? '<i class="fas fa-check"></i>' : s.n}
                    </div>
                    <span class="ml-2 text-sm ${this.step >= s.n ? 'font-medium' : 'text-gray-400'}">${s.label}</span>
                    ${s.n < 4 ? '<div class="flex-1 h-0.5 mx-2 bg-gray-200 dark:bg-gray-700"></div>' : ''}
                </div>`
                )
                .join('');
            return `
                <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">${this.goal.text}</h2>
                    <div class="flex items-center gap-2 mb-6 overflow-x-auto pb-2">${stepsHtml}</div>
                    <div id="ai-leerpad-content" class="min-h-[300px]">
                        ${this._renderStepContent()}
                    </div>
                </section>
            `;
        }

        _renderStepContent() {
            if (this.step === 1) return this._renderStep1();
            if (this.step === 2) return this._renderStep2();
            if (this.step === 3) return this._renderStep3();
            if (this.step === 4) return this._renderStep4();
            return '<p>Laden...</p>';
        }

        _renderStep1() {
            if (this.entryLoading) {
                return `
                    <div class="flex items-center justify-center min-h-[300px]" id="ai-leerpad-loading">
                        <div class="text-center">
                            <i class="fas fa-spinner fa-spin text-3xl text-purple-600 mb-4"></i>
                            <p>Instaptoets wordt geladen...</p>
                        </div>
                    </div>
                `;
            }
            if (this.entryUnavailable || this.entryQuestions.length === 0) {
                return `
                    <div class="flex items-center justify-center min-h-[300px]">
                        <div class="text-center p-6">
                            <i class="fas fa-clipboard-list text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
                            <p class="text-gray-600 dark:text-gray-400 mb-2">Instaptoets nog niet beschikbaar voor dit leerdoel.</p>
                            <p class="text-sm text-gray-500 dark:text-gray-500">De vragen worden nog toegevoegd. Je kunt intussen direct naar de stof gaan.</p>
                            <button type="button" class="ai-leerpad-skip-entry mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
                                Ga naar stof & oefeningen
                            </button>
                        </div>
                    </div>
                `;
            }
            return this._renderEntryQuestions();
        }

        _renderStep2() {
            if (!this.steps || this.steps.length === 0) {
                return this._renderStep2Fallback();
            }
            const step = this.steps[this.currentStepIndex];
            if (!step) return this._renderStep2Fallback();

            if (this.step2Phase === 'reflection') {
                return this._renderStep2Reflection(step);
            }
            if (this.step2Phase === 'feedback') {
                return this._renderStep2Feedback(step);
            }

            let contentHtml = '';
            if (step.contentItems && step.contentItems.length > 0 && typeof ContentRenderer !== 'undefined') {
                contentHtml = ContentRenderer.renderContentItems(step.contentItems, { enableModal: true });
            }
            let exerciseHtml = '';
            if (step.exercise && typeof ContentRenderer !== 'undefined') {
                exerciseHtml = `
                    <div class="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <i class="fas fa-pen-fancy text-purple-600"></i>
                            Verwerk de stof: ${step.exercise.title || 'Oefening'}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${step.exercise.instruction || 'Maak de oefening voordat je verder gaat.'}</p>
                        ${ContentRenderer.renderContentItems([step.exercise], { enableModal: true })}
                        <div class="mt-4 flex items-center gap-3">
                            <button type="button" class="ai-leerpad-step-done px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
                                <i class="fas fa-check mr-2"></i>Oefening voltooid, ga verder
                            </button>
                        </div>
                    </div>
                `;
            } else {
                exerciseHtml = `
                    <div class="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Je hebt de theorie doorgenomen. Beantwoord de reflectievraag om verder te gaan.</p>
                        <button type="button" class="ai-leerpad-step-done px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
                            <i class="fas fa-check mr-2"></i>Stof doorgenomen, ga verder
                        </button>
                    </div>
                `;
            }

            const stepIndicator = `Stap ${this.currentStepIndex + 1} van ${this.steps.length}`;
            const navButtons = `
                <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600 mt-8">
                    <span class="text-sm text-gray-500">${stepIndicator}</span>
                    <div class="flex gap-3">
                        ${this.currentStepIndex > 0 ? `
                            <button type="button" class="ai-leerpad-prev px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium">
                                <i class="fas fa-arrow-left mr-2"></i>Vorige
                            </button>
                        ` : ''}
                        <span class="text-xs text-gray-400 self-center">Beantwoord de reflectievraag na de oefening om verder te gaan</span>
                    </div>
                </div>
            `;

            return `
                <div class="space-y-6 ai-leerpad-step-container" data-step-index="${this.currentStepIndex}">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">${step.stepTitle}</span>
                    </div>
                    <div class="prose dark:prose-invert max-w-none">${contentHtml}</div>
                    ${exerciseHtml}
                    ${navButtons}
                </div>
            `;
        }

        _renderStep2Reflection(step) {
            const loading = !this.reflectionQuestion;
            return `
                <div class="space-y-6 ai-leerpad-step-container" data-step-index="${this.currentStepIndex}">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium">
                            <i class="fas fa-lightbulb mr-1"></i>Reflectievraag
                        </span>
                    </div>
                    ${loading ? `
                        <div class="flex items-center justify-center py-12" id="ai-leerpad-reflection-loading">
                            <div class="text-center">
                                <i class="fas fa-spinner fa-spin text-2xl text-purple-600 mb-3"></i>
                                <p class="text-gray-600 dark:text-gray-400">Vraag wordt gegenereerd...</p>
                            </div>
                        </div>
                    ` : `
                        <div class="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                            <p class="font-medium text-gray-900 dark:text-white mb-4">${this.reflectionQuestion}</p>
                            <textarea id="ai-leerpad-reflection-answer" rows="4" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500" placeholder="Typ hier je antwoord (minimaal 10 tekens)..."></textarea>
                            <p class="text-xs text-gray-500 mt-2">De AI analyseert je antwoord en bepaalt mede de vervolgstap.</p>
                            <button type="button" class="ai-leerpad-reflection-submit mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
                                <i class="fas fa-paper-plane mr-2"></i>Verstuur antwoord
                            </button>
                        </div>
                    `}
                    <div class="pt-4">
                        <button type="button" class="ai-leerpad-back-to-content px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm">
                            <i class="fas fa-arrow-left mr-2"></i>Terug naar stof
                        </button>
                    </div>
                </div>
            `;
        }

        _renderStep2Feedback(step) {
            const fb = this.reflectionFeedback || {};
            const isRepeat = fb.nextStep === 'repeat';
            const isLastStep = this.currentStepIndex >= this.steps.length - 1;
            return `
                <div class="space-y-6 ai-leerpad-step-container" data-step-index="${this.currentStepIndex}">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                            <i class="fas fa-comment-dots mr-1"></i>AI-feedback
                        </span>
                    </div>
                    <div class="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <p class="text-gray-900 dark:text-gray-100 mb-4">${fb.feedback || 'Bedankt voor je antwoord.'}</p>
                        ${fb.recommendation ? `<p class="text-sm text-gray-600 dark:text-gray-400 italic">${fb.recommendation}</p>` : ''}
                    </div>
                    <div class="flex flex-wrap gap-3 pt-4">
                        ${isRepeat ? `
                            <button type="button" class="ai-leerpad-review-content px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium">
                                <i class="fas fa-redo mr-2"></i>Bekijk stof opnieuw
                            </button>
                        ` : ''}
                        <button type="button" class="ai-leerpad-continue-after-feedback px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
                            ${isLastStep ? 'Ga naar eindtoets' : 'Ga naar volgende stap'} <i class="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        _renderStep2Fallback() {
            let contentHtml = '';
            if (this.contentItems.length > 0 && typeof ContentRenderer !== 'undefined') {
                contentHtml = ContentRenderer.renderContentItems(this.contentItems, { enableModal: true });
            }
            let exercisesHtml = '';
            if (this.exercises.length > 0 && typeof ContentRenderer !== 'undefined') {
                exercisesHtml = this.exercises
                    .map((ex) => ContentRenderer.renderContentItems([ex], { enableModal: true }))
                    .join('');
            }
            return `
                <div class="space-y-8">
                    <div class="prose dark:prose-invert max-w-none">${contentHtml}</div>
                    ${exercisesHtml ? `<div class="mt-8"><h3 class="text-lg font-semibold mb-4">Oefeningen</h3>${exercisesHtml}</div>` : ''}
                    <div class="pt-6">
                        <button type="button" class="ai-leerpad-next px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
                            Ga naar eindtoets
                        </button>
                    </div>
                </div>
            `;
        }

        _renderStep3() {
            if (this.finalQuestions.length === 0) {
                return `
                    <div class="flex items-center justify-center min-h-[300px]" id="ai-leerpad-loading">
                        <div class="text-center">
                            <i class="fas fa-spinner fa-spin text-3xl text-purple-600 mb-4"></i>
                            <p>Eindtoets wordt gegenereerd...</p>
                        </div>
                    </div>
                `;
            }
            return this._renderMCQuestions(this.finalQuestions, 'final', 'Controleer eindtoets');
        }

        _renderStep4() {
            if (this.passed) {
                return `
                    <div class="text-center py-8">
                        <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Gefeliciteerd!</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">Je hebt dit leerdoel behaald (${this.finalScore}% correct).</p>
                        <a href="gepersonaliseerd.html" class="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
                            Terug naar overzicht
                        </a>
                    </div>
                `;
            }
            return `
                <div class="text-center py-8">
                    <i class="fas fa-times-circle text-6xl text-amber-500 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nog niet gehaald</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-6">Je scoorde ${this.finalScore}%. Je hebt minimaal 70% nodig. Bekijk de stof nog eens en probeer opnieuw.</p>
                    <button type="button" class="ai-leerpad-retry px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
                        Opnieuw proberen
                    </button>
                </div>
            `;
        }

        _renderEntryQuestions() {
            const questions = this.entryQuestions;
            const prefix = 'entry';
            const html = questions
                .map((q, qi) => {
                    if (q.type === 'open') {
                        const casusHtml = q.casus
                            ? `<div class="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"><strong>Casus:</strong> ${q.casus}</div>`
                            : '';
                        return `
                            <div class="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg" data-question-id="${q.id}">
                                <p class="font-medium text-gray-900 dark:text-white mb-3">${qi + 1}. ${q.vraag}</p>
                                ${casusHtml}
                                <textarea id="entry-open-${q.id}" rows="4" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500" placeholder="Typ hier je antwoord..."></textarea>
                                <div class="mt-2 hidden entry-feedback" data-question-id="${q.id}"></div>
                            </div>
                        `;
                    }
                    return `
                        <div class="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg" data-question-id="${q.id}">
                            <p class="font-medium text-gray-900 dark:text-white mb-3">${qi + 1}. ${q.vraag}</p>
                            <div class="space-y-2">
                                ${(q.antwoorden || []).map((a) => `
                                    <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <input type="radio" name="${prefix}-${q.id}" value="${a.id}" class="mc-answer-input" data-question-id="${q.id}" data-correct="${a.correct}">
                                        <span class="text-gray-700 dark:text-gray-300">${a.tekst}</span>
                                    </label>
                                `).join('')}
                            </div>
                            <div class="mt-2 hidden entry-feedback" data-question-id="${q.id}"></div>
                        </div>
                    `;
                })
                .join('');
            return `
                <div id="entry-container">
                    ${html}
                    <button type="button" class="ai-leerpad-submit px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium" data-prefix="entry">
                        Controleer instapniveau
                    </button>
                </div>
            `;
        }

        _renderMCQuestions(questions, prefix, submitLabel) {
            const containerId = `mc-${prefix}-container`;
            const html = questions
                .map(
                    (q, qi) => `
                <div class="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg" data-question-id="${q.id}">
                    <p class="font-medium text-gray-900 dark:text-white mb-3">${qi + 1}. ${q.vraag}</p>
                    <div class="space-y-2">
                        ${(q.antwoorden || []).map((a) => `
                            <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                                <input type="radio" name="${prefix}-${q.id}" value="${a.id}" class="mc-answer-input" data-question-id="${q.id}" data-correct="${a.correct}">
                                <span class="text-gray-700 dark:text-gray-300">${a.tekst}</span>
                            </label>
                        `).join('')}
                    </div>
                    <div class="mt-2 hidden feedback" data-question-id="${q.id}"></div>
                </div>
            `
                )
                .join('');
            return `
                <div id="${containerId}">
                    ${html}
                    <button type="button" class="ai-leerpad-submit px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium" data-prefix="${prefix}">
                        ${submitLabel}
                    </button>
                </div>
            `;
        }

        async afterEventListeners() {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AILeerpadPage.js:afterEventListeners',message:'entry',data:{step:this.step,entryLoading:this.entryLoading,goalId:this.goalId,willLoad:this.step===1&&!!this.entryLoading},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
            // #endregion
            this._attachLeerpadListeners();
            if (this.step === 1 && this.entryLoading) {
                await this._loadEntryQuestions();
            }
        }

        _attachLeerpadListeners() {
            document.querySelectorAll('.ai-leerpad-next').forEach((btn) => {
                btn.onclick = () => this._goToStep(3);
            });
            document.querySelectorAll('.ai-leerpad-next-step').forEach((btn) => {
                btn.onclick = () => {
                    this._resetStep2Phase();
                    this.currentStepIndex++;
                    this._refreshContent();
                    this._attachLeerpadListeners();
                };
            });
            document.querySelectorAll('.ai-leerpad-prev').forEach((btn) => {
                btn.onclick = () => {
                    this._resetStep2Phase();
                    this.currentStepIndex = Math.max(0, this.currentStepIndex - 1);
                    this._refreshContent();
                    this._attachLeerpadListeners();
                };
            });
            document.querySelectorAll('.ai-leerpad-step-done').forEach((btn) => {
                btn.onclick = () => {
                    const container = btn.closest('.ai-leerpad-step-container');
                    const exercise = container?.querySelector('[id^="true-false-"], [id^="matching-exercise-"]');
                    if (exercise && exercise.id && typeof window.InteractiveRenderer !== 'undefined') {
                        const id = exercise.id;
                        if (id.startsWith('true-false-') && window.InteractiveRenderer.checkTrueFalseExercise) {
                            window.InteractiveRenderer.checkTrueFalseExercise(id);
                        } else if (id.startsWith('matching-exercise-') && window.InteractiveRenderer.checkMatchingExercise) {
                            window.InteractiveRenderer.checkMatchingExercise(id);
                        }
                    }
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fas fa-check mr-2"></i>Voltooid';
                    btn.classList.add('opacity-75');
                    this.exerciseCompleted = true;
                    this.step2Phase = 'reflection';
                    this.reflectionQuestion = '';
                    this.reflectionFeedback = null;
                    this._refreshContent();
                    this._attachLeerpadListeners();
                    this._fetchReflectionQuestion();
                };
            });
            document.querySelectorAll('.ai-leerpad-back-to-content').forEach((btn) => {
                btn.onclick = () => {
                    this.step2Phase = 'content';
                    this._refreshContent();
                    this._attachLeerpadListeners();
                };
            });
            document.querySelectorAll('.ai-leerpad-reflection-submit').forEach((btn) => {
                btn.onclick = () => this._handleReflectionSubmit();
            });
            document.querySelectorAll('.ai-leerpad-continue-after-feedback').forEach((btn) => {
                btn.onclick = () => this._continueAfterFeedback();
            });
            document.querySelectorAll('.ai-leerpad-review-content').forEach((btn) => {
                btn.onclick = () => {
                    this.step2Phase = 'content';
                    this._refreshContent();
                    this._attachLeerpadListeners();
                };
            });
            document.querySelectorAll('.ai-leerpad-skip-entry').forEach((btn) => {
                btn.onclick = () => {
                    this.entryAnalysis = null;
                    this.step = 2;
                    this._refreshContent();
                    this._attachLeerpadListeners();
                };
            });
            document.querySelectorAll('.ai-leerpad-retry').forEach((btn) => {
                btn.onclick = () => {
                    this.step = 3;
                    this.finalQuestions = [];
                    this.finalAnswers = {};
                    this._refreshAndFetchFinal();
                };
            });
            document.querySelectorAll('.ai-leerpad-submit').forEach((btn) => {
                btn.onclick = async () => {
                    const prefix = btn.dataset.prefix;
                    if (prefix === 'entry') {
                        btn.disabled = true;
                        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyseren...';
                        await this._handleEntrySubmit();
                        this._refreshContent();
                        this._attachLeerpadListeners();
                    } else {
                        this._handleSubmit(prefix);
                    }
                };
            });
            if (this.step === 2 && window.InteractiveManager) {
                const im = new window.InteractiveManager('ai-leerpad');
                im.init();
            }
        }

        async _loadEntryQuestions() {
            // #region agent log
            const fetchUrl = `content/entry-questions/${this.goalId}.json`;
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AILeerpadPage.js:_loadEntryQuestions',message:'before fetch',data:{goalId:this.goalId,fetchUrl},timestamp:Date.now(),hypothesisId:'H2,H4'})}).catch(()=>{});
            // #endregion
            this.entryLoading = true;
            this.entryUnavailable = false;
            try {
                const res = await fetch(fetchUrl);
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AILeerpadPage.js:_loadEntryQuestions',message:'after fetch',data:{status:res.status,ok:res.ok},timestamp:Date.now(),hypothesisId:'H2,H3'})}).catch(()=>{});
                // #endregion
                if (!res.ok) {
                    this.entryUnavailable = true;
                    this.entryQuestions = [];
                } else {
                    const data = await res.json();
                    const vragen = data.vragen || [];
                    if (vragen.length === 0) {
                        this.entryUnavailable = true;
                        this.entryQuestions = [];
                    } else {
                        this.entryQuestions = vragen;
                    }
                }
            } catch (e) {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AILeerpadPage.js:_loadEntryQuestions',message:'catch',data:{errMsg:String(e?.message||e)},timestamp:Date.now(),hypothesisId:'H2,H3'})}).catch(()=>{});
                // #endregion
                console.error('[AILeerpadPage] Entry questions load failed:', e);
                this.entryUnavailable = true;
                this.entryQuestions = [];
            }
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AILeerpadPage.js:_loadEntryQuestions',message:'done',data:{entryLoading:false,vragenLen:this.entryQuestions?.length,entryUnavailable:this.entryUnavailable},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
            // #endregion
            this.entryLoading = false;
            this._refreshContent();
            this._attachLeerpadListeners();
        }

        async _fetchFinalTest() {
            try {
                const res = await fetch('/api/generate-final-test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        goalId: this.goalId,
                        goalText: this.goal.text,
                        contentSnippets: this.contentSnippets,
                        numberOfQuestions: 5
                    })
                });
                const data = await res.json();
                if (data.vragen && data.vragen.length > 0) {
                    this.finalQuestions = data.vragen;
                    this.step = 3;
                    this._refreshContent();
                    this._attachLeerpadListeners();
                }
            } catch (e) {
                console.error('[AILeerpadPage] Final test fetch failed:', e);
                document.getElementById('ai-leerpad-content').innerHTML =
                    '<p class="text-red-600">Kon eindtoets niet laden. Probeer het later opnieuw.</p>';
            }
        }

        async _handleEntrySubmit() {
            const questions = this.entryQuestions;
            const openQuestions = questions.filter((q) => q.type === 'open');
            const firstEmpty = openQuestions.find((q) => {
                const ta = document.getElementById(`entry-open-${q.id}`);
                return !ta?.value?.trim() || ta.value.trim().length < 3;
            });
            if (firstEmpty) {
                const fbEl = document.querySelector(`.entry-feedback[data-question-id="${firstEmpty.id}"]`);
                if (fbEl) {
                    fbEl.classList.remove('hidden');
                    fbEl.className = 'mt-2 p-2 rounded text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 entry-feedback';
                    fbEl.textContent = 'Typ minimaal een paar woorden om je antwoord in te dienen.';
                }
                document.querySelectorAll('.ai-leerpad-submit[data-prefix="entry"]').forEach((b) => {
                    b.disabled = false;
                    b.innerHTML = 'Controleer instapniveau';
                });
                return;
            }

            const answers = [];
            const bloomCounts = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 } };
            let correctCount = 0;

            for (const q of questions) {
                let isCorrect = false;
                if (q.type === 'open') {
                    const textarea = document.getElementById(`entry-open-${q.id}`);
                    const userAnswer = textarea?.value?.trim() || '';
                    try {
                        const res = await fetch('/api/grade-entry-answer', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                questionId: q.id,
                                question: q.vraag,
                                userAnswer,
                                goedAntwoord: q.goedAntwoord,
                                feedbackGoed: q.feedbackGoed,
                                feedbackFout: q.feedbackFout,
                                casus: q.casus || ''
                            })
                        });
                        const data = await res.json();
                        isCorrect = data.correct === true;
                        const fbEl = document.querySelector(`.entry-feedback[data-question-id="${q.id}"]`);
                        if (fbEl) {
                            fbEl.classList.remove('hidden');
                            fbEl.className = `mt-2 p-2 rounded entry-feedback ${isCorrect ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20' : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20'}`;
                            fbEl.textContent = data.feedback || (isCorrect ? 'Goed' : 'Niet correct');
                        }
                    } catch (e) {
                        console.error('[AILeerpadPage] Grade answer failed:', e);
                        isCorrect = false;
                    }
                } else {
                    const sel = document.querySelector(`input[name="entry-${q.id}"]:checked`);
                    isCorrect = sel && sel.dataset.correct === 'true';
                }
                if (isCorrect) correctCount++;
                const bloomLevel = q.bloomLevel || 1;
                if (bloomCounts[bloomLevel]) {
                    bloomCounts[bloomLevel].total++;
                    if (isCorrect) bloomCounts[bloomLevel].correct++;
                }
                answers.push({
                    questionId: q.id,
                    correct: isCorrect,
                    bloomLevel,
                    questionText: q.vraag || ''
                });
            }

            this.entryScore = Math.round((correctCount / questions.length) * 100);
            this.level = this.entryScore < 50 ? 0 : this.entryScore < 75 ? 1 : 2;
            const bloomScores = {
                herinneren: bloomCounts[1],
                begrijpen: bloomCounts[2],
                toepassen: bloomCounts[3]
            };
            try {
                const res = await fetch('/api/analyze-entry-results', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        goalId: this.goalId,
                        goalText: this.goal?.text || '',
                        contentSnippets: this.contentSnippets || '',
                        answers,
                        totalScore: this.entryScore,
                        bloomScores
                    })
                });
                const data = await res.json();
                if (data.analysis) {
                    this.entryAnalysis = data.analysis;
                } else {
                    this.entryAnalysis = { summary: '', strengths: [], gaps: [], recommendation: '' };
                }
            } catch (e) {
                console.error('[AILeerpadPage] Analyze entry results failed:', e);
                this.entryAnalysis = { summary: '', strengths: [], gaps: [], recommendation: '' };
            }
            this.step = 2;
        }

        _handleSubmit(prefix) {
            const questions = this.finalQuestions;
            let correct = 0;
            questions.forEach((q) => {
                const sel = document.querySelector(`input[name="${prefix}-${q.id}"]:checked`);
                if (sel && sel.dataset.correct === 'true') correct++;
            });
            const score = Math.round((correct / questions.length) * 100);
            this.finalScore = score;
            this.passed = score >= 70;
            if (this.passed && window.ProgressService) {
                window.ProgressService.saveProgress(this.goalId, 100, 'completed').catch(console.error);
            }
            this.step = 4;
            this._refreshContent();
        }

        _goToStep(n) {
            this.step = n;
            if (n === 2) this._resetStep2Phase();
            if (n === 3 && this.finalQuestions.length === 0) {
                this._refreshAndFetchFinal();
            } else {
                this._refreshContent();
                this._attachLeerpadListeners();
            }
        }

        _resetStep2Phase() {
            this.step2Phase = 'content';
            this.exerciseCompleted = false;
            this.reflectionQuestion = '';
            this.reflectionFeedback = null;
            this.reflectionNextStep = null;
        }

        async _fetchReflectionQuestion() {
            const step = this.steps[this.currentStepIndex];
            if (!step) return;
            let stepContext = '';
            if (window.ContentExtractor && step.contentItems && step.contentItems.length > 0) {
                stepContext = window.ContentExtractor.getPlainTextFromItems(step.contentItems);
            }
            if (!stepContext) stepContext = this.contentSnippets?.substring(0, 1500) || '';
            const body = {
                goalId: this.goalId,
                goalText: this.goal?.text || '',
                contentSnippets: this.contentSnippets || '',
                stepContext: stepContext.length > 2000 ? stepContext.substring(0, 2000) : stepContext,
                stepIndex: this.currentStepIndex,
                totalSteps: this.steps.length,
                stepTitle: step.stepTitle || ''
            };
            try {
                const res = await fetch('/api/generate-reflection-question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                if (data.question) {
                    this.reflectionQuestion = data.question;
                } else if (!res.ok) {
                    this.reflectionQuestion = 'Leg in je eigen woorden uit wat je in deze stap hebt geleerd.';
                }
                if (this.reflectionQuestion) {
                    this._refreshContent();
                    this._attachLeerpadListeners();
                }
            } catch (e) {
                console.error('[AILeerpadPage] Reflection question fetch failed:', e);
                this.reflectionQuestion = 'Leg in je eigen woorden uit wat je in deze stap hebt geleerd.';
                this._refreshContent();
                this._attachLeerpadListeners();
            }
        }

        async _handleReflectionSubmit() {
            const textarea = document.getElementById('ai-leerpad-reflection-answer');
            const answer = textarea?.value?.trim() || '';
            if (answer.length < 10) {
                alert('Typ minimaal 10 tekens om je antwoord te versturen.');
                return;
            }
            const step = this.steps[this.currentStepIndex];
            if (!step) return;
            let stepContext = '';
            if (window.ContentExtractor && step.contentItems && step.contentItems.length > 0) {
                stepContext = window.ContentExtractor.getPlainTextFromItems(step.contentItems);
            }
            const container = document.getElementById('ai-leerpad-content');
            if (container) {
                container.innerHTML = `
                    <div class="flex items-center justify-center min-h-[200px]">
                        <div class="text-center">
                            <i class="fas fa-spinner fa-spin text-2xl text-purple-600 mb-3"></i>
                            <p>AI analyseert je antwoord...</p>
                        </div>
                    </div>
                `;
            }
            try {
                const res = await fetch('/api/analyze-reflection', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        goalId: this.goalId,
                        goalText: this.goal?.text || '',
                        contentSnippets: this.contentSnippets || '',
                        stepContext,
                        stepIndex: this.currentStepIndex,
                        totalSteps: this.steps.length,
                        stepTitle: step.stepTitle || '',
                        question: this.reflectionQuestion,
                        userAnswer: answer
                    })
                });
                const data = await res.json();
                if (data.feedback !== undefined) {
                    this.reflectionFeedback = {
                        feedback: data.feedback,
                        nextStep: data.nextStep || 'continue',
                        recommendation: data.recommendation || ''
                    };
                    this.step2Phase = 'feedback';
                    this._refreshContent();
                    this._attachLeerpadListeners();
                } else {
                    throw new Error(data.message || 'Geen feedback ontvangen');
                }
            } catch (e) {
                console.error('[AILeerpadPage] Analyze reflection failed:', e);
                this.reflectionFeedback = {
                    feedback: 'Bedankt voor je antwoord. Ga door naar de volgende stap.',
                    nextStep: 'continue',
                    recommendation: ''
                };
                this.step2Phase = 'feedback';
                this._refreshContent();
                this._attachLeerpadListeners();
            }
        }

        _continueAfterFeedback() {
            const isLastStep = this.currentStepIndex >= this.steps.length - 1;
            this._resetStep2Phase();
            if (isLastStep) {
                this._goToStep(3);
            } else {
                this.currentStepIndex++;
                this._refreshContent();
                this._attachLeerpadListeners();
            }
        }

        _refreshAndFetchFinal() {
            const container = document.getElementById('ai-leerpad-content');
            if (container) {
                container.innerHTML = `
                    <div class="flex items-center justify-center min-h-[300px]">
                        <div class="text-center">
                            <i class="fas fa-spinner fa-spin text-3xl text-purple-600 mb-4"></i>
                            <p>Eindtoets wordt gegenereerd...</p>
                        </div>
                    </div>
                `;
            }
            this._fetchFinalTest();
        }

        _refreshContent() {
            const container = document.getElementById('ai-leerpad-content');
            if (container) {
                container.innerHTML = this._renderStepContent();
                this._attachLeerpadListeners();
            }
        }
    }

    window.AILeerpadPage = AILeerpadPage;
})();
