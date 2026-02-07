# Guide: Nieuwe E-Learning App Aanmaken

Deze guide legt uit hoe je een nieuwe e-learning app aanmaakt in dit monorepo.

> ⚠️ **KRITISCH:** Bepaal eerst welke pagina's/modules je nodig hebt voordat je begint met het aanmaken van pagina's. Elke e-learning app heeft een andere structuur nodig. Kopieer NIET automatisch week 1-7, begrippen of afsluiting tenzij je deze daadwerkelijk nodig hebt. Zie **Stap 2** voor meer informatie.

> 🚨 **MEEST VOORKOMENDE FOUT:** Als je app detectie vergeet toe te voegen (Stap 4), zal je sidebar automatisch week 1-7 tonen, zelfs als je die pagina's niet hebt aangemaakt! Dit gebeurt omdat de app niet wordt gedetecteerd en terugvalt op de standaard structuur. **Voeg ALTIJD app detectie toe aan beide core bestanden voordat je verder gaat!**

## Stap 1: App Structuur Aanmaken

1. Maak een nieuwe folder aan in `/apps/` met de naam van je app (bijv. `mijn-app-naam`)
2. Kopieer de basisstructuur van een bestaande app (bijv. `edubook-logistiek`)

## Stap 2: Bepaal je Pagina Structuur - BELANGRIJK! ⚠️

### ⚠️ Voordat je begint met pagina's aanmaken

**BELANGRIJK:** Elke e-learning app heeft een andere structuur nodig. Bepaal eerst welke pagina's/modules je nodig hebt voordat je begint met het aanmaken van pagina's.

### Waarom dit belangrijk is

Bij het kopiëren van een bestaande app (zoals `logistiek-onderzoek` of `operations-management`) kunnen er automatisch pagina's worden aangemaakt die je niet nodig hebt:
- ❌ Week 1-7 structuur (alleen nodig voor week-gebaseerde cursussen)
- ❌ Begrippenlijst pagina (alleen nodig als je een begrippenlijst hebt)
- ❌ Afsluiting pagina (alleen nodig als je een afsluiting hebt)

**Voorbeeld:** Bij ICTO-BMR zijn automatisch week 1-7, begrippen en afsluiting aangemaakt, maar dit was niet gewenst omdat ICTO-BMR een andere structuur nodig heeft.

### Stappen om je pagina structuur te bepalen

1. **Bedenk welke modules/hoofdstukken je nodig hebt**
   - Bijvoorbeeld: "Hoofdstuk 1", "Hoofdstuk 2", "Module A", "Module B"
   - Of: "Introductie", "Theorie", "Praktijk", "Afsluiting"
   - **NIET** automatisch week 1-7 tenzij je een week-gebaseerde cursus hebt

2. **Bepaal of je submenu's nodig hebt**
   - Sommige modules hebben submenu's (zoals HD 09 in edubook-logistiek)
   - Andere modules zijn eenvoudig zonder submenu's

3. **Maak een lijst van benodigde pagina's**
   ```
   Voorbeeld voor ICTO-BMR:
   - Start (index.html) ✅
   - Module 1: Introductie
   - Module 2: Theorie
   - Module 3: Praktijk
   (GEEN week 1-7, GEEN begrippen, GEEN afsluiting)
   
   Voorbeeld voor week-gebaseerde cursus:
   - Start (index.html) ✅
   - Week 1
   - Week 2
   - Week 3
   - ...
   - Week 7
   - Begrippenlijst (optioneel)
   - Afsluiting (optioneel)
   ```

4. **Documenteer je structuur**
   - Schrijf op welke pagina's je nodig hebt
   - Noteer welke pagina's submenu's hebben
   - Dit helpt je later bij het aanmaken van de pagina's

### Voorbeelden van verschillende structuren

