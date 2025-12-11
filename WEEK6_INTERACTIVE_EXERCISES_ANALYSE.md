# Analyse Week 6: Interactieve Oefeningen Voorstellen

## Inhoudsanalyse Week 6

### Kernonderwerpen:
1. **Drie kernbeslissingen**
   - Breedte vs. Diepgang
   - Kwantitatief vs. Kwalitatief
   - Bureauonderzoek vs. Empirisch onderzoek

2. **Onderzoeksstrategieën** (5 types)
   - Survey-onderzoek
   - Casestudy
   - Experiment
   - Gefundeerde theoriebenadering
   - Bureauonderzoek

3. **Dataverzamelingsplan**
   - Relatie met onderzoeksmodel
   - Wat, waarom en hoe meten
   - Validiteit en betrouwbaarheid

### Leerdoelen:
- Drie kernbeslissingen toepassen
- Passende onderzoeksstrategie kiezen en onderbouwen
- Dataverzamelingsplan opstellen met kritische reflectie op validiteit en betrouwbaarheid

---

## Voorgestelde Interactieve Oefeningen

### 1. **Kernbeslissingen Beslissingsboom** ⭐⭐⭐
**Type:** Interactieve beslissingsboom / Flowchart
**Doel:** Studenten leren de drie kernbeslissingen systematisch toepassen

**Beschrijving:**
Een interactieve beslissingsboom waarbij studenten stap voor stap door de drie kernbeslissingen worden geleid. Bij elke beslissing krijgen ze:
- Een korte casus/context
- Twee opties (bijv. "Breedte" of "Diepgang")
- Directe feedback over hun keuze
- Uitleg waarom deze keuze past bij hun onderzoeksvraag

**Implementatie:**
- Gebruik clickable steps of een custom flowchart component
- Elke beslissing leidt naar de volgende
- Aan het einde krijgen studenten een samenvatting van hun keuzes
- Optioneel: vergelijk hun keuzes met een "ideale" oplossing

**Waarom effectief:**
- Helpt studenten de logische volgorde van beslissingen begrijpen
- Directe feedback versterkt het leerproces
- Praktische toepassing op echte casussen

---

### 2. **Onderzoeksstrategie Matching Game** ⭐⭐⭐
**Type:** Drag-and-drop matching oefening
**Doel:** Studenten leren welke onderzoeksstrategie bij welke situatie hoort

**Beschrijving:**
Een matching oefening waarbij studenten onderzoeksscenario's moeten matchen met de juiste onderzoeksstrategie. 

**Voorbeeld items:**
- **Scenario:** "Je wilt de tevredenheid van 500 klanten meten over een nieuwe bezorgservice"
  - **Match:** Survey-onderzoek
  
- **Scenario:** "Je wilt diepgaand begrijpen waarom een specifiek magazijn inefficiënt is"
  - **Match:** Casestudy

- **Scenario:** "Je wilt testen of een nieuwe pickingmethode sneller is dan de huidige"
  - **Match:** Experiment

**Implementatie:**
- Gebruik bestaande `renderMatchingExercise` functionaliteit
- 5-8 scenario's per keer
- Feedback na elke match
- Uitleg waarom de match correct/incorrect is

**Waarom effectief:**
- Actief leren door te matchen
- Helpt studenten patronen herkennen
- Herhaalbaar voor verschillende scenario's

---

### 3. **Strategie Selector: "Kies de Juiste Strategie"** ⭐⭐⭐
**Type:** Interactieve scenario-based oefening
**Doel:** Studenten leren onderzoeksstrategieën kiezen op basis van kernbeslissingen

**Beschrijving:**
Studenten krijgen een onderzoeksvraag en moeten:
1. Eerst de drie kernbeslissingen maken
2. Vervolgens de juiste onderzoeksstrategie selecteren
3. Hun keuze onderbouwen

**Voorbeeld scenario:**
"Een logistiek bedrijf wil onderzoeken welke factoren de medewerkerstevredenheid beïnvloeden in hun distributiecentrum."

**Stappen:**
1. **Kernbeslissing 1:** Breedte of Diepgang?
   - Opties met uitleg
   - Feedback: "Voor medewerkerstevredenheid heb je diepgang nodig om de onderliggende factoren te begrijpen"

2. **Kernbeslissing 2:** Kwantitatief of Kwalitatief?
   - Opties met uitleg
   - Feedback: "Kwalitatief past hier omdat je de 'waarom' wilt begrijpen"

3. **Kernbeslissing 3:** Bureauonderzoek of Empirisch?
   - Opties met uitleg
   - Feedback: "Empirisch onderzoek is nodig om met medewerkers te praten"

4. **Strategie selectie:** Welke strategie past hierbij?
   - Multiple choice met alle 5 strategieën
   - Feedback: "Gefundeerde theoriebenadering of Casestudy zou hier passen"

**Implementatie:**
- Multi-step form met progress indicator
- Conditional logic: keuzes beïnvloeden volgende stappen
- Uitgebreide feedback bij elke stap
- Optioneel: meerdere scenario's voor herhaling

