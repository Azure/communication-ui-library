// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, Stack } from '@fluentui/react';
import React from 'react';
import { HorizontalGalleryStyles } from '../HorizontalGallery';
import { ResponsiveHorizontalGallery } from '../ResponsiveHorizontalGallery';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from '../styles/HorizontalGallery.styles';
import {
  horizontalGalleryContainerStyle,
  horizontalGalleryStyle,
  LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM
} from './styles/VideoGalleryResponsiveHorizontalGallery.styles';

/**
 * A ResponsiveHorizontalGallery styled for the @link{VideoGallery}
 */
export const VideoGalleryResponsiveHorizontalGallery = (props: {
  shouldFloatLocalVideo?: boolean;
  isNarrow?: boolean;
  horizontalGalleryElements?: JSX.Element[];
  styles?: HorizontalGalleryStyles;
}): JSX.Element => {
  const { shouldFloatLocalVideo = false, isNarrow = false, horizontalGalleryElements, styles } = props;
  return (
    <Stack styles={{ root: { paddingTop: '0.5rem' } }}>
      <ResponsiveHorizontalGallery
        key="responsive-horizontal-gallery"
        containerStyles={horizontalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow)}
        horizontalGalleryStyles={concatStyleSets(horizontalGalleryStyle(isNarrow), styles)}
        childWidthRem={
          isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width : LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width
        }
        buttonWidthRem={HORIZONTAL_GALLERY_BUTTON_WIDTH}
        gapWidthRem={HORIZONTAL_GALLERY_GAP}
      >
        {horizontalGalleryElements}
      </ResponsiveHorizontalGallery>
    </Stack>
  );
};
