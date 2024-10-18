// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { VideoGallery } from '../../src/components/VideoGallery';
import { VideoGalleryLocalParticipant, VideoGalleryRemoteParticipant } from '../../src';
import { Stack } from '@fluentui/react';

test.describe('VGL - VideoGallery tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => document.fonts.ready);
  });

  test('VideoGallery with only audio participants and dominant speakers', async ({ mount }) => {
    const localParticipant: VideoGalleryLocalParticipant = { userId: 'test' };
    const remoteParticipants: VideoGalleryRemoteParticipant[] = Array.from({ length: 10 }, (_, i) => i + 1).map(
      (i) => ({
        userId: `${i}`,
        displayName: `${i}`
      })
    );
    const component = await mount(
      <Stack styles={{ root: { width: '100vw', height: '100vh' } }}>
        <VideoGallery
          localParticipant={localParticipant}
          remoteParticipants={remoteParticipants}
          layout="floatingLocalVideo"
        />
      </Stack>
    );
    await expect(component).toHaveScreenshot('VGL-1-1-videogallery-with-audio-only-before-dominant-speakers.png');
    await component.update(
      <Stack styles={{ root: { width: '100vw', height: '100vh' } }}>
        <VideoGallery
          localParticipant={localParticipant}
          remoteParticipants={remoteParticipants}
          layout="floatingLocalVideo"
          dominantSpeakers={['10']}
        />
      </Stack>
    );
    await expect(component).toHaveScreenshot('VGL-1-2-videogallery-with-audio-only-after-dominant-speakers.png');
  });

  test('VideoGallery with video participants and dominant speakers', async ({ mount }) => {
    const localParticipant: VideoGalleryLocalParticipant = { userId: 'test' };
    const remoteParticipants: VideoGalleryRemoteParticipant[] = Array.from({ length: 10 }, (_, i) => i + 1).map(
      (i) => ({
        userId: `${i}`,
        displayName: `${i}`
      })
    );
    // Assign video stream to some participants
    remoteParticipants.find((p) => p.userId === '2')!.videoStream = { isAvailable: true };
    remoteParticipants.find((p) => p.userId === '3')!.videoStream = { isAvailable: true };
    remoteParticipants.find((p) => p.userId === '5')!.videoStream = { isAvailable: true };
    remoteParticipants.find((p) => p.userId === '7')!.videoStream = { isAvailable: true };
    remoteParticipants.find((p) => p.userId === '9')!.videoStream = { isAvailable: true };

    const component = await mount(
      <Stack styles={{ root: { width: '100vw', height: '100vh' } }}>
        <VideoGallery
          localParticipant={localParticipant}
          remoteParticipants={remoteParticipants}
          layout="floatingLocalVideo"
        />
      </Stack>
    );
    await expect(component).toHaveScreenshot('VGL-2-1-videogallery-with-some-video-before-dominant-speakers.png');
    await component.update(
      <Stack styles={{ root: { width: '100vw', height: '100vh' } }}>
        <VideoGallery
          localParticipant={localParticipant}
          remoteParticipants={remoteParticipants}
          layout="floatingLocalVideo"
          dominantSpeakers={['9']}
        />
      </Stack>
    );
    await expect(component).toHaveScreenshot('VGL-2-2-videogallery--with-some-video-after-dominant-speakers.png');
  });

  test('VideoGallery with screen share on and dominant speakers', async ({ mount }) => {
    const localParticipant: VideoGalleryLocalParticipant = { userId: 'test' };
    const remoteParticipants: VideoGalleryRemoteParticipant[] = Array.from({ length: 10 }, (_, i) => i + 1).map(
      (i) => ({
        userId: `${i}`,
        displayName: `${i}`
      })
    );
    remoteParticipants[5].isScreenSharingOn = true;
    remoteParticipants[5].screenShareStream = { isAvailable: true };
    const component = await mount(
      <Stack styles={{ root: { width: '100vw', height: '100vh' } }}>
        <VideoGallery
          localParticipant={localParticipant}
          remoteParticipants={remoteParticipants}
          layout="floatingLocalVideo"
        />
      </Stack>
    );
    await expect(component).toHaveScreenshot('VGL-3-1-videogallery-with-screen-share-before-dominant-speakers.png');
    await component.update(
      <Stack styles={{ root: { width: '100vw', height: '100vh' } }}>
        <VideoGallery
          localParticipant={localParticipant}
          remoteParticipants={remoteParticipants}
          layout="floatingLocalVideo"
          dominantSpeakers={['10']}
        />
      </Stack>
    );
    await expect(component).toHaveScreenshot('VGL-3-2-videogallery-with-screen-share-after-dominant-speakers.png');
  });

  test('VideoGallery spotlight participant test', async ({ mount }) => {
    const localParticipant: VideoGalleryLocalParticipant = { userId: 'test' };
    const remoteParticipants: VideoGalleryRemoteParticipant[] = Array.from({ length: 10 }, (_, i) => i + 1).map(
      (i) => ({ userId: `${i}`, displayName: `${i}` })
    );
    const screenSharingParticipant: VideoGalleryRemoteParticipant = {
      userId: '11',
      displayName: '11'
    };
    remoteParticipants.push(screenSharingParticipant);
    const component = await mount(
      <Stack styles={{ root: { width: '100vw', height: '100vh' } }}>
        <VideoGallery
          localParticipant={localParticipant}
          remoteParticipants={remoteParticipants}
          layout="floatingLocalVideo"
        />
      </Stack>
    );
    await expect(component).toHaveScreenshot('VGL-4-1-videogallery-before-spotlight.png');

    remoteParticipants.find((p) => p.userId === '8')!.spotlight = { spotlightedOrderPosition: 1 };
    component.update(
      <Stack styles={{ root: { width: '100vw', height: '100vh' } }}>
        <VideoGallery
          localParticipant={localParticipant}
          remoteParticipants={remoteParticipants}
          layout="floatingLocalVideo"
          spotlightedParticipants={['8']}
        />
      </Stack>
    );
    await expect(component).toHaveScreenshot('VGL-4-2-videogallery-after-spotlight.png');
  });
});
