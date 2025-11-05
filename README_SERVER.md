# Server Setup Instructies

## Stap 1: Node.js installeren

Als je Node.js nog niet hebt:
1. Ga naar https://nodejs.org/
2. Download de LTS versie
3. Installeer Node.js
4. Controleer installatie: `node --version` en `npm --version`

## Stap 2: Dependencies installeren

In de terminal/command prompt, navigeer naar de project folder en run:
```bash
npm install
```

Dit installeert:
- Express (web server)
- CORS (voor cross-origin requests)
- dotenv (voor environment variables)
- node-fetch (voor API calls)

## Stap 3: .env bestand aanmaken

Maak een `.env` bestand in de root directory met deze inhoud:

```
GEMINI_API_KEY=AIzaSyBKVwbM5mKMbACval2mocwFgo_rHUMwm0Q
PORT=3000
```

**BELANGRIJK:** Vervang `AIzaSyBKVwbM5mKMbACval2mocwFgo_rHUMwm0Q` met je eigen Gemini API key als die anders is.

## Stap 4: Server starten

Run in de terminal:
```bash
npm start
```

Of voor development met auto-reload:
```bash
npm run dev
```

Je zou moeten zien:
```
🚀 Server running on http://localhost:3000
📝 API Key configured: ✅ Yes
📚 E-Learning template is available at: http://localhost:3000
🔧 API endpoint: http://localhost:3000/api/generate-questions
```

## Stap 5: Testen

1. Open je browser en ga naar: `http://localhost:3000/week2.html`
2. De MC vragen zouden nu automatisch gegenereerd moeten worden
3. Check de console (F12) voor eventuele errors

## Troubleshooting

### Port 3000 al in gebruik?
Wijzig `PORT=3001` (of een ander getal) in je `.env` bestand.

### "Cannot find module" errors?
Run opnieuw: `npm install`

### Server start niet?
Check of Node.js correct geïnstalleerd is: `node --version`

### API calls werken niet?
- Check of de server draait
- Check of `.env` bestand bestaat en `GEMINI_API_KEY` bevat
- Check de server console voor errors



