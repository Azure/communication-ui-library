// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { registerIcons } from '@fluentui/react';
import React from 'react';
import { _ModalClone } from '.';
import { VideoGalleryLocalParticipant, VideoGalleryRemoteParticipant } from '../types';
import { DEFAULT_MAX_REMOTE_VIDEO_STREAMS, VideoGallery } from './VideoGallery';
import { v1 as createGUID } from 'uuid';
import * as responsive from './utils/responsive';
import * as acs_ui_common from '@internal/acs-ui-common';
import * as childrenCalculations from './VideoGallery/utils/OverflowGalleryUtils';
import { render } from '@testing-library/react';

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
    const remoteParticipants = Array.from({ length: 2 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );

    const { container } = render(
      <VideoGallery layout="default" localParticipant={localParticipant} remoteParticipants={remoteParticipants} />
    );

    const tiles = getGridTiles(container);
    expect(tiles.length).toBe(3);
    expect(
      tiles.some((tile) => {
        return tile.textContent === 'You';
      })
    ).toBe(true);
  });

  test('should not have floating local video tile present', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
    });
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );

    const { container } = render(
      <VideoGallery layout="default" localParticipant={localParticipant} remoteParticipants={remoteParticipants} />
    );

    expect(getFloatingLocalVideoModal(container)).toBe(null);
  });

  test('should render all video tiles in the grid', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false }
    });
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );

    const { container } = render(
      <VideoGallery layout="default" localParticipant={localParticipant} remoteParticipants={remoteParticipants} />
    );

    const allTiles = getTiles(container);
    const gridTiles = getGridTiles(container);
    expect(allTiles.length).toBe(11);
    expect(gridTiles.length).toBe(allTiles.length);
    expect(gridTiles.filter(tileIsAudio).length).toBe(11);
    expect(gridTiles.filter(tileIsVideo).length).toBe(0);
  });

  test('should render max allowed video tiles with streams in the grid', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    const { container } = render(
      <VideoGallery layout="default" localParticipant={localParticipant} remoteParticipants={remoteParticipants} />
    );

    expect(getGridTiles(container).length).toBe(DEFAULT_MAX_REMOTE_VIDEO_STREAMS + 1); // +1 for the local video stream
    let expectedHorizontalGalleryLength = 2;

    /* @conditional-compile-remove(optimal-video-count) */
    expectedHorizontalGalleryLength = 1;
    expect(getTiles(getHorizontalGallery(container)).length).toBe(expectedHorizontalGalleryLength);
  });

  test('should render remote screenshare and render dominant speaking remote participants in horizontal gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    // 8 remote audio participants
    const remoteParticipants = Array.from({ length: 8 }, () => createRemoteParticipant());
    // 1 remote video participant
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteVideoParticipant',
        displayName: 'Remote Video Participant',
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );
    // 1 remote screen sharing participants
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteScreenSharingParticipant',
        displayName: 'Remote Screensharing Participant',
        isScreenSharingOn: true,
        screenShareStream: { isAvailable: true, renderElement: createRemoteScreenShareVideoDivElement() }
      })
    );

    const { container } = render(
      <VideoGallery
        layout="default"
        localParticipant={localParticipant}
        remoteParticipants={remoteParticipants}
        dominantSpeakers={['remoteScreenSharingParticipant', 'remoteVideoParticipant']}
      />
    );

    expect(container.querySelectorAll('#remote-screen-share').length).toBe(1);

    const horizontalGallery = getHorizontalGallery(container);
    const horizontalGalleryTiles = getTiles(horizontalGallery);
    expect(horizontalGalleryTiles.length).toBe(2);
    expect(horizontalGalleryTiles.filter(tileIsVideo).length).toBe(1);

    expect(getDisplayName(horizontalGalleryTiles[0])).toBe('Remote Screensharing Participant');
    expect(tileIsVideo(horizontalGalleryTiles[0])).toBe(false);
    expect(getDisplayName(horizontalGalleryTiles[1])).toBe('Remote Video Participant');
    expect(tileIsVideo(horizontalGalleryTiles[1])).toBe(true);
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
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );

    const { container } = render(
      <VideoGallery
        layout="floatingLocalVideo"
        localParticipant={localParticipant}
        remoteParticipants={remoteParticipants}
      />
    );

    const floatingLocalVideoModal = getFloatingLocalVideoModal(container);
    expect(floatingLocalVideoModal).toBeTruthy();

    const gridTiles = getGridTiles(container);
    expect(
      gridTiles.some((tile) => {
        return tile.textContent === 'You';
      })
    ).toBe(false);
  });

  test('should render all remote video tiles in the grid and others to horizontal gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false }
    });
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );

    const { container } = render(
      <VideoGallery
        layout="floatingLocalVideo"
        localParticipant={localParticipant}
        remoteParticipants={remoteParticipants}
      />
    );

    const allTiles = getTiles(container);
    const gridTiles = getGridTiles(container);
    expect(allTiles.length).toBe(11);
    expect(gridTiles.length).toBe(10);
    expect(gridTiles.filter(tileIsAudio).length).toBe(10);
    expect(gridTiles.filter(tileIsVideo).length).toBe(0);
    expect(getHorizontalGallery(container)).toBeFalsy;
  });

  test('should render max allowed video tiles with streams in the grid', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    const { container } = render(
      <VideoGallery
        layout="floatingLocalVideo"
        localParticipant={localParticipant}
        remoteParticipants={remoteParticipants}
      />
    );

    const gridTiles = getGridTiles(container);
    const horizontalGalleryTiles = getTiles(getHorizontalGallery(container));

    expect(gridTiles.length).toBe(DEFAULT_MAX_REMOTE_VIDEO_STREAMS);
    let expectedGalleryTilesLength = 2;
    /* @conditional-compile-remove(optimal-video-count) */
    expectedGalleryTilesLength = 1;
    expect(horizontalGalleryTiles.length).toBe(expectedGalleryTilesLength);
  });

  test('should render remote screenshare and render dominant speaking remote participants in horizontal gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    // 8 remote audio participants
    const remoteParticipants = Array.from({ length: 8 }, () => createRemoteParticipant());
    // 1 remote video participant
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteVideoParticipant',
        displayName: 'Remote Video Participant',
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );
    // 1 remote screen sharing participants
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteScreenSharingParticipant',
        displayName: 'Remote Screensharing Participant',
        isScreenSharingOn: true,
        screenShareStream: { isAvailable: true, renderElement: createRemoteScreenShareVideoDivElement() }
      })
    );
    const { container } = render(
      <VideoGallery
        layout="floatingLocalVideo"
        localParticipant={localParticipant}
        remoteParticipants={remoteParticipants}
        dominantSpeakers={['remoteScreenSharingParticipant', 'remoteVideoParticipant']}
      />
    );

    expect(container.querySelectorAll('#remote-screen-share').length).toBe(1);

    const horizontalGallery = getHorizontalGallery(container);
    const horizontalGalleryTiles = getTiles(horizontalGallery);
    expect(horizontalGalleryTiles.length).toBe(2);
    expect(horizontalGalleryTiles.filter(tileIsVideo).length).toBe(1);

    expect(getDisplayName(horizontalGalleryTiles[0])).toBe('Remote Screensharing Participant');
    expect(tileIsVideo(horizontalGalleryTiles[0])).toBe(false);
    expect(getDisplayName(horizontalGalleryTiles[1])).toBe('Remote Video Participant');
    expect(tileIsVideo(horizontalGalleryTiles[1])).toBe(true);
  });
});

