// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { encodeQueryData } from '../common/utils';
import { test } from './fixture';

test.describe('Fake chat adapter test', async () => {
  test('not shown when nothing is wrong', async ({ serverUrl, users, page }) => {
    await page.goto(buildUrlWithFakeChatAdapter(serverUrl, users[0]));
    // await waitForChatCompositeToLoad(page);
    // await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('fake-chat-adapter-test.png');
  });
});

export const buildUrlWithFakeChatAdapter = (serverUrl: string, qArgs?: { [key: string]: string }): string => {
  return `${serverUrl}?${encodeQueryData({ fakeChat: 'true', ...qArgs })}`;
};
