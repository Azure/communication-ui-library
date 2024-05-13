// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets } from '@fluentui/react';
import React, { useMemo } from 'react';
import { HorizontalGalleryStyles } from '../HorizontalGallery';
import { ResponsiveHorizontalGallery } from '../ResponsiveHorizontalGallery';
import { ResponsiveVerticalGallery } from '../ResponsiveVerticalGallery';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from '../styles/HorizontalGallery.styles';
import { VerticalGalleryStyles } from '../VerticalGallery';
import { OverflowGalleryPosition } from '../VideoGallery';
import { ScrollableHorizontalGallery } from './ScrollableHorizontalGallery';
import {
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  horizontalGalleryContainerStyle,
  horizontalGalleryStyle
} from './styles/VideoGalleryResponsiveHorizontalGallery.styles';
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
  isShort?: boolean;
  overflowGalleryElements?: JSX.Element[];
  horizontalGalleryStyles?: HorizontalGalleryStyles;
  verticalGalleryStyles?: VerticalGalleryStyles;
  overflowGalleryPosition?: OverflowGalleryPosition;
  onChildrenPerPageChange?: (childrenPerPage: number) => void;
  parentWidth?: number;
}): JSX.Element => {
  const {
    shouldFloatLocalVideo = false,
    onFetchTilesToRender,
    isNarrow = false,
    isShort = false,
    overflowGalleryElements,
    horizontalGalleryStyles,
    overflowGalleryPosition = 'horizontalBottom',
    verticalGalleryStyles,
    onChildrenPerPageChange,
    parentWidth
  } = props;

  const containerStyles = useMemo(() => {
    if (overflowGalleryPosition === 'verticalRight') {
      return verticalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow, isShort);
    }
    return horizontalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow);
  }, [shouldFloatLocalVideo, isShort, isNarrow, overflowGalleryPosition]);

  const galleryStyles = useMemo(() => {
    if (overflowGalleryPosition === 'verticalRight') {
      return concatStyleSets(verticalGalleryStyle(isShort), verticalGalleryStyles);
    }
    return concatStyleSets(horizontalGalleryStyle(isNarrow), horizontalGalleryStyles);
  }, [isNarrow, isShort, horizontalGalleryStyles, overflowGalleryPosition, verticalGalleryStyles]);

  const scrollableHorizontalGalleryContainerStyles = useMemo(() => {
    if (isNarrow && parentWidth) {
      return {
        width: shouldFloatLocalVideo
          ? `${_convertPxToRem(parentWidth) - SMALL_FLOATING_MODAL_SIZE_REM.width - 1}rem`
          : `${_convertPxToRem(parentWidth) - 1}rem`
      };
    }
    return undefined;
  }, [isNarrow, parentWidth, shouldFloatLocalVideo]);

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
