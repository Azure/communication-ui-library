// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react';

/**
 * Horizontal Gallery button width in rem
 */
export const HORIZONTAL_GALLERY_BUTTON_WIDTH = 1.75;

/**
 * @private
 */
export const leftRightButtonStyles: IStyle = {
  background: 'none',
  padding: 0,
  height: '100%',
  minWidth: `${HORIZONTAL_GALLERY_BUTTON_WIDTH}rem`,
  maxWidth: `${HORIZONTAL_GALLERY_BUTTON_WIDTH}rem`
};

/**
 * Horizontal Gallery gap size in rem between tiles and buttons
 */
export const HORIZONTAL_GALLERY_GAP = 0.5;

/**
 * @private
 */
export const horizontalGalleryContainerStyle: IStyle = {
  height: '100%',
  width: '100%',
  paddingBottom: '0.5rem',
  gap: `${HORIZONTAL_GALLERY_GAP}rem`
};
