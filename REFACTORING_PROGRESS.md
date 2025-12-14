# InteractiveRenderer Refactoring Progress

## Status: Fase 7 - Complexe Oefeningen Extractie (Deels) ✅

### Voltooide Stappen
- [x] Git branch aangemaakt (`refactor/interactive-renderer-split`)
- [x] Directory structuur aangemaakt (`js/components/interactive/` en `js/components/interactive/utils/`)
- [x] Huidige structuur gedocumenteerd (`REFACTORING_NOTES.md`)
- [x] HTML bestanden geïnventariseerd (7 bestanden gevonden)
- [x] Baseline tests uitgevoerd (gebruiker bevestigd: alles werkt)
- [x] Backup gemaakt (git commit)

### Fase 1 Voltooid ✅
- [x] `js/components/interactive/utils/HtmlUtils.js` aangemaakt
- [x] `escapeHtml` en `normalizeText` verplaatst naar HtmlUtils
- [x] Script tag toegevoegd aan alle 7 HTML bestanden
- [x] InteractiveRenderer aangepast als facade (delegeert naar HtmlUtils)
- [x] Duplicate `escapeHtml` verwijderd

### Fase 2 Voltooid ✅
- [x] `js/components/interactive/TabRenderer.js` aangemaakt
- [x] `renderTabs` en `switchTab` verplaatst naar TabRenderer
- [x] Script tag toegevoegd aan alle 7 HTML bestanden
- [x] InteractiveRenderer aangepast als facade (delegeert naar TabRenderer)
- [x] Onclick handlers blijven werken (gebruiken InteractiveRenderer.switchTab)

### Fase 3 Voltooid ✅
- [x] `js/components/interactive/AccordionRenderer.js` aangemaakt
- [x] `renderAccordion` en `toggleAccordion` verplaatst naar AccordionRenderer
- [x] Script tag toegevoegd aan alle 7 HTML bestanden
- [x] InteractiveRenderer aangepast als facade (delegeert naar AccordionRenderer)
- [x] Geneste accordions ondersteund (recursieve calls werken)
- [x] Onclick handlers blijven werken (gebruiken InteractiveRenderer.toggleAccordion)

### Fase 4 Voltooid ✅
- [x] `js/components/interactive/ClickableStepsRenderer.js` aangemaakt
- [x] `renderClickableSteps` en `toggleClickableStep` verplaatst naar ClickableStepsRenderer
- [x] Script tag toegevoegd aan alle 7 HTML bestanden
- [x] InteractiveRenderer aangepast als facade (delegeert naar ClickableStepsRenderer)
- [x] Geneste content items ondersteund (ContentRenderer integratie)
- [x] allowMultiple functionaliteit behouden
- [x] Onclick handlers blijven werken (gebruiken InteractiveRenderer.toggleClickableStep)

### Fase 5 Voltooid ✅
- [x] `js/components/interactive/ChecklistRenderer.js` aangemaakt
- [x] Alle checklist logica verplaatst:
  - [x] SMART Checklist (`renderSMARTChecklist`, `showSMARTResult`)
  - [x] Learning Objectives Checklist (`renderLearningObjectivesChecklist`, `loadLearningObjectivesState`, `updateLearningObjective`, `updateLearningObjectivesProgress`)
  - [x] Concept Quality Checklist (`renderConceptQualityChecklist`, `checkAfbakening`, `checkOperationalisatie`, `updateConceptQualityStatus`, `showConceptQualityResult`)
- [x] Script tag toegevoegd aan alle 7 HTML bestanden
- [x] InteractiveRenderer aangepast als facade (delegeert naar ChecklistRenderer)
- [x] localStorage functionaliteit behouden (Learning Objectives)
- [x] Onclick handlers blijven werken (gebruiken InteractiveRenderer methoden)

### Fase 6 Voltooid ✅
- [x] `js/components/interactive/ExerciseRenderer.js` aangemaakt
- [x] True/False Exercise logica verplaatst (`renderTrueFalseExercise`, `updateTrueFalseAnswer`, `checkTrueFalseExercise`)
- [x] Matching Exercise logica verplaatst (`renderMatchingExercise`, `handleDragStart`, `handleDragEnd`, `allowDrop`, `handleDrop`, `checkMatchingExercise`)
- [x] Script tag toegevoegd aan alle 7 HTML bestanden
- [x] InteractiveRenderer aangepast als facade (delegeert naar ExerciseRenderer)
- [x] Drag & drop functionaliteit behouden
- [x] Onclick handlers blijven werken (gebruiken InteractiveRenderer methoden)

