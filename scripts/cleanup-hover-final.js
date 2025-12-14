const fs = require('fs');
const path = require('path');

function cleanupHover(content, filePath) {
  let modified = false;
  
  // 1. Remove duplicate hover:text-white and transition-colors
  content = content.replace(/hover:text-white\s+hover:text-white/g, 'hover:text-white');
  content = content.replace(/transition-colors\s+transition-colors/g, 'transition-colors');
  content = content.replace(/transition-colors\s+duration-200\s+transition-colors/g, 'transition-colors duration-200');
  content = content.replace(/hover:text-white\s+transition-colors\s+text-sm\s+hover:text-white\s+transition-colors\s+duration-200/g, 'hover:text-white transition-colors duration-200 text-sm');
  
  // 2. Remove hover:opacity-85 from footer links (they should only have hover:text-white)
  content = content.replace(
    /(<a[^>]*?class="[^"]*?text-white\/90[^"]*?)hover:opacity-85[^"]*(")/g,
    (match, before, after) => {
      modified = true;
      return before + after;
    }
  );
  
  // 3. Remove hover from footer element itself
  content = content.replace(
    /(<footer[^>]*?class="[^"]*?)hover:[^"]*(")/g,
    (match, before, after) => {
      modified = true;
      return before + after;
    }
  );
  
  // 4. Remove duplicate hover classes from buttons
  content = content.replace(/hover:bg-\[#c26a36\]\s+hover:bg-\[#f17313\]/g, 'hover:bg-[#f17313]');
  content = content.replace(/hover:bg-\[#d67c40\]\s+hover:bg-\[#c26a36\]/g, 'hover:bg-[#c26a36]');
  
  // 5. Clean up duplicate transition classes
  content = content.replace(/transition-opacity\s+transition-opacity/g, 'transition-opacity');
  content = content.replace(/transition-all\s+transition-all/g, 'transition-all');
  content = content.replace(/transition-shadow\s+transition-shadow/g, 'transition-shadow');
  
  // 6. Remove hover:opacity-85 from social media links in footer (keep only hover:text-white)
  content = content.replace(
    /(<a[^>]*?class="[^"]*?flex items-center gap-2[^"]*?text-white\/90[^"]*?)hover:opacity-85[^"]*(")/g,
    (match, before, after) => {
      modified = true;
      return before + after;
    }
  );
  
  // 7. Remove hover from static partner cards (unless they're links)
  content = content.replace(
    /(<div[^>]*?class="[^"]*?bg-white[^"]*?rounded-lg[^"]*?p-6[^"]*?)hover:shadow-lg[^"]*(")/g,
    (match, before, after) => {
      // Only remove if it's not a link container
      if (!match.includes('href=') && !match.includes('<a')) {
        modified = true;
        return before + after;
      }
      return match;
    }
  );
  
  return { content, modified };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: newContent, modified } = cleanupHover(content, filePath);
    
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
    return false;
  }
}

function processDirectory(dir, baseDir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'scripts') {
      count += processDirectory(fullPath, baseDir);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      if (processFile(fullPath)) {
        console.log(`Updated: ${path.relative(baseDir, fullPath)}`);
        count++;
      }
    }
  });
  
  return count;
}

// Start processing
const rootDir = path.join(__dirname, '..');
const count = processDirectory(rootDir, rootDir);
console.log(`\nTotal files updated: ${count}`);
