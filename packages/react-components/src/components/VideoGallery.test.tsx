// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Persona, registerIcons } from '@fluentui/react';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { GridLayout, StreamMedia, _ModalClone } from '.';
import { VideoGalleryLocalParticipant, VideoGalleryRemoteParticipant } from '../types';
import { HorizontalGallery } from './HorizontalGallery';
import { DEFAULT_MAX_REMOTE_VIDEO_STREAMS, VideoGallery, VideoGalleryProps } from './VideoGallery';
import { VideoTile } from './VideoTile';
import { v1 as createGUID } from 'uuid';
import * as responsive from './utils/responsive';
import * as acs_ui_common from '@internal/acs-ui-common';
import { RemoteScreenShare } from './VideoGallery/RemoteScreenShare';
import { act } from 'react-dom/test-utils';
/* @conditional-compile-remove(vertical-gallery) */
import { VerticalGallery } from './VerticalGallery';

Enzyme.configure({ adapter: new Adapter() });
registerIcons({
  icons: {
    horizontalgalleryleftbutton: <></>,
    horizontalgalleryrightbutton: <></>,
    videotilemoreoptions: <></>,
    videotilepinned: <></>,
    pinparticipant: <></>,
    unpinparticipant: <></>,
    videotilescalefit: <></>,
    videotilescalefill: <></>,
    verticalgalleryleftbutton: <></>,
    verticalgalleryrightbutton: <></>
  }
});

describe('VideoGallery default layout tests', () => {
  beforeAll(() => {
    mockVideoGalleryInternalHelpers();
  });

  test('should render local video tile in the grid alongside remote tiles', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
    });

    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({ layout: 'default', remoteParticipants });
    });
    const gridLayout = root.find(GridLayout);
    expect(
      gridLayout
        .find(VideoTile)
        .findWhere((n) => n.prop('userId') === 'localParticipant')
        .exists()
    ).toBe(true);
  });

  test('should not have floating local video tile present', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
    });

    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({ layout: 'default', remoteParticipants });
    });
    expect(root.find(_ModalClone).exists()).toBe(false);
  });

  test('should render all video tiles in the grid', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false }
    });

    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({ layout: 'default', remoteParticipants });
    });
    expect(tileCount(root)).toBe(11);
    expect(audioTileCount(root)).toBe(11);
    expect(videoTileCount(root)).toBe(0);
    expect(gridTileCount(root)).toBe(11);
    expect(gridAudioTileCount(root)).toBe(11);
    expect(gridVideoTileCount(root)).toBe(0);
    expect(root.find(HorizontalGallery).exists()).toBe(false);
  });

  test('should render max allowed video tiles with streams in the grid', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });

    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({ layout: 'default', remoteParticipants });
    });
    expect(gridVideoTileCount(root)).toBe(DEFAULT_MAX_REMOTE_VIDEO_STREAMS + 1); // +1 for the local video stream
    expect(root.find(HorizontalGallery).find(VideoTile).length).toBe(2);
  });

  test('should render remote screenshare and render dominant speaking remote participants in horizontal gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    // 8 remote audio participants
    const remoteParticipants = Array.from({ length: 8 }, () => createRemoteParticipant());
    // 1 remote video participant
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteVideoParticipant',
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );
    // 1 remote screen sharing participants
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteScreenSharingParticipant',
        isScreenSharingOn: true,
        screenShareStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({
        layout: 'floatingLocalVideo',
        remoteParticipants,
        dominantSpeakers: ['remoteScreenSharingParticipant', 'remoteVideoParticipant']
      });
    });

    expect(root.find(RemoteScreenShare).length).toBe(1);
    expect(root.find(HorizontalGallery).find(VideoTile).length).toBe(2);
    expect(root.find(HorizontalGallery).find(StreamMedia).length).toBe(1);
    expect(root.find(HorizontalGallery).find(VideoTile).first().prop('userId')).toBe('remoteScreenSharingParticipant');
    expect(root.find(HorizontalGallery).find(VideoTile).first().find(StreamMedia).exists()).toBe(false);
    expect(root.find(HorizontalGallery).find(VideoTile).at(1).prop('userId')).toBe('remoteVideoParticipant');
    expect(root.find(HorizontalGallery).find(VideoTile).at(1).find(StreamMedia).exists()).toBe(true);
  });
});

