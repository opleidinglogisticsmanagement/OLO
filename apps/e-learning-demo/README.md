# E-Learning Demo App

Deze app dient als **meta-e-learning** voor collega-docenten om te leren hoe ze hun eigen e-learning app kunnen vullen binnen deze monorepo.

## 📁 Structuur

```
apps/e-learning-demo/
├── content/              # JSON content bestanden
│   ├── demo.content.json
│   └── module1.content.json
├── pages/                # LessonPage classes
│   ├── DemoLessonPage.js
│   └── Module1LessonPage.js
├── assets/               # Afbeeldingen, documenten
├── demo.html            # Demo pagina
├── module1.html         # Module 1 pagina
└── index.html           # Dashboard met SPA router
```

## 🎯 Modules

### Demo (`demo.html`)
- **Content:** `content/demo.content.json`
- **Class:** `DemoLessonPage`
- **Doel:** Laat zien wat er mogelijk is in het platform en legt uit hoe collega's te werk moeten gaan

### Module 1: Welkom bij het Framework (`module1.html`)
- **Content:** `content/module1.content.json`
- **Class:** `Module1LessonPage`
- **Doel:** Leert docenten over de monorepo-filosofie, het onderscheid tussen Core en App, en hoe Cursor helpt bij content vullen

## 🚀 Nieuwe Module Toevoegen

Om een nieuwe module toe te voegen aan deze meta-e-learning, volg je deze stappen:

### Stap 1: Content JSON Bestand

Maak een nieuw JSON bestand aan in `content/` met de naam `moduleX.content.json`:

```json
{
  "intro": {
    "title": "Module X: Titel",
    "subtitle": "Subtitle",
    "description": "Beschrijving van de module"
  },
  "leerdoelen": {
    "title": "Leerdoelen",
    "description": "Na het doorlopen van deze module kun je:",
    "items": [
      "Leerdoel 1",
      "Leerdoel 2"
    ],
    "interactive": false
  },
  "theorie": {
    "title": "Theorie Titel",
    "content": [
      {
        "type": "paragraph",
        "text": ["Tekst hier..."]
      }
    ]
  }
}
```

### Stap 2: LessonPage Class

Maak een nieuwe class aan in `pages/ModuleXLessonPage.js`:

```javascript
class ModuleXLessonPage extends BaseLessonPage {
    constructor() {
        super('moduleX', 'Module X', 'Titel van Module X');
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
            console.error('[ModuleXLessonPage] ❌ Content not loaded properly');
            return false;
        }
        return true;
    }
}

// Export
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ModuleXLessonPage;
    } else {
        window.ModuleXLessonPage = ModuleXLessonPage;
    }
    console.log('[ModuleXLessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[ModuleXLessonPage] ❌ Error exporting:', error);
    try {
        window.ModuleXLessonPage = ModuleXLessonPage;
    } catch (e) {
        console.error('[ModuleXLessonPage] ❌ Failed to force export:', e);
    }
}
```

**Belangrijk:** De `moduleId` in de constructor (bijv. `'moduleX'`) moet overeenkomen met de bestandsnaam van het JSON bestand (`moduleX.content.json`). Zie `BaseLessonPage.getContentFileName()` voor de mapping logica.

### Stap 3: HTML Pagina

Maak een nieuwe HTML pagina aan (bijv. `moduleX.html`) gebaseerd op `module1.html`:

```html
<!DOCTYPE html>
<html lang="nl">
<head>
    <!-- ... head content ... -->
    <title>Module X - E-Learning Demo</title>
</head>
<body>
    <!-- ... body content ... -->
    <script src="pages/ModuleXLessonPage.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.appRouter) {
                try {
                    const moduleXPage = new ModuleXLessonPage();
                    moduleXPage.init();
                } catch (e) {
                    console.error('[moduleX.html] Failed to initialize ModuleXLessonPage:', e);
                }
            }
        });
    </script>
</body>
</html>
```

### Stap 4: Router Configuratie

Voeg de nieuwe route toe aan `index.html`:

1. **Script loader toevoegen** (rond regel 630):
```html
<script src="pages/ModuleXLessonPage.js" onerror="console.error('[Script] Failed to load ModuleXLessonPage.js')"></script>
```

2. **Expected classes updaten** (rond regel 639):
```javascript
const expectedClasses = [
    'DemoLessonPage',
    'Module1LessonPage',
    'ModuleXLessonPage'  // Toevoegen
];
```

3. **Route toevoegen** (rond regel 1562):
```javascript
router.routes = {
    'index.html': () => router.loadIndexPage(),
    'demo.html': () => router.loadWeekPage('demo', 'DemoLessonPage'),
    'module1.html': () => router.loadWeekPage('module1', 'Module1LessonPage'),
    'moduleX.html': () => router.loadWeekPage('moduleX', 'ModuleXLessonPage')  // Toevoegen
};
```

## 📝 Content Types

Gebruik alleen de standaard content types die worden ondersteund door `ContentRenderer`:

- `paragraph` - Tekst blokken
- `heading` - Headings (h1-h6)
- `image` - Afbeeldingen
- `url` - Links
- `video` - Embedded video's
- `document` - Document links
- `highlight` - Info boxen / Waarschuwingen
- `tabs` - Tab componenten
- `accordion` - Accordion componenten
- `clickableSteps` - Klikbare stappen
- En meer... (zie `packages/core/pages/ContentRenderer.js`)

## 🔍 Content Bestand Mapping

Het systeem gebruikt `BaseLessonPage.getContentFileName()` om de bestandsnaam te bepalen:

- `moduleId = 'module1'` → `module1.content.json`
- `moduleId = 'module-1'` → `module-1.content.json`
- `moduleId = 'week-1'` → `week1.content.json` (speciale mapping)
- `moduleId = 'demo'` → `demo.content.json`

**Belangrijk:** Zorg dat de `moduleId` in je LessonPage constructor overeenkomt met de bestandsnaam van je JSON bestand (zonder `.content.json` extensie).

## ✅ Checklist voor Nieuwe Module

- [ ] Content JSON bestand aangemaakt in `content/`
- [ ] LessonPage class aangemaakt in `pages/`
- [ ] HTML pagina aangemaakt
- [ ] Script loader toegevoegd in `index.html`
- [ ] Expected classes bijgewerkt in `index.html`
- [ ] Route toegevoegd aan router configuratie
- [ ] Getest lokaal met `npm run dev` in `packages/core`

## 🧪 Testen

1. Start de development server:
   ```bash
   cd packages/core
   npm run dev
   ```

2. Open in browser:
   - `http://localhost:3000/module1.html` (directe toegang)
   - `http://localhost:3000/index.html` (via dashboard/SPA router)

3. Check browser console voor errors

## 📚 Meer Informatie

- Zie de hoofd-README.md in de root voor uitgebreide documentatie over alle content types
- Zie `packages/core/pages/BaseLessonPage.js` voor de basis functionaliteit
- Zie `packages/core/pages/ContentRenderer.js` voor alle beschikbare content types

