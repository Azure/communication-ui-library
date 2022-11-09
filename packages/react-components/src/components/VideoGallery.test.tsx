// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { initializeIcons, Persona } from '@fluentui/react';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { GridLayout, StreamMedia, _ModalClone } from '.';
import { VideoGalleryLocalParticipant, VideoGalleryRemoteParticipant } from '../types';
import { HorizontalGallery } from './HorizontalGallery';
import { DEFAULT_MAX_REMOTE_VIDEO_STREAMS, VideoGallery, VideoGalleryProps } from './VideoGallery';
import { VideoTile } from './VideoTile';

describe('VideoGallery floatingLocalVideo Layout', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  test('should render local video tile as the only tile', () => {
    const localParticipant = createLocalParticipant();
    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });
    const onCreateLocalStreamView = jest.fn(() => {
      root.setProps({
        localParticipant: createLocalParticipant({
          videoStream: {
            isAvailable: true,
            isReceiving: true,
            renderElement: createVideoDivElement()
          }
        }),
        onCreateLocalStreamView: onCreateLocalStreamView.bind(this)
      });
    });
    expect(tileCount(root)).toBe(1);
    expect(audioTileCount(root)).toBe(1);
    // We set the isAvailable and isReceiving flag to true to ensure that onCreateLocalStreamView is called.
    root.setProps({
      localParticipant: createLocalParticipant({
        videoStream: {
          isAvailable: true,
          isReceiving: true
        }
      })
    });
    root.setProps({ onCreateLocalStreamView: onCreateLocalStreamView.bind(this) });
    expect(onCreateLocalStreamView).toHaveBeenCalledTimes(1);
    expect(tileCount(root)).toBe(1);
    expect(videoTileCount(root)).toBe(1);
    expect(root.render()).toMatchSnapshot('VideoGallery-with-local-participant');
  });

  test('should render 1 remote video tile and floating local video', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, isReceiving: true, renderElement: createVideoDivElement() }
    });
    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });
    root.setProps({ layout: 'floatingLocalVideo' });
    const remoteParticipants = Array.from({ length: 1 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: true, isReceiving: true, renderElement: createVideoDivElement() }
      })
    );
    root.setProps({ remoteParticipants });
    expect(gridVideoTileCount(root)).toBe(1);
    // Floating Local Video Tile Modal
    expect(root.find(_ModalClone).length).toBe(1);
  });

  test('should render horizontal gallery when remote video tiles more than max', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, isReceiving: true, renderElement: createVideoDivElement() }
    });
    const root = mountVideoGalleryWithLocalParticipant({ localParticipant });
    root.setProps({ layout: 'floatingLocalVideo' });
    const remoteParticipants = Array.from({ length: 6 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: true, isReceiving: true, renderElement: createVideoDivElement() }
      })
    );
    root.setProps({ remoteParticipants });
    expect(gridVideoTileCount(root)).toBe(DEFAULT_MAX_REMOTE_VIDEO_STREAMS);
    expect(root.find(HorizontalGallery).length).toBe(1);
    // TODO: Mock container width here to be 450px and test number of tiles in horizontal gallery
    expect(root.render()).toMatchSnapshot('VideoGallery-with-horizontal-gallery');
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

// const gridTileCount = (root: ReactWrapper<VideoGalleryProps>): number => root.find(GridLayout).find(VideoTile).length;

const gridVideoTileCount = (root: ReactWrapper<VideoGalleryProps>): number =>
  root.find(GridLayout).find(StreamMedia).length;

// const gridAudioTileCount = (root: ReactWrapper<VideoGalleryProps>): number =>
//   root.find(GridLayout).find(Persona).length;

const createLocalParticipant = (attrs?: Partial<VideoGalleryLocalParticipant>): VideoGalleryLocalParticipant => {
  return {
    userId: attrs?.userId ?? `localParticipant-${Math.random()}`,
    isMuted: attrs?.isMuted ?? false,
    displayName: attrs?.displayName ?? 'Local Participant',
    isScreenSharingOn: attrs?.isScreenSharingOn ?? false,
    videoStream: {
      id: attrs?.videoStream?.id ?? Math.random(),
      isAvailable: attrs?.videoStream?.isAvailable ?? false,
      isReceiving: attrs?.videoStream?.isReceiving ?? false,
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
    userId: attrs?.userId ?? `remoteParticipant-${Math.random()}`,
    displayName: attrs?.displayName ?? 'Remote Participant',
    isMuted: attrs?.isMuted ?? false,
    isSpeaking: attrs?.isSpeaking ?? false,
    state: attrs?.state ?? 'Connected',
    screenShareStream: {
      id: attrs?.screenShareStream?.id ?? 1,
      isAvailable: attrs?.screenShareStream?.isAvailable ?? false,
      isReceiving: attrs?.screenShareStream?.isReceiving ?? false,
      isMirrored: attrs?.screenShareStream?.isMirrored ?? false,
      renderElement: attrs?.screenShareStream?.renderElement ?? undefined
    },
    videoStream: {
      id: attrs?.videoStream?.id ?? 1,
      isAvailable: attrs?.videoStream?.isAvailable ?? false,
      isReceiving: attrs?.videoStream?.isReceiving ?? false,
      isMirrored: attrs?.videoStream?.isMirrored ?? false,
      renderElement: attrs?.videoStream?.renderElement ?? undefined
    },
    isScreenSharingOn: attrs?.isScreenSharingOn ?? false
  };
};