// /* @conditional-compile-remove(pinned-participants) */
describe('VideoGallery pinned participants tests', () => {
  beforeAll(() => {
    mockVideoGalleryInternalHelpers();
  });

  test('should render pinned participants in grid layout', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    // 10 remote participants. First 5 with their video on.
    const remoteParticipants = [...Array(10).keys()].map((i) => {
      return createRemoteParticipant({
        userId: `${i}`,
        displayName: `Remote Participant ${i}`,
        videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
      });
    });

    const { container } = render(
      <VideoGallery
        layout="floatingLocalVideo"
        localParticipant={localParticipant}
        remoteParticipants={remoteParticipants}
        dominantSpeakers={['1', '6']}
        pinnedParticipants={['7', '6']}
      />
    );

    const gridTiles = getGridTiles(container);
    const horizontalGalleryTiles = getTiles(getHorizontalGallery(container));

    expect(gridTiles.length).toBe(2);
    expect(getDisplayName(gridTiles[0])).toBe('Remote Participant 7');
    expect(tileIsVideo(gridTiles[0])).toBe(false);
    expect(getDisplayName(gridTiles[1])).toBe('Remote Participant 6');
    expect(tileIsVideo(gridTiles[1])).toBe(false);
    expect(horizontalGalleryTiles.length).toBe(2);
    expect(getDisplayName(horizontalGalleryTiles[0])).toBe('Remote Participant 1');
    expect(tileIsVideo(horizontalGalleryTiles[0])).toBe(true);
    expect(getDisplayName(horizontalGalleryTiles[1])).toBe('Remote Participant 0');
    expect(tileIsVideo(horizontalGalleryTiles[1])).toBe(true);
  });

  test('should render remote screenshare and render pinned remote participants in horizontal gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    // 10 remote participants. First 5 with their video on.
    const remoteParticipants = [...Array(10).keys()].map((i) => {
      return createRemoteParticipant({
        userId: `${i}`,
        displayName: `Remote Participant ${i}`,
        videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
      });
    });
    // 1 remote screen sharing participant
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteScreenSharingParticipant',
        isScreenSharingOn: true,
        screenShareStream: { isAvailable: true, renderElement: createRemoteScreenShareVideoDivElement() }
      })
    );

    const { container } = render(
      <VideoGallery
        layout="floatingLocalVideo"
        localParticipant={localParticipant}
        remoteParticipants={remoteParticipants}
        dominantSpeakers={['1', '6']}
        pinnedParticipants={['7', '6']}
      />
    );

    expect(container.querySelectorAll('#remote-screen-share').length).toBe(1);

    const horizontalGalleryTiles = getTiles(getHorizontalGallery(container));

    expect(horizontalGalleryTiles.length).toBe(2);
    expect(getDisplayName(horizontalGalleryTiles[0])).toBe('Remote Participant 7');
    expect(tileIsVideo(horizontalGalleryTiles[0])).toBe(false);
    expect(getDisplayName(horizontalGalleryTiles[1])).toBe('Remote Participant 6');
    expect(tileIsVideo(horizontalGalleryTiles[1])).toBe(false);
  });

  test(
    'number of pinned remote video tiles can exceed maxPinnedRemoteVideoTiles when pinnedParticipants is ' +
      'assigned as prop',
    () => {
      const localParticipant = createLocalParticipant({
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      });
      // 10 remote participants. First 5 with their video on.
      const remoteParticipants = [...Array(10).keys()].map((i) => {
        return createRemoteParticipant({
          userId: `${i}`,
          displayName: `${i}`,
          videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
        });
      });

      const { container } = render(
        <VideoGallery
          layout="floatingLocalVideo"
          localParticipant={localParticipant}
          remoteParticipants={remoteParticipants}
          dominantSpeakers={['1', '6']}
          pinnedParticipants={['7', '8', '9', '1', '2']}
        />
      );

      const gridTiles = getGridTiles(container);

      // verify that video tiles in the grid layout are in the same order as the pinned
      expect(getDisplayName(gridTiles[0])).toBe('7');
      expect(getDisplayName(gridTiles[1])).toBe('8');
      expect(getDisplayName(gridTiles[2])).toBe('9');
      expect(getDisplayName(gridTiles[3])).toBe('1');
      expect(getDisplayName(gridTiles[4])).toBe('2');

      // verify the correct pinned remote video tiles have their video on
      expect(tileIsVideo(gridTiles[0])).toBe(false);
      expect(tileIsVideo(gridTiles[1])).toBe(false);
      expect(tileIsVideo(gridTiles[2])).toBe(false);
      expect(tileIsVideo(gridTiles[3])).toBe(true);
      expect(tileIsVideo(gridTiles[4])).toBe(true);
    }
  );
});

