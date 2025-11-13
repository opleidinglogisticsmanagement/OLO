/**
 * InteractiveRenderer
 * 
 * Utility voor het renderen van interactieve content elementen
 * Ondersteunt: accordion, smartChecklist, learningObjectivesChecklist, matchingExercise, trueFalseExercise
 */

class InteractiveRenderer {
    /**
     * Render een accordion component
     * @param {Object} item - Accordion item met items array
     * @returns {string} HTML string
     */
    static renderAccordion(item) {
        if (!item.items || !Array.isArray(item.items) || item.items.length === 0) {
            console.warn('Accordion item missing items array:', item);
            return '';
        }

        const accordionId = `accordion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const accordionItems = item.items.map((accordionItem, index) => {
            const itemId = `${accordionId}-item-${index}`;
            const contentId = `${accordionId}-content-${index}`;
            const isOpen = index === 0 && item.defaultOpen !== false; // First item open by default
            
            // Render content - can be string or array
            let contentHtml = '';
            if (Array.isArray(accordionItem.content)) {
                contentHtml = accordionItem.content.map(text => {
                    if (typeof text === 'string' && text.trim().startsWith('<')) {
                        return text; // Already HTML
                    }
                    return `<p class="text-gray-700 mb-3">${text}</p>`;
                }).join('');
            } else if (typeof accordionItem.content === 'string') {
                contentHtml = `<p class="text-gray-700 mb-3">${accordionItem.content}</p>`;
            }

            return `
                <div class="border border-gray-200 rounded-lg mb-3 overflow-hidden">
                    <button
                        class="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between text-left"
                        onclick="InteractiveRenderer.toggleAccordion('${contentId}', '${itemId}')"
                        aria-expanded="${isOpen}"
                        aria-controls="${contentId}"
                        id="${itemId}"
                    >
                        <span class="font-semibold text-gray-900 text-lg">${accordionItem.title}</span>
                        <i class="fas fa-chevron-down transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}" id="${itemId}-icon"></i>
                    </button>
                    <div
                        id="${contentId}"
                        class="accordion-content overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}"
                        aria-hidden="${!isOpen}"
                        style="${isOpen ? '' : 'display: none;'}"
                    >
                        <div class="px-6 py-4 bg-white">
                            ${contentHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="accordion-container mb-6" id="${accordionId}">
                ${accordionItems}
            </div>
        `;
    }

    /**
     * Toggle accordion item open/closed
     * @param {string} contentId - ID of the content div
     * @param {string} buttonId - ID of the button
     */
    static toggleAccordion(contentId, buttonId) {
        const content = document.getElementById(contentId);
        const button = document.getElementById(buttonId);
        const icon = document.getElementById(`${buttonId}-icon`);
        
        if (!content || !button) return;

        const isOpen = content.classList.contains('max-h-[5000px]');
        
        if (isOpen) {
            // Close
            content.classList.remove('max-h-[5000px]', 'opacity-100');
            content.classList.add('max-h-0', 'opacity-0');
            setTimeout(() => {
                content.style.display = 'none';
            }, 300);
            button.setAttribute('aria-expanded', 'false');
            if (icon) icon.classList.remove('rotate-180');
        } else {
            // Open
            content.style.display = 'block';
            setTimeout(() => {
                content.classList.remove('max-h-0', 'opacity-0');
                content.classList.add('max-h-[5000px]', 'opacity-100');
            }, 10);
            button.setAttribute('aria-expanded', 'true');
            if (icon) icon.classList.add('rotate-180');
        }
    }

    /**
     * Render een SMART checklist component
     * Laat studenten een doelstelling analyseren op SMART-criteria
     * @param {Object} item - SMART checklist item met doelstelling en criteria
     * @returns {string} HTML string
     */
    static renderSMARTChecklist(item) {
        if (!item.doelstelling) {
            console.warn('SMART checklist missing doelstelling:', item);
            return '';
        }

        const checklistId = `smart-checklist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const criteria = item.criteria || [
            { letter: 'S', name: 'Specifiek', description: 'De doelstelling is duidelijk en concreet geformuleerd', question: 'Wat precies wil je bereiken?' },
            { letter: 'M', name: 'Meetbaar', description: 'Je kunt vaststellen of de doelstelling is behaald', question: 'Hoe meet je succes?' },
            { letter: 'A', name: 'Acceptabel/Haalbaar', description: 'De doelstelling is realistisch en uitvoerbaar', question: 'Is dit haalbaar binnen de tijd en middelen?' },
            { letter: 'R', name: 'Relevant', description: 'De doelstelling draagt bij aan het oplossen van het probleem', question: 'Helpt dit het praktijkprobleem op te lossen?' },
            { letter: 'T', name: 'Tijdgebonden', description: 'Er is een duidelijk tijdsbestek voor de doelstelling', question: 'Wanneer moet dit zijn afgerond?' }
        ];

        const criteriaHtml = criteria.map((criterion, index) => {
            const criterionId = `${checklistId}-${criterion.letter.toLowerCase()}`;
            return `
                <div class="border border-gray-200 rounded p-2 mb-1.5 bg-white hover:bg-gray-50 transition-colors">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center space-x-2 flex-1 min-w-0">
                            <div class="flex-shrink-0">
                                <div class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span class="font-bold text-blue-700 text-xs">${criterion.letter}</span>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-semibold text-gray-900 text-xs leading-tight">${criterion.name}</h4>
                                <p class="text-xs text-gray-600 leading-tight mt-0.5">${criterion.description}</p>
                            </div>
                        </div>
                        <label class="flex items-center cursor-pointer ml-2 flex-shrink-0">
                            <input 
                                type="checkbox" 
                                id="${criterionId}"
                                class="smart-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                data-criterion="${criterion.letter}"
                            />
                            <span class="ml-1.5 text-xs text-gray-600 whitespace-nowrap">Aanwezig</span>
                        </label>
                    </div>
                    <div id="${criterionId}-feedback" class="mt-1.5 hidden">
                        <div class="text-xs p-1.5 rounded" id="${criterionId}-feedback-content"></div>
                    </div>
                </div>
            `;
        }).join('');

        const resultHtml = `
            <div id="${checklistId}-result" class="hidden mt-2.5 p-2.5 rounded-lg border-2">
                <h4 class="font-semibold mb-1.5 text-sm" id="${checklistId}-result-title"></h4>
                <p class="text-xs" id="${checklistId}-result-text"></p>
                <ul class="mt-1.5 space-y-0.5 text-xs" id="${checklistId}-result-list"></ul>
            </div>
        `;

        return `
            <div class="smart-checklist-container mb-6 bg-gray-50 rounded-lg p-3" id="${checklistId}">
                <h3 class="text-base font-semibold text-gray-900 mb-2">Analyseer deze doelstelling op SMART-criteria:</h3>
                <div class="bg-white border-l-4 border-blue-500 p-2.5 mb-2.5 rounded-r-lg">
                    <p class="text-gray-800 text-sm font-medium leading-snug">${item.doelstelling}</p>
                </div>
                <div class="space-y-1">
                    ${criteriaHtml}
                </div>
                ${resultHtml}
                <button 
                    onclick="InteractiveRenderer.showSMARTResult('${checklistId}')"
                    class="mt-2.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                    Bekijk analyse
                </button>
            </div>
        `;
    }

    /**
     * Show overall SMART analysis result with per-criterion feedback
     * Based on actual analysis of the goal statement
     */
    static showSMARTResult(checklistId) {
        const checkboxes = document.querySelectorAll(`#${checklistId} .smart-checkbox`);
        const resultDiv = document.getElementById(`${checklistId}-result`);
        const resultTitle = document.getElementById(`${checklistId}-result-title`);
        const resultText = document.getElementById(`${checklistId}-result-text`);
        const resultList = document.getElementById(`${checklistId}-result-list`);

        if (!resultDiv || !resultTitle || !resultText || !resultList) return;

        // Initialize variables
        let checkedCount = 0;
        const checkedCriteria = [];
        const uncheckedCriteria = [];

        // Clear result div first
        resultDiv.classList.add('hidden');
        resultDiv.className = 'hidden mt-2.5 p-2.5 rounded-lg border-2';
        resultList.innerHTML = '';

        // Count checked criteria and show per-criterion feedback
        checkboxes.forEach(checkbox => {
            const criterion = checkbox.getAttribute('data-criterion');
            const criterionElement = checkbox.closest('.border');
            const criterionName = criterionElement.querySelector('h4').textContent;
            const criterionId = `${checklistId}-${criterion.toLowerCase()}`;
            const feedbackDiv = document.getElementById(`${criterionId}-feedback`);
            const feedbackContent = document.getElementById(`${criterionId}-feedback-content`);
            
            if (checkbox.checked) {
                checkedCount++;
                checkedCriteria.push({ letter: criterion, name: criterionName });
                
                // Show specific feedback per criterion
                if (feedbackDiv && feedbackContent) {
                    feedbackDiv.classList.remove('hidden');
                    
                    if (criterion === 'S') {
                        // Specifiek - is aanwezig
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 text-green-800 border border-green-200';
                        feedbackContent.textContent = '✓ Correct! De doelstelling is specifiek: duidelijk wat (communicatie verbeteren), waar (logistieke dienstverlener), en hoe (analyseren processen, ontwikkelen aanbevelingen).';
                    } else if (criterion === 'M') {
                        // Meetbaar - is NIET aanwezig volgens analyse
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-yellow-50 text-yellow-800 border border-yellow-200';
                        feedbackContent.textContent = '⚠ Let op: Dit criterium is eigenlijk niet volledig aanwezig. "Verbeteren" is vaag - hoe meet je verbetering? Voeg concrete indicatoren toe (bijv. reductie conflicten, tevredenheidsscore).';
                    } else if (criterion === 'A') {
                        // Acceptabel/Haalbaar - is aanwezig
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 text-green-800 border border-green-200';
                        feedbackContent.textContent = '✓ Correct! De doelstelling is haalbaar binnen de beschikbare tijd en middelen voor een studentenonderzoek.';
                    } else if (criterion === 'R') {
                        // Relevant - is aanwezig
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 text-green-800 border border-green-200';
                        feedbackContent.textContent = '✓ Correct! De doelstelling draagt direct bij aan het oplossen van het praktijkprobleem (communicatieproblemen).';
                    } else if (criterion === 'T') {
                        // Tijdgebonden - is aanwezig
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 text-green-800 border border-green-200';
                        feedbackContent.textContent = '✓ Correct! Er is een duidelijk tijdsbestek: "binnen een periode van 3 maanden".';
                    }
                }
            } else {
                uncheckedCriteria.push({ letter: criterion, name: criterionName });
                
                // Show feedback for unchecked criteria
                if (feedbackDiv && feedbackContent) {
                    feedbackDiv.classList.remove('hidden');
                    
                    if (criterion === 'M') {
                        // Meetbaar - ontbreekt inderdaad
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-yellow-50 text-yellow-800 border border-yellow-200';
                        feedbackContent.textContent = '⚠ Goed opgemerkt! Dit criterium ontbreekt inderdaad. "Verbeteren" is niet meetbaar - voeg concrete indicatoren toe (bijv. reductie conflicten met 30%, verhoging tevredenheidsscore met minimaal 1 punt).';
                    } else {
                        // Andere criteria zijn wel aanwezig
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-blue-50 text-blue-800 border border-blue-200';
                        if (criterion === 'S') {
                            feedbackContent.textContent = '💡 Overweeg: Dit criterium (Specifiek) is wel aanwezig in de doelstelling. De doelstelling is duidelijk over wat, waar en hoe.';
                        } else if (criterion === 'A') {
                            feedbackContent.textContent = '💡 Overweeg: Dit criterium (Acceptabel/Haalbaar) is wel aanwezig. De doelstelling is realistisch voor een studentenonderzoek.';
                        } else if (criterion === 'R') {
                            feedbackContent.textContent = '💡 Overweeg: Dit criterium (Relevant) is wel aanwezig. De doelstelling draagt bij aan het oplossen van het praktijkprobleem.';
                        } else if (criterion === 'T') {
                            feedbackContent.textContent = '💡 Overweeg: Dit criterium (Tijdgebonden) is wel aanwezig. Er is een duidelijk tijdsbestek: "binnen een periode van 3 maanden".';
                        }
                    }
                }
            }
        });

        // Show overall result
        resultDiv.classList.remove('hidden');

        if (checkedCount === 5) {
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-green-500 bg-green-50';
            resultTitle.textContent = '✓ Uitstekend!';
            resultTitle.className = 'font-semibold mb-1.5 text-green-800 text-sm';
            resultText.textContent = 'Je hebt geïdentificeerd dat alle SMART-criteria aanwezig zijn. Let wel op: het criterium "Meetbaar" is eigenlijk niet volledig aanwezig - overweeg dit te verbeteren.';
            resultText.className = 'text-xs text-green-800';
            resultList.innerHTML = '';
        } else if (checkedCount >= 3) {
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-yellow-500 bg-yellow-50';
            resultTitle.textContent = '⚠ Goed bezig';
            resultTitle.className = 'font-semibold mb-1.5 text-yellow-800 text-sm';
            resultText.textContent = `Je hebt ${checkedCount} van de 5 SMART-criteria geïdentificeerd. Bekijk de feedback bij elk criterium hierboven voor meer details.`;
            resultText.className = 'text-xs text-yellow-800';
            resultList.className = 'mt-1.5 space-y-0.5 text-xs text-yellow-800';
            resultList.innerHTML = uncheckedCriteria.map(c => `<li>• ${c.letter}: ${c.name}</li>`).join('');
        } else {
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-blue-500 bg-blue-50';
            resultTitle.textContent = '💡 Reflectie';
            resultTitle.className = 'font-semibold mb-1.5 text-blue-800 text-sm';
            resultText.textContent = `Je hebt ${checkedCount} criterium${checkedCount === 1 ? '' : 'a'} geïdentificeerd. Bekijk de feedback bij elk criterium hierboven voor meer details.`;
            resultText.className = 'text-xs text-blue-800';
            resultList.className = 'mt-1.5 space-y-0.5 text-xs text-blue-800';
            resultList.innerHTML = uncheckedCriteria.map(c => `<li>• ${c.letter}: ${c.name}</li>`).join('');
        }
    }

    /**
     * Render een interactieve leerdoelen checklist
     * Laat studenten hun voortgang bijhouden
     * @param {Object} item - Learning objectives checklist item met items array
     * @returns {string} HTML string
     */
    static renderLearningObjectivesChecklist(item) {
        if (!item.items || !Array.isArray(item.items) || item.items.length === 0) {
            console.warn('Learning objectives checklist missing items array:', item);
            return '';
        }

        const checklistId = `learning-objectives-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const storageKey = `learning-objectives-${item.storageKey || 'week2'}`;
        
        // Load saved state from localStorage
        const savedState = this.loadLearningObjectivesState(storageKey);
        
        const itemsHtml = item.items.map((objective, index) => {
            const objectiveId = `${checklistId}-${index}`;
            const isChecked = savedState[index] || false;
            
            return `
                <div class="border border-gray-200 rounded p-2 mb-1.5 bg-white hover:bg-gray-50 transition-colors">
                    <label class="flex items-start gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            id="${objectiveId}"
                            class="learning-objective-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 flex-shrink-0"
                            data-index="${index}"
                            ${isChecked ? 'checked' : ''}
                            onchange="InteractiveRenderer.updateLearningObjective('${checklistId}', '${storageKey}', ${index})"
                        />
                        <span class="flex-1 text-sm text-gray-700 leading-relaxed ${isChecked ? 'text-green-700 font-medium' : ''}" style="word-break: break-word; hyphens: auto;">
                            ${objective}
                        </span>
                    </label>
                </div>
            `;
        }).join('');

        const checkedCount = savedState.filter(Boolean).length;
        const totalCount = item.items.length;
        const percentage = Math.round((checkedCount / totalCount) * 100);

        return `
            <div class="learning-objectives-checklist mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200" id="${checklistId}">
                <div class="flex items-center justify-between mb-2.5">
                    <h3 class="text-base font-semibold text-gray-900">${item.title || 'Leerdoelen'}</h3>
                    <div class="flex items-center space-x-2">
                        <div class="bg-white rounded-full px-2.5 py-1 border border-blue-300">
                            <span class="text-xs font-semibold text-blue-700">${checkedCount}/${totalCount}</span>
                        </div>
                        <div class="w-12 h-12 relative">
                            <svg class="transform -rotate-90" width="48" height="48">
                                <circle cx="24" cy="24" r="20" stroke="#e5e7eb" stroke-width="3" fill="none"/>
                                <circle 
                                    cx="24" 
                                    cy="24" 
                                    r="20" 
                                    stroke="${percentage === 100 ? '#10b981' : '#3b82f6'}" 
                                    stroke-width="3" 
                                    fill="none"
                                    stroke-dasharray="${2 * Math.PI * 20}"
                                    stroke-dashoffset="${2 * Math.PI * 20 * (1 - percentage / 100)}"
                                    class="transition-all duration-500"
                                />
                            </svg>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-xs font-bold text-gray-700">${percentage}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="text-xs text-gray-600 mb-2.5">${item.description || 'Vink de leerdoelen af die je hebt behaald:'}</p>
                <div class="space-y-1">
                    ${itemsHtml}
                </div>
                ${percentage === 100 ? `
                    <div class="mt-2.5 p-2 bg-green-100 border border-green-300 rounded-lg">
                        <p class="text-xs text-green-800 font-medium text-center">
                            🎉 Gefeliciteerd! Je hebt alle leerdoelen behaald!
                        </p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Load learning objectives state from localStorage
     */
    static loadLearningObjectivesState(storageKey) {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Update learning objective checkbox state
     */
    static updateLearningObjective(checklistId, storageKey, index) {
        const checkbox = document.getElementById(`${checklistId}-${index}`);
        const objectiveText = checkbox.closest('label').querySelector('span');
        const savedState = this.loadLearningObjectivesState(storageKey);
        
        savedState[index] = checkbox.checked;
        localStorage.setItem(storageKey, JSON.stringify(savedState));
        
        // Update visual state
        if (checkbox.checked) {
            objectiveText.classList.remove('text-gray-700', 'line-through', 'text-gray-500');
            objectiveText.classList.add('text-green-700', 'font-medium');
        } else {
            objectiveText.classList.remove('text-green-700', 'font-medium');
            objectiveText.classList.add('text-gray-700');
        }
        
        // Update progress indicator
        this.updateLearningObjectivesProgress(checklistId, storageKey);
    }

    /**
     * Update progress indicator
     */
    static updateLearningObjectivesProgress(checklistId, storageKey) {
        const checklist = document.getElementById(checklistId);
        if (!checklist) return;
        
        const checkboxes = checklist.querySelectorAll('.learning-objective-checkbox');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        const totalCount = checkboxes.length;
        const percentage = Math.round((checkedCount / totalCount) * 100);
        
        // Update counter
        const counter = checklist.querySelector('.bg-white span');
        if (counter) {
            counter.textContent = `${checkedCount}/${totalCount}`;
        }
        
        // Update progress circle
        const circle = checklist.querySelector('circle[stroke-dasharray]');
        if (circle) {
            const radius = 20;
            const circumference = 2 * Math.PI * radius;
            circle.setAttribute('stroke-dashoffset', circumference * (1 - percentage / 100));
            circle.setAttribute('stroke', percentage === 100 ? '#10b981' : '#3b82f6');
        }
        
        // Update percentage text
        const percentageText = checklist.querySelector('.absolute span');
        if (percentageText) {
            percentageText.textContent = `${percentage}%`;
        }
        
        // Show/hide completion message
        const completionMsg = checklist.querySelector('.bg-green-100');
        if (percentage === 100) {
            if (!completionMsg) {
                const msgDiv = document.createElement('div');
                msgDiv.className = 'mt-3 p-2.5 bg-green-100 border border-green-300 rounded-lg';
                msgDiv.innerHTML = '<p class="text-sm text-green-800 font-medium text-center">🎉 Gefeliciteerd! Je hebt alle leerdoelen behaald!</p>';
                checklist.appendChild(msgDiv);
            }
        } else if (completionMsg) {
            completionMsg.remove();
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
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[120px] bg-gray-50" id="${categoryId}" 
                     ondrop="InteractiveRenderer.handleDrop(event, '${exerciseId}', ${catIndex})" 
                     ondragover="InteractiveRenderer.allowDrop(event)">
                    <h4 class="font-semibold text-gray-900 mb-2 text-sm">${category.name}</h4>
                    <p class="text-xs text-gray-600 mb-2">${category.description || ''}</p>
                    <div class="dropped-items space-y-2" id="${categoryId}-items"></div>
                </div>
            `;
        }).join('');

        const itemsHtml = shuffledItems.map((itemObj, shuffledIndex) => {
            const itemId = `${exerciseId}-item-${itemObj.originalIndex}`;
            return `
                <div 
                    class="matching-item bg-white border-2 border-blue-300 rounded-lg p-3 cursor-move hover:bg-blue-50 transition-colors"
                    id="${itemId}"
                    draggable="true"
                    ondragstart="InteractiveRenderer.handleDragStart(event, '${exerciseId}', ${itemObj.originalIndex})"
                    data-item-index="${itemObj.originalIndex}"
                    data-correct-category="${itemObj.correctCategory}"
                >
                    <p class="text-sm text-gray-800">${itemObj.text}</p>
                </div>
            `;
        }).join('');

        // Responsive grid: 1 column on mobile, dynamic on desktop
        const gridStyle = `
            @media (min-width: 768px) {
                #${exerciseId} .categories-grid {
                    grid-template-columns: repeat(${item.categories.length}, minmax(0, 1fr)) !important;
                }
            }
        `;
        
        return `
            <div class="matching-exercise mb-6 bg-white rounded-lg p-4 border border-gray-200" id="${exerciseId}">
                <style>${gridStyle}</style>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${item.title || 'Matching Oefening'}</h3>
                <p class="text-sm text-gray-600 mb-4">${item.instruction || 'Sleep de omschrijvingen naar de juiste categorie:'}</p>
                
                <div class="grid gap-4 mb-4 grid-cols-1 categories-grid">
                    ${categoriesHtml}
                </div>
                
                <div class="border-t-2 border-gray-200 pt-4">
                    <h4 class="font-semibold text-gray-900 mb-3 text-sm">Sleep deze items naar de juiste categorie:</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="${exerciseId}-items-container">
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
        event.dataTransfer.setData('text/plain', JSON.stringify({ exerciseId, itemIndex }));
        event.dataTransfer.effectAllowed = 'move';
        event.currentTarget.style.opacity = '0.5';
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
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        
        if (data.exerciseId !== exerciseId) return;
        
        const itemElement = document.getElementById(`${exerciseId}-item-${data.itemIndex}`);
        const categoryItemsContainer = document.getElementById(`${exerciseId}-category-${categoryIndex}-items`);
        
        if (!itemElement || !categoryItemsContainer) return;
        
        // Reset opacity
        itemElement.style.opacity = '1';
        
        // Move item to category
        categoryItemsContainer.appendChild(itemElement);
        
        // Update item styling
        itemElement.classList.remove('cursor-move', 'hover:bg-blue-50');
        itemElement.classList.add('cursor-default');
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
                    item.classList.remove('border-blue-300', 'bg-white', 'border-red-500', 'bg-red-50');
                    item.classList.add('border-green-500', 'bg-green-50');
                } else {
                    item.classList.remove('border-blue-300', 'bg-white', 'border-green-500', 'bg-green-50');
                    item.classList.add('border-red-500', 'bg-red-50');
                    const itemText = item.textContent.trim();
                    
                    const currentCategoryName = categoryNames[catIndex] || `Categorie ${catIndex}`;
                    const correctCategoryName = categoryNames[correctCategory] || `Categorie ${correctCategory}`;
                    
                    feedback.push(`"${itemText}" hoort bij <strong>${correctCategoryName}</strong>, niet bij ${currentCategoryName}.`);
                }
            });
        });
        
        resultDiv.classList.remove('hidden');
        
        if (correctCount === totalCount && totalCount > 0) {
            resultDiv.className = 'mt-4 p-3 rounded-lg border-2 border-green-500 bg-green-50';
            resultDiv.innerHTML = `
                <h4 class="font-semibold mb-2 text-green-800 text-sm">✓ Uitstekend!</h4>
                <p class="text-sm text-green-800">Je hebt alle items correct gematcht!</p>
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
                <div class="border border-gray-200 rounded p-2 mb-1.5 bg-white hover:bg-gray-50 transition-colors" data-correct-answer="${correctAnswer}" data-explanation="${statement.explanation || ''}">
                    <p class="text-xs text-gray-800 mb-1.5 font-medium leading-relaxed">${statement.text}</p>
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
                            <span class="text-xs text-gray-700">Waar</span>
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
                            <span class="text-xs text-gray-700">Onwaar</span>
                        </label>
                    </div>
                    <div id="${statementId}-feedback" class="hidden mt-1.5"></div>
                </div>
            `;
        }).join('');

        return `
            <div class="true-false-exercise mb-4 bg-white rounded-lg p-3 border border-gray-200" id="${exerciseId}">
                <h3 class="text-base font-semibold text-gray-900 mb-1.5">${item.title || 'Waar of Onwaar?'}</h3>
                <p class="text-xs text-gray-600 mb-2.5">${item.instruction || 'Bepaal of de volgende stellingen waar of onwaar zijn:'}</p>
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
     * Render een klikbare stappen component
     * Laat studenten klikken op stappen om content te zien (alleen eerste stap is uitklapbaar)
     * @param {Object} item - Clickable steps item met steps array
     * @returns {string} HTML string
     */
    static renderClickableSteps(item) {
        if (!item.steps || !Array.isArray(item.steps) || item.steps.length === 0) {
            console.warn('Clickable steps item missing steps array:', item);
            return '';
        }

        const stepsId = `clickable-steps-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render content for steps (expandable)
        const renderStepContent = (stepContent) => {
            if (!stepContent) return '';
            
            if (Array.isArray(stepContent)) {
                return stepContent.map(item => {
                    // If it's an object with a type, render it using ContentRenderer
                    if (typeof item === 'object' && item !== null && item.type) {
                        if (typeof window.ContentRenderer !== 'undefined') {
                            return ContentRenderer.renderContentItems([item]);
                        }
                        return '';
                    }
                    // If it's a string starting with HTML, return as is
                    if (typeof item === 'string' && item.trim().startsWith('<')) {
                        return item;
                    }
                    // Otherwise wrap in paragraph
                    return `<p class="text-gray-700 mb-3">${item}</p>`;
                }).join('');
            } else if (typeof stepContent === 'string') {
                if (stepContent.trim().startsWith('<')) {
                    return stepContent;
                }
                return `<p class="text-gray-700 mb-3">${stepContent}</p>`;
            }
            return '';
        };

        // Render clickable buttons for all steps, with content boxes after active steps
        const stepButtons = item.steps.map((step, index) => {
            const stepId = `${stepsId}-step-${index}`;
            const hasContent = step.content && (
                Array.isArray(step.content) ? step.content.length > 0 : 
                typeof step.content === 'string' ? step.content.trim().length > 0 :
                typeof step.content === 'object' ? true : false
            );
            const isActive = hasContent; // Step is active if it has content
            
            // Get content HTML for this step
            let stepContentHtml = '';
            if (hasContent) {
                stepContentHtml = renderStepContent(step.content);
            }
            
            const buttonHtml = `
                <button
                    class="clickable-step-button w-full px-4 py-3 text-left border-2 rounded-lg transition-all duration-200 ${
                        isActive 
                            ? 'border-blue-500 bg-blue-50 hover:bg-blue-100 cursor-pointer' 
                            : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed opacity-75'
                    }"
                    ${hasContent ? `onclick="InteractiveRenderer.toggleClickableStep('${stepsId}', ${index})"` : ''}
                    ${!hasContent ? 'disabled' : ''}
                    id="${stepId}-button"
                    aria-expanded="${isActive && index === 0}"
                    aria-controls="${stepId}-content"
                >
                    <div class="flex items-center justify-between">
                        <span class="font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}">${step.label || `Stap ${index + 1}`}</span>
                        ${hasContent ? `
                            <i class="fas fa-chevron-down transform transition-transform duration-200 ${isActive && index === 0 ? 'rotate-180' : ''}" id="${stepId}-icon"></i>
                        ` : `
                            <span class="text-xs text-gray-400 italic">(Binnenkort beschikbaar)</span>
                        `}
                    </div>
                </button>
            `;

            // Wrap button and content in a container for consistent spacing
            if (hasContent) {
                const isInitiallyOpen = index === 0;
                return `
                    <div class="clickable-step-wrapper">
                        ${buttonHtml}
                        <div
                            id="${stepId}-content"
                            class="clickable-step-content overflow-hidden transition-all duration-300 ease-in-out border-2 border-blue-200 rounded-lg bg-white ${isInitiallyOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}"
                            style="${isInitiallyOpen ? 'display: block;' : 'display: none;'}"
                            aria-hidden="${!isInitiallyOpen}"
                        >
                            <div class="px-4 py-4">
                                ${stepContentHtml}
                            </div>
                        </div>
                    </div>
                `;
            }
            
            return `<div class="clickable-step-wrapper">${buttonHtml}</div>`;
        }).join('');

        return `
            <div class="clickable-steps-container mb-6" id="${stepsId}">
                <div class="space-y-2">
                    ${stepButtons}
                </div>
            </div>
        `;
    }

    /**
     * Toggle clickable step open/closed
     * @param {string} stepsId - ID of the steps container
     * @param {number} stepIndex - Index of the step to toggle
     */
    static toggleClickableStep(stepsId, stepIndex) {
        const stepsContainer = document.getElementById(stepsId);
        if (!stepsContainer) return;

        const stepId = `${stepsId}-step-${stepIndex}`;
        const content = document.getElementById(`${stepId}-content`);
        const button = document.getElementById(`${stepId}-button`);
        const icon = document.getElementById(`${stepId}-icon`);
        
        if (!content || !button) return;

        const isOpen = content.classList.contains('max-h-[5000px]');
        
        if (isOpen) {
            // Close this step
            content.classList.remove('max-h-[5000px]', 'opacity-100');
            content.classList.add('max-h-0', 'opacity-0');
            setTimeout(() => {
                content.style.display = 'none';
            }, 300);
            button.setAttribute('aria-expanded', 'false');
            button.classList.remove('border-blue-500', 'bg-blue-50');
            button.classList.add('border-gray-200', 'bg-gray-50');
            if (icon) icon.classList.remove('rotate-180');
        } else {
            // Open this step (without closing others)
            content.style.display = 'block';
            setTimeout(() => {
                content.classList.remove('max-h-0', 'opacity-0');
                content.classList.add('max-h-[5000px]', 'opacity-100');
            }, 10);
            button.setAttribute('aria-expanded', 'true');
            button.classList.remove('border-gray-200', 'bg-gray-50');
            button.classList.add('border-blue-500', 'bg-blue-50');
            if (icon) icon.classList.add('rotate-180');
        }
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
                    feedbackDiv.className = 'mt-1.5 p-2 rounded border-2 border-green-500 bg-green-50';
                    feedbackDiv.innerHTML = `
                        <p class="text-xs text-green-800 font-medium">✓ Correct!</p>
                        ${explanation ? `<p class="text-xs text-green-700 mt-1 leading-relaxed">${explanation}</p>` : ''}
                    `;
                    trueRadio.disabled = true;
                    falseRadio.disabled = true;
                } else {
                    feedbackDiv.className = 'mt-1.5 p-2 rounded border-2 border-red-500 bg-red-50';
                    const correctText = correctAnswer ? 'Waar' : 'Onwaar';
                    feedbackDiv.innerHTML = `
                        <p class="text-xs text-red-800 font-medium">✗ Onjuist. Het juiste antwoord is: <strong>${correctText}</strong></p>
                        ${explanation ? `<p class="text-xs text-red-700 mt-1 leading-relaxed">${explanation}</p>` : ''}
                    `;
                    trueRadio.disabled = true;
                    falseRadio.disabled = true;
                }
            }
        });
        
        resultDiv.classList.remove('hidden');
        
        if (correctCount === totalCount && totalCount > 0) {
            resultDiv.className = 'mt-3 p-2.5 rounded-lg border-2 border-green-500 bg-green-50';
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
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveRenderer;
} else {
    window.InteractiveRenderer = InteractiveRenderer;
}

