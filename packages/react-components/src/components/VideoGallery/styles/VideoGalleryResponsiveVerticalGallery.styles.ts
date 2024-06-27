// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStyle } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { VerticalGalleryStyles } from '../../VerticalGallery';
import {
  SHORT_VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM,
  SMALL_FLOATING_MODAL_SIZE_REM,
  VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM
} from './FloatingLocalVideo.styles';

/**
 * VerticalGallery tile size in rem:
 *
 * min - smallest possible size of the tile (90px)
 * max - Largest size we want the vertical tiles (144px)
 *
 * @private
 */
export const SHORT_VERTICAL_GALLERY_TILE_SIZE_REM = { minHeight: 5.625, maxHeight: 9, width: 9 };

/**
 * VerticalGallery tile size in rem:
 *
 * min - smallest possible size of the tile (90px)
 * max - Largest size we want the vertical tiles (144px)
 *
 * @private
 */
export const VERTICAL_GALLERY_TILE_SIZE_REM = { minHeight: 6.75, maxHeight: 11, width: 11 };

/**
 * Styles for the VerticalGallery's container set in parent.
 *
 * width is being increased by 1rem to account for the gap width desired for the VerticalGallery.
 *
 * @param shouldFloatLocalVideo whether rendered in floating layout or not
 * @returns Style set for VerticalGallery container.
 */
export const verticalGalleryContainerStyle = (
  shouldFloatLocalVideo: boolean,
  isNarrow: boolean,
  isShort: boolean
): IStyle => {
  return isNarrow && isShort
    ? {
        width: `${SHORT_VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`,
        height: shouldFloatLocalVideo ? `calc(100% - ${SMALL_FLOATING_MODAL_SIZE_REM.height}rem)` : '100%',
        paddingBottom: '0.5rem'
      }
    : !isNarrow && isShort
      ? {
          width: `${SHORT_VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`,
          height: shouldFloatLocalVideo
            ? `calc(100% - ${SHORT_VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM.height}rem)`
            : '100%',
          paddingBottom: '0.5rem'
        }
      : {
          width: `${VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`,
          height: shouldFloatLocalVideo ? `calc(100% - ${VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM.height}rem)` : '100%',
          paddingBottom: '0.5rem'
        };
};

/**
 * @private
 */
export const SHORT_VERTICAL_GALLERY_TILE_STYLE = {
  minHeight: `${SHORT_VERTICAL_GALLERY_TILE_SIZE_REM.minHeight}rem`,
  minWidth: `${SHORT_VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`,
  maxHeight: `${SHORT_VERTICAL_GALLERY_TILE_SIZE_REM.maxHeight}rem`,
  maxWidth: `${SHORT_VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`,
  width: '100%',
  height: '100%'
};

/**
 * @private
 */
export const VERTICAL_GALLERY_TILE_STYLE = {
  minHeight: `${VERTICAL_GALLERY_TILE_SIZE_REM.minHeight}rem`,
  minWidth: `${VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`,
  maxHeight: `${VERTICAL_GALLERY_TILE_SIZE_REM.maxHeight}rem`,
  maxWidth: `${VERTICAL_GALLERY_TILE_SIZE_REM.width}rem`,
  width: '100%',
  height: '100%'
};

/**
 * @private
 */
export const verticalGalleryStyle = (isShort: boolean): VerticalGalleryStyles => {
  return isShort ? { children: SHORT_VERTICAL_GALLERY_TILE_STYLE } : { children: VERTICAL_GALLERY_TILE_STYLE };
};
