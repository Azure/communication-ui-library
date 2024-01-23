// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { TypingIndicator } from '../../src';

test('TypingIndicator should be shown correctly when 1 user is typing', async ({ mount }) => {
  const component = await mount(<TypingIndicator typingUsers={[{ userId: '1', displayName: 'User 1' }]} />);
  await component.evaluate(() => document.fonts.ready);
  await expect(component).toContainText('User 1 is typing ...');
  await expect(component).toHaveScreenshot('typing-indicator-1-user.png');
});

test('TypingIndicator should be shown correctly when 5 users are typing', async ({ mount }) => {
  const component = await mount(
    <TypingIndicator
      typingUsers={[
        { userId: '1', displayName: 'User 1' },
        { userId: '2', displayName: 'User 2' },
        { userId: '3', displayName: 'User 3' },
        { userId: '4', displayName: 'User 4' },
        { userId: '5', displayName: 'User 5' }
      ]}
    />
  );
  await component.evaluate(() => document.fonts.ready);
  await expect(component).toContainText('User 1, User 2, User 3, User 4, User 5 are typing ...');
  await expect(component).toHaveScreenshot('typing-indicator-5-users.png');
});
