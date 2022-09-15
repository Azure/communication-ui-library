// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  addDefaultMockLocalVideoStreamState,
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  test
} from './fixture';
import { expect } from '@playwright/test';
import {
  dataUiId,
  isTestProfileDesktop,
  isTestProfileStableFlavor,
  pageClick,
  perStepLocalTimeout,
  stableScreenshot,
  waitForPiPiPToHaveLoaded,
  waitForSelector
} from '../../common/utils';
import { IDS } from '../../common/constants';

const flavor = process.env?.['COMMUNICATION_REACT_FLAVOR'];

// TODO(prprabhu): Merge the two tests below in a single `describe`
// after metrics show that the tests have been stabilized.
test.describe('Call Composite E2E CallPage Tests', () => {
  // TODO: Split this test into multiple tests: one for beta/desktop, beta/mobile, stable each.
  // Do this after the test has been stabilized. Keep the same name for flakiness analysis.
  test('participant list loads correctly', async ({ page, serverUrl }, testInfo) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const participants = [
      paul,
      defaultMockRemoteParticipant('Eryka Klein'),
      defaultMockRemoteParticipant('Fiona Harper')
    ];

    const initialState = defaultMockCallAdapterState(participants);
    addDefaultMockLocalVideoStreamState(initialState);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    if (!isTestProfileDesktop(testInfo) && !isTestProfileStableFlavor()) {
      await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    } else {
      await pageClick(page, dataUiId('call-composite-participants-button'));
    }
    if (flavor === 'stable') {
      const buttonCallOut = await waitForSelector(page, '.ms-Callout');
      // This will ensure no animation is happening for the callout
      await buttonCallOut.waitForElementState('stable');
    } else {
      await waitForSelector(page, dataUiId('call-composite-people-pane'));
      if (!isTestProfileDesktop(testInfo)) {
        await waitForPiPiPToHaveLoaded(page, { skipVideoCheck: true });
      }
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-flyout.png`);
  });

  test('participant list opens and displays ellipses if passing in custom icon for desktop', async ({
    page,
    serverUrl
  }, testInfo) => {
    //only run this test on desktop
    test.skip(!isTestProfileDesktop(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const participants = [paul, defaultMockRemoteParticipant('Eryka Klein'), fiona];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        showParticipantItemIcon: 'true'
      })
    );
    await pageClick(page, dataUiId('call-composite-participants-button'));

    if (flavor === 'stable') {
      const buttonCallOut = await waitForSelector(page, '.ms-Callout');
      // This will ensure no animation is happening for the callout
      await buttonCallOut.waitForElementState('stable');
    } else {
      await waitForSelector(page, dataUiId('call-composite-people-pane'));
      if (!isTestProfileDesktop(testInfo)) {
        await waitForPiPiPToHaveLoaded(page, { skipVideoCheck: true });
      }
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(
      `video-gallery-page-participants-flyout-custom-ellipses-desktop.png`
    );
  });

  test('participant list should not contain ellipses on mobile even if passing in custom icon', async ({
    page,
    serverUrl
  }, testInfo) => {
    //only run this test on mobile
    test.skip(isTestProfileDesktop(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const participants = [paul, defaultMockRemoteParticipant('Eryka Klein'), fiona];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        showParticipantItemIcon: 'true'
      })
    );

    if (!isTestProfileStableFlavor()) {
      await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    } else {
      await pageClick(page, dataUiId('call-composite-participants-button'));
    }

    if (flavor === 'stable') {
      const buttonCallOut = await waitForSelector(page, '.ms-Callout');
      // This will ensure no animation is happening for the callout
      await buttonCallOut.waitForElementState('stable');
    } else {
      await waitForSelector(page, dataUiId('call-composite-people-pane'));
      if (!isTestProfileDesktop(testInfo)) {
        await waitForPiPiPToHaveLoaded(page, { skipVideoCheck: true });
      }
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(
      `video-gallery-page-participants-flyout-no-ellipses-mobile.png`
    );
  });
});

test.describe('Call composite participant menu items injection tests', async () => {
  // TODO: Split this test into multiple tests: one for beta/desktop, beta/mobile, stable each.
  // Do this after the test has been stabilized. Keep the same name for flakiness analysis.
  test('injected menu items appear', async ({ page, serverUrl }, testInfo) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const participants = [paul, defaultMockRemoteParticipant('Eryka Klein'), fiona];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        injectParticipantMenuItems: 'true'
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    // Open participants flyout.
    if (!isTestProfileDesktop(testInfo) && !isTestProfileStableFlavor()) {
      await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    } else {
      await pageClick(page, dataUiId('call-composite-participants-button'));
    }
    if (flavor === 'beta') {
      if (!isTestProfileDesktop(testInfo)) {
        // click the first participant
        await pageClick(page, `${dataUiId('participant-list')} [role="menuitem"]`);
        // wait for drawer to have opened
        await waitForSelector(page, dataUiId('drawer-menu'));
      } else {
        await page.hover(dataUiId('participant-item'));
        await pageClick(page, dataUiId(IDS.participantItemMenuButton));
        await waitForSelector(page, '.ms-ContextualMenu-itemText');
      }
    } else {
      // Open participant list flyout
      await pageClick(page, dataUiId(IDS.participantButtonPeopleMenuItem));
      await page.hover(dataUiId('participant-item') + ' >> nth=0');
      // There should be at least one participant. Just click on the first.
      await pageClick(page, dataUiId(IDS.participantItemMenuButton) + ' >> nth=0');

      const injectedMenuItem = await waitForSelector(page, dataUiId('test-app-participant-menu-item'));
      await injectedMenuItem.waitForElementState('stable', { timeout: perStepLocalTimeout() });
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(`participant-menu-item-flyout.png`);
  });
});
