// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  buildUrl,
  dataUiId,
  loadCallPageWithParticipantVideos,
  pageClick,
  PER_STEP_TIMEOUT_MS,
  waitForCallCompositeToLoad,
  waitForFunction,
  waitForSelector
} from '../common/utils';
import { test } from './fixture';
import { expect, Page } from '@playwright/test';
import { v1 as generateGUID } from 'uuid';
import { IDS } from '../common/constants';

/**
 * Since we are providing a .y4m video to act as a fake video stream, chrome
 * uses it's file path as the camera name. This file location can differ on
 * every device causing a diff error in test screenshot comparisons.
 * To avoid this error, we replace the unique file path with a custom string.
 */
const stubLocalCameraName = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const element = document.querySelector('[data-ui-id="call-composite-local-camera-settings"]');
    if (element) {
      element.innerHTML = element.innerHTML.replace(/C:.*?y4m/g, 'Fake Camera');
    }
  });
};

test.describe('Call Composite E2E Configuration Screen Tests', () => {
  test.beforeEach(async ({ pages, serverUrl, users }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await page.goto(buildUrl(serverUrl, user));
      await waitForCallCompositeToLoad(page);
    }
  });

  test('composite pages load completely', async ({ pages }) => {
    const page = pages[0];
    await stubLocalCameraName(page);
    expect(await page.screenshot()).toMatchSnapshot(`call-configuration-page.png`);
  });

  test('local device settings can toggle camera & audio', async ({ pages }) => {
    const page = pages[0];
    await pageClick(page, dataUiId('call-composite-local-device-settings-microphone-button'));
    await pageClick(page, dataUiId('call-composite-local-device-settings-camera-button'));
    await waitForFunction(page, () => {
      const videoNode = document.querySelector('video');
      const videoLoaded = videoNode?.readyState === 4;
      return !!videoNode && videoLoaded;
    });
    await stubLocalCameraName(page);
    expect(await page.screenshot()).toMatchSnapshot(`call-configuration-page-camera-enabled.png`);
  });

  test('local device buttons should show tooltips on hover', async ({ pages }) => {
    const page = pages[0];

    await page.hover(dataUiId('call-composite-local-device-settings-microphone-button'));
    await waitForSelector(page, dataUiId('microphoneButtonLabel-tooltip'));
    await stubLocalCameraName(page);
    expect(await page.screenshot()).toMatchSnapshot(`call-configuration-page-unmute-tooltip.png`);
  });

  test('Configuration screen should display call details', async ({ serverUrl, users, pages }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    const user = users[0];
    user.groupId = newTestGuid;

    // Set description to be shown
    const page = pages[0];
    await page.goto(
      buildUrl(serverUrl, user, {
        showCallDescription: 'true'
      })
    );
    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('call-configuration-page-with-call-details.png');
  });
});

test.describe('Call Composite E2E CallPage Tests', () => {
  // Make sure tests can still run well after retries
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await page.goto(buildUrl(serverUrl, user));
      await waitForCallCompositeToLoad(page);
    }

    await loadCallPageWithParticipantVideos(pages);
  });

  test('video gallery renders for all pages', async ({ pages }) => {
    for (const idx in pages) {
      const page = pages[idx];
      await page.bringToFront();

      expect(await page.screenshot()).toMatchSnapshot(`video-gallery-page-${idx}.png`);
    }
  });

  test('participant list loads correctly', async ({ pages }) => {
    // TODO: Remove this function when we fix unstable contextual menu bug
    // Bug link: https://skype.visualstudio.com/SPOOL/_workitems/edit/2558377/?triage=true
    await turnOffAllVideos(pages);

    for (const idx in pages) {
      const page = pages[idx];
      await pageClick(page, dataUiId('call-composite-participants-button'));
      const buttonCallOut = await waitForSelector(page, '.ms-Callout');
      // This will ensure no animation is happening for the callout
      await buttonCallOut.waitForElementState('stable');

      expect(await page.screenshot()).toMatchSnapshot(`video-gallery-page-participants-flyout-${idx}.png`);
    }
  });

  test('can turn off local video', async ({ pages }) => {
    const page = pages[0];
    await pageClick(page, dataUiId('call-composite-camera-button'));
    await waitForFunction(page, () => {
      return document.querySelectorAll('video').length === 1;
    });
    expect(await page.screenshot()).toMatchSnapshot(`video-gallery-page-camera-toggled.png`);
  });
});

