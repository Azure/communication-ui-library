// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { HorizontalGalleryStyles } from '../../HorizontalGallery';
import { LARGE_FLOATING_MODAL_SIZE_PX, SMALL_FLOATING_MODAL_SIZE_PX } from './FloatingLocalVideo.styles';

/**
 * @private
 */
export const verticalGalleryContainerStyle = (shouldFloatLocalVideo: boolean, isNarrow: boolean): IStyle => {
  return {
    width: isNarrow
      ? `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.width + 1}rem`
      : `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.width + 1}rem`,
    height: shouldFloatLocalVideo
      ? isNarrow
        ? `calc(100% - ${_pxToRem(SMALL_FLOATING_MODAL_SIZE_PX.height)})`
        : `calc(100% - ${_pxToRem(LARGE_FLOATING_MODAL_SIZE_PX.height)})`
      : '100%'
  };
};

export const horizontalGalleryContainerStyle = (shouldFloatLocalVideo: boolean, isNarrow: boolean): IStyle => {
  return {
    minHeight: isNarrow
      ? `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`
      : `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
    width: shouldFloatLocalVideo
      ? isNarrow
        ? `calc(100% - ${_pxToRem(SMALL_FLOATING_MODAL_SIZE_PX.width)})`
        : `calc(100% - ${_pxToRem(LARGE_FLOATING_MODAL_SIZE_PX.width)})`
      : '100%',
    paddingRight: '0.5rem'
  };
};

/**
 * @private
 */
export const verticalGalleryStyle = (isNarrow: boolean): HorizontalGalleryStyles => {
  return {
    children: isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_STYLE : LARGE_VERTICAL_GALLERY_TILE_STYLE
  };
};

export const horizontalGalleryStyle = (isNarrow: boolean): HorizontalGalleryStyles => {
  return {
    children: isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_STYLE : LARGE_HORIZONTAL_GALLERY_TILE_STYLE
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
export const LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM = { height: 5.625, width: 9 };

/**
 * VerticalGallery tile size in rem
 * @private
 */
export const LARGE_VERTICAL_GALLERY_TILE_SIZE_REM = { minHeight: 5.625, maxHeight: 9, width: 9 };

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

/**
 * Styles to maintain the tiles even size within the bounds:
 * minHeight: 90px
 * maxHeight: 144px
 * @private
 */
export const LARGE_VERTICAL_GALLERY_TILE_STYLE = {
  minHeight: `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.minHeight}rem`,
  minWidth: `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`,
  maxHeight: `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.maxHeight}rem`,
  maxWidth: `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`,
  width: '100%',
  height: '100%'
};
