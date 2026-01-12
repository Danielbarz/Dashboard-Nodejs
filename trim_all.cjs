const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

const dirs = ['client/src', 'server/src'];
dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walk(dir, (file) => {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.cjs') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.d.ts')) {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        const newLines = lines.map(line => line.trimEnd());
        fs.writeFileSync(file, newLines.join('\n').trim() + '\n');
        console.log(`Trimmed ${file}`);
      }
    });
  }
});
