// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultPalette as palette, IStyle, Theme } from '@fluentui/react';

/**
 * @private
 */
export const getVideoTileOverrideColor = (isVideoRendered: boolean, theme: Theme, color: string): IStyle => {
  // when video is being rendered, the info has a grey-ish background, so no use of theme
  return { color: isVideoRendered ? palette[color] : theme.palette[color] };
};

/* @conditional-compile-remove(reaction) */
/**
 * Temporary mapping of paths for the reaction emoji resources.
 * @private
 */
export const reactionEmoji = new Map<string, string>([
  ['like', `url('/assets/reactions/likeEmoji.png')`],
  ['applause', `url('/assets/clapEmoji.png')`],
  ['heart', `url('/assets/heartEmoji.png')`],
  ['laugh', `url('/assets/laughEmoji.png')`],
  ['surprised', `url('/assets/surprisedEmoji.png')`]
]);
