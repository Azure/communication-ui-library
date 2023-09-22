// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { addVideoStream, defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';
import { stableScreenshot } from '../../common/utils';
import { loadCallPage, test } from './fixture';

test.describe('CallWithChat Composite CallWithChat Page Tests', () => {
  test('CallWithChat gallery screen loads correctly', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const eryka = defaultMockRemoteParticipant('Eryka Klein');
    addVideoStream(eryka, true);
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const callState = defaultMockCallAdapterState([paul, eryka, fiona]);
    await loadCallPage(page, serverUrl, callState);
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      `call-with-chat-gallery-screen.png`
    );
  });
});
