// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
/** @private */
export const REACTION_START_DISPLAY_SIZE = 44;
/* @conditional-compile-remove(reaction) */
/** @private */
export const REACTION_NUMBER_OF_ANIMATION_FRAMES = 51;
/* @conditional-compile-remove(reaction) */
/** @private */
export const REACTION_SCREEN_SHARE_ANIMATION_TIME_MS = 4133;
/* @conditional-compile-remove(reaction) */
/** @private */
export const REACTION_DEFAULT_RESOURCE_FRAME_SIZE_PX = 128;

/* @conditional-compile-remove(reaction) */
/** @private */
export const getCombinedKey = (userId: string, reactionType: string, receivedAt: Date): string => {
  const receivedTime = receivedAt.toISOString();

  return userId + reactionType + receivedTime;
};

/* @conditional-compile-remove(reaction) */
/** @private */
export const getReceivedUnixTime = (receivedTime: Date): number => {
  return receivedTime.getTime();
};
