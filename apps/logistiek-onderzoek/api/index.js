/**
 * Vercel Serverless Handler voor App
 * 
 * Dit bestand fungeert als entry point voor Vercel serverless deployment.
 * Het importeert de Express app uit packages/core/api/index.js
 * 
 * Vercel verwacht dat serverless functions in een api/ directory staan
 * in de root van het project (of app root als root directory is ingesteld).
 */

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

try {
    // Importeer en exporteer de core API
    const coreApp = require(coreApiPath);
    console.log('[App API Handler] ✅ Core API loaded successfully');
    console.log('[App API Handler] Core app type:', typeof coreApp);
    module.exports = coreApp;
} catch (error) {
    console.error('[App API Handler] ❌ Error loading core API:', error);
    console.error('[App API Handler] Error stack:', error.stack);
    // Export een error handler zodat Vercel weet dat de functie bestaat
    module.exports = (req, res) => {
        console.error('[App API Handler] Error handler called');
        res.status(500).json({
            error: 'Serverless function initialization failed',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    };
}

