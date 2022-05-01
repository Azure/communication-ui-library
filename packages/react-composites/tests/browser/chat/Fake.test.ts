// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { sendMessage } from '../common/chatTestHelpers';
import { encodeQueryData } from '../common/utils';
import { test } from './fixture';

const TEST_MESSAGE = 'No, sir, this will not do.';

test.describe('Fake chat adapter test', async () => {
  test('not shown when nothing is wrong', async ({ serverUrl, users, page }) => {
    await page.goto(buildUrlWithFakeChatAdapter(serverUrl, users[0]));
    expect(await page.screenshot()).toMatchSnapshot('fake-chat-adapter-test.png');

    await sendMessage(page, TEST_MESSAGE);
    expect(await page.screenshot()).toMatchSnapshot('fake-chat-adapter-after-message-send-test.png');
  });
});

export const buildUrlWithFakeChatAdapter = (serverUrl: string, qArgs?: { [key: string]: string }): string => {
  return `${serverUrl}?${encodeQueryData({ fakeChat: 'true', ...qArgs })}`;
};
