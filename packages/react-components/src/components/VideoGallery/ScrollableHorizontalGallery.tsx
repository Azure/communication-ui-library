// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React from 'react';
import { scrollableHorizontalGalleryStyles } from './styles/ScrollableHorizontalGallery.style';

/**
 * PinnedParticipantsLayout displays remote participants and a screen sharing component in
 * a grid and horizontal gallery while floating the local video
 *
 * @private
 */
export const ScrollableHorizontalGallery = (props: { horizontalGalleryElements?: JSX.Element[] }): JSX.Element => {
  const { horizontalGalleryElements } = props;

  return (
    <Stack
      data-ui-id="scrollable-horizontal-gallery"
      horizontal={true}
      styles={scrollableHorizontalGalleryStyles}
      tokens={{ childrenGap: '0.5rem' }}
    >
      {horizontalGalleryElements}
    </Stack>
  );
};
