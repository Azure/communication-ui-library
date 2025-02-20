// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  //   addScreenshareStream,
  addTogetherModeStream,
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  test
} from './fixture';
import { expect } from '@playwright/test';
import {
  dataUiId,
  //   dragToRight,
  //   existsOnPage,
  isTestProfileMobile,
  pageClick,
  stableScreenshot,
  waitForSelector
} from '../../common/utils';
import { IDS } from '../../common/constants';
import { CallKind } from '@azure/communication-calling';
// import type { MockCallState } from '../../../common';

/* @conditional-compile-remove(together-mode) */
test.describe('Confirm Start Together layout view option ', async () => {
  test('Confirm together mode is not shown in ACS Call', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    // Remote Participants is ACS Identity
    const vasily = defaultMockRemoteParticipant('Vasily');
    const paul = defaultMockRemoteParticipant('Paul');
    const participants = [vasily, paul];
    addVideoStream(vasily, true);
    addVideoStream(paul, true);
    // Local Participant is ACS Identity
    const initialState = defaultMockCallAdapterState(participants);
    if (initialState.call) {
      initialState.call.togetherMode.isActive = true;
    }
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        newControlBarExperience: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("View")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-view-option-hidden-in-acs-call.png');
  });

  test('Confirm together mode is enabled for Teams Call', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    // Remote Participant is Teams Identity
    const vasily = defaultMockRemoteParticipant('Vasily', true);
    const paul = defaultMockRemoteParticipant('Paul', true);
    const participants = [vasily, paul];
    addVideoStream(vasily, true);
    addVideoStream(paul, true);
    // Local Participant is Teams Identity
    const initialState = defaultMockCallAdapterState(participants);
    initialState.userId = { kind: 'microsoftTeamsUser', microsoftTeamsUserId: `8:orgid:localUser` };
    initialState.isTeamsCall = true;
    if (initialState.call) {
      initialState.call.togetherMode.isActive = true;
      initialState.call.kind = 'TeamsCall' as CallKind;
    }
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        newControlBarExperience: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("View")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-view-option-in-teams-call.png');
  });

  test('Confirm together mode is enabled for Teams Meeting', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    // Remote Participant is Teams Identity
    const vasily = defaultMockRemoteParticipant('Vasily', true);
    const paul = defaultMockRemoteParticipant('Paul', true);
    const participants = [vasily, paul];
    addVideoStream(vasily, true);
    addVideoStream(paul, true);
    // Local Participant is Teams Identity
    const initialState = defaultMockCallAdapterState(participants);
    initialState.userId = { kind: 'microsoftTeamsUser', microsoftTeamsUserId: `8:orgid:localUser` };
    initialState.isTeamsMeeting = true;
    if (initialState.call) {
      initialState.call.togetherMode.isActive = true;
      initialState.call.kind = 'TeamsCall' as CallKind;
    }
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        newControlBarExperience: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("View")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-view-option-in-teams-meeting.png');
  });
});

