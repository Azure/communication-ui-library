// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAdapterState } from './CallAdapter';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { AdapterStateModifier } from './AzureCommunicationCallAdapter';
import { createParticipantModifier } from '../utils';

/**
 * Callback function used to provide custom data to build profile for a user.
 *
 * @beta
 */
export type OnFetchProfileCallback = (userId: string, defaultProfile?: Profile) => Promise<Profile | undefined>;

/**
 * The profile of a user.
 *
 * @beta
 */
export type Profile = {
  /**
   * Primary text to display, usually the name of the person.
   */
  displayName?: string;
};

/**
 * @private
 */
export const createProfileStateModifier = (
  onFetchProfile: OnFetchProfileCallback,
  notifyUpdate: () => void
): AdapterStateModifier => {
  const cachedDisplayName: {
    [id: string]: string;
  } = {};

  return (state: CallAdapterState) => {
    const originalParticipants = state.call?.remoteParticipants;
    (async () => {
      let shouldNotifyUpdates = false;
      for (const key in originalParticipants) {
        if (cachedDisplayName[key]) {
          continue;
        }
        const profile = await onFetchProfile(key, { displayName: originalParticipants[key].displayName });
        if (profile?.displayName && originalParticipants[key].displayName !== profile?.displayName) {
          cachedDisplayName[key] = profile?.displayName;
          shouldNotifyUpdates = true;
        }
      }
      // notify update only when there is a change, which most likely will trigger modifier and setState again
      shouldNotifyUpdates && notifyUpdate();
    })();

    const participantsModifier = createParticipantModifier(
      (id: string, participant: RemoteParticipantState): RemoteParticipantState | undefined => {
        if (cachedDisplayName[id]) {
          return { ...participant, displayName: cachedDisplayName[id] };
        }
        return undefined;
      }
    );

    return participantsModifier(state);
  };
};
