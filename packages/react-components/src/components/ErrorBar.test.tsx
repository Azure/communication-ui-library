//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { CommunicationUiErrorSeverity } from '../types/CommunicationUiError';
import { ErrorBar } from './ErrorBar';

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
      render(<ErrorBar message={testMessage} severity={CommunicationUiErrorSeverity.ERROR} />, container);
    });

    expect(container.children.length).toBeGreaterThan(0);
  });
});
