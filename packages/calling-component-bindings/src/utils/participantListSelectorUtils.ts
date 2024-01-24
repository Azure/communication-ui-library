// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RemoteParticipantState } from '@azure/communication-calling';
/* @conditional-compile-remove(spotlight) */
import { SpotlightedParticipant } from '@azure/communication-calling';
import { getIdentifierKind } from '@azure/communication-common';
import { fromFlatCommunicationIdentifier, memoizeFnAll } from '@internal/acs-ui-common';
/* @conditional-compile-remove(spotlight) */
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallParticipantListParticipant } from '@internal/react-components';
/* @conditional-compile-remove(spotlight) */
import { Spotlight } from '@internal/react-components';
/* @conditional-compile-remove(raise-hand) */
import { RaisedHandState } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(reaction) */
import { ReactionState } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(reaction) */
import { Reaction } from '@internal/react-components';
/* @conditional-compile-remove(reaction) */
import memoizeOne from 'memoize-one';

/**
 * @private
 */
export const memoizedConvertAllremoteParticipants = memoizeFnAll(
  (
    userId: string,
    displayName: string | undefined,
    state: RemoteParticipantState,
    isMuted: boolean,
    isScreenSharing: boolean,
    isSpeaking: boolean,
    raisedHand: RaisedHandState | undefined,
    localUserCanRemoveOthers: boolean
  ): CallParticipantListParticipant => {
    return convertRemoteParticipantToParticipantListParticipant(
      userId,
      displayName,
      state,
      isMuted,
      isScreenSharing,
      isSpeaking,
      raisedHand,
      localUserCanRemoveOthers
    );
  }
);

const convertRemoteParticipantToParticipantListParticipant = (
  userId: string,
  displayName: string | undefined,
  state: RemoteParticipantState,
  isMuted: boolean,
  isScreenSharing: boolean,
  isSpeaking: boolean,
  raisedHand: RaisedHandState | undefined,
  localUserCanRemoveOthers: boolean
): CallParticipantListParticipant => {
  const identifier = fromFlatCommunicationIdentifier(userId);
  return {
    userId,
    displayName,
    state,
    isMuted,
    isScreenSharing,
    isSpeaking,
    // ACS users can not remove Teams users.
    // Removing unknown types of users is undefined.
    isRemovable:
      (getIdentifierKind(identifier).kind === 'communicationUser' ||
        getIdentifierKind(identifier).kind === 'phoneNumber') &&
      localUserCanRemoveOthers
  };
};

/* @conditional-compile-remove(rooms) */
/**
 * @private
 */
export const memoizedConvertAllremoteParticipantsBetaRelease = memoizeFnAll(
  (
    userId: string,
    displayName: string | undefined,
    state: RemoteParticipantState,
    isMuted: boolean,
    isScreenSharing: boolean,
    isSpeaking: boolean,
    raisedHand: RaisedHandState | undefined,
    localUserCanRemoveOthers: boolean
  ): CallParticipantListParticipant => {
    return convertRemoteParticipantToParticipantListParticipantBetaRelease(
      userId,
      displayName,
      state,
      isMuted,
      isScreenSharing,
      isSpeaking,
      raisedHand,
      localUserCanRemoveOthers
    );
  }
);

/* @conditional-compile-remove(reaction) */
/**
 * @private
 */
export const memoizedConvertAllremoteParticipantsBeta = memoizeFnAll(
  (
    userId: string,
    displayName: string | undefined,
    state: RemoteParticipantState,
    isMuted: boolean,
    isScreenSharing: boolean,
    isSpeaking: boolean,
    raisedHand: RaisedHandState | undefined,
    localUserCanRemoveOthers: boolean,
    reaction: Reaction | undefined,
    isSpotlighted: Spotlight | undefined
  ): CallParticipantListParticipant => {
    return convertRemoteParticipantToParticipantListParticipantBeta(
      userId,
      displayName,
      state,
      isMuted,
      isScreenSharing,
      isSpeaking,
      raisedHand,
      localUserCanRemoveOthers,
      reaction,
      isSpotlighted
    );
  }
);

/* @conditional-compile-remove(reaction) */
/**
 * @private
 */
export const memoizedConvertToVideoTileReaction = memoizeOne(
  (reactionState: ReactionState | undefined): Reaction | undefined => {
    return reactionState && reactionState.reactionMessage
      ? {
          reactionType: reactionState.reactionMessage.reactionType,
          receivedAt: reactionState.receivedAt
        }
      : undefined;
  }
);

/* @conditional-compile-remove(reaction) */
/**
 * @private
 */
export const memoizedSpotlight = memoizeOne(
  (spotlightedParticipants: SpotlightedParticipant[] | undefined, userId: string): Spotlight | undefined => {
    const spotlightOrder = spotlightedParticipants?.find(
      (spotlightedParticipant) => toFlatCommunicationIdentifier(spotlightedParticipant.identifier) === userId
    );
    return spotlightOrder ? { spotlightOrderPosition: spotlightOrder.order } : undefined;
  }
);

/* @conditional-compile-remove(rooms) */
const convertRemoteParticipantToParticipantListParticipantBetaRelease = (
  userId: string,
  displayName: string | undefined,
  state: RemoteParticipantState,
  isMuted: boolean,
  isScreenSharing: boolean,
  isSpeaking: boolean,
  raisedHand: RaisedHandState | undefined,
  localUserCanRemoveOthers: boolean
): CallParticipantListParticipant => {
  return {
    ...convertRemoteParticipantToParticipantListParticipant(
      userId,
      displayName,
      state,
      isMuted,
      isScreenSharing,
      isSpeaking,
      raisedHand,
      localUserCanRemoveOthers
    )
  };
};

/* @conditional-compile-remove(reaction) */
const convertRemoteParticipantToParticipantListParticipantBeta = (
  userId: string,
  displayName: string | undefined,
  state: RemoteParticipantState,
  isMuted: boolean,
  isScreenSharing: boolean,
  isSpeaking: boolean,
  raisedHand: RaisedHandState | undefined,
  localUserCanRemoveOthers: boolean,
  reaction: Reaction | undefined,
  isSpotlighted: Spotlight | undefined
): CallParticipantListParticipant => {
  return {
    ...convertRemoteParticipantToParticipantListParticipant(
      userId,
      displayName,
      state,
      isMuted,
      isScreenSharing,
      isSpeaking,
      raisedHand,
      localUserCanRemoveOthers
    ),
    reaction,
    isSpotlighted
  };
};
