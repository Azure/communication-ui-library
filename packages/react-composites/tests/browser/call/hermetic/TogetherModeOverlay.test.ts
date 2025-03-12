// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import {
  addTogetherModeStream,
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  test
} from './fixture';
/* @conditional-compile-remove(together-mode) */
import { expect } from '@playwright/test';
/* @conditional-compile-remove(together-mode) */
import { dataUiId, isTestProfileMobile, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
/* @conditional-compile-remove(together-mode) */
import {
  IDS,
  togetherModeSeatingPosition_w_1912_h_600,
  togetherModeSeatingPosition_w_700_h_500
} from '../../common/constants';
/* @conditional-compile-remove(together-mode) */
import { CallKind } from '@azure/communication-calling';
/* @conditional-compile-remove(together-mode) */
import type { MockRemoteParticipantState } from '../../../common';

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

/* @conditional-compile-remove(together-mode) */
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

  test('Confirm multiple participants status in together mode', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const participants = createRandomRemoteParticipantList(10);
    const initialState = defaultMockCallAdapterState(participants);
    if (initialState.call?.togetherMode) {
      initialState.isTeamsCall = true;
      initialState.call.kind = 'TeamsCall' as CallKind;
      initialState.call.togetherMode.isActive = true;
      addTogetherModeStream(initialState.call.togetherMode.streams, true);
      initialState.call.togetherMode.seatingPositions = togetherModeSeatingPosition_w_1912_h_600;
    }

    await page.setViewportSize({ width: 1912, height: 600 });
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        newControlBarExperience: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("View")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-view-option-all-participants.png');
    await page.locator('button:has-text("Together mode")').click();
    await waitForSelector(page, dataUiId(IDS.togetherModeStream));
    for (let i = 1; i <= 10; i++) {
      const id = `together-mode-participant-8:orgid:Participant-${i}-id`;
      await waitForSelector(page, dataUiId(id));
    }
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-all-participants.png');
  });

  test('Confirm multiple participants status in together mode when window size is smaller', async ({
    page,
    serverUrl
  }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const participants = createRandomRemoteParticipantList(10);
    const initialState = defaultMockCallAdapterState(participants);
    if (initialState.call?.togetherMode) {
      initialState.isTeamsCall = true;
      initialState.call.kind = 'TeamsCall' as CallKind;
      initialState.call.togetherMode.isActive = true;
      addTogetherModeStream(initialState.call.togetherMode.streams, true);
      initialState.call.togetherMode.seatingPositions = togetherModeSeatingPosition_w_700_h_500;
    }

    await page.setViewportSize({ width: 700, height: 500 });
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        newControlBarExperience: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("View")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot(
      'together-mode-view-option-all-participants-in-smaller-size.png'
    );
    await page.locator('button:has-text("Together mode")').click();
    await waitForSelector(page, dataUiId(IDS.togetherModeStream));
    for (let i = 1; i <= 10; i++) {
      const id = `together-mode-participant-8:orgid:Participant-${i}-id`;
      await waitForSelector(page, dataUiId(id));
    }
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-all-participants-in-smaller-size.png');
    page.click(dataUiId('together-mode-participant-8:orgid:Participant-5-id'));
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-participant-1-click.png');
  });
});

/* @conditional-compile-remove(together-mode) */
const createRandomRemoteParticipantList = (participantCount: number): MockRemoteParticipantState[] => {
  const participants = [];
  for (let i = 1; i <= participantCount; i++) {
    const participant = defaultMockRemoteParticipant(`Participant-${i}`, true);
    addVideoStream(participant, true);
    assignRandomSignalingEvents(participant, i);
    participants.push(participant);
  }
  return participants;
};

/* @conditional-compile-remove(together-mode) */
const assignRandomSignalingEvents = (participant: MockRemoteParticipantState, orderNumber: number): void => {
  if (orderNumber % 2 === 0) {
    participant.raisedHand = { raisedHandOrderPosition: orderNumber };
    participant.isMuted = true;
  } else {
    participant.spotlight = { spotlightedOrderPosition: orderNumber };
  }
};
