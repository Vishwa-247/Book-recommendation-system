const fs = require('fs');
const path = require('path');

function fixHoverEffects(content, filePath) {
  let modified = false;
  
  // 1. Remove hover:opacity-85 from everything except logo links (<a> with logo)
  // Logo link should be: <a href="..." class="flex items-center hover:opacity-85 transition-opacity">
  // But NOT on divs, navs, buttons, etc.
  content = content.replace(
    /(<(div|nav|button|section|header|footer|main)[^>]*?class="[^"]*?)hover:opacity-85[^"]*(")/g,
    (match, before, tag, after) => {
      modified = true;
      return before + after;
    }
  );
  
  // Remove hover:opacity-85 from buttons (they have their own hover)
  content = content.replace(
    /(<(a|button)[^>]*?class="[^"]*?(?:bg-\[#|bg-primary|bg-secondary|bg-gradient)[^"]*?)hover:opacity-85[^"]*(")/g,
    (match, before, tag, after) => {
      modified = true;
      return before + after;
    }
  );
  
  // 2. Remove hover from ad banners completely
  content = content.replace(
    /(bg-gray-50[^>]*?border-dashed[^>]*?border-gray-300[^>]*?)hover:[^"]*(")/g,
    (match, before, after) => {
      if (match.includes('hover:')) {
        modified = true;
        return before + after;
      }
      return match;
    }
  );
  
  // 3. Remove hover from static text elements (p, h1-h6, span without links)
  content = content.replace(
    /(<(p|h[1-6]|label|span)[^>]*?class="[^"]*?)(?<!href=)([^"]*?)hover:[^"]*(")/g,
    (match, before, tag, middle, after) => {
      // Only remove if it's not inside a link
      if (!match.includes('href=') && !match.includes('<a')) {
        modified = true;
        return before + middle + after;
      }
      return match;
    }
  );
  
  // 4. Remove hover from static badges (non-link badges)
  content = content.replace(
    /(<span[^>]*?class="[^"]*?(?:badge|px-2\.5 py-0\.5)[^"]*?"[^>]*?)(?<!href=)([^>]*?)hover:[^"]*(")/g,
    (match, before, middle, after) => {
      if (!match.includes('href=') && !match.includes('<a')) {
        modified = true;
        return before + middle + after;
      }
      return match;
    }
  );
  
  // 5. Ensure logo links have hover:opacity-85 (only the <a> tag with logo, not parent divs)
  content = content.replace(
    /(<a[^>]*?href="[^"]*?"[^>]*?class="[^"]*?flex items-center[^"]*?"[^>]*?>[\s\S]*?<img[^>]*?logo[^>]*?>)/g,
    (match) => {
      if (!match.includes('hover:opacity-85')) {
        modified = true;
        return match.replace(/class="([^"]*)"/, 'class="$1 hover:opacity-85 transition-opacity"');
      }
      return match;
    }
  );
  
  // 6. Ensure inputs have hover:border-gray-400
  content = content.replace(
    /(<(input|textarea|select)[^>]*?class="[^"]*?border-2[^"]*?border-gray-300[^"]*?"[^>]*?)(?!.*hover:border-gray-400)/g,
    (match) => {
      modified = true;
      return match.replace(/class="([^"]*)"/, 'class="$1 hover:border-gray-400"');
    }
  );
  
  // 7. Ensure footer links have hover:text-white
  content = content.replace(
    /(<a[^>]*?class="[^"]*?text-white\/90[^"]*?"[^>]*?)(?!.*hover:text-white)/g,
    (match) => {
      modified = true;
      return match.replace(/class="([^"]*)"/, 'class="$1 hover:text-white transition-colors duration-200"');
    }
  );
  
  // 8. Remove duplicate transition classes
  content = content.replace(/transition-opacity\s+transition-opacity/g, 'transition-opacity');
  content = content.replace(/transition-colors\s+transition-colors/g, 'transition-colors');
  content = content.replace(/transition-all\s+transition-all/g, 'transition-all');
  
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
