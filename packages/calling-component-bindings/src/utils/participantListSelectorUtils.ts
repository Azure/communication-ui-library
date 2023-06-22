// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RemoteParticipantState } from '@azure/communication-calling';
import { getIdentifierKind } from '@azure/communication-common';
import { fromFlatCommunicationIdentifier, memoizeFnAll } from '@internal/acs-ui-common';
import { CallParticipantListParticipant } from '@internal/react-components';
/* @conditional-compile-remove(raise-hands) */
import { RaisedHand } from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { Role } from '@internal/react-components';

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
    /* @conditional-compile-remove(raise-hands) */
    raisedHand: RaisedHand | undefined
  ): CallParticipantListParticipant => {
    return convertRemoteParticipantToParticipantListParticipant(
      userId,
      displayName,
      state,
      isMuted,
      isScreenSharing,
      isSpeaking,
      /* @conditional-compile-remove(raise-hands) */
      raisedHand
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
  /* @conditional-compile-remove(raise-hands) */
  raisedHand: RaisedHand | undefined
): CallParticipantListParticipant => {
  const identifier = fromFlatCommunicationIdentifier(userId);
  return {
    userId,
    displayName,
    state,
    isMuted,
    isScreenSharing,
    isSpeaking,
    /* @conditional-compile-remove(raise-hands) */
    raisedHand,
    // ACS users can not remove Teams users.
    // Removing unknown types of users is undefined.
    isRemovable:
      getIdentifierKind(identifier).kind === 'communicationUser' || getIdentifierKind(identifier).kind === 'phoneNumber'
  };
};

/* @conditional-compile-remove(rooms) */
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
    /* @conditional-compile-remove(raise-hands) */
    raisedHand: RaisedHand | undefined,
    role: Role
  ): CallParticipantListParticipant => {
    return convertRemoteParticipantToParticipantListParticipantBeta(
      userId,
      displayName,
      state,
      isMuted,
      isScreenSharing,
      isSpeaking,
      /* @conditional-compile-remove(raise-hands) */
      raisedHand,
      role
    );
  }
);

/* @conditional-compile-remove(rooms) */
const convertRemoteParticipantToParticipantListParticipantBeta = (
  userId: string,
  displayName: string | undefined,
  state: RemoteParticipantState,
  isMuted: boolean,
  isScreenSharing: boolean,
  isSpeaking: boolean,
  /* @conditional-compile-remove(raise-hands) */
  raisedHand: RaisedHand | undefined,
  role: Role
): CallParticipantListParticipant => {
  return {
    ...convertRemoteParticipantToParticipantListParticipant(
      userId,
      displayName,
      state,
      isMuted,
      isScreenSharing,
      isSpeaking,
      /* @conditional-compile-remove(raise-hands) */
      raisedHand
    ),
    role
  };
};
