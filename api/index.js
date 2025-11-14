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

// Debug: log welke bestanden beschikbaar zijn
console.log('=== Vercel Environment Debug ===');
console.log(`__dirname: ${__dirname}`);
console.log(`process.cwd(): ${process.cwd()}`);
console.log(`rootDir: ${rootDir}`);

// Probeer te zien welke bestanden beschikbaar zijn
try {
    const files = fs.readdirSync(rootDir);
    console.log(`Files in rootDir (first 30):`, files.slice(0, 30));
    const htmlFiles = files.filter(f => f.endsWith('.html'));
    console.log(`HTML files found:`, htmlFiles);
} catch (e) {
    console.error(`Cannot read rootDir:`, e.message);
}

// Probeer ook /var/task
try {
    const varTaskFiles = fs.readdirSync('/var/task');
    console.log(`Files in /var/task (first 30):`, varTaskFiles.slice(0, 30));
} catch (e) {
    console.log(`Cannot read /var/task:`, e.message);
}

// Pre-load HTML files into memory so they're available in serverless environment
const htmlFiles = {};
const htmlFileNames = ['index.html', 'week1.html', 'week2.html', 'week3.html', 'week4.html', 'week5.html', 'week6.html', 'week7.html', 'instructies.html', 'afsluiting.html'];

console.log('=== Pre-loading HTML files ===');
for (const fileName of htmlFileNames) {
    const filePath = path.join(rootDir, fileName);
    try {
        if (fs.existsSync(filePath)) {
            htmlFiles[fileName] = fs.readFileSync(filePath, 'utf8');
            console.log(`✅ Loaded: ${fileName}`);
        } else {
            console.log(`⚠️  Not found: ${filePath}`);
        }
    } catch (e) {
        console.error(`❌ Error loading ${fileName}:`, e.message);
    }
}

// Make HTML files available to server.js
process.env.HTML_FILES_LOADED = Object.keys(htmlFiles).length.toString();
global.htmlFilesCache = htmlFiles;

const app = require('../server.js');

module.exports = app;

