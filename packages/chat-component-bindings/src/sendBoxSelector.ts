// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createSelector } from 'reselect';
import { getDisplayName, getUserId } from './baseSelectors';

export const sendBoxSelector = createSelector([getUserId, getDisplayName], (userId, displayName) => ({
  displayName: displayName,
  userId: userId
}));
