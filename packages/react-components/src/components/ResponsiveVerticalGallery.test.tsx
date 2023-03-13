// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { registerIcons } from '@fluentui/react';
import * as acs_ui_common from '@internal/acs-ui-common';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { v1 as createGUID } from 'uuid';
import { VideoGalleryRemoteParticipant } from '../types';
import { ResponsiveVerticalGallery, ResponsiveVerticalGalleryProps } from './ResponsiveVerticalGallery';
import * as responsive from './utils/responsive';
import { LARGE_HORIZONTAL_GALLERY_TILE_STYLE } from './VideoGallery/styles/VideoGalleryResponsiveHorizontalGallery.styles';
import { verticalGalleryContainerStyle } from './VideoGallery/styles/VideoGalleryResponsiveVerticalGallery.styles';
import { HORIZONTAL_GALLERY_GAP } from './styles/HorizontalGallery.styles';
import { VideoTile } from './VideoTile';

Enzyme.configure({ adapter: new Adapter() });
registerIcons({
  icons: {
    verticalgalleryleftbutton: <></>,
    verticalgalleryrightbutton: <></>,
    contact: <></>
  }
});

describe('ResponsiveVerticalGallery tests', () => {
  test('should render 3 video tiles if container height of ResponsiveVerticalGallery is 500', () => {
    mockResponsiveVerticalGalleryContainerHeight(500);
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false }
      })
    );

    const root = mountResponsiveVerticalGallery({ remoteParticipants });
    expect(root.find(VideoTile).length).toBe(4);
  });

  test('should render 8 video tile if container height of ResponsiveVerticalGallery is 1000', () => {
    mockResponsiveVerticalGalleryContainerHeight(1000);
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false }
      })
    );

    const root = mountResponsiveVerticalGallery({ remoteParticipants });
    expect(root.find(VideoTile).length).toBe(10);
  });

  test('should render 1 video tile if container height of ResponsiveVerticalGallery is 0', () => {
    mockResponsiveVerticalGalleryContainerHeight(0);
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false }
      })
    );

    const root = mountResponsiveVerticalGallery({ remoteParticipants });
    expect(root.find(VideoTile).length).toBe(1);
  });

  test('should render 4 video tiles if container height of ResponsiveVerticalGallery is 500 and prop isShort is true', () => {
    mockResponsiveVerticalGalleryContainerHeight(500);
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false }
      })
    );

    const root = mountResponsiveVerticalGallery({ remoteParticipants, isShort: true });
    expect(root.find(VideoTile).length).toBe(4);
  });

  test('should render 10 video tile if container height of ResponsiveVerticalGallery is 1000 and prop isShort is true', () => {
    mockResponsiveVerticalGalleryContainerHeight(1000);
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false }
      })
    );

    const root = mountResponsiveVerticalGallery({ remoteParticipants, isShort: true });
    expect(root.find(VideoTile).length).toBe(10);
  });

  test('should render 1 video tile if container height of ResponsiveVerticalGallery is 0 and prop isShort is true', () => {
    mockResponsiveVerticalGalleryContainerHeight(0);
    const remoteParticipants = Array.from({ length: 10 }, () =>
      createRemoteParticipant({
        videoStream: { isAvailable: false }
      })
    );

    const root = mountResponsiveVerticalGallery({ remoteParticipants, isShort: true });
    expect(root.find(VideoTile).length).toBe(1);
  });
});

const mountResponsiveVerticalGallery = (attrs: {
  remoteParticipants: VideoGalleryRemoteParticipant[];
  isShort?: boolean;
}): ReactWrapper<ResponsiveVerticalGalleryProps> => {
  const { remoteParticipants, isShort } = attrs;
  const tiles = remoteParticipants.map((p) => <VideoTile key={p.userId}></VideoTile>);
  return mount(
    <ResponsiveVerticalGallery
      containerStyles={verticalGalleryContainerStyle(true, false, !!isShort)}
      verticalGalleryStyles={{ children: LARGE_HORIZONTAL_GALLERY_TILE_STYLE }}
      gapHeightRem={HORIZONTAL_GALLERY_GAP}
      isShort
    >
      {tiles}
    </ResponsiveVerticalGallery>
  );
};

const createRemoteParticipant = (attrs?: Partial<VideoGalleryRemoteParticipant>): VideoGalleryRemoteParticipant => {
  return {
    userId: attrs?.userId ?? `remoteParticipant-${createGUID()}`
  };
};

const mockResponsiveVerticalGalleryContainerHeight = (containerHeight?: number): void => {
  // Need to mock this because the ResponsiveVerticalGallery uses this function. JSDOM does not actually do any
  // rendering so getComputedStyle(document.documentElement).fontSize will not actually have a value
  jest.spyOn(acs_ui_common, '_convertRemToPx').mockImplementation((rem: number) => {
    return rem * 16;
  });
  // Need to mock hook _useContainerWidth because the returned width is used by ResponsiveVerticalGallery to decide
  // how many tiles to show per page
  jest.spyOn(responsive, '_useContainerHeight').mockImplementation(() => containerHeight ?? 500);
};
