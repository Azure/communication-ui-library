#! /usr/bin/env node
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');

console.log('Generating bundles...');
const args = process.argv.slice(2);

let outputDir;

/**
 * Check to see if there is a specified directory
 *
 * This directory that they specify should be relative to the current working directory
 */
if (args.length > 0) {
  // if there is a directory we are going to use it
  outputDir = path.join(process.cwd(), args[0]);
} else {
  // if no directory is provided we will use the current working directory
  outputDir = process.cwd();
}

// Run the webpack to bundle the js to umd format
exec(`npm run generate-bundles`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

console.log('copying Composite bundles...');
// copy the output from webpack to the specified location
exec(
  `cp ./dist/dist-esm/acs-ui-javascript-loaders/src/build-javascript/outboundCallComposite.js ${outputDir}`,
  (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  }
);
