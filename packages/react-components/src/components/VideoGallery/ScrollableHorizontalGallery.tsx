// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import React, { useRef } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import { scrollableHorizontalGalleryStyles } from './styles/ScrollableHorizontalGallery.style';
import { SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM } from './styles/VideoGalleryResponsiveHorizontalGallery.styles';

/**
 * PinnedParticipantsLayout displays remote participants and a screen sharing component in
 * a grid and horizontal gallery while floating the local video
 *
 * @private
 */
export const ScrollableHorizontalGallery = (props: { horizontalGalleryElements?: JSX.Element[] }): JSX.Element => {
  const { horizontalGalleryElements } = props;

  const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref); // Now we pass the reference to the useDraggable hook:

  return (
    <div
      ref={ref}
      {...events}
      className={mergeStyles({
        display: 'flex',
        width: '100%',
        minHeight: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
        overflow: 'scroll',
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
        '::-webkit-scrollbar': { display: 'none' }
      })}
    >
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
