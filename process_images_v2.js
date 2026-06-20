const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = "C:\\Users\\hp\\.gemini\\antigravity\\brain\\dd621486-fabe-48d8-b63e-0e1b62f104e0";
const destDir = path.join(__dirname, "public", "images");

async function makeTransparent(inputPath, filename) {
    const outPath = path.join(destDir, filename);
    if (!fs.existsSync(inputPath)) {
        console.error("Input file not found:", inputPath);
        return;
    }
    const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const avg = (r + g + b) / 3;
        
        // Graphite color
        data[i] = 30;
        data[i+1] = 30;
        data[i+2] = 30;
        
        // Alpha mapping
        let alpha = 255 - avg;
        if (alpha < 15) alpha = 0; 
        data[i+3] = alpha;
    }
    
    await sharp(data, {
        raw: {
            width: info.width,
            height: info.height,
            channels: 4
        }
    }).png().toFile(outPath);
    console.log(`Processed ${filename}`);
}

async function run() {
    await makeTransparent(path.join(srcDir, "wall_bg_1781979474567.png"), "wall_bg.png");
    await makeTransparent(path.join(srcDir, "ground_bg_1781979487012.png"), "ground_bg.png");
    await makeTransparent(path.join(srcDir, "cat_sketch_1781979496770.png"), "cat.png");
    await makeTransparent(path.join(srcDir, "planter_sketch_1781979507090.png"), "planter.png");
}

run();
