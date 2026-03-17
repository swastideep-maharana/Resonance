const fs = require('fs');
const path = require('path');

const srcPath = "h:/Projects(github)/Ai Voice Cloning Platform/resonance/public/icons8-audio-wave-96.png";
const iconDest = "h:/Projects(github)/Ai Voice Cloning Platform/resonance/src/app/icon.png";
const favDest = "h:/Projects(github)/Ai Voice Cloning Platform/resonance/src/app/favicon.ico";

console.log('Starting icon update script...');

try {
    if (fs.existsSync(srcPath)) {
        console.log('Source file found.');
        fs.copyFileSync(srcPath, iconDest);
        console.log('Copied to src/app/icon.png');
        
        if (fs.existsSync(favDest)) {
            console.log('Old favicon found. Attempting to delete...');
            fs.unlinkSync(favDest);
            console.log('Deleted src/app/favicon.ico');
        } else {
            console.log('Old favicon not found in src/app/');
        }
    } else {
        console.error('Source file NOT found at:', srcPath);
    }
} catch (err) {
    console.error('An error occurred:', err);
    process.exit(1);
}
console.log('Icon update complete.');
