// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import child_process from 'child_process';

/**
 * Execute a command by shelling out.
 *
 * @param cmd: string - command to run.
 * @param env: Optional environment variables for the child process. By default, process.env is forwarded.
 *
 * - stdout, stderr are piped to the current process' stdout and stderr respectively.
 * - the returned Promise is rejected if the child process exits with a non-zero exit code.
 */
export async function exec(cmd, env) {
    console.log(`Running ${cmd}`);
    // Inheriting the stdio (and implied stderr and stdin) ensures that colorized output is preserved.
    const child = child_process.spawn(cmd, { env: env, shell: true, stdio: 'inherit' });
    return new Promise((resolve, reject) => {
      child.on('exit', (code) => {
        if (code != 0) {
          reject(`Child exited with non-zero code: ${code}`);
        }
        resolve();
      });
      child.on('error', (err) => {
        reject(`Child failed to start: ${err}`);
      });
    });
  }