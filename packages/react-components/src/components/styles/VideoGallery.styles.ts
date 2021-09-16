// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
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

export const gridStyle = mergeStyles(videoBaseStyle, {
  width: '100%',
  height: '100%'
});

export const videoGalleryContainerStyle: IStackStyles = { root: { position: 'relative', height: '100%' } };

export const floatingLocalVideoModalStyle: IStyleFunctionOrObject<IModalStyleProps, IModalStyles> = {
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  main: {
    minWidth: '11.25em',
    minHeight: '7em',
    boxShadow: theme.effects.elevation8,
    borderRadius: theme.effects.roundedCorner4,
    position: 'absolute',
    bottom: '1em',
    right: '1em'
  }
};

export const floatingLocalVideoTileStyle: VideoTileStylesProps = {
  root: {
    position: 'absolute',
    zIndex: 1,
    bottom: '0',
    right: '0',
    width: '11.25em',
    height: '7em',
    borderRadius: theme.effects.roundedCorner4
  }
};
