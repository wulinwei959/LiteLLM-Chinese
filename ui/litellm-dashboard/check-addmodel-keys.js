const fs = require('fs');

function collectKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? prefix + '.' + key : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...collectKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/messages/zh-CN.json', 'utf8'));

const enKeys = collectKeys(en.models).sort();
const zhKeys = collectKeys(zh.models).sort();

console.log('en keys count:', enKeys.length);
console.log('zh keys count:', zhKeys.length);

// Find missing in zh
const missingInZh = enKeys.filter(k => !zhKeys.includes(k));
console.log('Missing in zh:', missingInZh);

// Find extra in zh
const extraInZh = zhKeys.filter(k => !enKeys.includes(k));
console.log('Extra in zh:', extraInZh);