/**
 * ChecklistRenderer
 * 
 * Utility voor het renderen van verschillende checklist componenten:
 * - SMART Checklist
 * - Learning Objectives Checklist
 * - Concept Quality Checklist
 */

class ChecklistRenderer {
    /**
     * Render een SMART checklist
     * @param {Object} item - SMART checklist item met doelstelling
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
                <div class="border border-gray-200 dark:border-gray-700 rounded p-2 mb-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center space-x-2 flex-1 min-w-0">
                            <div class="flex-shrink-0">
                                <div class="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <span class="font-bold text-blue-700 dark:text-blue-300 text-xs">${criterion.letter}</span>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-semibold text-gray-900 dark:text-white text-xs leading-tight">${criterion.name}</h4>
                                <p class="text-xs text-gray-600 dark:text-gray-400 leading-tight mt-0.5">${criterion.description}</p>
                            </div>
                        </div>
                        <label class="flex items-center cursor-pointer ml-2 flex-shrink-0">
                            <input 
                                type="checkbox" 
                                id="${criterionId}"
                                class="smart-checkbox w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                                data-criterion="${criterion.letter}"
                            />
                            <span class="ml-1.5 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Aanwezig</span>
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
            <div class="smart-checklist-container mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700" id="${checklistId}">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Analyseer deze doelstelling op SMART-criteria:</h3>
                <div class="bg-white dark:bg-gray-800 border-l-4 border-blue-500 dark:border-blue-400 p-2.5 mb-2.5 rounded-r-lg">
                    <p class="text-gray-800 dark:text-gray-200 text-sm font-medium leading-snug">${item.doelstelling}</p>
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
     * @param {string} checklistId - ID of the checklist container
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
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800';
                        feedbackContent.textContent = '✓ Correct! De doelstelling is specifiek: duidelijk wat (communicatie verbeteren), waar (logistieke dienstverlener), en hoe (analyseren processen, ontwikkelen aanbevelingen).';
                    } else if (criterion === 'M') {
                        // Meetbaar - is NIET aanwezig volgens analyse
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800';
                        feedbackContent.textContent = '⚠ Let op: Dit criterium is eigenlijk niet volledig aanwezig. "Verbeteren" is vaag - hoe meet je verbetering? Voeg concrete indicatoren toe (bijv. reductie conflicten, tevredenheidsscore).';
                    } else if (criterion === 'A') {
                        // Acceptabel/Haalbaar - is aanwezig
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800';
                        feedbackContent.textContent = '✓ Correct! De doelstelling is haalbaar binnen de beschikbare tijd en middelen voor een studentenonderzoek.';
                    } else if (criterion === 'R') {
                        // Relevant - is aanwezig
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800';
                        feedbackContent.textContent = '✓ Correct! De doelstelling draagt direct bij aan het oplossen van het praktijkprobleem (communicatieproblemen).';
                    } else if (criterion === 'T') {
                        // Tijdgebonden - is aanwezig
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800';
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
                        feedbackContent.className = 'text-xs p-1.5 rounded bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800';
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
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20';
            resultTitle.textContent = '✓ Uitstekend!';
            resultTitle.className = 'font-semibold mb-1.5 text-green-800 text-sm';
            resultText.textContent = 'Je hebt geïdentificeerd dat alle SMART-criteria aanwezig zijn. Let wel op: het criterium "Meetbaar" is eigenlijk niet volledig aanwezig - overweeg dit te verbeteren.';
            resultText.className = 'text-xs text-green-800';
            resultList.innerHTML = '';
        } else if (checkedCount >= 3) {
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-yellow-500 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
            resultTitle.textContent = '⚠ Goed bezig';
            resultTitle.className = 'font-semibold mb-1.5 text-yellow-800 dark:text-yellow-200 text-sm';
            resultText.textContent = `Je hebt ${checkedCount} van de 5 SMART-criteria geïdentificeerd. Bekijk de feedback bij elk criterium hierboven voor meer details.`;
            resultText.className = 'text-xs text-yellow-800 dark:text-yellow-200';
            resultList.className = 'mt-1.5 space-y-0.5 text-xs text-yellow-800 dark:text-yellow-200';
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
                        <span class="flex-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${isChecked ? 'text-green-700 dark:text-green-400 font-medium' : ''}" style="word-break: break-word; hyphens: auto;">
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
                                <span class="text-xs font-bold text-gray-700 dark:text-gray-300">${percentage}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2.5">${item.description || 'Vink de leerdoelen af die je hebt behaald:'}</p>
                <div class="space-y-1">
                    ${itemsHtml}
                </div>
                ${percentage === 100 ? `
                    <div class="mt-2.5 p-2 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-lg">
                        <p class="text-xs text-green-800 dark:text-green-200 font-medium text-center">
                            🎉 Gefeliciteerd! Je hebt alle leerdoelen behaald!
                        </p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Load learning objectives state from localStorage
     * @param {string} storageKey - Key for localStorage
     * @returns {Array} Array of boolean values
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
     * @param {string} checklistId - ID of the checklist container
     * @param {string} storageKey - Key for localStorage
     * @param {number} index - Index of the objective
     */
    static updateLearningObjective(checklistId, storageKey, index) {
        const checkbox = document.getElementById(`${checklistId}-${index}`);
        const objectiveText = checkbox.closest('label').querySelector('span');
        const savedState = this.loadLearningObjectivesState(storageKey);
        
        savedState[index] = checkbox.checked;
        localStorage.setItem(storageKey, JSON.stringify(savedState));
        
        // Update visual state
        if (checkbox.checked) {
            objectiveText.classList.remove('text-gray-700', 'dark:text-gray-300', 'line-through', 'text-gray-500', 'dark:text-gray-500');
            objectiveText.classList.add('text-green-700', 'dark:text-green-400', 'font-medium');
        } else {
            objectiveText.classList.remove('text-green-700', 'dark:text-green-400', 'font-medium');
            objectiveText.classList.add('text-gray-700', 'dark:text-gray-300');
        }
        
        // Update progress indicator
        this.updateLearningObjectivesProgress(checklistId, storageKey);
    }

