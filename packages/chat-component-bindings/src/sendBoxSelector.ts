// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState } from '@internal/chat-stateful-client';
import { createSelector } from 'reselect';
import { ChatBaseSelectorProps, getDisplayName, getUserId } from './baseSelectors';

/**
 * Selector type for {@link SendBox} component.
 *
 * @public
 */
export type SendBoxSelector = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
) => {
  displayName: string;
  userId: string;
};

/**
 * Selector for {@link SendBox} component.
 *
 * @public
 */
export const sendBoxSelector: SendBoxSelector = createSelector([getUserId, getDisplayName], (userId, displayName) => ({
  displayName: displayName,
  userId: userId
}));
