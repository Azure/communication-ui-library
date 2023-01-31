// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets } from '@fluentui/react';
import React, { useMemo } from 'react';
import { HorizontalGalleryStyles } from '../HorizontalGallery';
import { ResponsiveVerticalGallery } from '../ResponsiveVerticalGallery';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from '../styles/HorizontalGallery.styles';
import {
  verticalGalleryContainerStyle,
  verticalGalleryStyle
} from './styles/VideoGalleryResponsiveHorizontalGallery.styles';

/**
 * A ResponsiveHorizontalGallery styled for the {@link VideoGallery}
 *
 * @private
 */
export const VideoGalleryResponsiveVerticalGallery = (props: {
  shouldFloatLocalVideo?: boolean;
  isNarrow?: boolean;
  horizontalGalleryElements?: JSX.Element[];
  styles?: HorizontalGalleryStyles;
}): JSX.Element => {
  const { shouldFloatLocalVideo = false, isNarrow = false, horizontalGalleryElements, styles } = props;

  const containerStyles = useMemo(
    () => verticalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow),
    [shouldFloatLocalVideo, isNarrow]
  );
  const galleryStyles = useMemo(() => concatStyleSets(verticalGalleryStyle(isNarrow), styles), [isNarrow, styles]);

  return (
    <>
      <ResponsiveVerticalGallery
        key="responsive-horizontal-gallery"
        containerStyles={containerStyles}
        verticalGalleryStyles={galleryStyles}
        buttonWidthRem={HORIZONTAL_GALLERY_BUTTON_WIDTH}
        gapWidthRem={HORIZONTAL_GALLERY_GAP}
      >
        {horizontalGalleryElements}
      </ResponsiveVerticalGallery>
    </>
  );
};