    /**
     * Update progress indicator
     * @param {string} checklistId - ID of the checklist container
     * @param {string} storageKey - Key for localStorage
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
                msgDiv.className = 'mt-3 p-2.5 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-lg';
                msgDiv.innerHTML = '<p class="text-sm text-green-800 dark:text-green-200 font-medium text-center">🎉 Gefeliciteerd! Je hebt alle leerdoelen behaald!</p>';
                checklist.appendChild(msgDiv);
            }
        } else if (completionMsg) {
            completionMsg.remove();
        }
    }

    /**
     * Render een concept quality checklist
     * @param {Object} item - Concept quality checklist item met concept en definition
     * @returns {string} HTML string
     */
    static renderConceptQualityChecklist(item) {
        if (!item.concept || !item.definition) {
            console.warn('Concept quality checklist missing concept or definition:', item);
            return '';
        }

        const checklistId = `concept-quality-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Default criteria with letters
        const criteria = item.criteria || [
            {
                letter: 'A',
                name: "Afbakening",
                description: "Is tijd en plaats toegevoegd?",
                question: "Welke locatie en periode worden bedoeld?"
            },
            {
                letter: 'O',
                name: "Operationalisatie",
                description: "Zijn er waarneembare indicatoren?",
                question: "Kun je het begrip meten of observeren?"
            },
            {
                letter: 'S',
                name: "Aansluiting",
                description: "Sluit het aan bij doelstelling en hoofdvraag?",
                question: "Helpt deze definitie om de doelstelling te bereiken?"
            }
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
                                <p class="text-xs text-gray-600 dark:text-gray-400 leading-tight mt-0.5">${criterion.description}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 ml-2 flex-shrink-0">
                            <label class="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="${criterionId}-status"
                                    value="aanwezig"
                                    id="${criterionId}-aanwezig"
                                    class="concept-quality-radio w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    data-criterion="${criterion.letter}"
                                    onchange="InteractiveRenderer.updateConceptQualityStatus('${checklistId}', '${criterion.letter}')"
                                />
                                <span class="ml-1.5 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Aanwezig</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="${criterionId}-status"
                                    value="afwezig"
                                    id="${criterionId}-afwezig"
                                    class="concept-quality-radio w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    data-criterion="${criterion.letter}"
                                    onchange="InteractiveRenderer.updateConceptQualityStatus('${checklistId}', '${criterion.letter}')"
                                />
                                <span class="ml-1.5 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Afwezig</span>
                            </label>
                        </div>
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

        // Escape definition for data attribute
        const definitionEscaped = item.definition.replace(/"/g, '&quot;');
        
        return `
            <div class="concept-quality-checklist-container mb-6 bg-gray-50 rounded-lg p-3" id="${checklistId}" data-definition="${definitionEscaped}">
                <h3 class="text-base font-semibold text-gray-900 mb-2">${item.title || 'Analyseer deze begripsdefinitie op kwaliteitscriteria:'}</h3>
                <div class="bg-white border-l-4 border-blue-500 p-2.5 mb-2.5 rounded-r-lg">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1"><strong>Begrip:</strong> ${item.concept}</p>
                    <p class="text-gray-800 text-sm font-medium leading-snug">${item.definition}</p>
                </div>
                <div class="space-y-1">
                    ${criteriaHtml}
                </div>
                ${resultHtml}
                <button 
                    onclick="InteractiveRenderer.showConceptQualityResult('${checklistId}')"
                    class="mt-2.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                    Bekijk analyse
                </button>
            </div>
        `;
    }

    /**
     * Check if definition contains time and place
     * @param {string} definition - Definition text to check
     * @returns {Object} Object with hasPlace, hasTime, and bothPresent
     */
    static checkAfbakening(definition) {
        const definitionLower = definition.toLowerCase();
        
        // Check for place indicators - must be specific location, not just generic words
        // Look for patterns like "binnen het crossdock", "van organisatie X", "op locatie Y"
        const placePatterns = [
            /binnen\s+(het|de|een)\s+[\w]+/i,  // "binnen het crossdock"
            /op\s+(het|de|een)\s+[\w]+/i,      // "op het magazijn"
            /van\s+[\w]+\s+[\w]+/i,           // "van logistiek dienstverlener HML"
            /bij\s+[\w]+\s+[\w]+/i,           // "bij organisatie X"
            /locatie\s+[\w]+/i,                // "locatie Rotterdam"
            /vestiging\s+[\w]+/i,              // "vestiging Amsterdam"
            /afdeling\s+[\w]+/i,              // "afdeling logistiek"
            /\b(crossdock|warehouse|magazijn|depot|terminal)\b/i
        ];
        const hasPlace = placePatterns.some(pattern => pattern.test(definition));
        
        // Check for time indicators - must be specific time period, not just "per dag" (which is a measurement)
        const timePatterns = [
            /periode\s+[\w]+/i,                // "periode 2024"
            /van\s+\w+\s+tot\s+\w+/i,          // "van januari tot december"
            /tussen\s+[\w]+\s+en\s+[\w]+/i,    // "tussen 2020 en 2024"
            /gedurende\s+[\w]+/i,              // "gedurende 2024"
            /\b(20\d{2})\b/,                   // years like 2024, 2023
            /\b(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)\b/i,
            /\b(q1|q2|q3|q4)\s+20\d{2}/i,     // "q1 2024"
            /vanaf\s+[\w]+/i,                  // "vanaf januari"
            /tot\s+en\s+met\s+[\w]+/i          // "tot en met december"
        ];
        const hasTime = timePatterns.some(pattern => pattern.test(definition));
        
        return { hasPlace, hasTime, bothPresent: hasPlace && hasTime };
    }

    /**
     * Check if definition contains observable/measurable indicators
     * @param {string} definition - Definition text to check
     * @returns {Object} Object with hasMeasurable, hasObservable, and hasIndicators
     */
    static checkOperationalisatie(definition) {
        const definitionLower = definition.toLowerCase();
        
        // Check for measurable indicators (quantitative)
        const measurablePatterns = [
            /gemeten\s+in/i,                    // "gemeten in"
            /aantal\s+[\w]+/i,                 // "aantal verplaatsingen"
            /percentage/i,                      // "percentage"
            /\d+\s*(per|op|in)/i,              // "10 per dag", "5 op 10"
            /score/i,                          // "score"
            /schaal/i,                         // "schaal"
            /frequentie/i,                     // "frequentie"
            /hoeveelheid/i,                    // "hoeveelheid"
            /volume/i,                         // "volume"
            /capaciteit/i                      // "capaciteit"
        ];
        const hasMeasurable = measurablePatterns.some(pattern => pattern.test(definition));
        
        // Check for observable indicators (qualitative)
        const observablePatterns = [
            /met\s+behulp\s+van/i,             // "met behulp van"
            /door\s+middel\s+van/i,            // "door middel van"
            /gebruik\s+van/i,                  // "gebruik van"
            /(forklift|conveyor|robot|systeem|machine|apparaat)/i,  // specific tools/systems
            /(zone|gebied|locatie|plek|ruimte)/i,  // specific locations
            /(proces|stap|fase|handeling)/i,   // specific processes
            /waarneembaar/i,                   // "waarneembaar"
            /observeerbaar/i,                  // "observeerbaar"
            /zichtbaar/i,                      // "zichtbaar"
            /concreet/i                        // "concreet"
        ];
        const hasObservable = observablePatterns.some(pattern => pattern.test(definition));
        
        return { hasMeasurable, hasObservable, hasIndicators: hasMeasurable || hasObservable };
    }

    /**
     * Update concept quality status and show feedback
     * @param {string} checklistId - ID of the checklist container
     * @param {string} criterionLetter - Letter of the criterion (A, O, S)
     */
    static updateConceptQualityStatus(checklistId, criterionLetter) {
        const criterionId = `${checklistId}-${criterionLetter.toLowerCase()}`;
        const aanwezigRadio = document.getElementById(`${criterionId}-aanwezig`);
        const afwezigRadio = document.getElementById(`${criterionId}-afwezig`);
        const feedbackDiv = document.getElementById(`${criterionId}-feedback`);
        const feedbackContent = document.getElementById(`${criterionId}-feedback-content`);
        
        if (!feedbackDiv || !feedbackContent) return;
        
        // Get the definition text from data attribute
        const checklist = document.getElementById(checklistId);
        const definition = checklist ? (checklist.getAttribute('data-definition') || '').replace(/&quot;/g, '"') : '';
        
        feedbackDiv.classList.remove('hidden');
        
        if (aanwezigRadio && aanwezigRadio.checked) {
            // Criterium is aanwezig
            if (criterionLetter === 'A') {
                // Check if both time and place are present
                const afbakeningCheck = this.checkAfbakening(definition);
                if (afbakeningCheck.bothPresent) {
                    feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 text-green-800 border border-green-200';
                    feedbackContent.textContent = '✓ Correct! De definitie bevat zowel tijd als plaats. De afbakening is compleet.';
                } else {
                    feedbackContent.className = 'text-xs p-1.5 rounded bg-orange-50 text-orange-800 border border-orange-200';
                    let missingParts = [];
                    let explanation = '';
                    
                    if (!afbakeningCheck.hasPlace) missingParts.push('plaats');
                    if (!afbakeningCheck.hasTime) {
                        missingParts.push('tijdsperiode');
                        explanation = ' Let op: "per dag" is een meeteenheid (frequentie), niet een tijdsperiode voor afbakening. Voor afbakening heb je een specifieke periode nodig zoals "in 2024" of "van januari tot december".';
                    }
                    
                    feedbackContent.textContent = `⚠ Controleer opnieuw: De definitie bevat niet zowel tijd als plaats. Er ontbreekt: ${missingParts.join(' en ')}.${explanation} Voor een goede afbakening moeten beide aanwezig zijn.`;
                }
            } else if (criterionLetter === 'O') {
                // Check if definition has observable/measurable indicators
                const operationalisatieCheck = this.checkOperationalisatie(definition);
                if (operationalisatieCheck.hasIndicators) {
                    feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 text-green-800 border border-green-200';
                    let indicatorTypes = [];
                    if (operationalisatieCheck.hasMeasurable) indicatorTypes.push('meetbare');
                    if (operationalisatieCheck.hasObservable) indicatorTypes.push('observeerbare');
                    feedbackContent.textContent = `✓ Correct! De definitie bevat ${indicatorTypes.join(' en/of ')} indicatoren. Controleer of deze expliciet en duidelijk geformuleerd zijn.`;
                } else {
                    feedbackContent.className = 'text-xs p-1.5 rounded bg-orange-50 text-orange-800 border border-orange-200';
                    feedbackContent.textContent = '⚠ Controleer opnieuw: De definitie bevat geen waarneembare indicatoren. Voor operationalisatie heb je meetbare elementen (zoals "aantal", "percentage", "gemeten in") of observeerbare elementen (zoals specifieke systemen, processen of locaties) nodig.';
                }
            } else if (criterionLetter === 'S') {
                feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 text-green-800 border border-green-200';
                feedbackContent.innerHTML = '✓ Correct! De definitie sluit aan bij de doelstelling en hoofdvraag. <strong>Let op:</strong> Het is nu lastig te beoordelen of de aansluiting er daadwerkelijk is omdat de doelstelling en hoofdvraag niet gegeven zijn. <strong>Hoe kun je de aansluiting controleren?</strong> Vergelijk de begrippen in je definitie met de begrippen in je doelstelling en hoofdvraag. Zijn dezelfde kernbegrippen gebruikt? Sluit de scope van je definitie aan bij wat je in je doelstelling wilt bereiken? Controleer of de scope niet te breed of te smal is.';
            }
        } else if (afwezigRadio && afwezigRadio.checked) {
            // Criterium is afwezig
            if (criterionLetter === 'A') {
                // Check if both time and place are missing
                const afbakeningCheck = this.checkAfbakening(definition);
                if (!afbakeningCheck.bothPresent) {
                    feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 text-green-800 border border-green-200';
                    let missingParts = [];
                    let explanation = '';
                    
                    if (!afbakeningCheck.hasPlace) missingParts.push('plaats');
                    if (!afbakeningCheck.hasTime) {
                        missingParts.push('tijdsperiode');
                        explanation = ' Let op: "per dag" is een meeteenheid (frequentie), niet een tijdsperiode voor afbakening. Voor afbakening heb je een specifieke periode nodig zoals "in 2024" of "van januari tot december".';
                    }
                    
                    feedbackContent.textContent = `✓ Goed gezien! Je hebt correct geïdentificeerd dat de definitie mist: ${missingParts.join(' en ')}.${explanation} Voeg tijd en plaats toe als dit relevant is voor je onderzoek om de scope duidelijk te maken.`;
                } else {
                    feedbackContent.className = 'text-xs p-1.5 rounded bg-yellow-50 text-yellow-800 border border-yellow-200';
                    feedbackContent.textContent = '⚠ Controleer opnieuw: De definitie bevat wel tijd en/of plaats. Bekijk de definitie nogmaals aandachtig.';
                }
            } else if (criterionLetter === 'O') {
                // Check if definition has observable/measurable indicators
                const operationalisatieCheck = this.checkOperationalisatie(definition);
                if (!operationalisatieCheck.hasIndicators) {
                    feedbackContent.className = 'text-xs p-1.5 rounded bg-green-50 text-green-800 border border-green-200';
                    feedbackContent.textContent = '✓ Goed gezien! Je hebt correct geïdentificeerd dat de definitie mist: waarneembare indicatoren. Voeg meetbare elementen (zoals "aantal", "percentage", "gemeten in") of observeerbare elementen (zoals specifieke systemen, processen of locaties) toe om het begrip te operationaliseren.';
                } else {
                    feedbackContent.className = 'text-xs p-1.5 rounded bg-yellow-50 text-yellow-800 border border-yellow-200';
                    let indicatorTypes = [];
                    if (operationalisatieCheck.hasMeasurable) indicatorTypes.push('meetbare');
                    if (operationalisatieCheck.hasObservable) indicatorTypes.push('observeerbare');
                    feedbackContent.textContent = `⚠ Controleer opnieuw: De definitie bevat wel ${indicatorTypes.join(' en/of ')} indicatoren. Bekijk de definitie nogmaals aandachtig.`;
                }
            } else if (criterionLetter === 'S') {
                feedbackContent.className = 'text-xs p-1.5 rounded bg-yellow-50 text-yellow-800 border border-yellow-200';
                feedbackContent.innerHTML = '⚠ Let op: De definitie sluit mogelijk niet goed aan bij de doelstelling en hoofdvraag. Het is nu lastig te beoordelen of de aansluiting er is omdat de doelstelling en hoofdvraag niet gegeven zijn. <strong>Hoe kun je de aansluiting controleren?</strong> Vergelijk de begrippen in je definitie met de begrippen in je doelstelling en hoofdvraag. Zijn dezelfde kernbegrippen gebruikt? Sluit de scope van je definitie aan bij wat je in je doelstelling wilt bereiken? Pas de definitie aan of herzie je doelstelling/hoofdvraag als ze niet op elkaar aansluiten.';
            }
        }
    }

    /**
     * Show concept quality checklist result
     * Based on actual analysis of the definition
     * @param {string} checklistId - ID of the checklist container
     */
    static showConceptQualityResult(checklistId) {
        const radios = document.querySelectorAll(`#${checklistId} .concept-quality-radio`);
        const resultDiv = document.getElementById(`${checklistId}-result`);
        const resultTitle = document.getElementById(`${checklistId}-result-title`);
        const resultText = document.getElementById(`${checklistId}-result-text`);
        const resultList = document.getElementById(`${checklistId}-result-list`);

        if (!resultDiv || !resultTitle || !resultText || !resultList) return;

        // Initialize variables
        let aanwezigCount = 0;
        let afwezigCount = 0;
        let nietBeoordeeldCount = 0;
        const aanwezigCriteria = [];
        const afwezigCriteria = [];
        const nietBeoordeeldCriteria = [];

        // Clear result div first
        resultDiv.classList.add('hidden');
        resultDiv.className = 'hidden mt-2.5 p-2.5 rounded-lg border-2';
        resultList.innerHTML = '';

        // Group radios by criterion
        const criterionGroups = {};
        radios.forEach(radio => {
            const criterion = radio.getAttribute('data-criterion');
            if (!criterionGroups[criterion]) {
                criterionGroups[criterion] = { aanwezig: null, afwezig: null, name: '' };
            }
            if (radio.value === 'aanwezig') {
                criterionGroups[criterion].aanwezig = radio;
            } else {
                criterionGroups[criterion].afwezig = radio;
            }
            if (!criterionGroups[criterion].name) {
                const criterionElement = radio.closest('.border');
                criterionGroups[criterion].name = criterionElement.querySelector('h4').textContent;
            }
        });

        // Count criteria
        Object.keys(criterionGroups).forEach(letter => {
            const group = criterionGroups[letter];
            if (group.aanwezig && group.aanwezig.checked) {
                aanwezigCount++;
                aanwezigCriteria.push({ letter, name: group.name });
            } else if (group.afwezig && group.afwezig.checked) {
                afwezigCount++;
                afwezigCriteria.push({ letter, name: group.name });
            } else {
                nietBeoordeeldCount++;
                nietBeoordeeldCriteria.push({ letter, name: group.name });
            }
        });

        // Show overall result
        resultDiv.classList.remove('hidden');

        if (nietBeoordeeldCount > 0) {
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-blue-500 bg-blue-50';
            resultTitle.textContent = '💡 Beoordeel alle criteria';
            resultTitle.className = 'font-semibold mb-1.5 text-blue-800 text-sm';
            resultText.textContent = `Je hebt nog ${nietBeoordeeldCount} criterium/criteria niet beoordeeld. Beoordeel alle criteria om een volledige analyse te krijgen.`;
            resultText.className = 'text-xs text-blue-800';
            resultList.className = 'mt-1.5 space-y-0.5 text-xs text-blue-800';
            resultList.innerHTML = nietBeoordeeldCriteria.map(c => `<li>• ${c.letter}: ${c.name} (nog niet beoordeeld)</li>`).join('');
        } else if (aanwezigCount === 3) {
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20';
            resultTitle.textContent = '✓ Uitstekend!';
            resultTitle.className = 'font-semibold mb-1.5 text-green-800 text-sm';
            resultText.textContent = 'Je hebt geïdentificeerd dat alle kwaliteitscriteria aanwezig zijn. De definitie voldoet aan alle eisen. Controleer de feedback bij elk criterium hierboven voor meer details.';
            resultText.className = 'text-xs text-green-800';
            resultList.innerHTML = '';
        } else if (aanwezigCount >= 2) {
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-yellow-500 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
            resultTitle.textContent = '⚠ Goed bezig';
            resultTitle.className = 'font-semibold mb-1.5 text-yellow-800 text-sm';
            resultText.textContent = `Je hebt ${aanwezigCount} van de 3 kwaliteitscriteria als aanwezig geïdentificeerd. ${afwezigCount > 0 ? `Er ${afwezigCount === 1 ? 'is' : 'zijn'} ${afwezigCount} criterium/criteria afwezig.` : ''} Bekijk de feedback bij elk criterium hierboven voor verbeterpunten.`;
            resultText.className = 'text-xs text-yellow-800';
            resultList.className = 'mt-1.5 space-y-0.5 text-xs text-yellow-800';
            const listItems = [];
            if (afwezigCriteria.length > 0) {
                listItems.push(...afwezigCriteria.map(c => `<li>• ${c.letter}: ${c.name} (afwezig)</li>`));
            }
            resultList.innerHTML = listItems.join('');
        } else {
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20';
            resultTitle.textContent = '⚠ Aandacht vereist';
            resultTitle.className = 'font-semibold mb-1.5 text-red-800 text-sm';
            resultText.textContent = `Je hebt ${aanwezigCount} van de 3 kwaliteitscriteria als aanwezig geïdentificeerd. Er ${afwezigCount === 1 ? 'is' : 'zijn'} ${afwezigCount} criterium/criteria afwezig. Werk de definitie bij om aan alle kwaliteitscriteria te voldoen.`;
            resultText.className = 'text-xs text-red-800';
            resultList.className = 'mt-1.5 space-y-0.5 text-xs text-red-800';
            resultList.innerHTML = afwezigCriteria.map(c => `<li>• ${c.letter}: ${c.name} (afwezig)</li>`).join('');
        }
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChecklistRenderer;
} else {
    window.ChecklistRenderer = ChecklistRenderer;
}

