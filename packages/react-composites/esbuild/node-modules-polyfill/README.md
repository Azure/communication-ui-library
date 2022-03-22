Vendored from [upstream](https://github.com/remorses/esbuild-plugins/tree/53b216168bb480db8ccd7887506763924175c670/node-modules-polyfill/src). Upstream uses [rollup-plugin-node-polyfills](https://github.com/ionic-team/rollup-plugin-node-polyfills/tree/master/polyfills) which has an incomplete shim for `events.EventEmitter`. Calling `EventEmitter.off` fails.

Unfortunately, I don't get build errors from `esbuild`, only runtime errors.

