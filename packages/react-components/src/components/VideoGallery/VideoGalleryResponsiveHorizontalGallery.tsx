// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets } from '@fluentui/react';
import React, { useMemo } from 'react';
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
 * A ResponsiveHorizontalGallery styled for the {@link VideoGallery}
 *
 * @private
 */
export const VideoGalleryResponsiveHorizontalGallery = (props: {
  shouldFloatLocalVideo?: boolean;
  isNarrow?: boolean;
  horizontalGalleryElements?: JSX.Element[];
  styles?: HorizontalGalleryStyles;
}): JSX.Element => {
  const { shouldFloatLocalVideo = false, isNarrow = false, horizontalGalleryElements, styles } = props;

  const containerStyles = useMemo(
    () => horizontalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow),
    [shouldFloatLocalVideo, isNarrow]
  );
  const galleryStyles = useMemo(() => concatStyleSets(horizontalGalleryStyle(isNarrow), styles), [isNarrow, styles]);

  return (
    <ResponsiveHorizontalGallery
      key="responsive-horizontal-gallery"
      containerStyles={containerStyles}
      horizontalGalleryStyles={galleryStyles}
      childWidthRem={
        isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width : LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width
      }
      buttonWidthRem={HORIZONTAL_GALLERY_BUTTON_WIDTH}
      gapWidthRem={HORIZONTAL_GALLERY_GAP}
    >
      {horizontalGalleryElements}
    </ResponsiveHorizontalGallery>
  );
};
