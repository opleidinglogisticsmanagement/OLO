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
const monorepoRoot = path.resolve(__dirname, '../..');
const appsDir = path.join(monorepoRoot, 'apps');

// Detecteer beschikbare apps
const apps = fs.existsSync(appsDir)
    ? fs.readdirSync(appsDir).filter(f => {
          const fullPath = path.join(appsDir, f);
          return fs.statSync(fullPath).isDirectory() && 
                 fs.existsSync(path.join(fullPath, 'index.html'));
      })
    : [];

if (apps.length === 0) {
    console.error('❌ Geen apps gevonden');
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

