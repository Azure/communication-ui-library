import path from 'path';
import { exec } from '../lib/exec.mjs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { cwd } from 'process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BUNDLES_DIR = path.join(__dirname, '..', '..', 'samples', 'StaticHtmlComposites', 'dist');
const BUNDLE_SCRIPT_DIR = path.join(__dirname, '..', '..', '..', 'packages', 'acs-ui-javascript-loaders');

async function main() {
    setup();
    await exec(`npx rollup`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });  
}


/** To be called at the beginning of the script to backup the files that will be modified by the build process */
async function setup() {
    // Clean any existing results first
    if (fs.existsSync(BUNDLES_DIR)) {
      fs.rmSync(BUNDLES_DIR, { recursive: true });
    }
  }

  main();


  /**
   * Figure out how to copy bundled JS and webpack config to directory to be used
   * 
   * 
   * - Run the webpack to bundle the js to umd format
   * - this would take that output from webpack (in dist?) copy to specified location
   * - if no location provided it will place in running directory (where they called it from)
   */