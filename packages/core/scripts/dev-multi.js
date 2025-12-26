/**
 * Development script voor multi-app mode
 * Start alle apps op één server via subdirectories
 * 
 * Gebruik: node scripts/dev-multi.js
 */

const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Bepaal paden
const coreDir = path.resolve(__dirname, '..');
// Script staat in packages/core/scripts/, dus 2 levels omhoog = monorepo root
const monorepoRoot = path.resolve(__dirname, '../..');
const appsDir = path.join(monorepoRoot, 'apps');

// Debug: log paden
console.log(`[Debug] Script directory: ${__dirname}`);
console.log(`[Debug] Core directory: ${coreDir}`);
console.log(`[Debug] Monorepo root: ${monorepoRoot}`);
console.log(`[Debug] Apps directory: ${appsDir}`);
console.log(`[Debug] Apps directory exists: ${fs.existsSync(appsDir)}`);

// Detecteer beschikbare apps
let apps = [];
if (fs.existsSync(appsDir)) {
    const dirs = fs.readdirSync(appsDir);
    console.log(`[Debug] Items in apps directory: ${dirs.join(', ')}`);
    
    apps = dirs.filter(f => {
        const fullPath = path.join(appsDir, f);
        const isDir = fs.statSync(fullPath).isDirectory();
        const hasIndex = fs.existsSync(path.join(fullPath, 'index.html'));
        console.log(`[Debug] ${f}: isDir=${isDir}, hasIndex=${hasIndex}`);
        return isDir && hasIndex;
    });
} else {
    console.error(`[Debug] Apps directory does not exist: ${appsDir}`);
}

if (apps.length === 0) {
    console.error('❌ Geen apps gevonden');
    console.error(`   Gezocht in: ${appsDir}`);
    if (fs.existsSync(monorepoRoot)) {
        console.error(`   Monorepo root bestaat: ${monorepoRoot}`);
        const rootContents = fs.readdirSync(monorepoRoot);
        console.error(`   Inhoud van root: ${rootContents.join(', ')}`);
    } else {
        console.error(`   Monorepo root bestaat niet: ${monorepoRoot}`);
    }
    process.exit(1);
}

// Zet environment variables voor multi-app mode
process.env.MULTI_APP = 'true';

console.log(`🚀 Starting multi-app development server`);
console.log(`📚 Gevonden apps: ${apps.join(', ')}`);
console.log(`\n💡 Apps beschikbaar op:`);
apps.forEach(app => {
    console.log(`   - http://localhost:3000/${app}/`);
});
console.log(`\n   Root: http://localhost:3000/ (app selector)\n`);

// Start nodemon
const nodemon = spawn('npx', ['nodemon', 'server.js'], {
    cwd: coreDir,
    stdio: 'inherit',
    shell: true,
    env: {
        ...process.env,
        MULTI_APP: 'true'
    }
});

nodemon.on('error', (err) => {
    console.error('❌ Fout bij starten van server:', err);
    process.exit(1);
});

nodemon.on('exit', (code) => {
    process.exit(code);
});

