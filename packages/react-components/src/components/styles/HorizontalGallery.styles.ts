// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, IStyle } from '@fluentui/react';

const theme = getTheme();

/**
 * @private
 */
export const leftRightButtonStyles: IStyle = {
  background: 'none',
  border: `1px solid ${theme.palette.neutralLight}`,
  padding: 0,
  borderRadius: theme.effects.roundedCorner4,
  minWidth: '1.75rem',
  maxWidth: '1.75rem'
};

/**
 * @private
 */
export const horizontalGalleryContainerStyle: IStyle = {
  height: '100%',
  width: '100%',
  paddingBottom: '0.5rem'
};

/**
 * @private
 */
export const SMALL_TILE_SIZE = { height: 5.5, width: 5.5 }; // Small tile size in rem
/**
 * @private
 */
export const LARGE_TILE_SIZE = { height: 7.5, width: 10 }; // Large tile size in rem

/**
 * @private
 */
export const SMALL_TILE_STYLE = {
  minHeight: `${SMALL_TILE_SIZE.height}rem`,
  minWidth: `${SMALL_TILE_SIZE.width}rem`,
  maxHeight: `${SMALL_TILE_SIZE.height}rem`,
  maxWidth: `${SMALL_TILE_SIZE.width}rem`
};
/**
 * @private
 */
export const SMALL_BUTTON_STYLE = {
  minHeight: `${SMALL_TILE_SIZE.height}rem`,
  maxHeight: `${SMALL_TILE_SIZE.height}rem`
};
/**
 * @private
 */
export const LARGE_TILE_STYLE = {
  minHeight: `${LARGE_TILE_SIZE.height}rem`,
  minWidth: `${LARGE_TILE_SIZE.width}rem`,
  maxHeight: `${LARGE_TILE_SIZE.height}rem`,
  maxWidth: `${LARGE_TILE_SIZE.width}rem`
};
/**
 * @private
 */
export const LARGE_BUTTON_STYLE = {
  minHeight: `${LARGE_TILE_SIZE.height}rem`,
  maxHeight: `${LARGE_TILE_SIZE.height}rem`
};
