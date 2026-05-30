/**
 * ContentExtractor
 *
 * Haalt content op per anchor uit content JSON (bijv. week2.content.json).
 * Gebruikt voor AI-leerpad: extractie van theorie en oefeningen per leerdoel.
 *
 * @see leerdoelen-registry.json - contentRefs met anchors
 */

const ContentExtractor = {
    /**
     * Haal platte tekst op voor AI (geen HTML/JSON)
     * @param {Object} contentJson - Volledige content (bijv. week2.content.json)
     * @param {string[]} anchorIds - Anchors om te extraheren (bijv. ['probleem-verkennen', 'doelstelling-opstellen'])
     * @returns {string} Gecombineerde platte tekst
     */
    getPlainTextForAI(contentJson, anchorIds) {
        const items = this._getContentItemsByAnchors(contentJson, anchorIds);
        return this._contentItemsToPlainText(items);
    },

    /**
     * Haal content items op voor rendering (ContentRenderer)
     * @param {Object} contentJson - Volledige content
     * @param {string[]} anchorIds - Anchors om te extraheren
     * @returns {Array} Content items voor ContentRenderer.renderContentItems()
     */
    getContentItemsByAnchors(contentJson, anchorIds) {
        return this._getContentItemsByAnchors(contentJson, anchorIds);
    },

    /**
     * Haal stappen op: content + oefening per stap (voor geleide verwerking)
     * Elke stap = content tot aan de oefening + de oefening zelf.
     * @param {Object} contentJson - Volledige content
     * @param {string[]} anchorIds - Anchors
     * @returns {Array<{contentItems: Array, exercise: Object, stepTitle: string}>}
     */
    getStepsByAnchors(contentJson, anchorIds) {
        const items = this._getContentItemsByAnchors(contentJson, anchorIds);
        const exerciseTypes = ['trueFalseExercise', 'matchingExercise', 'multipleChoiceExercise', 'sequenceExercise'];
        const steps = [];
        let currentContent = [];
        let lastHeading = '';

        const flushStep = (exercise) => {
            if (currentContent.length > 0 || exercise) {
                const title = lastHeading || (exercise && exercise.title) || `Stap ${steps.length + 1}`;
                steps.push({
                    contentItems: [...currentContent],
                    exercise: exercise || null,
                    stepTitle: title
                });
                currentContent = [];
            }
        };

        const extractExercise = (item) => {
            if (item.type && exerciseTypes.includes(item.type)) return item;
            if (item.items && Array.isArray(item.items)) {
                for (const acc of item.items) {
                    if (acc.content && Array.isArray(acc.content)) {
                        for (const c of acc.content) {
                            if (c && c.type && exerciseTypes.includes(c.type)) return c;
                        }
                    }
                }
            }
            return null;
        };

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type === 'heading' && item.text) lastHeading = item.text;

            const ex = extractExercise(item);
            if (ex) {
                flushStep(ex);
            } else {
                currentContent.push(item);
            }
        }
        if (currentContent.length > 0) flushStep(null);
        return steps.length > 0 ? steps : [{ contentItems: items, exercise: null, stepTitle: 'Stof' }];
    },

    /**
     * Haal ook bestaande oefeningen op uit de content (trueFalse, matching, etc.)
     * @param {Object} contentJson - Volledige content
     * @param {string[]} anchorIds - Anchors
     * @returns {Array} Oefeningen (content items met type exercise)
     */
    getExercisesByAnchors(contentJson, anchorIds) {
        const items = this._getContentItemsByAnchors(contentJson, anchorIds);
        const exercises = [];
        const exerciseTypes = [
            'trueFalseExercise',
            'matchingExercise',
            'multipleChoiceExercise',
            'sequenceExercise'
        ];
        const collectExercises = (arr) => {
            if (!Array.isArray(arr)) return;
            arr.forEach((item) => {
                if (item.type && exerciseTypes.includes(item.type)) {
                    exercises.push(item);
                }
                if (item.content && Array.isArray(item.content)) {
                    item.content.forEach((c) => {
                        if (typeof c === 'object' && c.type && exerciseTypes.includes(c.type)) {
                            exercises.push(c);
                        } else if (typeof c === 'object' && c.content) {
                            collectExercises(c.content);
                        }
                    });
                }
                if (item.items && Array.isArray(item.items)) {
                    item.items.forEach((accItem) => {
                        if (accItem.content) collectExercises(accItem.content);
                    });
                }
                if (item.tabs && Array.isArray(item.tabs)) {
                    item.tabs.forEach((tab) => {
                        if (tab.content) collectExercises(tab.content);
                    });
                }
            });
        };
        collectExercises(items);
        return exercises;
    },

    /**
     * Intern: extraheer content items tussen anchors
     * @private
     */
    _getContentItemsByAnchors(contentJson, anchorIds) {
        if (!contentJson || !anchorIds || anchorIds.length === 0) return [];
        const content = contentJson.theorie?.content || contentJson.content || [];
        if (!Array.isArray(content)) return [];

        const anchorSet = new Set(anchorIds);
        const result = [];
        let inTargetSection = false;
        let currentAnchor = null;

        for (let i = 0; i < content.length; i++) {
            const item = content[i];
            if (item.type === 'heading' && item.id) {
                if (anchorSet.has(item.id)) {
                    inTargetSection = true;
                    currentAnchor = item.id;
                    result.push(item);
                } else {
                    inTargetSection = false;
                }
                continue;
            }
            if (inTargetSection) {
                result.push(item);
            }
        }
        return result;
    },

    /**
     * Converteer content items naar platte tekst voor AI
     * @private
     */
    _contentItemsToPlainText(items) {
        const parts = [];
        const stripHtml = (str) => {
            if (typeof str !== 'string') return '';
            return str
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        };
        items.forEach((item) => {
            if (item.type === 'paragraph' && item.text) {
                const text = Array.isArray(item.text) ? item.text.join(' ') : item.text;
                parts.push(stripHtml(text));
            } else if (item.type === 'heading' && item.text) {
                parts.push(`## ${item.text}`);
            } else if (item.type === 'accordion' && item.items) {
                item.items.forEach((acc) => {
                    parts.push(`### ${acc.title || ''}`);
                    if (acc.content) {
                        acc.content.forEach((c) => {
                            if (typeof c === 'string') parts.push(stripHtml(c));
                            else if (c && typeof c === 'object') {
                                if (c.text) {
                                    const t = Array.isArray(c.text) ? c.text.join(' ') : c.text;
                                    parts.push(stripHtml(t));
                                } else if (c.type === 'trueFalseExercise' && c.statements) {
                                    c.statements.forEach((s) => s.text && parts.push(`Stelling: ${s.text}`));
                                } else if (c.type === 'matchingExercise' && c.items) {
                                    c.items.forEach((it) => it.text && parts.push(it.text));
                                }
                            }
                        });
                    }
                });
            } else if (item.type === 'tabs' && item.tabs) {
                item.tabs.forEach((tab) => {
                    parts.push(`### ${tab.title || ''}`);
                    if (tab.content) {
                        tab.content.forEach((c) => {
                            if (typeof c === 'string') parts.push(stripHtml(c));
                        });
                    }
                });
            } else if (item.type === 'video' && item.transcriptContent) {
                parts.push(item.transcriptContent);
            } else if (
                (item.type === 'trueFalseExercise' || item.type === 'matchingExercise') &&
                item.statements
            ) {
                item.statements.forEach((s) => {
                    if (s.text) parts.push(`Stelling: ${s.text}`);
                });
            } else if (item.type === 'matchingExercise' && item.items) {
                item.items.forEach((it) => {
                    if (it.text) parts.push(it.text);
                });
            }
        });
        return parts.filter(Boolean).join('\n\n');
    },

    /**
     * Converteer content items naar platte tekst (voor AI-context)
     * @param {Array} items - Content items
     * @returns {string} Platte tekst
     */
    getPlainTextFromItems(items) {
        if (!items || !Array.isArray(items)) return '';
        return this._contentItemsToPlainText(items);
    }
};

if (typeof window !== 'undefined') {
    window.ContentExtractor = ContentExtractor;
}
