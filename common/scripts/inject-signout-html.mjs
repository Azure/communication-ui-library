#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { REPO_ROOT } from './lib/index.mjs';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';


const MATRIX_JSON = path.join(REPO_ROOT, 'common', 'config', 'workflows', 'matrix.json');

/**
 * This script injects sign-out html logic as part of CI pipeline.
 * 
 * In uri query parameter add '&hideSignout=true' to hide the signout bar/button.
 * 
 * Usage: node inject-signout-html.mjs <Calling/CallWithChat/Chat>
 */
function main(args) {
  const target = args[2]
  if (target !== 'Calling' && target !== 'CallWithChat' && target !== 'Chat') {
    throw new Error(`Usage: ${args[1]} ['Calling' | 'CallWithChat' | 'Chat']\n`);
  }
  const indexHtmlPath = path.join(REPO_ROOT, 'samples', target, 'public', 'index.html');
  injectSignoutToIndexHtmlFile(indexHtmlPath);
}

function injectSignoutToIndexHtmlFile(filePath) {
    const bodySearchString = '<div id="root" class="Root"></div>';
    const headSearchString = '</head>';
    const styles = `  <style>
      .signout-bar {
          display: flex;
          background-color: #0078d4;
          color: white;
          padding: 10px;
      }
  
      .signout-button {
          margin-left: auto;
          background-color: white;
          color: black;
          border: 1px solid;
          border-radius: 2px;
          cursor: pointer;
          font-size: 16px;
          padding: 8px 16px;
          transition: background-color 0.3s, color 0.3s, border-color 0.3s;
      }
  
      .signout-button:hover {
          background-color: #f3f2f1;
          border-color: #005a9e;
      }
  
      .signout-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.5);
      }
  
      .signout-button:active {
          background-color: #e0e0e0;
      }
    </style>
  </head>`
    const content = `<div id="signout-container">
      <div id="signout-bar" class="signout-bar" style="display: flex;">
        <button id="signoutButton" class="signout-button">Sign Out</button>
      </div>
    </div>
    <div id="root" class="Root"></div>
    <script>
      // Ignore: for internal testing only
      function handleSignOut() {
        console.log("You have signed out!");
        window.location.href = window.location.origin + '/.auth/logout';
      }
      document.getElementById('signoutButton').addEventListener('click', handleSignOut);

      const urlQueryParameters = new URLSearchParams(window.location.search);
      const display = urlQueryParameters.get('hideSignout') === 'true' ? 'none' : 'flex';          
      document.getElementById('signout-bar').style.display = display;
    </script>`;
    try {
        const fileContent = readFileSync(filePath, 'utf-8');
        const updatedContent = fileContent
            .replace(new RegExp(bodySearchString, 'g'), content)
            .replace(new RegExp(headSearchString, 'g'), styles);
        writeFileSync(filePath, updatedContent, 'utf-8');
        console.log(`Successfully replaced "${bodySearchString}" and "${headSearchString}" with signout logic in ${filePath}`);
    } catch (error) {
        console.error('Error processing the file:', error);
    }
}

main(process.argv);