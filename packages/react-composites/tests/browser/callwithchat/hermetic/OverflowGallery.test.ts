// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { addVideoStream, defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';
import { dataUiId, isTestProfileMobile, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { loadCallPage, test } from './fixture';

test.describe('Overflow gallery tests', async () => {
  test('Overflow gallery should be present when people or chat pane are open', async ({
    page,
    serverUrl
  }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = createInitialStateWithManyAudioParticipants();
    await loadCallPage(page, serverUrl, initialState);

    // wait for responsive-horizontal-gallery or responsive-vertical-gallery to be present
    expect(
      (await page.isVisible(dataUiId('responsive-horizontal-gallery'))) ||
        (await page.isVisible(dataUiId('responsive-vertical-gallery')))
    ).toBeTruthy();
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-many-participants.png');

    await waitForSelector(page, dataUiId('call-with-chat-composite-people-button'));
    await pageClick(page, dataUiId('call-with-chat-composite-people-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-people-pane-open.png');
    await waitForSelector(page, dataUiId('call-with-chat-composite-chat-button'));
    await pageClick(page, dataUiId('call-with-chat-composite-chat-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-chat-pane-open.png');
  });

  test('Overflow gallery should be present when people or chat pane are open in right-to-left', async ({
    page,
    serverUrl
  }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = createInitialStateWithManyAudioParticipants();
    await loadCallPage(page, serverUrl, initialState, { rtl: 'true' });

    // wait for responsive-horizontal-gallery or responsive-vertical-gallery to be present
    expect(
      (await page.isVisible(dataUiId('responsive-horizontal-gallery'))) ||
        (await page.isVisible(dataUiId('responsive-vertical-gallery')))
    ).toBeTruthy();
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-many-participants-rtl.png');

    await waitForSelector(page, dataUiId('call-with-chat-composite-people-button'));
    await pageClick(page, dataUiId('call-with-chat-composite-people-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-people-pane-open-rtl.png');
    await waitForSelector(page, dataUiId('call-with-chat-composite-chat-button'));
    await pageClick(page, dataUiId('call-with-chat-composite-chat-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-chat-pane-open-rtl.png');
  });
});

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const createInitialStateWithManyAudioParticipants = () => {
  const paul = defaultMockRemoteParticipant('Paul Bridges');
  addVideoStream(paul, true);
  paul.isSpeaking = true;
  const fiona = defaultMockRemoteParticipant('Fiona Harper');
  addVideoStream(fiona, true);
  const reina = defaultMockRemoteParticipant('Reina Takizawa');
  reina.isSpeaking = true;
  const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');
  vasily.isMuted = true;

  const participants = [
    paul,
    defaultMockRemoteParticipant('Eryka Klein'),
    fiona,
    defaultMockRemoteParticipant('Pardeep Singh'),
    reina,
    vasily,
    defaultMockRemoteParticipant('Luciana Rodriguez'),
    defaultMockRemoteParticipant('Antonie van Leeuwenhoek'),
    defaultMockRemoteParticipant('Gerald Ho')
  ];
  const initialState = defaultMockCallAdapterState(participants);
  return initialState;
};
