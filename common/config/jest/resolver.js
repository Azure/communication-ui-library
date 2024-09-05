// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Resolver code is based on https://github.com/microsoft/accessibility-insights-web/pull/5421#issuecomment-1109168149 and
// a PR attached to it
module.exports = (path, options) => {
    // Call the defaultResolver, so we leverage its cache, error handling, etc.
    return options.defaultResolver(path, {
        ...options,
        // Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
        packageFilter: pkg => {
            // jest-environment-jsdom 28+ tries to use browser exports instead of default exports,
            // but some packages only offers an ESM browser export and not a CommonJS one.
            // Jest does not yet support ESM modules natively (see https://jestjs.io/docs/ecmascript-modules), 
            // so this causes a Jest error related to trying to parse "export" syntax.
            //
            // This workaround prevents Jest from considering module-based exports for the following dependencies;
            // it falls back to uuid's CommonJS+node "main" property.
            //
            // Once we're able to migrate our Jest config to ESM or get CommonJS browser export for our dependencies, this can go away.
            if (pkg.name === 'uuid' || pkg.name === '@azure/core-util' || pkg.name === '@azure/abort-controller' || pkg.name === '@azure/core-rest-pipeline' || pkg.name === '@azure/logger'|| pkg.name === '@azure/core-tracing'|| pkg.name === '@azure/core-auth'|| pkg.name === '@azure/core-client' || pkg.name === 'nanoid') {
                delete pkg['exports'];
                delete pkg['module'];
            }
            return pkg;
        },
    });
};