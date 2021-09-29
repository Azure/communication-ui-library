// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { waitForCallCompositeToLoad, loadCallScreenWithParticipantVideos, buildUrl } from '../common/utils';
import { loadNewPageWithPermissionsForCalls } from '../common/fixtureHelpers';
import { expect } from '@playwright/test';

test.describe('Localization tests', async () => {
  test('Configuration page title and participant button in call should be localized', async ({
    serverUrl,
    users,
    testBrowser
  }) => {
    const url = buildUrl(serverUrl, users[0], { useFrLocale: 'true' });
    const page = await loadNewPageWithPermissionsForCalls(testBrowser, url);
    await page.bringToFront();
    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png');

    await loadCallScreenWithParticipantVideos([page]);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png');
  });
});
