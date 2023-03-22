// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { create, act } from 'react-test-renderer';
import { v1 as createGUID } from 'uuid';
import { VideoGalleryRemoteParticipant } from '../../../types';
import {
  useOrganizedParticipants,
  OrganizedParticipantsArgs,
  OrganizedParticipantsResult
} from './videoGalleryLayoutUtils';

describe('useOrganizedParticipants hook tests', () => {
  test('4 video participants should be in grid starting with dominant speakers and the rest in overflow gallery', () => {
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
    expect(pinnedParticipantsLayout?.overflowGalleryParticipants.map((p) => p.userId)).toStrictEqual([
      '2',
      '5',
      '6',
      '7',
      '8',
      '9'
    ]);
  });

  test('video participant not currently in the grid should be placed in grid when they are a dominant speaker', () => {
    // 10 remote participants. First 5 with their video on ('1v', '2v', '3v', '4v' and '5v').
    // Last 5 with their video off ('1', '2', '3', '4' and '5').
    const remoteParticipants = createTestRemoteParticipants();

    const pinnedParticipantsLayout = setup(
      {
        remoteParticipants,
        maxRemoteVideoStreams: 4
      },
      {
        remoteParticipants,
        dominantSpeakers: ['4v', '5v'],
        maxRemoteVideoStreams: 4
      }
    );

    expect(pinnedParticipantsLayout?.gridParticipants.map((p) => p.userId)).toStrictEqual(['5v', '2v', '3v', '4v']);
    expect(pinnedParticipantsLayout?.overflowGalleryParticipants.map((p) => p.userId)).toStrictEqual([
      '1v',
      '1',
      '2',
      '3',
      '4',
      '5'
    ]);
  });

  test(
    'no participants should be in grid because of screenshare and overflow gallery should start with ' +
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
      expect(pinnedParticipantsLayout?.overflowGalleryParticipants.map((p) => p.userId)).toStrictEqual([
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

  test('audio participant should be first of overflow gallery if they are the only dominant speaker', () => {
    // 10 remote participants. First 5 with their video on ('1v', '2v', '3v', '4v' and '5v').
    // Last 5 with their video off ('1', '2', '3', '4' and '5').
    const remoteParticipants = createTestRemoteParticipants();

    const layout = setup(
      {
        remoteParticipants,
        maxRemoteVideoStreams: 4,
        maxOverflowGalleryDominantSpeakers: 3,
        isScreenShareActive: true
      },
      {
        remoteParticipants,
        dominantSpeakers: ['3'],
        maxRemoteVideoStreams: 4,
        maxOverflowGalleryDominantSpeakers: 3,
        isScreenShareActive: true
      }
    );

    expect(layout?.gridParticipants.map((p) => p.userId)).toStrictEqual([]);
    expect(layout?.overflowGalleryParticipants.map((p) => p.userId)).toStrictEqual([
      '3',
      '2v',
      '3v',
      '1v',
      '4v',
      '5v',
      '1',
      '2',
      '4',
      '5'
    ]);
  });
});

/* @conditional-compile-remove(pinned-participants) */
describe('useOrganizedParticipants hook tests with pinned participants', () => {
  test('pinned participants should in grid and video participants should be at the start of overflow gallery', () => {
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
    expect(pinnedParticipantsLayout?.overflowGalleryParticipants.map((p) => p.userId)).toStrictEqual([
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
    'no participants should be in grid because of screenshare and overflow gallery should start with ' +
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
      expect(pinnedParticipantsLayout?.overflowGalleryParticipants.map((p) => p.userId)).toStrictEqual([
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

  test.only('pinning a participant should keep dominant speakers in the front of overflow gallery', () => {
    // 10 remote participants. First 5 with their video on ('1v', '2v', '3v', '4v' and '5v').
    // Last 5 with their video off ('1', '2', '3', '4' and '5').
    const remoteParticipants = createTestRemoteParticipants();

    const pinnedParticipantsLayout = setup(
      {
        remoteParticipants,
        dominantSpeakers: ['3v', '4v'],
        maxRemoteVideoStreams: 4,
        maxOverflowGalleryDominantSpeakers: 3
      },
      {
        remoteParticipants,
        dominantSpeakers: ['3v', '4v'],
        maxRemoteVideoStreams: 4,
        maxOverflowGalleryDominantSpeakers: 3,
        pinnedParticipantUserIds: ['1']
      }
    );

    expect(pinnedParticipantsLayout?.gridParticipants.map((p) => p.userId)).toStrictEqual(['1']);
    expect(pinnedParticipantsLayout?.overflowGalleryParticipants.map((p) => p.userId)).toStrictEqual([
      '3v',
      '4v',
      '2',
      '1v',
      '2v',
      '5v',
      '3',
      '4',
      '5'
    ]);
  });

  test('dominant speakers should be placed after pinned participants when screenshare is on', () => {
    // 10 remote participants. First 5 with their video on ('1v', '2v', '3v', '4v' and '5v').
    // Last 5 with their video off ('1', '2', '3', '4' and '5').
    const remoteParticipants = createTestRemoteParticipants();

    const pinnedParticipantsLayout = setup(
      {
        remoteParticipants,
        pinnedParticipantUserIds: ['1'],
        maxRemoteVideoStreams: 4,
        maxOverflowGalleryDominantSpeakers: 3,
        isScreenShareActive: true
      },
      {
        remoteParticipants,
        pinnedParticipantUserIds: ['1'],
        maxRemoteVideoStreams: 4,
        maxOverflowGalleryDominantSpeakers: 3,
        isScreenShareActive: true,
        dominantSpeakers: ['3v', '4v']
      }
    );

    expect(pinnedParticipantsLayout?.gridParticipants.map((p) => p.userId)).toStrictEqual([]);
    expect(pinnedParticipantsLayout?.overflowGalleryParticipants.map((p) => p.userId)).toStrictEqual([
      '1',
      '4v',
      '2v',
      '3v',
      '1v',
      '5v',
      '2',
      '3',
      '4',
      '5'
    ]);
  });
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

const setup = (
  initialArgs: OrganizedParticipantsArgs,
  updatedArgs?: OrganizedParticipantsArgs
): OrganizedParticipantsResult | undefined => {
  let layout: OrganizedParticipantsResult | undefined = undefined;
  const TestComponent = (props: OrganizedParticipantsArgs): null => {
    layout = useOrganizedParticipants(props);
    return null;
  };

  let root;
  act(() => {
    root = create(<TestComponent {...initialArgs} />);
  });

  if (updatedArgs) {
    act(() => {
      root.update(<TestComponent {...updatedArgs} />);
    });
  }

  return layout;
};

const createTestRemoteParticipants = (): VideoGalleryRemoteParticipant[] => {
  let remoteParticipants = [...Array(5).keys()].map((i) => {
    return createRemoteParticipant({
      userId: `${i + 1}v`,
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
  });
  // Last 5 with their video off.
  remoteParticipants = remoteParticipants.concat(
    [...Array(5).keys()].map((i) => {
      return createRemoteParticipant({
        userId: `${i + 1}`
      });
    })
  );
  return remoteParticipants;
};
