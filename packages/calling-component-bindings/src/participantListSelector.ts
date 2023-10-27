// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
import { getRole } from './baseSelectors';
/* @conditional-compile-remove(hide-attendee-name) */
import { isHideAttendeeNamesEnabled } from './baseSelectors';
import { CallParticipantListParticipant } from '@internal/react-components';
import { _isRingingPSTNParticipant, _updateUserDisplayNames } from './utils/callUtils';
import { memoizedConvertAllremoteParticipants } from './utils/participantListSelectorUtils';
/* @conditional-compile-remove(rooms) */
import { memoizedConvertAllremoteParticipantsBetaRelease } from './utils/participantListSelectorUtils';
/* @conditional-compile-remove(raise-hand) */
import { memoizedConvertAllremoteParticipantsBeta } from './utils/participantListSelectorUtils';
/* @conditional-compile-remove(raise-hand) */
import { getLocalParticipantRaisedHand } from './baseSelectors';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { getParticipantCount } from './baseSelectors';
import { isMicrosoftTeamsAppIdentifier, isPhoneNumberIdentifier } from '@azure/communication-common';

const convertRemoteParticipantsToParticipantListParticipants = (
  remoteParticipants: RemoteParticipantState[],
  localUserCanRemoveOthers: boolean,
  /* @conditional-compile-remove(hide-attendee-name) */
  isHideAttendeeNamesEnabled: boolean,
  /* @conditional-compile-remove(hide-attendee-name) */
  localUserRole?: string
): CallParticipantListParticipant[] => {
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  const conversionCallback = (memoizeFn) => {
    return (
      remoteParticipants
        // Filter out MicrosoftBot participants
        .filter((participant: RemoteParticipantState) => {
          return !isMicrosoftTeamsAppIdentifier(participant.identifier);
          return true;
        })
        /**
         * hiding participants who are inLobby, idle, or connecting in ACS clients till we can admit users through ACS clients.
         * phone users will be in the connecting state until they are connected to the call.
         */
        .filter((participant) => {
          return (
            !['InLobby', 'Idle', 'Connecting', 'Disconnected'].includes(participant.state) ||
            isPhoneNumberIdentifier(participant.identifier)
          );
        })
        .map((participant: RemoteParticipantState) => {
          const isScreenSharing = Object.values(participant.videoStreams).some(
            (videoStream) => videoStream.mediaStreamType === 'ScreenSharing' && videoStream.isAvailable
          );
          /**
           * We want to check the participant to see if they are a PSTN participant joining the call
           * and mapping their state to be 'Ringing'
           */
          const state = _isRingingPSTNParticipant(participant);
          let displayName = participant.displayName;
          /* @conditional-compile-remove(hide-attendee-name) */
          if (isHideAttendeeNamesEnabled && localUserRole === 'Attendee' && participant.role === 'Attendee') {
            displayName = 'Attendee';
          }
          return memoizeFn(
            toFlatCommunicationIdentifier(participant.identifier),
            displayName,
            state,
            participant.isMuted,
            isScreenSharing,
            participant.isSpeaking,
            /* @conditional-compile-remove(raise-hand) */
            participant.raisedHand,
            localUserCanRemoveOthers
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
  };
  /* @conditional-compile-remove(raise-hand) */
  return memoizedConvertAllremoteParticipantsBeta(conversionCallback);
  /* @conditional-compile-remove(rooms) */
  return memoizedConvertAllremoteParticipantsBetaRelease(conversionCallback);
  return memoizedConvertAllremoteParticipants(conversionCallback);
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
  /* @conditional-compile-remove(total-participant-count) */
  totalParticipantCount?: number;
};

/**
 * Selects data that drives {@link ParticipantList} component.
 *
 * @public
 */
export const participantListSelector: ParticipantListSelector = createSelector(
  [
    getIdentifier,
    getDisplayName,
    getRemoteParticipants,
    getIsScreenSharingOn,
    getIsMuted,
    /* @conditional-compile-remove(raise-hand) */ getLocalParticipantRaisedHand,
    getRole,
    getParticipantCount,
    isHideAttendeeNamesEnabled
  ],
  (
    userId,
    displayName,
    remoteParticipants,
    isScreenSharingOn,
    isMuted,
    /* @conditional-compile-remove(raise-hand) */
    raisedHand,
    role,
    partitipantCount,
    isHideAttendeeNamesEnabled
  ): {
    participants: CallParticipantListParticipant[];
    myUserId: string;
    totalParticipantCount?: number;
  } => {
    const localUserCanRemoveOthers = localUserCanRemoveOthersTrampoline(role);
    const participants = remoteParticipants
      ? convertRemoteParticipantsToParticipantListParticipants(
          updateUserDisplayNamesTrampoline(Object.values(remoteParticipants)),
          localUserCanRemoveOthers,
          /* @conditional-compile-remove(hide-attendee-name) */
          isHideAttendeeNamesEnabled,
          /* @conditional-compile-remove(hide-attendee-name) */
          role
        )
      : [];
    participants.push({
      userId: userId,
      displayName: displayName,
      isScreenSharing: isScreenSharingOn,
      isMuted: isMuted,
      /* @conditional-compile-remove(raise-hand) */
      raisedHand: raisedHand,
      state: 'Connected',
      // Local participant can never remove themselves.
      isRemovable: false
    });
    /* @conditional-compile-remove(total-participant-count) */
    const totalParticipantCount = partitipantCount;
    return {
      participants: participants,
      myUserId: userId,
      /* @conditional-compile-remove(total-participant-count) */
      totalParticipantCount: totalParticipantCount
    };
  }
);

const updateUserDisplayNamesTrampoline = (remoteParticipants: RemoteParticipantState[]): RemoteParticipantState[] => {
  /* @conditional-compile-remove(PSTN-calls) */
  return _updateUserDisplayNames(remoteParticipants);
  return remoteParticipants;
};

const localUserCanRemoveOthersTrampoline = (role?: string): boolean => {
  /* @conditional-compile-remove(rooms) */
  return role === 'Presenter' || role === 'Unknown' || role === undefined;
  return true;
};
