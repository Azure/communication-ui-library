// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { TypingIndicator } from '../../src/components/TypingIndicator';

test.describe('TypingIndicator tests', () => {
  test('TypingIndicator should be shown correctly when 1 user is typing', async ({ mount }) => {
    const component = await mount(<TypingIndicator typingUsers={[{ userId: '1', displayName: 'User 1' }]} />);
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toContainText('User 1 is typing ...');
    await expect(component).toHaveScreenshot('typing-indicator-1-user.png');
  });

  test('TypingIndicator should be shown correctly when 5 users are typing', async ({ mount }) => {
    const users: { userId: string; displayName: string }[] = [];
    for (let i = 1; i <= 5; i++) {
      users.push({ userId: `${i}`, displayName: `User ${i}` });
    }
    const component = await mount(<TypingIndicator typingUsers={users} />);
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toContainText('User 1, User 2, User 3, User 4 and 1 other are typing ...');
    await expect(component).toHaveScreenshot('typing-indicator-5-users.png');
  });
});
