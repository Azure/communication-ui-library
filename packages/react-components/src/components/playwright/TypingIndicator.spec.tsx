// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { TypingIndicator } from '../TypingIndicator';

test.use({ viewport: { width: 500, height: 500 } });

test('should work', async ({ mount }) => {
  const component = await mount(<TypingIndicator typingUsers={[{ userId: '123', displayName: 'User 1' }]} />);
  await expect(component).toContainText('User 1 is typing ...');
  await expect(component).toHaveScreenshot('typing-indicator-test-1.png');
});
