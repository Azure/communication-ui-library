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
export const screenSharingNotificationContainerCameraOffStyles = mergeStyles({
  backgroundColor: 'inherit',
  padding: '1rem',
  maxWidth: '95%',
  borderRadius: theme.effects.roundedCorner4
});

/**
 * @private
 */
export const screenSharingNotificationContainerCameraOnStyles = mergeStyles(
  screenSharingNotificationContainerCameraOffStyles,
  {
    // This will appear on top of the video stream, so no dependency on theme and thus the direct use of default palette
    backgroundColor: palette.white,
    opacity: 0.8
  }
);

/**
 * @private
 */
export const screenSharingNotificationIconContainer = mergeStyles({
  height: '2rem',
  lineHeight: 0
});

/**
 * @private
 */
export const screenSharingNotificationIconStyle = mergeStyles({
  // svg is (20px x 20px) but path is only (16px x 12px), so need to scale at 2.5 to get 40px
  transform: 'scale(2.5)'
});

/**
 * @private
 */
export const screenSharingNotificationTextStyle = mergeStyles({
  fontSize: '1rem',
  // Text component will take body color by default (white in Dark Mode), so forcing it to be parent container color
  color: 'inherit'
});
