# E-Learning Platform - Template voor Collega's

## 🎯 **Overzicht**

Dit is een **schone basis template** voor het e-learning platform. Alle onnodige elementen zijn verwijderd om een eenvoudige basis te creëren waar collega's content kunnen toevoegen.

## 📁 **Project Structuur**

```
OLO/
├── index.html                  # Dashboard (hoofdpagina)
├── week1.html                  # Week 1 pagina
├── week2.html                  # Week 2 pagina
├── week3.html                  # Week 3 pagina
├── week4.html                  # Week 4 pagina
├── week5.html                  # Week 5 pagina
├── week6.html                  # Week 6 pagina
├── week7.html                  # Week 7 pagina
├── afsluiting.html             # Afsluiting pagina
├── pages/
│   ├── BaseLessonPage.js       # Basis template voor alle weeks
│   ├── Week1LessonPage.js      # Week 1 specifiek (voorbeeld)
│   ├── Week2LessonPage.js      # Week 2 specifiek (voorbeeld)
│   └── OtherWeekPages.js       # Week 3-7 + Afsluiting
└── config/
    └── moduleConfig.js         # Module configuratie
```

## 🚀 **Hoe te Gebruiken**

### **1. Basis Template Gebruiken**

Elke week pagina gebruikt de `BaseLessonPage` als basis. Deze bevat:

- **Sidebar navigatie** met alle modules
- **Header** met breadcrumbs
- **Basis content secties** (Leerdoelen, Theorie, Video, Quiz)
- **Navigatie buttons** tussen modules

### **2. Content Toevoegen**

In elke week pagina kun je content toevoegen door de `renderContentSections()` methode te overschrijven:

```javascript
// Voorbeeld voor Week 2
class Week2LessonPage extends BaseLessonPage {
    constructor() {
        super('week-2', 'Week 2', 'Logistiek & Duurzaamheid');
    }

    renderContentSections() {
        return `
            <!-- Leerdoelen Sectie -->
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-bullseye text-green-600 text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">Leerdoelen</h2>
                        <div class="prose max-w-none">
                            <p class="text-gray-600 mb-4">Na het voltooien van deze module kun je:</p>
                            <ul class="space-y-2">
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-check text-green-500 mt-1"></i>
                                    <span class="text-gray-700">Jouw specifieke leerdoel 1</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-check text-green-500 mt-1"></i>
                                    <span class="text-gray-700">Jouw specifieke leerdoel 2</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Theorie Sectie -->
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-book text-purple-600 text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">Theorie</h2>
                        <div class="prose max-w-none">
                            <p class="text-gray-700 mb-4">
                                Hier kun je jouw theorie content toevoegen...
                            </p>
                            
                            <!-- Afbeeldingen toevoegen -->
                            <div class="mb-4">
                                <img src="jouw-afbeelding.jpg" alt="Beschrijving" class="rounded-lg w-full max-w-md mx-auto">
                            </div>
                            
                            <!-- Meer content -->
                            <p class="text-gray-700 mb-4">
                                Meer tekst content...
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Video Sectie -->
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-play text-red-600 text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">Video</h2>
                        <div class="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
                            <div class="text-center text-white">
                                <i class="fas fa-play-circle text-6xl mb-4 opacity-75"></i>
                                <p class="text-lg font-medium">Video Player</p>
                                <p class="text-sm opacity-75">Video content komt hier</p>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600">
                            <i class="fas fa-info-circle mr-1"></i>
                            Hier kunnen video's worden toegevoegd
                        </p>
                    </div>
                </div>
            </section>

            <!-- Quiz Sectie -->
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-question-circle text-orange-600 text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">Quiz</h2>
                        <div class="space-y-4">
                            <div class="border border-gray-200 rounded-lg p-4">
                                <h3 class="font-semibold text-gray-900 mb-3">Vraag 1: Jouw vraag?</h3>
                                <div class="space-y-2">
                                    <label class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input type="radio" name="quiz-q1" value="a" class="text-blue-600 focus-ring">
                                        <span class="text-gray-700">A) Antwoord optie 1</span>
                                    </label>
                                    <label class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input type="radio" name="quiz-q1" value="b" class="text-blue-600 focus-ring">
                                        <span class="text-gray-700">B) Antwoord optie 2</span>
                                    </label>
                                    <label class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input type="radio" name="quiz-q1" value="c" class="text-blue-600 focus-ring">
                                        <span class="text-gray-700">C) Antwoord optie 3</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}