**Minimale app (zoals edubook-logistiek):**
- Start
- HD 09 (met submenu's)

**Week-gebaseerde app (zoals logistiek-onderzoek):**
- Start
- Week 1-7
- Begrippenlijst
- Afsluiting

**Module-gebaseerde app (zoals operations-management):**
- Start
- Operations Processtrategie
- Vraagvoorspelling (deel 1)
- Vraagvoorspelling (deel 2)
- Productieplanning
- Voorraadbeheer (deel 1-3)
- Capaciteitsmanagement (deel 1-2)
- Operations Planning & Scheduling

**Custom app (zoals ICTO-BMR):**
- Start
- [Eigen modules zoals bepaald in stap 2.1]

### Wat te doen als je per ongeluk verkeerde pagina's hebt aangemaakt

Als je per ongeluk week 1-7, begrippen of afsluiting hebt aangemaakt maar deze niet nodig hebt:

1. **Verwijder ongebruikte content JSON bestanden:**
   ```bash
   rm apps/mijn-app/content/week1.content.json
   rm apps/mijn-app/content/week2.content.json
   # ... etc voor alle ongebruikte weken
   rm apps/mijn-app/content/register.json  # begrippenlijst
   rm apps/mijn-app/content/afsluiting.content.json
   ```

2. **Verwijder ongebruikte HTML bestanden:**
   ```bash
   rm apps/mijn-app/week1.html
   rm apps/mijn-app/week2.html
   # ... etc
   rm apps/mijn-app/register.html
   rm apps/mijn-app/afsluiting.html
   ```

3. **Verwijder ongebruikte Page Classes:**
   ```bash
   rm apps/mijn-app/pages/Week1LessonPage.js
   rm apps/mijn-app/pages/Week2LessonPage.js
   # ... etc
   rm apps/mijn-app/pages/RegisterPage.js
   rm apps/mijn-app/pages/AfsluitingLessonPage.js
   ```

4. **Update index.html:**
   - Verwijder script tags voor verwijderde Page Classes
   - Verwijder verwijzingen uit `expectedClasses` arrays
   - Verwijder verwijzingen uit sidebar navigatie (in LayoutRenderer.js)

5. **Update SearchService.js en PDFExporter.js:**
   - Verwijder verwijzingen naar verwijderde content bestanden uit de `files` array

### Checklist voor Stap 2

- [ ] Ik heb bepaald welke modules/hoofdstukken ik nodig heb
- [ ] Ik heb bepaald welke pagina's submenu's hebben
- [ ] Ik heb een lijst gemaakt van alle benodigde pagina's
- [ ] Ik heb gecontroleerd of er geen onnodige pagina's zijn aangemaakt (week 1-7, begrippen, afsluiting)
- [ ] Ik heb onnodige pagina's verwijderd (indien aanwezig)

## Stap 3: Basis Bestanden

### Vereiste bestanden:

```
apps/mijn-app-naam/
├── index.html              # Hoofdpagina (SPA entry point)
├── package.json            # App configuratie
├── config.js              # Client-side configuratie
├── vercel.json            # Vercel deployment config
├── api/
│   └── index.js          # Serverless function handler
├── assets/
│   └── favicon.svg       # App favicon
├── content/              # Content JSON bestanden
└── pages/                # JavaScript page classes
```

## Stap 4: Sidebar Navigatie - KRITISCH! ⚠️

### ⚠️ Probleem: Sidebar valt terug op week 1-7 structuur

**BELANGRIJK:** Als je een nieuwe app aanmaakt zonder app detectie toe te voegen, zal de sidebar automatisch de week 1-7 structuur van "logistiek-onderzoek" tonen, zelfs als je die pagina's niet hebt aangemaakt.

**Symptomen:**
- Je ziet eerst je nieuwe pagina's kort
- Daarna verschijnen automatisch week 1-7, begrippen en afsluiting in de sidebar
- Dit gebeurt omdat de app niet wordt gedetecteerd en terugvalt op de standaard structuur

### Oplossing: App Detectie Toevoegen (VERPLICHT)

**Je MOET app detectie toevoegen aan 2 core bestanden voordat je app correct werkt:**

#### 1. App Detectie in `LayoutRenderer.js`

**Bestand:** `packages/core/js/components/LayoutRenderer.js`

**Stap 1.1:** Voeg app detectie toe in de constructor (rond regel 13-45)

Zoek naar de `if/else if` chain die apps detecteert en voeg je app toe:

```javascript
// Voeg toe VOOR de laatste else (die terugvalt op logistiek-onderzoek)
else if (hostname.includes('mijn-app-naam') || href.includes('mijn-app-naam') || pathname.includes('mijn-app-naam')) {
    this.appId = 'mijn-app-naam';
    this.appTitle = 'Mijn App Naam';
}
```

**Stap 1.2:** Voeg een render methode toe (rond regel 220-300)

Voeg een nieuwe methode toe na `renderEdubookLogistiekNavigation()`:

```javascript
/**
 * Render navigation for mijn-app-naam app
 */
renderMijnAppNavigation() {
    const modules = [
        { id: 'start', title: 'Start', href: 'index.html' }
        // Voeg hier later je eigen modules toe wanneer je pagina's aanmaakt
    ];
    return this.renderModuleNavigationItems(modules);
}
```

**Stap 1.3:** Voeg de methode toe aan de switch in `renderModuleNavigation()` (rond regel 80-90)

```javascript
renderModuleNavigation() {
    if (this.appId === 'operations-management') {
        return this.renderOperationsManagementNavigation();
    } else if (this.appId === 'e-learning-demo') {
        return this.renderElearningDemoNavigation();
    } else if (this.appId === 'edubook-logistiek') {
        return this.renderEdubookLogistiekNavigation();
    } else if (this.appId === 'icto-bmr') {
        return this.renderICTONavigation();
    } else if (this.appId === 'mijn-app-naam') {
        return this.renderMijnAppNavigation();  // ← Voeg deze regel toe
    } else {
        return this.renderLogistiekOnderzoekNavigation();
    }
}
```

**Stap 1.4:** (Optioneel) Voeg icon kleuren toe in `_getModuleIconColors()` (rond regel 310-350)

Als je custom icon kleuren wilt voor je modules:

```javascript
if (this.appId === 'mijn-app-naam') {
    const colorMap = {
        'start': { icon: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        'module-1': { icon: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        'module-2': { icon: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' }
    };
    const colors = colorMap[module.id];
    if (colors) {
        return { iconClass: colors.icon, bgClass: colors.bg };
    }
}
```

#### 2. App Detectie in `NavigationInitializer.js`

**Bestand:** `packages/core/js/components/NavigationInitializer.js`

**Stap 2.1:** Voeg app detectie toe in de constructor (rond regel 10-35)

Zoek naar de `if/else if` chain en voeg je app toe op dezelfde manier als in LayoutRenderer:

```javascript
// Voeg toe VOOR de laatste else (die terugvalt op logistiek-onderzoek)
else if (hostname.includes('mijn-app-naam') || href.includes('mijn-app-naam') || pathname.includes('mijn-app-naam')) {
    this.appId = 'mijn-app-naam';
    this.appTitle = 'Mijn App Naam';
}
```

**Belangrijk:** De `appId` en `appTitle` moeten EXACT hetzelfde zijn als in `LayoutRenderer.js`!

#### 3. (Optioneel) Submenu Setup in `SidebarManager.js`

**Alleen nodig als je pagina's met submenu's hebt** (zoals HD 09 in edubook-logistiek)

Zie Stap 6 voor details over submenu's.

### Checklist voor App Detectie

Voordat je verder gaat met het aanmaken van pagina's, controleer:

- [ ] App detectie toegevoegd in `LayoutRenderer.js` constructor
- [ ] `renderMijnAppNavigation()` methode aangemaakt met minimaal "Start" module
- [ ] Methode toegevoegd aan `renderModuleNavigation()` switch statement
- [ ] App detectie toegevoegd in `NavigationInitializer.js` constructor
- [ ] `appId` en `appTitle` zijn identiek in beide bestanden
- [ ] (Optioneel) Icon kleuren toegevoegd in `_getModuleIconColors()`
- [ ] Getest: Sidebar toont alleen "Start" zonder week 1-7 structuur

### Voorbeeld: Complete Implementatie voor "Mijn App"

**In `LayoutRenderer.js`:**

```javascript
// Constructor (rond regel 33)
else if (hostname.includes('mijn-app') || href.includes('mijn-app') || pathname.includes('mijn-app')) {
    this.appId = 'mijn-app';
    this.appTitle = 'Mijn App';
}

// Render methode (rond regel 220)
renderMijnAppNavigation() {
    const modules = [
        { id: 'start', title: 'Start', href: 'index.html' }
    ];
    return this.renderModuleNavigationItems(modules);
}

// Switch statement (rond regel 88)
else if (this.appId === 'mijn-app') {
    return this.renderMijnAppNavigation();
}
```

**In `NavigationInitializer.js`:**

```javascript
// Constructor (rond regel 30)
else if (hostname.includes('mijn-app') || href.includes('mijn-app') || pathname.includes('mijn-app')) {
    this.appId = 'mijn-app';
    this.appTitle = 'Mijn App';
}
```

### Testen

Na het toevoegen van app detectie:

1. Herstart de development server
2. Open `http://localhost:3000/mijn-app-naam/`
3. Controleer de sidebar - deze zou alleen "Start" moeten tonen
4. Check de browser console - er zouden geen errors moeten zijn
5. Als je nog steeds week 1-7 ziet, controleer:
   - Zijn beide bestanden opgeslagen?
   - Is de server herstart?
   - Klopt de `appId` spelling in beide bestanden?

## Stap 5: Eerste Pagina Toevoegen

### 1. Maak een HTML redirect bestand

```html
<!-- mijn-pagina.html -->
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mijn Pagina - Mijn App</title>
    <script>
        window.location.href = 'index.html#mijn-pagina.html';
    </script>
</head>
<body>
    <p>Redirecting...</p>
</body>
</html>
```

### 2. Maak een Page Class

```javascript
// pages/MijnPaginaLessonPage.js
class MijnPaginaLessonPage extends BaseLessonPage {
    constructor() {
        super('mijn-pagina', 'Mijn Pagina', 'Titel van mijn pagina');
    }

    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }

        let theorieHtml = '';
        const theorie = this.content.theorie;
        
        if (theorie && theorie.content && Array.isArray(theorie.content)) {
            theorieHtml = ContentRenderer.renderContentItems(theorie.content, { enableModal: true });
        }

        const theorieTitle = (theorie && theorie.title) ? theorie.title : 'Theorie';

        return this.contentTemplateRenderer.renderSection(
            theorieTitle,
            theorieHtml,
            'book',
            'purple'
        );
    }

    async afterContentLoaded() {
        if (!this.content || !this.contentLoaded) {
            console.error('[MijnPaginaLessonPage] ❌ Content not loaded properly');
            return false;
        }
        return true;
    }
}

// Export
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MijnPaginaLessonPage;
    } else {
        window.MijnPaginaLessonPage = MijnPaginaLessonPage;
    }
    console.log('[MijnPaginaLessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[MijnPaginaLessonPage] ❌ Error exporting:', error);
    try {
        window.MijnPaginaLessonPage = MijnPaginaLessonPage;
    } catch (e) {
        console.error('[MijnPaginaLessonPage] ❌ Failed to force export:', e);
    }
}
```

### 3. Maak een Content JSON bestand

```json
// content/mijn-pagina.content.json
{
  "intro": {
    "title": "Mijn Pagina",
    "subtitle": "Welkom bij Mijn Pagina",
    "description": "Beschrijving van deze pagina."
  },
  "theorie": {
    "title": "Inleiding",
    "content": [
      {
        "type": "paragraph",
        "text": [
          "<p class=\"text-gray-700 dark:text-gray-300 mb-4\">Welkom bij deze pagina!</p>"
        ]
      }
    ]
  }
}
```

### 4. Voeg de pagina toe aan index.html

In `index.html`, voeg toe aan de script sectie:

```html
<script src="pages/MijnPaginaLessonPage.js" onerror="console.error('[Script] Failed to load MijnPaginaLessonPage.js')"></script>
```

### 5. Update de sidebar navigatie

In `LayoutRenderer.js`, update je `renderMijnAppNavigation()`:

```javascript
renderMijnAppNavigation() {
    const modules = [
        { id: 'start', title: 'Start', href: 'index.html' },
        { id: 'mijn-pagina', title: 'Mijn Pagina', href: 'mijn-pagina.html' }
    ];
    return this.renderModuleNavigationItems(modules);
}
```

## Stap 6: Submenu's Toevoegen (Optioneel)

Als je een pagina met submenu's wilt (zoals HD 09 in edubook-logistiek):

```javascript
renderMijnAppNavigation() {
    const modules = [
        { id: 'start', title: 'Start', href: 'index.html' },
        { 
            id: 'hoofdstuk-1', 
            title: 'Hoofdstuk 1', 
            href: 'hoofdstuk-1.html',
            subItems: [
                { id: 'introductie', title: 'Introductie', anchor: '#introductie' },
                { id: 'paragraaf-1', title: 'Paragraaf 1', anchor: '#paragraaf-1' },
                { id: 'paragraaf-2', title: 'Paragraaf 2', anchor: '#paragraaf-2' }
            ]
        }
    ];
    return this.renderModuleNavigationItems(modules);
}
```

En voeg submenu support toe in `SidebarManager.js`:

```javascript
setupHoofdstuk1Submenu() {
    const navItem = document.querySelector('.hoofdstuk-1-nav-item');
    if (!navItem) return;
    
    const link = navItem.querySelector('a');
    const subItemsContainer = document.getElementById('hoofdstuk-1-subitems-index') || document.getElementById('hoofdstuk-1-subitems');
    const chevron = document.getElementById('hoofdstuk-1-chevron-index') || document.getElementById('hoofdstuk-1-chevron');
    
    if (!link || !subItemsContainer || !chevron) return;
    
    // Check if we're on this page - if so, expand by default
    const isCurrentPage = this.moduleId === 'hoofdstuk-1';
    if (isCurrentPage) {
        subItemsContainer.classList.remove('hidden');
        chevron.classList.add('rotate-180');
    }
    
    // Toggle submenu when clicking chevron
    chevron.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = subItemsContainer.classList.contains('hidden');
        
        if (isHidden) {
            subItemsContainer.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        } else {
            subItemsContainer.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        }
    }, true);
    
    // Handle chevron clicks on the link
    link.addEventListener('click', (e) => {
        const isChevronClick = e.target === chevron || 
                               chevron.contains(e.target) ||
                               (e.target.id && e.target.id.endsWith('-chevron')) ||
                               (e.target.tagName === 'I' && e.target.classList && e.target.classList.contains('fa-chevron-down'));
        
        if (isChevronClick) {
            e.preventDefault();
            e.stopPropagation();
            
            const isHidden = subItemsContainer.classList.contains('hidden');
            if (isHidden) {
                subItemsContainer.classList.remove('hidden');
                chevron.classList.add('rotate-180');
            } else {
                subItemsContainer.classList.add('hidden');
                chevron.classList.remove('rotate-180');
            }
        }
    }, true);
}
```

## Stap 7: Testen

1. Start de development server:
   ```bash
   cd packages/core
   npm run dev:multi
   ```

2. Open je browser:
   ```
   http://localhost:3000/mijn-app-naam/
   ```

3. Controleer:
   - ✅ Sidebar toont alleen "Start"
   - ✅ Geen week 1-7 items
   - ✅ App laadt correct

## Checklist voor Nieuwe App

- [ ] App folder aangemaakt in `/apps/`
- [ ] **Pagina structuur bepaald** (welke modules/hoofdstukken nodig zijn)
- [ ] **Onnodige pagina's verwijderd** (week 1-7, begrippen, afsluiting indien niet nodig)
- [ ] Basis bestanden gekopieerd (index.html, package.json, etc.)
- [ ] **KRITISCH: App detectie toegevoegd aan `LayoutRenderer.js`** (constructor + render methode + switch)
- [ ] **KRITISCH: App detectie toegevoegd aan `NavigationInitializer.js`** (constructor)
- [ ] `renderMijnAppNavigation()` methode toegevoegd met alleen "Start"
- [ ] Getest: Sidebar toont alleen "Start" zonder week 1-7 structuur
- [ ] Eerste pagina aangemaakt (HTML, Page Class, Content JSON)
- [ ] Pagina toegevoegd aan sidebar navigatie in `renderMijnAppNavigation()`
- [ ] Getest in browser - navigatie werkt correct

## Belangrijke Notities

1. **Bepaal eerst je pagina structuur**: Voordat je begint met het aanmaken van pagina's, bepaal eerst welke modules/hoofdstukken je nodig hebt. Elke e-learning app heeft een andere structuur nodig. Kopieer NIET automatisch week 1-7, begrippen of afsluiting tenzij je deze daadwerkelijk nodig hebt.

2. **Sidebar is dynamisch**: De sidebar wordt automatisch gegenereerd door `NavigationInitializer`. Je hoeft NIET handmatig HTML te schrijven in `index.html` voor de navigatie.

3. **Core wijzigingen**: Het toevoegen van app detectie vereist wijzigingen in core bestanden. Maak een Pull Request aan als je geen beheerder bent.

4. **Content JSON**: Alle content staat in JSON bestanden in de `content/` folder. Zie `packages/core/pages/ContentRenderer.js` voor beschikbare content types.

5. **Page Classes**: Elke pagina heeft een JavaScript class die `BaseLessonPage` extend. Deze classes staan in de `pages/` folder.

## Voorbeelden

- **Minimale app**: `edubook-logistiek` (alleen Start + HD 09)
- **Complexe app**: `operations-management` (meerdere modules met submenu's)
- **Week-structuur**: `logistiek-onderzoek` (week 1-7 structuur)

## Hulp Nodig?

- Check de `.cursorrules` file voor algemene best practices
- Bekijk bestaande apps als voorbeeld
- Vraag hulp aan de beheerder voor core wijzigingen

---

## Troubleshooting & Lessons Learned

Deze sectie bevat belangrijke lessen die zijn geleerd tijdens het ontwikkelen en debuggen van apps in dit monorepo.

### 🚀 Server & Development Setup

#### Multi-App Mode

**Probleem:** App is niet zichtbaar op `http://localhost:3000/` of `http://localhost:3000/mijn-app-naam/`.

**Oplossing:**
- Gebruik **altijd** `npm run dev:multi` vanuit `packages/core` om alle apps tegelijk te draaien
- Single-app mode (`npm run dev` vanuit app directory) werkt alleen voor die specifieke app
- Multi-app mode detecteert automatisch alle apps in `/apps/` die een `index.html` bevatten

```bash
cd packages/core
npm run dev:multi
```

#### Port Conflicts

**Probleem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Oplossing:**
1. Zoek welk proces poort 3000 gebruikt:
   ```powershell
   netstat -ano | findstr :3000
   ```
2. Stop het proces (vervang `<PID>` met het nummer uit de output):
   ```powershell
   Stop-Process -Id <PID> -Force
   ```
3. Start de server opnieuw

**Alternatief:** Wijzig de poort in `.env`:
```env
PORT=3001
```

#### App Detectie

**Probleem:** App wordt niet gedetecteerd door de server.

**Oplossing:**
- Zorg dat de app folder een `index.html` bestand bevat
- Check of de app folder naam overeenkomt met de URL (bijv. `edubook-logistiek` → `/edubook-logistiek/`)
- Herstart de server na het toevoegen van een nieuwe app

### 🔀 Routing & Navigation

#### Page Class Detection

**Probleem:** `LessonPage not found` errors in console, of pagina laadt niet.

**Oplossing:**
- Zorg dat de class naam exact overeenkomt (case-sensitive):
  - `HD09LessonPage` (niet `Hd09LessonPage` of `hd09LessonPage`)
- Voeg de script tag toe aan `index.html`:
  ```html
  <script src="pages/MijnPaginaLessonPage.js"></script>
  ```
- Update `expectedClasses` arrays in `index.html` om console warnings te voorkomen:
  ```javascript
  const expectedClasses = ['MijnPaginaLessonPage'];
  ```

#### Hash Anchors met Numerieke IDs

**Probleem:** `Uncaught SyntaxError: Failed to execute 'querySelector' on 'Document': '#9-2' is not a valid selector.`

**Oorzaak:** CSS selectors kunnen niet beginnen met een cijfer. IDs zoals `9-2` zijn technisch geldig in HTML, maar niet als CSS selector.

**Oplossing:**
- Gebruik `document.getElementById()` in plaats van `querySelector()` voor hash scrolling
- Dit is al geïmplementeerd in `AppRouter.js`, maar let hierop bij custom code

**Voorbeeld:**
```javascript
// ❌ Werkt niet
document.querySelector('#9-2')

// ✅ Werkt wel
document.getElementById('9-2')
```

#### Missing Pages Warnings

**Probleem:** Console toont `Missing page classes: ['Week1LessonPage', 'Week2LessonPage', ...]`

**Oplossing:**
- Update `expectedClasses` arrays in `index.html` wanneer je pagina's toevoegt of verwijdert
- Verwijder verwijzingen naar pagina's die niet meer bestaan
- Voeg alleen pagina's toe die daadwerkelijk in gebruik zijn

### 🎨 Sidebar Customization

#### Sidebar Fallback naar Oude Structuur (Week 1-7)

**Probleem:** Bij hard refresh zie je eerst de nieuwe sidebar kort, maar daarna verschijnt automatisch de oude week 1-7 structuur.

**Oorzaak:** App detectie ontbreekt of werkt niet correct, waardoor de sidebar terugvalt op de standaard `logistiek-onderzoek` structuur.

**Dit is het MEEST VOORKOMENDE probleem bij nieuwe apps!**

**Oplossing:**
- Voeg app detectie toe aan **beide** verplichte bestanden:
  1. `packages/core/js/components/LayoutRenderer.js` - App detectie + render methode + switch
  2. `packages/core/js/components/NavigationInitializer.js` - App detectie
  3. `packages/core/js/ui/SidebarManager.js` - Alleen nodig als je submenu's hebt

**Stap-voor-stap fix:**

1. **Open `packages/core/js/components/LayoutRenderer.js`**
   - Zoek naar de constructor (rond regel 13-45)
   - Voeg je app detectie toe VOOR de laatste `else` statement
   - Zoek naar `renderModuleNavigation()` (rond regel 80-90)
   - Voeg je app toe aan de `if/else if` chain
   - Voeg `renderMijnAppNavigation()` methode toe (rond regel 220)

2. **Open `packages/core/js/components/NavigationInitializer.js`**
   - Zoek naar de constructor (rond regel 10-35)
   - Voeg dezelfde app detectie toe als in LayoutRenderer
   - Zorg dat `appId` en `appTitle` EXACT hetzelfde zijn

3. **Herstart de development server**

4. **Test:**
   - Hard refresh (Ctrl+F5)
   - Controleer sidebar - zou alleen "Start" moeten tonen
   - Check browser console voor errors

**Checklist:**
- [ ] App detectie toegevoegd in `LayoutRenderer.js` constructor (VOOR de laatste else)
- [ ] `renderMijnAppNavigation()` methode aangemaakt met minimaal "Start"
- [ ] Methode toegevoegd aan `renderModuleNavigation()` switch statement
- [ ] App detectie toegevoegd in `NavigationInitializer.js` constructor
- [ ] `appId` en `appTitle` zijn identiek in beide bestanden
- [ ] Server herstart na wijzigingen
- [ ] Getest: Sidebar toont alleen "Start" zonder week 1-7

**Belangrijk:** Als je dit niet doet, zal je app ALTIJD terugvallen op de week 1-7 structuur!

#### Submenu's Werken Niet

**Probleem:** Chevron klikt werken niet, of submenu's openen/sluiten niet correct.

**Oplossing:**
- Zorg dat de ID's consistent zijn tussen `LayoutRenderer.js` en `SidebarManager.js`:
  - `hoofdstuk-1-nav-item` (CSS class)
  - `hoofdstuk-1-subitems-index` (container ID)
  - `hoofdstuk-1-chevron-index` (chevron ID)
- Check of `setupHoofdstuk1Submenu()` wordt aangeroepen in `SidebarManager.init()`

### 📝 Content Structure

#### Hash Navigatie Werkt Niet

**Probleem:** Klikken op sidebar links scrollt niet naar de juiste sectie.

**Oplossing:**
- Voeg `id` property toe aan headings in je content JSON:
  ```json
  {
    "type": "heading",
    "text": "9.1 Supply Chain naar Demand Chain",
    "level": 2,
    "id": "9-1"
  }
  ```
- Zorg dat de anchor in de sidebar overeenkomt met de ID:
  ```html
  <a href="hd09.html#9-1" data-anchor="#9-1">9.1 Supply Chain naar Demand Chain</a>
  ```

#### Content Mapping

**Probleem:** Content wordt niet geladen, of verkeerde content wordt getoond.

**Oplossing:**
- `moduleId` in de constructor moet overeenkomen met de JSON bestandsnaam:
  - `moduleId: 'hd09'` → `hd09.content.json`
  - `moduleId: 'week-1'` → `week1.content.json` (speciale mapping)
  - `moduleId: 'module1'` → `module1.content.json`
- Check `BaseLessonPage.getContentFileName()` voor de exacte mapping logica

### 🗂️ File Management

#### Ongebruikte Bestanden

**Probleem:** Oude content JSON bestanden blijven bestaan maar worden niet gebruikt. Dit gebeurt vaak wanneer je een app kopieert en automatisch week 1-7, begrippen of afsluiting pagina's worden aangemaakt die je niet nodig hebt.

**Oplossing:**
- Verwijder ongebruikte content JSON bestanden om verwarring te voorkomen
- Verwijder ook bijbehorende HTML bestanden en Page Classes als ze niet meer nodig zijn
- Update `index.html` om verwijzingen naar verwijderde pagina's te verwijderen
- Update `SearchService.js` en `PDFExporter.js` om verwijzingen naar verwijderde content te verwijderen

**Voorbeeld - Verwijderen van onnodige week structuur:**
```bash
# Verwijder ongebruikte week content bestanden
rm apps/mijn-app/content/week1.content.json
rm apps/mijn-app/content/week2.content.json
rm apps/mijn-app/content/week3.content.json
# ... etc voor alle ongebruikte weken

# Verwijder ongebruikte begrippenlijst (indien niet nodig)
rm apps/mijn-app/content/register.json

# Verwijder ongebruikte afsluiting (indien niet nodig)
rm apps/mijn-app/content/afsluiting.content.json

# Verwijder ongebruikte HTML pagina's
rm apps/mijn-app/week1.html
rm apps/mijn-app/week2.html
# ... etc
rm apps/mijn-app/register.html
rm apps/mijn-app/afsluiting.html

# Verwijder ongebruikte Page Classes
rm apps/mijn-app/pages/Week1LessonPage.js
rm apps/mijn-app/pages/Week2LessonPage.js
# ... etc
rm apps/mijn-app/pages/RegisterPage.js
rm apps/mijn-app/pages/AfsluitingLessonPage.js
```

**Belangrijk:** Bepaal eerst welke pagina's je nodig hebt (zie Stap 2) voordat je begint met verwijderen. Dit voorkomt dat je per ongeluk pagina's verwijdert die je later toch nodig hebt.

#### Navigation Buttons Verbergen

**Probleem:** Je wilt de "Vorige/Volgende" navigation buttons onderaan de pagina verbergen.

**Oplossing:**
- Overschrijf `renderContent()` in je LessonPage class:
  ```javascript
  renderContent() {
      const contentSections = this.renderContentSections();
      
      return `
          <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
              <article class="space-y-6 sm:space-y-8 fade-in">
                  ${this.renderModuleIntro()}
                  ${contentSections}
              </article>
          </div>
      `;
  }
  ```
- **Belangrijk:** Verwijder de `${this.renderNavigation()}` regel om de buttons te verbergen

### 🔍 Debugging Tips

#### Console Logs

**Probleem:** Je weet niet waarom iets niet werkt.

**Oplossing:**
- Check browser console voor errors (F12 → Console tab)
- Zoek naar specifieke error messages:
  - `LessonPage not found` → Class niet geladen of verkeerde naam
  - `Content not loaded` → JSON bestand niet gevonden of syntax error
  - `Missing page classes` → Update `expectedClasses` array
  - `querySelector` errors → Gebruik `getElementById` voor numerieke IDs

#### Hard Refresh

**Probleem:** Wijzigingen worden niet getoond.

**Oplossing:**
- Gebruik hard refresh: `Ctrl+F5` (Windows) of `Cmd+Shift+R` (Mac)
- Dit forceert de browser om alle bestanden opnieuw te laden
- Check of de server opnieuw is gestart na wijzigingen in core bestanden

#### Syntax Errors

**Probleem:** JavaScript syntax errors blokkeren de hele pagina.

**Oplossing:**
- Check JavaScript console voor syntax errors
- Valideer JSON bestanden met een JSON validator
- Gebruik `node -c bestand.js` om JavaScript syntax te controleren:
  ```bash
  node -c "packages/core/js/core/AppRouter.js"
  ```

### 📚 Best Practices

1. **Test altijd na wijzigingen:**
   - Hard refresh (Ctrl+F5)
   - Check browser console voor errors
   - Test navigatie tussen pagina's

2. **Gebruik consistente naming:**
   - Page Classes: `PascalCase` (bijv. `HD09LessonPage`)
   - Module IDs: `kebab-case` (bijv. `hd09`, `week-1`)
   - JSON bestanden: `kebab-case.content.json` (bijv. `hd09.content.json`)

3. **Update alle relevante bestanden:**
   - Wanneer je een pagina toevoegt: HTML, Page Class, Content JSON, Sidebar navigatie
   - Wanneer je een pagina verwijdert: Verwijder alle verwijzingen

4. **Documenteer custom wijzigingen:**
   - Noteer waarom je iets hebt aangepast
   - Voeg comments toe aan code voor complexe logica
   - Update deze guide als je nieuwe lessons learned ontdekt

---

## Hulp Nodig?

- Check de `.cursorrules` file voor algemene best practices
- Bekijk bestaande apps als voorbeeld
- Vraag hulp aan de beheerder voor core wijzigingen

