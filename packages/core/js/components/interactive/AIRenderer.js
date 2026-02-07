/**
 * AIRenderer
 * 
 * Utility voor het renderen van AI Tools:
 * - Boolean Operator Exercise
 * - AI Query Exercise
 * - AI Bouwsteen Generator
 */

class AIRenderer {
    /**
     * Render een boolean operator oefening
     * Laat studenten queries bouwen met boolean operatoren
     * @param {Object} item - Boolean operator exercise item met scenarios array
     * @returns {string} HTML string
     */
    static renderBooleanOperatorExercise(item) {
        console.log('[AIRenderer] Rendering booleanOperatorExercise', item);
        
        if (!item.scenarios || !Array.isArray(item.scenarios) || item.scenarios.length === 0) {
            console.warn('Boolean operator exercise missing scenarios array:', item);
            return '';
        }

        const exerciseId = `boolean-operator-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const title = item.title || 'Booleaanse operatoroefeningen';
        const instruction = item.instruction || 'Bouw de juiste zoekquery voor elk scenario.';
        
        console.log('[AIRenderer] Exercise ID:', exerciseId, 'Scenarios:', item.scenarios.length);

        const scenariosHtml = item.scenarios.map((scenario, index) => {
            const scenarioId = `${exerciseId}-scenario-${index}`;
            const queryBuilderId = `${scenarioId}-query-builder`;
            const queryDisplayId = `${scenarioId}-query-display`;
            const feedbackId = `${scenarioId}-feedback`;
            
            // Helper function to escape for HTML attribute (single quotes)
            const escapeForAttr = (str) => {
                return String(str).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
            };
            
            // Create clickable buttons for terms (without onclick - will be added via event listeners)
            const termsHtml = scenario.availableTerms.map(term => {
                const escapedTerm = escapeForAttr(term);
                return `<button 
                    type="button"
                    class="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-sm font-medium transition-colors mb-2 mr-2 boolean-exercise-btn"
                    data-scenario-id="${scenarioId}"
                    data-item="${escapedTerm}"
                >
                    ${term}
                </button>`;
            }).join('');

            // Create clickable buttons for operators (without onclick - will be added via event listeners)
            const operatorsHtml = scenario.availableOperators.map(op => {
                const escapedOp = escapeForAttr(op);
                return `<button 
                    type="button"
                    class="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md text-sm font-bold transition-colors mb-2 mr-2 boolean-exercise-btn"
                    data-scenario-id="${scenarioId}"
                    data-item="${escapedOp}"
                >
                    ${op}
                </button>`;
            }).join('');

            // Parentheses buttons (without onclick - will be added via event listeners)
            const parenthesesHtml = `
                <button 
                    type="button"
                    class="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-bold transition-colors mb-2 mr-2 boolean-exercise-btn"
                    data-scenario-id="${scenarioId}"
                    data-item="("
                >
                    (
                </button>
                <button 
                    type="button"
                    class="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-bold transition-colors mb-2 mr-2 boolean-exercise-btn"
                    data-scenario-id="${scenarioId}"
                    data-item=")"
                >
                    )
                </button>
            `;

            // Escape HTML attributes properly
            const escapedCorrectQuery = scenario.correctQuery.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            const escapedExplanation = scenario.explanation.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            
            return `
                <div class="border-l-2 border-gray-200 dark:border-gray-700 rounded p-4 mb-4 bg-white dark:bg-gray-800" data-scenario-id="${scenarioId}" data-correct-query="${escapedCorrectQuery}" data-explanation="${escapedExplanation}">
                    <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Scenario ${index + 1}</h4>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">${scenario.description}</p>
                    
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jouw query:</label>
                        <div id="${queryDisplayId}" class="min-h-[40px] p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md mb-2 flex flex-wrap items-center gap-2">
                            <span class="text-sm text-gray-500 dark:text-gray-400 italic">Klik op termen en operatoren hieronder om je query te bouwen</span>
                        </div>
                        <input type="hidden" id="${queryBuilderId}" value="" />
                    </div>

                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zoektermen:</label>
                        <div class="flex flex-wrap">
                            ${termsHtml}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Operatoren:</label>
                        <div class="flex flex-wrap">
                            ${operatorsHtml}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Haakjes:</label>
                        <div class="flex flex-wrap">
                            ${parenthesesHtml}
                        </div>
                    </div>

                    <div class="flex gap-2 mb-3">
                        <button 
                            type="button"
                            class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors boolean-exercise-clear-btn"
                            data-scenario-id="${scenarioId}"
                        >
                            Wissen
                        </button>
                        <button 
                            type="button"
                            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors boolean-exercise-validate-btn"
                            data-scenario-id="${scenarioId}"
                        >
                            Valideer query
                        </button>
                    </div>

                    <div id="${feedbackId}" class="hidden"></div>
                </div>
            `;
        }).join('');

        const html = `
            <div class="boolean-operator-exercise mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700" id="${exerciseId}">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${instruction}</p>
                
                <div class="space-y-4">
                    ${scenariosHtml}
                </div>
            </div>
        `;
        
        // Setup event listeners after DOM is ready (CSP blocks inline onclick)
        setTimeout(() => {
            AIRenderer.setupBooleanExerciseListeners(exerciseId);
        }, 100);
        
        return html;
    }
    
    /**
     * Setup event listeners for boolean operator exercise buttons
     * This is needed because CSP blocks inline onclick handlers
     * @param {string} exerciseId - ID of the exercise container
     */
    static setupBooleanExerciseListeners(exerciseId) {
        const exerciseContainer = document.getElementById(exerciseId);
        if (!exerciseContainer) {
            console.warn('[AIRenderer] Exercise container not found:', exerciseId);
            return;
        }
        
        // Setup buttons for adding terms/operators/parentheses
        const buttons = exerciseContainer.querySelectorAll('.boolean-exercise-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const scenarioId = button.getAttribute('data-scenario-id');
                const item = button.getAttribute('data-item');
                if (scenarioId && item) {
                    // Decode HTML entities
                    const decodedItem = item.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
                    AIRenderer.addToQuery(scenarioId, decodedItem);
                }
            });
        });
        
        // Setup clear button
        const clearButtons = exerciseContainer.querySelectorAll('.boolean-exercise-clear-btn');
        clearButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const scenarioId = button.getAttribute('data-scenario-id');
                if (scenarioId) {
                    AIRenderer.clearQuery(scenarioId);
                }
            });
        });
        
        // Setup validate button
        const validateButtons = exerciseContainer.querySelectorAll('.boolean-exercise-validate-btn');
        validateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const scenarioId = button.getAttribute('data-scenario-id');
                if (scenarioId) {
                    AIRenderer.validateQuery(scenarioId);
                }
            });
        });
    }

    /**
     * Add term or operator to query builder
     * @param {string} scenarioId - ID of the scenario container
     * @param {string} item - Term or operator to add
     */
    static addToQuery(scenarioId, item) {
        console.log('[AIRenderer] addToQuery called', scenarioId, item);
        
        // Decode HTML entities if present (browser should do this automatically, but just in case)
        if (typeof item === 'string') {
            item = item.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        }
        
        const queryBuilder = document.getElementById(`${scenarioId}-query-builder`);
        const queryDisplay = document.getElementById(`${scenarioId}-query-display`);
        
        if (!queryBuilder || !queryDisplay) {
            console.warn('[AIRenderer] Query builder or display not found', scenarioId);
            return;
        }

        let currentQuery = queryBuilder.value.trim();
        
        // If query is empty and item is an operator, don't add it
        if (!currentQuery && (item === 'AND' || item === 'OR' || item === 'NOT')) {
            return;
        }

        // If last character is an operator and new item is also an operator, replace it
        const lastChar = currentQuery.slice(-1);
        if ((lastChar === ' ' || lastChar === '(') && (item === 'AND' || item === 'OR' || item === 'NOT')) {
            // Can add operator after space or opening parenthesis
        } else if (currentQuery && !currentQuery.endsWith(' ') && !currentQuery.endsWith('(') && (item === 'AND' || item === 'OR' || item === 'NOT')) {
            // Add space before operator if needed
            currentQuery += ' ';
        }

        // Add the item
        if (item === 'AND' || item === 'OR' || item === 'NOT') {
            currentQuery += item;
        } else if (item === '(' || item === ')') {
            currentQuery += item;
        } else {
            // It's a term - add space before if needed (unless it's the first item or after opening parenthesis)
            if (currentQuery && !currentQuery.endsWith(' ') && !currentQuery.endsWith('(')) {
                currentQuery += ' ';
            }
            currentQuery += item;
        }

        queryBuilder.value = currentQuery;
        AIRenderer.updateQueryDisplay(scenarioId);
    }

    /**
     * Update visual display of query
     * @param {string} scenarioId - ID of the scenario container
     */
    static updateQueryDisplay(scenarioId) {
        const queryBuilder = document.getElementById(`${scenarioId}-query-builder`);
        const queryDisplay = document.getElementById(`${scenarioId}-query-display`);
        
        if (!queryBuilder || !queryDisplay) return;

        const query = queryBuilder.value.trim();
        
        if (!query) {
            queryDisplay.innerHTML = '<span class="text-sm text-gray-500 italic">Klik op termen en operatoren hieronder om je query te bouwen</span>';
            return;
        }

        // Parse query and create visual representation
        // Split by operators and parentheses, but preserve them
        const parts = query.split(/(\s+AND\s+|\s+OR\s+|\s+NOT\s+|\(|\))/g);
        
        const displayHtml = parts.map(part => {
            const trimmed = part.trim();
            if (!trimmed) return '';
            
            // Check for operators (with spaces)
            if (trimmed === 'AND' || trimmed.match(/^\s*AND\s*$/)) {
                return `<span class="px-2 py-1 bg-purple-200 text-purple-900 rounded font-bold text-sm">AND</span>`;
            } else if (trimmed === 'OR' || trimmed.match(/^\s*OR\s*$/)) {
                return `<span class="px-2 py-1 bg-purple-200 text-purple-900 rounded font-bold text-sm">OR</span>`;
            } else if (trimmed === 'NOT' || trimmed.match(/^\s*NOT\s*$/)) {
                return `<span class="px-2 py-1 bg-purple-200 text-purple-900 rounded font-bold text-sm">NOT</span>`;
            } else if (trimmed === '(') {
                return `<span class="px-1 text-gray-600 dark:text-gray-400 font-bold text-lg">(</span>`;
            } else if (trimmed === ')') {
                return `<span class="px-1 text-gray-600 dark:text-gray-400 font-bold text-lg">)</span>`;
            } else if (trimmed) {
                // It's a term (could be multi-word like "supply chain")
                return `<span class="px-2 py-1 bg-blue-200 text-blue-900 rounded font-medium text-sm">${trimmed}</span>`;
            }
            return '';
        }).filter(h => h).join('');

        queryDisplay.innerHTML = displayHtml || '<span class="text-sm text-gray-500 italic">Klik op termen en operatoren hieronder om je query te bouwen</span>';
    }

    /**
     * Clear query builder
     * @param {string} scenarioId - ID of the scenario container
     */
    static clearQuery(scenarioId) {
        console.log('[AIRenderer] clearQuery called', scenarioId);
        const queryBuilder = document.getElementById(`${scenarioId}-query-builder`);
        const feedback = document.getElementById(`${scenarioId}-feedback`);
        
        if (queryBuilder) {
            queryBuilder.value = '';
        }
        
        AIRenderer.updateQueryDisplay(scenarioId);
        
        if (feedback) {
            feedback.classList.add('hidden');
            feedback.innerHTML = '';
        }
    }

    /**
     * Validate query against correct answer
     * @param {string} scenarioId - ID of the scenario container
     */
    static validateQuery(scenarioId) {
        console.log('[AIRenderer] validateQuery called', scenarioId);
        const queryBuilder = document.getElementById(`${scenarioId}-query-builder`);
        const feedback = document.getElementById(`${scenarioId}-feedback`);
        const scenarioElement = document.querySelector(`[data-scenario-id="${scenarioId}"]`);
        
        if (!queryBuilder || !feedback || !scenarioElement) {
            console.warn('[AIRenderer] Missing elements for validation', { queryBuilder: !!queryBuilder, feedback: !!feedback, scenarioElement: !!scenarioElement });
            return;
        }

        const userQuery = queryBuilder.value.trim();
        const correctQuery = scenarioElement.getAttribute('data-correct-query');
        const explanation = scenarioElement.getAttribute('data-explanation');

        // Normalize queries for comparison (remove extra spaces, case insensitive)
        const normalizeQuery = (q) => {
            return q.replace(/\s+/g, ' ').trim().toUpperCase();
        };

        const normalizedUser = normalizeQuery(userQuery);
        const normalizedCorrect = normalizeQuery(correctQuery);

        feedback.classList.remove('hidden');

        if (normalizedUser === normalizedCorrect) {
            feedback.className = 'p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800';
            feedback.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-check-circle text-green-600 dark:text-green-400 text-lg mr-2 mt-0.5"></i>
                    <div>
                        <p class="text-sm font-semibold text-green-900 dark:text-green-200 mb-1">✓ Correct!</p>
                        <p class="text-sm text-green-800 dark:text-green-300">${HtmlUtils.escapeHtml(explanation)}</p>
                    </div>
                </div>
            `;
        } else {
            feedback.className = 'p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800';
            feedback.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-times-circle text-red-600 dark:text-red-400 text-lg mr-2 mt-0.5"></i>
                    <div>
                        <p class="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">Niet correct</p>
                        <p class="text-sm text-red-800 dark:text-red-300 mb-2">Je query: <code class="bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded">${HtmlUtils.escapeHtml(userQuery || '(leeg)')}</code></p>
                        <p class="text-sm text-red-800 dark:text-red-300 mb-2">Correcte query: <code class="bg-green-100 dark:bg-green-900/30 px-1 py-0.5 rounded">${HtmlUtils.escapeHtml(correctQuery)}</code></p>
                        <p class="text-sm text-red-800 dark:text-red-300">${HtmlUtils.escapeHtml(explanation)}</p>
                    </div>
                </div>
            `;
        }
    }

    // ==========================================
    // AI Query Exercise Methods
    // ==========================================

    /**
     * Render een AI query oefening
     * Laat studenten queries schrijven en krijgt AI feedback
     * @param {Object} item - AI query exercise item
     * @returns {string} HTML string
     */
    static renderAIQueryExercise(item) {
        const exerciseId = `ai-query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const title = item.title || 'Schrijf je eigen zoekquery';
        const instruction = item.instruction || 'Klik op "Nieuw scenario" om te beginnen.';
        const availableTerms = item.availableTerms || [];
        const generateFromTheory = item.generateFromTheory === true;

        const availableTermsStr = JSON.stringify(availableTerms);

        const html = `
            <div class="ai-query-exercise mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700" id="${exerciseId}" data-generate-from-theory="${generateFromTheory}" data-available-terms='${availableTermsStr}' data-scenario-count="0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${instruction}</p>
                
                <div id="${exerciseId}-scenario-container" class="hidden">
                    <div class="rounded mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
                        <div id="${exerciseId}-scenario-number" class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2"></div>
                        <p id="${exerciseId}-description" class="text-sm text-gray-700 dark:text-gray-300 mb-3"></p>
                        
                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Beschikbare zoektermen:</label>
                            <div id="${exerciseId}-terms-container" class="flex flex-wrap gap-2 mb-3">
                                ${availableTerms.map(term => {
                                    const escapedTerm = term.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                                    return `<button 
                                        type="button"
                                        class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs transition-colors cursor-pointer ai-query-btn"
                                        data-exercise-id="${exerciseId}"
                                        data-item="${escapedTerm}"
                                    >${term}</button>`;
                                }).join('')}
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Operatoren:</label>
                            <div class="flex flex-wrap gap-2 mb-3">
                                <button 
                                    type="button"
                                    class="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-xs font-semibold transition-colors cursor-pointer ai-query-btn"
                                    data-exercise-id="${exerciseId}"
                                    data-item="AND"
                                >AND</button>
                                <button 
                                    type="button"
                                    class="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-xs font-semibold transition-colors cursor-pointer ai-query-btn"
                                    data-exercise-id="${exerciseId}"
                                    data-item="OR"
                                >OR</button>
                                <button 
                                    type="button"
                                    class="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-xs font-semibold transition-colors cursor-pointer ai-query-btn"
                                    data-exercise-id="${exerciseId}"
                                    data-item="NOT"
                                >NOT</button>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Haakjes:</label>
                            <div class="flex flex-wrap gap-2 mb-3">
                                <button 
                                    type="button"
                                    class="px-3 py-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm font-bold transition-colors cursor-pointer ai-query-btn"
                                    data-exercise-id="${exerciseId}"
                                    data-item="("
                                >(</button>
                                <button 
                                    type="button"
                                    class="px-3 py-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm font-bold transition-colors cursor-pointer ai-query-btn"
                                    data-exercise-id="${exerciseId}"
                                    data-item=")"
                                >)</button>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jouw query:</label>
                            <input 
                                type="text" 
                                id="${exerciseId}-input"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Bijvoorbeeld: transport AND optimalisatie"
                            />
                        </div>

                        <div class="flex gap-2 mb-3">
                            <button 
                                type="button"
                                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors ai-query-validate-btn"
                                data-exercise-id="${exerciseId}"
                            >
                                Valideer met AI
                            </button>
                            <button 
                                type="button"
                                class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors ai-query-clear-btn"
                                data-exercise-id="${exerciseId}"
                            >
                                Wissen
                            </button>
                        </div>

                        <div id="${exerciseId}-loading" class="hidden mb-3">
                            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <i class="fas fa-spinner fa-spin mr-2"></i>
                                <span>AI analyseert je query...</span>
                            </div>
                        </div>

                        <div id="${exerciseId}-feedback" class="hidden"></div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button 
                        type="button"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ai-query-new-scenario-btn"
                        data-exercise-id="${exerciseId}"
                        id="${exerciseId}-new-scenario-btn"
                    >
                        <i class="fas fa-plus mr-2"></i>Nieuw scenario
                    </button>
                </div>
            </div>
        `;
        
        // Setup event listeners after DOM is ready (CSP blocks inline onclick)
        setTimeout(() => {
            AIRenderer.setupAIQueryExerciseListeners(exerciseId);
        }, 100);
        
        return html;
    }
    
