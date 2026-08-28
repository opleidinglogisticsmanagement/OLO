---
name: olo-content-json
description: >-
  Schrijft en bewerkt OLO e-learning content in apps/*/content/*.content.json
  met sobere opmaak (weinig vet). Gebruik bij opdrachten, theorie, leerdoelen,
  introducties en andere content JSON in logistiek-onderzoek-2627.
---

# OLO content JSON — schrijfstijl

## Wanneer toepassen

Bij het schrijven of bewerken van `*.content.json` in `apps/logistiek-onderzoek-2627/content/`.

## Vet (`<strong>`) — spaarzaam

Gebruik `<strong>` alleen wanneer het echt nodig is:

- Labels in gestructureerde lijsten: `Conclusie:`, `Opdracht:`, `Let op:`
- Genummerde substappen in uitleg: `1. Afbakening`, `2. Operationalisatie`
- Citaten of voorbeeldformuleringen (doelstelling, hoofdvraag in voorbeeldblocks)
- Eén nadruk per alinea maximaal, en liever geen

Gebruik **geen** `<strong>` voor:

- Gangbare vaktermen (hoofdvraag, doelstelling, onderzoeksmodel, deelvragen)
- Woorden in opdrachtstappen (vaststellen, uiteenrafelen, waarom, waar)
- Hele zinnen of alinea's
- Elke bullet in een lijst

## Schrijfstijl

- Nederlands, direct en leesbaar; vertrouw op zinsstructuur in plaats van vet
- Opdrachten: korte intro + genummerde stappen zonder overmatige nadruk
- Geen em-dash (—); gebruik komma, punt of dubbele punt
- Links: `class="text-blue-600 dark:text-blue-400 hover:underline font-medium"`

## Check vóór afronden

1. Tel `<strong>` in nieuwe/gewijzigde secties: meer dan 2 per alinea → herzien
2. Lees de tekst hardop: klinkt het als een woordenlijst met nadruk? → vet eruit
3. JSON valide houden (geen trailing commas)

## Voorbeeld

**Niet:**
```html
<p>Lees je <strong>hoofdvraag</strong> en het <strong>b-gedeelte</strong> door.</p>
```

**Wel:**
```html
<p>Lees je hoofdvraag en het b-gedeelte van je doelstelling nog eens door.</p>
```
