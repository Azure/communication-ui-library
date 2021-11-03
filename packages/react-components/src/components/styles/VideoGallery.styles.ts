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
export const videoGalleryContainerStyle: IStackStyles = {
  root: { position: 'relative', height: '100%', padding: '0.5rem', gap: '0.5rem' }
};

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
export const floatingLocalVideoTileStyle = (theme: Theme): string =>
  mergeStyles({
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: '100%',
    boxShadow: theme.effects.elevation4
  });

/**
 * @private
 */
export const horizontalGalleryStyle = (shouldFloatLocalVideo: boolean, isNarrow: boolean): IStyle => {
  return {
    maxHeight: isNarrow
      ? `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`
      : `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
    minHeight: isNarrow
      ? `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`
      : `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.height}rem`,
    width: shouldFloatLocalVideo
      ? isNarrow
        ? `calc(100% - ${SMALL_FLOATING_MODAL_SIZE_REM.width}rem)`
        : `calc(100% - ${LARGE_FLOATING_MODAL_SIZE_REM.width}rem)`
      : '100%',
    paddingRight: '0.5rem'
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
