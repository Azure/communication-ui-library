// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FontWeights, IPalette, IStyle } from '@fluentui/react';

/**
 * @private
 */
export const containerStyle: IStyle = {
  // Ensure some space around the text on a narrow viewport.
  margin: '1rem',
  gap: `1.5rem`
};

/**
 * @private
 */
export const titleContainerStyle: IStyle = {
  gap: `1rem`
};

/**
 * @private
 */
export const titleStyle = (palette: IPalette, isVideoReady: boolean): IStyle => ({
  fontSize: '1.25rem',
  fontWeight: FontWeights.semibold,
  color: isVideoReady ? 'white' : palette.neutralPrimary,
  textAlign: 'center'
});

/**
 * @private
 */
export const moreDetailsStyle = (palette: IPalette, isVideoReady: boolean): IStyle => ({
  fontSize: '1rem',
  color: isVideoReady ? 'white' : palette.neutralPrimary,
  textAlign: 'center'
});
