// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { getCameras, getMicrophones } from './baseSelectors';
import { createSelector } from 'reselect';
/**
 * @private
 */
export const deviceCountSelector = createSelector([getCameras, getMicrophones], (cameras, microphones) => {
  return {
    camerasCount: cameras.length,
    microphonesCount: microphones.length
  };
});
