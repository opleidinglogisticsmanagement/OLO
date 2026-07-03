/**
 * ChecklistCopyManager
 *
 * Kopieerknop voor statische checklists in content (bijv. interview voorbereiding).
 */

class ChecklistCopyManager {
    constructor() {
        this._boundCopyHandler = this.handleCopyClick.bind(this);
    }

    /**
     * Initialiseer event listeners voor checklist kopieerknoppen
     */
    init() {
        if (window._checklistCopyButtonsSetup) {
            return;
        }
        window._checklistCopyButtonsSetup = true;
        document.addEventListener('click', this._boundCopyHandler);
    }

    /**
     * Verwerk klik op een checklist kopieerknop
     * @param {Event} e - Click event
     */
    async handleCopyClick(e) {
        const copyButton = e.target.closest('.copy-checklist-btn');
        if (!copyButton) return;

        e.preventDefault();
        e.stopPropagation();

        const checklist = this.getChecklistElement(copyButton);
        if (!checklist) {
            console.warn('Checklist content not found for copy button');
            return;
        }

        await this.copyChecklistToClipboard(checklist, copyButton);
    }

    /**
     * Zoek het checklist element bij een kopieerknop
     * @param {HTMLElement} button - De kopieerknop
     * @returns {HTMLElement|null} Checklist element
     */
    getChecklistElement(button) {
        const wrapper = button.closest('.interview-checklist-wrapper');
        if (wrapper) {
            return wrapper.querySelector('.interview-checklist-content');
        }

        const checklistId = button.getAttribute('data-checklist-id');
        if (checklistId) {
            return document.getElementById(checklistId);
        }

        return null;
    }

    /**
     * Kopieer checklist naar klembord als platte tekst
     * @param {HTMLElement} checklist - Het checklist element
     * @param {HTMLElement} button - De knop die de actie startte
     */
    async copyChecklistToClipboard(checklist, button) {
        try {
            const plainText = this.checklistToPlainText(checklist);
            await navigator.clipboard.writeText(plainText);
            this.showCopyFeedback(button, true);
        } catch (error) {
            console.error('Error copying checklist:', error);

            try {
                const textarea = document.createElement('textarea');
                textarea.value = this.checklistToPlainText(checklist);
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showCopyFeedback(button, true);
            } catch (fallbackError) {
                console.error('Fallback copy failed:', fallbackError);
                this.showCopyFeedback(button, false);
            }
        }
    }

    /**
     * Zet checklist HTML om naar leesbare platte tekst
     * @param {HTMLElement} checklist - Het checklist element
     * @returns {string} Platte tekst voor klembord
     */
    checklistToPlainText(checklist) {
        const lines = ['Checklist interview praktijkvraagstuk', ''];

        checklist.childNodes.forEach((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;

            if (node.tagName === 'P') {
                lines.push(node.textContent.trim());
                lines.push('');
            }

            if (node.tagName === 'UL') {
                node.querySelectorAll('li').forEach((item) => {
                    lines.push(item.textContent.trim());
                });
                lines.push('');
            }
        });

        return lines.join('\n').trim();
    }

    /**
     * Toon visuele feedback na kopiëren
     * @param {HTMLElement} button - De kopieerknop
     * @param {boolean} success - Of kopiëren is gelukt
     */
    showCopyFeedback(button, success) {
        const originalHTML = button.innerHTML;

        if (success) {
            button.innerHTML = `
                <i class="fas fa-check"></i>
                <span class="hidden sm:inline">Gekopieerd!</span>
            `;
            button.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'hover:bg-gray-200', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
            button.classList.add('bg-green-100', 'dark:bg-green-900/30', 'text-green-700', 'dark:text-green-400');

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('bg-green-100', 'dark:bg-green-900/30', 'text-green-700', 'dark:text-green-400');
                button.classList.add('bg-gray-100', 'dark:bg-gray-700', 'hover:bg-gray-200', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
            }, 2000);
            return;
        }

        button.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span class="hidden sm:inline">Fout</span>
        `;
        button.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
        button.classList.add('bg-red-100', 'dark:bg-red-900/30', 'text-red-700', 'dark:text-red-400');

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('bg-red-100', 'dark:bg-red-900/30', 'text-red-700', 'dark:text-red-400');
            button.classList.add('bg-gray-100', 'dark:bg-gray-700', 'hover:bg-gray-200', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
        }, 2000);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChecklistCopyManager;
} else {
    window.ChecklistCopyManager = ChecklistCopyManager;

    /**
     * Kopieer interview checklist via inline onclick
     * @param {HTMLButtonElement} button - De aangeklikte kopieerknop
     */
    window.copyInterviewChecklist = async function copyInterviewChecklist(button) {
        const manager = window._checklistCopyManagerInstance || new ChecklistCopyManager();
        window._checklistCopyManagerInstance = manager;

        const checklist = manager.getChecklistElement(button);
        if (!checklist) {
            console.warn('Checklist content not found for copy button');
            return;
        }

        await manager.copyChecklistToClipboard(checklist, button);
    };
}
