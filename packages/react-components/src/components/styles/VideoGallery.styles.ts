// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  DefaultPalette as palette,
  mergeStyles,
  getTheme,
  IStackStyles,
  IModalStyleProps,
  IModalStyles,
  IStyleFunctionOrObject
} from '@fluentui/react';
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
export const videoGalleryContainerStyle: IStackStyles = { root: { position: 'relative', height: '100%' } };

/**
 * @private
 */
export const floatingLocalVideoModalStyle: IStyleFunctionOrObject<IModalStyleProps, IModalStyles> = {
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
};

/**
 * @private
 */
export const floatingLocalVideoTileStyle: VideoTileStylesProps = {
  root: {
    position: 'absolute',
    zIndex: 1,
    bottom: '0',
    right: '0',
    width: '11.25rem',
    height: '7rem',
    borderRadius: theme.effects.roundedCorner4
  }
};

/**
 * @private
 */
export const screenSharingContainer = mergeStyles({
  width: '100%',
  height: '100%'
});

/**
 * @private
 */
export const screenSharingInfoContainerCameraOff = mergeStyles({
  backgroundColor: 'inherit',
  padding: '1rem',
  maxWidth: '95%',
  borderRadius: theme.effects.roundedCorner4
});

/**
 * @private
 */
export const screenSharingInfoContainerCameraOn = mergeStyles(screenSharingInfoContainerCameraOff, {
  backgroundColor: palette.white,
  opacity: 0.8
});

/**
 * @private
 */
export const screenSharingInfoIconContainer = mergeStyles({
  height: '2rem',
  lineHeight: 0
});

/**
 * @private
 */
export const screenSharingInfoIconStyle = mergeStyles({
  // svg is (20px x 20px) but path is only (16px x 12px), so need to scale at 2.5 to get 40px
  transform: 'scale(2.5)'
});

/**
 * @private
 */
export const screenSharingInfoTextStyle = mergeStyles({
  fontSize: '1rem',
  color: 'inherit'
});
