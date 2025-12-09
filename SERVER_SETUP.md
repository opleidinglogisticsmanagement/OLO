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

## Vercel Deployment

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

## Troubleshooting

- **API Key niet gevonden (lokaal):** Zorg ervoor dat `.env` bestand bestaat en `GEMINI_API_KEY` bevat
- **API Key niet gevonden (Vercel):** 
  - Controleer of `GEMINI_API_KEY` is ingesteld in Vercel dashboard (Settings → Environment Variables)
  - Zorg ervoor dat je een redeploy hebt gedaan na het toevoegen van de variable
  - Controleer of de variable beschikbaar is voor alle environments (Production, Preview, Development)
- **Port al in gebruik:** Wijzig `PORT` in `.env` bestand
- **CORS errors:** De server heeft CORS enabled voor alle origins



