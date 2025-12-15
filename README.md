# E-Learning Platform - HBO Onderwijs

Een moderne, toegankelijke e-learning omgeving ontwikkeld voor HBO onderwijs met focus op duurzaamheid, logistiek en management vakken.

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

### Component Structuur
```
OLO/
├── index.html                  # Dashboard (hoofdpagina)
├── week1.html                  # Week 1 pagina
├── week2.html                  # Week 2 pagina
├── week3-7.html                # Week 3-7 pagina's
├── afsluiting.html             # Afsluiting pagina
├── pages/
│   ├── BaseLessonPage.js       # Basis template voor alle weeks
│   ├── Week1LessonPage.js     # Week 1 specifiek (voorbeeld)
│   ├── Week2LessonPage.js     # Week 2 specifiek (voorbeeld)
│   ├── ContentRenderer.js      # Content rendering engine
│   └── OtherWeekPages.js       # Week 3-7 + Afsluiting
├── content/
│   ├── week1.content.json      # Week 1 content data
│   ├── week2.content.json      # Week 2 content data
│   └── week*.content.json      # Overige week content
└── config/
    └── moduleConfig.js         # Module configuratie
```

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

Voor deployment op Vercel moet je de environment variables instellen in het Vercel dashboard:

1. **Ga naar je Vercel project:**
   - Open https://vercel.com/dashboard
   - Selecteer je project

2. **Voeg environment variable toe:**
   - Ga naar **Settings** → **Environment Variables**
   - Klik op **Add New**
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Je Google Gemini API key (bijv. `AIzaSy...`)
   - Selecteer alle environments (Production, Preview, Development)
   - Klik op **Save**

3. **Redeploy je applicatie:**
   - Na het toevoegen van de environment variable, moet je een nieuwe deployment maken
   - Ga naar **Deployments** tab
   - Klik op de drie puntjes (⋯) bij de laatste deployment
   - Kies **Redeploy**
   - Of push een nieuwe commit naar je repository

**Belangrijk:** 
- De `.env` file wordt **niet** geüpload naar Vercel (om veiligheidsredenen)
- Environment variables moeten altijd via het Vercel dashboard worden ingesteld
- Na het toevoegen van een nieuwe environment variable is een redeploy nodig

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

### Nieuwe Week Toevoegen

1. Maak een nieuwe HTML file (bijv. `week3.html`)
2. Maak een nieuwe JavaScript file (bijv. `Week3LessonPage.js`)
3. Maak een content JSON file (bijv. `content/week3.content.json`)
4. Voeg de module toe aan `config/moduleConfig.js`

---

## 🎨 Content Types Referentie

Het platform ondersteunt de volgende content types binnen de `theorie.content` array in JSON bestanden:

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
        this.content = null;
        this.contentLoaded = false;
    }
    
    async loadContent() {
        // Laadt content/week1.content.json
    }
    
    renderContentSections() {
        // Gebruikt ContentRenderer voor rendering
    }
}
```

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

## ✨ Optionele Verbeteringen

### 1. Week3-7 migreren naar ContentRenderer

**Huidige situatie:**
- Week1 en Week2 gebruiken al de nieuwe `ContentRenderer`
- Week3-7 gebruiken nog de standaard `BaseLessonPage.renderContentSections()` met placeholder content

**Wanneer uitvoeren:**
- Wanneer Week3-7 content krijgen
- Bij het toevoegen van content voor deze pagina's

**Hoe te migreren:**
1. Kopieer de `loadContent()` en `renderContentSections()` methods uit Week2LessonPage
2. Pas de JSON file path aan naar `week3.content.json`
3. Voeg `<script src="pages/ContentRenderer.js"></script>` toe aan week3.html
4. Herhaal voor Week4-7

### 2. JSON Schema Validatie

**Waarom:**
- Vroege detectie van typos en ontbrekende velden
- Duidelijke error messages in plaats van stilzwijgend falen
- Zelf-documenterend (schema toont wat toegestaan is)

**Wanneer uitvoeren:**
- Bij schaalvergroting (meerdere content creators)
- Wanneer je merkt dat er veel fouten zijn in JSON bestanden
- Voor automatisering (CI/CD checks)

**Minimale implementatie:**
Voeg eenvoudige runtime validatie toe aan `ContentRenderer`:
```javascript
static renderContentItems(contentItems, options = {}) {
    if (!contentItems || !Array.isArray(contentItems)) {
        console.warn('ContentRenderer: contentItems is not an array');
        return '';
    }
    
    return contentItems.map(item => {
        if (!item.type) {
            console.error('ContentRenderer: item missing type', item);
            return '';
        }
        // ... rest van rendering
    });
}
```

### 3. Bestaande Content Migreren naar Nieuwe Structuur

**Huidige situatie:**
Sommige content gebruikt nog inline HTML binnen paragraph items.

**Wanneer uitvoeren:**
- Bij grote content updates
- Wanneer nieuwe content wordt toegevoegd (gebruik dan direct nieuwe structuur)
- Voor nieuwe pagina's (gebruik vanaf het begin de nieuwe structuur)

**Praktisch advies:**
- ✅ Gebruik nieuwe content types voor **nieuwe** content (Week3+)
- ✅ Laat bestaande content (Week1-2) zoals het is (werkt prima)
- ✅ Migreer bestaande content alleen bij grote updates

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
