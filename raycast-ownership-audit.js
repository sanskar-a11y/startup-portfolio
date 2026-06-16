const fs = require('fs');
const path = require('path');

const vanillaPath = path.join(__dirname, 'lib/vanilla/webgl-corridor.js');
const reactPath = path.join(__dirname, 'components/experience/RaycastBridge.tsx');

const vanillaCode = fs.readFileSync(vanillaPath, 'utf8');
const reactCode = fs.readFileSync(reactPath, 'utf8');

// Check for raycaster instantiation or usage
const vanillaHasRaycaster = vanillaCode.includes('new window.THREE.Raycaster') || vanillaCode.includes('raycaster.setFromCamera');
// React uses the raycaster from useThree
const reactHasRaycaster = reactCode.includes('raycaster.setFromCamera');

console.log('=== RAYCAST OWNERSHIP AUDIT ===');
console.log(`Vanilla Raycaster Count = ${vanillaHasRaycaster ? 1 : 0}`);
console.log(`React Raycaster Count = ${reactHasRaycaster ? 1 : 0}`);
