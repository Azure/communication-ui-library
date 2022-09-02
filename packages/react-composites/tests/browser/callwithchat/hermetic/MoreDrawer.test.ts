// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';
import { dataUiId, isTestProfileDesktop, pageClick, stableScreenshot } from '../../common/utils';
import { loadCallPage, test } from './fixture';
import { expect } from '@playwright/test';

test.describe('CallWithChat Composite CallWithChat Page Tests', () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    test.skip(isTestProfileDesktop(testInfo), 'There is no More Drawer on desktop');
  });

  test('More Drawer menu opens and displays correctly on mobile', async ({ page, serverUrl }) => {
    const callState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    await loadCallPage(page, serverUrl, callState);
    await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-with-chat-more-drawer-screen.png`);
  });

  test.only('More Drawer Speaker submenu opens and displays correctly on mobile', async ({ page, serverUrl }) => {
    const callState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    await loadCallPage(page, serverUrl, callState);
    await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
    await pageClick(page, 'div[role="menu"] >> text=Speaker');
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-with-chat-more-drawer-submenu-speaker-screen.png`);
  });
});
