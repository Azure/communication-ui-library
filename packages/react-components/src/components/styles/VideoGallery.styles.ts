// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  DefaultPalette as palette,
  mergeStyles,
  IStackStyles,
  IModalStyleProps,
  IModalStyles,
  IStyleFunctionOrObject
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
export const floatingLocalVideoModalStyle: IStyleFunctionOrObject<IModalStyleProps, IModalStyles> = {
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  main: {
    minWidth: '11.25rem',
    minHeight: '7rem',
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
    height: '7rem'
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
export const screenSharingNotificationContainerCameraOffStyles = mergeStyles({
  backgroundColor: 'inherit',
  padding: '1rem',
  maxWidth: '95%'
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
