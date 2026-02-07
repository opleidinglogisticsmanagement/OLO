# Vercel Setup Guide voor Nieuwe Apps

## Waarom Vercel de nieuwe apps niet ziet

**Vercel detecteert monorepo apps NIET automatisch.** Elke app moet handmatig als apart Vercel project worden toegevoegd.

## Stap-voor-stap instructies

### App 1: E-Learning Demo

1. **Ga naar Vercel Dashboard:**
   - Open https://vercel.com/dashboard
   - Klik op **Add New** → **Project**

2. **Import Repository:**
   - Selecteer je GitHub repository (dezelfde als logistiek-onderzoek)
   - **Project Name:** `e-learning-demo` (of "E-Learning Demo")
   - **Framework Preset:** Other (of leeg laten)

3. **⚠️ BELANGRIJK: Root Directory instellen:**
   - Klik op **Edit** naast **Root Directory**
   - Vul in: `apps/e-learning-demo`
   - Dit vertelt Vercel waar de app begint in de monorepo
   - **Zonder deze instelling werkt de deployment niet!**

4. **Build Settings:**
   - **Build Command:** Laat leeg (of `npm install`)
   - **Output Directory:** Laat leeg (of `.`)
   - Vercel gebruikt automatisch `apps/e-learning-demo/vercel.json`

5. **Environment Variables:**
   - Ga naar **Settings** → **Environment Variables**
   - Voeg toe: `DEEPSEEK_API_KEY` en `AI_PROVIDER=deepseek` (aanbevolen)
   - Of voeg toe: `GEMINI_API_KEY` (alternatief, als je Gemini wilt gebruiken)
   - Selecteer alle environments (Production, Preview, Development)

6. **Deploy:**
   - Klik op **Deploy**
   - Wacht tot de build klaar is
   - Test de live URL

### App 2: Operations Management

Herhaal dezelfde stappen, maar gebruik:
- **Project Name:** `operations-management` (of "Operations Management")
- **Root Directory:** `apps/operations-management`
- **Environment Variables:** Zelfde `GEMINI_API_KEY`

## Verificatie

Na het toevoegen van beide projecten zou je in Vercel moeten zien:
- ✅ `logistiek-onderzoek` (bestaand)
- ✅ `e-learning-demo` (nieuw)
- ✅ `operations-management` (nieuw)

Elke app krijgt zijn eigen:
- URL (bijv. `e-learning-demo.vercel.app`)
- Deployment geschiedenis
- Environment variables
- Build logs

## Belangrijke notities

1. **Elke app = apart Vercel project**
   - Je kunt niet één Vercel project gebruiken voor meerdere apps
   - Elke app heeft zijn eigen `vercel.json` in `apps/[app-naam]/`

2. **Root Directory is cruciaal**
   - Zonder correcte Root Directory werkt de deployment niet
   - Vercel moet weten waar de app begint in de monorepo

3. **includeFiles pattern**
   - De `vercel.json` in elke app gebruikt `../**/*` om omhoog te gaan naar monorepo root
   - Dit zorgt ervoor dat `packages/core` en `game` worden meegenomen

4. **Environment Variables**
   - Elke app heeft dezelfde `GEMINI_API_KEY` nodig
   - Je kunt deze per project instellen of via Vercel Teams delen

## Troubleshooting

**Probleem:** Vercel ziet de app nog steeds niet na toevoegen
- **Oplossing:** Controleer of de Root Directory correct is ingesteld (`apps/[app-naam]`)
- **Oplossing:** Controleer of `vercel.json` bestaat in `apps/[app-naam]/`

**Probleem:** Build faalt met "Cannot find module"
- **Oplossing:** Controleer of `includeFiles` in `vercel.json` correct is (`../**/*`)
- **Oplossing:** Controleer of `packages/core` bestaat in de monorepo root

**Probleem:** App laadt niet correct
- **Oplossing:** Controleer of `api/index.js` bestaat in `apps/[app-naam]/api/`
- **Oplossing:** Controleer build logs in Vercel dashboard voor specifieke errors

