// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import {
  dataUiId,
  hidePiPiP,
  isTestProfileDesktop,
  pageClick,
  stableScreenshot,
  waitForSelector
} from '../../common/utils';
import {
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  defaultMockRemotePSTNParticipant,
  test
} from './fixture';
import { MockRemoteParticipantState } from '../../../common';

test.describe('Participant pane tests', async () => {
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  test('People pane opens and displays correctly', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { callInvitationUrl: 'testUrl' }));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    if (!isTestProfileDesktop(testInfo)) {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    } else {
      await pageClick(page, dataUiId('call-composite-participants-button'));
    }

    await waitForSelector(page, dataUiId('call-composite-people-pane'));
    expect(await stableScreenshot(page)).toMatchSnapshot('call-screen-with-people-pane.png');
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('Add people button should be hidden for ACS group call when there is no alternate call id and callInvitationUrl', async ({
    page,
    serverUrl
  }, testInfo) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    if (!isTestProfileDesktop(testInfo)) {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    } else {
      await pageClick(page, dataUiId('call-composite-participants-button'));
    }

    await waitForSelector(page, dataUiId('call-composite-people-pane'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`ACS-group-call-screen-with-no-add-people-button.png`);
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('click on add people button will show dialpad option for PSTN call', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState();
    //PSTN call has alternate caller id
    initialState.alternateCallerId = '+1676568678999';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    if (!isTestProfileDesktop(testInfo)) {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    } else {
      await pageClick(page, dataUiId('call-composite-participants-button'));
    }

    await waitForSelector(page, dataUiId('call-composite-people-pane'));

    await pageClick(page, dataUiId('call-add-people-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`PSTN-call-screen-with-dialpad-dropdown.png`);
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('click on dial phone number will open dialpad in PTSN call', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState();
    //PSTN call has alternate caller id
    initialState.alternateCallerId = '+1676568678999';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    if (!isTestProfileDesktop(testInfo)) {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    } else {
      await pageClick(page, dataUiId('call-composite-participants-button'));
    }

    await waitForSelector(page, dataUiId('call-composite-people-pane'));

    await pageClick(page, dataUiId('call-add-people-button'));

    if (isTestProfileDesktop(testInfo)) {
      await waitForSelector(page, dataUiId('call-dial-phone-number-button'));
      await pageClick(page, dataUiId('call-dial-phone-number-button'));
    } else {
      await waitForSelector(page, dataUiId('call-add-people-dropdown'));
      const drawerDialPhoneNumberDiv = await page.$('div[role="menu"] >> text=Dial phone number');
      await drawerDialPhoneNumberDiv?.click();
    }

    expect(await stableScreenshot(page)).toMatchSnapshot(`PSTN-call-screen-with-dialpad.png`);
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('callee participant is displayed with connection state', async ({ page, serverUrl }, testInfo) => {
    const paul = defaultMockRemotePSTNParticipant('+12324567890');
    paul.state = 'Ringing';
    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);
    //PSTN call has alternate caller id
    initialState.alternateCallerId = '+1676568678999';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    if (!isTestProfileDesktop(testInfo)) {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    } else {
      await pageClick(page, dataUiId('call-composite-participants-button'));
    }
    await waitForSelector(page, dataUiId('call-composite-people-pane'));
    await hidePiPiP(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('PSTN-participant-pane-connecting-participant.png');
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('callee participant name and connection state are truncated', async ({ page, serverUrl }, testInfo) => {
    const longPaul = defaultMockRemoteParticipant(
      'I have a really really really really long name. Trust me you dont wanna know.'
    );
    longPaul.state = 'Ringing';
    const participants = [longPaul];
    const initialState = defaultMockCallAdapterState(participants);
    //PSTN call has alternate caller id
    initialState.alternateCallerId = '+1676568678999';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    if (!isTestProfileDesktop(testInfo)) {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    } else {
      await pageClick(page, dataUiId('call-composite-participants-button'));
    }
    await waitForSelector(page, dataUiId('call-composite-people-pane'));
    await hidePiPiP(page);
    const participantStringId = dataUiId('participant-item-state-string');
    await page.evaluate((participantStringId) => {
      const el = document.querySelector(participantStringId);
      if (el) {
        el.textContent = 'Long Calling String...';
      }
    }, participantStringId);
    expect(await stableScreenshot(page)).toMatchSnapshot('participant-pane-callee-name-truncation.png');
  });

  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  test('Participant shows unknown icon when displayName is missing', async ({ page, serverUrl }, testInfo) => {
    const remoteParticipantWithNoName = defaultMockRemoteParticipant();
    const initialState = defaultMockCallAdapterState([remoteParticipantWithNoName]);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { callInvitationUrl: 'testUrl' }));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    if (!isTestProfileDesktop(testInfo)) {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    } else {
      await pageClick(page, dataUiId('call-composite-participants-button'));
    }

    await waitForSelector(page, dataUiId('call-composite-people-pane'));
    expect(await stableScreenshot(page)).toMatchSnapshot('participant-with-no-name-unknown-icon.png');
  });

  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  test('PSTN ParticipantState string should be set correctly when idle to connecting desktop', async ({
    page,
    serverUrl
  }, testInfo) => {
    test.skip(!isTestProfileDesktop(testInfo));
    const idleRemoteParticipant = defaultMockRemotePSTNParticipant('15556781234');
    idleRemoteParticipant.state = 'Idle';

    const initialState = defaultMockCallAdapterState([idleRemoteParticipant]);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-participants-button'));
    await pageClick(page, dataUiId('call-composite-participants-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot('pstn-participant-list-idle-participant-desktop.png');

    idleRemoteParticipant.state = 'Ringing';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-participants-button'));
    await pageClick(page, dataUiId('call-composite-participants-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot('pstn-participant-list-connecting-participant-desktop.png');
  });

  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  test('PSTN ParticipantState string should be set correctly when idle to connecting mobile', async ({
    page,
    serverUrl
  }, testInfo) => {
    test.skip(isTestProfileDesktop(testInfo));
    const idleRemoteParticipant = defaultMockRemotePSTNParticipant('15556781234');
    idleRemoteParticipant.state = 'Idle';

    const initialState = defaultMockCallAdapterState([idleRemoteParticipant]);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));

    await waitForSelector(page, dataUiId('call-composite-more-menu-people-button'));
    await pageClick(page, dataUiId('call-composite-more-menu-people-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot('pstn-participant-list-idle-participant-mobile.png');

    idleRemoteParticipant.state = 'Ringing';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));

    await waitForSelector(page, dataUiId('call-composite-more-menu-people-button'));
    await pageClick(page, dataUiId('call-composite-more-menu-people-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot('pstn-participant-list-connecting-participant-mobile.png');
  });

  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  test('Participant should be hidden when idle to connecting mobile', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileDesktop(testInfo));
    const idleRemoteParticipant = defaultMockRemoteParticipant('Joni Solberg');
    idleRemoteParticipant.state = 'Idle';

    const initialState = defaultMockCallAdapterState([idleRemoteParticipant]);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));

    await waitForSelector(page, dataUiId('call-composite-more-menu-people-button'));
    await pageClick(page, dataUiId('call-composite-more-menu-people-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot('participant-list-idle-participant-mobile.png');

    idleRemoteParticipant.state = 'Ringing';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));

    await waitForSelector(page, dataUiId('call-composite-more-menu-people-button'));
    await pageClick(page, dataUiId('call-composite-more-menu-people-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot('participant-list-connecting-participant-mobile.png');
  });

  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  test('Participant should be hidden when idle to connecting desktop', async ({ page, serverUrl }, testInfo) => {
    test.skip(!isTestProfileDesktop(testInfo));
    const idleRemoteParticipant = defaultMockRemoteParticipant('Joni Solberg');
    idleRemoteParticipant.state = 'Idle';

    const initialState = defaultMockCallAdapterState([idleRemoteParticipant]);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-participants-button'));
    await pageClick(page, dataUiId('call-composite-participants-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot('participant-list-idle-participant-desktop.png');

    idleRemoteParticipant.state = 'Ringing';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-participants-button'));
    await pageClick(page, dataUiId('call-composite-participants-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot('participant-list-connecting-participant-desktop.png');
  });

  /* @conditional-compile-remove(total-participant-count) */
  test.only('Participant count should be shown correctly with large numbers of people', async ({ page, serverUrl }) => {
    const participants: MockRemoteParticipantState[] = [];
    for (let i = 0; i < 150; i++) {
      participants.push(defaultMockRemoteParticipant(`Joni Solberg ${i}`));
    }

    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-participants-button'));
    await pageClick(page, dataUiId('call-composite-participants-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot('participant-list-large-number-of-participants.png');
  });
});
