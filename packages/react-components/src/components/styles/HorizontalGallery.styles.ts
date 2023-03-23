// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, Theme } from '@fluentui/react';

/**
 * Horizontal Gallery button width in rem
 */
export const HORIZONTAL_GALLERY_BUTTON_WIDTH = 1.75;

/**
 * @private
 */
export const leftRightButtonStyles = (theme: Theme): IStyle => {
  return {
    background: 'none',
    padding: 0,
    height: 'auto',
    minWidth: `${HORIZONTAL_GALLERY_BUTTON_WIDTH}rem`,
    maxWidth: `${HORIZONTAL_GALLERY_BUTTON_WIDTH}rem`,
    border: `1px solid ${theme.palette.neutralLight}`,
    borderRadius: theme.effects.roundedCorner4
  };
};

/**
 * Horizontal Gallery gap size in rem between tiles and buttons
 */
export const HORIZONTAL_GALLERY_GAP = 0.5;

/**
 * @private
 */
export const rootStyle: IStyle = {
  height: '100%',
  width: '100%',
  gap: `${HORIZONTAL_GALLERY_GAP}rem`
};

/**
 * @private
 */
export const childrenContainerStyle: IStyle = {
  height: '100%',
  width: '100%',
  gap: `${HORIZONTAL_GALLERY_GAP}rem`
};
