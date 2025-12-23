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

// Monorepo structuur: bepaal directories
// api/index.js staat in packages/core/api/
// BELANGRIJK: In Vercel met Root Directory "apps/logistiek-onderzoek":
// - __dirname = /var/task/packages/core/api
// - monorepoRoot moet /var/task zijn (niet /var/task/packages)
const coreDir = path.resolve(__dirname, '..'); // packages/core = /var/task/packages/core
// monorepoRoot is 3 levels omhoog van packages/core/api (niet 2!)
const monorepoRoot = path.resolve(__dirname, '../../..'); // 3 levels omhoog = /var/task

// BELANGRIJK: In Vercel met Root Directory "apps/logistiek-onderzoek":
// - /var/task = app directory (waar index.html staat)
// - /var/task/packages/core = core directory
// - appDir moet /var/task zijn, NIET /var/task/apps/logistiek-onderzoek
let appDir = process.env.APP_DIR;
if (!appDir) {
    // Probeer eerst /var/task (Vercel default met Root Directory)
    if (fs.existsSync('/var/task/index.html')) {
        appDir = '/var/task';
    } else if (fs.existsSync(path.join(monorepoRoot, 'index.html'))) {
        appDir = monorepoRoot;
    } else {
        // Fallback: probeer apps/logistiek-onderzoek (lokale development)
        appDir = path.join(monorepoRoot, 'apps', 'logistiek-onderzoek');
    }
}

// BELANGRIJK: In Vercel met Root Directory "apps/logistiek-onderzoek":
// - /var/task = app directory (waar index.html staat)
// - rootDir moet /var/task zijn (niet /var/task/apps/logistiek-onderzoek)
let rootDir = null;

// Probeer verschillende paden om de root directory te vinden
// Op Vercel serverless worden alle bestanden in /var/task/ geplaatst
const possibleRoots = [
    '/var/task', // Vercel default - waar alle bestanden zijn (probeer dit eerst!)
    appDir, // App directory (al berekend hierboven)
    monorepoRoot, // Monorepo root
    process.cwd(), // Current working directory
];

// Zoek waar index.html daadwerkelijk staat (in app directory)
for (const possibleRoot of possibleRoots) {
    const testFile = path.join(possibleRoot, 'index.html');
    if (fs.existsSync(testFile)) {
        rootDir = possibleRoot;
        console.log(`✅ Found root directory: ${rootDir}`);
        break;
    }
}

// Fallback: gebruik appDir als rootDir
if (!rootDir) {
    rootDir = appDir || '/var/task';
    console.log(`⚠️  No root directory found, using appDir: ${rootDir}`);
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
// HTML bestanden staan in app directory
const htmlFiles = {};
const htmlFileNames = ['index.html', 'week1.html', 'week2.html', 'week3.html', 'week4.html', 'week5.html', 'week6.html', 'week7.html', 'instructies.html', 'afsluiting.html'];

console.log('=== Pre-loading HTML files ===');
console.log(`[Monorepo] App directory: ${appDir}`);
console.log(`[Monorepo] Root directory: ${rootDir}`);
for (const fileName of htmlFileNames) {
    // Probeer eerst app directory, dan root directory
    let filePath = path.join(appDir, fileName);
    if (!fs.existsSync(filePath)) {
        filePath = path.join(rootDir, fileName);
    }
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