describe('VideoGallery floating local video layout tests', () => {
  beforeAll(() => {
    mockVideoGalleryInternalHelpers();
  });

  test('should have floating local video tile present', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
    });

    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({ layout: 'floatingLocalVideo', remoteParticipants });
    });

    expect(root.find(_ModalClone).exists()).toBe(true);
    expect(
      root
        .find(GridLayout)
        .find(VideoTile)
        .findWhere((n) => n.prop('userId') === 'localUser')
        .exists()
    ).toBe(false);
  });

  test('should render all remote video tiles in the grid and others to horizontal gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false }
    });

    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({ layout: 'floatingLocalVideo', remoteParticipants });
    });

    expect(tileCount(root)).toBe(10);
    expect(audioTileCount(root)).toBe(10);
    expect(videoTileCount(root)).toBe(0);
    expect(gridTileCount(root)).toBe(10);
    expect(gridAudioTileCount(root)).toBe(10);
    expect(gridVideoTileCount(root)).toBe(0);
    expect(root.find(HorizontalGallery).exists()).toBe(false);
  });

  test('should render max allowed video tiles with streams in the grid', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });

    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({ layout: 'floatingLocalVideo', remoteParticipants });
    });

    expect(gridVideoTileCount(root)).toBe(DEFAULT_MAX_REMOTE_VIDEO_STREAMS);
    expect(root.find(HorizontalGallery).find(VideoTile).length).toBe(2);
  });

  test('should render remote screenshare and render dominant speaking remote participants in horizontal gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    // 8 remote audio participants
    const remoteParticipants = Array.from({ length: 8 }, () => createRemoteParticipant());
    // 1 remote video participant
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteVideoParticipant',
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );
    // 1 remote screen sharing participants
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteScreenSharingParticipant',
        isScreenSharingOn: true,
        screenShareStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({
        layout: 'floatingLocalVideo',
        remoteParticipants,
        dominantSpeakers: ['remoteScreenSharingParticipant', 'remoteVideoParticipant']
      });
    });

    expect(root.find(RemoteScreenShare).length).toBe(1);
    expect(root.find(HorizontalGallery).find(VideoTile).length).toBe(2);
    expect(root.find(HorizontalGallery).find(StreamMedia).length).toBe(1);
    expect(root.find(HorizontalGallery).find(VideoTile).first().prop('userId')).toBe('remoteScreenSharingParticipant');
    expect(root.find(HorizontalGallery).find(VideoTile).first().find(StreamMedia).exists()).toBe(false);
    expect(root.find(HorizontalGallery).find(VideoTile).at(1).prop('userId')).toBe('remoteVideoParticipant');
    expect(root.find(HorizontalGallery).find(VideoTile).at(1).find(StreamMedia).exists()).toBe(true);
  });
});

