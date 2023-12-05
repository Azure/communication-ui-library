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
import { expect } from '@playwright/test';
import {
  dataUiId,
  isTestProfileDesktop,
  isTestProfileMobile,
  pageClick,
  stableScreenshot,
  waitForPiPiPToHaveLoaded,
  waitForSelector
} from '../../common/utils';
import { IDS } from '../../common/constants';
import type { MockCallAdapterState } from '../../../common';

test.describe('Participant list side pane tests', () => {
  
  test('participant list loads correctly', async ({ page, serverUrl }, testInfo) => {
    test.skip(!isTestProfileDesktop(testInfo));
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
    test.skip(!isTestProfileDesktop(testInfo));
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
    test.skip(!isTestProfileDesktop(testInfo));

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
    test.skip(!isTestProfileDesktop(testInfo));

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
    test.skip(!isTestProfileDesktop(testInfo));
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
});

test.describe('Participant list full screen pane with drawer tests', () => {
  test.skip(true);
  test('participant list loads correctly', async ({ page, serverUrl }, testInfo) => {
    test.skip(!isTestProfileMobile(testInfo));

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
    test.skip(!isTestProfileMobile(testInfo));

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
    test.skip(!isTestProfileMobile(testInfo));

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
  const initialState = defaultMockCallAdapterState(
    [paul, defaultMockRemoteParticipant('Eryka Klein'), defaultMockRemoteParticipant('Fiona Harper')],
    'Unknown'
  );
  addDefaultMockLocalVideoStreamState(initialState);
  return initialState;
};
