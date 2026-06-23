# Logistiek Onderzoek 2026-2027

Preview-app voor studiejaar 2026-2027. Productie blijft `apps/logistiek-onderzoek`.

Deze app is gemigreerd van week-URL's naar fase-URL's. Navigatie, zoeken en redirects worden centraal beheerd via `js/phase-navigation-config.js`.

## Huidige URL-structuur

| Pagina | Inhoud | Oude redirect |
|--------|--------|---------------|
| `index.html` | Start | — |
| `onderzoeksplan.html` | Onderzoeksplan template | `week1.html` |
| `casus.html` | Casus magazijnoptimalisatie | — |
| `fase1.html` | Fase 01 – Eerste aanzet | `week2.html`, `week3.html` |
| `fase2.html` | Fase 02 – De verfijning | `week4.html` (behalve `#literatuuronderzoek`) |
| `fase3.html` | Fase 03 – Literatuuronderzoek | `week5.html`, `week4.html#literatuuronderzoek` |
| `fase4.html` | Fase 04 – Onderzoekstechnisch ontwerp | `week6.html` |
| `afronding.html` | Afronding | `week7.html` |
| `register.html` | Begrippenlijst | — |
| `afsluiting.html` | Afsluiting | — |

Belangrijke bestanden:

- `js/phase-navigation-config.js` — sidebar, modulelijst, week-redirects
- `js/phase-navigation-init.js` — dynamische nav op statische pagina's (index, ai-leerpad, …)
- `js/LogistiekNavigation.js` — koppeling met core `LayoutRenderer` / `NavigationService`
- `js/app-router-extensions.js` — SPA-routes voor fase-URL's

---

## Optionele opruimstappen (na migratie)

De migratie is **functioneel af**. Oude week-bestanden staan bewust nog als backup en redirect-stub in de repo. De stappen hieronder zijn **niet verplicht** en mogen **alleen** worden uitgevoerd als je de e-learning grondig hebt getest.

### Vereiste vóór opruimen

Voer de optionele stappen **pas** uit wanneer **beide** checks groen zijn:

1. **Lokaal (localhost)**  
   - Start de server: `cd packages/core && npm run dev`  
   - Open `http://localhost:3000` en test alle pagina's uit de tabel hierboven  
   - Controleer: sidebar, fase-submenu's, SPA-navigatie vanaf index, zoeken, begrippenlijst, oude week-URL's (redirect), hash-anchors (bijv. `#literatuuronderzoek`)

2. **Vercel (preview of productie)**  
   - Deploy is geslaagd (geen build-fouten)  
   - Dezelfde pagina's en flows werken op de live Vercel-URL  
   - Oude bookmarks/links (week-URL's) leiden naar de juiste fase-pagina

> **Niet opruimen** zolang er nog fouten, ontbrekende content of kapotte links zijn. De backup-bestanden kosten weinig en maken terugdraaien eenvoudig.

---

### Stap 1: Oude `Week*LessonPage.js` uit SPA-scripts halen

**Doel:** Minder scripts laden op index/ai-leerpad/gepersonaliseerd; minder verwarring over welke lesson page actief is.

**Wat:** Verwijder script-tags en router-verwijzingen naar oude week-lesson pages in o.a.:

- `index.html`
- `ai-leerpad.html`
- `gepersonaliseerd.html`

Vervang door de fase-equivalenten (`Fase1LessonPage`, `Fase2LessonPage`, …, `OnderzoeksplanLessonPage`, `AfrondingLessonPage`) als dat nog niet overal zo staat.

**Behoud (als backup):** `pages/Week1LessonPage.js` t/m `Week7LessonPage.js` mogen in de map blijven; ze hoeven niet meer geladen te worden.

---

### Stap 2: Oude `week*.content.json` als deprecated behandelen

**Doel:** Eén duidelijke content-bron per pagina.

**Wat:** Bewerk voortaan alleen de fase-bestanden:

| Actief bestand | Vervangt (backup) |
|----------------|-------------------|
| `content/onderzoeksplan.content.json` | `week1.content.json` |
| `content/fase1.content.json` | `week2.content.json`, `week3.content.json` |
| `content/fase2.content.json` | deel van `week4.content.json` |
| `content/fase3.content.json` | `week5.content.json` + literatuur uit week4 |
| `content/fase4.content.json` | `week6.content.json` |
| `content/afronding.content.json` | `week7.content.json` |

**Optioneel later:** oude `week*.content.json` verwijderen of een korte `_deprecated` notitie in de bestandsnaam/opmerking — **alleen** als je zeker weet dat niemand ze meer nodig heeft.

---

### Stap 3: `vercel.json` 301-redirects (SEO)

**Doel:** Snellere server-side redirects en betere SEO dan alleen JavaScript-stubs in `week*.html`.

**Wat:** Voeg in `vercel.json` permanente redirects toe, bijvoorbeeld:

- `week1.html` → `onderzoeksplan.html`
- `week2.html` / `week3.html` → `fase1.html`
- `week4.html` → `fase2.html` of `fase3.html` (afhankelijk van anchor)
- `week5.html` → `fase3.html`
- `week6.html` → `fase4.html`
- `week7.html` → `afronding.html`

**Let op:** De HTML redirect-stubs blijven nuttig als fallback; 301's zijn een extra laag, geen vervanging voor grondig testen.

---

## Lokaal testen

```bash
cd packages/core
npm run dev
```

Open daarna `http://localhost:3000` (niet Live Server op poort 5500).

## Wijzigingen pushen

Werk alleen in `apps/logistiek-onderzoek-2627/`. Wijzig geen bestanden in `packages/core` (alleen via PR). Zie `.cursorrules` in de repo-root en `.allowed-paths.json` voor push-beperkingen.
