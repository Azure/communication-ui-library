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
 * @private
 */
export const getCurrentRelativeUnixTime = () => {
  let baseTimeStamp = new Date();
  baseTimeStamp.setMonth(0);
  baseTimeStamp.setDate(1);
  baseTimeStamp.setHours(0, 0, 0, 0);

  let baseUnixTimestamp = Math.floor(baseTimeStamp.getTime() / 1000);
  return Math.floor(new Date().getTime() / 1000) - baseUnixTimestamp;
};

/* @conditional-compile-remove(reaction) */
/**
 * @private
 */
export const reactionEmoji = new Map<string, string>([
  ['like', `url('/assets/reactions/likeEmoji.png')`],
  ['applause', `url('/assets/clapEmoji.png')`],
  ['heart', `url('/assets/heartEmoji.png')`],
  ['laugh', `url('/assets/laughEmoji.png')`],
  ['surprised', `url('/assets/surprisedEmoji.png')`]
]);
