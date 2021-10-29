// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FontWeights, IStyle } from '@fluentui/react';

/**
 * @private
 */
export const containerStyle: IStyle = {
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
export const titleStyle = (palette, isVideoReady): IStyle => ({
  fontSize: '1.25rem',
  fontWeight: FontWeights.semibold,
  color: isVideoReady ? 'white' : palette.neutralPrimary,
  textAlign: 'center'
});

/**
 * @private
 */
export const moreDetailsStyle = (palette, isVideoReady): IStyle => ({
  fontSize: '1rem',
  color: isVideoReady ? 'white' : palette.neutralPrimary,
  textAlign: 'center'
});
