// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { expect, Page, TestInfo } from '@playwright/test';
import {
  dataUiId,
  hidePiPiP,
  isTestProfileDesktop,
  pageClick,
  stableScreenshot,
  waitForSelector
} from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('Rooms DeviceButton tests for different roles', async () => {
  test('All devices are shown for Presenter', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState, roleHint: 'Presenter' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    await waitForSelector(page, dataUiId(IDS.deviceButton));
    await pageClick(page, dataUiId(IDS.deviceButton));
    expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-devices-presenter.png');
  });

  test('All devices are shown for Attendee', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState, roleHint: 'Attendee' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    await waitForSelector(page, dataUiId(IDS.deviceButton));
    await pageClick(page, dataUiId(IDS.deviceButton));
    expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-devices-Attendee.png');
  });
});

test.describe('Rooms CallScreen tests for different roles', async () => {
  test('All CallControls are enabled for Presenter', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState, roleHint: 'Presenter' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-presenter.png');
  });

  test('Screen Share is disabled for Attendee', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState, roleHint: 'Attendee' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-attendee.png');
  });

  test('Only few CallControls are enabled for Consumer with remote participants', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');
    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState, roleHint: 'Consumer' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('rooms-call-screen-consumer-remote-participants.png');
  });
});

/* @conditional-compile-remove(rooms) */
test.describe('Rooms Participant RemoveButton tests for different roles', async () => {
  test('Remove button is enabled for Presenter', async ({ page, serverUrl }, testInfo) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState, roleHint: 'Presenter' }));
    await openRemoveParticipantMenu(page, testInfo);
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'rooms-call-remove-participant-presenter.png'
    );
  });

  test('No ellipses button for remote participant items for Attendee', async ({ page, serverUrl }, testInfo) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState, roleHint: 'Attendee' }));
    await expectNoRemoveParticipantMenuItem(page, testInfo);
  });

  test('No ellipses button for remote participant items for Consumer', async ({ page, serverUrl }, testInfo) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...initialState, roleHint: 'Consumer' }));
    await expectNoRemoveParticipantMenuItem(page, testInfo);
  });
});

const openRemoveParticipantMenu = async (page: Page, testInfo: TestInfo): Promise<void> => {
  await waitForSelector(page, dataUiId(IDS.videoGallery));

  if (isTestProfileDesktop(testInfo)) {
    await waitForSelector(page, dataUiId('call-composite-participants-button'));
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await page.hover(dataUiId('participant-item'));
    await waitForSelector(page, dataUiId('participant-item-menu-button'));
    await pageClick(page, dataUiId('participant-item-menu-button'));
    await waitForSelector(page, dataUiId('participant-list-remove-participant-button'));
  } else {
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

const expectNoRemoveParticipantMenuItem = async (page: Page, testInfo: TestInfo): Promise<void> => {
  await waitForSelector(page, dataUiId(IDS.videoGallery));

  if (isTestProfileDesktop(testInfo)) {
    const menuButton = await page.$$(dataUiId('participant-item-menu-button'));
    expect(menuButton.length).toBe(0);
  } else {
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await waitForSelector(page, dataUiId('call-composite-more-menu-people-button'));
    await pageClick(page, dataUiId('call-composite-more-menu-people-button'));
    await hidePiPiP(page);
    await waitForSelector(page, dataUiId('participant-list'));
    await waitForSelector(page, dataUiId('participant-item'));
    await pageClick(page, dataUiId('participant-item'));
    const drawerMenu = await page.$$(dataUiId('drawer-menu'));
    expect(drawerMenu.length).toBe(0);
  }
};