### Fase 7 Voltooid (Deels) ✅
- [x] `js/components/interactive/ExerciseRenderer.js` uitgebreid met Sequence Exercise logica
- [x] Sequence Exercise methoden verplaatst (`renderSequenceExercise`, `handleSequenceDragStart`, `handleSequenceDragOver`, `getDragAfterElement`, `handleSequenceDragEnd`, `checkSequenceOrder`)
- [x] `fuzzyMatchSourceAnswer` toegevoegd aan ExerciseRenderer.js
- [x] InteractiveRenderer aangepast als facade voor Sequence Exercise
- [x] Oude Sequence Exercise implementaties verwijderd
- [ ] **Source Evaluation Exercise methoden** - TODO: Zeer groot (>700 regels), blijven voorlopig in InteractiveRenderer
  - [ ] `renderSourceEvaluationExercise` - TODO: Verplaats naar ExerciseRenderer.js
  - [ ] `selectSource` - TODO: Verplaats naar ExerciseRenderer.js
  - [ ] `selectCheckType` - TODO: Verplaats naar ExerciseRenderer.js
  - [ ] `checkAllSourceCriteria` - TODO: Verplaats naar ExerciseRenderer.js

### Fase 8 Voltooid ✅
- [x] `js/components/interactive/AIRenderer.js` aangemaakt met Boolean Operator Exercise logica
- [x] Boolean Operator Exercise methoden verplaatst (`renderBooleanOperatorExercise`, `setupBooleanExerciseListeners`, `addToQuery`, `updateQueryDisplay`, `clearQuery`, `validateQuery`)
- [x] AI Query Exercise methoden verplaatst (`renderAIQueryExercise`, `setupAIQueryExerciseListeners`, `loadNewAIQueryScenario`, `extractTheoryContent`, `validateAIQuery`, `addToAIQuery`, `clearAIQuery`)
- [x] AI Bouwsteen Generator methoden verplaatst (`renderAIBouwsteenGenerator`, `setupAIBouwsteenGeneratorListeners`, `generateBouwsteenTabel`, `renderBouwsteenTabel`, `copyBouwsteenTabel`)
- [x] Script tag toegevoegd aan alle 7 HTML bestanden
- [x] InteractiveRenderer aangepast als facade voor alle AI Tools
- [x] Oude AI Tools implementaties verwijderd

### Volgende Stap
Fase 9: Opruimen & Facade Check - Controleer of InteractiveRenderer nu echt "leeg" is van logica en alleen nog maar fungeert als doorgeefluik.

## HTML Bestanden Inventarisatie

### Bestanden die InteractiveRenderer laden:
1. **week2.html** - regel 438
   - Componenten: accordion, tabs, trueFalseExercise, matchingExercise, smartChecklist
   
2. **week3.html** - regel 476
   - Componenten: accordion, clickableSteps, tabs, matchingExercise
   
3. **week4.html** - regel 425
   - Componenten: accordion, clickableSteps, booleanOperatorExercise, aiQueryExercise, aiBouwsteenGenerator
   
4. **week5.html** - regel 425
   - Componenten: accordion, matchingExercise, sourceEvaluationExercise, sequenceExercise
   
5. **week6.html** - regel 425
   - Componenten: accordion, clickableSteps, matchingExercise, tabs
   
6. **week7.html** - regel 425
   - Componenten: (nog te bepalen)
   
7. **afsluiting.html** - regel 318
   - Componenten: (nog te bepalen)

### Bestanden die InteractiveRenderer NIET laden:
- **week1.html** - geen interactieve componenten nodig

## Test Results
*Wordt ingevuld na handmatige baseline tests*

### week2.html
- [ ] Laadt zonder errors
- [ ] Accordions werken
- [ ] Tabs werken
- [ ] TrueFalse exercise werkt
- [ ] Matching exercise werkt
- [ ] SmartChecklist werkt

### week3.html
- [ ] Laadt zonder errors
- [ ] Accordions werken
- [ ] ClickableSteps werken
- [ ] Tabs werken
- [ ] Matching exercise werkt

