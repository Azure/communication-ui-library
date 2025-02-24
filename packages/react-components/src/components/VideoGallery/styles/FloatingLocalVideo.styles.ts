// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
export const SMALL_FLOATING_MODAL_SIZE_REM = { width: 3.625, height: 6.5 };

/**
 * Large floating modal width and height in rem for large screen
 * Aspect ratio: 16:9
 */
export const LARGE_FLOATING_MODAL_SIZE_REM = { width: 13.75, height: 7.5 };

/**
 * Vertical gallery floating modal width and height in rem
 * Aspect ratio: 16:9
 */
export const SHORT_VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM = { width: 9, height: 5.063 };

/**
 * Vertical gallery floating modal width and height in rem
 * Aspect ratio: 16:9
 */
export const VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM = { width: 11, height: 6.25 };
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
  localVideoTileSizeRem: { width: number; height: number },
  screenSharePresent?: boolean,
  overflowGalleryPosition?: 'horizontalBottom' | 'verticalRight' | 'horizontalTop'
): IStyle => {
  return {
    width: screenSharePresent ? `${localVideoTileSizeRem.width}rem` : '',
    height: screenSharePresent ? `${localVideoTileSizeRem.height}rem` : '',
    minWidth: screenSharePresent ? '' : `${localVideoTileSizeRem.width}rem`,
    minHeight: screenSharePresent ? '' : `${localVideoTileSizeRem.height}rem`,
    position: 'absolute',
    bottom: overflowGalleryPosition !== 'horizontalTop' ? `${dockedlocalVideoTileContainerPaddingRem}rem` : 'unset',
    top: overflowGalleryPosition === 'horizontalTop' ? `${dockedlocalVideoTileContainerPaddingRem}rem` : 'unset',
    borderRadius: theme.effects.roundedCorner4,
    overflow: 'hidden',
    right: `${dockedlocalVideoTileContainerPaddingRem}rem`
  };
};

/**
 * @private
 */
export const localVideoTileWithControlsContainerStyle = (
  theme: Theme,
  localVideoTileSizeRem: { width: number; height: number }
): IStackStyles => {
  return concatStyleSets(localVideoTileContainerStyle(theme, localVideoTileSizeRem), {
    root: { boxShadow: theme.effects.elevation8 }
  });
};

/**
 * @private
 */
export const floatingLocalVideoModalStyle = (
  theme: Theme,
  modalSizeRem: { width: number; height: number }
): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> => {
  return concatStyleSets(
    {
      main: mergeStyles(localVideoTileContainerStyle(theme, modalSizeRem), {
        bottom: `${floatinglocalVideoModalInitialPositionGapRem}rem`,
        right: `${floatinglocalVideoModalInitialPositionGapRem}rem`
      })
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
    {
      // Needed to allow the videoGallery underneath to receive pointer events
      root: {
        pointerEvents: 'none'
      }
    },
    localVideoModalStyles
  );
};

/**
 * Initial position gap of the floating local video modal.
 * ie. if this is 1rem, then floating local video modal would initially be positioned 1rem from
 * the bottom and 1rem from the right.
 * @private
 */
export const floatinglocalVideoModalInitialPositionGapRem = 1;

/**
 * Padding of the docked local video tile container.
 * @private
 */
export const dockedlocalVideoTileContainerPaddingRem = 0.5;

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
