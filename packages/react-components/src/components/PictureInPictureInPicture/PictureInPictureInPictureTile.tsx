// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles, memoizeFunction, Stack } from '@fluentui/react';
import React, { ReactElement, PropsWithChildren } from 'react';
import { useTheme } from '../../theming/FluentThemeProvider';

/** @internal */
export type _TileOrientation = 'portrait' | 'landscape';

/** @internal */
export type _PictureInPictureInPictureTileProps = PropsWithChildren<{
  orientation: _TileOrientation;
}>;

/** @private */
export const PictureInPictureInPicturePrimaryTile = (props: _PictureInPictureInPictureTileProps): ReactElement => {
  const boxShadow = useTheme().effects.elevation8;
  return (
    <PictureInPictureInPictureTile styles={primaryTileStyles(props.orientation, boxShadow)}>
      {props.children}
    </PictureInPictureInPictureTile>
  );
};

/** @private */
export const PictureInPictureInPictureSecondaryTile = (props: _PictureInPictureInPictureTileProps): ReactElement => (
  <PictureInPictureInPictureTile styles={secondaryTileStyles(props.orientation)}>
    {props.children}
  </PictureInPictureInPictureTile>
);

const PictureInPictureInPictureTile = (props: PropsWithChildren<{ styles: IStackStyles }>): ReactElement => (
  <Stack styles={props.styles}>{props.children}</Stack>
);

const primaryTileStyles = memoizeFunction(
  (orientation: _TileOrientation, themeElevation: string): IStackStyles => ({
    root: {
      borderRadius: '0.25rem',
      height: orientation === 'landscape' ? '5.5rem' : '8rem',
      width: orientation === 'landscape' ? '8rem' : '5.5rem',
      boxShadow: themeElevation,
      // PiPiP tiles were not designed to host scrollable content. If removed check no scrollbar is showing in e2e tests
      overflow: 'hidden'
    }
  })
);

const secondaryTileStyles = memoizeFunction(
  (orientation: _TileOrientation): IStackStyles => ({
    root: {
      borderRadius: '0.25rem',
      height: orientation === 'landscape' ? '1.625rem' : '2rem',
      width: orientation === 'landscape' ? '2rem' : '1.625rem',
      // PiPiP tiles were not designed to host scrollable content. If removed check no scrollbar is showing in e2e tests
      overflow: 'hidden'
    }
  })
);
