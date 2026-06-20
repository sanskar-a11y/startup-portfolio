const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseSrc = 'C:/Users/hp/.gemini/antigravity/brain/dd621486-fabe-48d8-b63e-0e1b62f104e0/landing_base_zoomed_out_1781978366466.png';
const treeSrc = 'C:/Users/hp/.gemini/antigravity/brain/dd621486-fabe-48d8-b63e-0e1b62f104e0/landing_tree_stylized_1781978377276.png';

const baseDest = 'd:/work/startup portfolio/public/images/base_layer.png';
const treeDest = 'd:/work/startup portfolio/public/images/tree_layer.png';

// Ensure public/images exists
if (!fs.existsSync(path.dirname(baseDest))) {
  fs.mkdirSync(path.dirname(baseDest), { recursive: true });
}

// 1. Copy base image
fs.copyFileSync(baseSrc, baseDest);
console.log('Base layer copied to', baseDest);

// 2. Process tree image: make white background transparent
sharp(treeSrc)
  .ensureAlpha()
  .toColorspace('b-w')
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    const outData = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0; i < info.width * info.height; i++) {
      const val = data[i]; 
      
      outData[i * 4] = 0;     // R
      outData[i * 4 + 1] = 0; // G
      outData[i * 4 + 2] = 0; // B
      outData[i * 4 + 3] = val > 200 ? 0 : 255 - val; // Adjust alpha to drop mostly white pixels
    }
    
    return sharp(outData, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(treeDest);
  })
  .then(() => {
    console.log('Tree layer processed and saved to', treeDest);
  })
  .catch(err => {
    console.error('Error processing tree image', err);
  });
