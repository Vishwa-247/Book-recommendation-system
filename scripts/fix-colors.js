// Script to fix all color references across all HTML files
// This replaces Tailwind color classes with exact hex values

const fs = require('fs');
const path = require('path');

const colorReplacements = [
  // Primary colors
  { from: /border-primary-dark/g, to: 'border-[#001944]' },
  { from: /text-primary-dark/g, to: 'text-[#001944]' },
  { from: /bg-primary-dark/g, to: 'bg-[#001944]' },
  { from: /border-primary\/20/g, to: 'border-[#001944]/20' },
  { from: /border-primary\/10/g, to: 'border-[#001944]/10' },
  { from: /border-primary\/80/g, to: 'border-[#001944]/80' },
  { from: /border-primary\/60/g, to: 'border-[#001944]/60' },
  
  // Primary main
  { from: /bg-primary(?![-\/])/g, to: 'bg-[#00377b]' },
  { from: /text-primary(?![-\/])/g, to: 'text-[#00377b]' },
  { from: /border-primary(?![-\/])/g, to: 'border-[#00377b]' },
  { from: /from-primary/g, to: 'from-[#00377b]' },
  { from: /to-primary/g, to: 'to-[#00377b]' },
  { from: /bg-primary\//g, to: 'bg-[#00377b]/' },
  { from: /text-primary\//g, to: 'text-[#00377b]/' },
  { from: /border-primary\//g, to: 'border-[#00377b]/' },
  { from: /ring-primary/g, to: 'ring-[#00377b]' },
  
  // Secondary colors
  { from: /bg-secondary(?![-\/])/g, to: 'bg-[#d67c40]' },
  { from: /text-secondary(?![-\/])/g, to: 'text-[#d67c40]' },
  { from: /border-secondary(?![-\/])/g, to: 'border-[#d67c40]' },
  { from: /bg-secondary-dark/g, to: 'bg-[#c26a36]' },
  { from: /hover:bg-secondary-dark/g, to: 'hover:bg-[#c26a36]' },
  { from: /bg-secondary\//g, to: 'bg-[#d67c40]/' },
  { from: /text-secondary\//g, to: 'text-[#d67c40]/' },
  { from: /border-secondary\//g, to: 'border-[#d67c40]/' },
  
  // Accent
  { from: /border-accent/g, to: 'border-[#f17313]' },
  { from: /text-accent/g, to: 'text-[#f17313]' },
  { from: /bg-accent/g, to: 'bg-[#f17313]' },
];

function fixColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  colorReplacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed colors in: ${filePath}`);
    return true;
  }
  return false;
}

function processDirectory(directoryPath) {
  let count = 0;
  fs.readdirSync(directoryPath, { withFileTypes: true }).forEach(dirent => {
    const fullPath = path.join(directoryPath, dirent.name);
    if (dirent.isDirectory()) {
      count += processDirectory(fullPath);
    } else if (dirent.isFile() && dirent.name.endsWith('.html')) {
      if (fixColorsInFile(fullPath)) {
        count++;
      }
    }
  });
  return count;
}

// Start processing from the converted_html directory
const rootDir = path.join(__dirname, '..');
const count = processDirectory(rootDir);
console.log(`\nTotal files updated: ${count}`);

