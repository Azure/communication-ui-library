// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React from 'react';
import { VideoGalleryRemoteParticipant } from '../../types';
import { GridLayout } from '../GridLayout';
import { isNarrowWidth } from '../utils/responsive';
import { VideoGalleryStyles } from '../VideoGallery';
import { rootLayoutStyle } from './styles/DefaultLayout.styles';
import { VideoGalleryResponsiveHorizontalGallery } from './VideoGalleryResponsiveHorizontalGallery';
import { useFloatingLocalVideoLayout } from './utils/videoGalleryLayoutUtils';

/**
 * Props for {@link DefaultLayout}.
 *
 * @private
 */
export interface DefaultLayoutProps {
  /**
   * Styles for the {@link DefaultLayout}
   */
  styles?: Omit<VideoGalleryStyles, 'root'>;
  /** List of remote video particpants */
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  /** Callback to render each remote participant */
  onRenderRemoteParticipant: (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => JSX.Element;
  /** List of dominant speaker userIds in the order of their dominance. 0th index is the most dominant. */
  dominantSpeakers?: string[];
  /** Component that contains local video content */
  localVideoComponent?: JSX.Element;
  /** Component that contains screen share content */
  screenShareComponent?: JSX.Element;
  /**
   * Maximum number of participant remote video streams that is rendered.
   * @defaultValue 4
   */
  maxRemoteVideoStreams?: number;
  /**
   * Width of parent element
   */
  parentWidth?: number;
}

/**
 * DefaultLayout displays remote participants, local video component, and screen sharing component in
 * a grid and horizontal gallery.
 *
 * @private
 */
export const DefaultLayout = (props: DefaultLayoutProps): JSX.Element => {
  const {
    remoteParticipants = [],
    dominantSpeakers,
    localVideoComponent,
    screenShareComponent,
    onRenderRemoteParticipant,
    styles,
    maxRemoteVideoStreams,
    parentWidth
  } = props;

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;

  const floatingLocalVideoLayout = useFloatingLocalVideoLayout({
    remoteParticipants,
    dominantSpeakers,
    maxRemoteVideoStreams,
    isScreenShareActive: !!screenShareComponent
  });

  let activeVideoStreams = 0;

  const gridTiles = floatingLocalVideoLayout.gridParticipants.map((p) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
        ? p.videoStream?.isAvailable && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  const horizontalGalleryTiles = floatingLocalVideoLayout.horizontalGalleryParticipants.map((p) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
        ? p.videoStream?.isAvailable && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  if (localVideoComponent) {
    gridTiles.push(localVideoComponent);
  }

  return (
    <Stack horizontal={false} styles={rootLayoutStyle}>
      {screenShareComponent ? (
        screenShareComponent
      ) : (
        <GridLayout key="grid-layout" styles={styles?.gridLayout}>
          {gridTiles}
        </GridLayout>
      )}
      {horizontalGalleryTiles.length > 0 && (
        <VideoGalleryResponsiveHorizontalGallery
          isNarrow={isNarrow}
          horizontalGalleryElements={horizontalGalleryTiles}
          styles={styles?.horizontalGallery}
        />
      )}
    </Stack>
  );
};
