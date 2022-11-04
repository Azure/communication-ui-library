// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { initializeIcons, Stack } from '@fluentui/react';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { VideoGalleryLocalParticipant } from '../types';
import { VideoGallery } from './VideoGallery';

// create a document div with purple background
const mockLocalRenderElement = document.createElement('div');
mockLocalRenderElement.style.height = '50px';
mockLocalRenderElement.style.width = '50px';
mockLocalRenderElement.style.backgroundColor = 'purple';
mockLocalRenderElement.innerHTML = '<div>LOCAL PARTICIPANT</div>';

const mockLocalParticipant: VideoGalleryLocalParticipant = {
  userId: 'localParticipant',
  isMuted: false,
  displayName: 'localParticipant',
  videoStream: {
    id: 1,
    isAvailable: true,
    isReceiving: true,
    isMirrored: true,
    renderElement: mockLocalRenderElement
  },
  isScreenSharingOn: false
};

describe('VideoGallery', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  test('should render local video tile as the only tile', () => {
    const root = mountVideoGalleryWithDefaults();
    // create jest snapshot
    expect(root.render()).toMatchSnapshot('VideoGallery-with-local-participant');
  });
});

const mountVideoGalleryWithDefaults = (): ReactWrapper => {
  let root;
  act(() => {
    root = mount(
      <Stack style={{ height: '100px', width: '100px', position: 'relative' }}>
        <VideoGallery localParticipant={mockLocalParticipant} />
      </Stack>
    );
  });
  return root;
};