```

## 🎨 **Content Types die je kunt Toevoegen**

### **1. Tekst Content**
```html
<p class="text-gray-700 mb-4">
    Jouw tekst content hier...
</p>
```

### **2. Afbeeldingen**
```html
<div class="mb-4">
    <img src="jouw-afbeelding.jpg" alt="Beschrijving" class="rounded-lg w-full max-w-md mx-auto">
</div>
```

### **3. Video's**
```html
<div class="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
    <div class="text-center text-white">
        <i class="fas fa-play-circle text-6xl mb-4 opacity-75"></i>
        <p class="text-lg font-medium">Video Player</p>
        <p class="text-sm opacity-75">Video content komt hier</p>
    </div>
</div>
```

### **4. Meerkeuzevragen**
```html
<div class="border border-gray-200 rounded-lg p-4">
    <h3 class="font-semibold text-gray-900 mb-3">Vraag: Jouw vraag?</h3>
    <div class="space-y-2">
        <label class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="quiz-q1" value="a" class="text-blue-600 focus-ring">
            <span class="text-gray-700">A) Antwoord optie 1</span>
        </label>
        <!-- Meer opties... -->
    </div>
</div>
```

### **5. Lijsten**
```html
<ul class="space-y-2">
    <li class="flex items-start space-x-3">
        <i class="fas fa-check text-green-500 mt-1"></i>
        <span class="text-gray-700">Lijst item 1</span>
    </li>
    <li class="flex items-start space-x-3">
        <i class="fas fa-check text-green-500 mt-1"></i>
        <span class="text-gray-700">Lijst item 2</span>
    </li>
</ul>
```

## 🔧 **Aanpassingen Maken**

### **1. Nieuwe Week Toevoegen**
1. Maak een nieuwe HTML file (bijv. `week8.html`)
2. Maak een nieuwe JavaScript file (bijv. `Week8LessonPage.js`)
3. Voeg de module toe aan `config/moduleConfig.js`

### **2. Styling Aanpassen**
Alle styling gebruikt TailwindCSS classes. Je kunt:
- Kleuren aanpassen: `bg-blue-100`, `text-blue-600`
- Spacing aanpassen: `p-6`, `mb-4`, `space-y-2`
- Layout aanpassen: `grid`, `flex`, `max-w-4xl`

### **3. Iconen Toevoegen**
Gebruik Font Awesome iconen:
```html
<i class="fas fa-book text-blue-600 text-lg"></i>
<i class="fas fa-play text-red-600 text-lg"></i>
<i class="fas fa-question-circle text-orange-600 text-lg"></i>
```

## 📱 **Responsive Design**

De template is volledig responsive:
- **Desktop**: Volledige sidebar + hoofdcontent
- **Tablet**: Collapsible sidebar
- **Mobile**: Overlay menu + gestapelde layout

## ♿ **Toegankelijkheid**

De template bevat:
- **ARIA labels** voor screen readers
- **Keyboard navigation** ondersteuning
- **Focus management** met duidelijke indicators
- **Skip to content** link

## 🚀 **Starten**

1. **Open `index.html`** in je browser voor het dashboard
2. **Klik op een week** om naar die pagina te gaan
3. **Bewerk de JavaScript files** om content toe te voegen
4. **Refresh de pagina** om wijzigingen te zien

## 💡 **Tips voor Collega's**

### **Content Toevoegen:**
- Gebruik de bestaande sectie structuur
- Voeg content toe binnen de `<div class="prose max-w-none">` containers
- Gebruik consistente styling met TailwindCSS classes

### **Nieuwe Secties:**
- Kopieer een bestaande sectie
- Pas de titel en content aan
- Behoud de icon en kleur structuur

### **Testing:**
- Test op verschillende schermgroottes
- Controleer of alle links werken
- Verificeer dat content goed leesbaar is

---

**Deze template is ontworpen om makkelijk uit te breiden en aan te passen. Veel succes met het toevoegen van content! 🎉**
