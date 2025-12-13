# InteractiveRenderer Refactoring Progress

## Status: Fase 0 - Voorbereiding ✅

### Voltooide Stappen
- [x] Git branch aangemaakt (`refactor/interactive-renderer-split`)
- [x] Directory structuur aangemaakt (`js/components/interactive/` en `js/components/interactive/utils/`)
- [x] Huidige structuur gedocumenteerd (`REFACTORING_NOTES.md`)
- [x] HTML bestanden geïnventariseerd (7 bestanden gevonden)
- [ ] Baseline tests uitgevoerd (TODO: handmatig testen)
- [ ] Backup gemaakt (TODO: git commit)

### Volgende Stap
Fase 1: Utils extractie

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

### Fase 1: Utils (TODO)
- [ ] Maak `js/components/interactive/utils/HtmlUtils.js`
- [ ] Verplaats `escapeHtml`, `normalizeText`
- [ ] Update HTML bestanden
- [ ] Update InteractiveRenderer als facade
- [ ] Test

### Fase 2: Tabs (TODO)
- [ ] Maak `js/components/interactive/TabRenderer.js`
- [ ] Verplaats `renderTabs`, `switchTab`
- [ ] Update HTML bestanden
- [ ] Update InteractiveRenderer als facade
- [ ] Test

### Fase 3: Accordions (TODO)
- [ ] Maak `js/components/interactive/AccordionRenderer.js`
- [ ] Verplaats `renderAccordion`, `toggleAccordion`
- [ ] Update HTML bestanden
- [ ] Update InteractiveRenderer als facade
- [ ] Test (let op: geneste accordions!)

### Fase 4: ClickableSteps (TODO)
- [ ] Maak `js/components/interactive/ClickableStepsRenderer.js`
- [ ] Verplaats `renderClickableSteps`, `toggleClickableStep`
- [ ] Update HTML bestanden
- [ ] Update InteractiveRenderer als facade
- [ ] Test

### Fase 5: Checklists (TODO)
- [ ] Maak `js/components/interactive/ChecklistRenderer.js`
- [ ] Verplaats alle checklist logica
- [ ] Update HTML bestanden
- [ ] Update InteractiveRenderer als facade
- [ ] Test

### Fase 6: Basis Oefeningen (TODO)
- [ ] Maak/breid `js/components/interactive/ExerciseRenderer.js` uit
- [ ] Verplaats True/False en Matching exercises
- [ ] Update HTML bestanden
- [ ] Update InteractiveRenderer als facade
- [ ] Test

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

