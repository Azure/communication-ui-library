// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
import { OverflowGalleryPosition } from '../VideoGallery';
/* @conditional-compile-remove(gallery-layouts) */
import { VideoGalleryLayout } from '../VideoGallery';
import { ScrollableHorizontalGallery } from './ScrollableHorizontalGallery';
import {
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  horizontalGalleryContainerStyle,
  horizontalGalleryStyle
} from './styles/VideoGalleryResponsiveHorizontalGallery.styles';
/* @conditional-compile-remove(vertical-gallery) */
import { _convertPxToRem } from '@internal/acs-ui-common';
import { SMALL_FLOATING_MODAL_SIZE_REM } from './styles/FloatingLocalVideo.styles';
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
  verticalGalleryStyles?: VerticalGalleryStyles;
  /* @conditional-compile-remove(vertical-gallery) */
  overflowGalleryPosition?: OverflowGalleryPosition;
  onChildrenPerPageChange?: (childrenPerPage: number) => void;
  /* @conditional-compile-remove(gallery-layouts) */
  layout?: VideoGalleryLayout;
  parentWidth?: number;
}): JSX.Element => {
  const {
    shouldFloatLocalVideo = false,
    onFetchTilesToRender,
    isNarrow = false,
    /* @conditional-compile-remove(vertical-gallery) */
    isShort = false,
    overflowGalleryElements,
    horizontalGalleryStyles,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition = 'horizontalBottom',
    /* @conditional-compile-remove(vertical-gallery) */ verticalGalleryStyles,
    onChildrenPerPageChange,
    parentWidth
  } = props;

  const containerStyles = useMemo(() => {
    /* @conditional-compile-remove(vertical-gallery) */
    if (overflowGalleryPosition === 'verticalRight') {
      return verticalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow, isShort);
    }
    return horizontalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow);
  }, [
    shouldFloatLocalVideo,
    /* @conditional-compile-remove(vertical-gallery) */ isShort,
    isNarrow,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition
  ]);

  const galleryStyles = useMemo(() => {
    /* @conditional-compile-remove(vertical-gallery) */
    if (overflowGalleryPosition === 'verticalRight') {
      return concatStyleSets(verticalGalleryStyle(isShort), verticalGalleryStyles);
    }
    return concatStyleSets(horizontalGalleryStyle(isNarrow), horizontalGalleryStyles);
  }, [
    isNarrow,
    /* @conditional-compile-remove(vertical-gallery) */ isShort,
    horizontalGalleryStyles,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition,
    /* @conditional-compile-remove(vertical-gallery) */ verticalGalleryStyles
  ]);

  const scrollableHorizontalGalleryContainerStyles = useMemo(() => {
    if (isNarrow && parentWidth) {
      return {
        width:
          props.layout === 'default'
            ? `${_convertPxToRem(parentWidth)}rem`
            : `${_convertPxToRem(parentWidth) - SMALL_FLOATING_MODAL_SIZE_REM.width - 1}rem`
      };
    }
    return undefined;
  }, [isNarrow, parentWidth, props.layout]);

  /* @conditional-compile-remove(vertical-gallery) */
  if (overflowGalleryPosition === 'verticalRight') {
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
        {overflowGalleryElements ? overflowGalleryElements : [<></>]}
      </ResponsiveVerticalGallery>
    );
  }

  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM;

  /* @conditional-compile-remove(pinned-participants) */
  if (isNarrow) {
    // There are no pages for ScrollableHorizontalGallery so we will approximate the first 3 remote
    // participant tiles are visible
    onChildrenPerPageChange?.(3);

    return (
      <ScrollableHorizontalGallery
        horizontalGalleryElements={overflowGalleryElements ? overflowGalleryElements : [<></>]}
        onFetchTilesToRender={onFetchTilesToRender}
        key="scrollable-horizontal-gallery"
        containerStyles={scrollableHorizontalGalleryContainerStyles}
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
      {overflowGalleryElements ? overflowGalleryElements : [<></>]}
    </ResponsiveHorizontalGallery>
  );
};
