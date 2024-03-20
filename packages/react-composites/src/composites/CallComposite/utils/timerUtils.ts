// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @internal
 */
export const getMinutes = (time: number): number => {
  return Math.floor(getSeconds(time) / 60);
};

/**
 * @internal
 */
export const getSeconds = (time: number): number => {
  return Math.floor(time / 1000);
};

/**
 * @internal
 */
export const getHours = (time: number): number => {
  return Math.floor(getMinutes(time) / 60);
};

/**
 * @internal
 */
export const getReadableTime = (time: number): string => {
  const hours = getHours(time);
  const readableMinutes = ('0' + (getMinutes(time) % 60)).slice(-2);
  const readableSeconds = ('0' + (getSeconds(time) % 60)).slice(-2);
  return `${hours > 0 ? hours + ':' : ''}${readableMinutes}:${readableSeconds}`;
};
