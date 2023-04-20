// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { registerIcons } from '@fluentui/react';
import { ActiveErrorMessage, ErrorBar, ErrorBarProps } from './ErrorBar';
import { fireEvent, render, screen } from '@testing-library/react';

const ONE_DAY_MILLISECONDS = 24 * 3600 * 1000;

registerIcons({
  icons: {
    errorbarclear: <></>,
    errorbadge: <></>
  }
});

describe('ErrorBar self-clearing error', () => {
  test('error bar is hidden when an error with timestamp is cleared', () => {
    const { rerender } = renderErrorBarWithDefaults();
    rerenderWithAccessDeniedErrorAt(rerender, new Date(Date.now()));
    expect(messageBarCount()).toBe(1);
    rerenderWithNoActiveError(rerender);
    expect(messageBarCount()).toBe(0);
    rerenderWithAccessDeniedErrorAt(rerender, new Date(Date.now()));
    expect(messageBarCount()).toBe(1);
  });

  test('error bar is hidden when an error without timestamp is cleared', () => {
    const { rerender } = renderErrorBarWithDefaults();
    rerenderWithAccessDeniedErrorWithoutTimestamp(rerender);
    expect(messageBarCount()).toBe(1);
    rerenderWithNoActiveError(rerender);
    expect(messageBarCount()).toBe(0);
    rerenderWithAccessDeniedErrorWithoutTimestamp(rerender);
    expect(messageBarCount()).toBe(1);
  });
});

describe('ErrorBar dismissal for errors with timestamp', () => {
  it('error can be dimissed', () => {
    const { rerender } = renderErrorBarWithDefaults();
    rerenderWithAccessDeniedErrorAt(rerender, new Date(Date.now()));
    expect(messageBarCount()).toBe(1);
    simulateDismissOneError();
    expect(messageBarCount()).toBe(0);
  });

  it('new error after dismissal is shown', () => {
    const { rerender } = renderErrorBarWithDefaults();
    rerenderWithAccessDeniedErrorAt(rerender, new Date(Date.now()));
    simulateDismissOneError();
    rerenderWithAccessDeniedErrorAt(rerender, new Date(Date.now() + ONE_DAY_MILLISECONDS));
    expect(messageBarCount()).toBe(1);
  });

  it('old error after dismissal is not shown', () => {
    const { rerender } = renderErrorBarWithDefaults();
    rerenderWithAccessDeniedErrorAt(rerender, new Date(Date.now()));
    simulateDismissOneError();
    rerenderWithAccessDeniedErrorAt(rerender, new Date(Date.now() - ONE_DAY_MILLISECONDS));
    expect(messageBarCount()).toBe(0);
  });

  it('old error after dismissal and intervening non-error is not shown', () => {
    const { rerender } = renderErrorBarWithDefaults();
    rerenderWithAccessDeniedErrorAt(rerender, new Date(Date.now()));
    simulateDismissOneError();
    rerenderWithNoActiveError(rerender);
    rerenderWithAccessDeniedErrorAt(rerender, new Date(Date.now() - ONE_DAY_MILLISECONDS));
    expect(messageBarCount()).toBe(0);
  });
});

describe('ErrorBar dismissal for errors without timestamp', () => {
  it('error can be dimissed', () => {
    const { rerender } = renderErrorBarWithDefaults();
    rerenderWithAccessDeniedErrorWithoutTimestamp(rerender);
    expect(messageBarCount()).toBe(1);
    simulateDismissOneError();
    expect(messageBarCount()).toBe(0);
  });

  it('new error after dismissal is not shown', () => {
    const { rerender } = renderErrorBarWithDefaults();
    rerenderWithAccessDeniedErrorWithoutTimestamp(rerender);
    simulateDismissOneError();
    rerenderWithAccessDeniedErrorWithoutTimestamp(rerender);
    expect(messageBarCount()).toBe(0);
  });

  it('new error after dismissal and intervening non-error is shown', () => {
    const { rerender } = renderErrorBarWithDefaults();
    rerenderWithAccessDeniedErrorWithoutTimestamp(rerender);
    simulateDismissOneError();
    rerenderWithNoActiveError(rerender);
    rerenderWithAccessDeniedErrorWithoutTimestamp(rerender);
    expect(messageBarCount()).toBe(1);
  });
});

