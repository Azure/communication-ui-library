// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IPalette, IStyle } from '@fluentui/react';

/**
 * @private
 */
export const LobbyTileDarkenedOverlayStyles: (palette: IPalette, isVideoReady: boolean) => IStyle = (
  palette,
  isVideoReady
) => {
  return {
    position: 'absolute',
    background: isVideoReady ? '#201f1e' : palette.neutralLight,
    opacity: 0.75
  };
};

/**
 * @private
 */
export const LobbyTileInformationStyles: (palette: IPalette, isVideoReady: boolean) => IStyle = (
  palette,
  isVideoReady
) => {
  return {
    fontSize: '1.75rem',
    color: isVideoReady ? 'white' : palette.neutralPrimary,
    textAlign: 'center'
  };
};
