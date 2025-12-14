# Fase 6 Test Checklist - Basis Oefeningen Extractie

## ⚠️ BELANGRIJK: Test deze onderdelen expliciet na Fase 6

### Algemene Tests
- [ ] **Geen console errors** - Open Developer Tools (F12) en check Console tab
- [ ] **Script loading** - Controleer dat ExerciseRenderer.js correct geladen wordt (Network tab)

---

## Pagina's met Exercise Componenten

### week2.html
**Componenten te testen:**
- [ ] **True/False Exercise** ⚠️ **BELANGRIJK - Deze pagina heeft True/False exercise!**
  - [ ] Exercise wordt correct gerenderd
  - [ ] Alle statements zijn zichtbaar
  - [ ] Radio buttons zijn klikbaar
  - [ ] "Controleer antwoorden" button werkt
  - [ ] Feedback per statement wordt getoond
  - [ ] Overall result wordt getoond
  - [ ] Radio buttons worden disabled na check
  - [ ] Dark mode werkt

- [ ] **Matching Exercise** ⚠️ **BELANGRIJK - Deze pagina heeft Matching exercise!**
  - [ ] Exercise wordt correct gerenderd
  - [ ] Alle categorieën zijn zichtbaar
  - [ ] Alle items zijn zichtbaar
  - [ ] **Drag & Drop werkt** ⚠️ **EXTRA BELANGRIJK**
    - [ ] Items zijn draggable
    - [ ] Items kunnen naar categorieën gesleept worden
    - [ ] Items kunnen verplaatst worden tussen categorieën
    - [ ] Visual feedback tijdens drag (opacity)
    - [ ] Items blijven draggable na drop
  - [ ] "Controleer antwoorden" button werkt
  - [ ] Feedback wordt getoond (groen voor correct, rood voor incorrect)
  - [ ] Overall result wordt getoond
  - [ ] Dark mode werkt

**Andere componenten (moeten nog steeds werken):**
- [ ] Accordions werken
- [ ] Tabs werken
- [ ] ClickableSteps werken
- [ ] Checklists werken

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

### week3.html
**Componenten te testen:**
- [ ] **Matching Exercise** ⚠️ **BELANGRIJK - Deze pagina heeft Matching exercise!**
  - [ ] Zie week2.html tests voor Matching Exercise

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

### week5.html
**Componenten te testen:**
- [ ] **Matching Exercise** ⚠️ **BELANGRIJK - Deze pagina heeft Matching exercise!**
  - [ ] Zie week2.html tests voor Matching Exercise

**Andere componenten (moeten nog steeds werken):**
- [ ] Accordions werken

**Console Check:**
- [ ] Geen errors
- [ ] Warnings: _________________________

**Notes:**
_________________________________________

---

### week6.html
**Componenten te testen:**
- [ ] **Matching Exercise** ⚠️ **BELANGRIJK - Deze pagina heeft Matching exercise!**
  - [ ] Zie week2.html tests voor Matching Exercise

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

## Specifieke Exercise Functionaliteit Tests

### True/False Exercise
- [ ] **Renderen:**
  - [ ] Title wordt getoond
  - [ ] Instruction wordt getoond
  - [ ] Alle statements zijn zichtbaar
  - [ ] Radio buttons zijn klikbaar
  - [ ] Feedback divs zijn verborgen (initieel)

- [ ] **Radio button interactie:**
  - [ ] Select "Waar" → radio button is checked
  - [ ] Select "Onwaar" → radio button is checked
  - [ ] Switch tussen "Waar" en "Onwaar" werkt
  - [ ] Meerdere statements kunnen onafhankelijk beantwoord worden

- [ ] **Check functionaliteit:**
  - [ ] "Controleer antwoorden" button werkt
  - [ ] Feedback per statement wordt getoond
  - [ ] Correct antwoord → groene feedback
  - [ ] Incorrect antwoord → rode feedback met correct antwoord
  - [ ] Geen antwoord geselecteerd → gele feedback
  - [ ] Radio buttons worden disabled na check
  - [ ] Overall result wordt getoond
  - [ ] Result styling is correct (groen/geel/blauw)

- [ ] **Feedback logica:**
  - [ ] Correct antwoord → "✓ Correct!" + explanation
  - [ ] Incorrect antwoord → "✗ Onjuist. Het juiste antwoord is: [Waar/Onwaar]" + explanation
  - [ ] Geen antwoord → "Selecteer een antwoord."

- [ ] **Overall result:**
  - [ ] Alle correct → "✓ Uitstekend!" (groen)
  - [ ] Sommige correct → "⚠ Goed bezig" (geel) met count
  - [ ] Geen correct → "💡 Probeer opnieuw" (blauw)

### Matching Exercise
- [ ] **Renderen:**
  - [ ] Title wordt getoond
  - [ ] Instruction wordt getoond
  - [ ] Alle categorieën zijn zichtbaar
  - [ ] Categorie descriptions worden getoond (indien aanwezig)
  - [ ] Alle items zijn zichtbaar
  - [ ] Items zijn geshuffled (niet in originele volgorde)

