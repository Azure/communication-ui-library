// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { expect, Page } from '@playwright/test';
import {
  dataUiId,
  existsOnPage,
  hidePiPiP,
  isTestProfileMobile,
  pageClick,
  stableScreenshot,
  waitForSelector
} from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('Rooms DeviceButton tests for different roles', async () => {
  test('All devices are shown for Presenter', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState([], 'Presenter', true);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    if (await existsOnPage(page, dataUiId(IDS.deviceButton))) {
      await pageClick(page, dataUiId(IDS.deviceButton));
    } else {
      await waitForSelector(page, dataUiId(IDS.moreButton));
      await pageClick(page, dataUiId(IDS.moreButton));
      await waitForSelector(page, dataUiId('call-composite-more-menu-devices-button'));
      await pageClick(page, dataUiId('call-composite-more-menu-devices-button'));
    }

    expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-devices-presenter.png');
  });

  test('All devices are shown for Attendee', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState([], 'Attendee', true);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    if (await existsOnPage(page, dataUiId(IDS.deviceButton))) {
      await pageClick(page, dataUiId(IDS.deviceButton));
    } else {
      await waitForSelector(page, dataUiId(IDS.moreButton));
      await pageClick(page, dataUiId(IDS.moreButton));
      await waitForSelector(page, dataUiId('call-composite-more-menu-devices-button'));
      await pageClick(page, dataUiId('call-composite-more-menu-devices-button'));
    }

    expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-devices-Attendee.png');
  });
});

test.describe('Rooms CallScreen tests for different roles', async () => {
  test('All CallControls are enabled for Presenter', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState([], 'Presenter', true);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-presenter.png');
    if (isTestProfileMobile(testInfo)) {
      await pageClick(page, dataUiId(IDS.moreButton));
      expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-presenter-click-more-button.png');
    }
  });

  test('Screen Share is disabled for Attendee', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState([], 'Attendee', true);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-attendee.png');
    if (isTestProfileMobile(testInfo)) {
      await pageClick(page, dataUiId(IDS.moreButton));
      expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-attendee-click-more-button.png');
    }
  });

  test('Only few CallControls are enabled for Consumer with remote participants', async ({
    page,
    serverUrl
  }, testInfo) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');
    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants, 'Consumer', true);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-consumer-remote-participants.png');
    if (isTestProfileMobile(testInfo)) {
      await pageClick(page, dataUiId(IDS.moreButton));
      expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-consumer-click-more-button.png');
    }
  });
});

test.describe('Rooms Participant RemoveButton tests for different roles', async () => {
  test('Remove button is enabled for Presenter', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants, 'Presenter', true);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState }));
    await openRemoveParticipantMenu(page);
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'rooms-call-remove-participant-presenter.png'
    );
  });

  test('No ellipses button for remote participant items for Attendee', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants, 'Attendee', true);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState }));
    await expectNoRemoveParticipantMenuItem(page);
  });

  test('No ellipses button for remote participant items for Consumer', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants, 'Consumer', true);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState }));
    await expectNoRemoveParticipantMenuItem(page);
  });
});

const openRemoveParticipantMenu = async (page: Page): Promise<void> => {
  await waitForSelector(page, dataUiId(IDS.videoGallery));

  if (await existsOnPage(page, dataUiId('call-composite-participants-button'))) {
    // The control bar is legacy because it has the participant button
    await pageClick(page, dataUiId('call-composite-participants-button'));
    // Look for a people menu item if there is one and click it to show flyout
    // with participant list
    if (await existsOnPage(page, dataUiId('participant-button-people-menu-item'))) {
      await pageClick(page, dataUiId('participant-button-people-menu-item'));
    }
    await page.hover(dataUiId('participant-item'));
    await waitForSelector(page, dataUiId('participant-item-menu-button'));
    await pageClick(page, dataUiId('participant-item-menu-button'));
    await waitForSelector(page, dataUiId('participant-list-remove-participant-button'));
  } else {
    // Click the more button to show the people button on the new control bar
    // in case we are on mobile
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await waitForSelector(page, dataUiId('call-composite-more-menu-people-button'));
    await pageClick(page, dataUiId('call-composite-more-menu-people-button'));
    await hidePiPiP(page);
    await waitForSelector(page, dataUiId('participant-list'));
    await waitForSelector(page, dataUiId('participant-item'));
    await pageClick(page, dataUiId('participant-item'));
    await waitForSelector(page, dataUiId('drawer-menu'));
  }
};

const expectNoRemoveParticipantMenuItem = async (page: Page): Promise<void> => {
  await waitForSelector(page, dataUiId(IDS.videoGallery));

  if (await existsOnPage(page, dataUiId('call-composite-participants-button'))) {
    // The control bar is legacy because it has the participant button
    await pageClick(page, dataUiId('call-composite-participants-button'));
    // Look for a people menu item if there is one and click it to show flyout
    // with participant list
    if (await existsOnPage(page, dataUiId('participant-button-people-menu-item'))) {
      await pageClick(page, dataUiId('participant-button-people-menu-item'));
    }
    await page.hover(dataUiId('participant-item'));
    const menuButton = await page.$$(dataUiId('participant-item-menu-button'));
    if (menuButton.length > 0) {
      await pageClick(page, dataUiId('participant-item-menu-button'));
      const removeParticipantButton = await page.$$(dataUiId('participant-list-remove-participant-button'));
      expect(removeParticipantButton.length).toBe(0);
    }
  } else {
    // Click the more button to show the people button on the new control bar
    // in case we are on mobile
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await waitForSelector(page, dataUiId('call-composite-more-menu-people-button'));
    await pageClick(page, dataUiId('call-composite-more-menu-people-button'));
    await hidePiPiP(page);
    await waitForSelector(page, dataUiId('participant-list'));
    await waitForSelector(page, dataUiId('participant-item'));
    await pageClick(page, dataUiId('participant-item'));
    const removeParticipantButton = await page.$$(dataUiId('participant-list-remove-participant-button'));
    expect(removeParticipantButton.length).toBe(0);
  }
};
