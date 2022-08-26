// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { defaultMockCallAdapterState } from '../../call/hermetic/fixture';
import { stableScreenshot } from '../../common/utils';
import { loadCallPage, test } from './fixture';

test.describe('CallWithChat Composite CallWithChat Page Tests', () => {
  test('CallWithChat gallery screen loads correctly', async ({ page, serverUrl }) => {
    await loadCallPage(page, serverUrl, defaultMockCallAdapterState());
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      `call-with-chat-gallery-screen.png`
    );
  });
});
