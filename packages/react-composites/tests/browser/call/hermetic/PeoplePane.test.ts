// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  test
} from './fixture';
import { expect } from '@playwright/test';
import {
  dataUiId,
  isTestProfileDesktop,
  pageClick,
  perStepLocalTimeout,
  stableScreenshot,
  waitForSelector
} from '../../common/utils';
import { IDS } from '../../common/constants';

const flavor = process.env?.['COMMUNICATION_REACT_FLAVOR'];

test.describe('Call composite participant menu items injection tests', async () => {
  // TODO: Split this test into multiple tests: one for beta/desktop, beta/mobile, stable each.
  // Do this after the test has been stabilized. Keep the same name for flakiness analysis.
  test('injected menu items appear', async ({ page, serverUrl }, testInfo) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const participants = [paul, defaultMockRemoteParticipant('Eryka Klein'), fiona];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        injectParticipantMenuItems: 'true'
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    // Open participants flyout.
    await pageClick(page, dataUiId('call-composite-participants-button'));
    if (flavor === 'beta') {
      if (!isTestProfileDesktop(testInfo)) {
        await pageClick(page, '[role="menuitem"]');
      } else {
        await pageClick(page, dataUiId(IDS.participantItemMenuButton));
      }
      await waitForSelector(page, '.ms-ContextualMenu-itemText');
    } else {
      // Open participant list flyout
      await pageClick(page, dataUiId(IDS.participantButtonPeopleMenuItem));
      // There should be at least one participant. Just click on the first.
      await pageClick(page, dataUiId(IDS.participantItemMenuButton) + ' >> nth=0');

      const injectedMenuItem = await waitForSelector(page, dataUiId('test-app-participant-menu-item'));
      await injectedMenuItem.waitForElementState('stable', { timeout: perStepLocalTimeout() });
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(`participant-menu-item-flyout.png`);
  });
});
