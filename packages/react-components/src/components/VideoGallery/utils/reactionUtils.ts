// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @private */
export const REACTION_START_DISPLAY_SIZE = 44;
/** @private */
export const REACTION_NUMBER_OF_ANIMATION_FRAMES = 51;
/** @private */
export const REACTION_SCREEN_SHARE_ANIMATION_TIME_MS = 4133;

/** @private */
export const getCombinedKey = (userId: string, reactionType: string, receivedAt: Date): string => {
  const receivedTime =
    receivedAt.getFullYear() +
    ':' +
    receivedAt.getMonth() +
    ':' +
    receivedAt.getDay() +
    ':' +
    receivedAt.getHours() +
    ':' +
    receivedAt.getMinutes() +
    ':' +
    receivedAt.getSeconds() +
    ':' +
    receivedAt.getMilliseconds();

  return userId + reactionType + receivedTime;
};

/** @private */
export const getReceivedUnixTime = (receivedTime: Date): number => {
  return Math.floor(receivedTime.getTime());
};
