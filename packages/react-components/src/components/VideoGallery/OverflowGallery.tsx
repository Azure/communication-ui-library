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
  horizontalGalleryStyle
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
  onFetchTilesToRender?: (indexes: number[]) => void;
  isNarrow?: boolean;
  /* @conditional-compile-remove(vertical-gallery) */
  isShort?: boolean;
  overflowGalleryElements?: JSX.Element[];
  horizontalGalleryStyles?: HorizontalGalleryStyles;
  /* @conditional-compile-remove(vertical-gallery) */
  veritcalGalleryStyles?: VerticalGalleryStyles;
  /* @conditional-compile-remove(vertical-gallery) */
  overflowGalleryLayout?: OverflowGalleryLayout;
  onChildrenPerPageChange?: (childrenPerPage: number) => void;
}): JSX.Element => {
  const {
    shouldFloatLocalVideo = false,
    onFetchTilesToRender,
    isNarrow = false,
    /* @conditional-compile-remove(vertical-gallery) */
    isShort = false,
    overflowGalleryElements,
    horizontalGalleryStyles,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryLayout = 'HorizontalBottom',
    /* @conditional-compile-remove(vertical-gallery) */ veritcalGalleryStyles,
    onChildrenPerPageChange
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
        onFetchTilesToRender={onFetchTilesToRender}
        onChildrenPerPageChange={onChildrenPerPageChange}
      >
        {overflowGalleryElements}
      </ResponsiveVerticalGallery>
    );
  }

  /* @conditional-compile-remove(pinned-participants) */
  if (isNarrow) {
    // There are no pages for ScrollableHorizontalGallery so we will approximate the first 3 remote
    // participant tiles are visible
    onChildrenPerPageChange?.(3);
    return (
      <ScrollableHorizontalGallery
        horizontalGalleryElements={overflowGalleryElements}
        onFetchTilesToRender={onFetchTilesToRender}
        key="scrollable-horizontal-gallery"
      />
    );
  }

  return (
    <ResponsiveHorizontalGallery
      key="responsive-horizontal-gallery"
      containerStyles={containerStyles}
      onFetchTilesToRender={onFetchTilesToRender}
      horizontalGalleryStyles={galleryStyles}
      buttonWidthRem={HORIZONTAL_GALLERY_BUTTON_WIDTH}
      gapWidthRem={HORIZONTAL_GALLERY_GAP}
      onChildrenPerPageChange={onChildrenPerPageChange}
    >
      {overflowGalleryElements}
    </ResponsiveHorizontalGallery>
  );
};
