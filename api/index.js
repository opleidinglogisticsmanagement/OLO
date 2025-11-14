/**
 * Vercel Serverless Handler
 * 
 * Dit bestand fungeert als entry point voor Vercel serverless deployment.
 * Het importeert de Express app uit server.js en exporteert deze als handler.
 */

// Zet VERCEL environment variable zodat server.js weet dat het op Vercel draait
process.env.VERCEL = '1';

// Op Vercel is de working directory /var/task/, maar de bestanden staan in de root
// We moeten het pad aanpassen naar waar de bestanden daadwerkelijk zijn
const path = require('path');
const fs = require('fs');

// Probeer verschillende paden om de root directory te vinden
// Op Vercel serverless worden alle bestanden in /var/task/ geplaatst
const possibleRoots = [
    '/var/task', // Vercel default - waar alle bestanden zijn (probeer dit eerst!)
    path.join(__dirname, '..'), // Parent van api/ (waar server.js staat)
    process.cwd(), // Current working directory
];

let rootDir = null;

// Zoek waar index.html daadwerkelijk staat
for (const possibleRoot of possibleRoots) {
    const testFile = path.join(possibleRoot, 'index.html');
    if (fs.existsSync(testFile)) {
        rootDir = possibleRoot;
        console.log(`✅ Found root directory: ${rootDir}`);
        break;
    }
}

// Fallback naar /var/task als niets gevonden wordt (Vercel standaard)
if (!rootDir) {
    rootDir = '/var/task';
    console.log(`⚠️  No root directory found, using default: ${rootDir}`);
}

// Zet environment variable zodat server.js het kan gebruiken
process.env.VERCEL_ROOT_DIR = rootDir;

const app = require('../server.js');

module.exports = app;