/* @conditional-compile-remove(pinned-participants) */
describe('VideoGallery pinned participants tests', () => {
  beforeAll(() => {
    mockVideoGalleryInternalHelpers();
  });

  test('should render pinned participants in grid layout', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    // 10 remote participants. First 5 with their video on.
    const remoteParticipants = [...Array(10).keys()].map((i) => {
      return createRemoteParticipant({
        userId: `${i}`,
        videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
      });
    });

    act(() => {
      root.setProps({
        layout: 'floatingLocalVideo',
        remoteParticipants,
        dominantSpeakers: ['1', '6'],
        pinnedParticipants: ['7', '6']
      });
    });

    expect(gridTileCount(root)).toBe(2);
    expect(root.find(GridLayout).find(VideoTile).first().prop('userId')).toBe('7');
    expect(root.find(GridLayout).find(VideoTile).first().find(StreamMedia).exists()).toBe(false);
    expect(root.find(GridLayout).find(VideoTile).at(1).prop('userId')).toBe('6');
    expect(root.find(GridLayout).find(VideoTile).at(1).find(StreamMedia).exists()).toBe(false);
    expect(root.find(HorizontalGallery).find(VideoTile).length).toBe(2);
    expect(root.find(HorizontalGallery).find(VideoTile).first().prop('userId')).toBe('1');
    expect(root.find(HorizontalGallery).find(VideoTile).first().find(StreamMedia).exists()).toBe(true);
    expect(root.find(HorizontalGallery).find(VideoTile).at(1).prop('userId')).toBe('0');
    expect(root.find(HorizontalGallery).find(VideoTile).at(1).find(StreamMedia).exists()).toBe(true);
  });

  test('should render remote screenshare and render pinned remote participants in horizontal gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    // 10 remote participants. First 5 with their video on.
    const remoteParticipants = [...Array(10).keys()].map((i) => {
      return createRemoteParticipant({
        userId: `${i}`,
        videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
      });
    });

    // 1 remote screen sharing participant
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteScreenSharingParticipant',
        isScreenSharingOn: true,
        screenShareStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({
        layout: 'floatingLocalVideo',
        remoteParticipants,
        dominantSpeakers: ['1', '6'],
        pinnedParticipants: ['7', '6']
      });
    });

    expect(root.find(RemoteScreenShare).length).toBe(1);
    expect(root.find(HorizontalGallery).find(VideoTile).length).toBe(2);
    expect(root.find(HorizontalGallery).find(VideoTile).first().prop('userId')).toBe('7');
    expect(root.find(HorizontalGallery).find(VideoTile).first().find(StreamMedia).exists()).toBe(false);
    expect(root.find(HorizontalGallery).find(VideoTile).at(1).prop('userId')).toBe('6');
    expect(root.find(HorizontalGallery).find(VideoTile).at(1).find(StreamMedia).exists()).toBe(false);
  });

  test(
    'number of pinned remote video tiles can exceed maxPinnedRemoteVideoTiles when pinnedParticipants is ' +
      'assigned as prop',
    () => {
      const localParticipant = createLocalParticipant({
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      });
      const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

      // 10 remote participants. First 5 with their video on.
      const remoteParticipants = [...Array(10).keys()].map((i) => {
        return createRemoteParticipant({
          userId: `${i}`,
          videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
        });
      });

      const pinnedParticipantUserIds = ['7', '8', '9', '1', '2'];

      act(() => {
        root.setProps({
          layout: 'floatingLocalVideo',
          remoteParticipants,
          dominantSpeakers: ['1', '6'],
          pinnedParticipants: pinnedParticipantUserIds
        });
      });

      const gridLayoutVideoTiles = root.find(GridLayout).find(VideoTile);
      const gridLayoutUserIds = gridLayoutVideoTiles.map((t) => t.prop('userId'));
      // verify that video tiles in the grid layout are in the same order as the pinned
      expect(gridLayoutUserIds).toStrictEqual(pinnedParticipantUserIds);
      // verify the correct pinned remote video tiles have their video on
      gridLayoutVideoTiles.forEach((videoTile) => {
        const userId = videoTile.prop('userId');
        if (!userId) {
          fail();
        }
        expect(videoTile.find(StreamMedia).exists()).toBe(parseInt(userId) < 5);
      });
    }
  );
});

/* @conditional-compile-remove(vertical-gallery) */
describe('VideoGallery with vertical overflow gallery tests', () => {
  beforeAll(() => {
    mockVideoGalleryInternalHelpers();
  });

  test('should render participants with video stream available in the grid', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false }
    });

    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );
    remoteParticipants.push(
      createRemoteParticipant({
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({ layout: 'floatingLocalVideo', overflowGalleryLayout: 'VerticalRight', remoteParticipants });
    });
    expect(gridTileCount(root)).toBe(1);
    expect(root.find(VerticalGallery).exists()).toBe(true);
    expect(root.find(VerticalGallery).find(VideoTile).length).toBe(4);
  });

  test('should render remote screenshare and render dominant speaking remote participants in vertical gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    // 8 remote audio participants
    const remoteParticipants = Array.from({ length: 8 }, () => createRemoteParticipant());
    // 1 remote video participant
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteVideoParticipant',
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );
    // 1 remote screen sharing participants
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteScreenSharingParticipant',
        isScreenSharingOn: true,
        screenShareStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    act(() => {
      root.setProps({
        layout: 'floatingLocalVideo',
        overflowGalleryLayout: 'VerticalRight',
        remoteParticipants,
        dominantSpeakers: ['remoteScreenSharingParticipant', 'remoteVideoParticipant']
      });
    });

    expect(root.find(RemoteScreenShare).length).toBe(1);
    expect(root.find(VerticalGallery).find(VideoTile).length).toBe(4);
    expect(root.find(VerticalGallery).find(StreamMedia).length).toBe(1);
    expect(root.find(VerticalGallery).find(VideoTile).first().prop('userId')).toBe('remoteScreenSharingParticipant');
    expect(root.find(VerticalGallery).find(VideoTile).first().find(StreamMedia).exists()).toBe(false);
    expect(root.find(VerticalGallery).find(VideoTile).at(1).prop('userId')).toBe('remoteVideoParticipant');
    expect(root.find(VerticalGallery).find(VideoTile).at(1).find(StreamMedia).exists()).toBe(true);
  });

  /* @conditional-compile-remove(pinned-participants) */
  test('should render pinned participants in grid layout and others to vertical gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    // 10 remote participants. First 5 with their video on.
    const remoteParticipants = [...Array(10).keys()].map((i) => {
      return createRemoteParticipant({
        userId: `${i}`,
        videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
      });
    });

    act(() => {
      root.setProps({
        layout: 'floatingLocalVideo',
        overflowGalleryLayout: 'VerticalRight',
        remoteParticipants,
        dominantSpeakers: ['1', '6'],
        pinnedParticipants: ['7', '6']
      });
    });

    expect(gridTileCount(root)).toBe(2);
    expect(root.find(GridLayout).find(VideoTile).first().prop('userId')).toBe('7');
    expect(root.find(GridLayout).find(VideoTile).first().find(StreamMedia).exists()).toBe(false);
    expect(root.find(GridLayout).find(VideoTile).at(1).prop('userId')).toBe('6');
    expect(root.find(GridLayout).find(VideoTile).at(1).find(StreamMedia).exists()).toBe(false);
    expect(root.find(VerticalGallery).length).toBe(1);
    expect(root.find(VerticalGallery).find(VideoTile).length).toBe(4);
    expect(root.find(VerticalGallery).find(VideoTile).first().prop('userId')).toBe('1');
    expect(root.find(VerticalGallery).find(VideoTile).first().find(StreamMedia).exists()).toBe(true);
    expect(root.find(VerticalGallery).find(VideoTile).at(1).prop('userId')).toBe('0');
    expect(root.find(VerticalGallery).find(VideoTile).at(1).find(StreamMedia).exists()).toBe(true);
  });
});

