// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, getTheme } from '@fluentui/react';
import { VideoTileStylesProps } from '../VideoTile';

const theme = getTheme();

const videoBaseStyle = mergeStyles({
  border: 0
});

export const gridStyle = mergeStyles(videoBaseStyle, {
  width: '100%',
  height: '100%'
});

export const videoTileStyle = {
  root: {
    borderRadius: theme.effects.roundedCorner4
  }
};

export const floatingLocalVideoTileStyle: VideoTileStylesProps = {
  root: {
    position: 'absolute',
    zIndex: 1,
    bottom: '1rem',
    right: '1rem',
    width: '11.25rem',
    height: '7rem',
    borderRadius: theme.effects.roundedCorner4,
    boxShadow: theme.effects.elevation8
  }
};
