// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import renderer from 'react-test-renderer';
import { v1 as createGUID } from 'uuid';
import { VideoGalleryRemoteParticipant } from '../../../types';
import {
  useOrganizedParticipants,
  OrganizedParticipantsArgs,
  OrganizedParticipantsResult
} from './videoGalleryLayoutUtils';

describe('VideoGallery layout ordering and grouping tests', () => {
  test('4 video participants should be in grid starting with dominant speakers and the rest in horizontal gallery', () => {
    // 10 remote participants. First 5 with their video on.
    const remoteParticipants = [...Array(10).keys()].map((i) => {
      return createRemoteParticipant({
        userId: `${i}`,
        videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
      });
    });

    const pinnedParticipantsLayout = setup({
      remoteParticipants,
      dominantSpeakers: ['3', '4'],
      maxRemoteVideoStreams: 4
    });

    expect(pinnedParticipantsLayout?.gridParticipants.map((p) => p.userId)).toStrictEqual(['3', '4', '0', '1']);
    expect(pinnedParticipantsLayout?.horizontalGalleryParticipants.map((p) => p.userId)).toStrictEqual([
      '2',
      '5',
      '6',
      '7',
      '8',
      '9'
    ]);
  });

  test(
    'no participants should be in grid because of screenshare and horizontal gallery should start with ' +
      'video participants then audio participants',
    () => {
      // 10 remote participants. First 5 with their video on.
      const remoteParticipants = [...Array(10).keys()].map((i) => {
        return createRemoteParticipant({
          userId: `${i}`,
          videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
        });
      });

      const pinnedParticipantsLayout = setup({
        remoteParticipants,
        dominantSpeakers: ['3', '4'],
        maxRemoteVideoStreams: 4,
        isScreenShareActive: true
      });

      expect(pinnedParticipantsLayout?.gridParticipants.map((p) => p.userId)).toStrictEqual([]);
      expect(pinnedParticipantsLayout?.horizontalGalleryParticipants.map((p) => p.userId)).toStrictEqual([
        '3',
        '4',
        '0',
        '1',
        '2',
        '5',
        '6',
        '7',
        '8',
        '9'
      ]);
    }
  );
});

/* @conditional-compile-remove(pinned-participants) */
describe('VideoGallery layout ordering and grouping tests with pinned participants', () => {
  test('pinned participants should in grid and video participants should be at the start of horizontal gallery', () => {
    // 10 remote participants. First 5 with their video on.
    const remoteParticipants = [...Array(10).keys()].map((i) => {
      return createRemoteParticipant({
        userId: `${i}`,
        videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
      });
    });

    const pinnedParticipantsLayout = setup({
      remoteParticipants,
      pinnedParticipantUserIds: ['0', '6'],
      dominantSpeakers: ['3', '4'],
      maxRemoteVideoStreams: 4
    });

    expect(pinnedParticipantsLayout?.gridParticipants.map((p) => p.userId)).toStrictEqual(['0', '6']);
    expect(pinnedParticipantsLayout?.horizontalGalleryParticipants.map((p) => p.userId)).toStrictEqual([
      '3',
      '4',
      '1',
      '2',
      '5',
      '7',
      '8',
      '9'
    ]);
  });

  test(
    'no participants should be in grid because of screenshare and horizontal gallery should start with ' +
      'pinned participants followed by video participants and then audio participants',
    () => {
      // 10 remote participants. First 5 with their video on.
      const remoteParticipants = [...Array(10).keys()].map((i) => {
        return createRemoteParticipant({
          userId: `${i}`,
          videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
        });
      });

      const pinnedParticipantsLayout = setup({
        remoteParticipants,
        pinnedParticipantUserIds: ['0', '6'],
        dominantSpeakers: ['3', '4'],
        maxRemoteVideoStreams: 4,
        isScreenShareActive: true
      });

      expect(pinnedParticipantsLayout?.gridParticipants.map((p) => p.userId)).toStrictEqual([]);
      expect(pinnedParticipantsLayout?.horizontalGalleryParticipants.map((p) => p.userId)).toStrictEqual([
        '0',
        '6',
        '3',
        '4',
        '1',
        '2',
        '5',
        '7',
        '8',
        '9'
      ]);
    }
  );
});

const createVideoDivElement = (): HTMLDivElement => {
  const divElement = document.createElement('div');
  divElement.innerHTML = '<video>VIDEO</video>';
  return divElement;
};

const createRemoteParticipant = (attrs?: Partial<VideoGalleryRemoteParticipant>): VideoGalleryRemoteParticipant => {
  return {
    userId: attrs?.userId ?? `remoteParticipant-${createGUID()}`,
    displayName: attrs?.displayName ?? 'Remote Participant',
    isMuted: attrs?.isMuted ?? false,
    isSpeaking: attrs?.isSpeaking ?? false,
    /* @conditional-compile-remove(demo) */ state: attrs?.state ?? 'Connected',
    screenShareStream: {
      id: attrs?.screenShareStream?.id ?? 1,
      isAvailable: attrs?.screenShareStream?.isAvailable ?? false,
      isReceiving: attrs?.screenShareStream?.isReceiving ?? true,
      isMirrored: attrs?.screenShareStream?.isMirrored ?? false,
      renderElement: attrs?.screenShareStream?.renderElement ?? undefined
    },
    videoStream: {
      id: attrs?.videoStream?.id ?? 1,
      isAvailable: attrs?.videoStream?.isAvailable ?? false,
      isReceiving: attrs?.videoStream?.isReceiving ?? true,
      isMirrored: attrs?.videoStream?.isMirrored ?? false,
      renderElement: attrs?.videoStream?.renderElement ?? undefined
    },
    isScreenSharingOn: attrs?.isScreenSharingOn ?? false
  };
};

const setup = (args: OrganizedParticipantsArgs): OrganizedParticipantsResult | undefined => {
  let layout: OrganizedParticipantsResult | undefined = undefined;
  const TestComponent = (): null => {
    layout = useOrganizedParticipants(args);
    return null;
  };
  renderer.create(<TestComponent />);
  return layout;
};
