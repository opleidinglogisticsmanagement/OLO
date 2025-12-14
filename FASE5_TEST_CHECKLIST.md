# Fase 5 Test Checklist - Checklists Extractie

## ⚠️ BELANGRIJK: Test deze onderdelen expliciet na Fase 5

### Algemene Tests
- [ ] **Geen console errors** - Open Developer Tools (F12) en check Console tab
- [ ] **Script loading** - Controleer dat ChecklistRenderer.js correct geladen wordt (Network tab)

---

## Pagina's met Checklist Componenten

### week2.html
**Componenten te testen:**
- [ ] **SMART Checklist** ⚠️ **BELANGRIJK - Deze pagina heeft SMART checklist!**
  - [ ] Checklist wordt correct gerenderd
  - [ ] Alle 5 criteria (S, M, A, R, T) zijn zichtbaar
  - [ ] Checkboxes zijn klikbaar
  - [ ] "Bekijk analyse" button werkt
  - [ ] Feedback per criterium wordt getoond
  - [ ] Overall result wordt getoond
  - [ ] Dark mode werkt

- [ ] **Learning Objectives Checklist** ⚠️ **BELANGRIJK - Deze pagina heeft Learning Objectives checklist!**
  - [ ] Checklist wordt correct gerenderd
  - [ ] Progress indicator (cirkel) wordt getoond
  - [ ] Counter (X/Y) wordt getoond
  - [ ] Checkboxes zijn klikbaar
  - [ ] **localStorage werkt** ⚠️ **EXTRA BELANGRIJK**
    - [ ] Checkbox state wordt opgeslagen in localStorage
    - [ ] State wordt geladen bij page reload
    - [ ] Progress indicator update werkt
    - [ ] Counter update werkt
    - [ ] Completion message verschijnt bij 100%
  - [ ] Visual state update werkt (groene tekst bij checked)
  - [ ] Dark mode werkt

**Andere componenten (moeten nog steeds werken):**
- [ ] Accordions werken
- [ ] Tabs werken
- [ ] ClickableSteps werken

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

## Specifieke Checklist Functionaliteit Tests

### SMART Checklist
- [ ] **Renderen:**
  - [ ] Doelstelling wordt getoond
  - [ ] Alle 5 criteria zijn zichtbaar
  - [ ] Checkboxes zijn klikbaar
  - [ ] Feedback divs zijn verborgen (initieel)

- [ ] **Feedback per criterium:**
  - [ ] Check S → feedback verschijnt (groen)
  - [ ] Check M → feedback verschijnt (geel - waarschuwing)
  - [ ] Check A → feedback verschijnt (groen)
  - [ ] Check R → feedback verschijnt (groen)
  - [ ] Check T → feedback verschijnt (groen)
  - [ ] Uncheck M → feedback verschijnt (geel - goed opgemerkt)
  - [ ] Uncheck andere → feedback verschijnt (blauw - overweeg)

- [ ] **Overall result:**
  - [ ] "Bekijk analyse" button werkt
  - [ ] Result div wordt getoond
  - [ ] Result styling is correct (groen/geel/blauw)
  - [ ] Result tekst is correct
  - [ ] List met unchecked criteria wordt getoond (indien van toepassing)

### Learning Objectives Checklist
- [ ] **Renderen:**
  - [ ] Title wordt getoond
  - [ ] Description wordt getoond
  - [ ] Alle items zijn zichtbaar
  - [ ] Progress indicator (cirkel) wordt getoond
  - [ ] Counter (X/Y) wordt getoond
  - [ ] Initial state wordt geladen uit localStorage

- [ ] **Checkbox interactie:**
  - [ ] Check checkbox → item wordt groen
  - [ ] Uncheck checkbox → item wordt grijs
  - [ ] **localStorage update** ⚠️ **EXTRA BELANGRIJK**
    - [ ] State wordt opgeslagen in localStorage
    - [ ] State wordt geladen bij page reload
    - [ ] Meerdere checklists met verschillende storageKeys werken onafhankelijk

- [ ] **Progress indicator:**
  - [ ] Cirkel update werkt (stroke-dashoffset)
  - [ ] Percentage update werkt
  - [ ] Counter (X/Y) update werkt
  - [ ] Kleur verandert naar groen bij 100%

- [ ] **Completion message:**
  - [ ] Message verschijnt bij 100%
  - [ ] Message verdwijnt bij < 100%
  - [ ] Message styling is correct

### Concept Quality Checklist
- [ ] **Renderen:**
  - [ ] Concept wordt getoond
  - [ ] Definition wordt getoond
  - [ ] Alle 3 criteria (A, O, S) zijn zichtbaar
  - [ ] Radio buttons zijn klikbaar
  - [ ] Feedback divs zijn verborgen (initieel)

