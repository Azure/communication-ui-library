// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This file is for the generate of the complete API of the package.
 * This also includes the sub export of the javascript-loaders in the API.
 * To use these exports the user will need to import the functions from
 * '@azure/communication-react/javascript-loaders' instead of from the main entry point.
 *
 * This is to avoid having these new functions affect developers that are not using the current
 * version of react that is needed to use these functions inside their react application. In this
 * instance it is recommended that the developer use the react components and composites directly.
 */

/* @conditional-compile-remove(composite-js-helpers) */
export * from './javascript-loaders';
export * from './index';
