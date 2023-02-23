// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { LARGE_FLOATING_MODAL_SIZE_PX, SMALL_FLOATING_MODAL_SIZE_PX } from './FloatingLocalVideo.styles';

/**
 * VerticalGallery tile size in rem:
 *
 * min - smallest possible size of the tile (90px)
 * max - Largest size we want the vertical tiles (144px)
 *
 * @private
 */
export const LARGE_VERTICAL_GALLERY_TILE_SIZE_REM = { minHeight: 5.625, maxHeight: 9, width: 9 };

/**
 * Styles for the VerticalGallery's container set in parent.
 *
 * @param shouldFloatLocalVideo whether rendered in floating layout or not
 * @param isNarrow is being rendered with narrow tile settings.
 * @returns Style set for VerticalGallery container.
 */
export const verticalGalleryContainerStyle = (shouldFloatLocalVideo: boolean, isNarrow: boolean): IStyle => {
  return {
    width: `${LARGE_VERTICAL_GALLERY_TILE_SIZE_REM.width + 1}rem`,
    height: shouldFloatLocalVideo
      ? isNarrow
        ? `calc(100% - ${_pxToRem(SMALL_FLOATING_MODAL_SIZE_PX.height)})`
        : `calc(100% - ${_pxToRem(LARGE_FLOATING_MODAL_SIZE_PX.height)})`
      : '100%'
  };
};
