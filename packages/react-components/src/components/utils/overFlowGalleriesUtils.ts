// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Helper function to bucketize a given array of items into buckets of a specified size.
 *
 * @param arr array to bucketize
 * @param bucketSize number of children for each bucket
 * @returns nested array of given children
 *
 * @private
 */
export function bucketize<T>(arr: T[], bucketSize: number): T[][] {
  const bucketArray: T[][] = [];

  if (bucketSize <= 0) {
    return bucketArray;
  }

  for (let i = 0; i < arr.length; i += bucketSize) {
    bucketArray.push(arr.slice(i, i + bucketSize));
  }

  return bucketArray;
}
