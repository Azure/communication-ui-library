// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Ensure console errors fail tests
console.error = (...args) => {
  throw args;
};

// Ensure console warnings fail tests
console.warning = (...args) => {
  throw args;
};

// Add `ResizeObserver` to globals. Without this GridLayout jest tests fail with "ReferenceError: ResizeObserver is not defined"
global.ResizeObserver = require('resize-observer-polyfill');
