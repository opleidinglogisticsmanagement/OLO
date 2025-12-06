# Environment Variables Template

Kopieer deze inhoud naar een `.env` bestand in de root directory en vul de waarden in.

```env
# Google Gemini API Key
# Verkrijg een API key op: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_api_key_here

# Server Port (standaard: 3000)
PORT=3000

# Toegestane CORS origins (gescheiden door komma's)
# Voor development: http://localhost:3000,http://localhost:5500
# Voor productie: https://jouw-domein.nl
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5500

# Node Environment (development of production)
NODE_ENV=development
```

## Belangrijk

- Het `.env` bestand staat al in `.gitignore` en wordt niet gecommit naar Git
- Zorg ervoor dat je een geldige Gemini API key hebt
- Voor productie: pas `ALLOWED_ORIGINS` aan naar je eigen domein

## Vercel Deployment

Voor Vercel deployment moet je de environment variables instellen in het Vercel dashboard:

1. Ga naar je project in Vercel Dashboard
2. Ga naar **Settings** → **Environment Variables**
3. Voeg de volgende variable toe:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Je Gemini API key
   - **Environment:** Production, Preview, en Development (selecteer alle drie)

**Belangrijk:** 
- `config.js` staat in `.gitignore` en wordt niet naar Git gepusht
- Op Vercel wordt `config.js` automatisch gegenereerd op basis van de `GEMINI_API_KEY` environment variable
- Dit voorkomt 404 errors voor `config.js` op Vercel

