// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { HorizontalGalleryStyles } from '../../HorizontalGallery';
import { LARGE_FLOATING_MODAL_SIZE_PX, SMALL_FLOATING_MODAL_SIZE_PX } from './FloatingLocalVideo.styles';

/**
 * @private
 */
export const horizontalGalleryContainerStyle = (shouldFloatLocalVideo: boolean, isNarrow: boolean): IStyle => {
  return {
    width: isNarrow
      ? `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`
      : `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`,
    height: shouldFloatLocalVideo
      ? isNarrow
        ? `calc(100% - ${_pxToRem(SMALL_FLOATING_MODAL_SIZE_PX.height)})`
        : `calc(100% - ${_pxToRem(LARGE_FLOATING_MODAL_SIZE_PX.height)})`
      : '100%',
    paddingRight: '0.5rem'
  };
};

/**
 * @private
 */
export const horizontalGalleryStyle = (isNarrow: boolean): HorizontalGalleryStyles => {
  return {
    children: isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_STYLE : LARGE_VERTICAL_GALLERY_TILE_STYLE
  };
};

/**
 * Small horizontal gallery tile size in rem
 * @private
 */
export const SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM = { height: 5.5, width: 5.5 };
/**
 * Large horizontal gallery tile size in rem
 * @private
 */
export const LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM = { height: 7.5, width: 10 };

/**
 * VerticalGallery tile size in rem
 * @private
 */
export const LARGE_VERTICAL_GALLERY_TILE_SIZE_REM = { height: 7.5, width: 13.4375 };

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
  minWidth: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width}rem`,
  maxHeight: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
  maxWidth: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width}rem`
};

export const LARGE_VERTICAL_GALLERY_TILE_STYLE = {
  minHeight: `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.height}rem`,
  minWidth: `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`,
  maxHeight: `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.height}rem`,
  maxWidth: `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`
};