describe('ErrorBar dismissal with multiple errors', () => {
  it('clearing an error with multiple errors leaves other errors untouched', () => {
    const { rerender } = renderErrorBarWithDefaults();
    rerenderWithActiveErrors(rerender, [
      { type: 'accessDenied', timestamp: new Date(Date.now()) },
      { type: 'muteGeneric' }
    ]);
    expect(messageBarCount()).toBe(2);
    simulateDismissOneError();
    expect(messageBarCount()).toBe(1);
  });
});

describe('ErrorBar handling of errors from previous call or chat', () => {
  it('shows all old errors by default', () => {
    const oldErrors: ActiveErrorMessage[] = [
      // Make sure old error is in the past.
      { type: 'accessDenied', timestamp: new Date(Date.now() - 10) },
      { type: 'muteGeneric' }
    ];
    const { rerender } = renderErrorBarWithDefaults();
    rerenderWithActiveErrors(rerender, oldErrors);
    expect(messageBarCount()).toBe(2);
  });

  it.only('does not show old errors with timestamp when ignorePremountErrors is set', () => {
    // Make sure old error is in the past.
    const oldErrors: ActiveErrorMessage[] = [{ type: 'accessDenied', timestamp: new Date(Date.now() - 10) }];
    const { rerender, initialProps } = renderErrorBarWithDefaults({ ignorePremountErrors: true });
    rerenderWithActiveErrors(rerender, oldErrors, initialProps);
    expect(messageBarCount()).toBe(0);
  });

  it('shows old errors without timestamp when ignorePremountErrors is set', () => {
    const oldErrors: ActiveErrorMessage[] = [{ type: 'muteGeneric' }];
    const { rerender, initialProps } = renderErrorBarWithDefaults({ ignorePremountErrors: true });
    rerenderWithActiveErrors(rerender, oldErrors, initialProps);
    expect(messageBarCount()).toBe(1);
  });
});

const renderErrorBarWithDefaults = (
  props?: Partial<ErrorBarProps>
): {
  rerender: (ui: React.ReactElement) => void;
  initialProps: Partial<ErrorBarProps>;
} => {
  const mergedProps: ErrorBarProps = {
    activeErrorMessages: [],
    ...(props ?? {})
  };
  const { rerender } = render(<ErrorBar {...mergedProps} />);
  return { rerender, initialProps: mergedProps };
};

const messageBarCount = (): number => screen.queryAllByRole('alert').length;

const simulateDismissOneError = (): void => {
  const button = screen.getAllByRole('button')[0];
  fireEvent.click(button);
};

const rerenderWithAccessDeniedErrorAt = (
  rerender: (ui: React.ReactElement) => void,
  timestamp: Date,
  existingProps?: Partial<ErrorBarProps>
): void => rerenderWithActiveErrors(rerender, [{ type: 'accessDenied', timestamp }], existingProps);

const rerenderWithAccessDeniedErrorWithoutTimestamp = (
  rerender: (ui: React.ReactElement) => void,
  existingProps?: Partial<ErrorBarProps>
): void => rerenderWithActiveErrors(rerender, [{ type: 'accessDenied' }], existingProps);

const rerenderWithNoActiveError = (
  rerender: (ui: React.ReactElement) => void,
  existingProps?: Partial<ErrorBarProps>
): void => rerenderWithActiveErrors(rerender, [], existingProps);

const rerenderWithActiveErrors = (
  rerender: (ui: React.ReactElement) => void,
  activeErrorMessages: ActiveErrorMessage[],
  existingProps?: Partial<ErrorBarProps>
): void => {
  rerender(<ErrorBar {...existingProps} activeErrorMessages={activeErrorMessages} />);
};
