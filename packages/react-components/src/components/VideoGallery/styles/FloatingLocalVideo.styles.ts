// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  concatStyleSets,
  IButtonStyles,
  IModalStyleProps,
  IModalStyles,
  IStackStyles,
  IStyle,
  IStyleFunctionOrObject,
  mergeStyles,
  Theme
} from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { VideoTileStylesProps } from '../../VideoTile';

/**
 * @private
 */
export const videoGalleryOuterDivStyle = mergeStyles({ position: 'relative', width: '100%', height: '100%' });

/**
 * @private
 */
export const videoGalleryContainerStyle: IStackStyles = {
  root: { position: 'relative', height: '100%', width: '100%', padding: '0.5rem' }
};

/**
 * Small floating modal width and height in rem for small screen
 */
export const SMALL_FLOATING_MODAL_SIZE_PX = { width: 58, height: 104 };

/**
 * Large floating modal width and height in rem for large screen
 * Aspect ratio: 16:9
 */
export const LARGE_FLOATING_MODAL_SIZE_PX = { width: 215, height: 120 };

/**
 * Vertical gallery floating modal width and height in rem
 * Aspect ratio: 16:9
 */
export const SHORT_VERTICAL_GALLERY_FLOATING_MODAL_SIZE_PX = { width: 144, height: 81 };

/**
 * Vertical gallery floating modal width and height in rem
 * Aspect ratio: 16:9
 */
export const VERTICAL_GALLERY_FLOATING_MODAL_SIZE_PX = { width: 176, height: 100 };
/**
 * @private
 * z-index to ensure that the local video tile is above the video gallery.
 */
export const LOCAL_VIDEO_TILE_ZINDEX = 2;

/**
 * @private
 */
export const localVideoTileContainerStyle = (
  theme: Theme,
  localVideoTileSize: { width: number; height: number }
): IStyle => {
  return {
    minWidth: _pxToRem(localVideoTileSize.width),
    minHeight: _pxToRem(localVideoTileSize.height),
    position: 'absolute',
    bottom: _pxToRem(localVideoTileOuterPaddingPX),
    borderRadius: theme.effects.roundedCorner4,
    overflow: 'hidden',
    ...(theme.rtl
      ? { left: _pxToRem(localVideoTileOuterPaddingPX) }
      : { right: _pxToRem(localVideoTileOuterPaddingPX) })
  };
};

/**
 * @private
 */
export const localVideoTileWithControlsContainerStyle = (
  theme: Theme,
  localVideoTileSize: { width: number; height: number }
): IStackStyles => {
  return concatStyleSets(localVideoTileContainerStyle(theme, localVideoTileSize), {
    root: { boxShadow: theme.effects.elevation8 }
  });
};

/**
 * @private
 */
export const floatingLocalVideoModalStyle = (
  theme: Theme,
  modalSize: { width: number; height: number }
): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> => {
  return concatStyleSets(
    {
      main: localVideoTileContainerStyle(theme, modalSize)
    },
    {
      main: {
        boxShadow: theme.effects.elevation8,
        ':focus-within': {
          boxShadow: theme.effects.elevation16,
          border: `${_pxToRem(2)} solid ${theme.palette.neutralPrimary}`
        }
      }
    },
    localVideoModalStyles
  );
};

/**
 * Padding equal to the amount the modal should stay inside the bounds of the container.
 * i.e. if this is 8px, the modal should always be at least 8px inside the container at all times on all sides.
 * @private
 */
export const localVideoTileOuterPaddingPX = 8;

/**
 * @private
 */
export const floatingLocalVideoTileStyle: VideoTileStylesProps = {
  root: {
    position: 'absolute',
    zIndex: LOCAL_VIDEO_TILE_ZINDEX,
    height: '100%',
    width: '100%'
  }
};

/**
 * @private
 */
export const localVideoCameraCycleButtonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      position: 'absolute',
      width: _pxToRem(32),
      height: _pxToRem(32),
      right: '0rem',
      top: '0rem',
      color: '#FFFFFF', // only shows up on running video feed to we want to force specific colours.
      zIndex: 2, // shows the button directly over the local video feed.
      background: 'rgba(0,0,0,0.4)',
      borderRadius: theme.effects.roundedCorner2
    },
    rootFocused: {
      // styles to remove the unwanted white highlight and blue colour after tapping on button.
      color: '#FFFFFF',
      background: 'rgba(0,0,0,0.4)' // sets opacity of background to be visible on all backdrops in video stream.
    },
    icon: {
      paddingLeft: _pxToRem(3),
      paddingRight: _pxToRem(3),
      margin: 0
    },
    flexContainer: {
      paddingBottom: _pxToRem(8)
    }
  };
};

/**
 * Styles for the local video tile modal when it is focused, will cause keyboard move icon to appear over video
 * @private
 */
export const localVideoModalStyles: Partial<IModalStyles> = {
  keyboardMoveIconContainer: {
    zIndex: LOCAL_VIDEO_TILE_ZINDEX + 1 // zIndex to set the keyboard movement Icon above the other layers in the video tile.
  }
};
