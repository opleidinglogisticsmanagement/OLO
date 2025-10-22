// Tree Diagram Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const resetButton = document.getElementById('resetButton');
    
    let correctPlacements = 0;
    let totalItems = dragItems.length;
    let placedItems = new Set();
    
    // Initialize drag and drop
    initializeDragAndDrop();
    
    function initializeDragAndDrop() {
        // Add drag event listeners to drag items
        dragItems.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
        });
        
        // Add drop event listeners to drop zones
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', handleDragOver);
            zone.addEventListener('drop', handleDrop);
            zone.addEventListener('dragenter', handleDragEnter);
            zone.addEventListener('dragleave', handleDragLeave);
        });
        
        // Reset button
        resetButton.addEventListener('click', resetGame);
        
        // Initialize progress
        updateProgress();
    }
    
    function handleDragStart(e) {
        const item = e.target;
        item.classList.add('dragging');
        e.dataTransfer.setData('text/plain', item.dataset.word);
        e.dataTransfer.effectAllowed = 'move';
    }
    
    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    function handleDragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');
        
        const draggedWord = e.dataTransfer.getData('text/plain');
        const dropZone = e.target;
        const correctAnswer = dropZone.dataset.correct;
        const level = dropZone.dataset.level;
        const parent = dropZone.dataset.parent;
        
        // Check if this item was already placed
        if (placedItems.has(draggedWord)) {
            showFeedback('Dit begrip is al geplaatst!', 'error');
            return;
        }
        
        // Check if the answer is correct
        if (draggedWord === correctAnswer) {
            // Correct placement
            dropZone.classList.add('correct');
            dropZone.classList.remove('incorrect');
            
            // Mark the dragged item as placed
            const draggedItem = document.querySelector(`[data-word="${draggedWord}"]`);
            draggedItem.classList.add('placed');
            draggedItem.draggable = false;
            
            placedItems.add(draggedWord);
            correctPlacements++;
            
            showFeedback(`Correct! "${draggedWord}" is goed geplaatst.`, 'success');
            
            // Check if all items are placed
            if (correctPlacements === totalItems) {
                setTimeout(() => {
                    showFeedback('🎉 Gefeliciteerd! Je hebt alle begrippen correct geplaatst!', 'success');
                }, 1000);
            }
        } else {
            // Incorrect placement
            dropZone.classList.add('incorrect');
            dropZone.classList.remove('correct');
            showFeedback(`Helaas, "${draggedWord}" hoort hier niet. Probeer het opnieuw!`, 'error');
        }
        
        updateProgress();
    }
    
    function showFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = `feedback-message ${type}`;
        
        // Clear feedback after 3 seconds
        setTimeout(() => {
            feedbackMessage.textContent = '';
            feedbackMessage.className = 'feedback-message';
        }, 3000);
    }
    
    function updateProgress() {
        const percentage = (correctPlacements / totalItems) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${correctPlacements}/${totalItems} correct geplaatst`;
        
        // Update progress bar color based on completion
        if (percentage === 100) {
            progressFill.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        } else if (percentage >= 70) {
            progressFill.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        } else {
            progressFill.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        }
    }
    
    function resetGame() {
        // Reset all visual states
        dropZones.forEach(zone => {
            zone.classList.remove('correct', 'incorrect', 'drag-over');
        });
        
        dragItems.forEach(item => {
            item.classList.remove('placed', 'dragging');
            item.draggable = true;
        });
        
        // Reset counters
        correctPlacements = 0;
        placedItems.clear();
        
        // Clear feedback
        feedbackMessage.textContent = '';
        feedbackMessage.className = 'feedback-message';
        
        // Reset progress
        updateProgress();
        
        showFeedback('Spel gereset! Je kunt opnieuw beginnen.', 'info');
    }
    
    // Add some visual feedback for better UX
    function addVisualFeedback() {
        // Add hover effects to drop zones
        dropZones.forEach(zone => {
            zone.addEventListener('mouseenter', function() {
                if (!this.classList.contains('correct')) {
                    this.style.borderColor = '#4f46e5';
                    this.style.backgroundColor = '#eef2ff';
                }
            });
            
            zone.addEventListener('mouseleave', function() {
                if (!this.classList.contains('correct') && !this.classList.contains('incorrect')) {
                    this.style.borderColor = '#cbd5e1';
                    this.style.backgroundColor = '#f1f5f9';
                }
            });
        });
        
        // Add click-to-place functionality as alternative to drag & drop
        dragItems.forEach(item => {
            item.addEventListener('click', function() {
                if (this.classList.contains('placed')) return;
                
                // Highlight all possible drop zones
                const word = this.dataset.word;
                dropZones.forEach(zone => {
                    if (zone.dataset.correct === word && !zone.classList.contains('correct')) {
                        zone.style.borderColor = '#4f46e5';
                        zone.style.backgroundColor = '#eef2ff';
                        zone.style.transform = 'scale(1.05)';
                        
                        // Add click handler to place item
                        const clickHandler = function(e) {
                            e.preventDefault();
                            handleDrop({
                                preventDefault: () => {},
                                target: zone,
                                dataTransfer: {
                                    getData: () => word
                                }
                            });
                            
                            // Remove click handlers
                            dropZones.forEach(z => {
                                z.removeEventListener('click', clickHandler);
                                z.style.borderColor = '';
                                z.style.backgroundColor = '';
                                z.style.transform = '';
                            });
                        };
                        
                        zone.addEventListener('click', clickHandler);
                        
                        // Remove highlight after 5 seconds
                        setTimeout(() => {
                            zone.removeEventListener('click', clickHandler);
                            zone.style.borderColor = '';
                            zone.style.backgroundColor = '';
                            zone.style.transform = '';
                        }, 5000);
                    }
                });
                
                showFeedback(`Klik op de juiste plek voor "${word}"`, 'info');
            });
        });
    }
    
    // Initialize visual feedback
    addVisualFeedback();
    
    // Add keyboard accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'r' && e.ctrlKey) {
            e.preventDefault();
            resetGame();
        }
    });
    
    // Show keyboard shortcut info
    setTimeout(() => {
        showFeedback('Tip: Gebruik Ctrl+R om het spel te resetten', 'info');
    }, 2000);
});
