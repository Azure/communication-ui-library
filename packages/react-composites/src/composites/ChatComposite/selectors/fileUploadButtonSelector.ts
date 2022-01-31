// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { createSelector } from 'reselect';
import { getUserId } from './baseSelectors';

/**
 * @private
 */
export const fileUploadButtonSelector = createSelector([getUserId], (userId) => {
  return { userId };
});
