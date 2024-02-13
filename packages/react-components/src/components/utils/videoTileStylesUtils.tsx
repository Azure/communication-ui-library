// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultPalette as palette, IStyle, Theme, IPalette } from '@fluentui/react';

/**
 * @private
 */
export const getVideoTileOverrideColor = (isVideoRendered: boolean, theme: Theme, color: string): IStyle => {
  // when video is being rendered, the info has a grey-ish background, so no use of theme
  return { color: isVideoRendered ? palette[color as keyof IPalette] : theme.palette[color as keyof IPalette] };
};
