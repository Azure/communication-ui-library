// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import {
  loadPageWithPermissionsForCalls,
  waitForCallCompositeToLoad,
  loadCallScreenWithParticipantVideos
} from '../common/utils';
import { expect } from '@playwright/test';

test.describe('Localization tests', async () => {
  test('Configuration page title and participant button in call should be localized', async ({
    serverUrl,
    users,
    testBrowser
  }) => {
    const page = await loadPageWithPermissionsForCalls(testBrowser, serverUrl, users[0], { useFrlocale: 'true' });
    await page.bringToFront();
    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });

    await loadCallScreenWithParticipantVideos([page]);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
  });
});
