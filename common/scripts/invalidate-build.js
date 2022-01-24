const fs = require('fs');
// Build file to be removed
const cachePath = './common/config/.rush';
fs.rmdirSync(cachePath, { recursive: true });