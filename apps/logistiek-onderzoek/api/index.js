/**
 * Vercel Serverless Handler voor App
 * 
 * CRITICAL: Deze functie MOET altijd werken, zelfs als dependencies falen.
 * Als deze functie crasht tijdens module loading, serveert Vercel de source code.
 */

// Exporteer EERST een minimale handler functie die altijd werkt
// Dit voorkomt dat Vercel de source code serveert als er een error is tijdens loading
module.exports = function handler(req, res) {
    // Log onmiddellijk om te bevestigen dat de functie wordt uitgevoerd
    console.log('[App API Handler] ✅ Handler function is being executed!');
    console.log('[App API Handler] Request:', req.method, req.path);
    console.log('[App API Handler] Timestamp:', new Date().toISOString());
    
    // Zet environment variables (binnen de handler, niet tijdens module loading)
    process.env.VERCEL = '1';
    process.env.APP_DIR = process.env.APP_DIR || process.cwd();
    
    // Laad dependencies en core API binnen de handler (lazy loading)
    // Dit voorkomt crashes tijdens module loading
    try {
        const path = require('path');
        const fs = require('fs');
        
        // Bepaal het pad naar de core API
        const coreApiPath = path.resolve(__dirname, '../../packages/core/api/index.js');
        
        console.log('[App API Handler] Loading core API from:', coreApiPath);
        console.log('[App API Handler] File exists:', fs.existsSync(coreApiPath));
        console.log('[App API Handler] __dirname:', __dirname);
        console.log('[App API Handler] process.cwd():', process.cwd());
        
        // Laad de core API
        const coreApp = require(coreApiPath);
        
        console.log('[App API Handler] ✅ Core API loaded successfully');
        console.log('[App API Handler] Core app type:', typeof coreApp);
        
        // De Express app handelt de request af
        coreApp(req, res);
    } catch (error) {
        console.error('[App API Handler] ❌ Error:', error.message);
        console.error('[App API Handler] Error stack:', error.stack);
        
        // Geef een error response
        res.status(500).json({
            error: 'Serverless function error',
            message: error.message,
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString(),
            __dirname: __dirname,
            cwd: process.cwd()
        });
    }
};

