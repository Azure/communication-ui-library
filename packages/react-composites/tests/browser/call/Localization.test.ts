// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { waitForCallCompositeToLoad, buildUrl } from '../common/utils';
import { loadNewPageWithPermissionsForCalls } from '../common/fixtureHelpers';
import { waitForCallCompositeToLoad, loadCallScreen, loadUrlInPage } from '../common/utils';
import { expect } from '@playwright/test';
import { v1 as generateGUID } from 'uuid';

test.describe('Localization tests', async () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    const user = users[0];
    user.groupId = newTestGuid;

    // Load different locale for locale tests
    const page = pages[0];
    const url = buildUrl(serverUrl, users[0], { useFrLocale: 'true' });
    await loadUrlInPage(page, url);
    await waitForCallCompositeToLoad(page);
  });

  test('Configuration page title and participant button in call should be localized', async ({ pages }) => {
    const page = pages[0];
    await page.bringToFront();
    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png');

    await loadCallScreen([page]);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png');
  });
});
