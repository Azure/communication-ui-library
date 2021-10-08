// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultPalette as palette, IStyle, Theme } from '@fluentui/react';

/**
 * @private
 */
export const getVideoTileInfoColor = (isVideoRendered: boolean, theme: Theme): IStyle => {
  // when video is being rendered, the info has a grey-ish background, so no use of theme
  return { color: isVideoRendered ? palette.neutralSecondary : theme.palette.neutralSecondary };
};

/**
 * @private
 */
export const getVideoTileScreenSharingNotificationIconColor = (isVideoRendered: boolean, theme: Theme): IStyle => {
  // when video is being rendered, the info has a grey-ish background, so no use of theme
  return { color: isVideoRendered ? palette.neutralTertiary : theme.palette.neutralTertiary };
};
