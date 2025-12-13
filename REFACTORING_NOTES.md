# InteractiveRenderer Refactoring Notes

## Huidige Situatie
- **Bestand:** `pages/InteractiveRenderer.js`
- **Grootte:** ~4527 regels
- **Methoden:** 54 static methods
- **Laatste update:** Voor refactoring baseline

## Componenten Overzicht

### Utils (3 methoden)
- `escapeHtml(text)` - regel ~4513, ~2000
- `normalizeText(text)` - regel ~1989
- `fuzzyMatchSourceAnswer(userAnswer, correctAnswers)` - regel ~1947

### Accordion (2 methoden)
- `renderAccordion(item, isNested)` - regel 15
- `toggleAccordion(contentId, buttonId, usePlusIcon)` - regel 130

### Tabs (2 methoden)
- `renderTabs(item)` - regel 2335
- `switchTab(tabsId, tabIndex)` - regel 2486

### ClickableSteps (2 methoden)
- `renderClickableSteps(item)` - regel 2012
- `toggleClickableStep(stepsId, stepIndex, allowMultiple)` - regel 2160

### Checklists (11 methoden)

#### SMART Checklist
- `renderSMARTChecklist(item)` - regel 184
- `showSMARTResult(checklistId)` - regel 264

#### Learning Objectives
- `renderLearningObjectivesChecklist(item)` - regel 385
- `loadLearningObjectivesState(storageKey)` - regel 471
- `updateLearningObjective(checklistId, storageKey, index)` - regel 483
- `updateLearningObjectivesProgress(checklistId, storageKey)` - regel 507

#### Concept Quality
- `renderConceptQualityChecklist(item)` - regel 2563
- `checkAfbakening(definition)` - regel 2678
- `checkOperationalisatie(definition)` - regel 2715
- `updateConceptQualityStatus(checklistId, criterionLetter)` - regel 2754
- `showConceptQualityResult(checklistId)` - regel 2852

### Exercises (18 methoden)

#### True/False
- `renderTrueFalseExercise(item)` - regel 890
- `updateTrueFalseAnswer(exerciseId, statementIndex, answer)` - regel 958
- `checkTrueFalseExercise(exerciseId)` - regel 2248

#### Matching
- `renderMatchingExercise(item)` - regel 557
- `handleDragStart(event, exerciseId, itemIndex)` - regel 684
- `handleDragEnd(event)` - regel 705
- `allowDrop(event)` - regel 722
- `handleDrop(event, exerciseId, categoryIndex)` - regel 730
- `checkMatchingExercise(exerciseId)` - regel 813

#### Sequence
- `renderSequenceExercise(item)` - regel 968
- `handleSequenceDragStart(event, exerciseId)` - regel 1063
- `handleSequenceDragOver(event, exerciseId)` - regel 1080
- `getDragAfterElement(container, y)` - regel 1102
- `handleSequenceDragEnd(event, exerciseId)` - regel 1120
- `checkSequenceOrder(exerciseId)` - regel 1131

#### Source Evaluation
- `renderSourceEvaluationExercise(item)` - regel 1239
- `selectSource(exerciseId, sourceIndex)` - regel 1406
- `selectCheckType(exerciseId, checkType)` - regel 1525
- `checkAllSourceCriteria(exerciseId)` - regel 1781

### AI Tools (16 methoden)

#### Boolean Operator
- `renderBooleanOperatorExercise(item)` - regel 2954
- `setupBooleanExerciseListeners(exerciseId)` - regel 3109
- `addToQuery(scenarioId, item)` - regel 3156
- `updateQueryDisplay(scenarioId)` - regel 3208
- `clearQuery(scenarioId)` - regel 3253
- `validateQuery(scenarioId)` - regel 3273

#### AI Query
- `renderAIQueryExercise(item)` - regel 3329
- `setupAIQueryExerciseListeners(exerciseId)` - regel 3468
- `extractTheoryContent()` - regel 3689
- `addToAIQuery(exerciseId, item)` - regel 3870
- `clearAIQuery(exerciseId)` - regel 3923
- `validateAIQuery(exerciseId)` - regel 3754 (async, niet in grep gevonden maar wel aanwezig)

#### AI Bouwsteen Generator
- `renderAIBouwsteenGenerator(item)` - regel 3942
- `setupAIBouwsteenGeneratorListeners(generatorId)` - regel 4109
- `generateBouwsteenTabel(generatorId)` - regel 4177 (async)
- `renderBouwsteenTabel(tableData)` - regel 4255
- `copyBouwsteenTabel(generatorId)` - regel 4306 (async)

## Dependencies
- `ContentRenderer` - gebruikt voor nested content rendering (regel 40, 50, 2043, 2060)
- `InteractiveManager` - gebruikt InteractiveRenderer voor event handling
- Inline onclick handlers - gebruiken `InteractiveRenderer.methodName()` (bijv. regel 95, 251, 670, etc.)
- `window.InteractiveRenderer` - wordt gebruikt in HTML inline handlers

## HTML Files die InteractiveRenderer laden
- `week2.html` - regel 438
- `week3.html` - regel 476
- `week4.html` - regel 425
- `week5.html` - regel 425
- `week6.html` - regel 425
- `week7.html` - regel 425
- `afsluiting.html` - regel 318

**Opmerking:** `week1.html` laadt InteractiveRenderer.js NIET (geen interactieve componenten nodig)

## Script Loading Volgorde
Alle HTML bestanden volgen dit patroon:
1. DarkMode.js (eerst)
2. SearchService.js
3. LayoutRenderer.js
4. UI Managers (SidebarManager, HeaderManager, etc.)
5. NavigationRenderer.js
6. ContentTemplateRenderer.js
7. BaseLessonPage.js
8. ContentRenderer.js
9. **InteractiveRenderer.js** ← Hier moet nieuwe structuur komen
10. AIGenerator.js (indien aanwezig)
11. MCQuestionRenderer.js (indien aanwezig)
12. WeekXLessonPage.js

## Belangrijke Opmerkingen

### Geneste Content
- Accordions kunnen geneste content items bevatten (regel 40-50)
- ClickableSteps kunnen geneste content items bevatten (regel 2042-2064)
- Beide gebruiken `ContentRenderer.renderContentItems()` voor nested rendering

### Inline Event Handlers
- Veel componenten gebruiken inline `onclick` handlers (bijv. regel 95, 251, 670)
- Deze moeten blijven werken na refactoring
- Facade pattern zorgt dat `InteractiveRenderer.methodName()` blijft werken

### Duplicate Methods
- `escapeHtml` komt 2x voor (regel ~2000 en ~4513) - waarschijnlijk duplicate, moet geconsolideerd worden

## Refactoring Strategie
1. **Facade Pattern:** InteractiveRenderer blijft bestaan als doorgeefluik
2. **Incrementeel:** Eén component per fase
3. **Backward Compatible:** Alle bestaande code moet blijven werken
4. **Test per fase:** Elke fase moet getest worden voordat volgende fase start

