// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClientState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { createSelector } from 'reselect';
import {
  getIdentifier,
  getDisplayName,
  getIsScreenSharingOn,
  getIsMuted,
  CallingBaseSelectorProps,
  getCapabilities
} from './baseSelectors';
import { getRole } from './baseSelectors';
import { isHideAttendeeNamesEnabled } from './baseSelectors';
import { CallParticipantListParticipant } from '@internal/react-components';
import { _convertParticipantState, _updateUserDisplayNames } from './utils/callUtils';
import { memoizedConvertAllremoteParticipants } from './utils/participantListSelectorUtils';
import { memoizedConvertToVideoTileReaction, memoizedSpotlight } from './utils/participantListSelectorUtils';
import { getLocalParticipantRaisedHand } from './baseSelectors';
import { getLocalParticipantReactionState } from './baseSelectors';
import { getSpotlightCallFeature } from './baseSelectors';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { getParticipantCount } from './baseSelectors';
import { isMicrosoftTeamsAppIdentifier, isPhoneNumberIdentifier } from '@azure/communication-common';
import { ParticipantRole, SpotlightedParticipant } from '@azure/communication-calling';
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
          const state = _convertParticipantState(participant);
          const displayName = maskDisplayNameWithRole(
            participant.displayName,
            localUserRole,
            participant.role,
            isHideAttendeeNamesEnabled
          );
          const remoteParticipantReaction = memoizedConvertToVideoTileReaction(participant.reactionState);
          const spotlight = memoizedSpotlight(
            spotlightedParticipants,
            toFlatCommunicationIdentifier(participant.identifier)
          );
          /* @conditional-compile-remove(media-access) */
          const mediaAccess = {
            isAudioPermitted: participant.mediaAccess?.isAudioPermitted,
            isVideoPermitted: participant.mediaAccess?.isVideoPermitted
          };

          return memoizeFn(
            toFlatCommunicationIdentifier(participant.identifier),
            displayName,
            state,
            participant.isMuted,
            isScreenSharing,
            participant.isSpeaking,
            participant.raisedHand,
            localUserCanRemoveOthers,
            remoteParticipantReaction,
            spotlight,
            /* @conditional-compile-remove(media-access) */
            mediaAccess
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
    isHideAttendeeNamesEnabled,
    getLocalParticipantReactionState,
    getSpotlightCallFeature,
    /* @conditional-compile-remove(media-access) */
    getCapabilities
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
    isHideAttendeeNamesEnabled,
    localParticipantReactionState,
    spotlightCallFeature,
    /* @conditional-compile-remove(media-access) */
    capabilities
  ): {
    participants: CallParticipantListParticipant[];
    myUserId: string;
    totalParticipantCount?: number;
  } => {
    const localUserCanRemoveOthers = localUserCanRemoveOthersTrampoline(role);
    const participants = remoteParticipants
      ? convertRemoteParticipantsToParticipantListParticipants(
          _updateUserDisplayNames(Object.values(remoteParticipants)),
          localUserCanRemoveOthers,
          isHideAttendeeNamesEnabled,
          role,
          spotlightCallFeature?.spotlightedParticipants
        )
      : [];
    participants.push({
      userId: userId,
      displayName: displayName,
      isScreenSharing: isScreenSharingOn,
      isMuted: isMuted,
      raisedHand: raisedHand,
      state: 'Connected',
      // Local participant can never remove themselves.
      isRemovable: false,
      reaction: memoizedConvertToVideoTileReaction(localParticipantReactionState),
      spotlight: memoizedSpotlight(spotlightCallFeature?.spotlightedParticipants, userId),
      /* @conditional-compile-remove(media-access) */
      mediaAccess: {
        isAudioPermitted: capabilities ? capabilities.unmuteMic.isPresent : true,
        isVideoPermitted: capabilities ? capabilities.turnVideoOn.isPresent : true
      }
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

const localUserCanRemoveOthersTrampoline = (role?: string): boolean => {
  return role === 'Presenter' || role === 'Unknown' || role === undefined;
};
