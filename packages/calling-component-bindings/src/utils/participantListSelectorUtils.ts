// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RemoteParticipantState } from '@azure/communication-calling';
import { SpotlightedParticipant } from '@azure/communication-calling';
import { getIdentifierKind } from '@azure/communication-common';
import { fromFlatCommunicationIdentifier, memoizeFnAll } from '@internal/acs-ui-common';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallParticipantListParticipant } from '@internal/react-components';
import { Spotlight } from '@internal/react-components';
import { RaisedHandState } from '@internal/calling-stateful-client';
import { ReactionState } from '@internal/calling-stateful-client';
import { Reaction, MediaAccess } from '@internal/react-components';
import memoizeOne from 'memoize-one';

const convertRemoteParticipantToParticipantListParticipant = (
  userId: string,
  displayName: string | undefined,
  state: RemoteParticipantState,
  isMuted: boolean,
  isScreenSharing: boolean,
  isSpeaking: boolean,
  raisedHand: RaisedHandState | undefined,
  localUserCanRemoveOthers: boolean,
  reaction: undefined | Reaction,
  spotlight: undefined | Spotlight,
  mediaAccess: MediaAccess
): CallParticipantListParticipant => {
  const identifier = fromFlatCommunicationIdentifier(userId);
  return {
    userId,
    displayName,
    state,
    isMuted,
    isScreenSharing,
    isSpeaking,
    raisedHand,
    // ACS users can not remove Teams users.
    // Removing unknown types of users is undefined.
    isRemovable:
      (getIdentifierKind(identifier).kind === 'communicationUser' ||
        getIdentifierKind(identifier).kind === 'phoneNumber') &&
      localUserCanRemoveOthers,
    reaction,
    spotlight,
    mediaAccess
  };
};

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
    localUserCanRemoveOthers: boolean,
    reaction: undefined | Reaction,
    spotlight: undefined | Spotlight,
    mediaAccess: MediaAccess
  ): CallParticipantListParticipant => {
    return convertRemoteParticipantToParticipantListParticipant(
      userId,
      displayName,
      state,
      isMuted,
      isScreenSharing,
      isSpeaking,
      raisedHand,
      localUserCanRemoveOthers,
      reaction,
      spotlight,
      mediaAccess
    );
  }
);

/**
 * @private
 */
export const memoizedConvertToVideoTileReaction = memoizeOne(
  (reactionState: ReactionState | undefined): Reaction | undefined => {
    return reactionState && reactionState.reactionMessage
      ? {
          reactionType: reactionState.reactionMessage.reactionType,
          receivedOn: reactionState.receivedOn
        }
      : undefined;
  }
);

/**
 * @private
 */
export const memoizedSpotlight = memoizeOne(
  (spotlightedParticipants: SpotlightedParticipant[] | undefined, userId: string): Spotlight | undefined => {
    const spotlightOrder = spotlightedParticipants?.find(
      (spotlightedParticipant) => toFlatCommunicationIdentifier(spotlightedParticipant.identifier) === userId
    );
    return spotlightOrder ? { spotlightedOrderPosition: spotlightOrder.order } : undefined;
  }
);
