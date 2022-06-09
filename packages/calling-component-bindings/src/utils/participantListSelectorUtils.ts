// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifier, getIdentifierKind } from '@azure/communication-common';
import { memoizeFnAll, toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallParticipantListParticipant } from '@internal/react-components';

/**
 * @private
 */
export const memoizedConvertAllremoteParticipants = memoizeFnAll(
  (
    userIdentifier: CommunicationIdentifier,
    displayName: string | undefined,
    state: 'Idle' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'InLobby' | 'EarlyMedia' | 'Disconnected',
    isMuted: boolean,
    isScreenSharing: boolean,
    isSpeaking: boolean
  ): CallParticipantListParticipant => {
    return convertRemoteParticipantToParticipantListParticipant(
      userIdentifier,
      displayName,
      state,
      isMuted,
      isScreenSharing,
      isSpeaking
    );
  }
);

const convertRemoteParticipantToParticipantListParticipant = (
  userIdentifier: CommunicationIdentifier,
  displayName: string | undefined,
  state: 'Idle' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'InLobby' | 'EarlyMedia' | 'Disconnected',
  isMuted: boolean,
  isScreenSharing: boolean,
  isSpeaking: boolean
): CallParticipantListParticipant => {
  return {
    userId: toFlatCommunicationIdentifier(userIdentifier),
    displayName,
    state,
    isMuted,
    isScreenSharing,
    isSpeaking,
    // ACS users can not remove Teams users.
    // Removing unknown types of users is undefined.
    isRemovable:
      getIdentifierKind(userIdentifier).kind === 'communicationUser' ||
      getIdentifierKind(userIdentifier).kind === 'phoneNumber'
  };
};
