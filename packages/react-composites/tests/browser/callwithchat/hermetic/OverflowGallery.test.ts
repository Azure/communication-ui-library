// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { MockCallAdapterState } from '../../../common';
import { addVideoStream, defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';
import { IDS } from '../../common/constants';
import { dataUiId, isTestProfileMobile, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { loadCallPage, test } from './fixture';

test.describe.only('Overflow gallery tests', async () => {
  test('Overflow gallery should be present when people or chat pane are open', async ({
    page,
    serverUrl
  }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = createInitialStateWithManyAudioParticipants();
    await loadCallPage(page, serverUrl, initialState);

    await waitForSelector(page, dataUiId(IDS.videoGallery));
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

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-many-participants-rtl.png');

    await waitForSelector(page, dataUiId('call-with-chat-composite-people-button'));
    await pageClick(page, dataUiId('call-with-chat-composite-people-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-people-pane-open-rtl.png');
    await waitForSelector(page, dataUiId('call-with-chat-composite-chat-button'));
    await pageClick(page, dataUiId('call-with-chat-composite-chat-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-chat-pane-open-rtl.png');
  });
});

const createInitialStateWithManyAudioParticipants = (): MockCallAdapterState => {
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
