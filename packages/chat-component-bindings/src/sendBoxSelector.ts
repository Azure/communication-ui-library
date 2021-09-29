// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createSelector } from 'reselect';
import { getDisplayName, getUserId } from './baseSelectors';

/**
 * Selector for {@link SendBox} component.
 *
 * @public
 */
export const sendBoxSelector = createSelector([getUserId, getDisplayName], (userId, displayName) => ({
  displayName: displayName,
  userId: userId
}));
