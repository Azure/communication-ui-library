// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { loadCallPage, test } from './fixture';
import { expect } from '@playwright/test';
import { stableScreenshot } from '../../common/utils';
import type { CallWithChatCompositeOptions } from '../../../../src';
import { defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';

test.describe('Custom call control options tests', () => {
  test.only('Control bar buttons correctly show as compact with camera disabled and mic hidden', async ({
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
        microphoneButton: false,
        endCallButton: true,
        moreButton: undefined
      }
    };
    const callState = defaultMockCallAdapterState([paul]);
    await loadCallPage(page, serverUrl, callState, {
      customCompositeOptions: JSON.stringify(testOptions)
    });

    expect(await stableScreenshot(page)).toMatchSnapshot(`user-set-control-bar-button-options.png`);
  });
});
