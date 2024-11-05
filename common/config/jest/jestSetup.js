// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Ensure console errors and warnings fail tests
beforeAll(() => {
  // Mock console.error to throw an error
  jest.spyOn(console, 'error').mockImplementation((message) => {
    throw new Error(`Console error: ${message}`);
  });

  // Mock console.warn to throw an error
  jest.spyOn(console, 'warn').mockImplementation((message) => {
    throw new Error(`Console warning: ${message}`);
  });
});

afterAll(() => {
  // Restore console.error and console.warn to their original behavior
  jest.restoreAllMocks();
});

window.AudioContext = jest.fn().mockImplementation(() => {
  return {};
});
// Add `ResizeObserver` to globals. Without this GridLayout jest tests fail with "ReferenceError: ResizeObserver is not defined"
global.ResizeObserver = require('resize-observer-polyfill');
