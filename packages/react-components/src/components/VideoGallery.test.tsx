// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { initializeIcons, Persona } from '@fluentui/react';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { StreamMedia } from '.';
import { VideoGalleryLocalParticipant } from '../types';
import { VideoGallery, VideoGalleryProps } from './VideoGallery';
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

const createLocalParticipant = (attrs?: Partial<VideoGalleryLocalParticipant>): VideoGalleryLocalParticipant => {
  return {
    userId: attrs?.userId ?? 'localParticipant',
    isMuted: attrs?.isMuted ?? false,
    displayName: attrs?.displayName ?? 'Local Participant',
    isScreenSharingOn: attrs?.isScreenSharingOn ?? false,
    videoStream: {
      id: attrs?.videoStream?.id ?? 1,
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
