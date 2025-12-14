# Fase 4 Test Checklist - ClickableSteps Extractie

## ⚠️ BELANGRIJK: Test deze onderdelen expliciet na Fase 4

### Algemene Tests
- [ ] **Geen console errors** - Open Developer Tools (F12) en check Console tab
- [ ] **Script loading** - Controleer dat ClickableStepsRenderer.js correct geladen wordt (Network tab)

---

## Pagina's met ClickableSteps Componenten

### week3.html
**Componenten te testen:**
- [ ] **ClickableSteps** ⚠️ **BELANGRIJK - Deze pagina heeft clickableSteps!**
  - [ ] ClickableSteps worden correct gerenderd
  - [ ] Step buttons zijn klikbaar
  - [ ] Steps kunnen open/sluiten
  - [ ] Chevron icon roteert correct
  - [ ] Animatie werkt soepel (open/sluit)
  - [ ] **allowMultiple werkt** - Meerdere steps kunnen tegelijk open zijn (default)
  - [ ] Content wordt correct getoond
  - [ ] **Geneste content items** ⚠️ **EXTRA BELANGRIJK**
    - [ ] Steps kunnen andere content items bevatten
    - [ ] Tabs in clickableSteps werken
    - [ ] Andere content types in steps werken
  - [ ] Dark mode werkt

**Andere componenten (moeten nog steeds werken):**
- [ ] Accordions werken
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
- [ ] **ClickableSteps** ⚠️ **BELANGRIJK - Deze pagina heeft clickableSteps!**
  - [ ] ClickableSteps worden correct gerenderd
  - [ ] Steps kunnen open/sluiten
  - [ ] Icon animatie werkt
  - [ ] Content wordt correct getoond
  - [ ] Geneste content items werken
  - [ ] allowMultiple werkt (meerdere steps open tegelijk)

**Andere componenten (moeten nog steeds werken):**
- [ ] Accordions werken
- [ ] BooleanOperator exercise werkt
- [ ] AIQuery exercise werkt
- [ ] AIBouwsteenGenerator werkt

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

### week6.html
**Componenten te testen:**
- [ ] **ClickableSteps** ⚠️ **BELANGRIJK - Deze pagina heeft clickableSteps!**
  - [ ] ClickableSteps worden correct gerenderd
  - [ ] Steps kunnen open/sluiten
  - [ ] Icon animatie werkt
  - [ ] Content wordt correct getoond
  - [ ] **Geneste content items** ⚠️ **EXTRA BELANGRIJK**
    - [ ] Steps kunnen video's bevatten
    - [ ] Steps kunnen andere content types bevatten
  - [ ] allowMultiple werkt

**Andere componenten (moeten nog steeds werken):**
- [ ] Accordions werken
- [ ] Matching exercise werkt
- [ ] Tabs werken

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

## Specifieke ClickableSteps Functionaliteit Tests

### Basis Functionaliteit
- [ ] **Open/Sluiten:**
  - [ ] Klik op step → step opent
  - [ ] Klik op open step → step sluit
  - [ ] Animatie is soepel (300ms transition)
  - [ ] Geen visuele glitches

### allowMultiple Functionaliteit ⚠️ BELANGRIJK
- [ ] **allowMultiple = true (default):**
  - [ ] Meerdere steps kunnen tegelijk open zijn
  - [ ] Openen van nieuwe step sluit andere steps NIET
  - [ ] Elke step werkt onafhankelijk

- [ ] **allowMultiple = false (indien gebruikt):**
  - [ ] Openen van nieuwe step sluit andere steps WEL
  - [ ] Slechts één step kan open zijn tegelijk

### Icon & Styling
- [ ] **Chevron Icon:**
  - [ ] Chevron wijst naar beneden wanneer gesloten
  - [ ] Chevron roteert 180° wanneer open
  - [ ] Animatie is soepel

- [ ] **Button Styling:**
  - [ ] Gesloten step: grijs achtergrond
  - [ ] Open step: witte achtergrond, groene tekst
  - [ ] Hover effect werkt
  - [ ] Active state styling werkt

### Steps zonder Content
- [ ] **Disabled Steps:**
  - [ ] Steps zonder content zijn disabled
  - [ ] "(Binnenkort beschikbaar)" tekst wordt getoond
  - [ ] Geen chevron icon bij disabled steps
  - [ ] Disabled steps zijn niet klikbaar

