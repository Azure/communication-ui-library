// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  temporarilyShowHiddenChatComposite,
  withHiddenChatCompositeInForeground
} from '../../common/hermeticChatTestHelpers';
import { defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';
import {
  sendMessage,
  waitForMessageSeen,
  waitForNMessages,
  waitForTypingIndicatorHidden
} from '../../common/chatTestHelpers';
import {
  dataUiId,
  isTestProfileMobile,
  pageClick,
  perStepLocalTimeout,
  stableScreenshot,
  waitForPiPiPToHaveLoaded,
  waitForSelector
} from '../../common/utils';
import { chatParticipantFor, loadCallPage, test } from './fixture';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { IDS } from '../../common/constants';
import { expect } from '@playwright/test';

test.describe('CallWithChat Composite CallWithChat Page Tests', () => {
  test.only('Chat messages are displayed correctly', async ({ page, serverUrl }, testInfo) => {
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

    // Send a message from remote participant.
    await withHiddenChatCompositeInForeground(page, chatRemoteParticipant, async () => {
      await page.type(
        `[id="hidden-composite-${toFlatCommunicationIdentifier(chatRemoteParticipant.id)}"] ${dataUiId(
          IDS.sendboxTextField
        )}`,
        'I agree!',
        { timeout: perStepLocalTimeout() }
      );
      await page.keyboard.press('Enter');
    });

    // Local participant has both a sent message and a received message.
    await waitForNMessages(page, 2, '#test-app-root');
    await waitForTypingIndicatorHidden(page, '#test-app-root');
    await page.pause();

    if (isTestProfileMobile(testInfo)) {
      await waitForPiPiPToHaveLoaded(page, { skipVideoCheck: true });
    }
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot(
      `call-with-chat-gallery-screen-with-chat-pane.png`
    );
  });
});
