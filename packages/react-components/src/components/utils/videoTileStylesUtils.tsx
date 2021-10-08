// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultPalette as palette, IStyle, Theme } from '@fluentui/react';

/**
 * @private
 */
export const getVideoTileOverrideColor = (isVideoRendered: boolean, theme: Theme, color: string): IStyle => {
  // when video is being rendered, the info has a grey-ish background, so no use of theme
  switch (color) {
    case 'neutralPrimary':
      return { color: isVideoRendered ? palette.neutralPrimary : theme.palette.neutralPrimary };
    case 'neutralSecondary':
      return { color: isVideoRendered ? palette.neutralSecondary : theme.palette.neutralSecondary };
    case 'neutralTertiary':
      return { color: isVideoRendered ? palette.neutralTertiary : theme.palette.neutralTertiary };
    default:
      return {};
  }
};
