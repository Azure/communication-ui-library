// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets } from '@fluentui/react';
import React, { useMemo } from 'react';
import { HorizontalGalleryStyles } from '../HorizontalGallery';
import { ResponsiveHorizontalGallery } from '../ResponsiveHorizontalGallery';
/* @conditional-compile-remove(vertical-gallery) */
import { ResponsiveVerticalGallery } from '../ResponsiveVerticalGallery';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from '../styles/HorizontalGallery.styles';
/* @conditional-compile-remove(vertical-gallery) */
import { VerticalGalleryStyles } from '../VerticalGallery';
/* @conditional-compile-remove(vertical-gallery) */
import { OverflowGalleryLayout } from '../VideoGallery';
/* @conditional-compile-remove(pinned-participants) */
import { ScrollableHorizontalGallery } from './ScrollableHorizontalGallery';
import {
  horizontalGalleryContainerStyle,
  horizontalGalleryStyle,
  LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM
} from './styles/VideoGalleryResponsiveHorizontalGallery.styles';
/* @conditional-compile-remove(vertical-gallery) */
import {
  verticalGalleryContainerStyle,
  verticalGalleryStyle
} from './styles/VideoGalleryResponsiveVerticalGallery.styles';

/**
 * A ResponsiveHorizontalGallery styled for the {@link VideoGallery}
 *
 * @private
 */
export const OverflowGallery = (props: {
  shouldFloatLocalVideo?: boolean;
  setTilesToRender?: (indexes: number[]) => void;
  isNarrow?: boolean;
  /* @conditional-compile-remove(vertical-gallery) */
  isShort?: boolean;
  overflowGalleryElements?: JSX.Element[];
  horizontalGalleryStyles?: HorizontalGalleryStyles;
  /* @conditional-compile-remove(vertical-gallery) */
  veritcalGalleryStyles?: VerticalGalleryStyles;
  /* @conditional-compile-remove(vertical-gallery) */
  overflowGalleryLayout?: OverflowGalleryLayout;
}): JSX.Element => {
  const {
    shouldFloatLocalVideo = false,
    setTilesToRender,
    isNarrow = false,
    /* @conditional-compile-remove(vertical-gallery) */
    isShort = false,
    overflowGalleryElements,
    horizontalGalleryStyles,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryLayout = 'HorizontalBottom',
    /* @conditional-compile-remove(vertical-gallery) */ veritcalGalleryStyles
  } = props;

  const containerStyles = useMemo(() => {
    /* @conditional-compile-remove(vertical-gallery) */
    if (overflowGalleryLayout === 'VerticalRight') {
      return verticalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow, isShort);
    }
    return horizontalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow);
  }, [
    shouldFloatLocalVideo,
    /* @conditional-compile-remove(vertical-gallery) */ isShort,
    isNarrow,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryLayout
  ]);

  const galleryStyles = useMemo(() => {
    /* @conditional-compile-remove(vertical-gallery) */
    if (overflowGalleryLayout === 'VerticalRight') {
      return concatStyleSets(verticalGalleryStyle(isShort), veritcalGalleryStyles);
    }
    return concatStyleSets(horizontalGalleryStyle(isNarrow), horizontalGalleryStyles);
  }, [
    isNarrow,
    /* @conditional-compile-remove(vertical-gallery) */ isShort,
    horizontalGalleryStyles,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryLayout,
    /* @conditional-compile-remove(vertical-gallery) */ veritcalGalleryStyles
  ]);

  /* @conditional-compile-remove(vertical-gallery) */
  if (overflowGalleryLayout === 'VerticalRight') {
    return (
      <ResponsiveVerticalGallery
        key="responsive-vertical-gallery"
        containerStyles={containerStyles}
        verticalGalleryStyles={galleryStyles as VerticalGalleryStyles}
        controlBarHeightRem={HORIZONTAL_GALLERY_BUTTON_WIDTH}
        gapHeightRem={HORIZONTAL_GALLERY_GAP}
        isShort={isShort}
        setTilesToRender={setTilesToRender}
      >
        {overflowGalleryElements}
      </ResponsiveVerticalGallery>
    );
  }

  /* @conditional-compile-remove(pinned-participants) */
  if (isNarrow) {
    return <ScrollableHorizontalGallery horizontalGalleryElements={overflowGalleryElements} />;
  }

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
      {overflowGalleryElements}
    </ResponsiveHorizontalGallery>
  );
};
