// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { addVideoStream, defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';
import { stableScreenshot } from '../../common/utils';
import { loadCallPage, test } from './fixture';
import { exec } from 'node:child_process';

test.describe('CallWithChat Composite CallWithChat Page Tests', () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    exec('free -m', (err, output) => {
      // once the command has completed, the callback function is called
      if (err) {
        // log and return if we encounter an error
        console.error('could not execute command: ', err);
        return;
      }
      // log the output received from the command
      console.log(`RAM during test ${JSON.stringify(testInfo.title)}: \n`, output);
    });
  });

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
