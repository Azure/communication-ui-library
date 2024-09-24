// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

const participantListShownAsFlyout = (): boolean => {
  return false;
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
    // click on the first person to remove any hover effect on participant items
    await pageClick(page, dataUiId('participant-item') + ' >> nth=0');
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
    const unnamedParticipant = defaultMockRemoteParticipant('');
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
              [toFlatCommunicationIdentifier(unnamedParticipant.identifier)]: unnamedParticipant
            }
          }
        },
        { callInvitationUrl: 'testUrl' }
      )
    );
    await waitForSelector(page, dataUiId('call-composite-participants-button'));
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await waitForSelector(page, dataUiId('people-pane-content'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-no-displayname.png`);
  });

  test('participant list shows participant items such as raised hand', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsSidePane(testInfo));

    const participantListState = participantListInitialState({
      localRaisedHand: true,
      remoteRaisedHand: true
    });
    participantListState.call?.remoteParticipants;

    await page.goto(buildUrlWithMockAdapter(serverUrl, participantListState));
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await waitForSelector(page, dataUiId('people-pane-content'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-participants-pane-icons.png`);
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

  test('participant list opens and do not overlap with error bar', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsSidePane(testInfo));
    const initialState = participantListInitialState();
    initialState.latestErrors = {
      'Call.startVideo': {
        // Add 24 hours to current time to ensure the error is not dismissed by default
        timestamp: new Date(Date.now() + 3600 * 1000 * 24),
        name: 'Failure to start video',
        message: 'Could not start video',
        target: 'Call.startVideo',
        innerError: new Error('Inner error of failure to start video')
      }
    };
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { callInvitationUrl: 'testUrl' }));
    await pageClick(page, dataUiId('call-composite-participants-button'));
    await waitForSelector(page, dataUiId('people-pane-content'));
    expect(await stableScreenshot(page)).toMatchSnapshot('people-pane-with-error-bar.png');
  });

  // @conditional-compile-remove(soft-mute)
  test('Mute menu item disabled for user that is already muted', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsSidePane(testInfo));

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState({ remoteIsMuted: true }), {
        callInvitationUrl: 'testUrl'
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));
    await page.hover(dataUiId('participant-item'));
    await pageClick(page, dataUiId(IDS.participantItemMenuButton));
    await waitForSelector(page, '.ms-ContextualMenu-itemText');

    // wait for drawer to have opened
    await waitForSelector(page, dataUiId('participant-item-mute-participant'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`participant-mute-menu-item-disabled.png`);
  });

  // @conditional-compile-remove(soft-mute)
  test('People pane header more options menu', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsSidePane(testInfo));

    const displayNames = ['Tony Hawk', 'Marie Curie', 'Gal Gadot'];
    const participants = displayNames.map((name) => defaultMockRemoteParticipant(name));
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        callInvitationUrl: 'testUrl'
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));
    await pageClick(page, dataUiId('people-pane-header-more-button'));

    // wait for drawer to have opened
    await waitForSelector(page, dataUiId('people-pane-mute-all-remote-participants'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`people-pane-header-more-options.png`);
  });
  // @conditional-compile-remove(soft-mute)
  test('Mute all menu item disabled for user that is already muted', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsSidePane(testInfo));

    const displayNames = ['Tony Hawk', 'Marie Curie', 'Gal Gadot'];
    const participants = displayNames.map((name) => defaultMockRemoteParticipant(name));
    for (const participant of participants) {
      participant.isMuted = true;
    }
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        callInvitationUrl: 'testUrl'
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));
    await pageClick(page, dataUiId('people-pane-header-more-button'));

    // wait for drawer to have opened
    await waitForSelector(page, dataUiId('people-pane-mute-all-remote-participants'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`people-pane-mute-all-menu-item-disabled.png`);
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

  // @conditional-compile-remove(soft-mute)
  test('Mute menu item disabled for user that is already muted', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsFullScreenPane(testInfo));

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, participantListInitialState({ remoteIsMuted: true }), {
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
    await waitForSelector(page, '[data-icon-name="ContextualMenuMicMutedIcon"]');
    expect(await stableScreenshot(page)).toMatchSnapshot(`participant-mute-menu-item-disabled.png`);
  });

  // @conditional-compile-remove(soft-mute)
  test('Mute all menu item disabled for user that is already muted', async ({ page, serverUrl }, testInfo) => {
    test.skip(!participantListShownAsFullScreenPane(testInfo));

    const displayNames = ['Tony Hawk', 'Marie Curie', 'Gal Gadot'];
    const participants = displayNames.map((name) => defaultMockRemoteParticipant(name));
    for (const participant of participants) {
      participant.isMuted = true;
    }
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        callInvitationUrl: 'testUrl'
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('common-call-composite-more-button'));
    const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
    await drawerPeopleMenuDiv?.click();
    await pageClick(page, dataUiId('people-pane-header-more-button'));

    // wait for drawer to have opened
    await waitForSelector(page, `[data-icon-name="ContextualMenuMicMutedIcon"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot(`people-pane-mute-all-menu-item-disabled.png`);
  });
});

const participantListInitialState = (options?: {
  localRaisedHand?: boolean;
  remoteRaisedHand?: boolean;
  remoteIsMuted?: boolean;
}): MockCallAdapterState => {
  const paul = defaultMockRemoteParticipant('Paul Bridges');
  addVideoStream(paul, true);
  paul.isSpeaking = true;
  if (options?.localRaisedHand) {
    paul.raisedHand = {
      raisedHandOrderPosition: 1
    };
  }

  const remoteParticipant1 = defaultMockRemoteParticipant('Eryka Klein');
  if (options?.remoteRaisedHand) {
    remoteParticipant1.raisedHand = {
      raisedHandOrderPosition: options.localRaisedHand ? 2 : 1
    };
  }
  if (options?.remoteIsMuted) {
    remoteParticipant1.isMuted = options?.remoteIsMuted;
  }

  const initialState = defaultMockCallAdapterState(
    [paul, remoteParticipant1, defaultMockRemoteParticipant('Fiona Harper')],
    'Unknown'
  );
  addDefaultMockLocalVideoStreamState(initialState);
  return initialState;
};