test.describe('Confirm Together Mode Stream signaling events', async () => {
  test('Confirm raiseHand icon and display Name in together mode layout', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges', true);
    const vasily = defaultMockRemoteParticipant('Vasily');
    const participants = [paul, vasily];
    addVideoStream(vasily, true);
    vasily.raisedHand = { raisedHandOrderPosition: 1 };
    addVideoStream(vasily, true);
    const initialState = defaultMockCallAdapterState(participants);

    if (initialState.call?.togetherMode) {
      initialState.call.togetherMode.isActive = true;
      addTogetherModeStream(initialState.call.togetherMode.streams, true);
      initialState.call.togetherMode.seatingPositions = {
        '8:acs:Vasily-id': { left: 0, top: 0, width: 200, height: 200 }
      };
    }
    initialState.isTeamsCall = true;
    if (initialState.call) {
      initialState.call.kind = 'TeamsCall' as CallKind;
    }
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        newControlBarExperience: 'true'
      })
    );

    const id = `together-mode-participant-8:acs:Vasily-id`;
    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("View")').click();
    await page.locator('button:has-text("Together mode")').click();
    await waitForSelector(page, dataUiId(IDS.togetherModeStream));
    await waitForSelector(page, dataUiId(id));
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-view-raisehand-icon.png');
  });

  test('Confirm spotlight icon and display Name in together mode layout', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges', true);
    const vasily = defaultMockRemoteParticipant('Vasily');
    const participants = [paul, vasily];
    addVideoStream(vasily, true);
    vasily.spotlight = { spotlightedOrderPosition: 1 };
    addVideoStream(vasily, true);
    const initialState = defaultMockCallAdapterState(participants);

    if (initialState.call?.togetherMode) {
      initialState.call.togetherMode.isActive = true;
      addTogetherModeStream(initialState.call.togetherMode.streams, true);
      initialState.call.togetherMode.seatingPositions = {
        '8:acs:Vasily-id': { left: 0, top: 0, width: 200, height: 200 }
      };
    }
    initialState.isTeamsCall = true;
    if (initialState.call) {
      initialState.call.kind = 'TeamsCall' as CallKind;
    }
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        newControlBarExperience: 'true'
      })
    );

    const id = `together-mode-participant-8:acs:Vasily-id`;
    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("View")').click();
    await page.locator('button:has-text("Together mode")').click();
    await waitForSelector(page, dataUiId(IDS.togetherModeStream));
    await waitForSelector(page, dataUiId(id));
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-view-spotlight-icon.png');
  });

  test('Confirm mute icon and display Name in together mode layout', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges', true);
    const vasily = defaultMockRemoteParticipant('Vasily');
    const participants = [paul, vasily];
    addVideoStream(vasily, true);
    vasily.spotlight = { spotlightedOrderPosition: 1 };
    vasily.isMuted = true;
    addVideoStream(vasily, true);
    const initialState = defaultMockCallAdapterState(participants);

    if (initialState.call?.togetherMode) {
      initialState.call.togetherMode.isActive = true;
      addTogetherModeStream(initialState.call.togetherMode.streams, true);
      initialState.call.togetherMode.seatingPositions = {
        '8:acs:Vasily-id': { left: 0, top: 0, width: 200, height: 200 }
      };
    }
    initialState.isTeamsCall = true;
    if (initialState.call) {
      initialState.call.kind = 'TeamsCall' as CallKind;
    }
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        newControlBarExperience: 'true'
      })
    );

    const id = `together-mode-participant-8:acs:Vasily-id`;
    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("View")').click();
    await page.locator('button:has-text("Together mode")').click();
    await waitForSelector(page, dataUiId(IDS.togetherModeStream));
    await waitForSelector(page, dataUiId(id));
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-view-mute-icon.png');
  });

  test('Confirm only icons show when seating width is 100px in together mode layout', async ({
    page,
    serverUrl
  }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges', true);
    const vasily = defaultMockRemoteParticipant('Vasily');
    const participants = [paul, vasily];
    addVideoStream(vasily, true);
    vasily.spotlight = { spotlightedOrderPosition: 1 };
    vasily.isMuted = true;
    vasily.raisedHand = { raisedHandOrderPosition: 1 };
    addVideoStream(vasily, true);
    const initialState = defaultMockCallAdapterState(participants);

    if (initialState.call?.togetherMode) {
      initialState.call.togetherMode.isActive = true;
      addTogetherModeStream(initialState.call.togetherMode.streams, true);
      initialState.call.togetherMode.seatingPositions = {
        '8:acs:Vasily-id': { left: 0, top: 0, width: 100, height: 100 }
      };
    }
    initialState.isTeamsCall = true;
    if (initialState.call) {
      initialState.call.kind = 'TeamsCall' as CallKind;
    }

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        newControlBarExperience: 'true'
      })
    );

    const id = `together-mode-participant-8:acs:Vasily-id`;
    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("View")').click();
    await page.locator('button:has-text("Together mode")').click();
    await waitForSelector(page, dataUiId(IDS.togetherModeStream));
    await waitForSelector(page, dataUiId(id));
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-view-icons-only.png');
  });
});
