const fs = require('fs');
const path = require('path');

// Define absolute paths for original pkg and temporary pkg.
const ORIG_PKG_PATH = path.resolve(__dirname, '../package.json');
const CACHED_PKG_PATH = path.resolve(__dirname, '../cached-package.json');

// Write data from `cached-package.json` back to original `package.json`.
try {
  fs.unlinkSync(ORIG_PKG_PATH);
  fs.copyFileSync(CACHED_PKG_PATH, ORIG_PKG_PATH);

  // Delete the temporary `cached-package.json` file.
  fs.unlinkSync(CACHED_PKG_PATH);
} catch (error) {
  console.log(error);
}
