// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconStyles, IStyle, Theme } from '@fluentui/react';

/**
 * Vertical Gallery gap size in rem between tiles and buttons
 *
 * @private
 */
export const VERTICAL_GALLERY_GAP = 0.5;

/**
 * @private
 */
export const childrenContainerStyle = (pageControlBarHeight: number): IStyle => {
  return {
    width: '100%',
    height: `calc(100% - ${pageControlBarHeight + VERTICAL_GALLERY_GAP}rem)`,
    gap: `${VERTICAL_GALLERY_GAP}rem`
  };
};

/**
 * @private
 */
export const rootStyle: IStyle = {
  height: '100%',
  width: 'inherit', // this needs to inherit its parent's width otherwise will collapse if there are no children.
  gap: `${VERTICAL_GALLERY_GAP}rem`,
  position: 'relative'
};

/**
 * @private
 */
export const pageNavigationControlBarContainerStyle: IStyle = {
  height: '2rem',
  width: '100%',
  position: 'absolute',
  bottom: '0'
};

/**
 * @private
 */
export const leftRightButtonStyles = (theme: Theme): IStyle => {
  return {
    background: 'none',
    padding: 0,
    height: 'auto',
    borderRadius: theme.effects.roundedCorner4,
    border: 'none',
    minWidth: '2rem'
  };
};

/**
 * @private
 */
export const participantPageCounter: IStyle = {
  lineHeight: '2rem',
  width: '100%',
  textAlign: 'center'
};

/**
 * @private
 */
export const navIconStyles: IIconStyles = {
  root: {
    lineHeight: '0'
  }
};
