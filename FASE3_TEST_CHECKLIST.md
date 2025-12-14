# Fase 3 Test Checklist - Accordions Extractie

## ⚠️ BELANGRIJK: Test deze onderdelen expliciet na Fase 3

### Algemene Tests
- [ ] **Geen console errors** - Open Developer Tools (F12) en check Console tab
- [ ] **Script loading** - Controleer dat AccordionRenderer.js correct geladen wordt (Network tab)

---

## Pagina's met Accordion Componenten

### week2.html
**Componenten te testen:**
- [ ] **Accordions** ⚠️ **BELANGRIJK - Deze pagina heeft accordions!**
  - [ ] Accordions worden correct gerenderd
  - [ ] Accordion items kunnen open/sluiten
  - [ ] Chevron icon roteert correct (of plus icon als usePlusIcon=true)
  - [ ] Animatie werkt soepel (open/sluit)
  - [ ] Default open accordions zijn open bij laden
  - [ ] Content wordt correct getoond
  - [ ] Dark mode werkt

**Andere componenten (moeten nog steeds werken):**
- [ ] Tabs werken
- [ ] TrueFalse exercise werkt
- [ ] Matching exercise werkt
- [ ] SmartChecklist werkt

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

### week3.html
**Componenten te testen:**
- [ ] **Accordions** ⚠️ **BELANGRIJK - Deze pagina heeft accordions!**
  - [ ] Accordions worden correct gerenderd
  - [ ] Accordion items kunnen open/sluiten
  - [ ] Icon animatie werkt
  - [ ] Content wordt correct getoond
  - [ ] Geneste content items werken (indien aanwezig)

**Andere componenten (moeten nog steeds werken):**
- [ ] ClickableSteps werken
- [ ] Tabs werken
- [ ] Matching exercise werkt

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

### week4.html
**Componenten te testen:**
- [ ] **Accordions** ⚠️ **BELANGRIJK - Deze pagina heeft accordions!**
  - [ ] Accordions worden correct gerenderd
  - [ ] Accordion items kunnen open/sluiten
  - [ ] Plus icon werkt (indien usePlusIcon=true)
  - [ ] Content wordt correct getoond
  - [ ] Geneste content items werken

**Andere componenten (moeten nog steeds werken):**
- [ ] ClickableSteps werken
- [ ] BooleanOperator exercise werkt
- [ ] AIQuery exercise werkt
- [ ] AIBouwsteenGenerator werkt

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

### week5.html
**Componenten te testen:**
- [ ] **Accordions** ⚠️ **BELANGRIJK - Deze pagina heeft accordions!**
  - [ ] Accordions worden correct gerenderd
  - [ ] Accordion items kunnen open/sluiten
  - [ ] Plus icon werkt (usePlusIcon=true)
  - [ ] Content wordt correct getoond
  - [ ] **Geneste content items** ⚠️ **EXTRA BELANGRIJK**
    - [ ] Accordions kunnen andere content items bevatten
    - [ ] SourceEvaluationExercise in accordion werkt
    - [ ] Andere content types in accordion werken

**Andere componenten (moeten nog steeds werken):**
- [ ] Matching exercise werkt
- [ ] SourceEvaluation exercise werkt
- [ ] Sequence exercise werkt

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

### week6.html
**Componenten te testen:**
- [ ] **Accordions** ⚠️ **BELANGRIJK - Deze pagina heeft accordions!**
  - [ ] Accordions worden correct gerenderd
  - [ ] Accordion items kunnen open/sluiten
  - [ ] Plus icon werkt (usePlusIcon=true)
  - [ ] Content wordt correct getoond
  - [ ] **Geneste content items** ⚠️ **EXTRA BELANGRIJK**
    - [ ] MatchingExercise in accordion werkt
    - [ ] Andere content types in accordion werken

**Andere componenten (moeten nog steeds werken):**
- [ ] ClickableSteps werken
- [ ] Matching exercise werkt
- [ ] Tabs werken

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

## Specifieke Accordion Functionaliteit Tests

### Basis Functionaliteit
- [ ] **Open/Sluiten:**
  - [ ] Klik op accordion → accordion opent
  - [ ] Klik op open accordion → accordion sluit
  - [ ] Animatie is soepel (300ms transition)
  - [ ] Geen visuele glitches

### Icon Types
- [ ] **Chevron Icon (default):**
  - [ ] Chevron wijst naar beneden wanneer gesloten
  - [ ] Chevron roteert 180° wanneer open
  - [ ] Animatie is soepel

- [ ] **Plus Icon (usePlusIcon=true):**
  - [ ] Plus icon wordt getoond
  - [ ] Plus roteert 45° wanneer open
  - [ ] Animatie is soepel

