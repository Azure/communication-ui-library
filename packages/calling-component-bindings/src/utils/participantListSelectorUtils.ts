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
import { RaisedHandState } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(reaction) */
import { ReactionState } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(reaction) */
import { Reaction } from '@internal/react-components';
/* @conditional-compile-remove(reaction) */ /* @conditional-compile-remove(spotlight) */
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
  reaction: undefined | /* @conditional-compile-remove(reaction) */ Reaction,
  spotlight: undefined | /* @conditional-compile-remove(spotlight) */ Spotlight
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
    /* @conditional-compile-remove(reaction) */ reaction,
    /* @conditional-compile-remove(spotlight) */ spotlight
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
    reaction: undefined | /* @conditional-compile-remove(reaction) */ Reaction,
    spotlight: undefined | /* @conditional-compile-remove(spotlight) */ Spotlight
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
      spotlight
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
          receivedOn: reactionState.receivedOn
        }
      : undefined;
  }
);

/* @conditional-compile-remove(spotlight) */
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
