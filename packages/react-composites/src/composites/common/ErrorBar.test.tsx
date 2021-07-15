// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ErrorBar } from './ErrorBar';
import { setIconOptions } from '@fluentui/react';

// Suppress icon warnings for tests. Icons are fetched from CDN which we do not want to perform during tests.
// More information: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (container !== null) {
    unmountComponentAtNode(container);
    container.remove();
  }
});

const testMessage = 'test message';

describe('ErrorBar tests', () => {
  test('ErrorBar should display nothing when no there are no messages', () => {
    act(() => {
      render(<ErrorBar />, container);
    });

    expect(container.children.length).toBe(0);
  });

  test('ErrorBar should display message when message is specified', () => {
    act(() => {
      render(<ErrorBar message={testMessage} severity={'error'} />, container);
    });

    expect(container.children.length).toBeGreaterThan(0);
  });
});
