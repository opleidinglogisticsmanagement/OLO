# Guide: Nieuwe E-Learning App Aanmaken

Deze guide legt uit hoe je een nieuwe e-learning app aanmaakt in dit monorepo.

## Stap 1: App Structuur Aanmaken

1. Maak een nieuwe folder aan in `/apps/` met de naam van je app (bijv. `mijn-app-naam`)
2. Kopieer de basisstructuur van een bestaande app (bijv. `edubook-logistiek`)

## Stap 2: Basis Bestanden

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

## Stap 3: Sidebar Navigatie - BELANGRIJK!

### ⚠️ Standaard Sidebar Structuur

**Bij het aanmaken van een nieuwe app moet de sidebar vrijwel leeg zijn:**

- ✅ **Alleen "Start"** moet zichtbaar zijn in de sidebar
- ❌ **GEEN** week 1-7 structuur
- ❌ **GEEN** vooraf gedefinieerde modules

### Waarom?

De sidebar wordt automatisch gegenereerd door `LayoutRenderer` en `NavigationInitializer`. Als je app nog niet gedetecteerd wordt, valt het terug op de standaard "logistiek-onderzoek" structuur met week 1-7.

### Oplossing: App Detectie Toevoegen

Om je app correct te laten werken, moet je de app detectie toevoegen aan de core bestanden:

1. **`packages/core/js/components/LayoutRenderer.js`**
   - Voeg app detectie toe in de constructor (rond regel 13-28)
   - Voeg een nieuwe `renderMijnAppNavigation()` methode toe
   - Voeg de methode toe aan `renderModuleNavigation()` switch

2. **`packages/core/js/components/NavigationInitializer.js`**
   - Voeg app detectie toe in de constructor (rond regel 11-25)

3. **`packages/core/js/ui/SidebarManager.js`** (optioneel, alleen als je submenu's hebt)
   - Voeg submenu setup toe als je expandable items nodig hebt

### Voorbeeld: Minimale Sidebar Structuur

```javascript
// In LayoutRenderer.js
renderMijnAppNavigation() {
    const modules = [
        { id: 'start', title: 'Start', href: 'index.html' }
        // Voeg hier later je eigen modules toe
    ];
    return this.renderModuleNavigationItems(modules);
}
```

## Stap 4: Eerste Pagina Toevoegen

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

## Stap 5: Submenu's Toevoegen (Optioneel)

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

## Stap 6: Testen

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
- [ ] Basis bestanden gekopieerd (index.html, package.json, etc.)
- [ ] App detectie toegevoegd aan `LayoutRenderer.js`
- [ ] App detectie toegevoegd aan `NavigationInitializer.js`
- [ ] `renderMijnAppNavigation()` methode toegevoegd met alleen "Start"
- [ ] Eerste pagina aangemaakt (HTML, Page Class, Content JSON)
- [ ] Pagina toegevoegd aan sidebar navigatie
- [ ] Getest in browser

## Belangrijke Notities

1. **Sidebar is dynamisch**: De sidebar wordt automatisch gegenereerd door `NavigationInitializer`. Je hoeft NIET handmatig HTML te schrijven in `index.html` voor de navigatie.

2. **Core wijzigingen**: Het toevoegen van app detectie vereist wijzigingen in core bestanden. Maak een Pull Request aan als je geen beheerder bent.

3. **Content JSON**: Alle content staat in JSON bestanden in de `content/` folder. Zie `packages/core/pages/ContentRenderer.js` voor beschikbare content types.

4. **Page Classes**: Elke pagina heeft een JavaScript class die `BaseLessonPage` extend. Deze classes staan in de `pages/` folder.

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

#### Sidebar Fallback naar Oude Structuur

**Probleem:** Bij hard refresh zie je eerst de nieuwe sidebar, maar daarna verschijnt de oude week 1-7 structuur.

**Oorzaak:** App detectie werkt niet correct, waardoor de sidebar terugvalt op de standaard `logistiek-onderzoek` structuur.

**Oplossing:**
- Voeg app detectie toe aan **alle drie** bestanden:
  1. `packages/core/js/components/LayoutRenderer.js` - App detectie + render methode
  2. `packages/core/js/components/NavigationInitializer.js` - App detectie
  3. `packages/core/js/ui/SidebarManager.js` - Submenu setup (alleen als nodig)

**Checklist:**
- [ ] App detectie toegevoegd in `LayoutRenderer.js` constructor
- [ ] `renderMijnAppNavigation()` methode toegevoegd
- [ ] Methode toegevoegd aan `renderModuleNavigation()` switch statement
- [ ] App detectie toegevoegd in `NavigationInitializer.js` constructor
- [ ] Submenu setup toegevoegd in `SidebarManager.js` (indien nodig)

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

**Probleem:** Oude content JSON bestanden blijven bestaan maar worden niet gebruikt.

**Oplossing:**
- Verwijder ongebruikte content JSON bestanden om verwarring te voorkomen
- Verwijder ook bijbehorende HTML bestanden en Page Classes als ze niet meer nodig zijn
- Update `index.html` om verwijzingen naar verwijderde pagina's te verwijderen

**Voorbeeld:**
```bash
# Verwijder ongebruikt content bestand
rm apps/mijn-app/content/week1.content.json

# Verwijder ongebruikte HTML pagina (optioneel)
rm apps/mijn-app/week1.html

# Verwijder ongebruikte Page Class (optioneel)
rm apps/mijn-app/pages/Week1LessonPage.js
```

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

