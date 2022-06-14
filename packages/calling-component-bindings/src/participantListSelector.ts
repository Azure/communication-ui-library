// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { createSelector } from 'reselect';
import {
  getIdentifier,
  getDisplayName,
  getRemoteParticipants,
  getIsScreenSharingOn,
  getIsMuted,
  CallingBaseSelectorProps
} from './baseSelectors';
import { CallParticipantListParticipant } from '@internal/react-components';
import { _updateUserDisplayNames } from './utils/callUtils';
import { memoizedConvertAllremoteParticipants } from './utils/participantListSelectorUtils';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

const convertRemoteParticipantsToParticipantListParticipants = (
  remoteParticipants: RemoteParticipantState[]
): CallParticipantListParticipant[] => {
  return memoizedConvertAllremoteParticipants((memoizeFn) => {
    return (
      remoteParticipants
        // temporarily hiding lobby participants in ACS clients till we can admit users through ACS clients
        .filter((participant: RemoteParticipantState) => {
          return participant.state !== 'InLobby';
        })
        .map((participant: RemoteParticipantState) => {
          const isScreenSharing = Object.values(participant.videoStreams).some(
            (videoStream) => videoStream.mediaStreamType === 'ScreenSharing' && videoStream.isAvailable
          );
          return memoizeFn(
            toFlatCommunicationIdentifier(participant.identifier),
            participant.displayName,
            participant.state,
            participant.isMuted,
            isScreenSharing,
            participant.isSpeaking
          );
        })
        .sort((a, b) => {
          const nameA = a.displayName?.toLowerCase() || '';
          const nameB = b.displayName?.toLowerCase() || '';
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        })
    );
  });
};

/**
 * Selector type for {@link ParticipantList} component.
 *
 * @public
 */
export type ParticipantListSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  participants: CallParticipantListParticipant[];
  myUserId: string;
};

/**
 * Selects data that drives {@link ParticipantList} component.
 *
 * @public
 */
export const participantListSelector: ParticipantListSelector = createSelector(
  [getIdentifier, getDisplayName, getRemoteParticipants, getIsScreenSharingOn, getIsMuted],
  (
    userId,
    displayName,
    remoteParticipants,
    isScreenSharingOn,
    isMuted
  ): {
    participants: CallParticipantListParticipant[];
    myUserId: string;
  } => {
    const participants = remoteParticipants
      ? convertRemoteParticipantsToParticipantListParticipants(
          updateUserDisplayNamesTrampoline(Object.values(remoteParticipants))
        )
      : [];
    participants.push({
      userId: userId,
      displayName: displayName,
      isScreenSharing: isScreenSharingOn,
      isMuted: isMuted,
      state: 'Connected',
      // Local participant can never remove themselves.
      isRemovable: false
    });
    return {
      participants: participants,
      myUserId: userId
    };
  }
);

const updateUserDisplayNamesTrampoline = (remoteParticipants: RemoteParticipantState[]): RemoteParticipantState[] => {
  /* @conditional-compile-remove(PSTN-calls) */
  return _updateUserDisplayNames(remoteParticipants);
  return remoteParticipants;
};
