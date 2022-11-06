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
import { expect, TestInfo } from '@playwright/test';
import {
  dataUiId,
  isTestProfileDesktop,
  isTestProfileMobile,
  isTestProfileStableFlavor,
  pageClick,
  perStepLocalTimeout,
  stableScreenshot,
  waitForPiPiPToHaveLoaded,
  waitForSelector
} from '../../common/utils';
import { IDS } from '../../common/constants';
import { MockCallAdapterState } from 'common';

test.describe('Participant list flyout tests', () => {
  test.skip(!participantListShownAsFlyout());

  test('participant list loads correctly', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), { callInvitationUrl: 'testUrl' })
    );
    await pageClick(page, dataUiId('call-composite-participants-button'));
    const buttonCallOut = await waitForSelector(page, '.ms-Callout');
    // This will ensure no animation is happening for the callout
    await buttonCallOut.waitForElementState('stable');
    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-flyout.png`);
  });

  test('participant list opens and displays ellipses if passing in custom icon', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), {
        showParticipantItemIcon: 'true',
        callInvitationUrl: 'testUrl'
      })
    );
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await pageClick(page, dataUiId(IDS.participantButtonPeopleMenuItem));
    // click on last person (myself) to remove any hover effect on participant items
    await pageClick(page, dataUiId('participant-item') + ' >> nth=3');
    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-flyout-custom-ellipses.png`);
  });
});

test.describe('Participant list side pane tests', () => {
  test('participant list loads correctly', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsSidePane(testInfo));

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), { callInvitationUrl: 'testUrl' })
    );
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await waitForSelector(page, dataUiId('call-composite-people-pane'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-flyout.png`);
  });

  test('participant list opens and displays ellipses if passing in custom icon', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), {
        showParticipantItemIcon: 'true',
        callInvitationUrl: 'testUrl'
      })
    );
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await waitForSelector(page, dataUiId('call-composite-people-pane'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-flyout-custom-ellipses.png`);
  });
});

test.describe('Participant list full screen pane tests', () => {
  test('participant list loads correctly', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsFullScreenPane(testInfo));

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), { callInvitationUrl: 'testUrl' })
    );
    await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
    const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
    await drawerPeopleMenuDiv?.click();

    await waitForSelector(page, dataUiId('call-composite-people-pane'));
    await waitForPiPiPToHaveLoaded(page, { skipVideoCheck: true });

    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-flyout.png`);
  });

  test('participant list opens and displays ellipses if passing in custom icon', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), {
        showParticipantItemIcon: 'true',
        callInvitationUrl: 'testUrl'
      })
    );
    await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
    const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
    await drawerPeopleMenuDiv?.click();

    await waitForSelector(page, dataUiId('call-composite-people-pane'));
    await waitForPiPiPToHaveLoaded(page, { skipVideoCheck: true });

    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-flyout-custom-ellipses.png`);
  });
});

const participantListInitialState = (): MockCallAdapterState => {
  const paul = defaultMockRemoteParticipant('Paul Bridges');
  addVideoStream(paul, true);
  paul.isSpeaking = true;
  const initialState = defaultMockCallAdapterState([
    paul,
    defaultMockRemoteParticipant('Eryka Klein'),
    defaultMockRemoteParticipant('Fiona Harper')
  ]);
  addDefaultMockLocalVideoStreamState(initialState);
  return initialState;
};

const participantListShownAsFlyout = (): boolean => {
  /* @conditional-compile-remove(one-to-n-calling) */
  return false;
  return true;
};

const participantListShownAsSidePane = (testInfo: TestInfo): boolean => {
  return isTestProfileDesktop(testInfo) && !participantListShownAsFlyout();
};

const participantListShownAsFullScreenPane = (testInfo: TestInfo): boolean => {
  return isTestProfileMobile(testInfo) && !participantListShownAsFlyout();
};

// TODO(prprabhu): Merge the two tests below in a single `describe`
// after metrics show that the tests have been stabilized.
test.describe('Call Composite E2E CallPage Tests', () => {
  test('participant list with custom ellipses on mobile, should not show ellipses for beta version people pane', async ({
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
        showParticipantItemIcon: 'true',
        callInvitationUrl: 'testUrl'
      })
    );

    if (!isTestProfileStableFlavor()) {
      await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    } else {
      await pageClick(page, dataUiId('call-composite-participants-button'));
    }

    if (isTestProfileStableFlavor()) {
      await pageClick(page, dataUiId(IDS.participantButtonPeopleMenuItem));
      // click on last person (myself) to remove any hover effect on participant items
      await pageClick(page, dataUiId('participant-item') + ' >> nth=3');
    } else {
      await waitForSelector(page, dataUiId('call-composite-people-pane'));
      await waitForPiPiPToHaveLoaded(page, { skipVideoCheck: true });
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(
      `video-gallery-page-participants-flyout-no-ellipses-beta-people-pane.png`
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
        injectParticipantMenuItems: 'true',
        callInvitationUrl: 'testUrl'
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
    if (!isTestProfileStableFlavor()) {
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
