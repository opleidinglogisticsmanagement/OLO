/**
 * ContentValidator
 * 
 * Utility voor het valideren van JSON content structuren
 * Helpt bij het vroeg detecteren van fouten in content bestanden
 */

class ContentValidator {
    /**
     * Valideer een content item
     * @param {Object} item - Content item om te valideren
     * @param {string} context - Context voor error messages (bijv. "theorie.content[0]")
     * @returns {Object} { valid: boolean, errors: Array<string> }
     */
    static validateContentItem(item, context = '') {
        const errors = [];
        
        if (!item || typeof item !== 'object') {
            return { valid: false, errors: [`${context}: Item is not an object`] };
        }
        
        if (!item.type) {
            errors.push(`${context}: Missing required property 'type'`);
        } else {
            // Validate type-specific properties
            const typeErrors = this.validateItemByType(item, context);
            errors.push(...typeErrors);
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Valideer item op basis van type
     * @param {Object} item - Content item
     * @param {string} context - Context voor error messages
     * @returns {Array<string>} Array van error messages
     */
    static validateItemByType(item, context) {
        const errors = [];
        
        switch (item.type) {
            case 'paragraph':
                if (!item.text && item.text !== '') {
                    errors.push(`${context}: Paragraph missing 'text' property`);
                }
                break;
                
            case 'heading':
                if (!item.text && item.text !== '') {
                    errors.push(`${context}: Heading missing 'text' property`);
                }
                if (item.level && (typeof item.level !== 'number' || item.level < 1 || item.level > 6)) {
                    errors.push(`${context}: Heading 'level' must be a number between 1 and 6`);
                }
                break;
                
            case 'image':
                if (!item.src) {
                    errors.push(`${context}: Image missing required 'src' property`);
                }
                if (!item.alt && item.alt !== '') {
                    errors.push(`${context}: Image missing 'alt' property (accessibility requirement)`);
                }
                break;
                
            case 'url':
                if (!item.url) {
                    errors.push(`${context}: URL item missing 'url' property`);
                }
                if (!item.text && item.text !== '') {
                    errors.push(`${context}: URL item missing 'text' property`);
                }
                break;
                
            case 'video':
                if (!item.url) {
                    errors.push(`${context}: Video missing 'url' property`);
                }
                break;
                
            case 'document':
                if (!item.url) {
                    errors.push(`${context}: Document missing 'url' property`);
                }
                if (!item.title && item.title !== '') {
                    errors.push(`${context}: Document missing 'title' property`);
                }
                break;
                
            case 'accordion':
                if (!item.items || !Array.isArray(item.items)) {
                    errors.push(`${context}: Accordion missing 'items' array`);
                } else if (item.items.length === 0) {
                    errors.push(`${context}: Accordion 'items' array is empty`);
                } else {
                    // Validate accordion items
                    item.items.forEach((accordionItem, index) => {
                        if (!accordionItem.title) {
                            errors.push(`${context}.items[${index}]: Missing 'title' property`);
                        }
                        if (!accordionItem.content && accordionItem.content !== '') {
                            errors.push(`${context}.items[${index}]: Missing 'content' property`);
                        }
                    });
                }
                break;
                
            case 'tabs':
                if (!item.tabs || !Array.isArray(item.tabs)) {
                    errors.push(`${context}: Tabs missing 'tabs' array`);
                } else if (item.tabs.length === 0) {
                    errors.push(`${context}: Tabs 'tabs' array is empty`);
                } else {
                    // Validate tab items
                    item.tabs.forEach((tab, index) => {
                        if (!tab.title) {
                            errors.push(`${context}.tabs[${index}]: Missing 'title' property`);
                        }
                        if (!tab.content && tab.content !== '') {
                            errors.push(`${context}.tabs[${index}]: Missing 'content' property`);
                        }
                    });
                }
                break;
                
            case 'clickableSteps':
                if (!item.steps || !Array.isArray(item.steps)) {
                    errors.push(`${context}: ClickableSteps missing 'steps' array`);
                } else if (item.steps.length === 0) {
                    errors.push(`${context}: ClickableSteps 'steps' array is empty`);
                }
                break;
                
            case 'smartChecklist':
                if (!item.doelstelling) {
                    errors.push(`${context}: SMART Checklist missing 'doelstelling' property`);
                }
                break;
                
            case 'learningObjectivesChecklist':
                if (!item.items || !Array.isArray(item.items)) {
                    errors.push(`${context}: Learning Objectives Checklist missing 'items' array`);
                } else if (item.items.length === 0) {
                    errors.push(`${context}: Learning Objectives Checklist 'items' array is empty`);
                }
                break;
                
            case 'matchingExercise':
                if (!item.categories || !Array.isArray(item.categories)) {
                    errors.push(`${context}: Matching Exercise missing 'categories' array`);
                }
                if (!item.items || !Array.isArray(item.items)) {
                    errors.push(`${context}: Matching Exercise missing 'items' array`);
                }
                break;
                
            case 'trueFalseExercise':
                if (!item.statements || !Array.isArray(item.statements)) {
                    errors.push(`${context}: True/False Exercise missing 'statements' array`);
                }
                break;
                
            case 'sequenceExercise':
                if (!item.paragraphs || !Array.isArray(item.paragraphs)) {
                    errors.push(`${context}: Sequence Exercise missing 'paragraphs' array`);
                }
                break;
                
            case 'conceptQualityChecklist':
                if (!item.concept) {
                    errors.push(`${context}: Concept Quality Checklist missing 'concept' property`);
                }
                if (!item.definition) {
                    errors.push(`${context}: Concept Quality Checklist missing 'definition' property`);
                }
                break;
                
            // HTML, highlight, and other types don't require strict validation
            // They can have flexible content structures
        }
        
        return errors;
    }
    
    /**
     * Valideer een volledige content JSON structuur
     * @param {Object} content - Volledige content object
     * @param {string} moduleId - Module ID voor context
     * @returns {Object} { valid: boolean, errors: Array<string>, warnings: Array<string> }
     */
    static validateContentStructure(content, moduleId = '') {
        const errors = [];
        const warnings = [];
        
        if (!content || typeof content !== 'object') {
            return {
                valid: false,
                errors: ['Content is not an object'],
                warnings: []
            };
        }
        
        // Validate intro section (optional but recommended)
        if (content.intro) {
            if (!content.intro.title) {
                warnings.push('intro: Missing "title" property (recommended)');
            }
            if (!content.intro.subtitle) {
                warnings.push('intro: Missing "subtitle" property (recommended)');
            }
        } else {
            warnings.push('Missing "intro" section (recommended)');
        }
        
        // Validate leerdoelen section
        if (content.leerdoelen) {
            if (!content.leerdoelen.title) {
                warnings.push('leerdoelen: Missing "title" property');
            }
            if (content.leerdoelen.items && !Array.isArray(content.leerdoelen.items)) {
                errors.push('leerdoelen.items: Must be an array');
            }
            if (content.leerdoelen.interactive && content.leerdoelen.items && content.leerdoelen.items.length === 0) {
                warnings.push('leerdoelen: Interactive checklist has no items');
            }
        } else {
            warnings.push('Missing "leerdoelen" section (recommended)');
        }
        
        // Validate theorie section
        if (content.theorie) {
            if (!content.theorie.title) {
                warnings.push('theorie: Missing "title" property');
            }
            
            // Validate theorie.content array if it exists
            if (content.theorie.content) {
                if (!Array.isArray(content.theorie.content)) {
                    errors.push('theorie.content: Must be an array');
                } else {
                    // Validate each content item
                    content.theorie.content.forEach((item, index) => {
                        const itemContext = `theorie.content[${index}]`;
                        const validation = this.validateContentItem(item, itemContext);
                        if (!validation.valid) {
                            errors.push(...validation.errors);
                        }
                    });
                }
            } else if (!content.theorie.paragraphs) {
                warnings.push('theorie: Missing both "content" and "paragraphs" properties');
            }
        } else {
            warnings.push('Missing "theorie" section (recommended)');
        }
        
        // Validate video section (optional)
        if (content.video) {
            if (!content.video.url) {
                errors.push('video: Missing "url" property');
            }
        }
        
        // Validate MC vragen section (optional)
        if (content.mcVragen) {
            if (content.mcVragen.generateFromTheory && typeof content.mcVragen.generateFromTheory !== 'boolean') {
                errors.push('mcVragen.generateFromTheory: Must be a boolean');
            }
            if (content.mcVragen.vragen && !Array.isArray(content.mcVragen.vragen)) {
                errors.push('mcVragen.vragen: Must be an array');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    /**
     * Valideer en log resultaten
     * @param {Object} content - Content object om te valideren
     * @param {string} moduleId - Module ID voor logging
     * @param {boolean} strict - If true, treat warnings as errors
     * @returns {boolean} True if valid, false otherwise
     */
    static validateAndLog(content, moduleId = '', strict = false) {
        const result = this.validateContentStructure(content, moduleId);
        
        if (result.errors.length > 0) {
            console.error(`[ContentValidator] ❌ Validation errors for ${moduleId}:`, result.errors);
            result.errors.forEach(error => {
                console.error(`  - ${error}`);
            });
        }
        
        if (result.warnings.length > 0) {
            if (strict) {
                console.error(`[ContentValidator] ⚠️ Validation warnings (strict mode) for ${moduleId}:`, result.warnings);
                result.warnings.forEach(warning => {
                    console.error(`  - ${warning}`);
                });
            } else {
                console.warn(`[ContentValidator] ⚠️ Validation warnings for ${moduleId}:`, result.warnings);
                result.warnings.forEach(warning => {
                    console.warn(`  - ${warning}`);
                });
            }
        }
        
        if (result.valid && result.errors.length === 0 && (strict ? result.warnings.length === 0 : true)) {
            console.log(`[ContentValidator] ✅ Content structure valid for ${moduleId}`);
        }
        
        return result.valid && (strict ? result.warnings.length === 0 : true);
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentValidator;
} else {
    window.ContentValidator = ContentValidator;
}

