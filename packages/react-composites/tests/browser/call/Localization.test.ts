// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { waitForCallCompositeToLoad, sleep } from '../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';

import { loadPageWithPermissionsForCalls, loadCallScreen } from '../common/utils';
import { v1 } from 'uuid';

test.describe('Localization tests', async () => {
  // test.beforeEach(async ({ pages }) => {
  //   for (const page of pages) {
  //     // Ensure any previous call users from prior tests have left the call
  //     await page.reload();
  //     await sleep(2000);
  //   }
  // });

  test('Configuration page title and participant button in call should be localized', async ({
    serverUrl,
    users,
    testBrowser
  }) => {
    console.log('locale test 1');
    const newCallGuid = v1();
    users[0].groupId = newCallGuid;
    const page = await loadPageWithPermissionsForCalls(testBrowser, serverUrl, users[0], { useFrlocale: 'true' });
    page.on('console', (msg) => {
      const doNotLogMessages = [
        'The icon "',
        'ECS - Config fetch complete',
        'ECS - Delaying User config fetch until we have a valid SkypeToken'
      ];

      const messageText = msg.text();
      if (
        messageText.startsWith(doNotLogMessages[0]) ||
        messageText.startsWith(doNotLogMessages[1]) ||
        messageText.startsWith(doNotLogMessages[2])
      )
        return;

      if (msg.type() === 'error') {
        console.log(`PAGE2 CONSOLE ERROR TEXT: "${msg.text()}"`);
        console.log(msg.args());
        console.log(msg.location());
      } else {
        console.log(`console message: "${msg.text()}"`);
        console.log(msg.args());
        console.log(msg.location());
      }
    });
    console.log('locale test 2');
    await page.bringToFront();
    console.log('locale test 3');
    await waitForCallCompositeToLoad(page);
    console.log('locale test 4');
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });
    console.log('locale test 5');

    await loadCallScreen([page]);
    console.log('locale test 6');
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
    console.log('locale test 7');
  });
});
