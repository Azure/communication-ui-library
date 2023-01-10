// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles } from '@fluentui/react';
import {
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  SMALL_HORIZONTAL_GALLERY_TILE_STYLE
} from './VideoGalleryResponsiveHorizontalGallery.styles';

/**
 * @private
 */
export const scrollableHorizontalGalleryStyles: IStackStyles = {
  root: {
    width: '100%',
    minHeight: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
    paddingRight: '0.5rem',
    '> *': SMALL_HORIZONTAL_GALLERY_TILE_STYLE
  }
};
