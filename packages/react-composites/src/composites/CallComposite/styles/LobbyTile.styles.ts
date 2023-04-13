// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IPalette, IStyle } from '@fluentui/react';

/**
 * @private
 */
export const overlayContainerStyle: IStyle = {
  // Ensure some space around the text on a narrow viewport.
  margin: '1rem'
};

/**
 * @private
 */
export const titleStyle: (palette: IPalette, isVideoReady: boolean) => IStyle = (palette, isVideoReady) => {
  return {
    fontSize: '1rem',
    color: isVideoReady ? 'white' : palette.blue,
    textAlign: 'center'
  };
};

/**
 * @private
 */
export const videoTileStyles = {
  root: { height: '100%', width: '100%' }
};

/**
 * @private
 */
export const moreDetailsStyle = (palette: IPalette, isVideoReady: boolean): IStyle => ({
  fontSize: '0.75rem',
  color: isVideoReady ? 'white' : palette.blue,
  textAlign: 'center'
});
