const fs = require('fs');
const path = require('path');

const srcDirs = ['app', 'components', 'store', 'lib'];
let allFiles = [];

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else {
            allFiles.push({
                path: fullPath,
                ext: path.extname(fullPath),
                content: fs.readFileSync(fullPath, 'utf8'),
            });
        }
    }
}

srcDirs.forEach(dir => walkDir(dir));

console.log("=== AGENT 5: TYPESCRIPT COVERAGE ===");
const exts = { '.js': 0, '.jsx': 0, '.ts': 0, '.tsx': 0, '.css': 0, '.html': 0 };
allFiles.forEach(f => { if (exts[f.ext] !== undefined) exts[f.ext]++; });
console.log(exts);
const jsFiles = allFiles.filter(f => f.ext === '.js' || f.ext === '.jsx');
console.log("\nJS Files remaining:");
jsFiles.forEach(f => console.log(f.path));

console.log("\n=== AGENT 4: FILE SIZE FORENSICS (Top 10) ===");
const fileSizes = allFiles.map(f => {
    const lines = f.content.split('\n');
    return { path: f.path, lines: lines.length };
});
fileSizes.sort((a, b) => b.lines - a.lines);
fileSizes.slice(0, 10).forEach(f => console.log(`${f.lines} lines - ${f.path}`));

console.log("\n=== AGENT 3 & 6 & 12: BRIDGE & DEPENDENCY FORENSICS ===");
const searchTerms = [
    'window.THREE', 'window.gsap', 'window.__', 'globalThis', 
    '__DOOR_CALLBACKS__', '__OVERLAY_CALLBACKS__', '__CAMERA_EXPOSED__'
];
searchTerms.forEach(term => {
    console.log(`\nSearching for: ${term}`);
    allFiles.forEach(f => {
        const lines = f.content.split('\n');
        lines.forEach((line, i) => {
            if (line.includes(term)) {
                console.log(`${f.path}:${i + 1}  ${line.trim()}`);
            }
        });
    });
});

console.log("\n=== AGENT 13: STATE OWNERSHIP AUDIT ===");
const stateTerms = ['appState', 'useCameraStore', 'useUIStore', 'currentRoomId', 'activeRoom'];
stateTerms.forEach(term => {
    console.log(`\nSearching for: ${term}`);
    allFiles.forEach(f => {
        const lines = f.content.split('\n');
        lines.forEach((line, i) => {
            if (line.includes(term)) {
                console.log(`${f.path}:${i + 1}  ${line.trim()}`);
            }
        });
    });
});