### Default Open State
- [ ] **Default open (index 0, geen usePlusIcon):**
  - [ ] Eerste accordion item is open bij laden
  - [ ] Content is zichtbaar
  - [ ] Icon staat in open positie

- [ ] **Default open (expliciet defaultOpen=true):**
  - [ ] Accordion items met defaultOpen=true zijn open
  - [ ] Andere items zijn gesloten

- [ ] **Alle gesloten (usePlusIcon=true):**
  - [ ] Alle accordion items zijn gesloten bij laden
  - [ ] Geen items zijn standaard open

### Geneste Content ⚠️ EXTRA BELANGRIJK
- [ ] **Geneste Accordions:**
  - [ ] Accordion kan andere accordions bevatten
  - [ ] Geneste accordions hebben juiste styling (geen border)
  - [ ] Geneste accordions kunnen open/sluiten
  - [ ] Geneste accordions werken onafhankelijk van parent

- [ ] **Geneste Content Items:**
  - [ ] Accordion kan andere content items bevatten (paragraphs, headings, etc.)
  - [ ] Content items worden correct gerenderd
  - [ ] Mixed content (strings + content items) werkt
  - [ ] HTML content wordt correct getoond

- [ ] **Geneste Exercises:**
  - [ ] Accordion kan exercises bevatten (matching, sourceEvaluation, etc.)
  - [ ] Exercises werken correct binnen accordion
  - [ ] Exercises kunnen gebruikt worden wanneer accordion open is

### Styling
- [ ] **Normale Accordions:**
  - [ ] Border is zichtbaar
  - [ ] Rounded corners
  - [ ] Hover effect werkt
  - [ ] Active state styling werkt

- [ ] **Geneste Accordions:**
  - [ ] Geen border (seamless)
  - [ ] Juiste padding en spacing
  - [ ] Hover effect werkt

### Dark Mode
- [ ] Accordions werken correct in dark mode
- [ ] Borders hebben juiste dark mode kleuren
- [ ] Text heeft juiste dark mode kleuren
- [ ] Icons hebben juiste dark mode kleuren
- [ ] Hover states werken in dark mode

### Accessibility
- [ ] `aria-expanded` attribuut wordt correct gezet
- [ ] `aria-controls` attribuut is correct
- [ ] `aria-hidden` attribuut wordt correct gezet
- [ ] Keyboard navigation werkt (indien geïmplementeerd)

---

## Edge Cases

### Lege Accordions
- [ ] Accordion met lege items array wordt correct afgehandeld
- [ ] Geen console errors bij lege accordions

### Lege Content
- [ ] Accordion items met lege content worden correct afgehandeld
- [ ] Geen visuele problemen

### Veel Accordion Items
- [ ] Accordion met veel items (10+) wordt correct gerenderd
- [ ] Alle items zijn klikbaar
- [ ] Performance is goed

### Lange Titles
- [ ] Lange accordion titels worden correct weergegeven
- [ ] Geen overflow problemen
- [ ] Text wrapping werkt

---

## Regression Tests

### Andere Componenten (moeten nog steeds werken)
- [ ] **Tabs** werken nog steeds
- [ ] **ClickableSteps** werken nog steeds
- [ ] **Matching exercises** werken nog steeds
- [ ] **TrueFalse exercises** werken nog steeds
- [ ] **SmartChecklist** werkt nog steeds
- [ ] **Alle andere componenten** werken nog steeds

### HtmlUtils & TabRenderer (Fase 1 & 2)
- [ ] HtmlUtils werkt nog steeds
- [ ] TabRenderer werkt nog steeds
- [ ] Geen errors gerelateerd aan eerdere fasen

---

## Browser Compatibility

Test in minimaal:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (indien mogelijk)

---

## Samenvatting

### Totaal geteste pagina's: ___ / 7
### Pagina's met accordions: ___
### Accordions die werken: ___ / ___
### Geneste accordions getest: ___
### Errors gevonden: ___
### Warnings gevonden: ___

### Klaar voor Fase 4?
- [ ] Alle accordions werken correct
- [ ] Geneste accordions werken
- [ ] Geneste content items werken
- [ ] Geen kritieke errors
- [ ] Alle andere componenten werken nog steeds
- [ ] Dark mode werkt
- [ ] Geen regressies

---

## Belangrijkste Test Pagina's

**week2.html, week3.html, week4.html, week5.html, week6.html** hebben accordion componenten - test deze pagina's **EXTRA GOED**!

**week5.html en week6.html** hebben geneste content items in accordions - test deze **ZEER GOED**!

