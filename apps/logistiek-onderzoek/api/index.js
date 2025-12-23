/**
 * Vercel Serverless Handler voor App
 * 
 * CRITICAL: Deze functie MOET altijd werken, zelfs als dependencies falen.
 * Als deze functie crasht tijdens module loading, serveert Vercel de source code.
 */

// BELANGRIJK: Vercel herkent functies automatisch in de api/ directory
// Maar als de functie crasht tijdens loading, serveert Vercel de source code
// We moeten ervoor zorgen dat module.exports altijd wordt bereikt

// Test: Minimale functie zonder dependencies
// Als deze werkt, kunnen we de core API toevoegen
module.exports = (req, res) => {
    // Log onmiddellijk om te bevestigen dat de functie wordt uitgevoerd
    console.log('=== [App API Handler] Handler function is being executed! ===');
    console.log('[App API Handler] Request:', req.method, req.path);
    console.log('[App API Handler] Timestamp:', new Date().toISOString());
    console.log('[App API Handler] __dirname:', __dirname);
    console.log('[App API Handler] process.cwd():', process.cwd());
    
    // Test: Geef een simpele response om te bevestigen dat de functie werkt
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        success: true,
        message: 'Serverless function is working!',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
        __dirname: __dirname,
        cwd: process.cwd()
    });
};

