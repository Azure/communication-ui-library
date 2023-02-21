// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, Theme } from '@fluentui/react';

/**
 * Horizontal Gallery gap size in rem between tiles and buttons
 */
export const VERTICAL_GALLERY_GAP = 0.5;

/**
 * @private
 */
export const childrenContainerStyle: IStyle = {
  width: '100%',
  gap: `${VERTICAL_GALLERY_GAP}rem`
};

/**
 * @private
 */
export const rootStyle: IStyle = {
  height: '100%',
  width: '100%',
  gap: `${VERTICAL_GALLERY_GAP}rem`
};

export const controlBarContainerStyle: IStyle = {
  height: '2rem'
};

/**
 * @private
 */
export const leftRightButtonStyles = (theme: Theme): IStyle => {
  return {
    background: 'none',
    padding: 0,
    height: 'auto',
    border: `1px solid ${theme.palette.neutralLight}`,
    borderRadius: theme.effects.roundedCorner4
  };
};
