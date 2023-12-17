// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { TypingIndicator } from '../TypingIndicator';

test('should work', async ({ mount }) => {
  const component = await mount(<TypingIndicator typingUsers={[{ userId: '123', displayName: 'User 1' }]} />);
  await component.evaluate(() => document.fonts.ready);
  await expect(component).toContainText('User 1 is typing ...');
  await expect(component).toHaveScreenshot('typing-indicator-test-1.png');
});

test('should work - 2', async ({ mount }) => {
  const component = await mount(<TypingIndicator typingUsers={[{ userId: '123', displayName: 'User 2' }]} />);
  await component.evaluate(() => document.fonts.ready);
  await expect(component).toContainText('User 2 is typing ...');
  await expect(component).toHaveScreenshot('typing-indicator-test-2.png');
});
