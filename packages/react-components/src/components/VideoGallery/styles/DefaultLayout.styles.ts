// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, IStyle, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { HorizontalGalleryStyles } from '../../HorizontalGallery';

/**
 * @private
 */
export const videoGalleryOuterDivStyle = mergeStyles({ position: 'relative', width: '100%', height: '100%' });

/**
 * @private
 */
export const videoGalleryContainerStyle: IStackStyles = {
  root: { position: 'relative', height: '100%', width: '100%', padding: '0.5rem' }
};

/**
 * Small floating modal width and height in rem for small screen
 */
export const SMALL_FLOATING_MODAL_SIZE_PX = { width: 64, height: 88 };

/**
 * Large floating modal width and height in rem for large screen
 */
export const LARGE_FLOATING_MODAL_SIZE_PX = { width: 160, height: 120 };

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
        ? `calc(100% - ${_pxToRem(SMALL_FLOATING_MODAL_SIZE_PX.width)})`
        : `calc(100% - ${_pxToRem(LARGE_FLOATING_MODAL_SIZE_PX.width)})`
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
export const SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM = { height: 5.5, width: 5.5 };
/**
 * Large horizontal gallery tile size in rem
 * @private
 */
export const LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM = { height: 7.5, width: 10 };

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
