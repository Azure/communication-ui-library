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
  pageClick,
  waitForSelector,
  stableScreenshot,
  isTestProfileDesktop,
  waitForPiPiPToHaveLoaded,
  isTestProfileStableFlavor
} from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('Participant pane tests', async () => {
  test.only('People pane opens and displays correctly', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileStableFlavor());
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);

    const participants = [paul, defaultMockRemoteParticipant('Eryka Klein'), fiona];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));

    // await waitForSelector(page, dataUiId('call-composite-people-pane'));
    // if (!isTestProfileDesktop(testInfo)) {
    //   await waitForPiPiPToHaveLoaded(page, 2);
    // }

    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('call-screen-with-people-pane.png');
  });

  // test('click on add people button will open dropdown', async ({ page, serverUrl }, testInfo) => {
  //   const participants = [defaultMockRemoteParticipant('Paul Bridges'), defaultMockRemoteParticipant('Eryka Klein')];
  //   const initialState = defaultMockCallAdapterState(participants);
  //   await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
  //   if (isTestProfileDesktop(testInfo)) {
  //     await pageClick(page, dataUiId('call-with-chat-composite-people-button'));
  //     await waitForSelector(page, dataUiId('call-with-chat-composite-people-pane'));
  //     await pageClick(page, dataUiId('call-with-chat-composite-add-people-button'));
  //     await waitForSelector(page, dataUiId('call-with-chat-composite-dial-phone-number-button'));
  //   } else {
  //     await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
  //     const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
  //     await drawerPeopleMenuDiv?.click();
  //     await waitForSelector(page, dataUiId('call-with-chat-composite-people-pane'));
  //     await pageClick(page, dataUiId('call-with-chat-composite-add-people-button'));

  //     await waitForSelector(page, 'div[role="menu"] >> text=Dial phone number');
  //   }

  //   if (!isTestProfileDesktop(testInfo)) {
  //     await waitForPiPiPToHaveLoaded(page, 2);
  //   }
  //   expect(await stableScreenshot(page)).toMatchSnapshot(`call-screen-with-add-people-dropdown.png`);
  // });

  // test('click on dial phone number will open dialpad', async ({ page,serverUrl }, testInfo) => {
  //   const participants = [defaultMockRemoteParticipant('Paul Bridges'), defaultMockRemoteParticipant('Eryka Klein')];
  //   const initialState = defaultMockCallAdapterState(participants);
  //   await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
  //   if (isTestProfileDesktop(testInfo)) {
  //     await pageClick(page, dataUiId('call-with-chat-composite-people-button'));
  //     await waitForSelector(page, dataUiId('call-with-chat-composite-people-pane'));
  //     await pageClick(page, dataUiId('call-with-chat-composite-add-people-button'));
  //     await waitForSelector(page, dataUiId('call-with-chat-composite-dial-phone-number-button'));
  //     await pageClick(page, dataUiId('call-with-chat-composite-dial-phone-number-button'));
  //   } else {
  //     await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
  //     const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
  //     await drawerPeopleMenuDiv?.click();
  //     await waitForSelector(page, dataUiId('call-with-chat-composite-people-pane'));
  //     await pageClick(page, dataUiId('call-with-chat-composite-add-people-button'));

  //     const drawerDialPhoneNumberDiv = await page.$('div[role="menu"] >> text=Dial phone number');
  //     await drawerDialPhoneNumberDiv?.click();
  //   }

  //   await waitForSelector(page, dataUiId('dialpadContainer'));
  //   if (!isTestProfileDesktop(testInfo)) {
  //     await waitForPiPiPToHaveLoaded(page, 2);
  //   }

  //   expect(await stableScreenshot(page)).toMatchSnapshot(`call-screen-with-dialpad.png`);
  // });
});
