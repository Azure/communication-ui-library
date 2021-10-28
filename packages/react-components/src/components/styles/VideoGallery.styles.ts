// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  mergeStyles,
  IStackStyles,
  IModalStyleProps,
  IModalStyles,
  IStyleFunctionOrObject,
  Theme,
  IStyle,
  concatStyleSets
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
export const videoGalleryOuterDivStyle = mergeStyles({ position: 'relative', width: '100%', height: '100%' });

/**
 * @private
 */
export const videoGalleryContainerStyle: IStackStyles = { root: { position: 'relative', height: '100%' } };

/**
 * Small floating modal width and height in rem for small screen
 */
export const SMALL_FLOATING_MODAL_SIZE_REM = { width: 4, height: 5.5 };

/**
 * Large floating modal width and height in rem for large screen
 */
export const LARGE_FLOATING_MODAL_SIZE_REM = { width: 10, height: 7.5 };

/**
 * @private
 */
export const floatingLocalVideoModalStyle = (
  theme: Theme,
  isNarrow?: boolean
): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> => {
  return concatStyleSets(
    {
      root: {
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      },
      main: {
        minWidth: isNarrow ? `${SMALL_FLOATING_MODAL_SIZE_REM.width}rem` : `${LARGE_FLOATING_MODAL_SIZE_REM.width}rem`,
        minHeight: isNarrow
          ? `${SMALL_FLOATING_MODAL_SIZE_REM.height}rem`
          : `${LARGE_FLOATING_MODAL_SIZE_REM.height}rem`,
        position: 'absolute',
        bottom: '0.5rem',
        boxShadow: theme.effects.elevation8,
        borderRadius: theme.effects.roundedCorner4
      }
    },
    { main: theme.rtl ? { left: '0.5rem' } : { right: '0.5rem' } }
  );
};

/**
 * @private
 */
export const floatingLocalVideoTileStyle: VideoTileStylesProps = {
  root: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: '100%'
  }
};

/**
 * @private
 */
export const videoWithNoRoundedBorderStyle = {
  root: {
    '& video': { borderRadius: '0rem' }
  }
};

/**
 * @private
 */
export const loadingStyle = mergeStyles({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
});

/**
 * @private
 */
export const videoStreamStyle = mergeStyles({
  position: 'absolute',
  bottom: '.25rem',
  right: '.25rem',
  height: 'auto',
  width: '25%'
});

/**
 * @private
 */
export const screenSharingNotificationContainer = (theme: Theme): string =>
  mergeStyles({
    backgroundColor: 'inherit',
    padding: '1rem',
    maxWidth: '95%',
    borderRadius: theme.effects.roundedCorner4,
    color: theme.palette.neutralSecondary
  });

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
export const screenSharingNotificationIconContainer = mergeStyles({
  height: '2rem',
  lineHeight: 0
});

/**
 * @private
 */
export const screenSharingNotificationIconStyle = (theme: Theme): string =>
  mergeStyles({
    // svg is (20px x 20px) but path is only (16px x 12px), so need to scale at 2.5 to get 40px
    transform: 'scale(2.5)',
    color: theme.palette.neutralTertiary
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
 * @private
 */
export const horizontalGalleryStyle = (shouldFloatLocalVideo: boolean, isNarrow: boolean): IStyle => {
  return {
    maxHeight: isNarrow ? '6rem' : '8rem',
    minHeight: isNarrow ? '6rem' : '8rem',
    width: shouldFloatLocalVideo
      ? isNarrow
        ? `calc(100% - ${SMALL_FLOATING_MODAL_SIZE_REM.width}rem)`
        : `calc(100% - ${LARGE_FLOATING_MODAL_SIZE_REM.width}rem)`
      : '100%',
    paddingRight: '0.5rem',
    paddingLeft: '0.5rem'
  };
};

/**
 * Small horizontal gallery tile size in rem
 * @private
 */
export const SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM = { height: 5.5, width: 5.5 };
/**
 * Large horizontal gallery tile size in rem
 * @private
 */
export const LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM = { height: 7.5, width: 10 };

/**
 * @private
 */
export const SMALL_HORIZONTAL_GALLERY_TILE_STYLE = {
  minHeight: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
  minWidth: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width}rem`,
  maxHeight: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
  maxWidth: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width}rem`
};
/**
 * @private
 */
export const LARGE_HORIZONTAL_GALLERY_TILE_STYLE = {
  minHeight: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
  minWidth: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width}rem`,
  maxHeight: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
  maxWidth: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width}rem`
};
