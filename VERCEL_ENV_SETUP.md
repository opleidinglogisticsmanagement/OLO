# Vercel Environment Variables Setup

## Probleem
Je krijgt de foutmelding: `GEMINI_API_KEY is not set in server environment` of `GEMINI_API_KEY is not set in environment variables`

Dit gebeurt omdat de environment variable niet is ingesteld in je Vercel project.

## Oplossing

### Stap 1: Ga naar Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Log in met je account
3. Selecteer je project (oloelearning)

### Stap 2: Voeg Environment Variable toe
1. Klik op **Settings** in de project navigatie
2. Klik op **Environment Variables** in het linker menu
3. Klik op **Add New** knop
4. Vul in:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Je Google Gemini API key (dezelfde als in je lokale `.env` file)
   - **Environments:** Selecteer alle drie (Production, Preview, Development)
5. Klik op **Save**

### Stap 3: Redeploy
Na het toevoegen van de environment variable moet je de applicatie opnieuw deployen:

**Optie A: Via Dashboard**
1. Ga naar de **Deployments** tab
2. Klik op de drie puntjes (⋯) bij de laatste deployment
3. Kies **Redeploy**
4. Wacht tot de deployment klaar is

**Optie B: Via Git**
1. Maak een kleine wijziging (bijv. een lege commit of comment)
2. Push naar je repository
3. Vercel deployt automatisch

### Stap 4: Test
1. Ga naar je Vercel URL
2. Test de MC-vragen generator
3. Test de AI Bouwsteen Generator
4. Beide zouden nu moeten werken!

## Waar vind ik mijn API key?

Je API key staat in je lokale `.env` file. Open het bestand en kopieer de waarde na het `=` teken.

Bijvoorbeeld, als je `.env` file bevat:
```
GEMINI_API_KEY=je_api_key_hier
```

Kopieer alleen `je_api_key_hier` (zonder `GEMINI_API_KEY=`) en plak deze in het Vercel dashboard.

## Belangrijk

- ⚠️ De `.env` file wordt **niet** automatisch geüpload naar Vercel (veiligheid)
- ✅ Environment variables moeten altijd handmatig worden ingesteld in het Vercel dashboard
- 🔄 Na het toevoegen van een nieuwe environment variable is een **redeploy** verplicht
- 🌍 Zorg ervoor dat de variable beschikbaar is voor **alle environments** (Production, Preview, Development)

## Hulp nodig?

Als het na deze stappen nog steeds niet werkt:
1. Controleer of de variable naam exact is: `GEMINI_API_KEY` (hoofdletters, underscores)
2. Controleer of de API key geldig is (test lokaal met `npm start`)
3. Controleer de Vercel deployment logs voor meer details