test.describe('Call Composite E2E Call Ended Pages', () => {
  // Make sure tests can still run well after retries
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await page.goto(buildUrl(serverUrl, user));
      await waitForCallCompositeToLoad(page);
    }

    await loadCallPageWithParticipantVideos(pages);
  });

  test('Left call page should show when end call button clicked', async ({ pages }) => {
    const page = pages[0];
    await pageClick(page, dataUiId('call-composite-hangup-button'));
    await waitForSelector(page, dataUiId('left-call-page'));
    expect(await page.screenshot()).toMatchSnapshot(`left-call-page.png`);
  });

  test('Removed from call page should show when you are removed by another user', async ({ pages }) => {
    // page[0] user will remove page[1] user
    const page0 = pages[0];
    const page1 = pages[1];

    await pageClick(page0, dataUiId('call-composite-participants-button')); // open participant flyout
    await pageClick(page0, dataUiId(IDS.participantButtonPeopleMenuItem)); // open people sub menu
    await pageClick(page0, dataUiId(IDS.participantItemMenuButton)); // click on page[1] user to remove
    await pageClick(page0, dataUiId(IDS.participantListRemoveParticipantButton)); // click participant remove button

    await waitForSelector(page1, dataUiId('removed-from-call-page'));
    expect(await page1.screenshot()).toMatchSnapshot(`remove-from-call-page.png`);
  });
});

test.describe('Call composite participant menu items injection tests', () => {
  // Make sure tests can still run well after retries
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await page.goto(
        buildUrl(serverUrl, user, {
          injectParticipantMenuItems: 'true'
        })
      );
      await waitForCallCompositeToLoad(page);
    }
    await loadCallPageWithParticipantVideos(pages);
  });

  test('injected menu items appear', async ({ pages }) => {
    // TODO: Remove this function when we fix unstable contextual menu bug
    // Bug link: https://skype.visualstudio.com/SPOOL/_workitems/edit/2558377/?triage=true
    await turnOffAllVideos(pages);

    const page = pages[0];

    // Open participants flyout.
    await pageClick(page, dataUiId('call-composite-participants-button'));
    // Open participant list flyout
    await pageClick(page, dataUiId(IDS.participantButtonPeopleMenuItem));
    // There shouldbe at least one participant. Just click on the first.
    await pageClick(page, dataUiId(IDS.participantItemMenuButton) + ' >> nth=0');

    const injectedMenuItem = await waitForSelector(page, dataUiId('test-app-participant-menu-item'));
    await injectedMenuItem.waitForElementState('stable', { timeout: PER_STEP_TIMEOUT_MS });

    expect(await page.screenshot()).toMatchSnapshot(`participant-menu-item-flyout.png`);
  });
});

test.describe('xkcd Call composite custom button injection tests', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await page.goto(
        buildUrl(serverUrl, user, {
          injectCustomButtons: 'true'
        })
      );
      await waitForCallCompositeToLoad(page);
    }
    await loadCallPageWithParticipantVideos(pages);
  });

  test('injected buttons appear', async ({ pages }) => {
    // TODO: Remove this function when we fix unstable contextual menu bug
    // Bug link: https://skype.visualstudio.com/SPOOL/_workitems/edit/2558377/?triage=true
    await turnOffAllVideos(pages);

    const page = pages[0];
    expect(await page.screenshot()).toMatchSnapshot(`custom-buttons.png`);
  });
});

// `timeout` is applied to each individual step that waits for a condition.
const turnOffAllVideos = async (pages: Page[]): Promise<void> => {
  for (const page of pages) {
    await pageClick(page, dataUiId('call-composite-camera-button'));
  }
  for (const page of pages) {
    await waitForFunction(page, () => {
      return document.querySelectorAll('video').length === 0;
    });
  }
};