    /**
     * Setup event listeners for AI query exercise buttons
     * This is needed because CSP blocks inline onclick handlers
     */
    static setupAIQueryExerciseListeners(exerciseId) {
        const exerciseContainer = document.getElementById(exerciseId);
        if (!exerciseContainer) {
            console.warn('[AIRenderer] AI query exercise container not found:', exerciseId);
            return;
        }
        
        // Setup buttons for adding terms/operators/parentheses (using event delegation)
        exerciseContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.ai-query-btn');
            if (button) {
                const exerciseIdFromBtn = button.getAttribute('data-exercise-id');
                const item = button.getAttribute('data-item');
                if (exerciseIdFromBtn === exerciseId && item) {
                    // Decode HTML entities
                    const decodedItem = item.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
                    AIRenderer.addToAIQuery(exerciseId, decodedItem);
                }
            }
            
            // Handle validate button
            const validateBtn = e.target.closest('.ai-query-validate-btn');
            if (validateBtn) {
                const exerciseIdFromBtn = validateBtn.getAttribute('data-exercise-id');
                if (exerciseIdFromBtn === exerciseId) {
                    AIRenderer.validateAIQuery(exerciseId);
                }
            }
            
            // Handle clear button
            const clearBtn = e.target.closest('.ai-query-clear-btn');
            if (clearBtn) {
                const exerciseIdFromBtn = clearBtn.getAttribute('data-exercise-id');
                if (exerciseIdFromBtn === exerciseId) {
                    AIRenderer.clearAIQuery(exerciseId);
                }
            }
            
            // Handle new scenario button
            const newScenarioBtn = e.target.closest('.ai-query-new-scenario-btn');
            if (newScenarioBtn) {
                const exerciseIdFromBtn = newScenarioBtn.getAttribute('data-exercise-id');
                if (exerciseIdFromBtn === exerciseId) {
                    AIRenderer.loadNewAIQueryScenario(exerciseId);
                }
            }
        });
    }

    /**
     * Load a new AI-generated query scenario
     */
    static async loadNewAIQueryScenario(exerciseId) {
        const exerciseElement = document.getElementById(exerciseId);
        const container = document.getElementById(`${exerciseId}-scenario-container`);
        const newBtn = document.getElementById(`${exerciseId}-new-scenario-btn`);
        const descriptionEl = document.getElementById(`${exerciseId}-description`);
        const scenarioNumberEl = document.getElementById(`${exerciseId}-scenario-number`);
        const input = document.getElementById(`${exerciseId}-input`);
        const feedback = document.getElementById(`${exerciseId}-feedback`);
        const loading = document.getElementById(`${exerciseId}-loading`);

        if (!exerciseElement || !container) {
            console.warn('[AIRenderer] AI query exercise elements not found', exerciseId);
            return;
        }

        const generateFromTheory = exerciseElement.getAttribute('data-generate-from-theory') === 'true';
        const availableTerms = JSON.parse(exerciseElement.getAttribute('data-available-terms') || '[]');

        // Disable button and show loading
        if (newBtn) {
            newBtn.disabled = true;
            newBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Genereert scenario...';
        }

        try {
            let scenarioData;

            if (generateFromTheory) {
                // Get theory content from page
                let theoryContent = AIRenderer.extractTheoryContent();
                console.log('[AIRenderer] Extracted theory content length:', theoryContent?.length || 0);
                console.log('[AIRenderer] Extracted theory content preview:', theoryContent?.substring(0, 200) || 'empty');
                
                if (!theoryContent || theoryContent.trim().length === 0) {
                    console.error('[AIRenderer] No theory content found');
                    throw new Error('Geen theorie content gevonden op de pagina');
                }

                // Truncate theory content to max 5000 characters (API limit)
                // Try to truncate at a sentence boundary if possible
                if (theoryContent.length > 5000) {
                    console.log('[AIRenderer] Truncating theory content from', theoryContent.length, 'to 5000 characters');
                    let truncated = theoryContent.substring(0, 5000);
                    // Try to find the last sentence boundary
                    const lastPeriod = truncated.lastIndexOf('.');
                    const lastExclamation = truncated.lastIndexOf('!');
                    const lastQuestion = truncated.lastIndexOf('?');
                    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
                    if (lastSentenceEnd > 4000) { // Only truncate at sentence if it's not too short
                        truncated = truncated.substring(0, lastSentenceEnd + 1);
                    }
                    theoryContent = truncated;
                    console.log('[AIRenderer] Truncated theory content length:', theoryContent.length);
                }

                // Get current scenario count
                const currentCount = parseInt(exerciseElement.getAttribute('data-scenario-count') || '0');
                
                // Limit to 5 scenarios
                if (currentCount >= 5) {
                    alert('Je hebt al 5 scenario\'s geoefend! Probeer de oefening opnieuw te laden voor meer scenario\'s.');
                    if (newBtn) {
                        newBtn.disabled = false;
                        newBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Nieuw scenario';
                    }
                    return;
                }
                
                console.log('[AIRenderer] Sending request to /api/generate-query-scenario (scenario:', currentCount + 1, ')');
                const response = await fetch('/api/generate-query-scenario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        theoryContent,
                        availableTerms,
                        scenarioCount: currentCount
                    })
                });
                
                console.log('[AIRenderer] Response status:', response.status);

                // Check if response is ok before parsing JSON
                if (!response.ok) {
                    let errorMessage = 'Server error';
                    let errorDetails = null;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorData.error || 'Server error';
                        errorDetails = errorData.errors || errorData.details;
                        console.error('[AIRenderer] API error response:', errorData);
                    } catch (parseError) {
                        // If response is not JSON, try to get text
                        try {
                            const errorText = await response.text();
                            errorMessage = errorText || 'Server error';
                            console.error('[AIRenderer] API error text:', errorText);
                        } catch (textError) {
                            errorMessage = `Server returned status ${response.status}`;
                            console.error('[AIRenderer] Failed to parse error response');
                        }
                    }
                    
                    // Show more detailed error message if available
                    if (errorDetails && Array.isArray(errorDetails) && errorDetails.length > 0) {
                        const validationErrors = errorDetails.map(e => e.msg || e.message).join(', ');
                        throw new Error(`Validatiefout: ${validationErrors}`);
                    }
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                scenarioData = data;
            } else {
                // Fallback: use predefined scenarios
                const scenarios = [
                    { description: "Je zoekt naar artikelen die zowel over transport als over optimalisatie gaan.", correctQuery: "transport AND optimalisatie", explanation: "De AND-operator zorgt ervoor dat beide termen in de resultaten moeten voorkomen." },
                    { description: "Je zoekt naar artikelen die over logistiek of warehouse gaan.", correctQuery: "logistiek OR warehouse", explanation: "De OR-operator zorgt ervoor dat minstens één van de termen in de resultaten voorkomt." },
                    { description: "Je zoekt naar artikelen over transport, maar niet over luchtvaart.", correctQuery: "transport NOT luchtvaart", explanation: "De NOT-operator sluit artikelen uit die de term 'luchtvaart' bevatten." }
                ];
                scenarioData = scenarios[Math.floor(Math.random() * scenarios.length)];
            }

            // Update scenario number
            const scenarioCount = parseInt(exerciseElement.getAttribute('data-scenario-count') || '0') + 1;
            exerciseElement.setAttribute('data-scenario-count', scenarioCount);
            exerciseElement.setAttribute('data-current-description', scenarioData.description);
            exerciseElement.setAttribute('data-current-correct-query', scenarioData.correctQuery || '');

            // Update UI
            if (scenarioNumberEl) scenarioNumberEl.textContent = `Scenario ${scenarioCount}`;
            if (descriptionEl) descriptionEl.textContent = scenarioData.description;
            if (input) input.value = '';
            if (feedback) {
                feedback.classList.add('hidden');
                feedback.innerHTML = '';
            }
            if (loading) loading.classList.add('hidden');
            
            // Update available terms display - only show terms used in this scenario
            const scenarioTerms = scenarioData.availableTerms || availableTerms;
            const termsContainer = document.getElementById(`${exerciseId}-terms-container`);
            if (termsContainer && scenarioTerms.length > 0) {
                termsContainer.innerHTML = scenarioTerms.map(term => {
                    const escapedTerm = term.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                    return `<button 
                        type="button"
                        class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs transition-colors cursor-pointer ai-query-btn"
                        data-exercise-id="${exerciseId}"
                        data-item="${escapedTerm}"
                    >${term}</button>`;
                }).join('');
            }
            
            container.classList.remove('hidden');

        } catch (error) {
            console.error('[AIRenderer] Error loading scenario:', error);
            alert('Er is een fout opgetreden bij het genereren van een nieuw scenario. Probeer het opnieuw.');
        } finally {
            if (newBtn) {
                newBtn.disabled = false;
                newBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Nieuw scenario';
            }
        }
    }

    /**
     * Extract theory content from the page
     */
    static extractTheoryContent() {
        console.log('[AIRenderer] extractTheoryContent Starting extraction...');
        
        // Strategy 1: Find section with "Theorie" heading and get .prose content
        const sections = document.querySelectorAll('section');
        console.log('[AIRenderer] extractTheoryContent Found', sections.length, 'sections');
        
        for (const section of sections) {
            const heading = section.querySelector('h2');
            if (heading) {
                const headingText = heading.textContent.trim();
                console.log('[AIRenderer] extractTheoryContent Checking section with heading:', headingText.substring(0, 50));
                
                if (headingText.toLowerCase().includes('theorie')) {
                    console.log('[AIRenderer] extractTheoryContent Found Theorie section!');
                    const prose = section.querySelector('.prose');
                    if (prose) {
                        const content = prose.innerText || prose.textContent || '';
                        console.log('[AIRenderer] extractTheoryContent Found prose content, length:', content.length);
                        if (content.trim().length > 0) {
                            return content;
                        }
                    }
                    // If no prose, get all text from section (but exclude heading)
                    const sectionContent = section.innerText || section.textContent || '';
                    console.log('[AIRenderer] extractTheoryContent Using full section content, length:', sectionContent.length);
                    if (sectionContent.trim().length > 0) {
                        return sectionContent;
                    }
                }
            }
        }
        
        // Strategy 2: Try to find by class or data attribute
        const theorySection = document.querySelector('.theorie-content, [data-theory-content]');
        if (theorySection) {
            const content = theorySection.innerText || theorySection.textContent || '';
            console.log('[AIRenderer] extractTheoryContent Found by class/data-attr, length:', content.length);
            return content;
        }
        
        // Strategy 3: Get all text from main content area
        const mainContent = document.querySelector('main, .content, .lesson-content');
        if (mainContent) {
            const clone = mainContent.cloneNode(true);
            clone.querySelectorAll('button, nav, .sidebar, header, footer, script, style').forEach(el => el.remove());
            const content = clone.innerText || clone.textContent || '';
            console.log('[AIRenderer] extractTheoryContent Using main content, length:', content.length);
            if (content.trim().length > 0) {
                return content;
            }
        }
        
        // Strategy 4: Get all visible text from body (last resort)
        const bodyClone = document.body.cloneNode(true);
        bodyClone.querySelectorAll('button, nav, .sidebar, header, footer, script, style, .navbar, .menu').forEach(el => el.remove());
        const bodyContent = bodyClone.innerText || bodyClone.textContent || '';
        console.log('[AIRenderer] extractTheoryContent Using body content as last resort, length:', bodyContent.length);
        
        return bodyContent || '';
    }

    /**
     * Validate query with AI feedback
     */
    static async validateAIQuery(exerciseId) {
        const exerciseElement = document.getElementById(exerciseId);
        const input = document.getElementById(`${exerciseId}-input`);
        const feedback = document.getElementById(`${exerciseId}-feedback`);
        const loading = document.getElementById(`${exerciseId}-loading`);

        if (!exerciseElement || !input || !feedback) {
            console.warn('[AIRenderer] AI query elements not found', exerciseId);
            return;
        }

        const userQuery = input.value.trim();
        if (!userQuery) {
            alert('Voer eerst een query in voordat je valideert.');
            return;
        }

        const description = exerciseElement.getAttribute('data-current-description');
        const correctQuery = exerciseElement.getAttribute('data-current-correct-query');
        const availableTerms = JSON.parse(exerciseElement.getAttribute('data-available-terms') || '[]');

        if (!description) {
            alert('Er is geen actief scenario. Klik eerst op "Nieuw scenario".');
            return;
        }

        // Show loading
        loading.classList.remove('hidden');
        feedback.classList.add('hidden');
        input.disabled = true;

        try {
            const response = await fetch('/api/validate-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    description, 
                    userQuery, 
                    availableTerms,
                    correctQuery: correctQuery || null
                })
            });

            // Check if response is ok before parsing JSON
            if (!response.ok) {
                let errorMessage = 'Server error';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || 'Server error';
                } catch (parseError) {
                    // If response is not JSON, try to get text
                    try {
                        const errorText = await response.text();
                        errorMessage = errorText || 'Server error';
                    } catch (textError) {
                        errorMessage = `Server returned status ${response.status}`;
                    }
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            loading.classList.add('hidden');
            input.disabled = false;
            feedback.classList.remove('hidden');

            if (data.isCorrect) {
                feedback.className = 'p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800';
                feedback.innerHTML = `
                    <div class="flex items-start">
                        <i class="fas fa-check-circle text-green-600 dark:text-green-400 text-lg mr-2 mt-0.5"></i>
                        <div>
                            <p class="text-sm font-semibold text-green-900 dark:text-green-200 mb-1">✓ Correct!</p>
                            <p class="text-sm text-green-800 dark:text-green-300">${HtmlUtils.escapeHtml(data.feedback || data.explanation)}</p>
                        </div>
                    </div>
                `;
            } else {
                feedback.className = 'p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800';
                feedback.innerHTML = `
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-circle text-yellow-600 dark:text-yellow-400 text-lg mr-2 mt-0.5"></i>
                        <div>
                            <p class="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">Feedback</p>
                            <p class="text-sm text-yellow-800 dark:text-yellow-300 mb-2">${HtmlUtils.escapeHtml(data.feedback || data.explanation)}</p>
                            ${data.suggestedQuery ? `
                                <p class="text-sm text-yellow-800 dark:text-yellow-300">
                                    <strong>Suggestie:</strong> <code class="bg-yellow-100 dark:bg-yellow-900/30 px-1 py-0.5 rounded">${HtmlUtils.escapeHtml(data.suggestedQuery)}</code>
                                </p>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('[AIRenderer] Error validating AI query:', error);
            loading.classList.add('hidden');
            input.disabled = false;
            feedback.classList.remove('hidden');
            feedback.className = 'p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800';
            feedback.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-times-circle text-red-600 dark:text-red-400 text-lg mr-2 mt-0.5"></i>
                    <div>
                        <p class="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">Fout</p>
                        <p class="text-sm text-red-800 dark:text-red-300">Er is een fout opgetreden bij het valideren van je query. Probeer het opnieuw.</p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Add term or operator to AI query input field
     */
    static addToAIQuery(exerciseId, item) {
        console.log('[AIRenderer] addToAIQuery called', exerciseId, item);
        
        // Decode HTML entities if present
        if (typeof item === 'string') {
            item = item.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        }
        
        const input = document.getElementById(`${exerciseId}-input`);
        
        if (!input) {
            console.warn('[AIRenderer] Input field not found', exerciseId);
            return;
        }

        let currentQuery = input.value.trim();
        
        // If query is empty and item is an operator, don't add it
        if (!currentQuery && (item === 'AND' || item === 'OR' || item === 'NOT')) {
            return;
        }

        // If last character is an operator and new item is also an operator, replace it
        const lastChar = currentQuery.slice(-1);
        if ((lastChar === ' ' || lastChar === '(') && (item === 'AND' || item === 'OR' || item === 'NOT')) {
            // Can add operator after space or opening parenthesis
        } else if (currentQuery && !currentQuery.endsWith(' ') && !currentQuery.endsWith('(') && (item === 'AND' || item === 'OR' || item === 'NOT')) {
            // Add space before operator if needed
            currentQuery += ' ';
        }

        // Add the item
        if (item === 'AND' || item === 'OR' || item === 'NOT') {
            currentQuery += item;
        } else if (item === '(' || item === ')') {
            currentQuery += item;
        } else {
            // It's a term - add space before if needed (unless it's the first item or after opening parenthesis)
            if (currentQuery && !currentQuery.endsWith(' ') && !currentQuery.endsWith('(')) {
                currentQuery += ' ';
            }
            currentQuery += item;
        }

        input.value = currentQuery;
        
        // Focus the input field so user can continue typing
        input.focus();
    }

    /**
     * Clear AI query input
     */
    static clearAIQuery(exerciseId) {
        const input = document.getElementById(`${exerciseId}-input`);
        const feedback = document.getElementById(`${exerciseId}-feedback`);
        const loading = document.getElementById(`${exerciseId}-loading`);

        if (input) input.value = '';
        if (feedback) {
            feedback.classList.add('hidden');
            feedback.innerHTML = '';
        }
        if (loading) loading.classList.add('hidden');
    }

    // ==========================================
    // AI Bouwsteen Generator Methods
    // ==========================================

    /**
     * Render AI Bouwsteen Generator tool
     * Laat studenten een zoekwoord en context invoeren en genereert een bouwsteentabel
     * @param {Object} item - AI Bouwsteen Generator item
     * @returns {string} HTML string
     */
    static renderAIBouwsteenGenerator(item) {
        const generatorId = `ai-bouwsteen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const html = `
            <div class="ai-bouwsteen-generator mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" id="${generatorId}" style="pointer-events: auto;">
                <!-- Tool Header -->
                <div class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tool: AI Bouwsteen Generator</h3>
                    <button 
                        type="button"
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors ai-bouwsteen-close-btn"
                        data-generator-id="${generatorId}"
                        aria-label="Sluiten"
                    >
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <!-- Tool Content -->
                <div class="p-6">
                    <!-- Title -->
                    <div class="flex items-center mb-4">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-pencil-alt text-blue-600 dark:text-blue-400"></i>
                            <h4 class="text-xl font-bold text-blue-600 dark:text-blue-400">AI Bouwsteen Generator</h4>
                        </div>
                    </div>
                    
                    <!-- Description -->
                    <p class="text-gray-700 dark:text-gray-300 mb-6">
                        Gebruik deze tool om inspiratie op te doen voor je bouwsteentabel. Vul een zoekwoord in en krijg suggesties voor synoniemen, vertalingen en gerelateerde termen.
                    </p>
                    
                    <!-- Input Fields -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label for="${generatorId}-keyword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Zoekwoord <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="${generatorId}-keyword"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Bijv. Logistiek"
                                autocomplete="off"
                                style="pointer-events: auto; cursor: text;"
                            />
                        </div>
                        <div>
                            <label for="${generatorId}-context" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Context (optioneel)
                            </label>
                            <input 
                                type="text" 
                                id="${generatorId}-context"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Bijv. Binnen de zorgsector"
                                autocomplete="off"
                                style="pointer-events: auto; cursor: text;"
                            />
                        </div>
                    </div>
                    
                    <!-- Generate Button -->
                    <div class="flex justify-center mb-6">
                        <button 
                            type="button"
                            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center space-x-2 ai-bouwsteen-generate-btn"
                            data-generator-id="${generatorId}"
                        >
                            <i class="fas fa-cog"></i>
                            <span>Genereer Tabel</span>
                        </button>
                    </div>
                    
                    <!-- Loading State -->
                    <div id="${generatorId}-loading" class="hidden mb-6">
                        <div class="flex items-center justify-center text-gray-600 dark:text-gray-400">
                            <i class="fas fa-spinner fa-spin mr-2"></i>
                            <span>Bezig met genereren...</span>
                        </div>
                    </div>
                    
                    <!-- Result Section -->
                    <div id="${generatorId}-result" class="hidden">
                        <div class="flex items-center justify-between mb-4">
                            <h5 class="text-lg font-semibold text-gray-900 dark:text-white">Resultaat</h5>
                            <button 
                                type="button"
                                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition-colors ai-bouwsteen-copy-result-btn"
                                data-generator-id="${generatorId}"
                            >
                                <i class="fas fa-copy mr-2"></i>Kopieer tabel
                            </button>
                        </div>
                        
                        <div id="${generatorId}-result-table" class="overflow-x-auto mb-4"></div>
                        
                        <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Gegenereerd met AI - controleer altijd de resultaten.
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        // Setup event listeners after DOM is ready
        // Use requestAnimationFrame to ensure DOM is fully rendered
        
        requestAnimationFrame(() => {
            setTimeout(() => {
                
                AIRenderer.setupAIBouwsteenGeneratorListeners(generatorId);
                
                // Ensure inputs are focusable and clickable
                const keywordInput = document.getElementById(`${generatorId}-keyword`);
                const contextInput = document.getElementById(`${generatorId}-context`);
                
                [keywordInput, contextInput].forEach(input => {
                    if (input) {
                        // Remove any blocking attributes
                        input.removeAttribute('readonly');
                        input.removeAttribute('disabled');
                        
                        // Ensure pointer events are enabled
                        input.style.pointerEvents = 'auto';
                        input.style.cursor = 'text';
                        input.style.userSelect = 'text';
                        
                        // Remove any event listeners that might block
                        input.onclick = null;
                        input.onmousedown = null;
                        
                        // Make sure tabindex allows focus
                        if (!input.hasAttribute('tabindex')) {
                            input.setAttribute('tabindex', '0');
                        }
                        
                        // Force enable the input
                        input.disabled = false;
                        input.readOnly = false;
                        
                        // Don't test focus() here - it causes automatic scrolling to the element
                        // The inputs will work fine without this test, and users can click/focus them when needed
                    }
                });
                
                // If there's no hash in the URL, ensure we stay at the top of the page
                // This prevents any accidental scrolling that might have occurred during setup
                if (!window.location.hash || window.location.hash === '#' || window.location.hash.trim() === '') {
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        // Use requestAnimationFrame to ensure this happens after any potential scroll
                        requestAnimationFrame(() => {
                            if (mainContent.scrollTop > 0) {
                                mainContent.scrollTo({ top: 0, behavior: 'instant' });
                            }
                        });
                    }
                }
            }, 100);
        });
        
        return html;
    }
    
    /**
     * Setup event listeners for AI Bouwsteen Generator
     */
    static setupAIBouwsteenGeneratorListeners(generatorId) {
        
        const generatorContainer = document.getElementById(generatorId);
        
        if (!generatorContainer) {
            console.warn('[AIRenderer] ⚠️ AI Bouwsteen Generator container not found:', generatorId);
            console.warn('[AIRenderer] Available elements with "ai-bouwsteen" in ID:', 
                Array.from(document.querySelectorAll('[id*="ai-bouwsteen"]')).map(el => el.id));
            console.warn('[AIRenderer] Document ready state:', document.readyState);
            console.warn('[AIRenderer] Will retry in 500ms...');
            // Retry after a delay - DOM might not be ready yet
            setTimeout(() => {
                console.log('[AIRenderer] Retrying setupAIBouwsteenGeneratorListeners for:', generatorId);
                AIRenderer.setupAIBouwsteenGeneratorListeners(generatorId);
            }, 500);
            return;
        }
        
        // Generate button
        const generateBtn = generatorContainer.querySelector('.ai-bouwsteen-generate-btn');
        
        if (generateBtn) {
            // Remove any existing listeners to prevent duplicates
            const newBtn = generateBtn.cloneNode(true);
            generateBtn.parentNode.replaceChild(newBtn, generateBtn);
            
            // Mark as having listener attached
            newBtn.dataset.listenersAttached = 'true';
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                AIRenderer.generateBouwsteenTabel(generatorId);
            });
        }
        
        // Close button - collapse content instead of removing
        const closeBtn = generatorContainer.querySelector('.ai-bouwsteen-close-btn');
        const toolContent = generatorContainer.querySelector('.p-6') || generatorContainer.querySelector('[class*="p-6"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // Find the content div (the one with class p-6)
                const contentDiv = generatorContainer.querySelector('div.p-6');
                if (contentDiv) {
                    // Toggle visibility instead of removing
                    const isHidden = contentDiv.style.display === 'none' || contentDiv.classList.contains('hidden');
                    if (isHidden) {
                        // Show
                        contentDiv.style.display = '';
                        contentDiv.classList.remove('hidden');
                        closeBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
                        closeBtn.setAttribute('aria-label', 'Sluiten');
                    } else {
                        // Hide
                        contentDiv.style.display = 'none';
                        contentDiv.classList.add('hidden');
                        closeBtn.innerHTML = '<i class="fas fa-chevron-down text-xl"></i>';
                        closeBtn.setAttribute('aria-label', 'Openen');
                    }
                }
            });
        }
        
        // Copy button (only the one in result section)
        const copyBtn = generatorContainer.querySelector('.ai-bouwsteen-copy-result-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                AIRenderer.copyBouwsteenTabel(generatorId);
            });
        }
        
        // Allow Enter key to trigger generation
        const keywordInput = document.getElementById(`${generatorId}-keyword`);
        const contextInput = document.getElementById(`${generatorId}-context`);
        
        [keywordInput, contextInput].forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && generateBtn) {
                        generateBtn.click();
                    }
                });
            }
        });
    }
    
    /**
     * Generate bouwsteen tabel using AI
     */
    static async generateBouwsteenTabel(generatorId) {
        
        const keywordInput = document.getElementById(`${generatorId}-keyword`);
        const contextInput = document.getElementById(`${generatorId}-context`);
        const loadingEl = document.getElementById(`${generatorId}-loading`);
        const resultEl = document.getElementById(`${generatorId}-result`);
        const resultTableEl = document.getElementById(`${generatorId}-result-table`);
        
        if (!keywordInput || !loadingEl || !resultEl || !resultTableEl) {
            
            console.warn('[AIRenderer] AI Bouwsteen Generator elements not found');
            return;
        }
        
        const keyword = keywordInput.value.trim();
        if (!keyword) {
            alert('Vul een zoekwoord in');
            keywordInput.focus();
            return;
        }
        
        const context = contextInput ? contextInput.value.trim() : '';
        
        // Show loading
        loadingEl.classList.remove('hidden');
        resultEl.classList.add('hidden');
        
        try {
            // Detect environment for better error messages
            const isVercel = window.location.hostname.includes('vercel.app');
            const apiUrl = '/api/generate-bouwsteen-tabel';

            console.log('[AIRenderer] Generating bouwsteen tabel, environment:', isVercel ? 'Vercel' : 'Local');
            console.log('[AIRenderer] API URL:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword, context })
            });

            if (!response.ok) {
                // Try to get error message from response
                let errorMessage = `Server error: ${response.status}`;
                let errorData = null;
                try {
                    errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                    if (errorData.details) {
                        console.error('[AIRenderer] Server error details:', errorData.details);
                    }
                } catch (parseError) {
                    // If response is not JSON, use status text
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                
                // Check for QUOTA_EXCEEDED error
                if (response.status === 429 || (errorData && errorData.error === 'QUOTA_EXCEEDED')) {
                    // Show friendly quota exceeded message with orange styling
                    loadingEl.classList.add('hidden');
                    resultEl.classList.remove('hidden');
                    resultTableEl.innerHTML = `
                        <div class="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-info-circle text-orange-600 dark:text-orange-400 mt-1"></i>
                                <div>
                                    <h3 class="font-semibold text-orange-900 dark:text-orange-200 mb-1">AI-coach daglimiet bereikt</h3>
                                    <p class="text-orange-800 dark:text-orange-300 text-sm">De AI-coach heeft zijn daglimiet bereikt. Probeer het morgen opnieuw of ga zelf aan de slag met de theorie.</p>
                                </div>
                            </div>
                        </div>
                    `;
                    return;
                }
                
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            
            if (!data.success || !data.table) {
                // Check if it's a QUOTA_EXCEEDED error
                if (data.error === 'QUOTA_EXCEEDED') {
                    // Show friendly quota exceeded message with orange styling
                    loadingEl.classList.add('hidden');
                    resultEl.classList.remove('hidden');
                    resultTableEl.innerHTML = `
                        <div class="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-info-circle text-orange-600 dark:text-orange-400 mt-1"></i>
                                <div>
                                    <h3 class="font-semibold text-orange-900 dark:text-orange-200 mb-1">AI-coach daglimiet bereikt</h3>
                                    <p class="text-orange-800 dark:text-orange-300 text-sm">De AI-coach heeft zijn daglimiet bereikt. Probeer het morgen opnieuw of ga zelf aan de slag met de theorie.</p>
                                </div>
                            </div>
                        </div>
                    `;
                    return;
                }
                throw new Error(data.message || 'Failed to generate table');
            }
            
            // Render table
            const tableHtml = AIRenderer.renderBouwsteenTabel(data.table);
            resultTableEl.innerHTML = tableHtml;
            
            // Show result
            loadingEl.classList.add('hidden');
            resultEl.classList.remove('hidden');
            
        } catch (error) {
            
            console.error('[AIRenderer] Error generating bouwsteen tabel:', error);
            loadingEl.classList.add('hidden');
            
            // Check if it's a QUOTA_EXCEEDED error
            if (error.message.includes('QUOTA_EXCEEDED') || error.message.includes('429') || error.message.includes('quota exceeded')) {
                // Show friendly quota exceeded message with orange styling
                resultEl.classList.remove('hidden');
                resultTableEl.innerHTML = `
                    <div class="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                        <div class="flex items-start space-x-3">
                            <i class="fas fa-info-circle text-orange-600 dark:text-orange-400 mt-1"></i>
                            <div>
                                <h3 class="font-semibold text-orange-900 dark:text-orange-200 mb-1">AI-coach daglimiet bereikt</h3>
                                <p class="text-orange-800 dark:text-orange-300 text-sm">De AI-coach heeft zijn daglimiet bereikt. Probeer het morgen opnieuw of ga zelf aan de slag met de theorie.</p>
                            </div>
                        </div>
                    </div>
                `;
                return;
            }
            
            // Get more detailed error message
            const isVercel = window.location.hostname.includes('vercel.app');
            let errorMessage = 'Er is een fout opgetreden bij het genereren van de tabel.';
            
            if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                if (isVercel) {
                    errorMessage = 'Kan niet verbinden met de API server. Controleer of GEMINI_API_KEY is ingesteld in Vercel environment variables.';
                } else {
                    errorMessage = 'Kan niet verbinden met de server. Zorg ervoor dat de server draait op http://localhost:3000';
                }
            } else if (error.message) {
                errorMessage += `\n\nFout: ${error.message}`;
            }
            
            // Show error in UI instead of alert
            resultEl.classList.remove('hidden');
            resultTableEl.innerHTML = `
                <div class="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 mt-1"></i>
                        <div>
                            <h3 class="font-semibold text-red-900 dark:text-red-200 mb-1">Fout bij genereren</h3>
                            <p class="text-red-800 dark:text-red-300 text-sm">${errorMessage}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Render bouwsteen tabel from data
     */
    static renderBouwsteenTabel(tableData) {
        const categories = [
            { key: 'synoniemen', label: 'Synoniemen' },
            { key: 'vertalingen', label: 'Vertalingen' },
            { key: 'afkortingen', label: 'Afkortingen' },
            { key: 'spellingsvormen', label: 'Spellingsvormen' },
            { key: 'vaktermen', label: 'Vaktermen' },
            { key: 'bredereTermen', label: 'Bredere termen' },
            { key: 'nauwereTermen', label: 'Nauwere termen' }
        ];
        
        let tableHtml = `
            <div class="overflow-x-auto">
                <table class="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                    <thead class="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th class="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">CATEGORIE</th>
                            <th class="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">SUGGESTIES</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        categories.forEach(category => {
            const items = tableData[category.key] || [];
            const itemsHtml = items.length > 0 
                ? items.map(item => `<span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md text-sm mr-2 mb-2">${HtmlUtils.escapeHtml(item)}</span>`).join('')
                : '<span class="text-gray-400 dark:text-gray-500 italic">Geen suggesties</span>';
            
            tableHtml += `
                <tr class="bg-white dark:bg-gray-800">
                    <td class="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">${category.label}</td>
                    <td class="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        <div class="flex flex-wrap">${itemsHtml}</div>
                    </td>
                </tr>
            `;
        });
        
        tableHtml += `
                    </tbody>
                </table>
            </div>
        `;
        
        return tableHtml;
    }
    
    /**
     * Copy bouwsteen tabel to clipboard
     */
    static async copyBouwsteenTabel(generatorId) {
        const resultTableEl = document.getElementById(`${generatorId}-result-table`);
        const copyBtn = document.querySelector(`[data-generator-id="${generatorId}"].ai-bouwsteen-copy-result-btn`);
        
        if (!resultTableEl) {
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Geen tabel gevonden';
                copyBtn.classList.remove('bg-gray-100', 'hover:bg-gray-200', 'dark:bg-gray-700', 'dark:hover:bg-gray-600');
                copyBtn.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white');
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('bg-red-500', 'hover:bg-red-600', 'text-white');
                    copyBtn.classList.add('bg-gray-100', 'hover:bg-gray-200', 'dark:bg-gray-700', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
                }, 2000);
            }
            return;
        }
        
        const table = resultTableEl.querySelector('table');
        if (!table) {
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Geen tabel gevonden';
                copyBtn.classList.remove('bg-gray-100', 'hover:bg-gray-200', 'dark:bg-gray-700', 'dark:hover:bg-gray-600');
                copyBtn.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white');
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('bg-red-500', 'hover:bg-red-600', 'text-white');
                    copyBtn.classList.add('bg-gray-100', 'hover:bg-gray-200', 'dark:bg-gray-700', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
                }, 2000);
            }
            return;
        }
        
        try {
            // Clone the table to preserve structure
            const tableClone = table.cloneNode(true);
            
            // Add inline styles to preserve formatting
            tableClone.style.borderCollapse = 'collapse';
            tableClone.style.width = '100%';
            tableClone.style.border = '1px solid #d1d5db';
            
            // Style thead
            const thead = tableClone.querySelector('thead');
            if (thead) {
                thead.style.backgroundColor = '#f3f4f6';
                const ths = thead.querySelectorAll('th');
                ths.forEach(th => {
                    th.style.border = '1px solid #d1d5db';
                    th.style.padding = '12px 16px';
                    th.style.textAlign = 'left';
                    th.style.fontWeight = '600';
                    th.style.fontSize = '14px';
                    th.style.color = '#111827';
                    th.style.backgroundColor = '#f3f4f6';
                });
            }
            
            // Style tbody rows
            const tbody = tableClone.querySelector('tbody');
            if (tbody) {
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    row.style.backgroundColor = '#ffffff';
                    const tds = row.querySelectorAll('td');
                    tds.forEach((td, index) => {
                        td.style.border = '1px solid #d1d5db';
                        td.style.padding = '12px 16px';
                        td.style.fontSize = '14px';
                        if (index === 0) {
                            td.style.fontWeight = '500';
                            td.style.color = '#111827';
                        } else {
                            td.style.color = '#374151';
                            
                            // For the suggestions column, add separators between spans
                            const spans = td.querySelectorAll('span');
                            if (spans.length > 0) {
                                // Clear the cell content and rebuild with separators
                                const spansArray = Array.from(spans);
                                const fragment = document.createDocumentFragment();
                                
                                spansArray.forEach((span, spanIndex) => {
                                    // Style each span
                                    span.style.display = 'inline-block';
                                    span.style.padding = '4px 12px';
                                    span.style.backgroundColor = '#dbeafe';
                                    span.style.color = '#1e40af';
                                    span.style.borderRadius = '6px';
                                    span.style.fontSize = '14px';
                                    span.style.marginRight = '8px';
                                    span.style.marginBottom = '8px';
                                    
                                    fragment.appendChild(span);
                                    
                                    // Add comma and space separator after each span (except the last)
                                    if (spanIndex < spansArray.length - 1) {
                                        const separator = document.createTextNode(', ');
                                        fragment.appendChild(separator);
                                    }
                                });
                                
                                // Replace cell content with the fragment
                                td.innerHTML = '';
                                td.appendChild(fragment);
                            }
                        }
                    });
                });
            }
            
            // Create HTML with table and disclaimer
            const disclaimer = '<p style="margin-top: 16px; font-size: 12px; color: #6b7280; text-align: center;">Gegenereerd met AI - controleer altijd de resultaten.</p>';
            const htmlContent = tableClone.outerHTML + disclaimer;
            
            // Create plain text fallback
            const rows = table.querySelectorAll('tbody tr');
            let text = 'CATEGORIE\tSUGGESTIES\n';
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const category = cells[0].textContent.trim();
                    const suggestions = Array.from(cells[1].querySelectorAll('span'))
                        .map(span => span.textContent.trim())
                        .filter(text => text && !text.includes('Geen suggesties'))
                        .join(', ');
                    
                    text += `${category}\t${suggestions || 'Geen suggesties'}\n`;
                }
            });
            text += '\nGegenereerd met AI - controleer altijd de resultaten.';
            
            // Try to copy HTML with formatting, fallback to plain text if ClipboardItem is not supported
            try {
                if (window.ClipboardItem) {
                    // Modern browsers: copy both HTML and plain text
                    const clipboardItem = new ClipboardItem({
                        'text/html': new Blob([htmlContent], { type: 'text/html' }),
                        'text/plain': new Blob([text], { type: 'text/plain' })
                    });
                    await navigator.clipboard.write([clipboardItem]);
                } else {
                    // Fallback: use a temporary div to copy HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlContent;
                    tempDiv.style.position = 'fixed';
                    tempDiv.style.left = '-9999px';
                    document.body.appendChild(tempDiv);
                    
                    // Select the content
                    const range = document.createRange();
                    range.selectNodeContents(tempDiv);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    
                    // Copy
                    document.execCommand('copy');
                    
                    // Cleanup
                    selection.removeAllRanges();
                    document.body.removeChild(tempDiv);
                }
            } catch (clipboardError) {
                // If HTML copy fails, fallback to plain text
                console.warn('[AIRenderer] HTML copy failed, using plain text:', clipboardError);
                await navigator.clipboard.writeText(text);
            }
            
            // Show success feedback in button
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Gekopieerd!';
                copyBtn.classList.remove('bg-gray-100', 'hover:bg-gray-200', 'dark:bg-gray-700', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
                copyBtn.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('bg-green-500', 'hover:bg-green-600', 'text-white');
                    copyBtn.classList.add('bg-gray-100', 'hover:bg-gray-200', 'dark:bg-gray-700', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
                }, 2000);
            }
        } catch (error) {
            console.error('[AIRenderer] Error copying table:', error);
            
            // Show error feedback in button
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Fout bij kopiëren';
                copyBtn.classList.remove('bg-gray-100', 'hover:bg-gray-200', 'dark:bg-gray-700', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
                copyBtn.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('bg-red-500', 'hover:bg-red-600', 'text-white');
                    copyBtn.classList.add('bg-gray-100', 'hover:bg-gray-200', 'dark:bg-gray-700', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
                }, 2000);
            }
        }
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIRenderer;
} else {
    window.AIRenderer = AIRenderer;
}

