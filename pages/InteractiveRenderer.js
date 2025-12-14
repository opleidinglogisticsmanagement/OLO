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
     * Laat studenten omschrijvingen matchen met categorieën
     * @param {Object} item - Matching exercise item met categories en items
     * @returns {string} HTML string
     */
    static renderMatchingExercise(item) {
        if (!item.categories || !item.items || !Array.isArray(item.categories) || !Array.isArray(item.items)) {
            console.warn('Matching exercise missing categories or items:', item);
            return '';
        }

        const exerciseId = `matching-exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Shuffle items for variety but keep track of original indices
        const itemsWithIndices = item.items.map((itemObj, originalIndex) => ({
            ...itemObj,
            originalIndex
        }));
        const shuffledItems = [...itemsWithIndices].sort(() => Math.random() - 0.5);
        
        const categoriesHtml = item.categories.map((category, catIndex) => {
            const categoryId = `${exerciseId}-category-${catIndex}`;
            return `
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[120px] bg-gray-50 dark:bg-gray-800" id="${categoryId}" 
                     ondrop="InteractiveRenderer.handleDrop(event, '${exerciseId}', ${catIndex})" 
                     ondragover="InteractiveRenderer.allowDrop(event)"
                     style="word-wrap: break-word; overflow-wrap: break-word; overflow: visible;">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm break-words">${category.name}</h4>
                    ${category.description ? `<p class="text-xs text-gray-600 dark:text-gray-400 mb-3 italic">${category.description}</p>` : ''}
                    <div class="dropped-items space-y-2 break-words" id="${categoryId}-items" style="word-wrap: break-word; overflow-wrap: break-word; min-height: 60px;"></div>
                </div>
            `;
        }).join('');

        const itemsHtml = shuffledItems.map((itemObj, shuffledIndex) => {
            const itemId = `${exerciseId}-item-${itemObj.originalIndex}`;
            return `
                <div 
                    class="matching-item bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 rounded-lg p-3 cursor-move hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    id="${itemId}"
                    draggable="true"
                    ondragstart="InteractiveRenderer.handleDragStart(event, '${exerciseId}', ${itemObj.originalIndex})"
                    ondragend="InteractiveRenderer.handleDragEnd(event)"
                    data-item-index="${itemObj.originalIndex}"
                    data-correct-category="${itemObj.correctCategory}"
                    style="word-wrap: break-word; overflow-wrap: break-word; max-width: 100%; min-height: auto; height: auto; user-select: none; -webkit-user-select: none;"
                >
                    <p class="text-sm text-gray-800 dark:text-gray-200 break-words leading-relaxed" style="word-wrap: break-word; overflow-wrap: break-word; hyphens: auto; margin: 0; display: block; user-select: none; -webkit-user-select: none; pointer-events: none;">${itemObj.text}</p>
                </div>
            `;
        }).join('');

        // Responsive grid: 1 column on mobile, dynamic on desktop
        const gridStyle = `
            #${exerciseId} .matching-item {
                word-wrap: break-word;
                overflow-wrap: break-word;
                max-width: 100%;
                box-sizing: border-box;
                min-height: auto;
                height: auto;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }
            #${exerciseId} .matching-item p {
                word-wrap: break-word;
                overflow-wrap: break-word;
                hyphens: auto;
                margin: 0;
                line-height: 1.5;
                display: block;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                pointer-events: none;
            }
            #${exerciseId} .dropped-items {
                word-wrap: break-word;
                overflow-wrap: break-word;
                max-width: 100%;
            }
            #${exerciseId} .dropped-items .matching-item {
                max-width: 100%;
                box-sizing: border-box;
                min-height: auto;
                height: auto;
            }
            #${exerciseId} .categories-grid {
                grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
            }
            @media (min-width: 640px) {
                #${exerciseId} .categories-grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                }
            }
        `;
        
        return `
            <div class="matching-exercise mb-6 px-6 py-4" id="${exerciseId}">
                <style>${gridStyle}</style>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${item.title || 'Matching Oefening'}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${item.instruction || 'Sleep de omschrijvingen naar de juiste categorie:'}</p>
                
                <div class="grid gap-4 mb-4 grid-cols-1 categories-grid">
                    ${categoriesHtml}
                </div>
                
                <div class="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Sleep deze items naar de juiste categorie:</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" id="${exerciseId}-items-container" style="word-wrap: break-word; overflow-wrap: break-word;">
                        ${itemsHtml}
                    </div>
                </div>
                
                <button 
                    onclick="InteractiveRenderer.checkMatchingExercise('${exerciseId}')"
                    class="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                    Controleer antwoorden
                </button>
                
                <div id="${exerciseId}-result" class="hidden mt-4"></div>
            </div>
        `;
    }

    /**
     * Handle drag start
     */
    static handleDragStart(event, exerciseId, itemIndex) {
        // Prevent default to ensure drag works
        event.stopPropagation();
        
        // Set data for drop handling
        const data = JSON.stringify({ exerciseId, itemIndex });
        event.dataTransfer.setData('text/plain', data);
        event.dataTransfer.effectAllowed = 'move';
        
        // Visual feedback
        const target = event.currentTarget || event.target.closest('.matching-item');
        if (target) {
            target.style.opacity = '0.5';
            // Store the dragged element for potential dragend handling
            event.dataTransfer.setData('dragged-element-id', target.id);
        }
    }

    /**
     * Handle drag end - reset opacity if drag was cancelled
     */
    static handleDragEnd(event) {
        // Reset opacity - the drop handler will handle successful drops
        // If drag was cancelled, this will reset the opacity
        if (event.currentTarget) {
            // Only reset if we're not in a successful drop (drop handler sets opacity to 1)
            // Small delay to check if drop was successful
            setTimeout(() => {
                if (event.currentTarget.style.opacity === '0.5') {
                    event.currentTarget.style.opacity = '1';
                }
            }, 100);
        }
    }

    /**
     * Allow drop
     */
    static allowDrop(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    /**
     * Handle drop
     */
    static handleDrop(event, exerciseId, categoryIndex) {
        event.preventDefault();
        
        // Get data from dataTransfer
        let data;
        try {
            const dataString = event.dataTransfer.getData('text/plain');
            if (!dataString) {
                console.warn('No data in dataTransfer');
                return;
            }
            data = JSON.parse(dataString);
        } catch (err) {
            console.error('Error parsing drop data:', err);
            return;
        }
        
        if (!data || data.exerciseId !== exerciseId) {
            console.warn('Drop data mismatch:', { data, exerciseId });
            return;
        }
        
        const itemElement = document.getElementById(`${exerciseId}-item-${data.itemIndex}`);
        const categoryItemsContainer = document.getElementById(`${exerciseId}-category-${categoryIndex}-items`);
        
        if (!itemElement) {
            console.warn('Item element not found:', `${exerciseId}-item-${data.itemIndex}`);
            return;
        }
        
        if (!categoryItemsContainer) {
            console.warn('Category container not found:', `${exerciseId}-category-${categoryIndex}-items`);
            return;
        }
        
        // If item is already in a category container, remove it first
        const currentParent = itemElement.parentElement;
        if (currentParent && currentParent.id && currentParent.id.includes('-items')) {
            // Item is already in a category, remove it
            currentParent.removeChild(itemElement);
        }
        
        // Reset opacity
        itemElement.style.opacity = '1';
        
        // Ensure item remains draggable and has the correct event handlers
        itemElement.setAttribute('draggable', 'true');
        itemElement.draggable = true;
        
        // Re-attach drag handlers to ensure they work after moving
        // Use inline handlers (ondragstart) so they work even after DOM manipulation
        const itemIndex = itemElement.getAttribute('data-item-index');
        if (itemIndex !== null) {
            // Set inline handlers as attributes so they persist after DOM moves
            itemElement.setAttribute('ondragstart', `InteractiveRenderer.handleDragStart(event, '${exerciseId}', ${itemIndex})`);
            itemElement.setAttribute('ondragend', `InteractiveRenderer.handleDragEnd(event)`);
            
            // Also set as properties for immediate use
            itemElement.ondragstart = (e) => {
                InteractiveRenderer.handleDragStart(e, exerciseId, parseInt(itemIndex));
            };
            itemElement.ondragend = (e) => {
                InteractiveRenderer.handleDragEnd(e);
            };
        }
        
        // Ensure child elements don't interfere with dragging
        const childP = itemElement.querySelector('p');
        if (childP) {
            childP.style.pointerEvents = 'none';
            childP.style.userSelect = 'none';
        }
        
        // Move item to new category
        categoryItemsContainer.appendChild(itemElement);
        
        // Keep item draggable and interactive so it can be moved again
        // Don't change cursor or styling - item should remain interactive
    }

    /**
     * Check matching exercise answers
     */
    static checkMatchingExercise(exerciseId) {
        const exercise = document.getElementById(exerciseId);
        const resultDiv = document.getElementById(`${exerciseId}-result`);
        
        if (!exercise || !resultDiv) return;
        
        // Get category names from the exercise data attribute or from DOM
        const categoryNames = [];
        const categoryContainers = [];
        for (let i = 0; i < 10; i++) { // Max 10 categories
            const categoryId = `${exerciseId}-category-${i}`;
            const categoryEl = document.getElementById(categoryId);
            if (categoryEl) {
                const categoryName = categoryEl.querySelector('h4')?.textContent || `Categorie ${i}`;
                categoryNames.push(categoryName);
                categoryContainers.push({ index: i, element: categoryEl, id: categoryId });
            } else {
                break; // Stop when we find no more categories
            }
        }
        
        let correctCount = 0;
        let totalCount = 0;
        const feedback = [];
        
        categoryContainers.forEach(({ index: catIndex, element: category, id: categoryId }) => {
            const itemsContainer = document.getElementById(`${categoryId}-items`);
            const items = itemsContainer ? itemsContainer.querySelectorAll('.matching-item') : [];
            
            items.forEach(item => {
                totalCount++;
                const correctCategory = parseInt(item.getAttribute('data-correct-category'));
                
                if (correctCategory === catIndex) {
                    correctCount++;
                    item.classList.remove('border-blue-300', 'dark:border-blue-600', 'bg-white', 'dark:bg-gray-800', 'border-red-500', 'dark:border-red-400', 'bg-red-50', 'dark:bg-red-900/20');
                    item.classList.add('border-green-500', 'dark:border-green-400', 'bg-green-50', 'dark:bg-green-900/20');
                } else {
                    item.classList.remove('border-blue-300', 'dark:border-blue-600', 'bg-white', 'dark:bg-gray-800', 'border-green-500', 'dark:border-green-400', 'bg-green-50', 'dark:bg-green-900/20');
                    item.classList.add('border-red-500', 'dark:border-red-400', 'bg-red-50', 'dark:bg-red-900/20');
                    const itemText = item.textContent.trim();
                    
                    feedback.push(`"${itemText}" is nog niet op de juiste plek geplaatst. Kijk nog even goed naar de criteria.`);
                }
            });
        });
        
        resultDiv.classList.remove('hidden');
        
        if (correctCount === totalCount && totalCount > 0) {
            resultDiv.className = 'mt-4 p-3 rounded-lg border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20';
            resultDiv.innerHTML = `
                <h4 class="font-semibold mb-2 text-green-800 dark:text-green-200 text-sm">✓ Uitstekend!</h4>
                <p class="text-sm text-green-800 dark:text-green-200">Je hebt alle items correct gematcht!</p>
            `;
        } else if (correctCount > 0) {
            resultDiv.className = 'mt-4 p-3 rounded-lg border-2 border-yellow-500 bg-yellow-50';
            resultDiv.innerHTML = `
                <h4 class="font-semibold mb-2 text-yellow-800 text-sm">⚠ Goed bezig</h4>
                <p class="text-sm text-yellow-800 mb-2">Je hebt ${correctCount} van de ${totalCount} items correct gematcht.</p>
                ${feedback.length > 0 ? `<ul class="text-xs text-yellow-800 space-y-1 mt-2">${feedback.map(f => `<li>• ${f}</li>`).join('')}</ul>` : ''}
            `;
        } else {
            resultDiv.className = 'mt-4 p-3 rounded-lg border-2 border-blue-500 bg-blue-50';
            resultDiv.innerHTML = `
                <h4 class="font-semibold mb-2 text-blue-800 text-sm">💡 Probeer opnieuw</h4>
                <p class="text-sm text-blue-800">Sleep de items naar de juiste categorieën en controleer opnieuw.</p>
            `;
        }
    }

    /**
     * Render een true/false oefening
     * Laat studenten bepalen of stellingen waar of onwaar zijn
     * @param {Object} item - True/false exercise item met statements array
     * @returns {string} HTML string
     */
    static renderTrueFalseExercise(item) {
        if (!item.statements || !Array.isArray(item.statements) || item.statements.length === 0) {
            console.warn('True/false exercise missing statements array:', item);
            return '';
        }

        const exerciseId = `true-false-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const statementsHtml = item.statements.map((statement, index) => {
            const statementId = `${exerciseId}-statement-${index}`;
            const trueId = `${statementId}-true`;
            const falseId = `${statementId}-false`;
            const correctAnswer = statement.correctAnswer === true || statement.correctAnswer === 'true';
            
            return `
                <div class="border border-gray-200 dark:border-gray-700 rounded p-2 mb-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" data-correct-answer="${correctAnswer}" data-explanation="${statement.explanation || ''}">
                    <p class="text-xs text-gray-800 dark:text-gray-200 mb-1.5 font-medium leading-relaxed">${statement.text}</p>
                    <div class="flex items-center space-x-3">
                        <label class="flex items-center space-x-1.5 cursor-pointer">
                            <input 
                                type="radio" 
                                name="${statementId}"
                                id="${trueId}"
                                value="true"
                                class="w-3.5 h-3.5 text-green-600 border-gray-300 focus:ring-green-500"
                                onchange="InteractiveRenderer.updateTrueFalseAnswer('${exerciseId}', ${index}, true)"
                            />
                            <span class="text-xs text-gray-700 dark:text-gray-300">Waar</span>
                        </label>
                        <label class="flex items-center space-x-1.5 cursor-pointer">
                            <input 
                                type="radio" 
                                name="${statementId}"
                                id="${falseId}"
                                value="false"
                                class="w-3.5 h-3.5 text-red-600 border-gray-300 focus:ring-red-500"
                                onchange="InteractiveRenderer.updateTrueFalseAnswer('${exerciseId}', ${index}, false)"
                            />
                            <span class="text-xs text-gray-700 dark:text-gray-300">Onwaar</span>
                        </label>
                    </div>
                    <div id="${statementId}-feedback" class="hidden mt-1.5"></div>
                </div>
            `;
        }).join('');

        return `
            <div class="true-false-exercise mb-4 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700" id="${exerciseId}">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1.5">${item.title || 'Waar of Onwaar?'}</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2.5">${item.instruction || 'Bepaal of de volgende stellingen waar of onwaar zijn:'}</p>
                
                <div class="space-y-1.5">
                    ${statementsHtml}
                </div>
                <button 
                    onclick="InteractiveRenderer.checkTrueFalseExercise('${exerciseId}')"
                    class="mt-3 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs"
                >
                    Controleer antwoorden
                </button>
                <div id="${exerciseId}-result" class="hidden mt-3"></div>
            </div>
        `;
    }

    /**
     * Update true/false answer
     */
    static updateTrueFalseAnswer(exerciseId, statementIndex, answer) {
        // Answer is stored in radio button state, no need to store separately
    }

    /**
     * Render een sequence oefening (volgorde oefening)
     * Laat studenten alinea's in de juiste volgorde zetten
     * @param {Object} item - Sequence exercise item met paragraphs array
     * @returns {string} HTML string
     */
    static renderSequenceExercise(item) {
        if (!item.paragraphs || !Array.isArray(item.paragraphs)) {
            console.warn('Sequence exercise missing paragraphs:', item);
            return '';
        }

        const exerciseId = `sequence-exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Shuffle paragraphs but keep track of correct order
        const paragraphsWithOrder = item.paragraphs.map((para, index) => ({
            ...para,
            originalIndex: index,
            correctOrder: para.correctOrder || (index + 1)
        }));
        
        const shuffledParagraphs = [...paragraphsWithOrder].sort(() => Math.random() - 0.5);
        
        // Context section
        const contextHtml = item.context ? `
            <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 class="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-2">Context</h4>
                <p class="text-sm text-blue-800 dark:text-blue-400">${this.escapeHtml(item.context)}</p>
            </div>
        ` : '';
        
        // Render shuffled paragraphs as sortable items (no drop zones, direct sorting)
        const paragraphsHtml = shuffledParagraphs.map((para, shuffledIndex) => {
            const paraId = `${exerciseId}-para-${shuffledIndex}`;
            return `
                <div 
                    id="${paraId}"
                    class="sequence-item bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 rounded-lg p-4 mb-3 cursor-move hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    draggable="true"
                    style="user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;"
                    data-correct-order="${para.correctOrder}"
                    data-original-index="${para.originalIndex}"
                    data-shuffled-index="${shuffledIndex}"
                    data-exercise-id="${exerciseId}"
                >
                    <div class="flex items-start">
                        <div class="flex-shrink-0 mr-3 mt-1">
                            <i class="fas fa-grip-vertical text-gray-400 dark:text-gray-500"></i>
                        </div>
                        <div class="flex-1">
                            <p class="text-sm text-gray-700 dark:text-gray-300" style="user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; pointer-events: none; margin: 0;">${this.escapeHtml(para.text)}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Store exercise data in data attributes for feedback
        const exerciseData = {
            explanation: item.explanation || '',
            sources: item.sources || [],
            feedback: item.feedback || {}
        };
        
        // Only show title if it's not empty
        const titleHtml = item.title && item.title.trim() !== '' ? `<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${item.title}</h3>` : '';
        
        return `
            <div class="sequence-exercise w-full" id="${exerciseId}"
                 data-explanation="${this.escapeHtml(exerciseData.explanation)}"
                 data-sources="${encodeURIComponent(JSON.stringify(exerciseData.sources))}"
                 data-incorrect-feedback="${this.escapeHtml(exerciseData.feedback.incorrect || '')}">
                ${titleHtml}
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${item.instruction || 'Sleep de alinea\'s om ze in de juiste volgorde te zetten:'}</p>
                
                ${contextHtml}
                
                <div class="mb-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Alinea's (sleep om te herordenen):</h4>
                    <div id="${exerciseId}-sortable-container" class="sequence-sortable-container">
                        ${paragraphsHtml}
                    </div>
                </div>
                
                <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button 
                        class="sequence-check-btn px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                        type="button"
                        data-exercise-id="${exerciseId}"
                    >
                        Controleer volgorde
                    </button>
                    <div id="${exerciseId}-result" class="hidden mt-4"></div>
                </div>
            </div>
        `;
    }

    /**
     * Handle drag start for sequence exercise (sortable list)
     */
    static handleSequenceDragStart(event, exerciseId) {
        const item = event.target.closest('.sequence-item');
        if (!item) return;
        
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', JSON.stringify({
            exerciseId,
            itemId: item.id
        }));
        
        item.style.opacity = '0.5';
        item.classList.add('dragging');
    }

    /**
     * Handle drag over for sequence exercise (sortable list)
     */
    static handleSequenceDragOver(event, exerciseId) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        
        const container = document.getElementById(`${exerciseId}-sortable-container`);
        if (!container) return;
        
        const dragging = container.querySelector('.dragging');
        if (!dragging) return;
        
        const afterElement = this.getDragAfterElement(container, event.clientY);
        
        if (afterElement == null) {
            container.appendChild(dragging);
        } else {
            container.insertBefore(dragging, afterElement);
        }
    }

    /**
     * Get element after which to insert dragged item
     */
    static getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.sequence-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    /**
     * Handle drag end for sequence exercise
     */
    static handleSequenceDragEnd(event, exerciseId) {
        const item = event.target.closest('.sequence-item');
        if (!item) return;
        
        item.style.opacity = '1';
        item.classList.remove('dragging');
    }

    /**
     * Check sequence order (for sortable list)
     */
    static checkSequenceOrder(exerciseId) {
        const exercise = document.getElementById(exerciseId);
        if (!exercise) return;
        
        const container = document.getElementById(`${exerciseId}-sortable-container`);
        if (!container) return;
        
        const items = container.querySelectorAll('.sequence-item');
        const resultDiv = document.getElementById(`${exerciseId}-result`);
        
        if (!resultDiv) return;
        
        let allCorrect = true;
        const results = [];
        
        items.forEach((item, index) => {
            const currentPosition = index + 1;
            const correctOrder = parseInt(item.getAttribute('data-correct-order'));
            const isCorrect = correctOrder === currentPosition;
            
            if (isCorrect) {
                item.classList.add('border-green-500', 'dark:border-green-400');
                item.classList.remove('border-blue-300', 'dark:border-blue-600', 'border-red-500', 'dark:border-red-400');
                results.push({ position: currentPosition, correct: true, message: 'Correct' });
            } else {
                allCorrect = false;
                item.classList.add('border-red-500', 'dark:border-red-400');
                item.classList.remove('border-blue-300', 'dark:border-blue-600', 'border-green-500', 'dark:border-green-400');
                results.push({ position: currentPosition, correct: false, message: `Moet op positie ${correctOrder} staan` });
            }
        });
        
        // Get exercise item data for feedback
        const exerciseElement = exercise;
        
        // Show result
        if (allCorrect) {
            resultDiv.className = 'mt-4 p-4 rounded-lg border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20';
            
            // Get explanation and sources from data attributes
            const explanation = exerciseElement.getAttribute('data-explanation') || 'Je hebt de alinea\'s in de juiste logische volgorde gezet.';
            const sources = exerciseElement.getAttribute('data-sources');
            
            let sourcesHtml = '';
            if (sources) {
                try {
                    const sourcesArray = JSON.parse(decodeURIComponent(sources));
                    sourcesHtml = `
                        <div class="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-green-200 dark:border-green-800">
                            <p class="text-sm font-medium text-green-900 dark:text-green-300 mb-2">Gebruikte bronnen:</p>
                            <ul class="text-sm text-green-800 dark:text-green-400 list-disc list-inside space-y-1">
                                ${sourcesArray.map(source => `<li>${this.escapeHtml(source)}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                } catch (e) {
                    console.error('Error parsing sources:', e);
                }
            }
            
            resultDiv.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-check-circle text-green-600 dark:text-green-400 text-xl mt-0.5 mr-3"></i>
                    <div class="flex-1">
                        <h4 class="font-semibold text-green-900 dark:text-green-300 mb-2">Uitstekend! De volgorde is correct.</h4>
                        <p class="text-sm text-green-800 dark:text-green-400 mb-3">${this.escapeHtml(explanation)}</p>
                        ${sourcesHtml}
                    </div>
                </div>
            `;
        } else {
            resultDiv.className = 'mt-4 p-4 rounded-lg border-2 border-yellow-500 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
            
            // Fixed feedback message and hints
            const feedbackMessage = 'Helaas nog niet alle alinea\'s staan goed. Gebruik de hint hieronder om de alinea\'s goed te structureren.';
            const hints = [
                'Alinea 1 gaat over het probleem (disbalans door gebrek aan data-gestuurd model).',
                'Alinea 2 legt de methode uit waarmee het probleem opgelost kan worden (kwantitatieve analyse).',
                'Alinea 3 beschrijft de oplossing (EOQ-model).',
                'Alinea 4 benoemt de knowledge gap (onbekende kostvariabelen en besparingspotentieel).'
            ];
            
            resultDiv.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-exclamation-triangle text-yellow-600 dark:text-yellow-400 text-xl mt-0.5 mr-3"></i>
                    <div class="flex-1">
                        <h4 class="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">Niet helemaal correct</h4>
                        <p class="text-sm text-yellow-800 dark:text-yellow-400 mb-3">${this.escapeHtml(feedbackMessage)}</p>
                        <div class="text-sm text-yellow-800 dark:text-yellow-400">
                            <p class="font-medium mb-2">Hint:</p>
                            <ul class="list-disc list-inside space-y-1">
                                ${hints.map(hint => `<li class="mb-2">${this.escapeHtml(hint)}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }
        
        resultDiv.classList.remove('hidden');
    }

    /**
     * Render een bronbeoordelingsoefening met gelaagde structuur
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
     * Gebruikers kunnen dan zelf beoordelen of hun antwoord correct was
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
     */
    static checkTrueFalseExercise(exerciseId) {
        const exercise = document.getElementById(exerciseId);
        const resultDiv = document.getElementById(`${exerciseId}-result`);
        
        if (!exercise || !resultDiv) return;
        
        // Find all statement containers with data-correct-answer attribute
        const statementContainers = Array.from(exercise.querySelectorAll('[data-correct-answer]'));
        let correctCount = 0;
        let totalCount = 0;
        
        statementContainers.forEach((statementContainer, index) => {
            totalCount++;
            const statementId = `${exerciseId}-statement-${index}`;
            const feedbackDiv = document.getElementById(`${statementId}-feedback`);
            const trueRadio = document.getElementById(`${statementId}-true`);
            const falseRadio = document.getElementById(`${statementId}-false`);
            
            if (!trueRadio || !falseRadio || !statementContainer) return;
            
            const userAnswer = trueRadio.checked ? true : (falseRadio.checked ? false : null);
            const correctAnswer = statementContainer.getAttribute('data-correct-answer') === 'true';
            const explanation = statementContainer.getAttribute('data-explanation') || '';
            
            if (userAnswer === null) {
                // No answer selected
                if (feedbackDiv) {
                    feedbackDiv.classList.remove('hidden');
                    feedbackDiv.className = 'mt-1.5 p-2 rounded border-2 border-yellow-500 bg-yellow-50';
                    feedbackDiv.innerHTML = `<p class="text-xs text-yellow-800">Selecteer een antwoord.</p>`;
                }
                return;
            }
            
            if (feedbackDiv) {
                feedbackDiv.classList.remove('hidden');
                
                if (userAnswer === correctAnswer) {
                    correctCount++;
                    feedbackDiv.className = 'mt-1.5 p-2 rounded border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20';
                    feedbackDiv.innerHTML = `
                        <p class="text-xs text-green-800 font-medium">✓ Correct!</p>
                        ${explanation ? `<p class="text-xs text-green-700 mt-1 leading-relaxed">${explanation}</p>` : ''}
                    `;
                    trueRadio.disabled = true;
                    falseRadio.disabled = true;
                } else {
                    feedbackDiv.className = 'mt-1.5 p-2 rounded border-2 border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20';
                    const correctText = correctAnswer ? 'Waar' : 'Onwaar';
                    feedbackDiv.innerHTML = `
                        <p class="text-xs text-red-800 dark:text-red-200 font-medium">✗ Onjuist. Het juiste antwoord is: <strong>${correctText}</strong></p>
                        ${explanation ? `<p class="text-xs text-red-700 dark:text-red-300 mt-1 leading-relaxed">${explanation}</p>` : ''}
                    `;
                    trueRadio.disabled = true;
                    falseRadio.disabled = true;
                }
            }
        });
        
        resultDiv.classList.remove('hidden');
        
        if (correctCount === totalCount && totalCount > 0) {
            resultDiv.className = 'mt-3 p-2.5 rounded-lg border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20';
            resultDiv.innerHTML = `
                <h4 class="font-semibold mb-1.5 text-green-800 text-xs">✓ Uitstekend!</h4>
                <p class="text-xs text-green-800">Je hebt alle stellingen correct beantwoord!</p>
            `;
        } else if (correctCount > 0) {
            resultDiv.className = 'mt-3 p-2.5 rounded-lg border-2 border-yellow-500 bg-yellow-50';
            resultDiv.innerHTML = `
                <h4 class="font-semibold mb-1.5 text-yellow-800 text-xs">⚠ Goed bezig</h4>
                <p class="text-xs text-yellow-800">Je hebt ${correctCount} van de ${totalCount} stellingen correct beantwoord.</p>
            `;
        } else {
            resultDiv.className = 'mt-3 p-2.5 rounded-lg border-2 border-blue-500 bg-blue-50';
            resultDiv.innerHTML = `
                <h4 class="font-semibold mb-1.5 text-blue-800 text-xs">💡 Probeer opnieuw</h4>
                <p class="text-xs text-blue-800">Bekijk de feedback bij elke stelling en probeer het opnieuw.</p>
            `;
        }
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
    static renderBooleanOperatorExercise(item) {
        console.log('[InteractiveRenderer] Rendering booleanOperatorExercise', item);
        
        if (!item.scenarios || !Array.isArray(item.scenarios) || item.scenarios.length === 0) {
            console.warn('Boolean operator exercise missing scenarios array:', item);
            return '';
        }

        const exerciseId = `boolean-operator-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const title = item.title || 'Booleaanse operatoroefeningen';
        const instruction = item.instruction || 'Bouw de juiste zoekquery voor elk scenario.';
        
        console.log('[InteractiveRenderer] Exercise ID:', exerciseId, 'Scenarios:', item.scenarios.length);

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
            <div class="boolean-operator-exercise mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700" id="${exerciseId}">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${instruction}</p>
                
                <div class="space-y-4">
                    ${scenariosHtml}
                </div>
            </div>
        `;
        
        // Setup event listeners after DOM is ready (CSP blocks inline onclick)
        setTimeout(() => {
            InteractiveRenderer.setupBooleanExerciseListeners(exerciseId);
        }, 100);
        
        return html;
    }
    
    /**
     * Setup event listeners for boolean operator exercise buttons
     * This is needed because CSP blocks inline onclick handlers
     */
    static setupBooleanExerciseListeners(exerciseId) {
        const exerciseContainer = document.getElementById(exerciseId);
        if (!exerciseContainer) {
            console.warn('[InteractiveRenderer] Exercise container not found:', exerciseId);
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
                    InteractiveRenderer.addToQuery(scenarioId, decodedItem);
                }
            });
        });
        
        // Setup clear button
        const clearButtons = exerciseContainer.querySelectorAll('.boolean-exercise-clear-btn');
        clearButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const scenarioId = button.getAttribute('data-scenario-id');
                if (scenarioId) {
                    InteractiveRenderer.clearQuery(scenarioId);
                }
            });
        });
        
        // Setup validate button
        const validateButtons = exerciseContainer.querySelectorAll('.boolean-exercise-validate-btn');
        validateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const scenarioId = button.getAttribute('data-scenario-id');
                if (scenarioId) {
                    InteractiveRenderer.validateQuery(scenarioId);
                }
            });
        });
    }

    /**
     * Add term or operator to query builder
     */
    static addToQuery(scenarioId, item) {
        console.log('[InteractiveRenderer] addToQuery called', scenarioId, item);
        
        // Decode HTML entities if present (browser should do this automatically, but just in case)
        if (typeof item === 'string') {
            item = item.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        }
        
        const queryBuilder = document.getElementById(`${scenarioId}-query-builder`);
        const queryDisplay = document.getElementById(`${scenarioId}-query-display`);
        
        if (!queryBuilder || !queryDisplay) {
            console.warn('[InteractiveRenderer] Query builder or display not found', scenarioId);
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
        this.updateQueryDisplay(scenarioId);
    }

    /**
     * Update visual display of query
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
     */
    static clearQuery(scenarioId) {
        console.log('[InteractiveRenderer] clearQuery called', scenarioId);
        const queryBuilder = document.getElementById(`${scenarioId}-query-builder`);
        const feedback = document.getElementById(`${scenarioId}-feedback`);
        
        if (queryBuilder) {
            queryBuilder.value = '';
        }
        
        this.updateQueryDisplay(scenarioId);
        
        if (feedback) {
            feedback.classList.add('hidden');
            feedback.innerHTML = '';
        }
    }

    /**
     * Validate query against correct answer
     */
    static validateQuery(scenarioId) {
        console.log('[InteractiveRenderer] validateQuery called', scenarioId);
        const queryBuilder = document.getElementById(`${scenarioId}-query-builder`);
        const feedback = document.getElementById(`${scenarioId}-feedback`);
        const scenarioElement = document.querySelector(`[data-scenario-id="${scenarioId}"]`);
        
        if (!queryBuilder || !feedback || !scenarioElement) {
            console.warn('[InteractiveRenderer] Missing elements for validation', { queryBuilder: !!queryBuilder, feedback: !!feedback, scenarioElement: !!scenarioElement });
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
                        <p class="text-sm text-green-800 dark:text-green-300">${explanation}</p>
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
                        <p class="text-sm text-red-800 dark:text-red-300 mb-2">Je query: <code class="bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded">${userQuery || '(leeg)'}</code></p>
                        <p class="text-sm text-red-800 dark:text-red-300 mb-2">Correcte query: <code class="bg-green-100 dark:bg-green-900/30 px-1 py-0.5 rounded">${correctQuery}</code></p>
                        <p class="text-sm text-red-800 dark:text-red-300">${explanation}</p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Render een AI query oefening
     * Laat studenten queries schrijven en krijgt AI feedback
     */
    static renderAIQueryExercise(item) {
        const exerciseId = `ai-query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const title = item.title || 'Schrijf je eigen zoekquery';
        const instruction = item.instruction || 'Klik op "Nieuw scenario" om te beginnen.';
        const availableTerms = item.availableTerms || [];
        const generateFromTheory = item.generateFromTheory === true;

        const availableTermsStr = JSON.stringify(availableTerms);

        const html = `
            <div class="ai-query-exercise mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700" id="${exerciseId}" data-generate-from-theory="${generateFromTheory}" data-available-terms='${availableTermsStr}' data-scenario-count="0">
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
            InteractiveRenderer.setupAIQueryExerciseListeners(exerciseId);
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
            console.warn('[InteractiveRenderer] AI query exercise container not found:', exerciseId);
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
                    InteractiveRenderer.addToAIQuery(exerciseId, decodedItem);
                }
            }
            
            // Handle validate button
            const validateBtn = e.target.closest('.ai-query-validate-btn');
            if (validateBtn) {
                const exerciseIdFromBtn = validateBtn.getAttribute('data-exercise-id');
                if (exerciseIdFromBtn === exerciseId) {
                    InteractiveRenderer.validateAIQuery(exerciseId);
                }
            }
            
            // Handle clear button
            const clearBtn = e.target.closest('.ai-query-clear-btn');
            if (clearBtn) {
                const exerciseIdFromBtn = clearBtn.getAttribute('data-exercise-id');
                if (exerciseIdFromBtn === exerciseId) {
                    InteractiveRenderer.clearAIQuery(exerciseId);
                }
            }
            
            // Handle new scenario button
            const newScenarioBtn = e.target.closest('.ai-query-new-scenario-btn');
            if (newScenarioBtn) {
                const exerciseIdFromBtn = newScenarioBtn.getAttribute('data-exercise-id');
                if (exerciseIdFromBtn === exerciseId) {
                    InteractiveRenderer.loadNewAIQueryScenario(exerciseId);
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
            console.warn('[InteractiveRenderer] AI query exercise elements not found', exerciseId);
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
                let theoryContent = this.extractTheoryContent();
                console.log('[InteractiveRenderer] Extracted theory content length:', theoryContent?.length || 0);
                console.log('[InteractiveRenderer] Extracted theory content preview:', theoryContent?.substring(0, 200) || 'empty');
                
                if (!theoryContent || theoryContent.trim().length === 0) {
                    console.error('[InteractiveRenderer] No theory content found');
                    throw new Error('Geen theorie content gevonden op de pagina');
                }

                // Truncate theory content to max 5000 characters (API limit)
                // Try to truncate at a sentence boundary if possible
                if (theoryContent.length > 5000) {
                    console.log('[InteractiveRenderer] Truncating theory content from', theoryContent.length, 'to 5000 characters');
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
                    console.log('[InteractiveRenderer] Truncated theory content length:', theoryContent.length);
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
                
                console.log('[InteractiveRenderer] Sending request to /api/generate-query-scenario (scenario:', currentCount + 1, ')');
                const response = await fetch('/api/generate-query-scenario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        theoryContent,
                        availableTerms,
                        scenarioCount: currentCount
                    })
                });
                
                console.log('[InteractiveRenderer] Response status:', response.status);

                // Check if response is ok before parsing JSON
                if (!response.ok) {
                    let errorMessage = 'Server error';
                    let errorDetails = null;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorData.error || 'Server error';
                        errorDetails = errorData.errors || errorData.details;
                        console.error('[InteractiveRenderer] API error response:', errorData);
                    } catch (parseError) {
                        // If response is not JSON, try to get text
                        try {
                            const errorText = await response.text();
                            errorMessage = errorText || 'Server error';
                            console.error('[InteractiveRenderer] API error text:', errorText);
                        } catch (textError) {
                            errorMessage = `Server returned status ${response.status}`;
                            console.error('[InteractiveRenderer] Failed to parse error response');
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
            console.error('[InteractiveRenderer] Error loading scenario:', error);
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
        console.log('[extractTheoryContent] Starting extraction...');
        
        // Strategy 1: Find section with "Theorie" heading and get .prose content
        const sections = document.querySelectorAll('section');
        console.log('[extractTheoryContent] Found', sections.length, 'sections');
        
        for (const section of sections) {
            const heading = section.querySelector('h2');
            if (heading) {
                const headingText = heading.textContent.trim();
                console.log('[extractTheoryContent] Checking section with heading:', headingText.substring(0, 50));
                
                if (headingText.toLowerCase().includes('theorie')) {
                    console.log('[extractTheoryContent] Found Theorie section!');
                    const prose = section.querySelector('.prose');
                    if (prose) {
                        const content = prose.innerText || prose.textContent || '';
                        console.log('[extractTheoryContent] Found prose content, length:', content.length);
                        if (content.trim().length > 0) {
                            return content;
                        }
                    }
                    // If no prose, get all text from section (but exclude heading)
                    const sectionContent = section.innerText || section.textContent || '';
                    console.log('[extractTheoryContent] Using full section content, length:', sectionContent.length);
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
            console.log('[extractTheoryContent] Found by class/data-attr, length:', content.length);
            return content;
        }
        
        // Strategy 3: Get all text from main content area
        const mainContent = document.querySelector('main, .content, .lesson-content');
        if (mainContent) {
            const clone = mainContent.cloneNode(true);
            clone.querySelectorAll('button, nav, .sidebar, header, footer, script, style').forEach(el => el.remove());
            const content = clone.innerText || clone.textContent || '';
            console.log('[extractTheoryContent] Using main content, length:', content.length);
            if (content.trim().length > 0) {
                return content;
            }
        }
        
        // Strategy 4: Get all visible text from body (last resort)
        const bodyClone = document.body.cloneNode(true);
        bodyClone.querySelectorAll('button, nav, .sidebar, header, footer, script, style, .navbar, .menu').forEach(el => el.remove());
        const bodyContent = bodyClone.innerText || bodyClone.textContent || '';
        console.log('[extractTheoryContent] Using body content as last resort, length:', bodyContent.length);
        
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
            console.warn('[InteractiveRenderer] AI query elements not found', exerciseId);
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
                            <p class="text-sm text-green-800 dark:text-green-300">${data.feedback || data.explanation}</p>
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
                            <p class="text-sm text-yellow-800 dark:text-yellow-300 mb-2">${data.feedback || data.explanation}</p>
                            ${data.suggestedQuery ? `
                                <p class="text-sm text-yellow-800 dark:text-yellow-300">
                                    <strong>Suggestie:</strong> <code class="bg-yellow-100 dark:bg-yellow-900/30 px-1 py-0.5 rounded">${data.suggestedQuery}</code>
                                </p>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('[InteractiveRenderer] Error validating AI query:', error);
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
        console.log('[InteractiveRenderer] addToAIQuery called', exerciseId, item);
        
        // Decode HTML entities if present
        if (typeof item === 'string') {
            item = item.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        }
        
        const input = document.getElementById(`${exerciseId}-input`);
        
        if (!input) {
            console.warn('[InteractiveRenderer] Input field not found', exerciseId);
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

    /**
     * Render AI Bouwsteen Generator tool
     * Laat studenten een zoekwoord en context invoeren en genereert een bouwsteentabel
     * @param {Object} item - AI Bouwsteen Generator item
     * @returns {string} HTML string
     */
    static renderAIBouwsteenGenerator(item) {
        const generatorId = `ai-bouwsteen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const html = `
            <div class="ai-bouwsteen-generator mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" id="${generatorId}" style="pointer-events: auto;">
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
                InteractiveRenderer.setupAIBouwsteenGeneratorListeners(generatorId);
                
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
            console.warn('[InteractiveRenderer] AI Bouwsteen Generator container not found:', generatorId);
            return;
        }
        
        // Generate button
        const generateBtn = generatorContainer.querySelector('.ai-bouwsteen-generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                InteractiveRenderer.generateBouwsteenTabel(generatorId);
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
                InteractiveRenderer.copyBouwsteenTabel(generatorId);
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
            console.warn('[InteractiveRenderer] AI Bouwsteen Generator elements not found');
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
            const response = await fetch('/api/generate-bouwsteen-tabel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword, context })
            });
            
            if (!response.ok) {
                // Try to get error message from response
                let errorMessage = `Server error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                    if (errorData.details) {
                        console.error('[InteractiveRenderer] Server error details:', errorData.details);
                    }
                } catch (parseError) {
                    // If response is not JSON, use status text
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            
            if (!data.success || !data.table) {
                throw new Error(data.message || 'Failed to generate table');
            }
            
            // Render table
            const tableHtml = InteractiveRenderer.renderBouwsteenTabel(data.table);
            resultTableEl.innerHTML = tableHtml;
            
            // Show result
            loadingEl.classList.add('hidden');
            resultEl.classList.remove('hidden');
            
        } catch (error) {
            console.error('[InteractiveRenderer] Error generating bouwsteen tabel:', error);
            loadingEl.classList.add('hidden');
            
            // Get more detailed error message
            let errorMessage = 'Er is een fout opgetreden bij het genereren van de tabel.';
            if (error.message) {
                errorMessage += `\n\nFout: ${error.message}`;
            }
            alert(errorMessage);
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
                ? items.map(item => `<span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md text-sm mr-2 mb-2">${InteractiveRenderer.escapeHtml(item)}</span>`).join('')
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
                console.warn('[InteractiveRenderer] HTML copy failed, using plain text:', clipboardError);
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
            console.error('[InteractiveRenderer] Error copying table:', error);
            
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
    
    // escapeHtml method removed - duplicate, using HtmlUtils.escapeHtml() instead
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveRenderer;
} else {
    window.InteractiveRenderer = InteractiveRenderer;
}

