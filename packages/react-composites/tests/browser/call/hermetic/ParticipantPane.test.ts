// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import {
  dataUiId,
  hidePiPiP,
  isTestProfileDesktop,
  isTestProfileStableFlavor,
  pageClick,
  stableScreenshot,
  waitForSelector
} from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';

test.describe('Participant pane tests', async () => {
  test('People pane opens and displays correctly', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));

    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('call-screen-with-people-pane.png');
  });

  test('click on add people button will show no options for ACS group call', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));

    await waitForSelector(page, dataUiId('call-composite-people-pane'));

    await pageClick(page, dataUiId('call-add-people-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`ACS-group-call-screen-with-empty-dropdown.png`);
  });

  test('click on add people button will show dialpad option for PSTN call', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    //PSTN call has alternate caller id
    initialState.alternateCallerId = '+1676568678999';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));

    await waitForSelector(page, dataUiId('call-composite-people-pane'));

    await pageClick(page, dataUiId('call-add-people-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`PSTN-call-screen-with-dialpad-dropdown.png`);
  });

  test('click on dial phone number will open dialpad in PTSC call', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    //PSTN call has alternate caller id
    initialState.alternateCallerId = '+1676568678999';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));

    await waitForSelector(page, dataUiId('call-composite-people-pane'));

    await pageClick(page, dataUiId('call-add-people-button'));

    if (isTestProfileDesktop(testInfo)) {
      await waitForSelector(page, dataUiId('call-dial-phone-number-button'));
      await pageClick(page, dataUiId('call-dial-phone-number-button'));
    } else {
      await waitForSelector(page, dataUiId('call-add-people-dropdown'));
      const drawerDialPhoneNumberDiv = await page.$('div[role="menu"] >> text=Dial phone number');
      await drawerDialPhoneNumberDiv?.click();
    }

    expect(await stableScreenshot(page)).toMatchSnapshot(`PSTN-call-screen-with-dialpad.png`);
  });

  test.only('callee participant is displayed with connection state', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    paul.state = 'Connecting';
    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await waitForSelector(page, dataUiId('call-composite-people-pane'));
    await hidePiPiP(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('PSTN-participant-pane-callee-name.png');
  });

  test.only('callee participant name and connection state are truncated', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());
    const longPaul = defaultMockRemoteParticipant(
      'I have a really really really really long name. Trust me you dont wanna know.'
    );
    longPaul.state = 'Connecting';
    const participants = [longPaul];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await waitForSelector(page, dataUiId('call-composite-people-pane'));
    await hidePiPiP(page);
    const participantStringId = dataUiId('participant-item-state-string');
    await page.evaluate((participantStringId) => {
      const el = document.querySelector(participantStringId);
      if (el) {
        el.textContent = 'Long Calling String...';
      }
    }, participantStringId);
    expect(await stableScreenshot(page)).toMatchSnapshot('PSTN-participant-pane-callee-name-truncation.png');
  });
});
