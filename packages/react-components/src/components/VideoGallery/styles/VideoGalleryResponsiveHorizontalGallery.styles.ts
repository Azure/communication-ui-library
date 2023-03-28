// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react';
import { HorizontalGalleryStyles } from '../../HorizontalGallery';
import { LARGE_FLOATING_MODAL_SIZE_REM, SMALL_FLOATING_MODAL_SIZE_REM } from './FloatingLocalVideo.styles';

/**
 * @private
 */
export const horizontalGalleryContainerStyle = (shouldFloatLocalVideo: boolean, isNarrow: boolean): IStyle => {
  return {
    minHeight: isNarrow
      ? `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`
      : `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
    width: shouldFloatLocalVideo
      ? isNarrow
        ? `calc(100% - ${SMALL_FLOATING_MODAL_SIZE_REM.width}rem)`
        : `calc(100% - ${LARGE_FLOATING_MODAL_SIZE_REM.width}rem)`
      : '100%',
    paddingRight: '0.5rem'
  };
};

/**
 * @private
 */
export const horizontalGalleryStyle = (isNarrow: boolean): HorizontalGalleryStyles => {
  return {
    children: isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_STYLE : LARGE_HORIZONTAL_GALLERY_TILE_STYLE
  };
};

/**
 * Small horizontal gallery tile size in rem
 * @private
 */
export const SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM = { height: 6.5, width: 6.5 };

/**
 * Large horizontal gallery tile size in rem
 * @private
 */
export const LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM = { height: 7.5, minWidth: 7.5, maxWidth: 13.43 };

/**
 * @private
 */
export const SMALL_HORIZONTAL_GALLERY_TILE_STYLE = {
  minHeight: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
  minWidth: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width}rem`,
  maxHeight: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
  maxWidth: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width}rem`
};
/**
 * @private
 */
export const LARGE_HORIZONTAL_GALLERY_TILE_STYLE = {
  minHeight: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
  minWidth: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.minWidth}rem`,
  maxHeight: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
  maxWidth: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.maxWidth}rem`,
  width: '100%',
  height: '100%'
};
