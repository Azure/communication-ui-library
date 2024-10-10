// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { expect } from '@playwright/test';
import { withHiddenChatCompositeInForeground } from '../../common/hermeticChatTestHelpers';
import { IDS } from '../../common/constants';
import { dataUiId, stableScreenshot } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';

test.describe('Tests related to typing indicator', async () => {
  test('page can view typing indicator within 10s', async ({ serverUrl, page }) => {
    const typingParticipant = DEFAULT_FAKE_CHAT_ADAPTER_ARGS.remoteParticipants[0];
    if (!typingParticipant) {
      throw new Error('No remote participants found');
    }
    page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        participantsWithHiddenComposites: [typingParticipant]
      })
    );

    await withHiddenChatCompositeInForeground(page, typingParticipant, async () => {
      // Type on typing participant's send box to trigger typing indicator
      await page.type(
        `#hidden-composite-${toFlatCommunicationIdentifier(typingParticipant.id)} ${dataUiId(IDS.sendboxTextField)}`,
        'How the turn tables'
      );
    });

    const indicator = await page.$(dataUiId(IDS.typingIndicator));

    expect(await indicator?.innerHTML()).toContain(typingParticipant.displayName);
    expect(await stableScreenshot(page)).toMatchSnapshot('typing-indicator.png');

    // TODO: Use waitForAndHideTypingIndicator
    // Advance time by 10 seconds to make typing indicator go away
    await page.evaluate(() => {
      const currentDate = new Date();
      currentDate.setSeconds(currentDate.getSeconds() + 10);
      Date.now = () => currentDate.getTime();
    });
    await page.waitForTimeout(1000);
    const indicatorAfter10Seconds = await page.$(dataUiId(IDS.typingIndicator));
    expect(await indicatorAfter10Seconds?.innerHTML()).toBeFalsy();
    expect(await stableScreenshot(page)).toMatchSnapshot('typing-indicator-disappears.png');
  });
});
