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
     * @param {boolean} isNested - Whether this accordion is nested inside another accordion
     * @returns {string} HTML string
     */
    static renderAccordion(item, isNested = false) {
        if (!item.items || !Array.isArray(item.items) || item.items.length === 0) {
            console.warn('Accordion item missing items array:', item);
            return '';
        }

        const accordionId = `accordion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const usePlusIcon = item.usePlusIcon === true; // Use plus icon if explicitly set to true
        
        const accordionItems = item.items.map((accordionItem, index) => {
            const itemId = `${accordionId}-item-${index}`;
            const contentId = `${accordionId}-content-${index}`;
            // Check if item should be open: use item defaultOpen, then accordionItem defaultOpen, then default behavior
            const isOpen = accordionItem.defaultOpen === true || (!usePlusIcon && index === 0 && item.defaultOpen !== false);
            
            // Render content - can be string, array of strings, or array of content items
            let contentHtml = '';
            if (Array.isArray(accordionItem.content)) {
                // Check if it contains any content items (objects with type property)
                const hasContentItems = accordionItem.content.some(item => 
                    typeof item === 'object' && 
                    item !== null && 
                    item.type !== undefined
                );
                
                if (hasContentItems && typeof window.ContentRenderer !== 'undefined') {
                    // Render as content items (can be mixed with strings)
                    contentHtml = accordionItem.content.map(item => {
                        if (typeof item === 'object' && item !== null && item.type !== undefined) {
                            // It's a content item, render it
                            console.log('[InteractiveRenderer] Rendering content item in accordion:', item.type);
                            // If it's an accordion, mark it as nested
                            if (item.type === 'accordion') {
                                return InteractiveRenderer.renderAccordion(item, true);
                            }
                            const rendered = ContentRenderer.renderContentItems([item]);
                            console.log('[InteractiveRenderer] Rendered content item, length:', rendered ? rendered.length : 0);
                            return rendered;
                        } else if (typeof item === 'string') {
                            // It's a string, render as HTML if it starts with <, otherwise as paragraph
                            if (item.trim().startsWith('<')) {
                                return item; // Already HTML
                            }
                            return `<p class="text-gray-700 mb-3">${item}</p>`;
                        }
                        return '';
                    }).join('');
                } else {
                    // Render as strings
                    contentHtml = accordionItem.content.map(text => {
                        if (typeof text === 'string' && text.trim().startsWith('<')) {
                            return text; // Already HTML
                        }
                        return `<p class="text-gray-700 mb-3">${text}</p>`;
                    }).join('');
                }
            } else if (typeof accordionItem.content === 'string') {
                contentHtml = `<p class="text-gray-700 mb-3">${accordionItem.content}</p>`;
            }

            // Choose icon based on usePlusIcon setting
            const iconClass = usePlusIcon 
                ? `fas fa-plus transform transition-transform duration-200 ${isOpen ? 'rotate-45' : ''} text-gray-600`
                : `fas fa-chevron-down transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-600`;

            // Different styling for nested accordions (like clickable steps - no border, seamless)
            const containerClass = isNested 
                ? `mb-3 overflow-hidden` 
                : `border border-gray-200 rounded-lg mb-3 overflow-hidden`;
            const buttonClass = isNested
                ? `w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 flex items-center justify-between text-left font-semibold text-lg text-gray-600 cursor-pointer touch-manipulation`
                : `w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 flex items-center justify-between text-left cursor-pointer touch-manipulation`;
            const contentBgClass = isNested
                ? `bg-white`
                : `bg-white`;

            return `
                <div class="${containerClass}">
                    <button
                        class="${buttonClass}"
                        onclick="InteractiveRenderer.toggleAccordion('${contentId}', '${itemId}', ${usePlusIcon})"
                        aria-expanded="${isOpen}"
                        aria-controls="${contentId}"
                        id="${itemId}"
                    >
                        ${isNested ? `<span>${accordionItem.title}</span>` : `<span class="font-semibold text-gray-900 text-lg">${accordionItem.title}</span>`}
                        <i class="${iconClass}" id="${itemId}-icon"></i>
                    </button>
                    <div
                        id="${contentId}"
                        class="accordion-content overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} ${contentBgClass}"
                        aria-hidden="${!isOpen}"
                        style="${isOpen ? '' : 'display: none;'}"
                    >
                        <div class="px-6 py-4">
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
     * @param {boolean} usePlusIcon - Whether to use plus icon rotation
     */
    static toggleAccordion(contentId, buttonId, usePlusIcon = false) {
        const content = document.getElementById(contentId);
        const button = document.getElementById(buttonId);
        const icon = document.getElementById(`${buttonId}-icon`);
        
        if (!content || !button) {
            console.warn('Accordion elements not found:', { contentId, buttonId, content: !!content, button: !!button });
            return;
        }

        const isOpen = content.classList.contains('max-h-[5000px]') || content.style.display === 'block';
        
        if (isOpen) {
            // Close
            content.classList.remove('max-h-[5000px]', 'opacity-100');
            content.classList.add('max-h-0', 'opacity-0');
            button.setAttribute('aria-expanded', 'false');
            if (icon) {
                if (usePlusIcon) {
                    icon.classList.remove('rotate-45');
                } else {
                    icon.classList.remove('rotate-180');
                }
            }
            setTimeout(() => {
                content.style.display = 'none';
            }, 300);
        } else {
            // Open
            content.style.display = 'block';
            button.setAttribute('aria-expanded', 'true');
            if (icon) {
                if (usePlusIcon) {
                    icon.classList.add('rotate-45');
                } else {
                    icon.classList.add('rotate-180');
                }
            }
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                content.classList.remove('max-h-0', 'opacity-0');
                content.classList.add('max-h-[5000px]', 'opacity-100');
            });
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
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[120px] bg-gray-50 overflow-hidden" id="${categoryId}" 
                     ondrop="InteractiveRenderer.handleDrop(event, '${exerciseId}', ${catIndex})" 
                     ondragover="InteractiveRenderer.allowDrop(event)"
                     style="word-wrap: break-word; overflow-wrap: break-word;">
                    <h4 class="font-semibold text-gray-900 mb-2 text-sm break-words">${category.name}</h4>
                    <p class="text-xs text-gray-600 mb-2 break-words">${category.description || ''}</p>
                    <div class="dropped-items space-y-2 break-words" id="${categoryId}-items" style="word-wrap: break-word; overflow-wrap: break-word;"></div>
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
                    style="word-wrap: break-word; overflow-wrap: break-word; max-width: 100%;"
                >
                    <p class="text-sm text-gray-800 break-words" style="word-wrap: break-word; overflow-wrap: break-word; hyphens: auto;">${itemObj.text}</p>
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
            }
            #${exerciseId} .matching-item p {
                word-wrap: break-word;
                overflow-wrap: break-word;
                hyphens: auto;
                margin: 0;
            }
            #${exerciseId} .dropped-items {
                word-wrap: break-word;
                overflow-wrap: break-word;
                max-width: 100%;
            }
            #${exerciseId} .dropped-items .matching-item {
                max-width: 100%;
                box-sizing: border-box;
            }
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
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="${exerciseId}-items-container" style="word-wrap: break-word; overflow-wrap: break-word;">
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
        
        // Move item to new category
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
        
        // Debug: log that we're rendering clickable steps
        console.log('Rendering clickable steps:', item.steps.length, 'steps');
        
        // Render content for steps (expandable)
        const renderStepContent = (stepContent) => {
            if (!stepContent) return '';
            
            if (Array.isArray(stepContent)) {
                // Always check if any item contains HTML tags (like <table>, <div>, etc.)
                const hasHtmlTags = stepContent.some(item => {
                    if (typeof item === 'string') {
                        return /<[a-z][\s\S]*>/i.test(item);
                    }
                    return false;
                });
                
                // If HTML tags are found, render all content as raw HTML
                if (hasHtmlTags) {
                    return stepContent.map(item => {
                        // If it's an object with a type, render it using ContentRenderer
                        if (typeof item === 'object' && item !== null && item.type) {
                            if (typeof window.ContentRenderer !== 'undefined') {
                                return ContentRenderer.renderContentItems([item]);
                            }
                            return '';
                        }
                        // If it's a string, return as is (HTML will be preserved)
                        if (typeof item === 'string') {
                            return item;
                        }
                        return '';
                    }).join('');
                }
                
                // Otherwise, render normally (for text content)
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
                // Check if string contains HTML tags
                if (/<[a-z][\s\S]*>/i.test(stepContent)) {
                    return stepContent;
                }
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
            
            // Get content HTML for this step
            let stepContentHtml = '';
            if (hasContent) {
                stepContentHtml = renderStepContent(step.content);
            }
            
            // Determine if step is open (all steps closed by default)
            const isOpen = false;
            
            const buttonHtml = `
                <button
                    class="w-full px-6 py-4 font-semibold text-lg transition-colors duration-200 ${isOpen ? 'bg-white text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} text-left"
                    ${hasContent ? `onclick="InteractiveRenderer.toggleClickableStep('${stepsId}', ${index})"` : ''}
                    ${!hasContent ? 'disabled' : ''}
                    id="${stepId}-button"
                    aria-expanded="${isOpen}"
                    aria-controls="${stepId}-content"
                >
                    <div class="flex items-center justify-between">
                        <span>${step.label || `Stap ${index + 1}`}</span>
                        ${hasContent ? `
                            <i class="fas fa-chevron-down transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}" id="${stepId}-icon"></i>
                        ` : `
                            <span class="text-xs text-gray-400 italic">(Binnenkort beschikbaar)</span>
                        `}
                    </div>
                </button>
            `;

            // Wrap button and content in a container for consistent spacing
            if (hasContent) {
                return `
                    <div class="clickable-step-wrapper">
                        ${buttonHtml}
                        <div
                            id="${stepId}-content"
                            class="clickable-step-content overflow-hidden transition-all duration-300 ease-in-out bg-white ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}"
                            style="${isOpen ? 'display: block;' : 'display: none;'}"
                            aria-hidden="${!isOpen}"
                        >
                            <div class="p-6">
                                ${stepContentHtml}
                            </div>
                        </div>
                    </div>
                `;
            }
            
            return `<div class="clickable-step-wrapper">${buttonHtml}</div>`;
        }).join('');

        return `
            <div class="clickable-steps-container mb-6 border border-gray-200 rounded-lg overflow-hidden bg-white" id="${stepsId}">
                <div class="space-y-0">
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

        const isOpen = content.style.display !== 'none' && content.classList.contains('opacity-100');
        
        if (isOpen) {
            // Close this step
            content.style.display = 'none';
            content.classList.remove('max-h-[5000px]', 'opacity-100');
            content.classList.add('max-h-0', 'opacity-0');
            content.setAttribute('aria-hidden', 'true');
            button.setAttribute('aria-expanded', 'false');
            
            // Update button styling
            button.classList.remove('bg-white', 'text-green-600');
            button.classList.add('bg-gray-100', 'text-gray-600');
            
            // Rotate icon
            if (icon) {
                icon.classList.remove('rotate-180');
            }
        } else {
            // Close all other steps first
            const allSteps = stepsContainer.querySelectorAll('.clickable-step-content');
            
            allSteps.forEach((stepContent) => {
                // Extract index from the content ID
                const contentId = stepContent.id;
                const match = contentId.match(/-step-(\d+)-content/);
                if (!match) return;
                
                const currentIndex = parseInt(match[1], 10);
                
                // Skip the step we're about to open
                if (currentIndex === stepIndex) return;
                
                const stepButtonId = stepContent.id.replace('-content', '-button');
                const stepButton = document.getElementById(stepButtonId);
                const stepIconId = stepContent.id.replace('-content', '-icon');
                const stepIcon = document.getElementById(stepIconId);
                
                stepContent.style.display = 'none';
                stepContent.classList.remove('max-h-[5000px]', 'opacity-100');
                stepContent.classList.add('max-h-0', 'opacity-0');
                stepContent.setAttribute('aria-hidden', 'true');
                
                if (stepButton) {
                    stepButton.setAttribute('aria-expanded', 'false');
                    stepButton.classList.remove('bg-white', 'text-green-600');
                    stepButton.classList.add('bg-gray-100', 'text-gray-600');
                }
                
                if (stepIcon) {
                    stepIcon.classList.remove('rotate-180');
                }
            });
            
            // Open this step
            content.style.display = 'block';
            content.classList.remove('max-h-0', 'opacity-0');
            content.classList.add('max-h-[5000px]', 'opacity-100');
            content.setAttribute('aria-hidden', 'false');
            button.setAttribute('aria-expanded', 'true');
            
            // Update button styling
            button.classList.remove('bg-gray-100', 'text-gray-600');
            button.classList.add('bg-white', 'text-green-600');
            
            // Rotate icon
            if (icon) {
                icon.classList.add('rotate-180');
            }
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

    /**
     * Render een tabs component
     * @param {Object} item - Tabs item met tabs array
     * @returns {string} HTML string
     */
    static renderTabs(item) {
        if (!item.tabs || !Array.isArray(item.tabs) || item.tabs.length === 0) {
            console.warn('Tabs item missing tabs array:', item);
            return '';
        }

        const tabsId = `tabs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const defaultTab = item.defaultTab || 0;
        
        const tabsButtons = item.tabs.map((tab, index) => {
            const tabId = `${tabsId}-tab-${index}`;
            const contentId = `${tabsId}-content-${index}`;
            const isActive = index === defaultTab;
            
            return `
                <button
                    class="flex-none sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-lg transition-colors duration-200 ${isActive ? 'bg-white text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} text-left cursor-pointer touch-manipulation active:bg-gray-200 whitespace-nowrap"
                    onclick="InteractiveRenderer.switchTab('${tabsId}', ${index})"
                    aria-selected="${isActive}"
                    aria-controls="${contentId}"
                    id="${tabId}"
                    role="tab"
                >
                    ${tab.title}
                </button>
            `;
        }).join('');

        const tabsContent = item.tabs.map((tab, index) => {
            const contentId = `${tabsId}-content-${index}`;
            const isActive = index === defaultTab;
            
            // Render content - can be string or array
            let contentHtml = '';
            if (Array.isArray(tab.content)) {
                contentHtml = tab.content.map(text => {
                    if (typeof text === 'string' && text.trim().startsWith('<')) {
                        return text; // Already HTML
                    }
                    return `<p class="text-gray-700 mb-3">${text}</p>`;
                }).join('');
            } else if (typeof tab.content === 'string') {
                contentHtml = `<p class="text-gray-700 mb-3">${tab.content}</p>`;
            }

            return `
                <div
                    id="${contentId}"
                    class="tab-content ${isActive ? '' : 'hidden'}"
                    role="tabpanel"
                    aria-labelledby="${tabsId}-tab-${index}"
                >
                    <div class="p-6">
                        ${contentHtml}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="tabs-container mb-6 border border-gray-200 rounded-lg overflow-hidden bg-white" id="${tabsId}">
                <div class="flex overflow-x-auto scrollbar-hide -mb-px" role="tablist" style="scrollbar-width: none; -ms-overflow-style: none;">
                    ${tabsButtons}
                </div>
                <div class="tab-content-container bg-white">
                    ${tabsContent}
                </div>
            </div>
            <style>
                /* Hide scrollbar for tablist but keep scrolling functionality */
                .tabs-container [role="tablist"]::-webkit-scrollbar {
                    display: none;
                }
                
                /* Mobile responsive tabs */
                @media (max-width: 640px) {
                    .tabs-container [role="tablist"] {
                        display: flex;
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                    }
                    
                    .tabs-container [role="tab"] {
                        flex: 0 0 auto;
                        min-width: max-content;
                        white-space: nowrap;
                    }
                }
            </style>
        `;
    }

    /**
     * Switch between tabs
     * @param {string} tabsId - ID of the tabs container
     * @param {number} tabIndex - Index of the tab to switch to
     */
    static switchTab(tabsId, tabIndex) {
        const tabsContainer = document.getElementById(tabsId);
        if (!tabsContainer) {
            console.warn('Tabs container not found:', tabsId);
            return;
        }

        const tabs = tabsContainer.querySelectorAll('[role="tab"]');
        const contents = tabsContainer.querySelectorAll('[role="tabpanel"]');
        
        if (tabs.length === 0 || contents.length === 0) {
            console.warn('Tabs or content panels not found:', { tabsId, tabsCount: tabs.length, contentsCount: contents.length });
            return;
        }

        // Update all tabs
        tabs.forEach((tab, index) => {
            const isActive = index === tabIndex;
            tab.setAttribute('aria-selected', isActive);
            
            if (isActive) {
                tab.classList.remove('bg-gray-100', 'text-gray-600', 'hover:bg-gray-200');
                tab.classList.add('bg-white', 'text-green-600');
            } else {
                tab.classList.remove('bg-white', 'text-green-600');
                tab.classList.add('bg-gray-100', 'text-gray-600', 'hover:bg-gray-200');
            }
        });

        // Update all content panels
        contents.forEach((content, index) => {
            if (index === tabIndex) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    }

    /**
     * Render een interactieve checklist voor kwaliteitscriteria begrip
     * @param {Object} item - Concept quality checklist item
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
                                <p class="text-xs text-gray-600 leading-tight mt-0.5">${criterion.description}</p>
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
                                <span class="ml-1.5 text-xs text-gray-600 whitespace-nowrap">Aanwezig</span>
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
                                <span class="ml-1.5 text-xs text-gray-600 whitespace-nowrap">Afwezig</span>
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
                    <p class="text-xs text-gray-600 mb-1"><strong>Begrip:</strong> ${item.concept}</p>
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
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-green-500 bg-green-50';
            resultTitle.textContent = '✓ Uitstekend!';
            resultTitle.className = 'font-semibold mb-1.5 text-green-800 text-sm';
            resultText.textContent = 'Je hebt geïdentificeerd dat alle kwaliteitscriteria aanwezig zijn. De definitie voldoet aan alle eisen. Controleer de feedback bij elk criterium hierboven voor meer details.';
            resultText.className = 'text-xs text-green-800';
            resultList.innerHTML = '';
        } else if (aanwezigCount >= 2) {
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-yellow-500 bg-yellow-50';
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
            resultDiv.className = 'mt-2.5 p-2.5 rounded-lg border-2 border-red-500 bg-red-50';
            resultTitle.textContent = '⚠ Aandacht vereist';
            resultTitle.className = 'font-semibold mb-1.5 text-red-800 text-sm';
            resultText.textContent = `Je hebt ${aanwezigCount} van de 3 kwaliteitscriteria als aanwezig geïdentificeerd. Er ${afwezigCount === 1 ? 'is' : 'zijn'} ${afwezigCount} criterium/criteria afwezig. Werk de definitie bij om aan alle kwaliteitscriteria te voldoen.`;
            resultText.className = 'text-xs text-red-800';
            resultList.className = 'mt-1.5 space-y-0.5 text-xs text-red-800';
            resultList.innerHTML = afwezigCriteria.map(c => `<li>• ${c.letter}: ${c.name} (afwezig)</li>`).join('');
        }
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
                <div class="border-l-2 border-gray-200 rounded p-4 mb-4 bg-white" data-scenario-id="${scenarioId}" data-correct-query="${escapedCorrectQuery}" data-explanation="${escapedExplanation}">
                    <h4 class="text-sm font-semibold text-gray-600 mb-2">Scenario ${index + 1}</h4>
                    <p class="text-sm text-gray-700 mb-3">${scenario.description}</p>
                    
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jouw query:</label>
                        <div id="${queryDisplayId}" class="min-h-[40px] p-3 bg-gray-50 border border-gray-300 rounded-md mb-2 flex flex-wrap items-center gap-2">
                            <span class="text-sm text-gray-500 italic">Klik op termen en operatoren hieronder om je query te bouwen</span>
                        </div>
                        <input type="hidden" id="${queryBuilderId}" value="" />
                    </div>

                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Zoektermen:</label>
                        <div class="flex flex-wrap">
                            ${termsHtml}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Operatoren:</label>
                        <div class="flex flex-wrap">
                            ${operatorsHtml}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Haakjes:</label>
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
            <div class="boolean-operator-exercise mb-6 bg-white rounded-lg p-4" id="${exerciseId}">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${title}</h3>
                <p class="text-sm text-gray-600 mb-4">${instruction}</p>
                
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
                return `<span class="px-1 text-gray-600 font-bold text-lg">(</span>`;
            } else if (trimmed === ')') {
                return `<span class="px-1 text-gray-600 font-bold text-lg">)</span>`;
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
            feedback.className = 'p-3 rounded-lg bg-green-50 border border-green-200';
            feedback.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-check-circle text-green-600 text-lg mr-2 mt-0.5"></i>
                    <div>
                        <p class="text-sm font-semibold text-green-900 mb-1">✓ Correct!</p>
                        <p class="text-sm text-green-800">${explanation}</p>
                    </div>
                </div>
            `;
        } else {
            feedback.className = 'p-3 rounded-lg bg-red-50 border border-red-200';
            feedback.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-times-circle text-red-600 text-lg mr-2 mt-0.5"></i>
                    <div>
                        <p class="text-sm font-semibold text-red-900 mb-1">Niet correct</p>
                        <p class="text-sm text-red-800 mb-2">Je query: <code class="bg-red-100 px-1 py-0.5 rounded">${userQuery || '(leeg)'}</code></p>
                        <p class="text-sm text-red-800 mb-2">Correcte query: <code class="bg-green-100 px-1 py-0.5 rounded">${correctQuery}</code></p>
                        <p class="text-sm text-red-800">${explanation}</p>
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
            <div class="ai-query-exercise mb-6 bg-white rounded-lg p-4" id="${exerciseId}" data-generate-from-theory="${generateFromTheory}" data-available-terms='${availableTermsStr}' data-scenario-count="0">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${title}</h3>
                <p class="text-sm text-gray-600 mb-4">${instruction}</p>
                
                <div id="${exerciseId}-scenario-container" class="hidden">
                    <div class="rounded mb-4 bg-white">
                        <div id="${exerciseId}-scenario-number" class="text-sm font-semibold text-gray-600 mb-2"></div>
                        <p id="${exerciseId}-description" class="text-sm text-gray-700 mb-3"></p>
                        
                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Beschikbare zoektermen:</label>
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
                            <label class="block text-sm font-medium text-gray-700 mb-2">Operatoren:</label>
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
                            <label class="block text-sm font-medium text-gray-700 mb-2">Haakjes:</label>
                            <div class="flex flex-wrap gap-2 mb-3">
                                <button 
                                    type="button"
                                    class="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-sm font-bold transition-colors cursor-pointer ai-query-btn"
                                    data-exercise-id="${exerciseId}"
                                    data-item="("
                                >(</button>
                                <button 
                                    type="button"
                                    class="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-sm font-bold transition-colors cursor-pointer ai-query-btn"
                                    data-exercise-id="${exerciseId}"
                                    data-item=")"
                                >)</button>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Jouw query:</label>
                            <input 
                                type="text" 
                                id="${exerciseId}-input"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            <div class="flex items-center text-sm text-gray-600">
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
                feedback.className = 'p-3 rounded-lg bg-green-50 border border-green-200';
                feedback.innerHTML = `
                    <div class="flex items-start">
                        <i class="fas fa-check-circle text-green-600 text-lg mr-2 mt-0.5"></i>
                        <div>
                            <p class="text-sm font-semibold text-green-900 mb-1">✓ Correct!</p>
                            <p class="text-sm text-green-800">${data.feedback || data.explanation}</p>
                        </div>
                    </div>
                `;
            } else {
                feedback.className = 'p-3 rounded-lg bg-yellow-50 border border-yellow-200';
                feedback.innerHTML = `
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-circle text-yellow-600 text-lg mr-2 mt-0.5"></i>
                        <div>
                            <p class="text-sm font-semibold text-yellow-900 mb-1">Feedback</p>
                            <p class="text-sm text-yellow-800 mb-2">${data.feedback || data.explanation}</p>
                            ${data.suggestedQuery ? `
                                <p class="text-sm text-yellow-800">
                                    <strong>Suggestie:</strong> <code class="bg-yellow-100 px-1 py-0.5 rounded">${data.suggestedQuery}</code>
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
            feedback.className = 'p-3 rounded-lg bg-red-50 border border-red-200';
            feedback.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-times-circle text-red-600 text-lg mr-2 mt-0.5"></i>
                    <div>
                        <p class="text-sm font-semibold text-red-900 mb-1">Fout</p>
                        <p class="text-sm text-red-800">Er is een fout opgetreden bij het valideren van je query. Probeer het opnieuw.</p>
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
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveRenderer;
} else {
    window.InteractiveRenderer = InteractiveRenderer;
}

