import yargs from 'yargs';

import { Logger, main } from './transformImports';

const { argv } = yargs
  .option('v', {
    alias: 'verbose',
    description: 'Run with verbose output enabled',
    type: 'boolean'
  })
  .option('s', {
    alias: 'silent',
    description: 'Run with no output except errors. Note: this has no effect if verbose output is enabled.',
    type: 'boolean'
  });

const { silent, verbose } = argv;

const logger: Logger = {
  error: console.error,
  info: (...data: any[]) => {
    if (!silent || verbose) {
      console.info(...data);
    }
  },
  debug: (...data: any[]) => {
    if (verbose) {
      console.debug(...data);
    }
  }
};

main(logger);
