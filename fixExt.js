const fs = require('fs');
const path = require('path');
const cjsConfig = require('./tsconfig.cjs.json');
const esmConfig = require('./tsconfig.esm.json');

const DEFAULT_EXT = '.js';

const fixExt = (dir, newExt) =>
  fs.readdirSync(dir).forEach((file) => {
    if (file.endsWith(DEFAULT_EXT)) {
      const oldPath = path.join(dir, file);
      const newPath = path.join(dir, file.replace(DEFAULT_EXT, newExt));
      fs.renameSync(oldPath, newPath);
    }
  });

try {
  fixExt(cjsConfig.compilerOptions.outDir, '.cjs');
  fixExt(esmConfig.compilerOptions.outDir, '.mjs');
} catch (err) {
  console.error(err.message);
}
