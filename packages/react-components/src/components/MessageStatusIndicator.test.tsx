// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MessageStatusIndicator } from './MessageStatusIndicator';
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
import { screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('MessageStatusIndicator strings should be localizable and overridable', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        messagesending: <></>,
        messagedelivered: <></>,
        messageseen: <></>,
        messagefailed: <></>
      }
    });
  });

  test('Should localize tooltip text', async () => {
    const testLocale = createTestLocale({
      messageStatusIndicator: {
        seenTooltipText: Math.random().toString(),
        readByTooltipText: Math.random().toString(),
        deliveredTooltipText: Math.random().toString(),
        sendingTooltipText: Math.random().toString(),
        failedToSendTooltipText: Math.random().toString()
      }
    });
    const { rerender } = renderWithLocalization(<MessageStatusIndicator status="sending" />, testLocale);
    expect(screen.getByText(testLocale.strings.messageStatusIndicator.sendingTooltipText)).toBeTruthy();

    rerender(<MessageStatusIndicator status="delivered" />);
    expect(screen.getByText(testLocale.strings.messageStatusIndicator.deliveredTooltipText)).toBeTruthy();

    rerender(<MessageStatusIndicator status="seen" />);
    expect(screen.getByText(testLocale.strings.messageStatusIndicator.seenTooltipText)).toBeTruthy();

    rerender(<MessageStatusIndicator status="failed" />);
    expect(screen.getByText(testLocale.strings.messageStatusIndicator.failedToSendTooltipText)).toBeTruthy();
  });
  test('Should localize tooltip text', async () => {
    const testLocale = createTestLocale({
      messageStatusIndicator: {
        seenTooltipText: Math.random().toString(),
        readByTooltipText: Math.random().toString(),
        deliveredTooltipText: Math.random().toString(),
        sendingTooltipText: Math.random().toString(),
        failedToSendTooltipText: Math.random().toString()
      }
    });
    const messageStatusIndicatorStrings = {
      seenTooltipText: Math.random().toString(),
      readByTooltipText: Math.random().toString(),
      deliveredTooltipText: Math.random().toString(),
      sendingTooltipText: Math.random().toString(),
      failedToSendTooltipText: Math.random().toString()
    };
    const { rerender } = renderWithLocalization(
      <MessageStatusIndicator status="sending" strings={messageStatusIndicatorStrings} />,
      testLocale
    );
    expect(screen.getByText(messageStatusIndicatorStrings.sendingTooltipText)).toBeTruthy();

    rerender(<MessageStatusIndicator status="delivered" strings={messageStatusIndicatorStrings} />);
    expect(screen.getByText(messageStatusIndicatorStrings.deliveredTooltipText)).toBeTruthy();

    rerender(<MessageStatusIndicator status="seen" strings={messageStatusIndicatorStrings} />);
    expect(screen.getByText(messageStatusIndicatorStrings.seenTooltipText)).toBeTruthy();

    rerender(<MessageStatusIndicator status="failed" strings={messageStatusIndicatorStrings} />);
    expect(screen.getByText(messageStatusIndicatorStrings.failedToSendTooltipText)).toBeTruthy();
  });
});
