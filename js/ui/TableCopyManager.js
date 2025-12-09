/**
 * TableCopyManager
 * 
 * Handles all table copy functionality including:
 * - Copy buttons for tables with h3 titles
 * - Clipboard API with HTML format (Word compatible)
 * - Fallback to execCommand for older browsers
 * - Visual feedback on copy success/failure
 */

class TableCopyManager {
    constructor() {
        // Geen constructor parameters nodig
    }

    /**
     * Initialiseer alle table copy functionaliteit
     * Moet worden aangeroepen nadat de DOM geladen is
     */
    init() {
        this.setupTableCopyButtons();
    }

    /**
     * Setup event listeners for table copy buttons
     */
    setupTableCopyButtons() {
        // Use event delegation to handle dynamically added copy buttons
        // Use a global flag to prevent multiple event listeners across all instances
        if (window._tableCopyButtonsSetup) {
            return; // Already setup globally
        }
        window._tableCopyButtonsSetup = true;
        
        document.addEventListener('click', (e) => {
            const copyButton = e.target.closest('.copy-table-btn');
            if (!copyButton) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const tableId = copyButton.getAttribute('data-table-id');
            if (!tableId) {
                console.warn('Copy button missing table ID');
                return;
            }
            
            const table = document.getElementById(tableId);
            if (!table) {
                console.warn(`Table with ID ${tableId} not found`);
                return;
            }
            
            // Copy table as HTML (Word can paste HTML tables)
            this.copyTableToClipboard(table, copyButton);
        });
    }

    /**
     * Copy table to clipboard in HTML format (compatible with Word)
     * @param {HTMLElement} table - The table element to copy
     * @param {HTMLElement} button - The button that triggered the copy
     */
    async copyTableToClipboard(table, button) {
        try {
            // Clone the table to avoid modifying the original
            const tableClone = table.cloneNode(true);
            
            // Remove any IDs that might interfere
            tableClone.removeAttribute('id');
            
            // Create a clean HTML string with the table
            const tableHtml = tableClone.outerHTML;
            const plainText = this.tableToPlainText(tableClone);
            
            // Use the Clipboard API with both HTML and plain text formats
            // Word prefers HTML format, but plain text is a fallback
            const htmlBlob = new Blob([tableHtml], { type: 'text/html' });
            const textBlob = new Blob([plainText], { type: 'text/plain' });
            
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': htmlBlob,
                    'text/plain': textBlob
                })
            ]);
            
            // Show success feedback
            this.showCopyFeedback(button, true);
            
        } catch (error) {
            console.error('Error copying table with Clipboard API:', error);
            
            // Fallback: try using execCommand (older browsers or when Clipboard API fails)
            try {
                // Create a temporary container with the table
                const tempDiv = document.createElement('div');
                tempDiv.style.position = 'absolute';
                tempDiv.style.left = '-9999px';
                tempDiv.appendChild(table.cloneNode(true));
                document.body.appendChild(tempDiv);
                
                // Select the table
                const range = document.createRange();
                range.selectNodeContents(tempDiv);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                
                // Copy
                const successful = document.execCommand('copy');
                
                // Cleanup
                selection.removeAllRanges();
                document.body.removeChild(tempDiv);
                
                if (successful) {
                    this.showCopyFeedback(button, true);
                } else {
                    this.showCopyFeedback(button, false);
                }
            } catch (fallbackError) {
                console.error('Fallback copy also failed:', fallbackError);
                this.showCopyFeedback(button, false);
            }
        }
    }

    /**
     * Convert table to plain text format (fallback)
     * @param {HTMLElement} table - The table element
     * @returns {string} Plain text representation
     */
    tableToPlainText(table) {
        const rows = table.querySelectorAll('tr');
        const textRows = [];
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            const cellTexts = [];
            cells.forEach(cell => {
                cellTexts.push(cell.textContent.trim());
            });
            textRows.push(cellTexts.join('\t')); // Tab-separated for Word compatibility
        });
        
        return textRows.join('\n');
    }

    /**
     * Show feedback when table is copied
     * @param {HTMLElement} button - The copy button
     * @param {boolean} success - Whether copy was successful
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
            
            // Reset after 2 seconds
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('bg-green-100', 'dark:bg-green-900/30', 'text-green-700', 'dark:text-green-400');
                button.classList.add('bg-gray-100', 'dark:bg-gray-700', 'hover:bg-gray-200', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
            }, 2000);
        } else {
            button.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span class="hidden sm:inline">Fout</span>
            `;
            button.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            button.classList.add('bg-red-100', 'dark:bg-red-900/30', 'text-red-700', 'dark:text-red-400');
            
            // Reset after 2 seconds
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('bg-red-100', 'dark:bg-red-900/30', 'text-red-700', 'dark:text-red-400');
                button.classList.add('bg-gray-100', 'dark:bg-gray-700', 'hover:bg-gray-200', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
            }, 2000);
        }
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableCopyManager;
} else {
    window.TableCopyManager = TableCopyManager;
}