### week4.html
- [ ] Laadt zonder errors
- [ ] Accordions werken
- [ ] ClickableSteps werken
- [ ] BooleanOperator exercise werkt
- [ ] AIQuery exercise werkt
- [ ] AIBouwsteenGenerator werkt

### week5.html
- [ ] Laadt zonder errors
- [ ] Accordions werken
- [ ] Matching exercise werkt
- [ ] SourceEvaluation exercise werkt
- [ ] Sequence exercise werkt

### week6.html
- [ ] Laadt zonder errors
- [ ] Accordions werken
- [ ] ClickableSteps werken
- [ ] Matching exercise werkt
- [ ] Tabs werken

### week7.html
- [ ] Laadt zonder errors
- [ ] (Componenten te bepalen)

### afsluiting.html
- [ ] Laadt zonder errors
- [ ] (Componenten te bepalen)

## Issues Gevonden
*Wordt ingevuld tijdens baseline tests*

## Fase Overzicht

### Fase 0: Voorbereiding ✅
- [x] Git branch
- [x] Directory structuur
- [x] Documentatie
- [ ] Baseline tests (handmatig)
- [ ] Git commit baseline

### Fase 1: Utils ✅
- [x] Maak `js/components/interactive/utils/HtmlUtils.js`
- [x] Verplaats `escapeHtml`, `normalizeText`
- [x] Update HTML bestanden (7 bestanden)
- [x] Update InteractiveRenderer als facade
- [x] Test (gebruiker bevestigd: alles werkt)

### Fase 2: Tabs ✅
- [x] Maak `js/components/interactive/TabRenderer.js`
- [x] Verplaats `renderTabs`, `switchTab`
- [x] Update HTML bestanden (7 bestanden)
- [x] Update InteractiveRenderer als facade
- [x] Test (zie FASE2_TEST_CHECKLIST.md)

### Fase 3: Accordions ✅
- [x] Maak `js/components/interactive/AccordionRenderer.js`
- [x] Verplaats `renderAccordion`, `toggleAccordion`
- [x] Update HTML bestanden (7 bestanden)
- [x] Update InteractiveRenderer als facade
- [x] Geneste accordions ondersteund
- [x] Test (zie FASE3_TEST_CHECKLIST.md)

### Fase 4: ClickableSteps ✅
- [x] Maak `js/components/interactive/ClickableStepsRenderer.js`
- [x] Verplaats `renderClickableSteps`, `toggleClickableStep`
- [x] Update HTML bestanden (7 bestanden)
- [x] Update InteractiveRenderer als facade
- [x] Test (zie FASE4_TEST_CHECKLIST.md)

### Fase 5: Checklists ✅
- [x] Maak `js/components/interactive/ChecklistRenderer.js`
- [x] Verplaats alle checklist logica (SMART, LearningObjectives, ConceptQuality)
- [x] Update HTML bestanden (7 bestanden)
- [x] Update InteractiveRenderer als facade
- [x] Test (zie FASE5_TEST_CHECKLIST.md)

### Fase 6: Basis Oefeningen ✅
- [x] Maak `js/components/interactive/ExerciseRenderer.js`
- [x] Verplaats True/False en Matching exercises
- [x] Update HTML bestanden (7 bestanden)
- [x] Update InteractiveRenderer als facade
- [x] Test (zie FASE6_TEST_CHECKLIST.md)

### Fase 7: Complexe Oefeningen (TODO)
- [ ] Breid `ExerciseRenderer.js` uit OF maak aparte files
- [ ] Verplaats Sequence en SourceEvaluation exercises
- [ ] Update HTML bestanden
- [ ] Update InteractiveRenderer als facade
- [ ] Test

### Fase 8: AI Tools (TODO)
- [ ] Maak `js/components/interactive/AIRenderer.js`
- [ ] Verplaats Boolean Operator, AI Query en AI Bouwsteen logica
- [ ] Update HTML bestanden
- [ ] Update InteractiveRenderer als facade
- [ ] Test

### Fase 9: Opruimen & Facade Check (TODO)
- [ ] Controleer of InteractiveRenderer alleen nog facade is
- [ ] Verwijder duplicate code
- [ ] Finale tests
- [ ] Documentatie update

