// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { act } from 'react-dom/test-utils';
import enableHooks from 'jest-react-hooks-shallow';
import { initializeIcons, MessageBar } from '@fluentui/react';
import { ErrorBar } from './ErrorBar';
import Enzyme, { ShallowWrapper, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const ONE_DAY_MILLISECONDS = 24 * 3600 * 1000;

describe('ErrorBar dismissal tests for errors with timestamp', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  it('error can be dimissed', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root, new Date(Date.now()));
    expect(messageBarCount(root)).toBe(1);
    simulateDismissSingleError(root);
    expect(messageBarCount(root)).toBe(0);
  });

  it('new error after dismissal is shown', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root, new Date(Date.now()));
    simulateDismissSingleError(root);
    setAccessDeniedErrorAt(root, new Date(Date.now() + ONE_DAY_MILLISECONDS));
    expect(messageBarCount(root)).toBe(1);
  });

  it('old error after dismissal is not shown', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root, new Date(Date.now()));
    simulateDismissSingleError(root);
    setAccessDeniedErrorAt(root, new Date(Date.now() - ONE_DAY_MILLISECONDS));
    expect(messageBarCount(root)).toBe(0);
  });

  it('old error after dismissal and intervening non-error is not shown', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root, new Date(Date.now()));
    simulateDismissSingleError(root);
    setNoActiveError(root);
    setAccessDeniedErrorAt(root, new Date(Date.now() - ONE_DAY_MILLISECONDS));
    expect(messageBarCount(root)).toBe(0);
  });
});

describe('ErrorBar dismissal tests for errors without timestamp', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();

    // Mocks React hooks. Do not use `mount` in the tests below.
    enableHooks(jest);
  });

  it('error can be dimissed', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root);
    expect(messageBarCount(root)).toBe(1);
    simulateDismissSingleError(root);
    expect(messageBarCount(root)).toBe(0);
  });

  it('new error after dismissal is not shown', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root);
    simulateDismissSingleError(root);
    setAccessDeniedErrorAt(root);
    expect(messageBarCount(root)).toBe(0);
  });

  it('[xkcd] new error after dismissal and intervening non-error is shown', () => {
    const root = mountErrorBarWithDefaults();
    setAccessDeniedErrorAt(root);
    simulateDismissSingleError(root);
    act(() => {
      setNoActiveError(root);
    });
    setAccessDeniedErrorAt(root);

    expect(messageBarCount(root)).toBe(1);
  });
});

const mountErrorBarWithDefaults = (): ShallowWrapper => {
  return shallow(
    <ErrorBar
      activeErrors={[]}
      onDismissErrors={() => {
        /* deprecated */
      }}
    />
  );
};

const messageBarCount = (root: ShallowWrapper): number => {
  let count = 0;
  root.children().forEach((node: ShallowWrapper) => {
    if (node.is(MessageBar)) {
      count++;
    }
  });
  return count;
};

/**
 * Dismisses a MessageBar, when we know there is only one error being shown.
 */
const simulateDismissSingleError = (root: ShallowWrapper) => {
  const onDismiss = root.find(MessageBar).prop('onDismiss');
  expect(onDismiss).toBeDefined();
  onDismiss && onDismiss();
};

const setAccessDeniedErrorAt = (root: ShallowWrapper, timestamp?: Date): void => {
  root.setProps({
    activeErrors: [{ type: 'accessDenied', timestamp }]
  });
};

const setNoActiveError = (root: ShallowWrapper): void => {
  root.setProps({ activeErrors: [] });
};
