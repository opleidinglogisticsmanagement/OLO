# Instaptoets-vragen per leerdoel

Plaats een JSON-bestand per leerdoel: `{goalId}.json`

Voorbeeld: `van-probleem-naar-doelstelling-1.json`

## Structuur

```json
{
  "goalId": "van-probleem-naar-doelstelling-1",
  "vragen": [
    {
      "id": "vraag1",
      "vraag": "Welke zes onderdelen heeft een probleemverkenning?",
      "bloomLevel": 1,
      "antwoorden": [
        { "id": "a", "tekst": "Optie A", "correct": false },
        { "id": "b", "tekst": "Optie B", "correct": true }
      ],
      "feedbackGoed": "Korte uitleg bij goed antwoord",
      "feedbackFout": "Korte uitleg bij fout antwoord"
    }
  ]
}
```

## Vraagtypen

### Meerkeuze (type: "mc" of weglaten)
- `antwoorden`: array met id, tekst, correct (true/false)

### Open vraag (type: "open")
- `goedAntwoord`: verwacht correct antwoord (voor AI-nakijken)
- `feedbackGoed`: feedback bij goed antwoord
- `feedbackFout`: feedback bij fout antwoord
- `casus`: optioneel, context bij de vraag
- `foutAntwoordVoorbeelden`: optioneel, voorbeelden van foute antwoorden

## Velden

| Veld | Verplicht | Beschrijving |
|------|-----------|--------------|
| `goalId` | Ja | Leerdoel-ID (moet overeenkomen met leerdoelen-registry.json) |
| `vragen` | Ja | Array van vragen |
| `vragen[].id` | Ja | Unieke id per vraag |
| `vragen[].vraag` | Ja | Vraagtekst |
| `vragen[].type` | Optioneel | "open" of "mc" (default: mc) |
| `vragen[].bloomLevel` | Aanbevolen | 1=herinneren, 2=begrijpen, 3=toepassen |
| `vragen[].antwoorden` | Bij mc | Array met id, tekst, correct (true/false) |
| `vragen[].goedAntwoord` | Bij open | Verwacht correct antwoord |
| `vragen[].feedbackGoed` | Bij open | Feedback bij goed antwoord |
| `vragen[].feedbackFout` | Bij open | Feedback bij fout antwoord |
| `vragen[].casus` | Optioneel | Context bij casusvragen |

## Bloom-niveaus

- **1 (herinneren)**: Feitenkennis, definities
- **2 (begrijpen)**: Relaties, uitleg, interpretatie
- **3 (toepassen)**: Casuïstiek, toepassen in situatie
