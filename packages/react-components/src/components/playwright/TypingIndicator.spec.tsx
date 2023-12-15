// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { TypingIndicator } from '../TypingIndicator';

test('should work', async ({ mount }) => {
  const component = await mount(
    <TypingIndicator
      typingUsers={[{ userId: '123', displayName: 'User 1' }]}
      styles={{
        root: { padding: 0, margin: 0 },
        typingUserDisplayName: { font: '15px Tahoma , sans-serif;' },
        typingString: { font: '15px Tahoma , sans-serif;' }
      }}
    />
  );
  await expect(component).toContainText('User 1 is typing ...');
  await expect(component).toHaveScreenshot('typing-indicator-test-1.png');
});

test('should work - 2', async ({ mount }) => {
  const component = await mount(
    <TypingIndicator
      typingUsers={[{ userId: '123', displayName: 'User 2' }]}
      styles={{
        root: { padding: 0, margin: 0 },
        typingUserDisplayName: { font: '13px Tahoma , sans-serif;' },
        typingString: { font: '13px Tahoma , sans-serif;' }
      }}
    />
  );
  await expect(component).toContainText('User 2 is typing ...');
  await expect(component).toHaveScreenshot('typing-indicator-test-2.png');
});
