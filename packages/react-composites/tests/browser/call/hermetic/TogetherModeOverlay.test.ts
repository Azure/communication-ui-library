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
import type { MockRemoteParticipantState } from '../../../common';
import { TogetherModeSeatingPositionState } from '@internal/calling-stateful-client';

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

  test.only('Confirm multiple participants status in together mode', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const participants = createRandomRemoteParticipantList(10);
    const initialState = defaultMockCallAdapterState(participants);
    if (initialState.call?.togetherMode) {
      initialState.isTeamsCall = true;
      initialState.call.kind = 'TeamsCall' as CallKind;
      initialState.call.togetherMode.isActive = true;
      addTogetherModeStream(initialState.call.togetherMode.streams, true);
      initialState.call.togetherMode.seatingPositions = {
        '8:orgid:Participant-1-id': {
          top: 121.50823529411764,
          left: 858.175834509804,
          width: 198.83478588235292,
          height: 149.10745098039214
        },
        '8:orgid:Participant-2-id': {
          top: 298.93176470588236,
          left: 635.1239913725491,
          width: 208.3941505882353,
          height: 156.27607843137255
        },
        '8:orgid:Participant-3-id': {
          top: 298.93176470588236,
          left: 851.8029247058824,
          width: 208.3941505882353,
          height: 156.27607843137255
        },
        '8:orgid:Participant-4-id': {
          top: 206.45647058823528,
          left: 747.9244949019608,
          width: 202.6585317647059,
          height: 151.9749019607843
        },
        '8:orgid:Participant-5-id': {
          top: 298.93176470588236,
          left: 1071.6683129411765,
          width: 208.3941505882353,
          height: 156.27607843137255
        },
        '8:orgid:Participant-6-id': {
          top: 36.20156862745097,
          left: 961.4169733333333,
          width: 193.09916705882353,
          height: 144.80627450980393
        },
        '8:orgid:Participant-7-id': {
          top: 206.45647058823528,
          left: 961.4169733333333,
          width: 202.6585317647059,
          height: 151.9749019607843
        },
        '8:orgid:Participant-8-id': {
          top: 121.50823529411764,
          left: 647.8698109803921,
          width: 198.83478588235292,
          height: 149.10745098039214
        },
        '8:orgid:Participant-9-id': {
          top: 36.20156862745097,
          left: 757.4838596078431,
          width: 193.09916705882353,
          height: 144.80627450980393
        },
        '8:orgid:Participant-10-id': {
          top: 121.50823529411764,
          left: 1065.2954031372549,
          width: 198.83478588235292,
          height: 149.10745098039214
        }
      };
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
    // await waitForSelector(page, dataUiId(id));
    for (let i = 1; i <= 10; i++) {
      const id = `together-mode-participant-8:orgid:Participant-${i}-id`;
      await waitForSelector(page, dataUiId(id));
    }
    expect(await stableScreenshot(page)).toMatchSnapshot('together-mode-all-participants.png');
  });
});

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

const assignRandomSignalingEvents = (participant: MockRemoteParticipantState, orderNumber: number): void => {
  if (orderNumber % 2 === 0) {
    participant.raisedHand = { raisedHandOrderPosition: orderNumber };
    participant.isMuted = true;
  } else {
    participant.spotlight = { spotlightedOrderPosition: orderNumber };
  }
};
