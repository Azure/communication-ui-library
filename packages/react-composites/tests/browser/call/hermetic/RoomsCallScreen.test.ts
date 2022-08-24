// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { expect } from '@playwright/test';
import {
  dataUiId,
  hidePiPiP,
  isTestProfileDesktop,
  isTestProfileStableFlavor,
  pageClick,
  stableScreenshot,
  waitForSelector
} from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('Rooms DeviceButton tests for different roles', async () => {
  test('All devices are shown for Presenter', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Presenter' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    await waitForSelector(page, dataUiId(IDS.deviceButton));
    await pageClick(page, dataUiId(IDS.deviceButton));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'rooms-call-screen-devices-presenter.png'
    );
  });

  test('All devices are shown for Attendee', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Attendee' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    await waitForSelector(page, dataUiId(IDS.deviceButton));
    await pageClick(page, dataUiId(IDS.deviceButton));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'rooms-call-screen-devices-Attendee.png'
    );
  });

  test('Only speakers are shown for Consumer', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');
    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Consumer' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    await waitForSelector(page, dataUiId(IDS.deviceButton));
    await pageClick(page, dataUiId(IDS.deviceButton));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'rooms-call-screen-devices-Consumer.png'
    );
  });
});

test.describe('Rooms CallScreen tests for different roles', async () => {
  test('All CallControls are enabled for Presenter', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Presenter' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('rooms-call-screen-presenter.png');
  });

  test('Screen Share is disabled for Attendee', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Attendee' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('rooms-call-screen-attendee.png');
  });

  test('Only few CallControls are enabled for Consumer with remote participants', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');
    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Consumer' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'rooms-call-screen-consumer-remote-participants.png'
    );
  });
});

test.describe('Rooms Participant RemoveButton tests for different roles', async () => {
  test('Remove button is enabled for Presenter', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileStableFlavor());
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Presenter' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    if (isTestProfileDesktop(testInfo)) {
      await waitForSelector(page, dataUiId('call-composite-participants-button'));
      await pageClick(page, dataUiId('call-composite-participants-button'));
      await waitForSelector(page, dataUiId('participant-item-menu-button'));
      await pageClick(page, dataUiId('participant-item-menu-button'));
    } else {
      await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
      await hidePiPiP(page);
      const participantList = await waitForSelector(page, dataUiId('participant-list'));
      const participantItem = await participantList.$('div[role="menuitem"]');
      await participantItem?.click();
    }
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'rooms-call-remove-participant-presenter.png'
    );
  });

  test.only('Remove button is disabled for Attendee', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileStableFlavor());
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Attendee' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    if (isTestProfileDesktop(testInfo)) {
      await waitForSelector(page, dataUiId('call-composite-participants-button'));
      await pageClick(page, dataUiId('call-composite-participants-button'));
      await waitForSelector(page, dataUiId('participant-item-menu-button'));
      await pageClick(page, dataUiId('participant-item-menu-button'));
    } else {
      await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
      // const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      // await drawerPeopleMenuDiv?.click();
      await waitForSelector(page, dataUiId('call-composite-more-menu-people-button'));
      await pageClick(page, dataUiId('call-composite-more-menu-people-button'));
      await hidePiPiP(page);
      await waitForSelector(page, dataUiId('participant-list'));
      await waitForSelector(page, dataUiId('participant-item'));
      await pageClick(page, dataUiId('participant-item'));
      // await waitForSelector(page, dataUiId('chat-composite-participant-custom-avatar'));
      // const participantItem = await waitForSelector(page, 'div[role="menuitem"]');
      // // await pageClick(page, 'div[role="menuitem"]');
      // await participantItem?.click();
    }
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'rooms-call-remove-participant-attendee.png'
    );
  });

  test('Remove button is disabled for Consumer', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileStableFlavor());
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Consumer' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    if (isTestProfileDesktop(testInfo)) {
      await waitForSelector(page, dataUiId('call-composite-participants-button'));
      await pageClick(page, dataUiId('call-composite-participants-button'));
      await waitForSelector(page, dataUiId('participant-item-menu-button'));
      await pageClick(page, dataUiId('participant-item-menu-button'));
    } else {
      await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
      await hidePiPiP(page);
      const participantList = await waitForSelector(page, dataUiId('participant-list'));
      const participantItem = await participantList.$('div[role="menuitem"]');
      await participantItem?.click();
    }
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'rooms-call-remove-participant-consumer.png'
    );
  });
});
