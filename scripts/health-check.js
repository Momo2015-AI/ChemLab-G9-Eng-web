const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexFile = path.join(root, 'index.html');

function checkFile(file, name) {
  if (fs.existsSync(file)) {
    console.log(`✓ ${name}`);
  } else {
    console.error(`✗ Missing ${name}: ${file}`);
    process.exitCode = 1;
  }
}

console.log('ChemLab-G9-S2 Health Check');
console.log('==========================');

checkFile(indexFile, 'index.html');

for (let i = 1; i <= 36; i++) {
  const day = String(i).padStart(2, '0');
  const candidates = [
    path.join(root, `content/days/day-${day}.js`),
    path.join(root, `content/days/day${day}.js`)
  ];

  if (candidates.some(fs.existsSync)) {
    console.log(`✓ Day${day}`);
  } else {
    console.warn(`! Day${day} content file not found`);
  }
}

console.log('Health check completed.');