- [ ] **Drag & Drop functionaliteit:** ⚠️ **EXTRA BELANGRIJK**
  - [ ] **Drag start:**
    - [ ] Item wordt draggable
    - [ ] Visual feedback (opacity 0.5)
    - [ ] Data wordt correct opgeslagen in dataTransfer
  - [ ] **Drag over:**
    - [ ] Categorie accepteert drop (ondragover)
    - [ ] Drop effect is "move"
  - [ ] **Drop:**
    - [ ] Item wordt naar categorie verplaatst
    - [ ] Item wordt toegevoegd aan dropped-items container
    - [ ] Opacity wordt gereset naar 1
    - [ ] Item blijft draggable
    - [ ] Event handlers blijven werken na drop
  - [ ] **Drag end (cancelled):**
    - [ ] Opacity wordt gereset als drag geannuleerd wordt
  - [ ] **Item verplaatsen:**
    - [ ] Item kan van categorie A naar categorie B verplaatst worden
    - [ ] Item wordt verwijderd uit oude categorie
    - [ ] Item wordt toegevoegd aan nieuwe categorie
    - [ ] Event handlers blijven werken

- [ ] **Check functionaliteit:**
  - [ ] "Controleer antwoorden" button werkt
  - [ ] Correct geplaatste items worden groen
  - [ ] Incorrect geplaatste items worden rood
  - [ ] Feedback wordt getoond voor incorrect geplaatste items
  - [ ] Overall result wordt getoond
  - [ ] Result styling is correct (groen/geel/blauw)

- [ ] **Feedback logica:**
  - [ ] Correct geplaatst → groene border en background
  - [ ] Incorrect geplaatst → rode border en background + feedback tekst
  - [ ] Feedback tekst: "[item text] is nog niet op de juiste plek geplaatst. Kijk nog even goed naar de criteria."

- [ ] **Overall result:**
  - [ ] Alle correct → "✓ Uitstekend!" (groen)
  - [ ] Sommige correct → "⚠ Goed bezig" (geel) met count en feedback list
  - [ ] Geen correct → "💡 Probeer opnieuw" (blauw)

- [ ] **Responsive design:**
  - [ ] Werkt op desktop
  - [ ] Werkt op tablet
  - [ ] Werkt op mobiel (indien mogelijk - drag & drop kan beperkt zijn op mobiel)

---

## Styling Tests

### True/False Exercise
- [ ] Container styling is correct
- [ ] Statement styling is correct
- [ ] Radio button styling is correct
- [ ] Feedback styling is correct (groen/rood/geel)
- [ ] Result styling is correct
- [ ] Dark mode werkt

### Matching Exercise
- [ ] Container styling is correct
- [ ] Categorie styling is correct (dashed border)
- [ ] Item styling is correct
- [ ] Drag feedback styling is correct (opacity)
- [ ] Check feedback styling is correct (groen/rood)
- [ ] Result styling is correct
- [ ] Dark mode werkt
- [ ] Responsive grid werkt (1 kolom op mobiel, 2 op desktop)

---

## Regression Tests

### Andere Componenten (moeten nog steeds werken)
- [ ] **Accordions** werken nog steeds (Fase 3)
- [ ] **Tabs** werken nog steeds (Fase 2)
- [ ] **ClickableSteps** werken nog steeds (Fase 4)
- [ ] **Checklists** werken nog steeds (Fase 5)
- [ ] **HtmlUtils** werkt nog steeds (Fase 1)
- [ ] **Alle andere componenten** werken nog steeds

---

## Browser Compatibility

Test in minimaal:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (indien mogelijk)

**Let op:** Drag & drop kan verschillen tussen browsers. Test dit goed!

---

## Drag & Drop Edge Cases

### Matching Exercise
- [ ] **Item al in categorie:**
  - [ ] Item kan verplaatst worden naar andere categorie
  - [ ] Item wordt correct verwijderd uit oude categorie
  - [ ] Item wordt correct toegevoegd aan nieuwe categorie

- [ ] **Meerdere items in categorie:**
  - [ ] Meerdere items kunnen in dezelfde categorie geplaatst worden
  - [ ] Items blijven draggable
  - [ ] Check functionaliteit werkt met meerdere items

- [ ] **Drag cancelled:**
  - [ ] Als drag geannuleerd wordt, wordt opacity gereset
  - [ ] Item blijft op originele plek

- [ ] **Event handlers na drop:**
  - [ ] Ondragstart handler werkt na drop
  - [ ] Ondragend handler werkt na drop
  - [ ] Item kan opnieuw gesleept worden

---

## Samenvatting

### Totaal geteste pagina's: ___ / 7
### Pagina's met True/False exercises: ___
### Pagina's met Matching exercises: ___
### True/False Exercises getest: ___ / ___
### Matching Exercises getest: ___ / ___
### Drag & Drop functionaliteit getest: ___
### Errors gevonden: ___
### Warnings gevonden: ___

### Klaar voor Fase 7?
- [ ] Alle exercises werken correct
- [ ] Drag & drop werkt correct
- [ ] Feedback logica werkt correct
- [ ] Geen kritieke errors
- [ ] Alle andere componenten werken nog steeds
- [ ] Dark mode werkt
- [ ] Geen regressies

---

## Belangrijkste Test Pagina's

**week2.html** heeft zowel True/False exercise als Matching exercise - test deze pagina **EXTRA GOED**!

**Drag & Drop functionaliteit** is cruciaal voor Matching exercise - test deze **ZEER GOED** op verschillende browsers!

**week3.html, week5.html, week6.html** hebben Matching exercises - test deze ook goed!

