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

Enzyme.configure({ adapter: new Adapter() });

describe('VideoGallery default layout', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        horizontalgalleryleftbutton: <></>,
        horizontalgalleryrightbutton: <></>
      }
    });

    // Need to mock this because the HorizontalGallery uses this function. But JSDOM does not actually do any
    // rendering so getComputedStyle(document.documentElement).fontSize won't actually have a value
    jest.spyOn(acs_ui_common, '_convertRemToPx').mockImplementation((rem: number) => {
      return rem * 16;
    });
    // Need to mock hook _useContainerWidth because the returned width is used by HorizontalGallery to decide
    // how many tiles to show per page
    jest.spyOn(responsive, '_useContainerWidth').mockImplementation(() => 500);
  });

  test('should render local video tile in the grid alongside remote tiles', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
    });

    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    root.setProps({ layout: 'default' });
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );
    root.setProps({ remoteParticipants });
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

    root.setProps({ layout: 'default' });
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );
    root.setProps({ remoteParticipants });
    expect(root.find(_ModalClone).exists()).toBe(false);
  });

  test('should render all video tiles in the grid ', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false }
    });

    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });

    root.setProps({ layout: 'default' });
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );
    root.setProps({ remoteParticipants });
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

    root.setProps({ layout: 'default' });
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );
    root.setProps({ remoteParticipants });
    expect(gridVideoTileCount(root)).toBe(DEFAULT_MAX_REMOTE_VIDEO_STREAMS + 1); // +1 for the local video stream
    expect(root.find(HorizontalGallery).find(VideoTile).length).toBe(2);
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
      renderElement: attrs?.videoStream?.renderElement ?? undefined
    },
    isScreenSharingOn: attrs?.isScreenSharingOn ?? false
  };
};
