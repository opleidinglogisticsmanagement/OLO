# VideoManager Test Gids

## ✅ Wat werkt goed

Uit je screenshot zie ik:
- ✅ VIDEOJS logs tonen dat de video player initialiseert
- ✅ Geen JavaScript syntax errors
- ✅ De pagina laadt correct

**Let op:** De `ERR_BLOCKED_BY_CLIENT` errors voor `pendo.io` zijn **NIET** gerelateerd aan video error detection. Dit zijn adblocker/privacy blocker errors en kunnen genegeerd worden.

## 🔍 Test Checklist - Stap voor Stap

### Test 1: Video iframes worden gecontroleerd op page load

**Hoe te testen:**
1. Open de browser console (F12)
2. Ga naar een pagina met video (bijv. week2.html)
3. Type in de console: `document.querySelectorAll('iframe[data-video-url]')`
4. **Verwacht:** Je zou minstens 1 iframe moeten zien
5. Wacht 10 seconden na page load
6. **Verwacht:** Als de video geblokkeerd is, zou een fallback message moeten verschijnen

**Probleem:** Week2LessonPage gebruikt GEEN `data-video-url` attribuut, dus VideoManager detecteert deze iframes niet!

### Test 2: Dynamisch toegevoegde video iframes worden gecontroleerd

**Hoe te testen:**
1. Open browser console
2. Voeg handmatig een iframe toe:
```javascript
const container = document.createElement('div');
container.id = 'test-container';
container.innerHTML = `
    <iframe data-video-url="https://example.com/nonexistent" src="https://example.com/nonexistent"></iframe>
    <div id="test-fallback" class="hidden">Fallback message</div>
`;
document.body.appendChild(container);
```
3. Wacht 10 seconden
4. **Verwacht:** Fallback zou moeten verschijnen

### Test 3: Fallback message verschijnt wanneer video geblokkeerd is

**Hoe te testen:**
1. Gebruik een adblocker of privacy extension die video's blokkeert
2. Of gebruik een ongeldige video URL
3. Wacht 10 seconden (2+3+4 seconden retry delays)
4. **Verwacht:** Een fallback message met waarschuwing

**Probleem:** Week2LessonPage heeft GEEN fallback element, dus er kan geen fallback getoond worden!

### Test 4: Retry mechanism werkt

**Hoe te testen:**
1. Open console
2. Voeg logging toe aan VideoManager (tijdelijk):
```javascript
// In VideoManager.js, voeg toe na regel 44:
console.log('[VideoManager] Check na 2 seconden');
// Na regel 54:
console.log('[VideoManager] Check na 3 seconden (totaal 5)');
// Na regel 73:
console.log('[VideoManager] Check na 4 seconden (totaal 9)');
```
3. **Verwacht:** Je zou logs moeten zien na 2, 5, en 9 seconden

### Test 5: Iframe dimensie check (height < 50px)

**Hoe te testen:**
1. Maak een kleine iframe:
```javascript
const smallIframe = document.createElement('iframe');
smallIframe.style.width = '100%';
smallIframe.style.height = '30px';
smallIframe.setAttribute('data-video-url', 'test');
document.body.appendChild(smallIframe);
```
2. Wacht 6 seconden (2+4)
3. **Verwacht:** Fallback zou moeten verschijnen

### Test 6: Cross-origin restrictions

**Hoe te testen:**
1. Gebruik een video van een ander domein (bijv. Mediasite)
2. Wacht 10 seconden
3. **Verwacht:** Als cross-origin blocking optreedt, zou fallback moeten verschijnen

### Test 7: Geen false positives

**Hoe te testen:**
1. Gebruik een werkende video (bijv. YouTube embed)
2. Wacht 10 seconden
3. **Verwacht:** Geen fallback message, video speelt normaal

### Test 8: MutationObserver detecteert nieuwe iframes

**Hoe te testen:**
1. Gebruik de test pagina: `test-video-manager.html`
2. Klik op "Voeg dynamische iframe toe"
3. **Verwacht:** Na 10 seconden zou fallback moeten verschijnen

### Test 9: Geen JavaScript errors

**Hoe te testen:**
1. Open console
2. Check voor rode errors (niet warnings)
3. **Verwacht:** Alleen `ERR_BLOCKED_BY_CLIENT` voor pendo.io (kan genegeerd worden)

### Test 10: Werkt op desktop en mobile

**Hoe te testen:**
1. Test op desktop browser
2. Test op mobile device of gebruik browser dev tools mobile emulator
3. **Verwacht:** Zelfde functionaliteit op beide

## 🐛 Bekende Problemen

### Probleem 1: Week2LessonPage mist data-video-url

**Symptoom:** VideoManager detecteert iframes in Week2LessonPage niet

**Oorzaak:** Week2LessonPage.js gebruikt geen `data-video-url` attribuut

**Oplossing:** Voeg `data-video-url` toe aan alle iframes

### Probleem 2: Week2LessonPage mist fallback structuur

**Symptoom:** Geen fallback message kan getoond worden

**Oorzaak:** Week2LessonPage heeft geen container met `-container` ID en geen fallback met `-fallback` ID

**Oplossing:** Voeg de juiste HTML structuur toe (zoals in ContentRenderer.js)

## 📝 Snelle Test Commando's

Open browser console en gebruik deze commando's:

```javascript
// Check hoeveel iframes VideoManager kan vinden
document.querySelectorAll('iframe[data-video-url]').length

// Check of VideoManager geïnitialiseerd is
window._videoErrorDetectionSetup

// Check alle video containers
document.querySelectorAll('[id$="-container"]')

// Check alle fallback elements
document.querySelectorAll('[id$="-fallback"]')

// Manueel een iframe checken
const iframe = document.querySelector('iframe[data-video-url]');
const container = iframe?.closest('[id$="-container"]');
const fallback = container?.querySelector('[id$="-fallback"]');
console.log('Container:', container?.id);
console.log('Fallback:', fallback?.id);
console.log('Fallback hidden:', fallback?.classList.contains('hidden'));
```

## 🎯 Aanbevolen Acties

1. **Fix Week2LessonPage.js** - Voeg `data-video-url` en fallback structuur toe
2. **Test met test-video-manager.html** - Gebruik de test pagina om functionaliteit te verifiëren
3. **Check andere week pages** - Zorg dat alle week pages de juiste structuur hebben

