/**
 * Development script voor individuele apps
 * Gebruik: node scripts/dev-app.js <app-naam>
 * 
 * Voorbeeld: node scripts/dev-app.js e-learning-demo
 */

const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Haal app naam op uit command line argument
const appName = process.argv[2];

if (!appName) {
    console.error('❌ Geen app naam opgegeven');
    console.log('\nGebruik: node scripts/dev-app.js <app-naam>');
    console.log('\nBeschikbare apps:');
    
    const monorepoRoot = path.resolve(__dirname, '../..');
    const appsDir = path.join(monorepoRoot, 'apps');
    if (fs.existsSync(appsDir)) {
        const apps = fs.readdirSync(appsDir).filter(f => {
            const fullPath = path.join(appsDir, f);
            return fs.statSync(fullPath).isDirectory();
        });
        apps.forEach(app => console.log(`  - ${app}`));
    }
    process.exit(1);
}

// Bepaal paden
const monorepoRoot = path.resolve(__dirname, '../..');
const coreDir = path.resolve(__dirname, '..');
const appDir = path.join(monorepoRoot, 'apps', appName);

// Verifieer dat app bestaat
if (!fs.existsSync(appDir)) {
    console.error(`❌ App '${appName}' niet gevonden in ${appDir}`);
    process.exit(1);
}

if (!fs.existsSync(path.join(appDir, 'index.html'))) {
    console.error(`❌ App '${appName}' heeft geen index.html`);
    process.exit(1);
}

// Zet environment variables
process.env.APP_DIR = appDir;
process.env.MULTI_APP = 'false';

console.log(`🚀 Starting development server for app: ${appName}`);
console.log(`📁 App directory: ${appDir}`);
console.log(`\n💡 App beschikbaar op: http://localhost:3000/\n`);

// Start nodemon
const nodemon = spawn('npx', ['nodemon', 'server.js'], {
    cwd: coreDir,
    stdio: 'inherit',
    shell: true,
    env: {
        ...process.env,
        APP_DIR: appDir,
        MULTI_APP: 'false'
    }
});

nodemon.on('error', (err) => {
    console.error('❌ Fout bij starten van server:', err);
    process.exit(1);
});

nodemon.on('exit', (code) => {
    process.exit(code);
});

