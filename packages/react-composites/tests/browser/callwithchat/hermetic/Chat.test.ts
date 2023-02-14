// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  sendMessageFromHiddenChatComposite,
  temporarilyShowHiddenChatComposite
} from '../../common/hermeticChatTestHelpers';
import { defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';
import {
  sendMessage,
  waitForMessageSeen,
  waitForNMessages,
  waitForAndHideTypingIndicator
} from '../../common/chatTestHelpers';
import {
  dataUiId,
  isTestProfileMobile,
  pageClick,
  stableScreenshot,
  waitForFunction,
  waitForPiPiPToHaveLoaded,
  waitForSelector
} from '../../common/utils';
import { APP_UNDER_TEST_ROOT_SELECTOR, chatParticipantFor, loadCallPage, test } from './fixture';
import { expect } from '@playwright/test';

test.describe('CallWithChat Composite CallWithChat Page Tests', () => {
  test('Chat messages are displayed correctly', async ({ page, serverUrl }, testInfo) => {
    const remoteParticipant = defaultMockRemoteParticipant('Paul Bridges');
    const chatRemoteParticipant = chatParticipantFor(remoteParticipant);
    const callState = defaultMockCallAdapterState([remoteParticipant]);
    await loadCallPage(page, serverUrl, callState);

    // Send a message from local participant.
    await pageClick(page, dataUiId('call-with-chat-composite-chat-button'));
    await waitForSelector(page, dataUiId('call-with-chat-composite-chat-pane'));
    await sendMessage(page, 'Call with Chat composite is awesome!');

    await temporarilyShowHiddenChatComposite(page, chatRemoteParticipant);
    await waitForMessageSeen(page);

    await sendMessageFromHiddenChatComposite(page, chatRemoteParticipant, 'I agree!');

    await waitForAndHideTypingIndicator(page, APP_UNDER_TEST_ROOT_SELECTOR);
    // Local participant has both a sent message and a received message.
    await waitForNMessages(page, 2, APP_UNDER_TEST_ROOT_SELECTOR);

    if (isTestProfileMobile(testInfo)) {
      await waitForPiPiPToHaveLoaded(page, { skipVideoCheck: true });
    }
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot(
      `call-with-chat-gallery-screen-with-chat-pane.png`
    );
  });

  test('Unread chat message button badge are displayed correctly for <9 messages', async ({ page, serverUrl }) => {
    const remoteParticipant = defaultMockRemoteParticipant('Paul Bridges');
    const chatRemoteParticipant = chatParticipantFor(remoteParticipant);
    const callState = defaultMockCallAdapterState([remoteParticipant]);
    await loadCallPage(page, serverUrl, callState);

    await sendMessageFromHiddenChatComposite(page, chatRemoteParticipant, 'I agree!');
    await waitForSelector(page, dataUiId('call-with-chat-composite-chat-button-unread-icon'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-with-chat-gallery-screen-with-one-unread-messages.png`);
  });

  test('Unread chat message button badge are displayed correctly for >9 messages', async ({ page, serverUrl }) => {
    const remoteParticipant = defaultMockRemoteParticipant('Paul Bridges');
    const chatRemoteParticipant = chatParticipantFor(remoteParticipant);
    const callState = defaultMockCallAdapterState([remoteParticipant]);
    await loadCallPage(page, serverUrl, callState);

    for (let i = 0; i < 10; i++) {
      await sendMessageFromHiddenChatComposite(page, chatRemoteParticipant, `Message # ${i}`);
    }

    await waitForFunction(
      page,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (args: any) => {
        const { rootSelector, selector } = args;
        const root = document.querySelector(rootSelector);
        const badge = root.querySelector(selector);
        return badge && badge.innerText.includes('9+');
      },
      {
        rootSelector: APP_UNDER_TEST_ROOT_SELECTOR,
        selector: dataUiId('call-with-chat-composite-chat-button-unread-icon')
      }
    );
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-with-chat-gallery-screen-with-10-unread-messages.png`);
  });
});
