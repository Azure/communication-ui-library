// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { loadCallPage, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, pageClick, stableScreenshot } from '../../common/utils';
import type { CallWithChatCompositeOptions } from '../../../../src';
import { defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';

test.describe('Custom call control options tests', () => {
  test('Control bar buttons correctly show as compact with camera disabled and end call button hidden', async ({
    page,
    serverUrl
  }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const testOptions: CallWithChatCompositeOptions = {
      callControls: {
        displayType: 'compact',
        cameraButton: {
          disabled: true
        },
        endCallButton: false,
        microphoneButton: true,
        moreButton: undefined
      }
    };
    const callState = defaultMockCallAdapterState([paul]);
    await loadCallPage(page, serverUrl, callState, {
      customCompositeOptions: JSON.stringify(testOptions)
    });

    expect(await stableScreenshot(page)).toMatchSnapshot(`user-set-control-bar-button-options.png`);
  });

  test('Control bar custom buttons render correctly', async ({ page, serverUrl }) => {
    const callState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    await loadCallPage(page, serverUrl, callState, {
      injectCustomButtons: 'true',
      customCompositeOptions: JSON.stringify({
        callControls: {
          cameraButton: false,
          microphoneButton: false,
          screenShareButton: false,
          peopleButton: false,
          chatButton: false
        }
      })
    });

    await pageClick(page, dataUiId('call-with-chat-composite-more-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`call-with-chat-custom-buttons.png`);
  });
});
