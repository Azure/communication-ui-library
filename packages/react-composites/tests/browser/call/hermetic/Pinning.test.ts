// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  test
} from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, waitForSelector, stableScreenshot, isTestProfileMobile, pageClick } from '../../common/utils';
import { IDS } from '../../common/constants';

const displayNames = [
  'Tony Hawk',
  'Marie Curie',
  'Gal Gadot',
  'Margaret Atwood',
  'Kobe Bryant',
  "Conan O'Brien",
  'Paul Bridges',
  'Fiona Harper',
  'Reina Takizawa',
  'Vasily Podkolzin',
  'Antonie van Leeuwenhoek',
  'Luciana Rodriguez'
];

test.describe('PIN - Pinning tests', async () => {
  test('Pin and unpin remote participants via video tile', async ({ page, serverUrl }, testInfo) => {
    const participants = displayNames.map((name) => defaultMockRemoteParticipant(name));
    if (participants[1]) {
      addVideoStream(participants[1], true);
    }
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    const videoGallery = await waitForSelector(page, dataUiId(IDS.videoGallery));

    expect(await stableScreenshot(page)).toMatchSnapshot('PIN-1-1-pin-video-tile-before.png');

    const isMobile = isTestProfileMobile(testInfo);
    if (isMobile) {
      const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=2`);
      await videoTile.dispatchEvent('touchstart');
      await pageClick(page, 'div[role="menu"] >> text=Pin for me');
    } else {
      const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=2`);
      await videoTile.hover();
      const moreButton = await videoTile.waitForSelector(dataUiId(IDS.videoTileMoreOptionsButton));
      await moreButton.hover();
      await moreButton.click();
      await waitForSelector(page, dataUiId('video-tile-pin-participant-button'));
      await pageClick(page, dataUiId('video-tile-pin-participant-button'));
    }

    expect(await stableScreenshot(page)).toMatchSnapshot('PIN-1-2-pin-video-tile-after.png');

    if (isMobile) {
      const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=1`);
      await videoTile.dispatchEvent('touchstart');
      await page.waitForSelector(dataUiId('drawer-menu'));
    } else {
      const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=1`);
      await videoTile.hover();
      const moreButton = await videoTile?.waitForSelector(dataUiId(IDS.videoTileMoreOptionsButton));
      await moreButton?.hover();
      await moreButton?.click();
    }

    expect(await stableScreenshot(page)).toMatchSnapshot('PIN-1-3-unpin-video-tile-before.png');

    if (isMobile) {
      await pageClick(page, 'div[role="menu"] >> text=Unpin');
    } else {
      await pageClick(page, dataUiId('video-tile-unpin-participant-button'));
    }

    expect(await stableScreenshot(page)).toMatchSnapshot('PIN-1-4-unpin-video-tile-after.png');
  });

  test('Pin and unpin remote participants via participant item', async ({ page, serverUrl }, testInfo) => {
    const participants = displayNames.map((name) => defaultMockRemoteParticipant(name));
    if (participants[1]) {
      addVideoStream(participants[1], true);
    }
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));

    expect(await stableScreenshot(page)).toMatchSnapshot('PIN-2-1-pin-participant-item-before.png');

    const isMobile = isTestProfileMobile(testInfo);
    if (isMobile) {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
      await pageClick(page, dataUiId('participant-item'));
      await pageClick(page, 'div[role="menu"] >> text=Pin for me');
      await pageClick(page, 'button[aria-label="Back"]');
    } else {
      await pageClick(page, dataUiId('common-call-composite-people-button'));
      const participantItem = await page.waitForSelector(dataUiId('participant-item'));
      await participantItem.hover();
      await pageClick(page, dataUiId(IDS.participantItemMenuButton));
      await pageClick(page, dataUiId('participant-item-pin-participant-button'));
    }

    expect(await stableScreenshot(page)).toMatchSnapshot('PIN-2-2-pin-participant-item-after.png');

    if (isMobile) {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
      await pageClick(page, dataUiId('participant-item'));
    } else {
      const participantItem = await page.waitForSelector(dataUiId('participant-item'));
      await participantItem.hover();
      await pageClick(page, dataUiId(IDS.participantItemMenuButton));
    }

    expect(await stableScreenshot(page)).toMatchSnapshot('PIN-2-3-unpin-participant-item-before.png');

    if (isMobile) {
      await pageClick(page, 'div[role="menu"] >> text=Unpin');
      await pageClick(page, 'button[aria-label="Back"]');
    } else {
      await pageClick(page, dataUiId('participant-item-unpin-participant-button'));
    }

    expect(await stableScreenshot(page)).toMatchSnapshot('PIN-2-4-unpin-participant-item-after.png');
  });

  test('Pin max remote participants', async ({ page, serverUrl }, testInfo) => {
    const participants = displayNames.map((name) => defaultMockRemoteParticipant(name));
    if (participants[1]) {
      addVideoStream(participants[1], true);
    }
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    const videoGallery = await waitForSelector(page, dataUiId(IDS.videoGallery));

    const isMobile = isTestProfileMobile(testInfo);
    if (isMobile) {
      for (let i = 0; i < 4; i++) {
        const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=-1`);
        await videoTile.dispatchEvent('touchstart');
        await pageClick(page, 'div[role="menu"] >> text=Pin for me');
      }

      const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=-1`);
      await videoTile.dispatchEvent('touchstart');
      await page.waitForSelector(dataUiId('drawer-menu'));
    } else {
      for (let i = 0; i < 4; i++) {
        const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=-1`);
        await videoTile.hover();
        const moreButton = await videoTile.waitForSelector(dataUiId(IDS.videoTileMoreOptionsButton));
        await moreButton.hover();
        await moreButton.click();
        await waitForSelector(page, dataUiId('video-tile-pin-participant-button'));
        await pageClick(page, dataUiId('video-tile-pin-participant-button'));
      }

      const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=-1`);
      await videoTile.hover();
      const moreButton = await videoTile?.waitForSelector(dataUiId(IDS.videoTileMoreOptionsButton));
      await moreButton?.hover();
      await moreButton?.click();
    }

    expect(await stableScreenshot(page)).toMatchSnapshot('PIN-3-1-pin-max-tiles.png');
  });
});
