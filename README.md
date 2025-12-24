# E-learning Opzetten van een Logistiek Onderzoek

Een moderne, toegankelijke e-learning omgeving ontwikkeld voor HBO onderwijs met focus op duurzaamheid, logistiek en management vakken.

> ⚠️ **Let op:** Zonder actieve Node.js server werken de AI-functies (zoals automatische MC-vragen generatie) niet. Zie [Server Setup](#server-setup-voor-ai-functionaliteit) voor instructies.

## 🎯 Overzicht

Dit platform biedt een complete leerervaring met:
- **Modulaire structuur** voor verschillende vakken
- **Interactieve content** met video's, quizzen en reflectie-opdrachten
- **Voortgangs tracking** met localStorage persistentie
- **WCAG 2.2 AA toegankelijkheid** voor inclusief onderwijs
- **Responsive design** voor alle apparaten
- **JSON-gebaseerde content** voor eenvoudig beheer

---

## 🏗️ Architectuur & Technologie

### Monorepo Structuur
```
OLO/
├── packages/
│   └── core/                   # Gedeelde engine (BaseLessonPage, ContentRenderer, server, API)
│       ├── js/                 # Core JavaScript (managers, services, components)
│       ├── pages/              # BaseLessonPage, ContentRenderer
│       ├── api/                # Vercel serverless handler
│       └── server.js           # Express server voor lokale development
├── apps/
│   └── logistiek-onderzoek/    # E-learning app (deze app)
│       ├── index.html          # Dashboard (hoofdpagina)
│       ├── week1.html          # Week 1 pagina
│       ├── week2.html          # Week 2 pagina
│       ├── week3-7.html        # Week 3-7 pagina's
│       ├── afsluiting.html     # Afsluiting pagina
│       ├── pages/              # App-specifieke pagina classes
│       │   ├── Week1LessonPage.js
│       │   ├── Week2LessonPage.js
│       │   └── ...
│       ├── content/            # Content JSON bestanden
│       │   ├── week1.content.json
│       │   ├── week2.content.json
│       │   └── ...
│       ├── assets/             # Afbeeldingen, documenten
│       ├── api/                # Vercel serverless entry point
│       └── vercel.json         # Vercel configuratie voor deze app
└── game/                       # Research Architect game
```

**Belangrijk:**
- `/packages/core` - Gedeelde framework code (wijzig alleen via PR)
- `/apps/*` - Individuele e-learning apps (elke docent werkt in eigen app)
- Elke app heeft eigen `vercel.json` en `api/index.js`

### Technologie Stack
- **HTML5** - Semantische markup
- **CSS3** - Moderne styling met custom properties
- **JavaScript ES6+** - Moderne JavaScript features
- **TailwindCSS** - Utility-first CSS framework
- **Font Awesome** - Iconen
- **Inter Font** - Typografie

---

## 🚀 Installatie & Gebruik

### Snelle Start (Zonder Server)

1. Clone de repository
2. Open `index.html` in een moderne browser
3. **Let op:** Voor AI-functionaliteit (MC vragen genereren, AI tools) is een server nodig (zie hieronder)

### Server Setup (Voor AI-functionaliteit)

Het platform gebruikt een Node.js server voor AI-functionaliteit (Gemini API). De server handelt API calls af om CORS-problemen te voorkomen en API keys veilig te beheren.

#### ✅ Snelle Start

1. **Dependencies installeren** (eenmalig):
   ```bash
   npm install
   ```

2. **Server starten**:
   ```bash
   npm start
   ```

3. **Open in browser**: `http://localhost:3000/week2.html`

#### 📋 Stap-voor-stap Setup

**Stap 1: Node.js installeren**

Als je Node.js nog niet hebt:
1. Ga naar https://nodejs.org/
2. Download de LTS versie
3. Installeer Node.js
4. Controleer installatie: `node --version` en `npm --version`

**Stap 2: Dependencies installeren**

In de terminal, navigeer naar de project folder en run:
```bash
npm install
```

Dit installeert:
- Express (web server)
- CORS (voor cross-origin requests)
- dotenv (voor environment variables)
- @google/generative-ai (voor Gemini API)
- node-fetch (voor API calls)

**Stap 3: .env bestand aanmaken**

Maak een `.env` bestand in de root directory met deze inhoud:

```env
# Google Gemini API Key
# Verkrijg een API key op: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_api_key_here

# Server Port (standaard: 3000)
PORT=3000

# Toegestane CORS origins (gescheiden door komma's)
# Voor development: http://localhost:3000,http://localhost:5500
# Voor productie: https://jouw-domein.nl
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5500

# Node Environment (development of production)
NODE_ENV=development
```

**BELANGRIJK:** 
- Vervang `your_api_key_here` met je eigen Google Gemini API key
- Het `.env` bestand staat in `.gitignore` en wordt niet gecommit naar Git
- Voor productie: pas `ALLOWED_ORIGINS` aan naar je eigen domein

**Stap 4: Server starten**

**Optie 1: Via npm (aanbevolen)**
```bash
npm start
```

**Optie 2: Via PowerShell script**
```bash
.\start-server.ps1
```

**Optie 3: Voor development met auto-reload**
```bash
npm run dev
```

Je zou moeten zien:
```
🚀 Server running on http://localhost:3000
📝 API Key configured: ✅ Yes
📚 E-Learning template is available at: http://localhost:3000
🔧 API endpoint: http://localhost:3000/api/generate-questions
```

**Stap 5: Testen**

1. Open je browser en ga naar: `http://localhost:3000/week2.html`
2. De MC vragen zouden nu automatisch gegenereerd moeten worden
3. Check de console (F12) voor eventuele errors

#### 🔧 Automatisch opstarten

De server start automatisch wanneer je Cursor opent (via `.vscode/tasks.json`).

**Als de server niet automatisch start:**
- Herstart Cursor volledig
- Of start handmatig: `npm start`
- Of gebruik het PowerShell script: `.\start-server.ps1`

#### 🛠️ Handige Scripts

**Server starten:**
```bash
.\start-server.ps1
```
Controleert eerst of de server al draait en start alleen als nodig.

**Server stoppen:**
```bash
.\stop-server.ps1
```
Stopt de server die op poort 3000 draait.

#### 📡 API Endpoints

**POST /api/generate-questions**
Genereer MC vragen op basis van theorie content.

**Request body:**
```json
{
  "theoryContent": "De theorie tekst hier...",
  "numberOfQuestions": 3
}
```

**Response:**
```json
{
  "success": true,
  "vragen": [
    {
      "id": "vraag1",
      "vraag": "Vraag tekst...",
      "antwoorden": [...],
      "feedbackGoed": "...",
      "feedbackFout": "..."
    }
  ]
}
```

**GET /api/health**
Health check endpoint om te controleren of de server draait.

#### 🚀 Vercel Deployment

**Belangrijk:** Deze repository gebruikt een **monorepo structuur**. Elke e-learning app krijgt een eigen Vercel project.

##### 📦 Stap 1: Nieuw Vercel Project Aanmaken

1. **Ga naar Vercel Dashboard:**
   - Open https://vercel.com/dashboard
   - Klik op **Add New** → **Project**

2. **Import Repository:**
   - Selecteer je GitHub repository
   - **Project Name:** Bijv. "Opzetten van een Logistiek Onderzoek"
   - **Framework Preset:** Other (of leeg laten)

3. **⚠️ BELANGRIJK: Root Directory instellen:**
   - Klik op **Edit** naast **Root Directory**
   - Vul in: `apps/logistiek-onderzoek` (of `apps/[jouw-app-naam]`)
   - Dit vertelt Vercel waar je app begint in de monorepo
   - **Zonder deze instelling werkt de deployment niet!**

4. **Build Settings:**
   - **Build Command:** Laat leeg (of `npm install`)
   - **Output Directory:** Laat leeg (of `.`)
   - Vercel gebruikt automatisch `apps/logistiek-onderzoek/vercel.json`

##### 🔑 Stap 2: Environment Variables

1. **Ga naar Settings:**
   - Klik op je project → **Settings** → **Environment Variables**

2. **Voeg API Key toe:**
   - Klik op **Add New**
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Je Google Gemini API key (bijv. `AIzaSy...`)
   - Selecteer alle environments (Production, Preview, Development)
   - Klik op **Save**

##### 🚀 Stap 3: Deploy

1. **Klik op Deploy:**
   - Vercel gebruikt automatisch `apps/logistiek-onderzoek/vercel.json`
   - De `includeFiles` configuratie zorgt ervoor dat `packages/core` en `game` worden meegenomen

2. **Check Deployment:**
   - Wacht tot de build klaar is
   - Test de live URL
   - Controleer of alle functionaliteit werkt

##### ✅ Belangrijke Configuratie Details

**Root Directory:**
- ✅ Moet `apps/[app-naam]` zijn (bijv. `apps/logistiek-onderzoek`)
- ✅ Elke app krijgt een eigen Vercel project
- ✅ `vercel.json` staat in elke app directory

**vercel.json Structuur:**
```json
{
  "functions": {
    "api/index.js": {
      "includeFiles": "../**/*.{html,js,json,png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf,eot,docx,pdf,xlsx,vsdx}",
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

**⚠️ Belangrijk:**
- `includeFiles` moet een **string** zijn (niet een array!)
- Het pattern `../**/*` gaat omhoog naar de monorepo root
- Dit zorgt ervoor dat `packages/core` en `game` worden meegenomen

##### 📝 Nieuwe App Toevoegen

Wanneer je een nieuwe e-learning app toevoegt:

1. **Kopieer app folder:**
   ```bash
   cp -r apps/logistiek-onderzoek apps/[nieuwe-app-naam]
   ```

2. **Pas content aan:**
   - Wijzig `content/*.content.json` bestanden
   - Update app-specifieke configuratie

3. **Maak nieuw Vercel project:**
   - Project Name: "[Nieuwe App Naam]"
   - Root Directory: `apps/[nieuwe-app-naam]`
   - Environment Variables: zelfde `GEMINI_API_KEY`

4. **Deploy:**
   - Elke app heeft nu zijn eigen URL en deployment

##### 🔄 Redeploy na Core Wijzigingen

Wanneer je wijzigingen maakt in `packages/core`:

1. **Commit en push:**
   ```bash
   git add packages/core/
   git commit -m "Update: core improvements"
   git push
   ```

2. **Redeploy alle apps:**
   - Ga naar elk Vercel project
   - Klik op **Deployments** → **Redeploy**
   - Of push een kleine wijziging naar elke app

**Belangrijk:** 
- De `.env` file wordt **niet** geüpload naar Vercel (om veiligheidsredenen)
- Environment variables moeten altijd via het Vercel dashboard worden ingesteld
- Na het toevoegen van een nieuwe environment variable is een redeploy nodig
- Core wijzigingen worden automatisch meegenomen bij de volgende deployment (via `includeFiles`)

#### ⚠️ Troubleshooting

**Port 3000 al in gebruik?**

**Optie 1: Stop de andere server**
```bash
.\stop-server.ps1
```

**Optie 2: Wijzig poort**
Wijzig `PORT=3001` (of een ander getal) in je `.env` bestand.

**Optie 3: Zoek en stop het proces handmatig**
```powershell
# Zoek welk proces poort 3000 gebruikt
netstat -ano | findstr :3000

# Stop het proces (vervang PID met het juiste nummer)
Stop-Process -Id <PID> -Force
```

**"Cannot find module" errors?**

Run opnieuw:
```bash
npm install
```

**Server start niet?**

1. Check of Node.js correct geïnstalleerd is: `node --version`
2. Check of npm werkt: `npm --version`
3. Check of dependencies geïnstalleerd zijn: `npm list`
4. Check de console voor error messages

**Meerdere server instanties?**

De server is geconfigureerd om te voorkomen dat meerdere instanties draaien. Als je toch meerdere instanties ziet:

1. Stop alle Node processen:
   ```powershell
   Get-Process -Name node | Stop-Process -Force
   ```

2. Start opnieuw:
   ```bash
   npm start
   ```

**API calls werken niet?**

1. **Check of de server draait:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Je zou moeten zien: `{"status":"ok","apiKeyConfigured":true,...}`

2. **Check of `.env` bestand bestaat en `GEMINI_API_KEY` bevat**

3. **Check de server console voor errors**

4. **Open de pagina via `http://localhost:3000/week2.html`** (niet via Live Server op poort 5500!)

**Live Server conflicteert?**

**Gebruik Live Server NIET meer!** De Node server serveert alle statische bestanden.

- Schakel Live Server uit in Cursor extensies
- Of gebruik alleen de Node server
- **Gebruik altijd `http://localhost:3000/week2.html`** (niet poort 5500!)

**API Key niet gevonden (lokaal):**
Zorg ervoor dat `.env` bestand bestaat en `GEMINI_API_KEY` bevat

**API Key niet gevonden (Vercel):**
- Controleer of `GEMINI_API_KEY` is ingesteld in Vercel dashboard (Settings → Environment Variables)
- Zorg ervoor dat je een redeploy hebt gedaan na het toevoegen van de variable
- Controleer of de variable beschikbaar is voor alle environments (Production, Preview, Development)

**CORS errors:**
De server heeft CORS enabled voor alle origins

#### 🔍 Server Status Controleren

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Welke poorten zijn in gebruik?**
```bash
netstat -ano | findstr :3000
```

**Welke Node processen draaien?**
```powershell
Get-Process -Name node
```

#### 📝 Belangrijke Notities

- **Gebruik altijd poort 3000**: `http://localhost:3000/week2.html`
- **Niet via Live Server**: Live Server op poort 5500 werkt niet met de AI API
- **Automatisch opstarten**: De server start automatisch bij het openen van Cursor
- **Meerdere instanties voorkomen**: De server detecteert automatisch als poort 3000 al in gebruik is

---

## 📝 Content Toevoegen - Snelstart

### Basis Template

Elke week pagina gebruikt de `BaseLessonPage` als basis. Deze bevat:
- **Sidebar navigatie** met alle modules
- **Header** met breadcrumbs
- **Basis content secties** (Leerdoelen, Theorie, Video, Quiz)
- **Navigatie buttons** tussen modules

### Content via JSON Bestanden

**Aanbevolen methode:** Gebruik JSON bestanden (zoals `week1.content.json`, `week2.content.json`) voor content. Deze worden automatisch geladen en gerenderd door de `ContentRenderer`.

**Voorbeeld structuur:**
```json
{
  "intro": {
    "title": "Week 2",
    "subtitle": "Van probleem naar doelstelling",
    "description": "Beschrijving van de week"
  },
  "leerdoelen": {
    "title": "Leerdoelen",
    "description": "Na het lezen van de theorie kun je:",
    "items": [
      "Eerste leerdoel",
      "Tweede leerdoel"
    ]
  },
  "theorie": {
    "title": "Onderzoek uitvoeren",
    "content": [
      {
        "type": "paragraph",
        "text": "Dit is een paragraaf met tekst."
      },
      {
        "type": "image",
        "src": "assets/images/voorbeeld.png",
        "alt": "Beschrijving"
      }
    ]
  },
  "video": {
    "title": "Video",
    "description": "Video beschrijving",
    "url": "https://www.youtube.com/embed/...",
    "info": "Video informatie"
  }
}
```

### Nieuwe Week of Module Pagina Toevoegen

> ⚠️ **BELANGRIJK:** Het toevoegen van een nieuwe week of module pagina vereist **meerdere stappen**. Alleen een JSON bestand aanmaken is **niet genoeg**. Je moet ook een LessonPage class, HTML pagina en router configuratie toevoegen.

#### 📋 Complete Checklist

Voordat je begint, zorg dat je **alle** onderstaande stappen doorloopt:

- [ ] **Stap 1:** Content JSON bestand aanmaken
- [ ] **Stap 2:** LessonPage class aanmaken
- [ ] **Stap 3:** HTML pagina aanmaken (of bestaande aanpassen)
- [ ] **Stap 4:** Script loader toevoegen aan `index.html`
- [ ] **Stap 5:** Route configureren in router (in `index.html` of `AppRouter.js`)
- [ ] **Stap 6:** Sidebar navigatie link toevoegen aan `index.html`
- [ ] **Stap 7:** Testen lokaal

#### Stap 1: Content JSON Bestand

Maak een nieuw JSON bestand aan in `content/` met de naam `weekX.content.json` of `moduleX.content.json`:

**Belangrijk:** De bestandsnaam moet overeenkomen met de `moduleId` die je in Stap 2 gebruikt:
- `week-8` → `week8.content.json` (automatische mapping)
- `module1` → `module1.content.json`
- `module-1` → `module-1.content.json`

```json
{
  "intro": {
    "title": "Week 8",
    "subtitle": "Titel van Week 8",
    "description": "Beschrijving van de week"
  },
  "leerdoelen": {
    "title": "Leerdoelen",
    "description": "Na het doorlopen van deze week kun je:",
    "items": [
      "Leerdoel 1",
      "Leerdoel 2"
    ],
    "interactive": false
  },
  "theorie": {
    "title": "Theorie",
    "content": [
      {
        "type": "paragraph",
        "text": ["Je content hier..."]
      }
    ]
  }
}
```

#### Stap 2: LessonPage Class

Maak een nieuwe JavaScript class aan in `pages/` (bijv. `pages/Week8LessonPage.js`):

**Belangrijk:** 
- De `moduleId` in de constructor moet overeenkomen met je JSON bestandsnaam
- De class naam moet overeenkomen met de class die je in Stap 5 gebruikt

```javascript
class Week8LessonPage extends BaseLessonPage {
    constructor() {
        super('week-8', 'Week 8', 'Titel van Week 8');
        // moduleId 'week-8' → laadt automatisch 'week8.content.json'
    }
    
    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }
        
        // Render theorie content
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
            console.error('[Week8LessonPage] ❌ Content not loaded properly');
            return false;
        }
        return true;
    }
}

// Export voor gebruik in router
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Week8LessonPage;
    } else {
        window.Week8LessonPage = Week8LessonPage;
    }
    console.log('[Week8LessonPage] ✅ Exported to window');
} catch (error) {
    console.error('[Week8LessonPage] ❌ Error exporting:', error);
    try {
        window.Week8LessonPage = Week8LessonPage;
    } catch (e) {
        console.error('[Week8LessonPage] ❌ Failed to force export:', e);
    }
}
```

#### Stap 3: HTML Pagina

Maak een nieuwe HTML pagina aan (bijv. `week8.html`) of gebruik een bestaande template:

```html
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Week 8 - E-Learning</title>
    <!-- ... head content ... -->
</head>
<body>
    <!-- Content wordt geladen door JavaScript -->
    <div class="flex-1 flex items-center justify-center min-h-screen">
        <div class="text-center">
            <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-300">Week 8 wordt geladen...</p>
        </div>
    </div>

    <!-- Load scripts -->
    <script src="/core/js/DarkMode.js"></script>
    <!-- ... andere core scripts ... -->
    <script src="/core/pages/BaseLessonPage.js"></script>
    <script src="/core/pages/ContentRenderer.js"></script>
    <script src="pages/Week8LessonPage.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.appRouter) {
                try {
                    const week8Page = new Week8LessonPage();
                    week8Page.init();
                } catch (e) {
                    console.error('[week8.html] Failed to initialize Week8LessonPage:', e);
                }
            }
        });
    </script>
</body>
</html>
```

#### Stap 4: Script Loader in index.html

Voeg de script tag toe aan `index.html` zodat de router de class kan laden:

```html
<!-- Week Page Classes - Load all for SPA router -->
<script src="pages/Week8LessonPage.js" onerror="console.error('[Script] Failed to load Week8LessonPage.js')"></script>
```

#### Stap 5: Router Configuratie

Voeg de route toe aan de router configuratie in `index.html` (rond regel 1562):

```javascript
router.routes = {
    'index.html': () => router.loadIndexPage(),
    'week1.html': () => router.loadWeekPage('week-1', 'Week1LessonPage'),
    // ... andere routes ...
    'week8.html': () => router.loadWeekPage('week-8', 'Week8LessonPage')  // NIEUWE ROUTE
};
```

**Alternatief:** Als je de router in `packages/core/js/core/AppRouter.js` configureert (voor alle apps), voeg daar de route toe:

```javascript
this.routes = {
    'index.html': () => this.loadIndexPage(),
    'week1.html': () => this.loadWeekPage('week-1', 'Week1LessonPage'),
    // ... andere routes ...
    'week8.html': () => this.loadWeekPage('week-8', 'Week8LessonPage')  // NIEUWE ROUTE
};
```

#### Stap 6: Sidebar Navigatie Link

**BELANGRIJK:** Voeg een link toe aan de sidebar navigatie in `index.html` zodat gebruikers de nieuwe pagina kunnen vinden. Zonder deze link is de pagina wel bereikbaar via directe URL, maar niet zichtbaar in het menu.

Zoek in `index.html` naar de sidebar navigatie sectie (rond regel 696-720) en voeg een link toe:

```html
<!-- Module Navigation -->
<nav class="flex-1 overflow-y-auto custom-scrollbar p-6" aria-label="Module navigatie">
    <div class="space-y-2">
        <!-- ... bestaande links ... -->
        
        <!-- TOEVOEGEN: Nieuwe module/week link -->
        <a href="week8.html" class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus-ring transition-colors">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <i class="fas fa-book text-green-600 dark:text-green-400 text-sm"></i>
                </div>
                <span class="font-medium text-gray-900 dark:text-white">Week 8</span>
            </div>
        </a>
    </div>
</nav>
```

**Kleuren voor iconen:**
- Groen (`bg-green-100`, `text-green-600`) - Voor week pagina's
- Blauw (`bg-blue-100`, `text-blue-600`) - Voor demo/start pagina's
- Paars (`bg-purple-100`, `text-purple-600`) - Voor module pagina's
- Oranje (`bg-orange-100`, `text-orange-600`) - Voor speciale pagina's

#### Stap 7: Testen

1. Start de development server:
   ```bash
   cd packages/core
   npm run dev
   ```

2. Open in browser:
   - Direct: `http://localhost:3000/week8.html`
   - Via dashboard: `http://localhost:3000/index.html` (met SPA router)

3. Check browser console voor errors

#### ⚠️ Veelgemaakte Fouten

1. **Alleen JSON bestand aangemaakt** → Pagina werkt niet, class ontbreekt
2. **Verkeerde moduleId** → Content wordt niet geladen (check `BaseLessonPage.getContentFileName()`)
3. **Route vergeten** → Navigatie werkt niet, pagina niet bereikbaar via router
4. **Script loader vergeten** → Class niet beschikbaar voor router
5. **Class naam mismatch** → Router kan class niet vinden
6. **Sidebar link vergeten** → Pagina niet zichtbaar in menu (wel bereikbaar via directe URL)

#### 📝 Content Bestand Mapping

Het systeem gebruikt `BaseLessonPage.getContentFileName()` om de bestandsnaam te bepalen:

- `moduleId = 'week-8'` → `week8.content.json` (speciale mapping voor week-X)
- `moduleId = 'module1'` → `module1.content.json`
- `moduleId = 'module-1'` → `module-1.content.json`
- `moduleId = 'afsluiting'` → `afsluiting.content.json` (speciale case)
- `moduleId = 'register'` → `register.json` (speciale case)

**Wat gebeurt automatisch (na correcte setup):**
- ✅ `loadContent()` laadt automatisch het juiste JSON bestand
- ✅ `init()` flow wordt automatisch uitgevoerd
- ✅ JSON validatie via `ContentValidator`
- ✅ Error handling en fallback content
- ✅ Module intro rendering via `ContentTemplateRenderer`
- ✅ Event listeners worden automatisch geattached

---

## 🎨 Content Types Referentie

Het platform ondersteunt de volgende content types binnen de `theorie.content` array in JSON bestanden:

| Type | Gebruik | Belangrijkste Properties |
| --- | --- | --- |
| `paragraph` | Tekst blokken | `text` (string of array) |
| `heading` | Headings (h1-h6) | `text`, `level` (optioneel), `id` (optioneel) |
| `image` | Afbeeldingen | `src`, `alt` (required) |
| `url` | Links | `url`, `text` (required) |
| `video` | Embedded video's | `url` (required) |
| `document` | Document links | `src`, `text` (required) |
| `highlight` | Info boxen / Waarschuwingen | `title` (optioneel), `content` (required) |
| `html` | Raw HTML | `html` (required) |
| `accordion` | Accordion componenten | `items` (array, required) |
| `tabs` | Tab componenten | `tabs` (array, required) |
| `clickableSteps` | Klikbare stappen | `steps` (array, required) |
| `smartChecklist` | SMART checklist | `doelstelling` (required) |
| `learningObjectivesChecklist` | Leerdoelen checklist | `items` (array, required) |
| `matchingExercise` | Matching oefening | `categories`, `items` (arrays, required) |
| `trueFalseExercise` | True/False oefening | `statements` (array, required) |
| `sequenceExercise` | Sequence oefening | `paragraphs` (array, required) |
| `conceptQualityChecklist` | Concept kwaliteit checklist | `concept`, `definition` (required) |
| `booleanOperatorExercise` | Boolean operator oefening | Configuratie object |
| `aiQueryExercise` | AI query oefening | Configuratie object |
| `aiBouwsteenGenerator` | AI bouwsteen generator | Configuratie object |

| Type | Gebruik | Belangrijkste Properties |
| --- | --- | --- |
| `paragraph` | Tekst blokken | `text` (string of array) |
| `heading` | Headings (h1-h6) | `text`, `level` (optioneel), `id` (optioneel) |
| `image` | Afbeeldingen | `src`, `alt` (required) |
| `url` | Links | `url`, `text` (required) |
| `video` | Embedded video's | `url` (required) |
| `document` | Document links | `src`, `text` (required) |
| `highlight` | Info boxen / Waarschuwingen | `title` (optioneel), `content` (required) |
| `html` | Raw HTML | `html` (required) |
| `accordion` | Accordion componenten | `items` (array, required) |
| `tabs` | Tab componenten | `tabs` (array, required) |
| `clickableSteps` | Klikbare stappen | `steps` (array, required) |
| `smartChecklist` | SMART checklist | `doelstelling` (required) |
| `learningObjectivesChecklist` | Leerdoelen checklist | `items` (array, required) |
| `matchingExercise` | Matching oefening | `categories`, `items` (arrays, required) |
| `trueFalseExercise` | True/False oefening | `statements` (array, required) |
| `sequenceExercise` | Sequence oefening | `paragraphs` (array, required) |
| `conceptQualityChecklist` | Concept kwaliteit checklist | `concept`, `definition` (required) |
| `booleanOperatorExercise` | Boolean operator oefening | Configuratie object |
| `aiQueryExercise` | AI query oefening | Configuratie object |
| `aiBouwsteenGenerator` | AI bouwsteen generator | Configuratie object |

### 1. Paragraph

Gebruikt voor normale tekst paragrafen.

```json
{
  "type": "paragraph",
  "text": "Dit is een normale paragraaf tekst."
}
```

Of met meerdere teksten:

```json
{
  "type": "paragraph",
  "text": [
    "Eerste paragraaf tekst.",
    "Tweede paragraaf tekst.",
    "<strong>Derde paragraaf met HTML formatting.</strong>"
  ]
}
```

**Eigenschappen:**
- `type` (required): "paragraph"
- `text` (required): String of Array van strings

### 2. Image

Gebruikt voor afbeeldingen. De laatste afbeelding in de content array krijgt automatisch modal functionaliteit.

```json
{
  "type": "image",
  "src": "assets/images/voorbeeld.png",
  "alt": "Beschrijving van de afbeelding"
}
```

**Eigenschappen:**
- `type` (required): "image"
- `src` (required): Pad naar de afbeelding
- `alt` (required): Alt text voor toegankelijkheid

**Features:**
- Automatische hover zoom effect
- Laatste image krijgt klikbare modal functionaliteit

### 3. URL

Gebruikt voor externe links naar websites.

```json
{
  "type": "url",
  "url": "https://example.com",
  "text": "Ga naar voorbeeld website",
  "target": "_blank"
}
```

**Eigenschappen:**
- `type` (required): "url"
- `url` (required): De URL link
- `text` (required): De link tekst
- `target` (optional): "_blank" (default) of "_self"
- `classes` (optional): Custom CSS classes

### 4. Document

Gebruikt voor document download links (PDF, DOCX, etc.).

```json
{
  "type": "document",
  "src": "assets/Documents/voorbeeld.pdf",
  "text": "Download het voorbeelddocument",
  "icon": "fa-file-pdf"
}
```

**Eigenschappen:**
- `type` (required): "document"
- `src` (required): Pad naar het document
- `text` (required): De link tekst
- `icon` (optional): Font Awesome icon class (default: "fa-file")
- `iconClass` (optional): "fas" of "far" (default: "fas")
- `classes` (optional): Custom CSS classes voor de link

### 5. Highlight

Gebruikt voor belangrijke informatie boxen (zoals de GenAI gebruik box).

```json
{
  "type": "highlight",
  "title": "Belangrijke Informatie",
  "content": "Dit is belangrijke informatie die opvalt.",
  "icon": "fa-info-circle"
}
```

Of met meerdere paragrafen:

```json
{
  "type": "highlight",
  "title": "GenAI Gebruik",
  "content": [
    "Je mag bij het opstellen van een doelstelling GenAI gebruiken.",
    "Wees je er wel altijd van bewust dat je het mens machine mens principe toepast."
  ],
  "icon": "fa-info-circle"
}
```

**Eigenschappen:**
- `type` (required): "highlight"
- `title` (optional): Titel van de highlight box
- `content` (required): String of Array van strings
- `icon` (optional): Font Awesome icon class (default: "fa-info-circle")
- `iconClass` (optional): "fas" of "far" (default: "fas")
- `bgColor` (optional): Background color class (default: "bg-blue-50")
- `borderColor` (optional): Border color class (default: "border-blue-500")
- `titleColor` (optional): Title color class (default: "text-blue-900")
- `contentColor` (optional): Content color class (default: "text-blue-800")

### 6. HTML

Gebruikt voor raw HTML content wanneer specifieke controle nodig is.

```json
{
  "type": "html",
  "html": "<div class='custom-class'>Custom HTML content</div>"
}
```

**Eigenschappen:**
- `type` (required): "html"
- `html` (required): Raw HTML string

---

## 📋 Migratie van Oude Structuur

De oude structuur gebruikte inline HTML binnen paragrafen. Dit werkt nog steeds, maar voor betere organisatie wordt aanbevolen om aparte types te gebruiken:

**Oud (werkt nog steeds):**
```json
{
  "type": "paragraph",
  "text": [
    "<a href='https://example.com'>Link tekst</a>",
    "<div class='bg-blue-50...'>Highlight box HTML</div>"
  ]
}
```

**Nieuw (aanbevolen):**
```json
{
  "type": "url",
  "url": "https://example.com",
  "text": "Link tekst"
},
{
  "type": "highlight",
  "title": "Titel",
  "content": "Highlight inhoud"
}
```

**Voordelen van nieuwe structuur:**
- Betere organisatie: Content types zijn duidelijk gescheiden
- Makkelijkere edits: JSON is leesbaarder dan lange HTML strings
- Consistentie: Zelfde styling voor alle highlights/documenten
- Validatie mogelijk: Kunnen required velden checken
- Herbruikbaarheid: Styling kan centraal aangepast worden

---

## 🔧 Componenten Documentatie

### BaseLessonPage

Basis klasse voor alle week pagina's. Bevat standaard layout, sidebar, header en navigatie.

**Gemeenschappelijke functionaliteit:**
- ✅ Automatisch laden van JSON content (`loadContent()`)
- ✅ Fallback content bij fouten (`getFallbackContent()`)
- ✅ Error state rendering (`renderErrorState()`)
- ✅ Module intro rendering via `ContentTemplateRenderer`
- ✅ Automatische JSON validatie via `ContentValidator`
- ✅ Lifecycle hooks: `afterContentLoaded()`, `afterEventListeners()`

### ContentRenderer

Rendert content items uit JSON bestanden. Automatisch gebruikt door WeekLessonPage classes:

```javascript
ContentRenderer.renderContentItems(contentArray, { enableModal: true })
```

**Opties:**
- `enableModal`: Boolean - Enable image modal voor laatste image (default: true)

### InteractiveRenderer (Facade Pattern)

`InteractiveRenderer` fungeert als een **facade** voor alle interactieve componenten. Het delegeert alle functionaliteit naar gespecialiseerde renderers:

**Gespecialiseerde Renderers:**
- `AccordionRenderer` - Accordion componenten
- `TabRenderer` - Tab componenten
- `ClickableStepsRenderer` - Klikbare stappen
- `ChecklistRenderer` - Checklists (SMART, Learning Objectives, Concept Quality)
- `ExerciseRenderer` - Oefeningen (True/False, Matching, Sequence)
- `AIRenderer` - AI Tools (Boolean Operator, AI Query, Bouwsteen Generator)
- `HtmlUtils` - HTML utility functies (escapeHtml, normalizeText)

**Voordelen van deze architectuur:**
- ✅ **Separation of Concerns** - Elke renderer heeft één verantwoordelijkheid
- ✅ **Maintainability** - Makkelijker om individuele componenten te onderhouden
- ✅ **Testability** - Componenten kunnen onafhankelijk getest worden
- ✅ **Backward Compatibility** - Bestaande code blijft werken via de facade
- ✅ **Clean Code** - Geen duplicate code, duidelijke structuur
- ✅ **No God Class** - Geen god class anti-pattern meer; elke renderer heeft één verantwoordelijkheid

**Belangrijk: Nieuwe Oefeningen/Componenten**

⚠️ **Voor nieuwe types oefeningen of interactieve componenten:**
- **Maak een nieuwe gespecialiseerde renderer** (bijv. `NewExerciseRenderer.js`)
- **Voeg een facade method toe** aan `InteractiveRenderer` die delegeert naar de nieuwe renderer
- **Voeg NIET** de implementatie direct toe aan `InteractiveRenderer` - dit voorkomt dat het weer een god class wordt

**Voorbeeld voor nieuwe oefening:**
```javascript
// 1. Maak nieuwe renderer: js/components/interactive/NewExerciseRenderer.js
class NewExerciseRenderer {
    static renderNewExercise(item) {
        // Implementatie hier
    }
}

// 2. Voeg facade method toe aan InteractiveRenderer.js
static renderNewExercise(item) {
    if (typeof window.NewExerciseRenderer !== 'undefined') {
        return NewExerciseRenderer.renderNewExercise(item);
    }
    console.warn('NewExerciseRenderer not loaded.');
    return '';
}
```

**Gebruik:**
```javascript
// Via facade (aanbevolen voor backward compatibility)
InteractiveRenderer.renderAccordion(item);
InteractiveRenderer.renderTabs(item);
InteractiveRenderer.renderMatchingExercise(item);

// Direct via gespecialiseerde renderers (voor nieuwe code)
AccordionRenderer.renderAccordion(item);
TabRenderer.renderTabs(item);
ExerciseRenderer.renderMatchingExercise(item);
```

**Uitzondering:**
Source Evaluation Exercise methoden blijven nog in `InteractiveRenderer` (zeer groot, ~700 regels). Deze kunnen in de toekomst verplaatst worden naar `ExerciseRenderer`.

### Week Lesson Pages

Elke week heeft een eigen klasse die `BaseLessonPage` extend:

```javascript
class Week1LessonPage extends BaseLessonPage {
    constructor() {
        super('week-1', 'Week 1', 'Titel');
        // content en contentLoaded worden automatisch geïnitialiseerd in BaseLessonPage
    }
    
    // loadContent() wordt automatisch aangeroepen door BaseLessonPage
    // getFallbackContent() en renderErrorState() zijn beschikbaar in BaseLessonPage
    
    renderContentSections() {
        // Gebruikt ContentRenderer.renderContentItems() voor rendering
        const theorieContent = this.content.theorie.content 
            ? ContentRenderer.renderContentItems(this.content.theorie.content, { enableModal: true })
            : '';
        return this.contentTemplateRenderer.renderSection(
            this.content.theorie.title,
            theorieContent,
            'book',
            'purple'
        );
    }
}
```

**Alle week pagina's (Week1-7 + Afsluiting) gebruiken nu:**
- ✅ `BaseLessonPage` voor gemeenschappelijke functionaliteit
- ✅ `ContentRenderer.renderContentItems()` voor content rendering
- ✅ `ContentTemplateRenderer` voor consistente sectie styling
- ✅ Automatische JSON validatie via `ContentValidator`

---

## 💾 Data Management

### LocalStorage Structure

```javascript
// Voortgang data
{
    "progress": {
        "module-1": {
            "lesson-1": 100,
            "lesson-2": 75,
            "overall": 87.5
        }
    },
    "quizAnswers": {
        "q1": 1,
        "q2": 0
    },
    "reflectionDraft": {
        "text": "Reflectie tekst...",
        "timestamp": 1640995200000
    }
}
```

### Progress Tracking

```javascript
// Update voortgang
Utils.progress.update('module-1', 'lesson-1', 100);

// Load voortgang
const progress = Utils.storage.get('progress', {});
```

---

## ✨ Voltooide Verbeteringen

### ✅ 1. Week3-7 migratie naar ContentRenderer - VOLTOOID

**Status:**
- ✅ Alle week pagina's (Week1-7) gebruiken nu de nieuwe `ContentRenderer`
- ✅ Alle pagina's gebruiken `ContentRenderer.renderContentItems()` voor consistente rendering
- ✅ `renderTheorieContentWithSections()` methoden zijn verwijderd en vervangen door direct gebruik van `ContentRenderer`
- ✅ Consistente fallback naar `paragraphs` voor backward compatibility

**Resultaat:**
- Consistente rendering logica across alle pagina's
- Minder duplicate code
- Eenvoudiger onderhoud

### ✅ 2. JSON Schema Validatie - GEÏMPLEMENTEERD

**Status:**
- ✅ `ContentValidator.js` geïmplementeerd met volledige validatie voor alle content types
- ✅ Automatische validatie bij het laden van JSON content
- ✅ Type checking voor alle content properties
- ✅ Duidelijke error messages en warnings in console
- ✅ Non-blocking validatie (blokkeert niet het laden van content)

**Gebruik:**
Validatie gebeurt automatisch bij het laden van content. Controleer de browser console voor:
- ✅ `[ContentValidator] ✅ Content structure valid` - Success
- ⚠️ `[ContentValidator] ⚠️ Validation warnings` - Warnings (niet kritiek)
- ❌ `[ContentValidator] ❌ Validation errors` - Errors (moeten opgelost worden)

**Validatie omvat:**
- Content item types (paragraph, image, url, accordion, tabs, etc.)
- Required properties per type
- Type checking (arrays, strings, numbers, booleans)
- Volledige JSON structuur (intro, leerdoelen, theorie, video, mcVragen)

### ✅ 3. Content Migratie - VOLTOOID

**Status:**
- ✅ Alle week pagina's gebruiken de nieuwe content structuur met `content` array
- ✅ Fallback naar `paragraphs` blijft behouden voor backward compatibility
- ✅ Consistente rendering via `ContentRenderer.renderContentItems()`

**Praktisch advies:**
- ✅ **Gebruik voor nieuwe content uitsluitend de `content` array** met content types (paragraph, image, etc.)
- ⚠️ **De `paragraphs` fallback is alleen bedoeld voor legacy support** en zal in toekomstige versies mogelijk verdwijnen
- ✅ Alle weken (Week1-7 + Afsluiting) zijn nu volledig gemigreerd naar de `ContentRenderer` structuur
- ✅ Bestaande content met `paragraphs` blijft werken (backward compatible), maar migreer naar `content` array bij updates

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Mobile-First Approach
- Touch-friendly interface
- Gesture ondersteuning
- Geoptimaliseerde performance

**Layout:**
- **Desktop**: Volledige sidebar + hoofdcontent
- **Tablet**: Collapsible sidebar
- **Mobile**: Overlay menu + gestapelde layout

---

## ♿ Toegankelijkheid (WCAG 2.2 AA)

### Geïmplementeerde Features
- **Semantische HTML** - Correct gebruik van landmarks
- **ARIA labels** - Screen reader ondersteuning
- **Keyboard navigation** - Volledige toetsenbord toegang
- **Focus management** - Duidelijke focus indicators
- **Color contrast** - Minimaal 4.5:1 ratio
- **Text scaling** - Ondersteuning tot 200%
- **Screen reader** - Volledige compatibiliteit

### Toegankelijkheids Features
```javascript
// Skip to content link
<a href="#main-content" class="skip-link">Spring naar hoofdinhoud</a>

// ARIA labels
<button aria-label="Open navigatie menu" aria-expanded="false">

// Focus trapping
Utils.accessibility.trapFocus(element);

// Screen reader announcements
Utils.accessibility.announce("Actie voltooid");
```

---

## 🎨 Design System

### Kleurenpalet
```css
:root {
    --primary-blue: #0077b6;    /* Hoofdkleur */
    --success-green: #90be6d;   /* Succes/voltooid */
    --neutral-bg: #f8f9fa;      /* Achtergrond */
    --text-dark: #212529;       /* Tekst */
    --text-light: #6c757d;      /* Secundaire tekst */
}
```

### Typografie
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Line height**: 1.6 voor leesbaarheid

### Componenten
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Consistent padding, hover states
- **Forms**: Focus states, validation styling
- **Progress**: Animated bars, color coding

### Iconen
Gebruik Font Awesome iconen:
```html
<i class="fas fa-book text-blue-600 text-lg"></i>
<i class="fas fa-play text-red-600 text-lg"></i>
<i class="fas fa-question-circle text-orange-600 text-lg"></i>
```

---

## 🧪 Testing & Validatie

### Toegankelijkheid Testing
- **axe-core** - Automated accessibility testing
- **WAVE** - Web accessibility evaluation
- **Screen readers** - NVDA, JAWS, VoiceOver

### Browser Ondersteuning
- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### Performance
- **Lighthouse** score: 90+
- **Core Web Vitals** - Groen
- **Bundle size** - < 100KB

---

## 🔒 Beveiliging

### Best Practices
- **HTTPS** - Verplicht voor productie
- **Content Security Policy** - XSS bescherming
- **Input validation** - Client-side validatie
- **LocalStorage** - Geen gevoelige data

---

## 📈 Performance Optimalisatie

### Geïmplementeerde Features
- **Debouncing** - Voor input events
- **Throttling** - Voor scroll events
- **Lazy loading** - Voor media content
- **CSS animations** - Hardware accelerated

---

## 🐛 Troubleshooting

### Veelvoorkomende Problemen

**LocalStorage werkt niet**
- Controleer HTTPS in productie
- Check browser privacy settings

**Mobile menu opent niet**
- Controleer JavaScript console voor errors
- Verify event listeners zijn geladen

**Voortgang wordt niet opgeslagen**
- Check localStorage quota
- Verify JSON serialization

**Content wordt niet getoond**
- Controleer JSON bestand voor syntax fouten
- Verify dat content types correct zijn (paragraph, image, url, etc.)
- Check browser console voor errors

**Video's worden niet getoond of geblokkeerd**

Het platform gebruikt `VideoManager` om video's te detecteren en fallback berichten te tonen als video's geblokkeerd zijn.

**VideoManager vereisten:**
- Video iframes moeten het `data-video-url` attribuut hebben
- Video containers moeten een ID hebben die eindigt op `-container`
- Fallback elementen moeten een ID hebben die eindigt op `-fallback`

**Test VideoManager:**
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

**Bekende problemen:**
- Als VideoManager iframes niet detecteert, controleer of ze het `data-video-url` attribuut hebben
- Als fallback berichten niet verschijnen, controleer of de juiste HTML structuur aanwezig is (container en fallback elementen)

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug', 'true');
```

---

## 💡 Tips voor Collega's

### Content Toevoegen
- Gebruik JSON bestanden voor nieuwe content (aanbevolen)
- Gebruik de bestaande content types (paragraph, image, url, document, highlight)
- Gebruik consistente styling met TailwindCSS classes

### Nieuwe Secties
- Kopieer een bestaande sectie structuur
- Pas de titel en content aan
- Behoud de icon en kleur structuur

### Testing
- Test op verschillende schermgroottes
- Controleer of alle links werken
- Verificeer dat content goed leesbaar is
- Check JSON syntax met een validator

---

## 🤝 Bijdragen

### Development Workflow
1. Fork de repository
2. Maak feature branch
3. Implementeer changes
4. Test toegankelijkheid
5. Submit pull request

### Code Standards
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **WCAG 2.2 AA** - Toegankelijkheid
- **Mobile-first** - Responsive design

---

## 📄 Licentie

Dit project is ontwikkeld voor HBO onderwijs en is beschikbaar onder de MIT licentie.

---

**Ontwikkeld met ❤️ voor inclusief HBO onderwijs**
