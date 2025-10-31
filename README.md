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

### Lokale Ontwikkeling
1. Clone de repository
2. Open `index.html` in een moderne browser
3. Voor lokale server: `python -m http.server 8000`

### Productie Deployment
1. Upload alle bestanden naar webserver
2. Zorg voor HTTPS voor localStorage functionaliteit
3. Configureer caching headers voor assets

### Snelstart
1. **Open `index.html`** in je browser voor het dashboard
2. **Klik op een week** om naar die pagina te gaan
3. **Bewerk JSON bestanden** om content toe te voegen
4. **Refresh de pagina** om wijzigingen te zien

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
