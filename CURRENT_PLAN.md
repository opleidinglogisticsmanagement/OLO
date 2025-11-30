# Plan: Headers Versmallen

De headers worden verlaagd van `h-20` (80px) naar `h-16` (64px) voor een compacter design. Om dit te laten passen, wordt de grote titel "E-Learning" verplaatst naar het navigatiemenu.

### Te wijzigen bestanden
1.  `[index.html](index.html)`
2.  `[pages/BaseLessonPage.js](pages/BaseLessonPage.js)`

### Wijzigingen
1.  **Hoogte Aanpassen**:
    -   Vervang `h-20` door `h-16` in zowel de Sidebar Header als de Main Header.
2.  **Sidebar Header Inhoud**:
    -   Verwijder de `<h1>E-Learning</h1>`.
    -   Promoveer de paragraaf "Opzetten van..." tot `<h1>` met een kleiner font (`text-sm font-bold`).
3.  **Navigatie**:
    -   Voeg een nieuw kopje "E-Learning" toe in de sidebar, direct boven de "Start" knop.
    -   Stijl: Grijs, uppercase, klein (`text-xs`), vergelijkbaar met sectie-headers.