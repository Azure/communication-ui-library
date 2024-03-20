// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import child_process from 'child_process';

/**
 * Execute a command by shelling out.
 *
 * @param cmd: string - command to run.
 * @param extraEnv: Optional environment variables for the child process. By default, process.env is forwarded.
 *
 * - stdout, stderr are piped to the current process' stdout and stderr respectively.
 * - the returned Promise is rejected if the child process exits with a non-zero exit code.
 */
export async function exec(cmd, extraEnv) {
    console.log(`Running ${cmd}`);
    if (extraEnv) {
      console.log(`  with extraEnv ${JSON.stringify(extraEnv)}`);
    }

    const child = child_process.spawn(cmd, {
      // undefined env gets default behavior of forwarding `process.env`.
      env: extraEnv ? {...process.env, ...extraEnv} : undefined,
      shell: true,
      // Inheriting the stdio (and implied stderr and stdin) ensures that colorized output is preserved.
      stdio: 'inherit'
    });
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

  export async function exec_output(cmd) {
    console.log(`Running ${cmd}`);

    const child = child_process.spawn(cmd, {
      shell: true,
      stdio: ['inherit', 'pipe', 'inherit']
    });

    return new Promise((resolve, reject) => {
      let output = '';
      child.stdout.on('data', (data) => {
        output += data;
      });

      child.on('exit', (code) => {
        if (code != 0) {
          reject(`Child exited with non-zero code: ${code}`);
        }
        resolve(output);
      });
      child.on('error', (err) => {
        reject(`Child failed to start: ${err}`);
      });
    });
  }