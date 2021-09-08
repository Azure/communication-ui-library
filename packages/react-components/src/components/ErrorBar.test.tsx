// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { act } from 'react-dom/test-utils';
import { initializeIcons, MessageBar } from '@fluentui/react';
import { ActiveError, ErrorBar } from './ErrorBar';
import Enzyme, { ReactWrapper, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const ONE_DAY_MILLISECONDS = 24 * 3600 * 1000;

describe('ErrorBar self-clearing error', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  test('error bar is hidden when an error with timestamp is cleared', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root, new Date(Date.now()));
    expect(messageBarCount(root)).toBe(1);
    setNoActiveError(root);
    expect(messageBarCount(root)).toBe(0);
    setAccessDeniedErrorAt(root, new Date(Date.now()));
    expect(messageBarCount(root)).toBe(1);
  });

  test('error bar is hidden when an error without timestamp is cleared', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorWithoutTimestamp(root);
    expect(messageBarCount(root)).toBe(1);
    setNoActiveError(root);
    expect(messageBarCount(root)).toBe(0);
    setAccessDeniedErrorWithoutTimestamp(root);
    expect(messageBarCount(root)).toBe(1);
  });
});

describe('ErrorBar dismissal for errors with timestamp', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  it('error can be dimissed', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root, new Date(Date.now()));
    expect(messageBarCount(root)).toBe(1);
    simulateDismissOneError(root);
    expect(messageBarCount(root)).toBe(0);
  });

  it('new error after dismissal is shown', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root, new Date(Date.now()));
    simulateDismissOneError(root);
    setAccessDeniedErrorAt(root, new Date(Date.now() + ONE_DAY_MILLISECONDS));
    expect(messageBarCount(root)).toBe(1);
  });

  it('old error after dismissal is not shown', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root, new Date(Date.now()));
    simulateDismissOneError(root);
    setAccessDeniedErrorAt(root, new Date(Date.now() - ONE_DAY_MILLISECONDS));
    expect(messageBarCount(root)).toBe(0);
  });

  it('old error after dismissal and intervening non-error is not shown', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root, new Date(Date.now()));
    simulateDismissOneError(root);
    setNoActiveError(root);
    setAccessDeniedErrorAt(root, new Date(Date.now() - ONE_DAY_MILLISECONDS));
    expect(messageBarCount(root)).toBe(0);
  });
});

describe('ErrorBar dismissal for errors without timestamp', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  it('error can be dimissed', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorWithoutTimestamp(root);
    expect(messageBarCount(root)).toBe(1);
    simulateDismissOneError(root);
    expect(messageBarCount(root)).toBe(0);
  });

  it('new error after dismissal is not shown', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorWithoutTimestamp(root);
    simulateDismissOneError(root);
    setAccessDeniedErrorWithoutTimestamp(root);
    expect(messageBarCount(root)).toBe(0);
  });

  it('new error after dismissal and intervening non-error is shown', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorWithoutTimestamp(root);
    simulateDismissOneError(root);
    setNoActiveError(root);
    setAccessDeniedErrorWithoutTimestamp(root);
    expect(messageBarCount(root)).toBe(1);
  });
});

describe('ErrorBar dismissal with multiple errors', () => {
  it('clearing an error with multiple errors leaves other errors untouched', () => {
    const root = mountErrorBarWithDefaults();
    setActiveErrors(root, [{ type: 'accessDenied', timestamp: new Date(Date.now()) }, { type: 'muteGeneric' }]);
    expect(messageBarCount(root)).toBe(2);
    simulateDismissOneError(root);
    expect(messageBarCount(root)).toBe(1);
  });
});

const mountErrorBarWithDefaults = (): ReactWrapper => {
  let root;
  act(() => {
    root = mount(
      <ErrorBar
        activeErrors={[]}
        onDismissErrors={() => {
          /* deprecated */
        }}
      />
    );
  });
  return root;
};

const messageBarCount = (root: ReactWrapper): number => root.find(MessageBar).length;

const simulateDismissOneError = (root: ReactWrapper) => {
  const messageBar = root.find(MessageBar).at(0);
  const button = messageBar.find('button').at(0);
  button.simulate('click');
};

const setAccessDeniedErrorAt = (root: ReactWrapper, timestamp: Date): void =>
  setActiveErrors(root, [{ type: 'accessDenied', timestamp }]);

const setAccessDeniedErrorWithoutTimestamp = (root: ReactWrapper): void =>
  setActiveErrors(root, [{ type: 'accessDenied' }]);

const setActiveErrors = (root: ReactWrapper, activeErrors: ActiveError[]): void => {
  act(() => {
    root.setProps({ activeErrors: activeErrors });
  });
};

const setNoActiveError = (root: ReactWrapper): void => {
  act(() => {
    root.setProps({ activeErrors: [] });
  });
};
