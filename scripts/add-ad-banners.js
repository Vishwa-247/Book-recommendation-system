/**
 * Script to add advertisement banners to all HTML pages
 * Run this with Node.js: node add-ad-banners.js
 */

const fs = require('fs');
const path = require('path');

const topBanner = `    <!-- Top Advertisement Banner -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-24 md:h-32 hover:border-primary/40 transition-colors">
            <div class="text-center text-gray-500">
                <div class="text-sm font-medium">Premium Advertisement Space - Top Banner</div>
                <div class="text-xs mt-1">728x90 / 970x250 / Responsive</div>
            </div>
        </div>
    </div>

`;

const bottomBanner = `        <!-- Bottom Advertisement Banner -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32 md:h-40 hover:border-primary/40 transition-colors">
                <div class="text-center text-gray-500">
                    <div class="text-sm font-medium">Advertisement Space - Footer Area</div>
                    <div class="text-xs mt-1">728x90 / 970x250 / Responsive</div>
                </div>
            </div>
        </div>
`;

function shouldSkipFile(filePath) {
    const skipPatterns = ['login', 'register', 'auth', 'admin'];
    return skipPatterns.some(pattern => filePath.includes(pattern));
}

function addBannersToFile(filePath) {
    if (shouldSkipFile(filePath)) {
        console.log(`Skipping: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Add top banner after header (but not if already exists)
    if (content.includes('</header>') && !content.includes('Top Advertisement Banner')) {
        content = content.replace(
            /<\/header>\s*\n\s*<main/g,
            `</header>\n\n${topBanner}<main`
        );
        modified = true;
    }

    // Add bottom banner before footer (but not if already exists)
    if (content.includes('</main>') && !content.includes('Bottom Advertisement Banner')) {
        content = content.replace(
            /(\s*)<\/main>\s*\n\s*<!-- Footer/g,
            `$1${bottomBanner}\n$1</main>\n\n$1<!-- Footer`
        );
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.html')) {
            addBannersToFile(filePath);
        }
    });
}

// Start processing from converted_html directory
const rootDir = path.join(__dirname, '..');
processDirectory(rootDir);

console.log('Done!');
