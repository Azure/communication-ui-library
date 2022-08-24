// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { sendMessage, waitForMessageDelivered } from '../../lib/chatTestHelpers';
import { stableScreenshot, waitForParticipants, waitForSelector } from '../../lib/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';

test.describe('Chat Composite with custom data model', () => {
  test('custom onRenderTypingIndicator and custom onRenderMessage', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        customDataModelEnabled: true,
        showParticipantPane: true
      })
    );
    const testMessageText = 'How the turn tables';
    await sendMessage(page, testMessageText);
    await waitForMessageDelivered(page);
    // Participant list is a beta feature
    if (process.env['COMMUNICATION_REACT_FLAVOR'] !== 'stable') {
      const numParticipants = DEFAULT_FAKE_CHAT_ADAPTER_ARGS.remoteParticipants.length + 1; // number of remote participants + the local participant
      await waitForParticipants(page, numParticipants);
    }
    await waitForSelector(page, '#custom-data-model-typing-indicator');
    await waitForSelector(page, '#custom-data-model-message');
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot('custom-data-model.png');
  });
});
