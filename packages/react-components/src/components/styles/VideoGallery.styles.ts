// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  mergeStyles,
  IStackStyles,
  IModalStyleProps,
  IModalStyles,
  IStyleFunctionOrObject,
  Theme
} from '@fluentui/react';
import { VideoTileStylesProps } from '../VideoTile';

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
export const videoGalleryContainerStyle: IStackStyles = { root: { position: 'relative', height: '100%' } };

/**
 * @private
 */
export const floatingLocalVideoModalStyle = (theme: Theme): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  main: {
    minWidth: '11.25rem',
    minHeight: '7rem',
    boxShadow: theme.effects.elevation8,
    borderRadius: theme.effects.roundedCorner4,
    position: 'absolute',
    bottom: '1rem',
    right: '1rem'
  }
});

/**
 * @private
 */
export const floatingLocalVideoTileStyle = (theme: Theme): VideoTileStylesProps => ({
  root: {
    position: 'absolute',
    zIndex: 1,
    bottom: '0',
    right: '0',
    width: '11.25rem',
    height: '7rem',
    borderRadius: theme.effects.roundedCorner4
  }
});

/**
 * @private
 */
export const videoWithNoRoundedBorderStyle = {
  root: {
    '& video': { borderRadius: '0rem' }
  }
};
