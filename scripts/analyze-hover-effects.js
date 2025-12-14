const fs = require('fs');
const path = require('path');

const hoverEffects = {
  buttons: new Set(),
  links: new Set(),
  cards: new Set(),
  inputs: new Set(),
  navigation: new Set(),
  badges: new Set(),
  other: new Set(),
};

function extractHoverClasses(content, filePath) {
  const hoverRegex = /hover:[\w-]+/g;
  const matches = content.match(hoverRegex);
  
  if (!matches) return;
  
  matches.forEach(match => {
    const hoverClass = match.replace('hover:', '');
    
    if (filePath.includes('button')) {
      hoverEffects.buttons.add(match);
    } else if (filePath.includes('input') || filePath.includes('textarea') || filePath.includes('select')) {
      hoverEffects.inputs.add(match);
    } else if (filePath.includes('card')) {
      hoverEffects.cards.add(match);
    } else if (filePath.includes('badge')) {
      hoverEffects.badges.add(match);
    } else if (filePath.includes('nav') || filePath.includes('header') || filePath.includes('footer')) {
      hoverEffects.navigation.add(match);
    } else if (content.includes('<a ') || content.includes('Link') || content.includes('href=')) {
      hoverEffects.links.add(match);
    } else {
      hoverEffects.other.add(match);
    }
  });
}

function scanDirectory(dir, baseDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      scanDirectory(fullPath, baseDir);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        extractHoverClasses(content, relativePath);
      } catch (err) {
        // Skip files that can't be read
      }
    }
  });
}

// Scan Next.js codebase
const nextJsDir = path.join(__dirname, '../../Advocatekhoj_Design');
if (fs.existsSync(nextJsDir)) {
  scanDirectory(nextJsDir, nextJsDir);
  
  // Generate report
  const report = {
    buttons: Array.from(hoverEffects.buttons).sort(),
    links: Array.from(hoverEffects.links).sort(),
    cards: Array.from(hoverEffects.cards).sort(),
    inputs: Array.from(hoverEffects.inputs).sort(),
    navigation: Array.from(hoverEffects.navigation).sort(),
    badges: Array.from(hoverEffects.badges).sort(),
    other: Array.from(hoverEffects.other).sort(),
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'hover-effects-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('Hover Effects Analysis Complete!');
  console.log('\n=== BUTTONS ===');
  report.buttons.forEach(h => console.log(`  ${h}`));
  console.log('\n=== LINKS ===');
  report.links.forEach(h => console.log(`  ${h}`));
  console.log('\n=== CARDS ===');
  report.cards.forEach(h => console.log(`  ${h}`));
  console.log('\n=== INPUTS ===');
  report.inputs.forEach(h => console.log(`  ${h}`));
  console.log('\n=== NAVIGATION ===');
  report.navigation.forEach(h => console.log(`  ${h}`));
  console.log('\n=== BADGES ===');
  report.badges.forEach(h => console.log(`  ${h}`));
  console.log('\n=== OTHER ===');
  report.other.forEach(h => console.log(`  ${h}`));
  
  console.log(`\n\nFull report saved to: hover-effects-report.json`);
} else {
  console.error('Next.js directory not found:', nextJsDir);
}

