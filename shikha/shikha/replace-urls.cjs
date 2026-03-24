const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\shikh\\Downloads\\miniproject\\shikha\\shikha\\src';

function replaceInDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('http://127.0.0.1:5001')) {
                content = content.replace(/http:\/\/127\.0\.0\.1:5001/g, '');
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated ' + fullPath);
            }
        }
    });
}
replaceInDir(srcDir);
console.log('Done.');