**Waarom effectief:**
- Integreert alle leerdoelen in één oefening
- Toont de samenhang tussen kernbeslissingen en strategie
- Praktische toepassing op realistische scenario's

---

### 4. **Dataverzamelingsplan Builder** ⭐⭐
**Type:** Interactieve formulier/template invuller
**Doel:** Studenten leren een dataverzamelingsplan opstellen

**Beschrijving:**
Een interactieve tool waarbij studenten stap voor stap een dataverzamelingsplan invullen:
- Methode selecteren
- Relateren aan onderzoeksmodel (hoofdvraag, deelvraag, type onderzoek)
- Beschrijven wat, waarom en hoe
- Reflecteren op validiteit en betrouwbaarheid

**Implementatie:**
- Multi-step form met accordion-style secties
- Dropdowns voor methoden (gebaseerd op gekozen strategie)
- Text areas voor beschrijvingen
- Validatie: controleer of alle velden ingevuld zijn
- Preview: toon samenvatting van ingevuld plan

**Waarom effectief:**
- Praktische oefening met het template
- Helpt studenten structuur begrijpen
- Direct toepasbaar op hun eigen onderzoek

---

### 5. **Validiteit & Betrouwbaarheid Quiz** ⭐⭐
**Type:** Interactive quiz met scenario's
**Doel:** Studenten leren validiteit en betrouwbaarheid herkennen en verbeteren

**Beschrijving:**
Een quiz waarbij studenten voor verschillende dataverzamelingsmethoden moeten beoordelen:
- Welke validiteitsproblemen zijn er?
- Welke betrouwbaarheidsproblemen zijn er?
- Hoe kunnen deze worden verbeterd?

**Voorbeeld vragen:**
- "Je gebruikt een vragenlijst die alleen ja/nee vragen heeft. Welk validiteitsprobleem kan dit veroorzaken?"
- "Je interviewt 3 medewerkers over hun werkervaring. Wat is een betrouwbaarheidsrisico?"

**Implementatie:**
- Multiple choice vragen
- Optioneel: drag-and-drop om problemen te matchen met oplossingen
- Uitgebreide feedback met uitleg

**Waarom effectief:**
- Helpt studenten kritisch nadenken over hun eigen onderzoek
- Praktische toepassing van abstracte concepten
- Versterkt begrip van validiteit en betrouwbaarheid

---

### 6. **Onderzoeksstrategie Vergelijkingstabel** ⭐
**Type:** Interactieve vergelijkingstabel met filters
**Doel:** Studenten leren de verschillen en overeenkomsten tussen strategieën

**Beschrijving:**
Een interactieve tabel waarbij studenten:
- Verschillende strategieën kunnen vergelijken
- Filters kunnen toepassen (bijv. "Toon alleen kwantitatieve strategieën")
- Kenmerken kunnen aanvinken om te vergelijken

**Kenmerken om te vergelijken:**
- Breedte vs. Diepgang
- Kwantitatief vs. Kwalitatief
- Dataverzamelingsmethoden
- Voor- en nadelen
- Wanneer te gebruiken

**Implementatie:**
- Interactive table met sort/filter functionaliteit
- Toggle buttons om kenmerken te tonen/verbergen
- Optioneel: matching oefening om kenmerken aan strategieën te koppelen

**Waarom effectief:**
- Helpt studenten verschillen onthouden
- Visuele vergelijking maakt patronen duidelijk
- Referentie tool tijdens het leren

---

### 7. **Casus: "Leveranciersprestaties en SLA" - Interactieve Analyse** ⭐⭐⭐
**Type:** Interactieve casus analyse
**Doel:** Studenten leren de theorie toepassen op het voorbeeld uit de content

**Beschrijving:**
Gebruik het voorbeeld uit de content (Leveranciersprestaties en SLA) en maak het interactief:
- Studenten moeten de drie kernbeslissingen maken voor deze casus
- Vervolgens de onderzoeksstrategie kiezen
- Dataverzamelingsmethoden selecteren
- Validiteit en betrouwbaarheid beoordelen

**Stappen:**
1. **Lees de casus** (accordion met de volledige beschrijving)
2. **Maak de kernbeslissingen:**
   - Drag-and-drop of multiple choice
   - Feedback: "Correct! Breedte past hier omdat..."
3. **Kies de strategie:**
   - Multiple choice
   - Feedback met uitleg
4. **Selecteer dataverzamelingsmethoden:**
   - Checklist met beschikbare methoden
   - Feedback: "Secundaire data is inderdaad geschikt omdat..."
5. **Beoordeel validiteit en betrouwbaarheid:**
   - Text areas voor reflectie
   - Optioneel: AI feedback op hun reflectie

**Implementatie:**
- Multi-step interactive component
- Gebruik bestaande accordion voor casus
- Combineer verschillende interactive types
- Optioneel: vergelijk met "ideale" oplossing

**Waarom effectief:**
- Directe toepassing op voorbeeld uit content
- Helpt studenten de logica begrijpen
- Praktische oefening met alle concepten

