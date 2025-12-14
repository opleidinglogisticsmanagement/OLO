/**
 * InteractiveRenderer
 * 
 * Utility voor het renderen van interactieve content elementen
 * Ondersteunt: accordion, smartChecklist, learningObjectivesChecklist, matchingExercise, trueFalseExercise
 */

class InteractiveRenderer {
    /**
     * Render een accordion component
     * @deprecated Gebruik AccordionRenderer.renderAccordion() in plaats daarvan
     * @param {Object} item - Accordion item met items array
     * @param {boolean} isNested - Whether this accordion is nested inside another accordion
     * @returns {string} HTML string
     */
    static renderAccordion(item, isNested = false) {
        if (typeof window.AccordionRenderer !== 'undefined') {
            return AccordionRenderer.renderAccordion(item, isNested);
        }
        console.warn('AccordionRenderer not loaded. Accordion will not render.');
                        return '';
    }

    /**
     * Toggle accordion item open/closed
     * @deprecated Gebruik AccordionRenderer.toggleAccordion() in plaats daarvan
     * @param {string} contentId - ID of the content div
     * @param {string} buttonId - ID of the button
     * @param {boolean} usePlusIcon - Whether to use plus icon rotation
     */
    static toggleAccordion(contentId, buttonId, usePlusIcon = false) {
        if (typeof window.AccordionRenderer !== 'undefined') {
            return AccordionRenderer.toggleAccordion(contentId, buttonId, usePlusIcon);
        }
        console.warn('AccordionRenderer not loaded. Accordion toggle will not work.');
    }

    /**
     * Render een SMART checklist component
     * Laat studenten een doelstelling analyseren op SMART-criteria
     * @param {Object} item - SMART checklist item met doelstelling en criteria
     * @returns {string} HTML string
     */
    /**
     * Render een SMART checklist
     * @deprecated Gebruik ChecklistRenderer.renderSMARTChecklist() in plaats daarvan
     * @param {Object} item - SMART checklist item met doelstelling
     * @returns {string} HTML string
     */
    static renderSMARTChecklist(item) {
        if (typeof window.ChecklistRenderer !== 'undefined') {
            return ChecklistRenderer.renderSMARTChecklist(item);
        }
        console.warn('ChecklistRenderer not loaded. SMART checklist will not render.');
            return '';
    }

    /**
     * Show overall SMART analysis result with per-criterion feedback
     * @deprecated Gebruik ChecklistRenderer.showSMARTResult() in plaats daarvan
     * @param {string} checklistId - ID of the checklist container
     */
    static showSMARTResult(checklistId) {
        if (typeof window.ChecklistRenderer !== 'undefined') {
            return ChecklistRenderer.showSMARTResult(checklistId);
        }
        console.warn('ChecklistRenderer not loaded. SMART result will not show.');
    }


    /**
     * Render een interactieve leerdoelen checklist
     * Laat studenten hun voortgang bijhouden
     * @param {Object} item - Learning objectives checklist item met items array
     * @returns {string} HTML string
     */
    /**
     * Render een interactieve leerdoelen checklist
     * @deprecated Gebruik ChecklistRenderer.renderLearningObjectivesChecklist() in plaats daarvan
     * @param {Object} item - Learning objectives checklist item met items array
     * @returns {string} HTML string
     */
    static renderLearningObjectivesChecklist(item) {
        if (typeof window.ChecklistRenderer !== 'undefined') {
            return ChecklistRenderer.renderLearningObjectivesChecklist(item);
        }
        console.warn('ChecklistRenderer not loaded. Learning objectives checklist will not render.');
            return '';
    }

    /**
     * Load learning objectives state from localStorage
     * @deprecated Gebruik ChecklistRenderer.loadLearningObjectivesState() in plaats daarvan
     * @param {string} storageKey - Key for localStorage
     * @returns {Array} Array of boolean values
     */
    static loadLearningObjectivesState(storageKey) {
        if (typeof window.ChecklistRenderer !== 'undefined') {
            return ChecklistRenderer.loadLearningObjectivesState(storageKey);
        }
        console.warn('ChecklistRenderer not loaded. Learning objectives state will not load.');
            return [];
    }


    /**
     * Update learning objective checkbox state
     * @deprecated Gebruik ChecklistRenderer.updateLearningObjective() in plaats daarvan
     * @param {string} checklistId - ID of the checklist container
     * @param {string} storageKey - Key for localStorage
     * @param {number} index - Index of the objective
     */
    static updateLearningObjective(checklistId, storageKey, index) {
        if (typeof window.ChecklistRenderer !== 'undefined') {
            return ChecklistRenderer.updateLearningObjective(checklistId, storageKey, index);
        }
        console.warn('ChecklistRenderer not loaded. Learning objective update will not work.');
    }


    /**
     * Update progress indicator
     * @deprecated Gebruik ChecklistRenderer.updateLearningObjectivesProgress() in plaats daarvan
     * @param {string} checklistId - ID of the checklist container
     * @param {string} storageKey - Key for localStorage
     */
    static updateLearningObjectivesProgress(checklistId, storageKey) {
        if (typeof window.ChecklistRenderer !== 'undefined') {
            return ChecklistRenderer.updateLearningObjectivesProgress(checklistId, storageKey);
        }
        console.warn('ChecklistRenderer not loaded. Learning objectives progress will not update.');
    }


