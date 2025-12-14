const fs = require('fs');
const path = require('path');

function removeAdBannerHover(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove hover from ad banners - pattern 1: hover:border-[#00377b]/40 transition-colors
    const pattern1 = /hover:border-\[#00377b\]\/40\s+transition-colors/g;
    if (content.match(pattern1)) {
        content = content.replace(pattern1, '');
        modified = true;
    }

    // Remove hover from ad banners - pattern 2: hover:border-primary/40 transition-colors
    const pattern2 = /hover:border-primary\/40\s+transition-colors/g;
    if (content.match(pattern2)) {
        content = content.replace(pattern2, '');
        modified = true;
    }

    // Remove hover from ad banners - pattern 3: hover:border-[#00377b]/40
    const pattern3 = /hover:border-\[#00377b\]\/40/g;
    if (content.match(pattern3)) {
        content = content.replace(pattern3, '');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
        return true;
    }
    return false;
}

function processDirectory(directoryPath) {
    let count = 0;
    fs.readdirSync(directoryPath, { withFileTypes: true }).forEach(dirent => {
        const fullPath = path.join(directoryPath, dirent.name);
        if (dirent.isDirectory() && dirent.name !== 'node_modules' && dirent.name !== '.git') {
            count += processDirectory(fullPath);
        } else if (dirent.isFile() && dirent.name.endsWith('.html')) {
            if (removeAdBannerHover(fullPath)) {
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
