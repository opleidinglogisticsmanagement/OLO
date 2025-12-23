/**
 * Vercel Serverless Handler voor App
 * 
 * CRITICAL: Deze functie MOET altijd werken, zelfs als dependencies falen.
 * Als deze functie crasht tijdens module loading, serveert Vercel de source code.
 */

// BELANGRIJK: Vercel herkent functies automatisch in de api/ directory
// Maar als de functie crasht tijdens loading, serveert Vercel de source code
// We moeten ervoor zorgen dat module.exports altijd wordt bereikt

// Lazy load de core API om te voorkomen dat crashes tijdens module loading
// de source code worden geserveerd
let coreApp = null;

function handler(req, res) {
    // Log onmiddellijk om te bevestigen dat de functie wordt uitgevoerd
    console.log('=== [App API Handler] Handler function is being executed! ===');
    console.log('[App API Handler] Request:', req.method, req.path);
    console.log('[App API Handler] Timestamp:', new Date().toISOString());
    console.log('[App API Handler] __dirname:', __dirname);
    console.log('[App API Handler] process.cwd():', process.cwd());
    
    // Lazy load de core API (eerste keer alleen)
    if (!coreApp) {
        try {
            console.log('[App API Handler] Loading core API...');
            const path = require('path');
            // Bepaal het pad naar packages/core/api/index.js
            // Vanuit apps/e-learning-demo/api/index.js naar packages/core/api/index.js
            const coreApiPath = path.resolve(__dirname, '../../../packages/core/api/index.js');
            console.log('[App API Handler] Core API path:', coreApiPath);
            coreApp = require(coreApiPath);
            console.log('[App API Handler] ✅ Core API loaded successfully');
        } catch (error) {
            console.error('[App API Handler] ❌ Error loading core API:', error);
            // Fallback: geef een error response
            res.status(500).json({
                success: false,
                error: 'Failed to load core API',
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
            return;
        }
    }
    
    // Gebruik de core API om de request af te handelen
    coreApp(req, res);
}

// Export als default
module.exports = handler;

