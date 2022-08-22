// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifier, getIdentifierKind } from '@azure/communication-common';
import { toFlatCommunicationIdentifier, memoizeFnAll } from '@internal/acs-ui-common';
import { CallParticipantListParticipant } from '@internal/react-components';

/**
 * @private
 */
export const memoizedConvertAllremoteParticipants = memoizeFnAll(
  (
    userId: CommunicationIdentifier,
    displayName: string | undefined,
    state: 'Idle' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'InLobby' | 'EarlyMedia' | 'Disconnected',
    isMuted: boolean,
    isScreenSharing: boolean,
    isSpeaking: boolean
  ): CallParticipantListParticipant => {
    return convertRemoteParticipantToParticipantListParticipant(
      userId,
      displayName,
      state,
      isMuted,
      isScreenSharing,
      isSpeaking
    );
  }
);

const convertRemoteParticipantToParticipantListParticipant = (
  userId: CommunicationIdentifier,
  displayName: string | undefined,
  state: 'Idle' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'InLobby' | 'EarlyMedia' | 'Disconnected',
  isMuted: boolean,
  isScreenSharing: boolean,
  isSpeaking: boolean
): CallParticipantListParticipant => {
  return {
    userId: toFlatCommunicationIdentifier(userId),
    displayName,
    state,
    isMuted,
    isScreenSharing,
    isSpeaking,
    // ACS users can not remove Teams users.
    // Removing unknown types of users is undefined.
    isRemovable:
      getIdentifierKind(userId).kind === 'communicationUser' || getIdentifierKind(userId).kind === 'phoneNumber'
  };
};
