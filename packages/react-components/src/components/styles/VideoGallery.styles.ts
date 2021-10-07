// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  mergeStyles,
  getTheme,
  IStackStyles,
  IModalStyleProps,
  IModalStyles,
  IStyleFunctionOrObject
} from '@fluentui/react';
import { CSSProperties } from 'react';
import { VideoTileStylesProps } from '../VideoTile';

const theme = getTheme();

const videoBaseStyle = mergeStyles({
  border: 0
});

/**
 * @private
 */
export const gridStyle = mergeStyles(videoBaseStyle, {
  width: '100%',
  height: '100%'
});

/**
 * @private
 */
export const videoGalleryOuterDivStyle = mergeStyles({ position: 'relative', width: '100%', height: '100%' });

/**
 * @private
 */
export const videoGalleryContainerStyle: IStackStyles = { root: { position: 'relative', height: '100%' } };

/**
 * @private
 */
export const floatingLocalVideoModalStyle = (
  isMobile?: boolean
): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  main: {
    minWidth: isMobile ? '4rem' : '10rem',
    minHeight: isMobile ? '5.5rem' : '7.5rem',
    boxShadow: theme.effects.elevation8,
    borderRadius: theme.effects.roundedCorner4,
    position: 'absolute',
    bottom: '0.5rem',
    right: '0.5rem'
  }
});

/**
 * @private
 */
export const floatingLocalVideoTileStyle: VideoTileStylesProps = {
  root: {
    position: 'absolute',
    zIndex: 1,
    bottom: '0',
    right: '0',
    height: '100%',
    width: '100%',
    borderRadius: theme.effects.roundedCorner4
  }
};

/**
 * @private
 */
export const getHorizontalGalleryWrapperStyle = (isMobileScreen: boolean): CSSProperties => {
  return { minHeight: isMobileScreen ? '6rem' : '8rem', maxHeight: isMobileScreen ? '6rem' : '8rem' };
};
