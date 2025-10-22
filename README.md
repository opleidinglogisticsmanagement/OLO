# E-Learning Platform - HBO Onderwijs

Een moderne, toegankelijke e-learning omgeving ontwikkeld voor HBO onderwijs met focus op duurzaamheid, logistiek en management vakken.

## 🎯 Overzicht

Dit platform biedt een complete leerervaring met:
- **Modulaire structuur** voor verschillende vakken
- **Interactieve content** met video's, quizzen en reflectie-opdrachten
- **Voortgangs tracking** met localStorage persistentie
- **WCAG 2.2 AA toegankelijkheid** voor inclusief onderwijs
- **Responsive design** voor alle apparaten

## 🏗️ Architectuur

### Component Structuur
```
/components
├── Header.js          # Bovenste navigatiebalk
├── Sidebar.js         # Zijbalk met module navigatie
└── ContentCard.js    # Herbruikbare content componenten

/pages
└── LessonPage.js      # Hoofdpagina component

/assets
├── icons/             # Iconen en afbeeldingen
└── styles/           # CSS bestanden

index.html            # Hoofdbestand
main.css             # Styling
main.js              # JavaScript logica
```

### Technologie Stack
- **HTML5** - Semantische markup
- **CSS3** - Moderne styling met custom properties
- **JavaScript ES6+** - Moderne JavaScript features
- **TailwindCSS** - Utility-first CSS framework
- **Font Awesome** - Iconen
- **Inter Font** - Typografie

## 🚀 Installatie & Gebruik

### Lokale Ontwikkeling
1. Clone de repository
2. Open `index.html` in een moderne browser
3. Voor lokale server: `python -m http.server 8000`

### Productie Deployment
1. Upload alle bestanden naar webserver
2. Zorg voor HTTPS voor localStorage functionaliteit
3. Configureer caching headers voor assets

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Mobile-First Approach
- Touch-friendly interface
- Gesture ondersteuning
- Geoptimaliseerde performance

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

## 🔧 Componenten Documentatie

### Header Component
```javascript
const header = new Header();
header.setBreadcrumbs([
    { text: 'Dashboard', href: '#' },
    { text: 'Module 1', href: '#' }
]);
header.setActions([
    { icon: 'fas fa-help', label: 'Help' }
]);
```

### Sidebar Component
```javascript
const sidebar = new Sidebar();
sidebar.setModules([
    {
        id: 'module-1',
        title: 'Neuro-psycho-immunologie',
        status: 'completed',
        lessons: [...]
    }
]);
sidebar.setProgress({
    'module-1': { name: 'Module 1', percentage: 100 }
});
```

### ContentCard Component
```javascript
const card = new ContentCard({
    icon: 'fas fa-book',
    iconColor: 'blue',
    title: 'Theorie',
    content: '<p>Content hier...</p>'
});
```

### ProgressBar Component
```javascript
const progressBar = new ProgressBar({
    percentage: 75,
    label: 'Module Voortgang',
    showPercentage: true
});
```

### QuizBlock Component
```javascript
const quiz = new QuizBlock({
    title: 'Interactieve Quiz',
    questions: [
        {
            question: 'Wat is...?',
            options: ['A', 'B', 'C'],
            correctAnswer: 1,
            feedback: 'Uitleg...'
        }
    ]
});
```

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

## 🎯 Nieuwe Modules Toevoegen

### 1. Data Structuur
```javascript
const newModule = {
    id: 'module-4',
    title: 'Nieuwe Module',
    status: 'locked',
    expanded: false,
    lessons: [
        {
            title: 'Inleiding',
            status: 'locked',
            href: '#',
            completed: false
        }
    ]
};
```

### 2. Content Toevoegen
```javascript
// In LessonPage.js
const newContent = new ContentCard({
    icon: 'fas fa-star',
    iconColor: 'yellow',
    title: 'Nieuwe Sectie',
    content: '<p>Nieuwe content...</p>'
});
```

### 3. Quiz Vragen
```javascript
const newQuestions = [
    {
        question: 'Nieuwe vraag?',
        options: ['Optie A', 'Optie B', 'Optie C'],
        correctAnswer: 1,
        feedback: 'Feedback tekst...'
    }
];
```

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

## 🔒 Beveiliging

### Best Practices
- **HTTPS** - Verplicht voor productie
- **Content Security Policy** - XSS bescherming
- **Input validation** - Client-side validatie
- **LocalStorage** - Geen gevoelige data

## 📈 Performance Optimalisatie

### Geïmplementeerde Features
- **Debouncing** - Voor input events
- **Throttling** - Voor scroll events
- **Lazy loading** - Voor media content
- **CSS animations** - Hardware accelerated

### Monitoring
```javascript
// Performance monitoring
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}ms`);
    });
});
```

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

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug', 'true');
```

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

## 📄 Licentie

Dit project is ontwikkeld voor HBO onderwijs en is beschikbaar onder de MIT licentie.

## 📞 Support

Voor vragen of problemen:
- **Email**: support@elearning-platform.nl
- **Documentatie**: [Wiki](https://github.com/elearning-platform/wiki)
- **Issues**: [GitHub Issues](https://github.com/elearning-platform/issues)

---

**Ontwikkeld met ❤️ voor inclusief HBO onderwijs**