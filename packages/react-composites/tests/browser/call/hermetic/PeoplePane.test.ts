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
  pageClick,
  perStepLocalTimeout,
  stableScreenshot,
  waitForPiPiPToHaveLoaded,
  waitForSelector
} from '../../common/utils';
import { IDS } from '../../common/constants';
import type { MockCallAdapterState } from '../../../common';

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
    test.skip(!participantListShownAsFlyout());

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

  test('injected menu items appear', async ({ page, serverUrl }) => {
    test.skip(!participantListShownAsFlyout());

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), {
        injectParticipantMenuItems: 'true',
        callInvitationUrl: 'testUrl'
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    // Open participants flyout.
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await pageClick(page, dataUiId(IDS.participantButtonPeopleMenuItem));
    // There should be at least one participant. Just click on the first.
    await page.hover(dataUiId('participant-item') + ' >> nth=0');
    await pageClick(page, dataUiId(IDS.participantItemMenuButton) + ' >> nth=0');

    const injectedMenuItem = await waitForSelector(page, dataUiId('test-app-participant-menu-item'));
    await injectedMenuItem.waitForElementState('stable', { timeout: perStepLocalTimeout() });
    expect(await stableScreenshot(page)).toMatchSnapshot(`participant-menu-item-flyout.png`);
  });
});

test.describe('Participant list side pane tests', () => {
  test('participant list loads correctly', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsSidePane(testInfo));

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), { callInvitationUrl: 'testUrl' })
    );
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await waitForSelector(page, dataUiId('people-pane-content'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-flyout.png`);
  });

  test('participant shows unnamed local participant as (you), remote unnamed participant as "Unnamed Participant"', async ({
    page,
    serverUrl
  }, testInfo) => {
    test.skip(!participantListShownAsSidePane(testInfo));
    const initialState = participantListInitialState();

    if (!initialState.call) {
      throw new Error('Call state not set in initial state');
    }

    await page.goto(
      buildUrlWithMockAdapter(
        serverUrl,
        {
          ...initialState,
          displayName: '',
          call: {
            ...initialState.call,
            remoteParticipants: {
              ...initialState.call?.remoteParticipants,
              '': defaultMockRemoteParticipant('')
            }
          }
        },
        { callInvitationUrl: 'testUrl' }
      )
    );
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await waitForSelector(page, dataUiId('people-pane-content'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-no-displayname.png`);
  });

  test('participant list opens and displays ellipses if passing in custom icon', async ({
    page,
    serverUrl
  }, testInfo) => {
    test.skip(!participantListShownAsSidePane(testInfo));

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), {
        showParticipantItemIcon: 'true',
        callInvitationUrl: 'testUrl'
      })
    );
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await waitForSelector(page, dataUiId('people-pane-content'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-flyout-custom-ellipses.png`);
  });

  test('injected menu items appear', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsSidePane(testInfo));

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), {
        injectParticipantMenuItems: 'true',
        callInvitationUrl: 'testUrl'
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    // Open participants flyout.
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await page.hover(dataUiId('participant-item'));
    await pageClick(page, dataUiId(IDS.participantItemMenuButton));
    await waitForSelector(page, '.ms-ContextualMenu-itemText');

    expect(await stableScreenshot(page)).toMatchSnapshot(`participant-menu-item-flyout.png`);
  });
});

test.describe('Participant list full screen pane with drawer tests', () => {
  test('participant list loads correctly', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsFullScreenPane(testInfo));

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), { callInvitationUrl: 'testUrl' })
    );
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
    await drawerPeopleMenuDiv?.click();

    await waitForSelector(page, dataUiId('people-pane-content'));
    await waitForPiPiPToHaveLoaded(page, { skipVideoCheck: true });

    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-flyout.png`);
  });

  test('participant list opens and displays ellipses if passing in custom icon', async ({
    page,
    serverUrl
  }, testInfo) => {
    test.skip(!participantListShownAsFullScreenPane(testInfo));

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), {
        showParticipantItemIcon: 'true',
        callInvitationUrl: 'testUrl'
      })
    );
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
    await drawerPeopleMenuDiv?.click();

    await waitForSelector(page, dataUiId('people-pane-content'));
    await waitForPiPiPToHaveLoaded(page, { skipVideoCheck: true });

    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-flyout-custom-ellipses.png`);
  });

  test('injected menu items appear', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsFullScreenPane(testInfo));

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState(), {
        injectParticipantMenuItems: 'true',
        callInvitationUrl: 'testUrl'
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('common-call-composite-more-button'));
    const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
    await drawerPeopleMenuDiv?.click();
    // click the first participant
    await pageClick(page, `${dataUiId('participant-list')} [role="menuitem"]`);

    // wait for drawer to have opened
    await waitForSelector(page, dataUiId('drawer-menu'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`participant-menu-item-flyout.png`);
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