    /**
     * Render een matching oefening
     * @deprecated Gebruik ExerciseRenderer.renderMatchingExercise() in plaats daarvan
     * @param {Object} item - Matching exercise item met categories en items
     * @returns {string} HTML string
     */
    static renderMatchingExercise(item) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.renderMatchingExercise(item);
        }
        console.warn('ExerciseRenderer not loaded. Matching exercise will not render.');
        return '';
    }


    /**
     * Handle drag start
     * @deprecated Gebruik ExerciseRenderer.handleDragStart() in plaats daarvan
     * @param {Event} event - Drag event
     * @param {string} exerciseId - ID of the exercise container
     * @param {number} itemIndex - Index of the item being dragged
     */
    static handleDragStart(event, exerciseId, itemIndex) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.handleDragStart(event, exerciseId, itemIndex);
        }
        console.warn('ExerciseRenderer not loaded. Drag start will not work.');
    }


    /**
     * Handle drag end - reset opacity if drag was cancelled
     * @deprecated Gebruik ExerciseRenderer.handleDragEnd() in plaats daarvan
     * @param {Event} event - Drag event
     */
    static handleDragEnd(event) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.handleDragEnd(event);
        }
        console.warn('ExerciseRenderer not loaded. Drag end will not work.');
    }


    /**
     * Allow drop
     * @deprecated Gebruik ExerciseRenderer.allowDrop() in plaats daarvan
     * @param {Event} event - Drag event
     */
    static allowDrop(event) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.allowDrop(event);
        }
        console.warn('ExerciseRenderer not loaded. Allow drop will not work.');
    }


    /**
     * Handle drop
     * @deprecated Gebruik ExerciseRenderer.handleDrop() in plaats daarvan
     * @param {Event} event - Drop event
     * @param {string} exerciseId - ID of the exercise container
     * @param {number} categoryIndex - Index of the category being dropped into
     */
    static handleDrop(event, exerciseId, categoryIndex) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.handleDrop(event, exerciseId, categoryIndex);
        }
        console.warn('ExerciseRenderer not loaded. Drop will not work.');
    }


    /**
     * Check matching exercise answers
     * @deprecated Gebruik ExerciseRenderer.checkMatchingExercise() in plaats daarvan
     * @param {string} exerciseId - ID of the exercise container
     */
    static checkMatchingExercise(exerciseId) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.checkMatchingExercise(exerciseId);
        }
        console.warn('ExerciseRenderer not loaded. Matching exercise check will not work.');
    }


    /**
     * Render een true/false oefening
     * @deprecated Gebruik ExerciseRenderer.renderTrueFalseExercise() in plaats daarvan
     * @param {Object} item - True/false exercise item met statements array
     * @returns {string} HTML string
     */
    static renderTrueFalseExercise(item) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.renderTrueFalseExercise(item);
        }
        console.warn('ExerciseRenderer not loaded. True/false exercise will not render.');
        return '';
    }


    /**
     * Update true/false answer
     * @deprecated Gebruik ExerciseRenderer.updateTrueFalseAnswer() in plaats daarvan
     * @param {string} exerciseId - ID of the exercise container
     * @param {number} statementIndex - Index of the statement
     * @param {boolean} answer - The answer (true or false)
     */
    static updateTrueFalseAnswer(exerciseId, statementIndex, answer) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.updateTrueFalseAnswer(exerciseId, statementIndex, answer);
        }
        console.warn('ExerciseRenderer not loaded. True/false answer update will not work.');
    }

    /**
     * Render een sequence oefening (volgorde oefening)
     * @deprecated Gebruik ExerciseRenderer.renderSequenceExercise() in plaats daarvan
     * @param {Object} item - Sequence exercise item met paragraphs array
     * @returns {string} HTML string
     */
    static renderSequenceExercise(item) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.renderSequenceExercise(item);
        }
        console.warn('ExerciseRenderer not loaded. Sequence exercise will not render.');
        return '';
    }


    /**
     * Handle drag start for sequence exercise (sortable list)
     * @deprecated Gebruik ExerciseRenderer.handleSequenceDragStart() in plaats daarvan
     * @param {Event} event - Drag event
     * @param {string} exerciseId - ID of the exercise container
     */
    static handleSequenceDragStart(event, exerciseId) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.handleSequenceDragStart(event, exerciseId);
        }
        console.warn('ExerciseRenderer not loaded. Sequence drag start will not work.');
    }


    /**
     * Handle drag over for sequence exercise (sortable list)
     * @deprecated Gebruik ExerciseRenderer.handleSequenceDragOver() in plaats daarvan
     * @param {Event} event - Drag event
     * @param {string} exerciseId - ID of the exercise container
     */
    static handleSequenceDragOver(event, exerciseId) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.handleSequenceDragOver(event, exerciseId);
        }
        console.warn('ExerciseRenderer not loaded. Sequence drag over will not work.');
    }


    /**
     * Get element after which to insert dragged item
     * @deprecated Gebruik ExerciseRenderer.getDragAfterElement() in plaats daarvan
     * @param {HTMLElement} container - Container element
     * @param {number} y - Y coordinate of mouse
     * @returns {HTMLElement|null} Element after which to insert, or null
     */
    static getDragAfterElement(container, y) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.getDragAfterElement(container, y);
        }
        console.warn('ExerciseRenderer not loaded. getDragAfterElement will not work.');
        return null;
    }


    /**
     * Handle drag end for sequence exercise
     * @deprecated Gebruik ExerciseRenderer.handleSequenceDragEnd() in plaats daarvan
     * @param {Event} event - Drag event
     * @param {string} exerciseId - ID of the exercise container
     */
    static handleSequenceDragEnd(event, exerciseId) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.handleSequenceDragEnd(event, exerciseId);
        }
        console.warn('ExerciseRenderer not loaded. Sequence drag end will not work.');
    }


    /**
     * Check sequence order (for sortable list)
     * @deprecated Gebruik ExerciseRenderer.checkSequenceOrder() in plaats daarvan
     * @param {string} exerciseId - ID of the exercise container
     */
    static checkSequenceOrder(exerciseId) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.checkSequenceOrder(exerciseId);
        }
        console.warn('ExerciseRenderer not loaded. Sequence order check will not work.');
    }


    /**
     * Render een bronbeoordelingsoefening met gelaagde structuur
     * @deprecated TODO: Verplaats naar ExerciseRenderer.js (zeer groot, >700 regels)
     * Laat studenten eerst een bron kiezen, dan een checktype, en daarna de criteria invullen
     * @param {Object} item - Source evaluation exercise item met sources array
     * @returns {string} HTML string
     */
    static renderSourceEvaluationExercise(item) {
        // Support both old format (single source) and new format (multiple sources)
        let sources = [];
        
        if (item.sources && Array.isArray(item.sources) && item.sources.length > 0) {
            // New format: multiple sources
            sources = item.sources;
        } else if (item.source && item.criteria) {
            // Old format: single source with criteria - convert to new format
            const evaluationType = item.evaluationType || '1e2eCheck';
            const convertedSource = {
                title: item.source.title || '',
                author: item.source.author || '',
                year: item.source.year || '',
                link: item.source.link || '',
                type: item.source.type || 'wetenschappelijk'
            };
            
            // Zet criteria in de juiste check type
            if (evaluationType === '1e2eCheck') {
                convertedSource.firstCheck = { criteria: item.criteria || [] };
                convertedSource.secondCheck = { criteria: [] };
            } else if (evaluationType === 'crapTest') {
                convertedSource.crapTest = { criteria: item.criteria || [] };
            }
            
            sources = [convertedSource];
        } else {
            console.warn('SourceEvaluationExercise missing sources or source:', item);
            return '';
        }

        if (sources.length === 0) {
            console.warn('SourceEvaluationExercise: no sources found');
            return '';
        }

        const exerciseId = `source-eval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render altijd 3 bronselectie knoppen (ook als er minder bronnen zijn)
        const sourceButtonsHtml = [0, 1, 2].map((index) => {
            const sourceIndex = index + 1;
            const hasSource = sources[index] !== undefined;
            return `
                <button
                    type="button"
                    data-source-index="${index}"
                    data-exercise-id="${exerciseId}"
                    class="source-select-btn px-4 py-2 rounded-lg font-medium text-sm transition-colors ${index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'} ${!hasSource ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${!hasSource ? 'disabled' : ''}
                >
                    Bron ${sourceIndex}${!hasSource ? ' (nog niet beschikbaar)' : ''}
                </button>
            `;
        }).join('');

        // Render broninformatie container (wordt gevuld wanneer bron geselecteerd wordt)
        const sourceInfoHtml = `
            <div id="${exerciseId}-source-info" class="hidden bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-600">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Broninformatie</h4>
                <div id="${exerciseId}-source-details" class="space-y-2 text-sm"></div>
            </div>
        `;

        // Render check-selectie knoppen (altijd zichtbaar, worden getoond na bronselectie)
        const checkButtonsHtml = `
            <div id="${exerciseId}-check-buttons" class="hidden mb-4">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Kies een beoordelingsmethode:</h4>
                <div class="flex flex-wrap gap-3">
                    <button
                        type="button"
                        data-check-type="1eCheck"
                        data-exercise-id="${exerciseId}"
                        class="check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        1e Check
                    </button>
                    <button
                        type="button"
                        data-check-type="2eCheck"
                        data-exercise-id="${exerciseId}"
                        class="check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        2e Check
                    </button>
                    <button
                        type="button"
                        data-check-type="crapTest"
                        data-exercise-id="${exerciseId}"
                        class="check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        CRAP-test
                    </button>
                </div>
            </div>
        `;

        // Render criteria sectie (wordt gevuld wanneer checktype geselecteerd wordt)
        const criteriaSectionHtml = `
            <div id="${exerciseId}-criteria-section" class="hidden mb-4">
                <h4 id="${exerciseId}-criteria-title" class="font-semibold text-gray-900 dark:text-white mb-3"></h4>
                <p id="${exerciseId}-criteria-instruction" class="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">Vul voor elk criterium je beoordeling in. Klik daarna op "Toon antwoordmodel" om de voorbeeldantwoorden te zien en je eigen antwoord te vergelijken.</p>
                <div id="${exerciseId}-criteria-list"></div>
            </div>
        `;

        // Render antwoordmodel knop
        const answerModelButtonHtml = `
            <div id="${exerciseId}-answer-model-section" class="hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button 
                    type="button"
                    data-exercise-id="${exerciseId}"
                    class="source-eval-check-btn px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm cursor-pointer"
                >
                    Toon antwoordmodel
                </button>
            </div>
        `;

        // Store sources data in data attribute voor JavaScript
        // Escape de JSON string correct voor gebruik in HTML attribute
        // Gebruik encodeURIComponent om alle speciale karakters te encoderen
        const sourcesData = encodeURIComponent(JSON.stringify(sources));

        // Render context sectie als die beschikbaar is
        const contextHtml = item.context ? `
            <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 class="font-semibold text-blue-900 dark:text-blue-300 mb-3">Context van het onderzoek</h4>
                ${item.context.objective ? `<p class="text-sm text-blue-800 dark:text-blue-400 mb-3"><strong>Doelstelling:</strong> ${this.escapeHtml(item.context.objective)}</p>` : ''}
                ${item.context.mainQuestion ? `<p class="text-sm text-blue-800 dark:text-blue-400 mb-0"><strong>Hoofdvraag:</strong> ${this.escapeHtml(item.context.mainQuestion)}</p>` : ''}
            </div>
        ` : '';

        return `
            <div class="source-evaluation-exercise mb-6 bg-white dark:bg-gray-800 rounded-lg px-6 py-4" id="${exerciseId}" data-sources="${sourcesData}">
                ${item.title ? `<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${this.escapeHtml(item.title)}</h3>` : ''}
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${this.escapeHtml(item.instruction || 'Kies eerst een bron, dan een beoordelingsmethode, en vul de criteria in.')}</p>
                
                ${contextHtml}
                
                <div class="mb-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Kies een bron:</h4>
                    <div class="flex flex-wrap gap-3">
                        ${sourceButtonsHtml}
                    </div>
                </div>
                
                ${sourceInfoHtml}
                ${checkButtonsHtml}
                ${criteriaSectionHtml}
                ${answerModelButtonHtml}
            </div>
            <script>
                // Auto-selecteer eerste bron bij laden
                (function() {
                    const exerciseEl = document.getElementById('${exerciseId}');
                    if (exerciseEl && typeof InteractiveRenderer !== 'undefined') {
                        InteractiveRenderer.selectSource('${exerciseId}', 0);
                    }
                })();
            </script>
        `;
    }

    /**
     * Selecteer een bron
     * @deprecated TODO: Verplaats naar ExerciseRenderer.js (deel van Source Evaluation Exercise)
     * @param {string} exerciseId - ID of the exercise container
     * @param {number} sourceIndex - Index of the source to select
     */
    static selectSource(exerciseId, sourceIndex) {
        const exerciseElement = document.getElementById(exerciseId);
        if (!exerciseElement) return;

        // Parse de sources data (decode URI component eerst)
        const sourcesData = exerciseElement.dataset.sources || '';
        if (!sourcesData) return;
        let sources;
        try {
            sources = JSON.parse(decodeURIComponent(sourcesData));
        } catch (e) {
            console.error('Error parsing sources data:', e);
            return;
        }
        if (!sources[sourceIndex]) return;

        const source = sources[sourceIndex];
        
        // Update bronselectie knoppen
        exerciseElement.querySelectorAll('.source-select-btn').forEach((btn, index) => {
            if (index === sourceIndex) {
                btn.className = 'source-select-btn px-4 py-2 rounded-lg font-medium text-sm transition-colors bg-blue-600 text-white';
            } else {
                btn.className = 'source-select-btn px-4 py-2 rounded-lg font-medium text-sm transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600';
            }
        });

        // Toon broninformatie
        const sourceInfoDiv = document.getElementById(`${exerciseId}-source-info`);
        const sourceDetailsDiv = document.getElementById(`${exerciseId}-source-details`);
        if (sourceInfoDiv && sourceDetailsDiv) {
            sourceDetailsDiv.innerHTML = `
                <p><strong class="text-gray-700 dark:text-gray-300">Titel:</strong> <span class="text-gray-800 dark:text-gray-200">${this.escapeHtml(source.title || 'Niet opgegeven')}</span></p>
                <p><strong class="text-gray-700 dark:text-gray-300">Auteur:</strong> <span class="text-gray-800 dark:text-gray-200">${this.escapeHtml(source.author || 'Niet opgegeven')}</span></p>
                <p><strong class="text-gray-700 dark:text-gray-300">Jaar:</strong> <span class="text-gray-800 dark:text-gray-200">${this.escapeHtml(source.year || 'Niet opgegeven')}</span></p>
                ${source.link ? `<p class="break-words"><strong class="text-gray-700 dark:text-gray-300">Link:</strong> <a href="${this.escapeHtml(source.link)}" target="_blank" class="text-blue-600 hover:text-blue-800 underline break-all">${this.escapeHtml(source.link)}</a></p>` : ''}
            `;
            sourceInfoDiv.classList.remove('hidden');
        }

        // Toon altijd check-selectie knoppen (alle 3 zijn altijd zichtbaar)
        const checkButtonsDiv = document.getElementById(`${exerciseId}-check-buttons`);
        if (checkButtonsDiv) {
            checkButtonsDiv.classList.remove('hidden');
            
            // Check welke check types beschikbaar zijn voor deze bron
            const hasFirstCheck = source.firstCheck && source.firstCheck.criteria && source.firstCheck.criteria.length > 0;
            const hasSecondCheck = source.secondCheck && source.secondCheck.criteria && source.secondCheck.criteria.length > 0;
            const hasCrapTest = source.crapTest && source.crapTest.criteria && source.crapTest.criteria.length > 0;
            
            // Voor CRAP-test: enabled houden voor wetenschappelijke bronnen (ook zonder criteria) zodat melding getoond kan worden
            // Ook enabled voor commerciële bronnen zodat CRAP-test uitgevoerd kan worden
            const isScientificSource = source.type === 'wetenschappelijk' || source.type === 'semi-wetenschappelijk';
            const isCommercialSource = source.type === 'commercieel';
            const shouldEnableCrapTest = hasCrapTest || isScientificSource || isCommercialSource;
            
            // Alle knoppen zijn altijd zichtbaar, maar kunnen disabled zijn als er geen data is
            const firstCheckBtn = checkButtonsDiv.querySelector('[data-check-type="1eCheck"]');
            const secondCheckBtn = checkButtonsDiv.querySelector('[data-check-type="2eCheck"]');
            const crapTestBtn = checkButtonsDiv.querySelector('[data-check-type="crapTest"]');
            
            // Update button states (disabled als er geen data is, maar wel zichtbaar)
            if (firstCheckBtn) {
                if (!hasFirstCheck) {
                    firstCheckBtn.disabled = true;
                    firstCheckBtn.className = 'check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 opacity-50 cursor-not-allowed transition-colors';
                } else {
                    firstCheckBtn.disabled = false;
                    firstCheckBtn.className = 'check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors';
                }
            }
            if (secondCheckBtn) {
                // Voor commerciële bronnen: enabled houden zodat melding getoond kan worden
                const shouldEnableSecondCheck = hasSecondCheck || (source.type === 'commercieel' && source.secondCheck && source.secondCheck.conclusion);
                if (!shouldEnableSecondCheck) {
                    secondCheckBtn.disabled = true;
                    secondCheckBtn.className = 'check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 opacity-50 cursor-not-allowed transition-colors';
                } else {
                    secondCheckBtn.disabled = false;
                    secondCheckBtn.className = 'check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors';
                }
            }
            if (crapTestBtn) {
                if (!shouldEnableCrapTest) {
                    crapTestBtn.disabled = true;
                    crapTestBtn.className = 'check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 opacity-50 cursor-not-allowed transition-colors';
                } else {
                    crapTestBtn.disabled = false;
                    crapTestBtn.className = 'check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors';
                }
            }
        }

        // Reset check-selectie
        exerciseElement.querySelectorAll('.check-type-btn').forEach(btn => {
            btn.className = 'check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors';
        });

        // Verberg criteria sectie en antwoordmodel knop
        const criteriaSection = document.getElementById(`${exerciseId}-criteria-section`);
        const answerModelSection = document.getElementById(`${exerciseId}-answer-model-section`);
        if (criteriaSection) {
            criteriaSection.classList.add('hidden');
            // Verberg alle conclusies van de vorige bron wanneer je van bron wisselt
            const allConclusions = criteriaSection.querySelectorAll(`[id^="${exerciseId}-"][id$="-conclusion"]`);
            allConclusions.forEach(conclusion => {
                conclusion.style.display = 'none';
                conclusion.classList.add('hidden');
            });
        }
        if (answerModelSection) answerModelSection.classList.add('hidden');

        // Store selected source index
        exerciseElement.dataset.selectedSourceIndex = sourceIndex;
    }

    /**
     * Selecteer een checktype (1e check, 2e check, of CRAP-test)
     * @deprecated TODO: Verplaats naar ExerciseRenderer.js (deel van Source Evaluation Exercise)
     * @param {string} exerciseId - ID of the exercise container
     * @param {string} checkType - Type of check ('1eCheck', '2eCheck', or 'crapTest')
     */
    static selectCheckType(exerciseId, checkType) {
        const exerciseElement = document.getElementById(exerciseId);
        if (!exerciseElement) return;

        // Parse de sources data (decode URI component eerst)
        const sourcesData = exerciseElement.dataset.sources || '';
        if (!sourcesData) return;
        let sources;
        try {
            sources = JSON.parse(decodeURIComponent(sourcesData));
        } catch (e) {
            console.error('Error parsing sources data:', e);
            return;
        }
        const selectedSourceIndex = parseInt(exerciseElement.dataset.selectedSourceIndex || '0');
        const source = sources[selectedSourceIndex];
        
        if (!source) return;

        // Bepaal welke criteria bij dit checktype horen
        let criteria = [];
        let checkTitle = '';
        
        if (checkType === '1eCheck') {
            criteria = source.firstCheck?.criteria || [];
            checkTitle = '1e Check';
        } else if (checkType === '2eCheck') {
            criteria = source.secondCheck?.criteria || [];
            checkTitle = '2e Check';
        } else if (checkType === 'crapTest') {
            // Speciale behandeling voor CRAP-test: als het een wetenschappelijke bron is, toon melding
            if (source.type === 'wetenschappelijk' || source.type === 'semi-wetenschappelijk') {
                const criteriaListDiv = document.getElementById(`${exerciseId}-criteria-list`);
                const criteriaTitleDiv = document.getElementById(`${exerciseId}-criteria-title`);
                const criteriaSection = document.getElementById(`${exerciseId}-criteria-section`);
                const instructionText = document.getElementById(`${exerciseId}-criteria-instruction`);
                
                if (criteriaListDiv && criteriaTitleDiv && criteriaSection) {
                    criteriaTitleDiv.textContent = 'CRAP-test';
                    criteriaListDiv.innerHTML = `
                        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div class="flex items-start">
                                <i class="fas fa-info-circle text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2"></i>
                                <div class="flex-1">
                                    <p class="font-semibold text-yellow-900 dark:text-yellow-300 text-sm mb-2">CRAP-test niet nodig</p>
                                    <p class="text-sm text-yellow-800 dark:text-yellow-300">De CRAP-test hoeft niet uitgevoerd te worden omdat dit geen ordinaire internetbron is. Dit is een ${source.type === 'wetenschappelijk' ? 'wetenschappelijke' : 'semi-wetenschappelijke'} bron die al beoordeeld is met de 1e en 2e check.</p>
                                </div>
                            </div>
                        </div>
                    `;
                    criteriaSection.classList.remove('hidden');
                    
                    // Verberg instructietekst voor CRAP-test bij wetenschappelijke bronnen
                    if (instructionText) {
                        instructionText.style.display = 'none';
                    }
                    
                    // Verberg antwoordmodel knop voor CRAP-test bij wetenschappelijke bronnen
                    const answerModelSection = document.getElementById(`${exerciseId}-answer-model-section`);
                    if (answerModelSection) {
                        answerModelSection.classList.add('hidden');
                    }
                    
                    // Verberg alle conclusies van andere checks bij deze bron
                    const allConclusions = criteriaSection.querySelectorAll(`[id^="${exerciseId}-"][id$="-conclusion"]`);
                    allConclusions.forEach(conclusion => {
                        const conclusionId = conclusion.id;
                        const parts = conclusionId.split('-');
                        const conclusionSourceIndex = parseInt(parts[parts.length - 3] || '-1');
                        const conclusionCheckType = parts[parts.length - 2];
                        
                        // Verberg conclusies van andere checks
                        if (conclusionSourceIndex === selectedSourceIndex && conclusionCheckType !== checkType) {
                            conclusion.style.display = 'none';
                            conclusion.classList.add('hidden');
                        }
                    });
                }
                
                // Update check-selectie knoppen
                exerciseElement.querySelectorAll('.check-type-btn').forEach(btn => {
                    if (btn.disabled) {
                        return;
                    }
                    if (btn.dataset.checkType === checkType) {
                        btn.className = 'check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white transition-colors';
                    } else {
                        btn.className = 'check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors';
                    }
                });
                
                exerciseElement.dataset.selectedCheckType = checkType;
                return;
            }
            
            criteria = source.crapTest?.criteria || [];
            checkTitle = 'CRAP-test';
        }

        if (criteria.length === 0) {
            console.warn(`No criteria found for check type: ${checkType}`);
            // Toon een melding dat deze check overgeslagen moet worden
            const criteriaListDiv = document.getElementById(`${exerciseId}-criteria-list`);
            const criteriaTitleDiv = document.getElementById(`${exerciseId}-criteria-title`);
            const criteriaSection = document.getElementById(`${exerciseId}-criteria-section`);
            
            if (criteriaListDiv && criteriaTitleDiv && criteriaSection) {
                criteriaTitleDiv.textContent = `Beoordelingscriteria (${checkTitle})`;
                
                // Specifieke melding voor 2e check bij commerciële bronnen
                let message = "Er zijn nog geen criteria beschikbaar voor deze bron en checktype.";
                if (checkType === '2eCheck' && (source.type === 'commercieel' || !source.secondCheck || !source.secondCheck.criteria || source.secondCheck.criteria.length === 0)) {
                    // Haal de conclusie op als die beschikbaar is
                    const checkData = source.secondCheck;
                    if (checkData && checkData.conclusion) {
                        message = checkData.conclusion;
                    } else {
                        message = "Deze check wordt overgeslagen. Deze bron is niet geschikt voor de 2e check (wetenschappelijke criteria) omdat het een commerciële bron is. Gebruik de termen uit de 1e check om betere, wetenschappelijke bronnen te vinden.";
                    }
                } else if (checkType === 'crapTest' && (source.type === 'commercieel' || !source.crapTest || !source.crapTest.criteria || source.crapTest.criteria.length === 0)) {
                    message = "Deze check wordt overgeslagen. Gebruik de termen uit de 1e check om betere, wetenschappelijke bronnen te vinden.";
                }
                
                criteriaListDiv.innerHTML = `
                    <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div class="flex items-start">
                            <i class="fas fa-info-circle text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2"></i>
                            <p class="text-sm text-yellow-800 dark:text-yellow-300">${this.escapeHtml(message)}</p>
                        </div>
                    </div>
                `;
                criteriaSection.classList.remove('hidden');
                
                // Verberg alle conclusies van andere checks bij deze bron
                const allConclusions = criteriaSection.querySelectorAll(`[id^="${exerciseId}-"][id$="-conclusion"]`);
                allConclusions.forEach(conclusion => {
                    const conclusionId = conclusion.id;
                    const parts = conclusionId.split('-');
                    const conclusionSourceIndex = parseInt(parts[parts.length - 3] || '-1');
                    const conclusionCheckType = parts[parts.length - 2];
                    
                    // Verberg conclusies van andere checks
                    if (conclusionSourceIndex === selectedSourceIndex && conclusionCheckType !== checkType) {
                        conclusion.style.display = 'none';
                        conclusion.classList.add('hidden');
                    }
                });
                
                // Verberg instructietekst en antwoordmodel knop
                const instructionText = document.getElementById(`${exerciseId}-criteria-instruction`);
                if (instructionText) {
                    instructionText.style.display = 'none';
                }
                const answerModelSection = document.getElementById(`${exerciseId}-answer-model-section`);
                if (answerModelSection) {
                    answerModelSection.classList.add('hidden');
                }
            }
            return;
        }

        // Update check-selectie knoppen (alleen enabled knoppen kunnen actief zijn)
        exerciseElement.querySelectorAll('.check-type-btn').forEach(btn => {
            if (btn.disabled) {
                // Disabled knoppen blijven disabled styling houden
                return;
            }
            if (btn.dataset.checkType === checkType) {
                btn.className = 'check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white transition-colors';
            } else {
                btn.className = 'check-type-btn px-4 py-2 rounded-lg font-medium text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors';
            }
        });

        // Render criteria
        const criteriaListDiv = document.getElementById(`${exerciseId}-criteria-list`);
        const criteriaTitleDiv = document.getElementById(`${exerciseId}-criteria-title`);
        const criteriaSection = document.getElementById(`${exerciseId}-criteria-section`);
        
        if (criteriaListDiv && criteriaTitleDiv && criteriaSection) {
            criteriaTitleDiv.textContent = `Beoordelingscriteria (${checkTitle})`;
            
            // Behoud alle bestaande conclusies - verberg ze niet, ze blijven zichtbaar
            
            const criteriaHtml = criteria.map((criterion, index) => {
                const criterionId = `${exerciseId}-${selectedSourceIndex}-${checkType}-criterion-${index}`;
                const inputId = `${criterionId}-input`;
                
                const correctAnswers = Array.isArray(criterion.correctAnswer) 
                    ? criterion.correctAnswer 
                    : [criterion.correctAnswer];
                
                // Escape de correctAnswers JSON string voor gebruik in HTML attribute
                const correctAnswersJson = JSON.stringify(correctAnswers).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                // Escape feedback voor HTML attribute
                const feedbackEscaped = (criterion.feedback || '').replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                
                return `
                    <div class="criterion-item border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-3 bg-white dark:bg-gray-800" data-criterion-index="${index}">
                        <label for="${inputId}" class="block text-gray-900 dark:text-white mb-2">
                            <span class="font-semibold">${this.escapeHtml(criterion.name)}:</span>
                            <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">${this.escapeHtml(criterion.question)}</span>
                        </label>
                        <input 
                            type="text"
                            id="${inputId}"
                            data-correct-answers="${correctAnswersJson}"
                            data-feedback="${feedbackEscaped}"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Typ hier je beoordeling..."
                        />
                        <div id="${criterionId}-model" class="hidden mt-3"></div>
                    </div>
                `;
            }).join('');
            
            criteriaListDiv.innerHTML = criteriaHtml;
            
            // Verberg alle conclusies - ze worden pas getoond na klikken op "Toon antwoordmodel"
            const allConclusions = criteriaSection.querySelectorAll(`[id^="${exerciseId}-"][id$="-conclusion"]`);
            allConclusions.forEach(conclusion => {
                conclusion.style.display = 'none';
                conclusion.classList.add('hidden');
            });
            
            criteriaSection.classList.remove('hidden');
            
            // Verberg instructie tekst voor bron 1 bij CRAP-test
            if (checkType === 'crapTest' && selectedSourceIndex === 0) {
                const instructionText = document.getElementById(`${exerciseId}-criteria-instruction`);
                if (instructionText) {
                    instructionText.style.display = 'none';
                }
            } else {
                // Zorg dat de instructie tekst zichtbaar is voor andere gevallen
                const instructionText = document.getElementById(`${exerciseId}-criteria-instruction`);
                if (instructionText) {
                    instructionText.style.display = '';
                }
            }
            
            // Toon antwoordmodel knop
            const answerModelSection = document.getElementById(`${exerciseId}-answer-model-section`);
            if (answerModelSection) {
                answerModelSection.classList.remove('hidden');
            }
        }

        // Store selected check type
        exerciseElement.dataset.selectedCheckType = checkType;
    }

    /**
     * Toon antwoordmodel voor alle criteria
     * @deprecated TODO: Verplaats naar ExerciseRenderer.js (deel van Source Evaluation Exercise)
     * Gebruikers kunnen dan zelf beoordelen of hun antwoord correct was
     * @param {string} exerciseId - ID of the exercise container
     */
    static checkAllSourceCriteria(exerciseId) {
        console.log('[InteractiveRenderer] checkAllSourceCriteria called with:', exerciseId);
        const exerciseElement = document.getElementById(exerciseId);
        if (!exerciseElement) {
            console.warn('[InteractiveRenderer] Exercise element not found:', exerciseId);
            return;
        }

        const selectedSourceIndex = parseInt(exerciseElement.dataset.selectedSourceIndex || '0');
        const selectedCheckType = exerciseElement.dataset.selectedCheckType || '';
        
        if (!selectedCheckType) {
            console.warn('No check type selected');
            return;
        }

        // Parse de sources data (decode URI component eerst)
        const sourcesData = exerciseElement.dataset.sources || '';
        if (!sourcesData) return;
        let sources;
        try {
            sources = JSON.parse(decodeURIComponent(sourcesData));
        } catch (e) {
            console.error('Error parsing sources data:', e);
            return;
        }
        
        const source = sources[selectedSourceIndex];
        if (!source) return;

        // Haal de check data op (firstCheck, secondCheck, of crapTest)
        let checkData = null;
        if (selectedCheckType === '1eCheck') {
            checkData = source.firstCheck;
        } else if (selectedCheckType === '2eCheck') {
            checkData = source.secondCheck;
        } else if (selectedCheckType === 'crapTest') {
            checkData = source.crapTest;
        }

        const criteria = exerciseElement.querySelectorAll('.criterion-item');
        
        criteria.forEach((criterion, index) => {
            const input = criterion.querySelector('input[type="text"]');
            if (!input) return;
            
            // Unescape correctAnswers JSON string (decode HTML entities)
            let correctAnswersData = input.dataset.correctAnswers || '[]';
            correctAnswersData = correctAnswersData.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
            const correctAnswers = JSON.parse(correctAnswersData);
            
            // Unescape feedback (decode HTML entities)
            let feedback = input.dataset.feedback || '';
            feedback = feedback.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
            const criterionId = `${exerciseId}-${selectedSourceIndex}-${selectedCheckType}-criterion-${index}`;
            const modelDiv = document.getElementById(`${criterionId}-model`);
            
            if (!modelDiv) return;
            
            // Toon antwoordmodel (verwijder bullets uit antwoorden als die er zijn)
            const correctAnswersHtml = correctAnswers.map(answer => {
                // Verwijder bullets (•) aan het begin van het antwoord
                const cleanAnswer = answer.replace(/^•\s*/, '').trim();
                return `<li class="text-sm text-gray-700 dark:text-gray-300">${this.escapeHtml(cleanAnswer)}</li>`;
            }).join('');
            
            modelDiv.className = 'mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg';
            modelDiv.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-lightbulb text-blue-600 dark:text-blue-400 mt-0.5 mr-2"></i>
                    <div class="flex-1">
                        <p class="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-2">Voorbeeldantwoorden:</p>
                        <ul class="list-disc list-inside space-y-1 mb-2">
                            ${correctAnswersHtml}
                        </ul>
                        ${feedback ? `<p class="text-sm text-blue-800 dark:text-blue-400 mt-2 italic">${this.escapeHtml(feedback)}</p>` : ''}
                    </div>
                </div>
            `;
            modelDiv.classList.remove('hidden');
        });

        // Toon conclusie als die beschikbaar is
        if (checkData && checkData.conclusion) {
            const criteriaSection = document.getElementById(`${exerciseId}-criteria-section`);
            if (criteriaSection) {
                // Check of er al een conclusie div bestaat voor deze specifieke bron en check
                const conclusionId = `${exerciseId}-${selectedSourceIndex}-${selectedCheckType}-conclusion`;
                let conclusionDiv = document.getElementById(conclusionId);
                if (!conclusionDiv) {
                    // Maak een nieuwe conclusie div met source index in de ID
                    conclusionDiv = document.createElement('div');
                    conclusionDiv.id = conclusionId;
                    conclusionDiv.className = 'mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg';
                    criteriaSection.appendChild(conclusionDiv);
                }
                
                // Verberg conclusies van andere bronnen
                const allConclusions = criteriaSection.querySelectorAll(`[id^="${exerciseId}-"][id$="-conclusion"]`);
                allConclusions.forEach(conclusion => {
                    if (conclusion.id !== conclusionId) {
                        // Check of deze conclusie bij een andere bron hoort
                        const parts = conclusion.id.split('-');
                        const otherSourceIndex = parseInt(parts[parts.length - 3] || '-1');
                        if (otherSourceIndex !== selectedSourceIndex) {
                            conclusion.style.display = 'none';
                            conclusion.classList.add('hidden');
                        }
                    }
                });
                
                const checkTitle = selectedCheckType === '1eCheck' ? '1e Check' : 
                                  selectedCheckType === '2eCheck' ? '2e Check' : 'CRAP-test';
                
                // Bepaal kleur op basis van status (green, orange, red)
                const status = checkData.status || 'green'; // default green
                let bgColor, borderColor, iconColor, textColor, titleColor, iconClass;
                
                if (status === 'red') {
                    bgColor = 'bg-red-50 dark:bg-red-900/20';
                    borderColor = 'border-red-200 dark:border-red-800';
                    iconColor = 'text-red-600 dark:text-red-400';
                    textColor = 'text-red-800 dark:text-red-400';
                    titleColor = 'text-red-900 dark:text-red-300';
                    iconClass = 'fas fa-times-circle';
                } else if (status === 'orange') {
                    bgColor = 'bg-orange-50 dark:bg-orange-900/20';
                    borderColor = 'border-orange-200 dark:border-orange-800';
                    iconColor = 'text-orange-600 dark:text-orange-400';
                    textColor = 'text-orange-800 dark:text-orange-400';
                    titleColor = 'text-orange-900 dark:text-orange-300';
                    iconClass = 'fas fa-exclamation-triangle';
                } else { // green (default)
                    bgColor = 'bg-green-50 dark:bg-green-900/20';
                    borderColor = 'border-green-200 dark:border-green-800';
                    iconColor = 'text-green-600 dark:text-green-400';
                    textColor = 'text-green-800 dark:text-green-400';
                    titleColor = 'text-green-900 dark:text-green-300';
                    iconClass = 'fas fa-check-circle';
                }
                
                conclusionDiv.className = `mt-4 p-4 ${bgColor} border ${borderColor} rounded-lg`;
                conclusionDiv.innerHTML = `
                    <div class="flex items-start">
                        <i class="${iconClass} ${iconColor} mt-0.5 mr-2"></i>
                        <div class="flex-1">
                            <p class="font-semibold ${titleColor} text-sm mb-2">Conclusie ${checkTitle}</p>
                            <p class="text-sm ${textColor}">${this.escapeHtml(checkData.conclusion)}</p>
                        </div>
                    </div>
                `;
                conclusionDiv.style.display = '';
                conclusionDiv.classList.remove('hidden');
            }
        }
    }

    /**
     * Fuzzy matching voor antwoorden
     * Accepteert variaties in spelling en woordkeuze
     * 
     * Werkt op basis van:
     * 1. Exacte match (na normalisatie)
     * 2. Keyword matching - als belangrijke woorden uit het correcte antwoord voorkomen in het gebruikersantwoord
     * 3. Synoniemen en variaties worden geaccepteerd
     */
    static fuzzyMatchSourceAnswer(userAnswer, correctAnswers) {
        if (!userAnswer || !correctAnswers || correctAnswers.length === 0) {
            return false;
        }

        const normalizedUser = this.normalizeText(userAnswer);
        
        return correctAnswers.some(correctAnswer => {
            const normalizedCorrect = this.normalizeText(correctAnswer);
            
            // Exact match (na normalisatie)
            if (normalizedUser === normalizedCorrect) {
                return true;
            }
            
            // Check of het gebruikersantwoord het correcte antwoord bevat (of omgekeerd)
            if (normalizedUser.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedUser)) {
                return true;
            }
            
            // Keyword matching - extract belangrijke woorden (langer dan 3 karakters)
            const correctKeywords = normalizedCorrect.split(/\s+/).filter(word => word.length > 3);
            if (correctKeywords.length === 0) {
                // Als er geen keywords zijn, check op kortere woorden
                const shortWords = normalizedCorrect.split(/\s+/).filter(word => word.length >= 2);
                const shortMatches = shortWords.filter(word => normalizedUser.includes(word));
                return shortMatches.length >= Math.min(2, shortWords.length);
            }
            
            // Tel hoeveel keywords voorkomen in het gebruikersantwoord
            const matches = correctKeywords.filter(keyword => normalizedUser.includes(keyword));
            
            // Accepteer als minimaal 40% van de keywords matcht (was 50%, nu soepeler)
            // Of als er minimaal 2 keywords matchen
            const matchRatio = matches.length / correctKeywords.length;
            return matchRatio >= 0.4 || matches.length >= 2;
        });
    }

    /**
     * Normaliseer tekst voor vergelijking
     * @deprecated Gebruik HtmlUtils.normalizeText() in plaats daarvan
     */
    static normalizeText(text) {
        if (typeof window.HtmlUtils !== 'undefined') {
            return HtmlUtils.normalizeText(text);
        }
        console.warn('HtmlUtils not loaded. Falling back to local implementation.');
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .replace(/\s+/g, ' ');   // Normalize whitespace
    }

    /**
     * Escape HTML voor veiligheid
     * @deprecated Gebruik HtmlUtils.escapeHtml() in plaats daarvan
     */
    static escapeHtml(text) {
        if (typeof window.HtmlUtils !== 'undefined') {
            return HtmlUtils.escapeHtml(text);
        }
        console.warn('HtmlUtils not loaded. Falling back to local implementation.');
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Render een klikbare stappen component
     * @deprecated Gebruik ClickableStepsRenderer.renderClickableSteps() in plaats daarvan
     * @param {Object} item - Clickable steps item met steps array
     * @returns {string} HTML string
     */
    static renderClickableSteps(item) {
        if (typeof window.ClickableStepsRenderer !== 'undefined') {
            return ClickableStepsRenderer.renderClickableSteps(item);
        }
        console.warn('ClickableStepsRenderer not loaded. ClickableSteps will not render.');
                            return '';
    }

    /**
     * Toggle clickable step open/closed
     * @deprecated Gebruik ClickableStepsRenderer.toggleClickableStep() in plaats daarvan
     * @param {string} stepsId - ID of the steps container
     * @param {number} stepIndex - Index of the step to toggle
     * @param {boolean} allowMultiple - Whether multiple steps can be open at the same time
     */
    static toggleClickableStep(stepsId, stepIndex, allowMultiple = true) {
        if (typeof window.ClickableStepsRenderer !== 'undefined') {
            return ClickableStepsRenderer.toggleClickableStep(stepsId, stepIndex, allowMultiple);
        }
        console.warn('ClickableStepsRenderer not loaded. ClickableStep toggle will not work.');
    }

    /**
     * Check true/false exercise answers
     * @deprecated Gebruik ExerciseRenderer.checkTrueFalseExercise() in plaats daarvan
     * @param {string} exerciseId - ID of the exercise container
     */
    static checkTrueFalseExercise(exerciseId) {
        if (typeof window.ExerciseRenderer !== 'undefined') {
            return ExerciseRenderer.checkTrueFalseExercise(exerciseId);
        }
        console.warn('ExerciseRenderer not loaded. True/false exercise check will not work.');
    }


    /**
     * Render een tabs component
     * @deprecated Gebruik TabRenderer.renderTabs() in plaats daarvan
     * @param {Object} item - Tabs item met tabs array
     * @returns {string} HTML string
     */
    static renderTabs(item) {
        if (typeof window.TabRenderer !== 'undefined') {
            return TabRenderer.renderTabs(item);
        }
        console.warn('TabRenderer not loaded. Tabs will not render.');
            return '';
    }

    /**
     * Switch between tabs
     * @deprecated Gebruik TabRenderer.switchTab() in plaats daarvan
     * @param {string} tabsId - ID of the tabs container
     * @param {number} tabIndex - Index of the tab to switch to
     */
    static switchTab(tabsId, tabIndex) {
        if (typeof window.TabRenderer !== 'undefined') {
            return TabRenderer.switchTab(tabsId, tabIndex);
        }
        console.warn('TabRenderer not loaded. Tab switching will not work.');
    }

    /**
     * Render een interactieve checklist voor kwaliteitscriteria begrip
     * @param {Object} item - Concept quality checklist item
     * @returns {string} HTML string
     */
    /**
     * Render een concept quality checklist
     * @deprecated Gebruik ChecklistRenderer.renderConceptQualityChecklist() in plaats daarvan
     * @param {Object} item - Concept quality checklist item met concept en definition
     * @returns {string} HTML string
     */
    static renderConceptQualityChecklist(item) {
        if (typeof window.ChecklistRenderer !== 'undefined') {
            return ChecklistRenderer.renderConceptQualityChecklist(item);
        }
        console.warn('ChecklistRenderer not loaded. Concept quality checklist will not render.');
            return '';
    }

    /**
     * Check if definition contains time and place
     * @deprecated Gebruik ChecklistRenderer.checkAfbakening() in plaats daarvan
     * @param {string} definition - Definition text to check
     * @returns {Object} Object with hasPlace, hasTime, and bothPresent
     */
    static checkAfbakening(definition) {
        if (typeof window.ChecklistRenderer !== 'undefined') {
            return ChecklistRenderer.checkAfbakening(definition);
        }
        console.warn('ChecklistRenderer not loaded. Afbakening check will not work.');
        return { hasPlace: false, hasTime: false, bothPresent: false };
    }


    /**
     * Check if definition contains observable/measurable indicators
     * @deprecated Gebruik ChecklistRenderer.checkOperationalisatie() in plaats daarvan
     * @param {string} definition - Definition text to check
     * @returns {Object} Object with hasMeasurable, hasObservable, and hasIndicators
     */
    static checkOperationalisatie(definition) {
        if (typeof window.ChecklistRenderer !== 'undefined') {
            return ChecklistRenderer.checkOperationalisatie(definition);
        }
        console.warn('ChecklistRenderer not loaded. Operationalisatie check will not work.');
        return { hasMeasurable: false, hasObservable: false, hasIndicators: false };
    }


    /**
     * Update concept quality status and show feedback
     * @deprecated Gebruik ChecklistRenderer.updateConceptQualityStatus() in plaats daarvan
     * @param {string} checklistId - ID of the checklist container
     * @param {string} criterionLetter - Letter of the criterion (A, O, S)
     */
    static updateConceptQualityStatus(checklistId, criterionLetter) {
        if (typeof window.ChecklistRenderer !== 'undefined') {
            return ChecklistRenderer.updateConceptQualityStatus(checklistId, criterionLetter);
        }
        console.warn('ChecklistRenderer not loaded. Concept quality status update will not work.');
    }


    /**
     * Show concept quality checklist result
     * @deprecated Gebruik ChecklistRenderer.showConceptQualityResult() in plaats daarvan
     * @param {string} checklistId - ID of the checklist container
     */
    static showConceptQualityResult(checklistId) {
        if (typeof window.ChecklistRenderer !== 'undefined') {
            return ChecklistRenderer.showConceptQualityResult(checklistId);
        }
        console.warn('ChecklistRenderer not loaded. Concept quality result will not show.');
    }


    /**
     * Render een boolean operator oefening
     * Laat studenten queries bouwen met AND, OR, NOT operatoren en haakjes
     * @param {Object} item - Boolean operator exercise item met scenarios array
     * @returns {string} HTML string
     */
    /**
     * Render een boolean operator oefening
     * @deprecated Gebruik AIRenderer.renderBooleanOperatorExercise() in plaats daarvan
     * @param {Object} item - Boolean operator exercise item met scenarios array
     * @returns {string} HTML string
     */
    static renderBooleanOperatorExercise(item) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.renderBooleanOperatorExercise(item);
        }
        console.warn('AIRenderer not loaded. Boolean operator exercise will not render.');
        return '';
    }

    
    /**
     * Setup event listeners for boolean operator exercise buttons
     * @deprecated Gebruik AIRenderer.setupBooleanExerciseListeners() in plaats daarvan
     * This is needed because CSP blocks inline onclick handlers
     */
    static setupBooleanExerciseListeners(exerciseId) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.setupBooleanExerciseListeners(exerciseId);
        }
        console.warn('AIRenderer not loaded. Boolean exercise listeners will not work.');
    }


    /**
     * Add term or operator to query builder
     * @deprecated Gebruik AIRenderer.addToQuery() in plaats daarvan
     */
    static addToQuery(scenarioId, item) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.addToQuery(scenarioId, item);
        }
        console.warn('AIRenderer not loaded. addToQuery will not work.');
    }


    /**
     * Update visual display of query
     * @deprecated Gebruik AIRenderer.updateQueryDisplay() in plaats daarvan
     */
    static updateQueryDisplay(scenarioId) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.updateQueryDisplay(scenarioId);
        }
        console.warn('AIRenderer not loaded. updateQueryDisplay will not work.');
    }


    /**
     * Clear query builder
     * @deprecated Gebruik AIRenderer.clearQuery() in plaats daarvan
     */
    static clearQuery(scenarioId) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.clearQuery(scenarioId);
        }
        console.warn('AIRenderer not loaded. clearQuery will not work.');
    }


    /**
     * Validate query against correct answer
     * @deprecated Gebruik AIRenderer.validateQuery() in plaats daarvan
     */
    static validateQuery(scenarioId) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.validateQuery(scenarioId);
        }
        console.warn('AIRenderer not loaded. validateQuery will not work.');
    }


    /**
     * Render een AI query oefening
     * Laat studenten queries schrijven en krijgt AI feedback
     */
    /**
     * Render een AI query oefening
     * @deprecated Gebruik AIRenderer.renderAIQueryExercise() in plaats daarvan
     * Laat studenten queries schrijven en krijgt AI feedback
     * @param {Object} item - AI query exercise item
     * @returns {string} HTML string
     */
    static renderAIQueryExercise(item) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.renderAIQueryExercise(item);
        }
        console.warn('AIRenderer not loaded. AI query exercise will not render.');
        return '';
    }
    
    /**
     * Setup event listeners for AI query exercise buttons
     * @deprecated Gebruik AIRenderer.setupAIQueryExerciseListeners() in plaats daarvan
     * This is needed because CSP blocks inline onclick handlers
     */
    static setupAIQueryExerciseListeners(exerciseId) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.setupAIQueryExerciseListeners(exerciseId);
        }
        console.warn('AIRenderer not loaded. AI query exercise listeners will not work.');
    }

    /**
     * Load a new AI-generated query scenario
     * @deprecated Gebruik AIRenderer.loadNewAIQueryScenario() in plaats daarvan
     */
    static async loadNewAIQueryScenario(exerciseId) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.loadNewAIQueryScenario(exerciseId);
        }
        console.warn('AIRenderer not loaded. loadNewAIQueryScenario will not work.');
    }

    /**
     * Extract theory content from the page
     * @deprecated Gebruik AIRenderer.extractTheoryContent() in plaats daarvan
     */
    static extractTheoryContent() {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.extractTheoryContent();
        }
        console.warn('AIRenderer not loaded. extractTheoryContent will not work.');
        return '';
    }

    /**
     * Validate query with AI feedback
     * @deprecated Gebruik AIRenderer.validateAIQuery() in plaats daarvan
     */
    static async validateAIQuery(exerciseId) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.validateAIQuery(exerciseId);
        }
        console.warn('AIRenderer not loaded. validateAIQuery will not work.');
    }

    /**
     * Add term or operator to AI query input field
     * @deprecated Gebruik AIRenderer.addToAIQuery() in plaats daarvan
     */
    static addToAIQuery(exerciseId, item) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.addToAIQuery(exerciseId, item);
        }
        console.warn('AIRenderer not loaded. addToAIQuery will not work.');
    }

    /**
     * Clear AI query input
     * @deprecated Gebruik AIRenderer.clearAIQuery() in plaats daarvan
     */
    static clearAIQuery(exerciseId) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.clearAIQuery(exerciseId);
        }
        console.warn('AIRenderer not loaded. clearAIQuery will not work.');
    }

    /**
     * Render AI Bouwsteen Generator tool
     * @deprecated Gebruik AIRenderer.renderAIBouwsteenGenerator() in plaats daarvan
     * Laat studenten een zoekwoord en context invoeren en genereert een bouwsteentabel
     * @param {Object} item - AI Bouwsteen Generator item
     * @returns {string} HTML string
     */
    static renderAIBouwsteenGenerator(item) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.renderAIBouwsteenGenerator(item);
        }
        console.warn('AIRenderer not loaded. AI Bouwsteen Generator will not render.');
        return '';
    }
    
    /**
     * Setup event listeners for AI Bouwsteen Generator
     * @deprecated Gebruik AIRenderer.setupAIBouwsteenGeneratorListeners() in plaats daarvan
     */
    static setupAIBouwsteenGeneratorListeners(generatorId) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.setupAIBouwsteenGeneratorListeners(generatorId);
        }
        console.warn('AIRenderer not loaded. AI Bouwsteen Generator listeners will not work.');
    }
    
    /**
     * Generate bouwsteen tabel using AI
     * @deprecated Gebruik AIRenderer.generateBouwsteenTabel() in plaats daarvan
     */
    static async generateBouwsteenTabel(generatorId) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.generateBouwsteenTabel(generatorId);
        }
        console.warn('AIRenderer not loaded. generateBouwsteenTabel will not work.');
    }
    
    /**
     * Render bouwsteen tabel from data
     * @deprecated Gebruik AIRenderer.renderBouwsteenTabel() in plaats daarvan
     */
    static renderBouwsteenTabel(tableData) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.renderBouwsteenTabel(tableData);
        }
        console.warn('AIRenderer not loaded. renderBouwsteenTabel will not work.');
        return '';
    }
    
    /**
     * Copy bouwsteen tabel to clipboard
     * @deprecated Gebruik AIRenderer.copyBouwsteenTabel() in plaats daarvan
     */
    static async copyBouwsteenTabel(generatorId) {
        if (typeof window.AIRenderer !== 'undefined') {
            return AIRenderer.copyBouwsteenTabel(generatorId);
        }
        console.warn('AIRenderer not loaded. copyBouwsteenTabel will not work.');
    }
    
    // Oude implementaties verwijderd - zie AIRenderer.js voor de nieuwe implementaties
    // De volgende methoden zijn verplaatst naar AIRenderer.js:
    // - renderAIQueryExercise (oude implementatie)
    // - setupAIQueryExerciseListeners (oude implementatie)
    // - loadNewAIQueryScenario (oude implementatie)
    // - extractTheoryContent (oude implementatie)
    // - validateAIQuery (oude implementatie)
    // - addToAIQuery (oude implementatie)
    // - clearAIQuery (oude implementatie)
    // - renderAIBouwsteenGenerator (oude implementatie)
    // - setupAIBouwsteenGeneratorListeners (oude implementatie)
    // - generateBouwsteenTabel (oude implementatie)
    // - renderBouwsteenTabel (oude implementatie)
    // - copyBouwsteenTabel (oude implementatie)
    
    // Oude implementaties verwijderd - zie AIRenderer.js voor de nieuwe implementaties
    
    // escapeHtml method removed - duplicate, using HtmlUtils.escapeHtml() instead
}
// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveRenderer;
} else {
    window.InteractiveRenderer = InteractiveRenderer;
}