// /* @conditional-compile-remove(vertical-gallery) */
describe('VideoGallery with vertical overflow gallery tests', () => {
  beforeAll(() => {
    mockVideoGalleryInternalHelpers();
  });

  test('should render participants with video stream available in the grid', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false }
    });
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

    const { container } = render(
      <VideoGallery
        layout="floatingLocalVideo"
        localParticipant={localParticipant}
        remoteParticipants={remoteParticipants}
        overflowGalleryPosition={'VerticalRight'}
      />
    );

    expect(getGridTiles(container).length).toBe(1);

    const verticalGallery = getVerticalGallery(container);
    expect(verticalGallery).toBeTruthy();

    const verticalGalleryTiles = getTiles(verticalGallery);
    expect(verticalGalleryTiles.length).toBe(4);
  });

  test('should render remote screenshare and render dominant speaking remote participants in vertical gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    // 8 remote audio participants
    const remoteParticipants = Array.from({ length: 8 }, () => createRemoteParticipant());
    // 1 remote video participant
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteVideoParticipant',
        displayName: 'Remote Video Participant',
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );
    // 1 remote screen sharing participants
    remoteParticipants.push(
      createRemoteParticipant({
        userId: 'remoteScreenSharingParticipant',
        displayName: 'Remote Screen Sharing Participant',
        isScreenSharingOn: true,
        screenShareStream: { isAvailable: true, renderElement: createRemoteScreenShareVideoDivElement() }
      })
    );

    const { container } = render(
      <VideoGallery
        layout="floatingLocalVideo"
        localParticipant={localParticipant}
        remoteParticipants={remoteParticipants}
        overflowGalleryPosition={'VerticalRight'}
        dominantSpeakers={['remoteScreenSharingParticipant', 'remoteVideoParticipant']}
      />
    );

    expect(container.querySelectorAll('#remote-screen-share').length).toBe(1);

    const verticalGalleryTiles = getTiles(getVerticalGallery(container));

    expect(verticalGalleryTiles.length).toBe(4);
    expect(verticalGalleryTiles.filter(tileIsVideo).length).toBe(1);
    expect(getDisplayName(verticalGalleryTiles[0])).toBe('Remote Screen Sharing Participant');
    expect(tileIsVideo(verticalGalleryTiles[0])).toBe(false);
    expect(getDisplayName(verticalGalleryTiles[1])).toBe('Remote Video Participant');
    expect(tileIsVideo(verticalGalleryTiles[1])).toBe(true);
  });

  /* @conditional-compile-remove(pinned-participants) */
  test('should render pinned participants in grid layout and others to vertical gallery', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    // 10 remote participants. First 5 with their video on.
    const remoteParticipants = [...Array(10).keys()].map((i) => {
      return createRemoteParticipant({
        userId: `${i}`,
        displayName: `Remote Participant ${i}`,
        videoStream: i < 5 ? { isAvailable: true, renderElement: createVideoDivElement() } : undefined
      });
    });

    const { container } = render(
      <VideoGallery
        layout="floatingLocalVideo"
        localParticipant={localParticipant}
        remoteParticipants={remoteParticipants}
        overflowGalleryPosition={'VerticalRight'}
        dominantSpeakers={['1', '6']}
        pinnedParticipants={['7', '6']}
      />
    );

    const gridTiles = getGridTiles(container);
    const verticalGalleryTiles = getTiles(getVerticalGallery(container));

    expect(gridTiles.length).toBe(2);
    expect(getDisplayName(gridTiles[0])).toBe('Remote Participant 7');
    expect(tileIsVideo(gridTiles[0])).toBe(false);
    expect(getDisplayName(gridTiles[1])).toBe('Remote Participant 6');
    expect(tileIsVideo(gridTiles[1])).toBe(false);
    expect(verticalGalleryTiles.length).toBe(4);
    expect(getDisplayName(verticalGalleryTiles[0])).toBe('Remote Participant 1');
    expect(tileIsVideo(verticalGalleryTiles[0])).toBe(true);
    expect(getDisplayName(verticalGalleryTiles[1])).toBe('Remote Participant 0');
    expect(tileIsVideo(verticalGalleryTiles[1])).toBe(true);
  });
});

