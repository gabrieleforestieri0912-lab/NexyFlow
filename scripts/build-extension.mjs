import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist-extension');

console.log('🚀 Building NextBrand Chrome Extension...');

// 1. Run Next.js build
try {
  console.log('📦 Running Next.js build...');
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// 2. Prepare dist-extension folder
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);

// 3. Copy extension assets from public
console.log('📂 Copying assets from public...');
const publicDir = path.join(rootDir, 'public');
const assetsToCopy = ['manifest.json', 'background.js', 'nextbrand.png', 'sidebar.html', 'sidebar.js', 'extension-i18n.js'];
const contentScripts = fs.readdirSync(publicDir).filter(f => f.startsWith('content-'));

[...assetsToCopy, ...contentScripts].forEach(file => {
  const src = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
  }
});

// 4. Find and copy popup.js
console.log('🔍 Locating popup bundle...');
const staticChunksDir = path.join(rootDir, '.next', 'static', 'chunks');
const files = fs.readdirSync(staticChunksDir);
const popupFile = files.find(f => f.startsWith('popup-') && f.endsWith('.js'));

if (popupFile) {
  console.log(`✨ Found popup bundle: ${popupFile}`);
  fs.copyFileSync(path.join(staticChunksDir, popupFile), path.join(distDir, 'popup.js'));
} else {
  console.error('❌ Could not find popup-*.js in .next/static/chunks');
  process.exit(1);
}

// 5. Find and copy CSS
console.log('🎨 Copying styles...');
const staticCssDir = path.join(rootDir, '.next', 'static', 'css');
if (fs.existsSync(staticCssDir)) {
  const cssFiles = fs.readdirSync(staticCssDir).filter(f => f.endsWith('.css'));
  cssFiles.forEach(f => {
    fs.copyFileSync(path.join(staticCssDir, f), path.join(distDir, 'style.css')); // We just need one main CSS usually
  });
}

// 6. Create popup.html
console.log('📄 Creating popup.html...');
const popupHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>NextBrand AI</title>
    <link rel="stylesheet" href="style.css">
    <style>
      body { width: 380px; min-height: 550px; margin: 0; padding: 0; overflow-x: hidden; }
      #root { width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="popup.js"></script>
  </body>
</html>
`;
fs.writeFileSync(path.join(distDir, 'popup.html'), popupHtml);

console.log('\n✅ Extension build complete! Folder: dist-extension');
console.log('👉 Load this folder in chrome://extensions/ via "Load unpacked"');
