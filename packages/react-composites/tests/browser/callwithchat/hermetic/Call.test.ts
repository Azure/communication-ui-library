// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { stableScreenshot } from '../../common/utils';

test.describe('CallWithChat Composite CallWithChat Page Tests', () => {
  test('CallWithChat gallery screen loads correctly', async ({ pages }) => {
    const page = pages[0];
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      `call-with-chat-gallery-screen.png`
    );
  });
});