const getFloatingLocalVideoModal = (root: Element | null): Element | null =>
  root?.querySelector('[data-ui-id="floating-local-video-host"]') ?? null;

const getGridLayout = (root: Element | null): Element | null =>
  root?.querySelector('[data-ui-id="grid-layout"]') ?? null;
const getHorizontalGallery = (root: Element | null): Element | null =>
  root?.querySelector('[data-ui-id="responsive-horizontal-gallery"]') ?? null;
/* @conditional-compile-remove(vertical-gallery) */
const getVerticalGallery = (root: Element | null): Element | null =>
  root?.querySelector('[data-ui-id="responsive-vertical-gallery"]') ?? null;

const getTiles = (root: Element | null): Element[] =>
  Array.from(root?.querySelectorAll('[data-ui-id="video-tile"]') ?? []);
const getGridTiles = (root: Element | null): Element[] => Array.from(getTiles(getGridLayout(root)));
const tileIsVideo = (tile: Element): boolean => !!tile.querySelector('video');
const tileIsAudio = (tile: Element): boolean => !tile.querySelector('video');
const getDisplayName = (root: Element): string | null | undefined => {
  return root?.querySelector('[data-ui-id="video-tile-display-name"]')?.textContent;
};

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
  divElement.innerHTML = '<video></video>';
  return divElement;
};

const createRemoteScreenShareVideoDivElement = (): HTMLDivElement => {
  const divElement = document.createElement('div');
  divElement.innerHTML = '<video id="remote-screen-share"></video>';
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
  jest.spyOn(childrenCalculations, 'calculateHorizontalChildrenPerPage').mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args: { numberOfChildren: number; containerWidth: number; gapWidthRem: number; buttonWidthRem: number }) => {
      return 2;
    }
  );
  jest.spyOn(childrenCalculations, 'calculateVerticalChildrenPerPage').mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args: {
      numberOfChildren: number;
      containerHeight: number;
      gapHeightRem: number;
      controlBarHeight: number;
      isShort: boolean;
    }) => {
      return 4;
    }
  );
  // Need to mock hook _useContainerWidth because the returned width is used by HorizontalGallery to decide
  // how many tiles to show per page
  jest.spyOn(responsive, '_useContainerWidth').mockImplementation(() => 500);
  // Need to mock hook _useContainerWidth because the returned width is used by HorizontalGallery to decide
  // how many tiles to show per page
  jest.spyOn(responsive, '_useContainerHeight').mockImplementation(() => 500);
};
