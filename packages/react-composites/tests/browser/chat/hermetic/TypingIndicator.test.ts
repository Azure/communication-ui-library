// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { expect } from '@playwright/test';
import { withHiddenChatCompositeInForeground } from '../../common/hermeticChatTestHelpers';
import { IDS } from '../../common/constants';
import { dataUiId, stableScreenshot } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';
import { exec } from 'node:child_process';

test.describe('Tests related to typing indicator', async () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    let freeRam = 0;
    while (freeRam < 1000) {
      exec("free -m | awk 'NR==2 {print $4}'", (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
          // log and return if we encounter an error
          console.error('could not execute command: ', err);
          return;
        }
        // log the output received from the command
        console.log(`Free RAM during test ${JSON.stringify(testInfo.title)}: \n`, output);
        freeRam = parseInt(output);
      });
      if (freeRam >= 1000) {
        return;
      }
      console.log(`${freeRam}MB is not enough RAM for test ${JSON.stringify(testInfo.title)}. Waiting 10s...\n`);
      await new Promise((r) => setTimeout(r, 10000));
    }
  });
  test('page can view typing indicator within 10s', async ({ serverUrl, page }) => {
    const typingParticipant = DEFAULT_FAKE_CHAT_ADAPTER_ARGS.remoteParticipants[0];
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
