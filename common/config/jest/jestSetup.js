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

Object.defineProperty(window, 'MediaStreamTrack', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
      contentHint: 'string',
      enabled: true,
      id: 'string',
      kind: 'string',
      label: 'string',
      muted: true,
      onended: jest.fn(),
      onmute: jest.fn(),
      onunmute: jest.fn(),
      readyState: 'live',
      applyConstraints: jest.fn(),
      clone: jest.fn(),
      getCapabilities: jest.fn(),
      getConstraints: jest.fn(),
      getSettings: jest.fn(),
      stop: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      isolated: false,
      onisolationchange: jest.fn()
  }))
});

Object.defineProperty(window, 'MediaStream', {
  writable: true,
  value: jest.fn().mockImplementation(() => Object.create(MediaStream.prototype))
});
