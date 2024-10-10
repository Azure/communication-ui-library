// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAdapterState } from './CallAdapter';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { AdapterStateModifier } from './AzureCommunicationCallAdapter';
import { createParticipantModifier } from '../utils';

/**
 * Callback function used to provide custom data to build profile for a user or bot.
 *
 * @public
 */
export type OnFetchProfileCallback = (userId: string, defaultProfile?: Profile) => Promise<Profile | undefined>;

/**
 * The profile of a user or bot.
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
      if (!originalParticipants) {
        return;
      }

      for (const [key, participant] of Object.entries(originalParticipants)) {
        if (cachedDisplayName[key]) {
          continue;
        }
        const profile = await onFetchProfile(key, { displayName: participant.displayName });
        if (profile?.displayName && participant.displayName !== profile?.displayName) {
          cachedDisplayName[key] = profile?.displayName;
          shouldNotifyUpdates = true;
        }
      }
      // notify update only when there is a change, which most likely will trigger modifier and setState again
      if (shouldNotifyUpdates) {
        notifyUpdate();
      }
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
