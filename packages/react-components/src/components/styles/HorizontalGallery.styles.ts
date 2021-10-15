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
  height: '100%',
  minWidth: '1.75rem',
  maxWidth: '1.75rem'
};

/**
 * @private
 */
export const horizontalGalleryContainerStyle: IStyle = {
  height: '100%',
  width: '100%',
  paddingBottom: '0.5rem',
  display: 'flex',
  flexFlow: 'row',
  gap: '0.5rem'
};

/**
 * Gap between tiles in rem
 * @private
 */
export const TILE_GAP = 0.5;

/**
 * Small tile size in rem
 * @private
 */
export const SMALL_TILE_SIZE = { height: 5.5, width: 5.5 };
/**
 * Large tile size in rem
 * @private
 */
export const LARGE_TILE_SIZE = { height: 7.5, width: 10 };

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
export const LARGE_TILE_STYLE = {
  minHeight: `${LARGE_TILE_SIZE.height}rem`,
  minWidth: `${LARGE_TILE_SIZE.width}rem`,
  maxHeight: `${LARGE_TILE_SIZE.height}rem`,
  maxWidth: `${LARGE_TILE_SIZE.width}rem`
};

/**
 * @private
 */
export const SMALL_BUTTON_SIZE = { height: 5.5, width: 1.75 }; // Small button size in rem
/**
 * @private
 */
export const LARGE_BUTTON_SIZE = { height: 7.5, width: 1.75 }; // Large button size in rem
/**
 * @private
 */
export const SMALL_BUTTON_STYLE = {
  minHeight: `${SMALL_BUTTON_SIZE.height}rem`,
  maxHeight: `${SMALL_BUTTON_SIZE.height}rem`,
  minWidth: `${SMALL_BUTTON_SIZE.width}rem`,
  maxWidth: `${SMALL_BUTTON_SIZE.width}rem`
};
/**
 * @private
 */
export const LARGE_BUTTON_STYLE = {
  minHeight: `${LARGE_BUTTON_SIZE.height}rem`,
  maxHeight: `${LARGE_BUTTON_SIZE.height}rem`,
  minWidth: `${LARGE_BUTTON_SIZE.width}rem`,
  maxWidth: `${LARGE_BUTTON_SIZE.width}rem`
};
