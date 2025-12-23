/**
 * Vercel Serverless Handler voor App
 * 
 * Dit bestand fungeert als entry point voor Vercel serverless deployment.
 * Het importeert de Express app uit packages/core/api/index.js
 * 
 * Vercel verwacht dat serverless functions in een api/ directory staan
 * in de root van het project (of app root als root directory is ingesteld).
 */

// BELANGRIJK: Vercel moet een functie exporteren, niet alleen een Express app
// We maken een wrapper functie die altijd werkt, zelfs als de core API niet laadt

// Zet VERCEL environment variable
process.env.VERCEL = '1';

// Stel de APP_DIR in voor de server.js om de juiste app-specifieke bestanden te vinden
process.env.APP_DIR = process.cwd();

// Importeer dependencies
const path = require('path');
const fs = require('fs');

// Bepaal het pad naar de core API
const coreApiPath = path.resolve(__dirname, '../../packages/core/api/index.js');

// Laad de core API (lazy loading in de handler)
let coreApp = null;
let loadError = null;

function loadCoreApp() {
    if (coreApp !== null) {
        return coreApp; // Al geladen
    }
    
    if (loadError !== null) {
        throw loadError; // Al geprobeerd en gefaald
    }
    
    try {
        console.log('[App API Handler] Loading core API from:', coreApiPath);
        console.log('[App API Handler] File exists:', fs.existsSync(coreApiPath));
        coreApp = require(coreApiPath);
        console.log('[App API Handler] ✅ Core API loaded successfully');
        return coreApp;
    } catch (error) {
        loadError = error;
        console.error('[App API Handler] ❌ Error loading core API:', error.message);
        console.error('[App API Handler] Error stack:', error.stack);
        throw error;
    }
}

// Export een handler functie die Vercel kan uitvoeren
// Deze functie wordt aangeroepen voor elke request
module.exports = function handler(req, res) {
    console.log('[App API Handler] Handler called for:', req.method, req.path);
    console.log('[App API Handler] Timestamp:', new Date().toISOString());
    
    try {
        // Laad de core app (lazy loading)
        const app = loadCoreApp();
        
        // De Express app handelt de request af
        app(req, res);
    } catch (error) {
        console.error('[App API Handler] Error in handler:', error.message);
        res.status(500).json({
            error: 'Serverless function error',
            message: error.message,
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        });
    }
};

