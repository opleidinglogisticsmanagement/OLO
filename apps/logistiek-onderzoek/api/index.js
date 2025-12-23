/**
 * Vercel Serverless Handler voor App
 * 
 * Dit bestand fungeert als entry point voor Vercel serverless deployment.
 * Het importeert de Express app uit packages/core/api/index.js
 * 
 * Vercel verwacht dat serverless functions in een api/ directory staan
 * in de root van het project (of app root als root directory is ingesteld).
 */

// CRITICAL: Log onmiddellijk om te bevestigen dat de functie wordt uitgevoerd
console.log('=== [App API Handler] Function is being executed ===');
console.log('[App API Handler] Timestamp:', new Date().toISOString());
console.log('[App API Handler] Node version:', process.version);
console.log('[App API Handler] __filename:', __filename);
console.log('[App API Handler] __dirname:', __dirname);

// Zet VERCEL environment variable
process.env.VERCEL = '1';

// Stel de APP_DIR in voor de server.js om de juiste app-specifieke bestanden te vinden
// Dit pad is relatief ten opzichte van de monorepo root, die Vercel als /var/task ziet
// Aangezien de Root Directory van het Vercel project apps/logistiek-onderzoek is,
// is de appDir de root van de Vercel deployment.
process.env.APP_DIR = process.cwd(); // Dit is /var/task/ in Vercel, wat de app root is.

// Importeer de core API handler
// Deze staat in packages/core/api/index.js
// We gebruiken een relatief pad dat werkt vanuit de app directory
const path = require('path');

// Bepaal het pad naar de core API
// Vanuit apps/logistiek-onderzoek/api/index.js naar packages/core/api/index.js
const coreApiPath = path.resolve(__dirname, '../../packages/core/api/index.js');

// Debug logging
console.log('[App API Handler] Loading core API from:', coreApiPath);
console.log('[App API Handler] __dirname:', __dirname);
console.log('[App API Handler] process.cwd():', process.cwd());
console.log('[App API Handler] APP_DIR:', process.env.APP_DIR);

// Vercel serverless functions moeten een handler functie exporteren
// Express apps worden automatisch geconverteerd naar handlers door Vercel
// BELANGRIJK: We moeten de export SYNCHROON doen, niet in een try-catch
// omdat Vercel de functie moet kunnen laden voordat het kan worden uitgevoerd

let coreApp;

try {
    console.log('[App API Handler] Attempting to require core API...');
    console.log('[App API Handler] coreApiPath exists:', require('fs').existsSync(coreApiPath));
    
    // Importeer de core API (dit is een Express app)
    coreApp = require(coreApiPath);
    console.log('[App API Handler] ✅ Core API loaded successfully');
    console.log('[App API Handler] Core app type:', typeof coreApp);
    console.log('[App API Handler] Core app has listen method:', typeof coreApp.listen === 'function');
} catch (error) {
    console.error('[App API Handler] ❌ Error loading core API:', error);
    console.error('[App API Handler] Error message:', error.message);
    console.error('[App API Handler] Error stack:', error.stack);
    
    // Export een error handler zodat Vercel weet dat de functie bestaat
    // Dit voorkomt dat Vercel de source code serveert
    coreApp = (req, res) => {
        console.error('[App API Handler] Error handler called for:', req.method, req.path);
        res.status(500).json({
            error: 'Serverless function initialization failed',
            message: error.message,
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        });
    };
}

// Export de app/handler - dit MOET altijd gebeuren, ook bij errors
// Vercel herkent een functie export als een serverless functie
console.log('[App API Handler] Exporting handler, type:', typeof coreApp);
module.exports = coreApp;

