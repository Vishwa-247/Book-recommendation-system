const fs = require('fs');
const path = require('path');

// Rules for hover effects based on Next.js analysis
const hoverRules = {
  // Remove hover from these elements
  removeFrom: [
    // Ad banners should NOT have hover
    { pattern: /(bg-gray-50.*border-dashed.*border-gray-300[^>]*?)hover:border-\[#00377b\]\/40[^"]*/g, replace: '$1' },
    { pattern: /(bg-gray-50.*border-dashed.*border-gray-300[^>]*?)hover:border-primary\/40[^"]*/g, replace: '$1' },
    { pattern: /(bg-gray-50.*border-dashed.*border-gray-300[^>]*?)transition-colors(?=\s|")/g, replace: '' },
    
    // Static text elements should NOT have hover
    { pattern: /(<p[^>]*?)hover:[^"]*(")/g, replace: '$1$2' },
    { pattern: /(<h[1-6][^>]*?)hover:[^"]*(")/g, replace: '$1$2' },
    { pattern: /(<span[^>]*?class="[^"]*?text-[^"]*?"[^>]*?)hover:[^"]*(")/g, replace: '$1$2' },
    
    // Form labels should NOT have hover
    { pattern: /(<label[^>]*?)hover:[^"]*(")/g, replace: '$1$2' },
    
    // Static badges (non-link) should NOT have hover
    { pattern: /(<span[^>]*?class="[^"]*?badge[^"]*?"[^>]*?)(?!.*href)([^>]*?)hover:[^"]*(")/g, replace: '$1$2$3' },
  ],
  
  // Ensure these have correct hover
  ensureOn: {
    // Buttons - primary
    primaryButton: {
      pattern: /class="([^"]*?bg-\[#00377b\][^"]*?)"/g,
      check: /hover:bg-\[#00377b\]\/90/,
      add: ' hover:bg-[#00377b]/90'
    },
    // Buttons - secondary
    secondaryButton: {
      pattern: /class="([^"]*?bg-\[#d67c40\][^"]*?)"/g,
      check: /hover:bg-\[#c26a36\]|hover:bg-\[#d67c40\]\/80/,
      add: ' hover:bg-[#c26a36]'
    },
    // Buttons - outline (should have accent hover)
    outlineButton: {
      pattern: /class="([^"]*?border[^"]*?bg-white[^"]*?shadow-xs[^"]*?)"/g,
      check: /hover:bg-\[#f17313\]|hover:bg-accent/,
      add: ' hover:bg-[#f17313] hover:text-white'
    },
    // Inputs should have hover:border-gray-400
    input: {
      pattern: /class="([^"]*?border-2[^"]*?border-gray-300[^"]*?)"/g,
      check: /hover:border-gray-400/,
      add: ' hover:border-gray-400'
    },
    // Footer links
    footerLink: {
      pattern: /class="([^"]*?text-white\/90[^"]*?)"/g,
      check: /hover:text-white/,
      add: ' hover:text-white'
    },
    // Navigation links (header)
    navLink: {
      pattern: /class="([^"]*?text-\[#001944\][^"]*?border-transparent[^"]*?)"/g,
      check: /hover:text-\[#00377b\]/,
      add: ' hover:text-[#00377b] hover:border-[#1453a3]/60'
    },
    // Logo link
    logoLink: {
      pattern: /class="([^"]*?flex items-center[^"]*?)"/g,
      check: /hover:opacity-85/,
      add: ' hover:opacity-85 transition-opacity'
    }
  }
};

function fixHoverEffects(content, filePath) {
  let modified = false;
  
  // Remove unwanted hover effects
  hoverRules.removeFrom.forEach(rule => {
    if (content.match(rule.pattern)) {
      content = content.replace(rule.pattern, rule.replace);
      modified = true;
    }
  });
  
  // Ensure correct hover effects on specific elements
  Object.keys(hoverRules.ensureOn).forEach(key => {
    const rule = hoverRules.ensureOn[key];
    const matches = content.match(rule.pattern);
    
    if (matches) {
      matches.forEach(match => {
        if (!rule.check.test(match)) {
          // Add the hover class
          const newMatch = match.replace(/class="([^"]*)"/, `class="$1${rule.add}"`);
          content = content.replace(match, newMatch);
          modified = true;
        }
      });
    }
  });
  
  // Special cases for specific pages
  if (filePath.includes('sawal-jawab') || filePath.includes('blogs')) {
    // Question/Blog cards should have translate-x-1 and opacity-90
    content = content.replace(
      /class="([^"]*?bg-white[^"]*?border[^"]*?rounded-lg[^"]*?shadow-sm[^"]*?)"/g,
      (match, classes) => {
        if (match.includes('question') || match.includes('blog') || match.includes('Card')) {
          if (!classes.includes('hover:translate-x-1')) {
            return match.replace(/class="([^"]*)"/, 'class="$1 transition-all duration-200 hover:translate-x-1 hover:opacity-90"');
          }
        }
        return match;
      }
    );
  }
  
  return { content, modified };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: newContent, modified } = fixHoverEffects(content, filePath);
    
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

