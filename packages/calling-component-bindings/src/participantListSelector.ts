// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClientState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { createSelector } from 'reselect';
import {
  getIdentifier,
  getDisplayName,
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
/* @conditional-compile-remove(spotlight) */
import { memoizedConvertAllremoteParticipantsBetaSpotlight } from './utils/participantListSelectorUtils';
/* @conditional-compile-remove(reaction) */
import { memoizedConvertToVideoTileReaction } from './utils/participantListSelectorUtils';
/* @conditional-compile-remove(reaction) */
import { memoizedConvertAllremoteParticipantsBeta } from './utils/participantListSelectorUtils';
/* @conditional-compile-remove(spotlight) */
import { memoizedSpotlight } from './utils/participantListSelectorUtils';
import { getLocalParticipantRaisedHand } from './baseSelectors';
/* @conditional-compile-remove(reaction) */
import { getLocalParticipantReactionState } from './baseSelectors';
/* @conditional-compile-remove(spotlight) */
import { getSpotlightCallFeature } from './baseSelectors';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { getParticipantCount } from './baseSelectors';
import { isMicrosoftTeamsAppIdentifier, isPhoneNumberIdentifier } from '@azure/communication-common';
import { ParticipantRole, SpotlightedParticipant } from '@azure/communication-calling';
/* @conditional-compile-remove(hide-attendee-name) */
import { maskDisplayNameWithRole } from './utils/callUtils';
import { getRemoteParticipantsExcludingConsumers } from './getRemoteParticipantsExcludingConsumers';

const convertRemoteParticipantsToParticipantListParticipants = (
  remoteParticipants: RemoteParticipantState[],
  localUserCanRemoveOthers: boolean,
  isHideAttendeeNamesEnabled?: boolean,
  localUserRole?: ParticipantRole,
  spotlightedParticipants?: SpotlightedParticipant[]
): CallParticipantListParticipant[] => {
  const conversionCallback = (
    memoizeFn: (...args: any[]) => CallParticipantListParticipant
  ): CallParticipantListParticipant[] => {
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
          displayName = maskDisplayNameWithRole(
            displayName,
            localUserRole,
            participant.role,
            isHideAttendeeNamesEnabled
          );
          /* @conditional-compile-remove(reaction) */
          const remoteParticipantReaction = memoizedConvertToVideoTileReaction(participant.reactionState);
          /* @conditional-compile-remove(spotlight) */
          const spotlight = memoizedSpotlight(
            spotlightedParticipants,
            toFlatCommunicationIdentifier(participant.identifier)
          );
          return memoizeFn(
            toFlatCommunicationIdentifier(participant.identifier),
            displayName,
            state,
            participant.isMuted,
            isScreenSharing,
            participant.isSpeaking,
            participant.raisedHand,
            localUserCanRemoveOthers,
            /* @conditional-compile-remove(reaction) */
            remoteParticipantReaction,
            /* @conditional-compile-remove(spotlight) */
            spotlight
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
  /* @conditional-compile-remove(spotlight) */
  return memoizedConvertAllremoteParticipantsBetaSpotlight(conversionCallback);
  /* @conditional-compile-remove(reaction) */
  return memoizedConvertAllremoteParticipantsBeta(conversionCallback);
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
    getRemoteParticipantsExcludingConsumers,
    getIsScreenSharingOn,
    getIsMuted,
    getLocalParticipantRaisedHand,
    getRole,
    getParticipantCount,
    /* @conditional-compile-remove(hide-attendee-name) */
    isHideAttendeeNamesEnabled,
    /* @conditional-compile-remove(reaction) */
    getLocalParticipantReactionState,
    /* @conditional-compile-remove(spotlight) */
    getSpotlightCallFeature
  ],
  (
    userId,
    displayName,
    remoteParticipants,
    isScreenSharingOn,
    isMuted,
    raisedHand,
    role,
    partitipantCount,
    /* @conditional-compile-remove(hide-attendee-name) */
    isHideAttendeeNamesEnabled,
    /* @conditional-compile-remove(reaction) */
    localParticipantReactionState,
    /* @conditional-compile-remove(spotlight) */
    spotlightCallFeature
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
          undefined || /* @conditional-compile-remove(hide-attendee-name) */ isHideAttendeeNamesEnabled,
          undefined || /* @conditional-compile-remove(hide-attendee-name) */ role,
          /* @conditional-compile-remove(spotlight) */
          spotlightCallFeature?.spotlightedParticipants
        )
      : [];
    /* @conditional-compile-remove(reaction) */
    const localParticipantReaction = memoizedConvertToVideoTileReaction(localParticipantReactionState);
    participants.push({
      userId: userId,
      displayName: displayName,
      isScreenSharing: isScreenSharingOn,
      isMuted: isMuted,
      raisedHand: raisedHand,
      state: 'Connected',
      // Local participant can never remove themselves.
      isRemovable: false,
      /* @conditional-compile-remove(reaction) */
      reaction: localParticipantReaction,
      /* @conditional-compile-remove(spotlight) */
      spotlight: memoizedSpotlight(spotlightCallFeature?.spotlightedParticipants, userId)
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
  return role === 'Presenter' || role === 'Unknown' || role === undefined;
};
