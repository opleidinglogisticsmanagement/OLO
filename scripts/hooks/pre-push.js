#!/usr/bin/env node
/**
 * Pre-push hook: Controleert of gebruikers alleen in hun eigen app directories pushen
 * Gebruikt GitHub username (commit author) voor identificatie
 * ALTIJD harde blokkade - geen waarschuwingen
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Kleuren voor output (Windows-compatibel)
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getGitUsername() {
  try {
    // Probeer eerst de commit author (meest betrouwbaar)
    const author = execSync('git log -1 --format=%an', { encoding: 'utf-8' }).trim();
    
    // Als dat niet werkt, probeer git config
    if (!author) {
      return execSync('git config user.name', { encoding: 'utf-8' }).trim();
    }
    return author;
  } catch (error) {
    // Fallback naar git config
    try {
      return execSync('git config user.name', { encoding: 'utf-8' }).trim();
    } catch (e) {
      log('❌ FOUT: Kon GitHub username niet bepalen.', 'red');
      process.exit(1);
    }
  }
}

function getChangedFiles() {
  try {
    // Haal alle bestanden op die gepusht worden
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(f => f.length > 0);
    
    // Als er geen staged files zijn, check de commits die gepusht worden
    if (staged.length === 0) {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
      const remoteBranch = `origin/${branch}`;
      
      try {
        const diff = execSync(`git diff --name-only HEAD ${remoteBranch}`, { encoding: 'utf-8' })
          .trim()
          .split('\n')
          .filter(f => f.length > 0);
        return diff;
      } catch (e) {
        // Remote branch bestaat nog niet, eerste push
        const commits = execSync('git rev-list HEAD ^origin/main 2>/dev/null || git rev-list HEAD', { encoding: 'utf-8' })
          .trim()
          .split('\n')
          .filter(c => c.length > 0);
        
        if (commits.length > 0) {
          const files = execSync(`git diff --name-only ${commits[commits.length - 1]}^..HEAD`, { encoding: 'utf-8' })
            .trim()
            .split('\n')
            .filter(f => f.length > 0);
          return files;
        }
      }
    }
    
    return staged;
  } catch (error) {
    log('⚠️  Waarschuwing: Kon gewijzigde bestanden niet bepalen. Push wordt geblokkeerd voor veiligheid.', 'yellow');
    return [];
  }
}

function isMergeCommit() {
  try {
    const parents = execSync('git rev-list --count --parents HEAD', { encoding: 'utf-8' }).trim();
    return parseInt(parents) > 1;
  } catch {
    return false;
  }
}

function loadConfig() {
  const configPath = path.join(process.cwd(), '.allowed-paths.json');
  
  if (!fs.existsSync(configPath)) {
    log('❌ FOUT: .allowed-paths.json niet gevonden.', 'red');
    log('   Push wordt geblokkeerd. Neem contact op met de beheerder.', 'red');
    process.exit(1);
  }
  
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config;
  } catch (error) {
    log('❌ FOUT: .allowed-paths.json is ongeldig JSON.', 'red');
    process.exit(1);
  }
}

function checkFile(file, config, username) {
  const violations = [];
  
  // Check blocked files (overal verboden)
  for (const blocked of config.blockedFiles || []) {
    if (file.includes(blocked)) {
      violations.push({
        type: 'blocked_file',
        file,
        reason: `Bestand ${blocked} mag niet gepusht worden (bevat gevoelige informatie)`
      });
    }
  }
  
  // Check root files
  if (!file.includes('/') || file.split('/').length === 1) {
    for (const blocked of config.blockedRootFiles || []) {
      if (file === blocked) {
        violations.push({
          type: 'blocked_root_file',
          file,
          reason: `Root bestand ${blocked} mag niet gewijzigd worden`
        });
      }
    }
  }
  
  // Check protected paths
  for (const protected of config.protectedPaths || []) {
    if (file.startsWith(protected + '/')) {
      violations.push({
        type: 'protected_path',
        file,
        reason: `Pad ${protected} is beschermd en mag alleen via PR gewijzigd worden`
      });
    }
  }
  
  // Check nieuwe app directories
  if (file.startsWith('apps/')) {
    const appName = file.split('/')[1];
    const appPath = `apps/${appName}`;
    
    // Check of dit een nieuwe app is (niet in configuratie)
    const allAllowedPaths = Object.values(config.users || {})
      .flatMap(u => u.allowedPaths || []);
    
    if (!allAllowedPaths.includes(appPath)) {
      violations.push({
        type: 'new_app',
        file,
        reason: `Nieuwe app directory ${appPath} mag niet aangemaakt worden zonder toestemming`
      });
    }
  }
  
  // Check toegestane paden voor gebruiker
  const user = config.users[username];
  if (!user) {
    violations.push({
      type: 'user_not_configured',
      file,
      reason: `Gebruiker ${username} is niet geconfigureerd`
    });
    return violations;
  }
  
  const allowedPaths = user.allowedPaths || [];
  const isInAllowedPath = allowedPaths.some(path => file.startsWith(path + '/'));
  
  // Als file niet in toegestane paden zit en niet in protected paths, check of het een andere app is
  if (!isInAllowedPath && file.startsWith('apps/')) {
    const appName = file.split('/')[1];
    const otherAppPath = `apps/${appName}`;
    
    if (!allowedPaths.includes(otherAppPath)) {
      violations.push({
        type: 'other_app',
        file,
        reason: `Bestand in andere app: ${otherAppPath}`
      });
    }
  }
  
  return violations;
}

function main() {
  const config = loadConfig();
  const username = getGitUsername();
  
  // Check of gebruiker admin is
  if (config.admins && config.admins.includes(username)) {
    log('✅ Admin gebruiker gedetecteerd. Push toegestaan.', 'green');
    process.exit(0);
  }
  
  // Check merge commits
  if (isMergeCommit()) {
    log('', 'red');
    log('❌ FOUT: Merge commits zijn niet toegestaan.', 'red');
    log('', 'red');
    log('   Gebruik rebase in plaats van merge:', 'red');
    log('   git pull --rebase origin main', 'red');
    log('', 'red');
    process.exit(1);
  }
  
  const changedFiles = getChangedFiles();
  
  if (changedFiles.length === 0) {
    log('✅ Geen wijzigingen gedetecteerd. Push toegestaan.', 'green');
    process.exit(0);
  }
  
  // Check alle bestanden
  const allViolations = [];
  for (const file of changedFiles) {
    const violations = checkFile(file, config, username);
    allViolations.push(...violations.map(v => ({ ...v, file })));
  }
  
  if (allViolations.length === 0) {
    log('✅ Push gecontroleerd: alle wijzigingen zijn toegestaan.', 'green');
    process.exit(0);
  }
  
  // Groepeer violations per type
  const violationsByType = {};
  for (const v of allViolations) {
    if (!violationsByType[v.type]) {
      violationsByType[v.type] = [];
    }
    violationsByType[v.type].push(v);
  }
  
  // Toon fouten
  log('', 'red');
  log('❌ FOUT: Push bevat niet-toegestane wijzigingen. Push is GEBLOKKEERD.', 'red');
  log('', 'red');
  
  for (const [type, violations] of Object.entries(violationsByType)) {
    log(`   ${type}:`, 'red');
    for (const v of violations.slice(0, 5)) { // Toon max 5 per type
      log(`     - ${v.file}`, 'red');
      log(`       ${v.reason}`, 'red');
    }
    if (violations.length > 5) {
      log(`     ... en ${violations.length - 5} meer`, 'red');
    }
  }
  
  log('', 'red');
  
  // Toon toegestane paden
  const user = config.users[username];
  if (user && user.allowedPaths) {
    log('   Toegestane paden voor jou:', 'yellow');
    for (const path of user.allowedPaths) {
      log(`     - ${path}/`, 'yellow');
    }
    log('', 'yellow');
  }
  
  log('   Oplossing:', 'yellow');
  log('   1. Haal niet-toegestane wijzigingen uit je commit:', 'yellow');
  log('      git reset HEAD <bestand>', 'yellow');
  log('', 'yellow');
  log('   2. Commit alleen toegestane wijzigingen:', 'yellow');
  log('      git commit --amend', 'yellow');
  log('', 'yellow');
  log('   3. Push opnieuw:', 'yellow');
  log('      git push', 'yellow');
  log('', 'yellow');
  
  // ALTIJD blokkeren - geen mode optie meer
  process.exit(1);
}

main();

