/**
 * ExerciseRenderer
 * 
 * Utility voor het renderen van oefeningen:
 * - True/False Exercise
 * - Matching Exercise
 * - Sequence Exercise
 * - Source Evaluation Exercise
 */

class ExerciseRenderer {
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
            <div class="true-false-exercise mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700" id="${exerciseId}">
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
     * @param {string} exerciseId - ID of the exercise container
     * @param {number} statementIndex - Index of the statement
     * @param {boolean} answer - The answer (true or false)
     */
    static updateTrueFalseAnswer(exerciseId, statementIndex, answer) {
        // Answer is stored in radio button state, no need to store separately
    }

    /**
     * Check true/false exercise answers
     * @param {string} exerciseId - ID of the exercise container
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
            <div class="matching-exercise mb-6 sm:mb-8 px-6 py-4" id="${exerciseId}">
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
     * @param {Event} event - Drag event
     * @param {string} exerciseId - ID of the exercise container
     * @param {number} itemIndex - Index of the item being dragged
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
     * @param {Event} event - Drag event
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
     * @param {Event} event - Drag event
     */
    static allowDrop(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    /**
     * Handle drop
     * @param {Event} event - Drop event
     * @param {string} exerciseId - ID of the exercise container
     * @param {number} categoryIndex - Index of the category being dropped into
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
     * @param {string} exerciseId - ID of the exercise container
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
                <p class="text-sm text-blue-800 dark:text-blue-400">${HtmlUtils.escapeHtml(item.context)}</p>
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
                    ondragstart="InteractiveRenderer.handleSequenceDragStart(event, '${exerciseId}')"
                    ondragover="InteractiveRenderer.handleSequenceDragOver(event, '${exerciseId}')"
                    ondragend="InteractiveRenderer.handleSequenceDragEnd(event, '${exerciseId}')"
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
                            <p class="text-sm text-gray-700 dark:text-gray-300" style="user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; pointer-events: none; margin: 0;">${HtmlUtils.escapeHtml(para.text)}</p>
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
            <div class="sequence-exercise w-full mb-6 sm:mb-8" id="${exerciseId}"
                 data-explanation="${HtmlUtils.escapeHtml(exerciseData.explanation)}"
                 data-sources="${encodeURIComponent(JSON.stringify(exerciseData.sources))}"
                 data-incorrect-feedback="${HtmlUtils.escapeHtml(exerciseData.feedback.incorrect || '')}">
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
                        onclick="InteractiveRenderer.checkSequenceOrder('${exerciseId}')"
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
     * @param {Event} event - Drag event
     * @param {string} exerciseId - ID of the exercise container
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
     * @param {Event} event - Drag event
     * @param {string} exerciseId - ID of the exercise container
     */
    static handleSequenceDragOver(event, exerciseId) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        
        const container = document.getElementById(`${exerciseId}-sortable-container`);
        if (!container) return;
        
        const dragging = container.querySelector('.dragging');
        if (!dragging) return;
        
        const afterElement = ExerciseRenderer.getDragAfterElement(container, event.clientY);
        
        if (afterElement == null) {
            container.appendChild(dragging);
        } else {
            container.insertBefore(dragging, afterElement);
        }
    }

    /**
     * Get element after which to insert dragged item
     * @param {HTMLElement} container - Container element
     * @param {number} y - Y coordinate of mouse
     * @returns {HTMLElement|null} Element after which to insert, or null
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
     * @param {Event} event - Drag event
     * @param {string} exerciseId - ID of the exercise container
     */
    static handleSequenceDragEnd(event, exerciseId) {
        const item = event.target.closest('.sequence-item');
        if (!item) return;
        
        item.style.opacity = '1';
        item.classList.remove('dragging');
    }

    /**
     * Check sequence order (for sortable list)
     * @param {string} exerciseId - ID of the exercise container
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
                                ${sourcesArray.map(source => `<li>${HtmlUtils.escapeHtml(source)}</li>`).join('')}
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
                        <p class="text-sm text-green-800 dark:text-green-400 mb-3">${HtmlUtils.escapeHtml(explanation)}</p>
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
                        <p class="text-sm text-yellow-800 dark:text-yellow-400 mb-3">${HtmlUtils.escapeHtml(feedbackMessage)}</p>
                        <div class="text-sm text-yellow-800 dark:text-yellow-400">
                            <p class="font-medium mb-2">Hint:</p>
                            <ul class="list-disc list-inside space-y-1">
                                ${hints.map(hint => `<li class="mb-2">${HtmlUtils.escapeHtml(hint)}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }
        
        resultDiv.classList.remove('hidden');
    }

    /**
     * Fuzzy matching voor antwoorden
     * Accepteert variaties in spelling en woordkeuze
     * 
     * Werkt op basis van:
     * 1. Exacte match (na normalisatie)
     * 2. Keyword matching - als belangrijke woorden uit het correcte antwoord voorkomen in het gebruikersantwoord
     * 3. Synoniemen en variaties worden geaccepteerd
     * @param {string} userAnswer - Het antwoord van de gebruiker
     * @param {Array<string>} correctAnswers - Array van correcte antwoorden
     * @returns {boolean} True als het antwoord matcht
     */
    static fuzzyMatchSourceAnswer(userAnswer, correctAnswers) {
        if (!userAnswer || !correctAnswers || correctAnswers.length === 0) {
            return false;
        }

        const normalizedUser = HtmlUtils.normalizeText(userAnswer);
        
        return correctAnswers.some(correctAnswer => {
            const normalizedCorrect = HtmlUtils.normalizeText(correctAnswer);
            
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

    // NOTE: Source Evaluation Exercise methoden zijn zeer groot (>700 regels)
    // Deze worden toegevoegd in een aparte stap om de bestandsgrootte beheersbaar te houden
    // Voor nu delegeren we naar InteractiveRenderer die deze methoden nog bevat
    // TODO: Verplaats Source Evaluation methoden naar ExerciseRenderer in een volgende iteratie
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExerciseRenderer;
} else {
    window.ExerciseRenderer = ExerciseRenderer;
}