### Geneste Content ⚠️ EXTRA BELANGRIJK
- [ ] **Geneste Content Items:**
  - [ ] Steps kunnen andere content items bevatten (paragraphs, headings, etc.)
  - [ ] Content items worden correct gerenderd
  - [ ] Mixed content (strings + content items) werkt
  - [ ] HTML content wordt correct getoond

- [ ] **Geneste Tabs:**
  - [ ] Steps kunnen tabs bevatten (week3.html heeft dit!)
  - [ ] Tabs werken correct binnen step
  - [ ] Tab switching werkt binnen step

- [ ] **Geneste Videos:**
  - [ ] Steps kunnen video's bevatten (week6.html heeft dit!)
  - [ ] Videos worden correct getoond
  - [ ] Video player werkt

- [ ] **Geneste Exercises:**
  - [ ] Steps kunnen exercises bevatten (indien aanwezig)
  - [ ] Exercises werken correct binnen step

### Styling
- [ ] **Container:**
  - [ ] Border is zichtbaar
  - [ ] Rounded corners
  - [ ] Hover effect werkt
  - [ ] Active state styling werkt

- [ ] **Step Content:**
  - [ ] Content heeft juiste padding (p-6)
  - [ ] Content heeft juiste achtergrond kleur
  - [ ] Text styling is correct

### Dark Mode
- [ ] ClickableSteps werken correct in dark mode
- [ ] Borders hebben juiste dark mode kleuren
- [ ] Text heeft juiste dark mode kleuren
- [ ] Icons hebben juiste dark mode kleuren
- [ ] Hover states werken in dark mode
- [ ] Open step styling werkt in dark mode

### Accessibility
- [ ] `aria-expanded` attribuut wordt correct gezet
- [ ] `aria-controls` attribuut is correct
- [ ] `aria-hidden` attribuut wordt correct gezet
- [ ] Disabled steps hebben juiste aria attributen

---

## Edge Cases

### Lege Steps
- [ ] ClickableSteps met lege steps array wordt correct afgehandeld
- [ ] Geen console errors bij lege clickableSteps

### Lege Content
- [ ] Steps met lege content worden correct afgehandeld
- [ ] Geen visuele problemen

### Veel Steps
- [ ] ClickableSteps met veel steps (10+) wordt correct gerenderd
- [ ] Alle steps zijn klikbaar
- [ ] Performance is goed

### Lange Labels
- [ ] Lange step labels worden correct weergegeven
- [ ] Geen overflow problemen
- [ ] Text wrapping werkt

---

## Regression Tests

### Andere Componenten (moeten nog steeds werken)
- [ ] **Accordions** werken nog steeds
- [ ] **Tabs** werken nog steeds
- [ ] **Matching exercises** werken nog steeds
- [ ] **TrueFalse exercises** werken nog steeds
- [ ] **SmartChecklist** werkt nog steeds
- [ ] **Alle andere componenten** werken nog steeds

### HtmlUtils, TabRenderer & AccordionRenderer (Fase 1, 2 & 3)
- [ ] HtmlUtils werkt nog steeds
- [ ] TabRenderer werkt nog steeds
- [ ] AccordionRenderer werkt nog steeds
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
### Pagina's met clickableSteps: ___
### ClickableSteps die werken: ___ / ___
### Geneste content items getest: ___
### allowMultiple getest: ___
### Errors gevonden: ___
### Warnings gevonden: ___

### Klaar voor Fase 5?
- [ ] Alle clickableSteps werken correct
- [ ] allowMultiple werkt correct
- [ ] Geneste content items werken
- [ ] Geneste tabs werken (week3.html)
- [ ] Geen kritieke errors
- [ ] Alle andere componenten werken nog steeds
- [ ] Dark mode werkt
- [ ] Geen regressies

---

## Belangrijkste Test Pagina's

**week3.html, week4.html, week6.html** hebben clickableSteps componenten - test deze pagina's **EXTRA GOED**!

**week3.html** heeft geneste tabs in clickableSteps - test deze **ZEER GOED**!

**week6.html** heeft geneste videos in clickableSteps - test deze **ZEER GOED**!

