# Server-side Proxy Setup

Deze server handelt Gemini API calls af om CORS-problemen te voorkomen en API keys veilig te beheren.

## Vereisten

- Node.js (versie 14 of hoger)
- npm (Node Package Manager)

## Installatie

1. **Installeer dependencies:**
   ```bash
   npm install
   ```

2. **Maak een `.env` bestand:**
   Maak een `.env` bestand in de root directory met:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```
   
   Vervang `your_api_key_here` met je eigen Google Gemini API key.

## Gebruik

1. **Start de server:**
   ```bash
   npm start
   ```
   
   Of voor development met auto-reload:
   ```bash
   npm run dev
   ```

2. **Open de applicatie:**
   Open `http://localhost:3000` in je browser.

## API Endpoints

### POST /api/generate-questions
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

### GET /api/health
Health check endpoint om te controleren of de server draait.

## Troubleshooting

- **API-Key niet gevonden:** Zorg ervoor dat `.env` bestand bestaat en `GEMINI_API_KEY` bevat
- **Port al in gebruik:** Wijzig `PORT` in `.env` bestand
- **CORS errors:** De server heeft CORS enabled voor alle origins



