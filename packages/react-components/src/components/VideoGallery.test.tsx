// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { initializeIcons } from '@fluentui/react';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { VideoGalleryLocalParticipant } from '../types';
import { VideoGallery } from './VideoGallery';

const mockLocalRenderElement = document.createElement('div');
mockLocalRenderElement.innerHTML = '<div>LOCAL PARTICIPANT</div>';

const mockLocalParticipant: VideoGalleryLocalParticipant = {
  userId: 'localParticipant',
  isMuted: false,
  displayName: 'Local Participant',
  videoStream: {
    id: 1,
    isAvailable: true,
    isReceiving: true,
    isMirrored: true,
    renderElement: undefined
  },
  isScreenSharingOn: false
};

describe('VideoGallery', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  test('should render local video tile as the only tile', () => {
    const localParticipant = { ...mockLocalParticipant };
    const onCreateLocalStreamView = jest.fn();
    const root = mountVideoGalleryWithDefaults({ onCreateLocalStreamView, localParticipant });
    expect(onCreateLocalStreamView).toHaveBeenCalledTimes(1);
    root.setProps({
      localParticipant: {
        ...localParticipant,
        videoStream: {
          ...localParticipant.videoStream,
          renderElement: mockLocalRenderElement
        }
      },
      onCreateLocalStreamView: onCreateLocalStreamView
    });
    expect(onCreateLocalStreamView).toHaveBeenCalledTimes(1);
    expect(root.render()).toMatchSnapshot('VideoGallery-with-local-participant');
  });
});

const mountVideoGalleryWithDefaults = ({ onCreateLocalStreamView, localParticipant }): ReactWrapper => {
  return mount(<VideoGallery localParticipant={localParticipant} onCreateLocalStreamView={onCreateLocalStreamView} />);
};