const mountVideoGalleryWithLocalParticipant = (attrs: {
  localParticipant: VideoGalleryLocalParticipant;
}): ReactWrapper<VideoGalleryProps> => {
  const { localParticipant } = attrs;
  return mount(<VideoGallery localParticipant={localParticipant} />);
};

const tileCount = (root: ReactWrapper<VideoGalleryProps>): number => root.find(VideoTile).length;

const videoTileCount = (root: ReactWrapper<VideoGalleryProps>): number =>
  root.find(VideoTile).filterWhere((node) => {
    return node.find(Persona).length === 0 && node.find(StreamMedia).length === 1;
  }).length;

const audioTileCount = (root: ReactWrapper<VideoGalleryProps>): number =>
  root.find(VideoTile).filterWhere((node) => {
    return node.find(Persona).length === 1 && node.find('video').length === 0;
  }).length;

const gridTileCount = (root: ReactWrapper<VideoGalleryProps>): number => root.find(GridLayout).find(VideoTile).length;

const gridVideoTileCount = (root: ReactWrapper<VideoGalleryProps>): number =>
  root.find(GridLayout).find(StreamMedia).length;

const gridAudioTileCount = (root: ReactWrapper<VideoGalleryProps>): number =>
  root.find(GridLayout).find(Persona).length;

const createLocalParticipant = (attrs?: Partial<VideoGalleryLocalParticipant>): VideoGalleryLocalParticipant => {
  return {
    userId: attrs?.userId ?? 'localParticipant',
    isMuted: attrs?.isMuted ?? false,
    displayName: attrs?.displayName ?? 'Local Participant',
    isScreenSharingOn: attrs?.isScreenSharingOn ?? false,
    videoStream: {
      id: attrs?.videoStream?.id ?? Math.random(),
      isAvailable: attrs?.videoStream?.isAvailable ?? false,
      isReceiving: attrs?.videoStream?.isReceiving ?? true,
      isMirrored: attrs?.videoStream?.isMirrored ?? false,
      renderElement: attrs?.videoStream?.renderElement ?? undefined
    }
  };
};

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
      renderElement: attrs?.videoStream?.renderElement ?? undefined,
      /* @conditional-compile-remove(pinned-participants) */
      scalingMode: attrs?.videoStream?.scalingMode ?? 'Crop'
    },
    isScreenSharingOn: attrs?.isScreenSharingOn ?? false
  };
};

const mockVideoGalleryInternalHelpers = (): void => {
  // Need to mock this because the HorizontalGallery uses this function. But JSDOM does not actually do any
  // rendering so getComputedStyle(document.documentElement).fontSize will not actually have a value
  jest.spyOn(acs_ui_common, '_convertRemToPx').mockImplementation((rem: number) => {
    return rem * 16;
  });
  // Need to mock hook _useContainerWidth because the returned width is used by HorizontalGallery to decide
  // how many tiles to show per page
  jest.spyOn(responsive, '_useContainerWidth').mockImplementation(() => 500);
  // Need to mock hook _useContainerWidth because the returned width is used by HorizontalGallery to decide
  // how many tiles to show per page
  jest.spyOn(responsive, '_useContainerHeight').mockImplementation(() => 500);
};
