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
import { HorizontalGalleryStyles } from '../VideoGallery/HorizontalGallery';
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
 * Large floating modal width and height for small screen
 */
export const SMALL_FLOATING_MODAL_SIZE = { width: 4, height: 5.5 }; //size in rem

/**
 * Large floating modal width and height for large screen
 */
export const LARGE_FLOATING_MODAL_SIZE = { width: 10, height: 7.5 };

/**
 * Floating modal horizontal position from the right in rem
 */
export const FLOATING_MODAL_POSITION_FROM_RIGHT = 0.5;

/**
 * @private
 */
export const floatingLocalVideoModalStyle = (
  isNarrow?: boolean
): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  main: {
    minWidth: isNarrow ? `${SMALL_FLOATING_MODAL_SIZE.width}rem` : `${LARGE_FLOATING_MODAL_SIZE.width}rem`,
    minHeight: isNarrow ? `${SMALL_FLOATING_MODAL_SIZE.height}rem` : `${LARGE_FLOATING_MODAL_SIZE.height}rem`,
    boxShadow: theme.effects.elevation8,
    borderRadius: theme.effects.roundedCorner4,
    position: 'absolute',
    bottom: '0.5rem',
    right: `${FLOATING_MODAL_POSITION_FROM_RIGHT}rem`
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
 * Horizontal Gallery padding in rem
 */
export const HORIZONTAL_GALLERY_PADDING = 0.5; // in rem

/**
 * @private
 */
export const horizontalGalleryStyle = (isNarrow: boolean): HorizontalGalleryStyles => {
  return {
    root: {
      height: isNarrow ? '6rem' : '8rem',
      width: isNarrow
        ? `calc(100% - ${SMALL_FLOATING_MODAL_SIZE.width}rem)`
        : `calc(100% - ${LARGE_FLOATING_MODAL_SIZE.width}rem)`,
      paddingRight: `${HORIZONTAL_GALLERY_PADDING}rem`,
      paddingLeft: `${HORIZONTAL_GALLERY_PADDING}rem`
    }
  };
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

/**
 * Small horizontal gallery tile size in rem
 * @private
 */
export const SMALL_HORIZONTAL_GALLERY_TILE_SIZE = { height: 5.5, width: 5.5 };
/**
 * Large horizontal gallery tile size in rem
 * @private
 */
export const LARGE_HORIZONTAL_GALLERY_TILE_SIZE = { height: 7.5, width: 10 };

/**
 * @private
 */
export const SMALL_HORIZONTAL_GALLERY_TILE_STYLE = {
  minHeight: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE.height}rem`,
  minWidth: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE.width}rem`,
  maxHeight: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE.height}rem`,
  maxWidth: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE.width}rem`
};
/**
 * @private
 */
export const LARGE_HORIZONTAL_GALLERY_TILE_STYLE = {
  minHeight: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE.height}rem`,
  minWidth: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE.width}rem`,
  maxHeight: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE.height}rem`,
  maxWidth: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE.width}rem`
};
