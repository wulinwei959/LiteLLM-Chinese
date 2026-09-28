const fs = require('fs');

const filePath = 'src/app/(dashboard)/policies/_components/index.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const idx = content.indexOf('Learn more in the documentation');
if (idx >= 0) {
  console.log('Found "Learn more" at index:', idx);
  console.log('Content:', JSON.stringify(content.substring(idx - 5, idx + 50)));
} else {
  console.log('Not found');
}

// Let's see the actual characters around the arrow
const arrowIdx = content.indexOf('documentation -');
if (arrowIdx >= 0) {
  console.log('Arrow area:', JSON.stringify(content.substring(arrowIdx, arrowIdx + 20)));
}