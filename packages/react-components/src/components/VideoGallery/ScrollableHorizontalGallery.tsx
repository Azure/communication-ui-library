// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React, { useRef } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import {
  scrollableHorizontalGalleryContainerStyles,
  scrollableHorizontalGalleryStyles
} from './styles/ScrollableHorizontalGallery.style';

/**
 * PinnedParticipantsLayout displays remote participants and a screen sharing component in
 * a grid and horizontal gallery while floating the local video
 *
 * @private
 */
export const ScrollableHorizontalGallery = (props: { horizontalGalleryElements?: JSX.Element[] }): JSX.Element => {
  const { horizontalGalleryElements } = props;

  const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events: dragabbleEvents } = useDraggable(ref);

  return (
    <div ref={ref} {...dragabbleEvents} className={scrollableHorizontalGalleryContainerStyles}>
      <Stack
        data-ui-id="scrollable-horizontal-gallery"
        horizontal={true}
        styles={scrollableHorizontalGalleryStyles}
        tokens={{ childrenGap: '0.5rem' }}
      >
        {horizontalGalleryElements}
      </Stack>
    </div>
  );
};
