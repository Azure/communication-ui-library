import { test, loadPage } from './fixture';
import { waitForCompositeToLoad } from '../utils';
import { expect } from '@playwright/test';

test.describe('ErrorBar is shown correctly', async () => {
  test('with incorrect thread ID', async ({ testBrowser, serverUrl, users }) => {
    const user = users[0];
    user.threadId = 'INCORRECT_VALUE';
    const page = await loadPage(testBrowser, serverUrl, user);
    await waitForCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-wrong-thread-id.png');
  });
});
