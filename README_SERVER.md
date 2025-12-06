# Server Setup Instructies

## ✅ Snelle Start 

1. **Dependencies installeren** (eenmalig):
   ```bash
   npm install
   ```

2. **Server starten**:
   ```bash
   npm start
   ```

3. **Open in browser**: `http://localhost:3000/week2.html`

## 🔧 Automatisch Opstarten

De server start automatisch wanneer je Cursor opent (via `.vscode/tasks.json`).

**Als de server niet automatisch start:**
- Herstart Cursor volledig
- Of start handmatig: `npm start`
- Of gebruik het PowerShell script: `.\start-server.ps1`

## 📋 Stap-voor-stap Setup

### Stap 1: Node.js installeren

Als je Node.js nog niet hebt:
1. Ga naar https://nodejs.org/
2. Download de LTS versie
3. Installeer Node.js
4. Controleer installatie: `node --version` en `npm --version`

### Stap 2: Dependencies installeren

In de terminal/command prompt, navigeer naar de project folder en run:
```bash
npm install
```

Dit installeert:
- Express (web server)
- CORS (voor cross-origin requests)
- dotenv (voor environment variables)
- @google/generative-ai (voor Gemini API)
- node-fetch (voor API calls)

### Stap 3: .env bestand aanmaken

Maak een `.env` bestand in de root directory met deze inhoud:

```
GEMINI_API_KEY=AIzaSyBKVwbM5mKMbACval2mocwFgo_rHUMwm0Q
PORT=3000
```

**BELANGRIJK:** Vervang `AIzaSyBKVwbM5mKMbACval2mocwFgo_rHUMwm0Q` met je eigen Gemini API key als die anders is.

### Stap 4: Server starten

**Optie 1: Via npm (aanbevolen)**
```bash
npm start
```

**Optie 2: Via PowerShell script**
```bash
.\start-server.ps1
```

**Optie 3: Voor development met auto-reload**
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

### Stap 5: Testen

1. Open je browser en ga naar: `http://localhost:3000/week2.html`
2. De MC vragen zouden nu automatisch gegenereerd moeten worden
3. Check de console (F12) voor eventuele errors

## 🛠️ Handige Scripts

### Server starten
```bash
.\start-server.ps1
```
Controleert eerst of de server al draait en start alleen als nodig.

### Server stoppen
```bash
.\stop-server.ps1
```
Stopt de server die op poort 3000 draait.

## ⚠️ Troubleshooting

### Port 3000 al in gebruik?

**Optie 1: Stop de andere server**
```bash
.\stop-server.ps1
```

**Optie 2: Wijzig poort**
Wijzig `PORT=3001` (of een ander getal) in je `.env` bestand.

**Optie 3: Zoek en stop het proces handmatig**
```powershell
# Zoek welk proces poort 3000 gebruikt
netstat -ano | findstr :3000

# Stop het proces (vervang PID met het juiste nummer)
Stop-Process -Id <PID> -Force
```

### "Cannot find module" errors?

Run opnieuw:
```bash
npm install
```

### Server start niet?

1. Check of Node.js correct geïnstalleerd is: `node --version`
2. Check of npm werkt: `npm --version`
3. Check of dependencies geïnstalleerd zijn: `npm list`
4. Check de console voor error messages

### Meerdere server instanties?

De server is nu geconfigureerd om te voorkomen dat meerdere instanties draaien. Als je toch meerdere instanties ziet:

1. Stop alle Node processen:
   ```powershell
   Get-Process -Name node | Stop-Process -Force
   ```

2. Start opnieuw:
   ```bash
   npm start
   ```

### API calls werken niet?

1. **Check of de server draait:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Je zou moeten zien: `{"status":"ok","apiKeyConfigured":true,...}`

2. **Check of `.env` bestand bestaat en `GEMINI_API_KEY` bevat**

3. **Check de server console voor errors**

4. **Open de pagina via `http://localhost:3000/week2.html`** (niet via Live Server op poort 5500!)

### Live Server conflicteert?

**Gebruik Live Server NIET meer!** De Node server serveert alle statische bestanden.

- Schakel Live Server uit in Cursor extensies
- Of gebruik alleen de Node server
- **Gebruik altijd `http://localhost:3000/week2.html`** (niet poort 5500!)

## 🔍 Server Status Controleren

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Welke poorten zijn in gebruik?
```bash
netstat -ano | findstr :3000
```

### Welke Node processen draaien?
```powershell
Get-Process -Name node
```

## 📝 Belangrijke Notities

- **Gebruik altijd poort 3000**: `http://localhost:3000/week2.html`
- **Niet via Live Server**: Live Server op poort 5500 werkt niet met de AI API
- **Automatisch opstarten**: De server start automatisch bij het openen van Cursor
- **Meerdere instanties voorkomen**: De server detecteert nu automatisch als poort 3000 al in gebruik is