---

### 8. **"Wat Past Waar?" - Drag-and-Drop Matrix** ⭐⭐
**Type:** Drag-and-drop matrix oefening
**Doel:** Studenten leren dataverzamelingsmethoden koppelen aan onderzoeksstrategieën

**Beschrijving:**
Een matrix waarbij studenten dataverzamelingsmethoden moeten plaatsen bij de juiste onderzoeksstrategieën.

**Layout:**
- Links: Dataverzamelingsmethoden (draggable items)
  - Vragenlijst/Survey
  - Interview
  - Observatie
  - Focusgroep
  - Documentanalyse
  - Experimentele metingen
  - Secundaire data
  - Literatuuronderzoek

- Rechts: Onderzoeksstrategieën (drop zones)
  - Survey-onderzoek
  - Casestudy
  - Experiment
  - Gefundeerde theoriebenadering
  - Bureauonderzoek

**Regels:**
- Elke methode kan bij meerdere strategieën passen
- Studenten moeten alle methoden plaatsen
- Feedback: "Correct! Vragenlijst past bij survey-onderzoek omdat..."
- Optioneel: punten voor correcte matches

**Implementatie:**
- Gebruik bestaande matching exercise maar met multi-match functionaliteit
- Of custom drag-and-drop met multiple drop zones
- Visual feedback (groen voor correct, oranje voor deels correct)

**Waarom effectief:**
- Helpt studenten verbanden zien tussen methoden en strategieën
- Actief leren door te slepen
- Herhaalbaar met verschillende methoden

---

## Prioritering & Implementatie Volgorde

### Hoge Prioriteit (Directe impact op leerdoelen):
1. **Kernbeslissingen Beslissingsboom** - Basis voor alle andere keuzes
2. **Onderzoeksstrategie Matching Game** - Helpt strategieën onthouden
3. **Casus: "Leveranciersprestaties en SLA"** - Directe toepassing op content

### Gemiddelde Prioriteit (Versterking van begrip):
4. **Strategie Selector** - Integreert alle concepten
5. **Validiteit & Betrouwbaarheid Quiz** - Kritisch denken
6. **"Wat Past Waar?" Matrix** - Verbanden tussen methoden en strategieën

### Lage Prioriteit (Ondersteunend):
7. **Dataverzamelingsplan Builder** - Praktische tool (kan ook als template)
8. **Onderzoeksstrategie Vergelijkingstabel** - Referentie tool

---

## Technische Overwegingen

### Bestaande Functionaliteit die Hergebruikt Kan Worden:
- ✅ `InteractiveRenderer.renderMatchingExercise()` - Voor matching oefeningen
- ✅ `InteractiveRenderer.renderAccordion()` - Voor multi-step oefeningen
- ✅ `InteractiveRenderer.renderSMARTChecklist()` - Als template voor andere checklists
- ✅ Clickable steps - Voor beslissingsbomen
- ✅ MC questions (AI-generated) - Voor quiz vragen

### Nieuwe Functionaliteit die Mogelijk Nodig Is:
- 🔨 Multi-step form met conditional logic
- 🔨 Drag-and-drop met multiple drop zones (multi-match)
- 🔨 Flowchart/decision tree component
- 🔨 Interactive table met filters
- 🔨 Progress indicator voor multi-step oefeningen

### Integratie met Bestaande Content:
- Oefeningen kunnen worden toegevoegd aan `week6.content.json`
- Gebruik bestaande content types of nieuwe types toevoegen
- Consistent met bestaande styling (Tailwind CSS, dark mode)

---

## Aanbevelingen voor Implementatie

### Fase 1: Quick Wins (1-2 dagen werk)
1. **Onderzoeksstrategie Matching Game** - Gebruik bestaande matching exercise
2. **Validiteit & Betrouwbaarheid Quiz** - Gebruik bestaande MC question generator

### Fase 2: Medium Complexity (3-5 dagen werk)
3. **Kernbeslissingen Beslissingsboom** - Custom component met clickable steps
4. **Casus: "Leveranciersprestaties en SLA"** - Combineer bestaande componenten

### Fase 3: Advanced Features (1-2 weken werk)
5. **Strategie Selector** - Multi-step form met conditional logic
6. **"Wat Past Waar?" Matrix** - Enhanced drag-and-drop met multi-match

---

## Conclusie

De voorgestelde interactieve oefeningen sluiten aan bij de leerdoelen van week 6 en maken gebruik van bestaande functionaliteit waar mogelijk. Ze variëren in complexiteit en kunnen gefaseerd worden geïmplementeerd. De oefeningen richten zich op actief leren, directe feedback en praktische toepassing van de theorie.

**Kernvoordelen:**
- ✅ Verhoogt betrokkenheid door interactiviteit
- ✅ Directe feedback versterkt leren
- ✅ Praktische toepassing op realistische scenario's
- ✅ Herhaalbaar voor verschillende casussen
- ✅ Integreert alle leerdoelen