- [ ] **Radio button interactie:**
  - [ ] Select "Aanwezig" → feedback verschijnt
  - [ ] Select "Afwezig" → feedback verschijnt
  - [ ] Switch tussen "Aanwezig" en "Afwezig" werkt
  - [ ] Feedback styling is correct (groen/oranje/geel)

- [ ] **Feedback logica:**
  - [ ] **Afbakening (A):**
    - [ ] "Aanwezig" met tijd EN plaats → groene feedback
    - [ ] "Aanwezig" zonder tijd OF plaats → oranje feedback
    - [ ] "Afwezig" zonder tijd EN plaats → groene feedback
    - [ ] "Afwezig" met tijd OF plaats → gele feedback
  - [ ] **Operationalisatie (O):**
    - [ ] "Aanwezig" met indicatoren → groene feedback
    - [ ] "Aanwezig" zonder indicatoren → oranje feedback
    - [ ] "Afwezig" zonder indicatoren → groene feedback
    - [ ] "Afwezig" met indicatoren → gele feedback
  - [ ] **Aansluiting (S):**
    - [ ] "Aanwezig" → groene feedback met uitleg
    - [ ] "Afwezig" → gele feedback met uitleg

- [ ] **Overall result:**
  - [ ] "Bekijk analyse" button werkt
  - [ ] Result div wordt getoond
  - [ ] Result styling is correct (groen/geel/rood/blauw)
  - [ ] Result tekst is correct
  - [ ] List met criteria wordt getoond (indien van toepassing)
  - [ ] Niet-beoordeelde criteria worden getoond (indien van toepassing)

### Helper Methoden
- [ ] **checkAfbakening:**
  - [ ] Detecteert plaats correct
  - [ ] Detecteert tijd correct
  - [ ] Retourneert correct object

- [ ] **checkOperationalisatie:**
  - [ ] Detecteert meetbare indicatoren
  - [ ] Detecteert observeerbare indicatoren
  - [ ] Retourneert correct object

---

## Styling Tests

### SMART Checklist
- [ ] Container styling is correct
- [ ] Criteria styling is correct
- [ ] Checkbox styling is correct
- [ ] Feedback styling is correct
- [ ] Result styling is correct
- [ ] Dark mode werkt

### Learning Objectives Checklist
- [ ] Container styling is correct (gradient)
- [ ] Item styling is correct
- [ ] Checkbox styling is correct
- [ ] Progress indicator styling is correct
- [ ] Counter styling is correct
- [ ] Completion message styling is correct
- [ ] Dark mode werkt

### Concept Quality Checklist
- [ ] Container styling is correct
- [ ] Criteria styling is correct
- [ ] Radio button styling is correct
- [ ] Feedback styling is correct
- [ ] Result styling is correct
- [ ] Dark mode werkt

---

## Regression Tests

### Andere Componenten (moeten nog steeds werken)
- [ ] **Accordions** werken nog steeds (Fase 3)
- [ ] **Tabs** werken nog steeds (Fase 2)
- [ ] **ClickableSteps** werken nog steeds (Fase 4)
- [ ] **HtmlUtils** werkt nog steeds (Fase 1)
- [ ] **Alle andere componenten** werken nog steeds

---

## Browser Compatibility

Test in minimaal:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (indien mogelijk)

---

## localStorage Tests

### Learning Objectives Checklist
- [ ] **State persistence:**
  - [ ] Check items → reload page → state is behouden
  - [ ] Uncheck items → reload page → state is behouden
  - [ ] Meerdere checklists met verschillende storageKeys werken onafhankelijk
  - [ ] localStorage keys zijn correct (learning-objectives-{storageKey})

- [ ] **Edge cases:**
  - [ ] Lege localStorage → geen errors
  - [ ] Corrupt localStorage data → geen errors
  - [ ] localStorage vol → geen errors (graceful degradation)

---

## Samenvatting

### Totaal geteste pagina's: ___ / 7
### Pagina's met checklists: ___
### SMART Checklists getest: ___ / ___
### Learning Objectives Checklists getest: ___ / ___
### Concept Quality Checklists getest: ___ / ___
### localStorage functionaliteit getest: ___
### Errors gevonden: ___
### Warnings gevonden: ___

### Klaar voor Fase 6?
- [ ] Alle checklists werken correct
- [ ] localStorage werkt correct
- [ ] Feedback logica werkt correct
- [ ] Helper methoden werken correct
- [ ] Geen kritieke errors
- [ ] Alle andere componenten werken nog steeds
- [ ] Dark mode werkt
- [ ] Geen regressies

---

## Belangrijkste Test Pagina's

**week2.html** heeft SMART checklist en Learning Objectives checklist - test deze pagina **EXTRA GOED**!

**localStorage functionaliteit** is cruciaal voor Learning Objectives checklist - test deze **ZEER GOED**!

