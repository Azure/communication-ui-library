// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { CallAdapterState } from './CallAdapter';
import { memoizeFnAll } from '@internal/acs-ui-common';
import { AdapterStateModifier } from './AzureCommunicationCallAdapter';

/**
 * Callback function used to provide custom data to build profile for a user.
 *
 * @beta
 */
export type OnFetchProfileCallback = (userId: string) => Promise<Profile | undefined>;

/**
 * Custom data attributes for displaying avatar for a user.
 *
 * @public
 */
export type Profile = {
  /**
   * Primary text to display, usually the name of the person.
   */
  displayName?: string;
};

/**
 * Custom data attributes for displaying avatar for a user.
 *
 * @private
 */
export const createProfileStateModifier = (
  onFetchProfile: OnFetchProfileCallback,
  notifyUpdate: () => void
): AdapterStateModifier => {
  let previousParticipantState:
    | {
        [keys: string]: RemoteParticipantState;
      }
    | undefined = undefined;
  let newParticipants = {};

  const modifiedParticipants: {
    [id: string]: { originalRef: RemoteParticipantState; newParticipant: RemoteParticipantState };
  } = {};

  const cachedDisplayName: {
    [id: string]: string;
  } = {};

  return (state: CallAdapterState) => {
    const originalParticipants = state.call?.remoteParticipants;

    async () => {
      let shouldNotifyUpdates = false;
      for (const key in originalParticipants) {
        if (cachedDisplayName[key]) {
          continue;
        }
        const profile = await onFetchProfile(key);
        if (profile?.displayName && originalParticipants[key].displayName !== profile?.displayName) {
          cachedDisplayName[key] = profile?.displayName;
        }
        shouldNotifyUpdates = true;
      }
      shouldNotifyUpdates && notifyUpdate();
    };

    if (state.call?.remoteParticipants !== previousParticipantState) {
      newParticipants = {};
      for (const key in originalParticipants) {
        if (cachedDisplayName[key] === undefined) {
          newParticipants[key] = originalParticipants[key];
          continue;
        }
        if (modifiedParticipants[key].originalRef !== originalParticipants[key]) {
          modifiedParticipants[key].newParticipant = {
            ...originalParticipants[key],
            displayName: cachedDisplayName[key]
          };
          modifiedParticipants[key].originalRef = originalParticipants[key];
        }
        newParticipants[key] = modifiedParticipants[key].newParticipant;
      }

      previousParticipantState = state.call?.remoteParticipants;
    }
    return {
      ...state,
      call: state.call
        ? {
            ...state.call,
            remoteParticipants: newParticipants
          }
        : undefined
    };
  };
};
