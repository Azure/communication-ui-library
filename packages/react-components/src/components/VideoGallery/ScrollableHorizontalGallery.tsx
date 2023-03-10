// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React, { useRef } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import { VideoGalleryRemoteParticipant } from '../../types';
import {
  scrollableHorizontalGalleryContainerStyles,
  scrollableHorizontalGalleryStyles
} from './styles/ScrollableHorizontalGallery.style';

/**
 * Component to display elements horizontally in a scrollable container
 * @private
 */
export const ScrollableHorizontalGallery = (props: {
  galleryparticipants: VideoGalleryRemoteParticipant[];
  onRenderRemoteParticipant: (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => JSX.Element;
  maxRemoteVideoStreams?: number;
}): JSX.Element => {
  const { galleryparticipants, onRenderRemoteParticipant, maxRemoteVideoStreams } = props;

  const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events: dragabbleEvents } = useDraggable(ref);
  let activeVideoStreams = 0;

  const overflowGalleryTiles =
    galleryparticipants &&
    galleryparticipants.map((p) => {
      return onRenderRemoteParticipant(
        p,
        maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
          ? p.videoStream?.isAvailable && activeVideoStreams++ < maxRemoteVideoStreams
          : p.videoStream?.isAvailable
      );
    });

  return (
    <div ref={ref} {...dragabbleEvents} className={scrollableHorizontalGalleryContainerStyles}>
      <Stack
        data-ui-id="scrollable-horizontal-gallery"
        horizontal={true}
        styles={scrollableHorizontalGalleryStyles}
        tokens={{ childrenGap: '0.5rem' }}
      >
        {overflowGalleryTiles}
      </Stack>
    </div>
  );
};
