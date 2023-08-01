// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Ensure console errors fail tests
console.error = (...args) => {
  // disable ReactDOM.render, need to be removed after
  // https://github.com/microsoft/fluentui/issues/28702 fixed
  if (
    args[0] ===
    "Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"
  ) {
    return;
  }
  throw args;
};

// Ensure console warnings fail tests
console.warning = (...args) => {
  throw args;
};

// Add `ResizeObserver` to globals. Without this GridLayout jest tests fail with "ReferenceError: ResizeObserver is not defined"
global.ResizeObserver = require('resize-observer-polyfill');
