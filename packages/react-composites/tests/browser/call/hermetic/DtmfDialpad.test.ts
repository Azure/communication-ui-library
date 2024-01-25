// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import {
  dataUiId,
  isTestProfileDesktop,
  isTestProfileLandscapeMobile,
  isTestProfileMobile,
  pageClick,
  stableScreenshot,
  waitForSelector
} from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';

/* @conditional-compile-remove(PSTN-calls) */
test.describe('Dtmf dialpad tests', async () => {
  test('Dtmf dialpad should render in 1:1 PSTN call', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');

    const participant = [paul];
    const initialState = defaultMockCallAdapterState(participant);
    initialState.targetCallees = [{ phoneNumber: '+14255550123', rawId: '4:14255550123' }];

    //PSTN call has alternate caller id
    initialState.alternateCallerId = '+1676568678999';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));

    await waitForSelector(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    const moreButtonShowDialpadButton = await page.$('div[role="menu"] >> text="Show dialpad"');
    await moreButtonShowDialpadButton?.click();
    await waitForSelector(page, dataUiId('dialpadContainer'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-Dtmf-Dialpad.png`);
  });
  test('Dtmf dialpad should not render in non-PSTN call', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));

    await waitForSelector(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, dataUiId('common-call-composite-more-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`Dtmf-Dialpad-Hidden-Non-PSTN.png`);
  });
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(dtmf-dialer) */
  test.only('More Button menu opens and shows dialpad Control', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo) || isTestProfileLandscapeMobile(testInfo));
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    initialState.targetCallees = [{ phoneNumber: '+14255550123', rawId: '4:14255550123' }];

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));

    await pageClick(page, dataUiId('common-call-composite-more-button'));
    const moreButtonShowDialpadButton = await page.$('div[role="menu"] >> text="Hide dialpad"');
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-more-button-dtmf-dialpad.png`);
    await moreButtonShowDialpadButton?.click();
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-more-button-dtmf-dialpad-closed.png`);
  });
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(dtmf-dialer) */
  test.only('More Drawer menu opens and shows dialpad Control', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileDesktop(testInfo));
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    initialState.targetCallees = [{ phoneNumber: '+14255550123', rawId: '4:14255550123' }];

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId('common-call-composite-more-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-dtmf-dialpad-mobile.png`);
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    const moreButtonShowDialpadButton = await page.$('div[role="menu"] >> text="Hide dialpad"');
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-more-drawer-dtmf-dialpad.png`);
    await moreButtonShowDialpadButton?.click();
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-more-drawer-dtmf-dialpad-closed.png`);
  });
});
