# Fase 2 Test Checklist - Tabs Extractie

## ⚠️ BELANGRIJK: Test deze onderdelen expliciet na Fase 2

### Algemene Tests
- [ ] **Geen console errors** - Open Developer Tools (F12) en check Console tab
- [ ] **Script loading** - Controleer dat TabRenderer.js correct geladen wordt (Network tab)

---

## Pagina's met Tabs Componenten

### week2.html
**Componenten te testen:**
- [ ] **Tabs component** (indien aanwezig)
  - [ ] Tabs worden correct gerenderd
  - [ ] Tab buttons zijn klikbaar
  - [ ] Tab switching werkt (klik op verschillende tabs)
  - [ ] Actieve tab heeft juiste kleur (groen voor tab 1, blauw voor tab 2, oranje voor tab 3)
  - [ ] Content van actieve tab is zichtbaar
  - [ ] Content van inactieve tabs is verborgen
  - [ ] Responsive design werkt (test op mobiel formaat)

**Andere componenten (moeten nog steeds werken):**
- [ ] Accordions werken
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
- [ ] **Tabs component** (indien aanwezig)
  - [ ] Tabs worden correct gerenderd
  - [ ] Tab switching werkt
  - [ ] Kleuren werken correct
  - [ ] Responsive design werkt

**Andere componenten (moeten nog steeds werken):**
- [ ] Accordions werken
- [ ] ClickableSteps werken
- [ ] Matching exercise werkt

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

### week6.html
**Componenten te testen:**
- [ ] **Tabs component** ⚠️ **BELANGRIJK - Deze pagina heeft tabs!**
  - [ ] Tabs worden correct gerenderd
  - [ ] Tab buttons zijn klikbaar
  - [ ] Tab switching werkt (klik op verschillende tabs)
  - [ ] Actieve tab heeft juiste kleur:
    - [ ] Tab 1 (Groen): "1. Relatie onderzoeksmodel (Groen)"
    - [ ] Tab 2 (Blauw): "2. Onderzoekstechnisch ontwerp (Blauw)"
    - [ ] Tab 3 (Oranje): "3. Dataverzameling (Oranje)" (indien aanwezig)
  - [ ] Content van actieve tab is zichtbaar
  - [ ] Content van inactieve tabs is verborgen
  - [ ] HTML content in tabs wordt correct gerenderd
  - [ ] Responsive design werkt (test op mobiel formaat)
  - [ ] Tabs werken in dark mode

**Andere componenten (moeten nog steeds werken):**
- [ ] Accordions werken
- [ ] ClickableSteps werken
- [ ] Matching exercise werkt

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

## Specifieke Tab Functionaliteit Tests

### Tab Switching
- [ ] Klik op tab 1 → tab 1 wordt actief, content wordt getoond
- [ ] Klik op tab 2 → tab 2 wordt actief, tab 1 wordt inactief
- [ ] Klik op tab 3 → tab 3 wordt actief, andere tabs worden inactief
- [ ] Content wisselt correct tussen tabs
- [ ] Geen visuele glitches tijdens switching

### Tab Kleuren
- [ ] Tab 1 (index 0): Groen wanneer actief
- [ ] Tab 2 (index 1): Blauw wanneer actief
- [ ] Tab 3 (index 2+): Oranje wanneer actief
- [ ] Inactieve tabs hebben grijze styling
- [ ] Hover effect werkt op inactieve tabs

### Responsive Design
- [ ] **Mobile (< 640px):**
  - [ ] Tabs passen binnen schermbreedte
  - [ ] Tekst breekt correct af
  - [ ] Padding is aangepast (kleiner)
  - [ ] Font size is aangepast (0.75rem)
  
- [ ] **Tablet (641px - 1023px):**
  - [ ] Tabs passen binnen schermbreedte
  - [ ] Padding is aangepast (0.75rem)
  - [ ] Font size is aangepast (0.875rem)
  
- [ ] **Desktop (≥ 1024px):**
  - [ ] Tabs passen binnen schermbreedte
  - [ ] Padding is aangepast (0.875rem)
  - [ ] Font size is aangepast (0.9375rem)

### Dark Mode
- [ ] Tabs werken correct in dark mode
- [ ] Actieve tab heeft juiste dark mode kleuren
- [ ] Inactieve tabs hebben juiste dark mode kleuren
- [ ] Content heeft juiste dark mode styling

### Accessibility
- [ ] `aria-selected` attribuut wordt correct gezet
- [ ] `aria-controls` attribuut is correct
- [ ] `role="tab"` en `role="tabpanel"` zijn aanwezig
- [ ] Keyboard navigation werkt (indien geïmplementeerd)

---

## Edge Cases

### Lege Tabs
- [ ] Tabs met lege content arrays worden correct afgehandeld
- [ ] Geen console errors bij lege tabs

### Veel Tabs
- [ ] Als er meer dan 3 tabs zijn, worden ze correct gerenderd
- [ ] Alle tabs zijn klikbaar
- [ ] Tab switching werkt voor alle tabs

### Lange Tab Titels
- [ ] Lange tab titels worden correct afgebroken
- [ ] Tabs blijven binnen de container
- [ ] Geen overflow problemen

---

## Regression Tests

### Andere Componenten (moeten nog steeds werken)
- [ ] **Accordions** werken nog steeds
- [ ] **ClickableSteps** werken nog steeds
- [ ] **Matching exercises** werken nog steeds
- [ ] **TrueFalse exercises** werken nog steeds
- [ ] **SmartChecklist** werkt nog steeds
- [ ] **Alle andere componenten** werken nog steeds

### HtmlUtils (Fase 1)
- [ ] HtmlUtils werkt nog steeds
- [ ] Geen errors gerelateerd aan HtmlUtils

---

## Browser Compatibility

Test in minimaal:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (indien mogelijk)

---

## Samenvatting

### Totaal geteste pagina's: ___ / 7
### Pagina's met tabs: ___
### Tabs die werken: ___ / ___
### Errors gevonden: ___
### Warnings gevonden: ___

### Klaar voor Fase 3?
- [ ] Alle tabs werken correct
- [ ] Geen kritieke errors
- [ ] Alle andere componenten werken nog steeds
- [ ] Responsive design werkt
- [ ] Dark mode werkt
- [ ] Geen regressies

---

## Belangrijkste Test Pagina's

**week6.html** heeft tabs componenten - test deze pagina **EXTRA GOED**!

