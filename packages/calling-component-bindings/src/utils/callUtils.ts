// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DeviceManagerState, RemoteParticipantState, StatefulCallClient } from '@internal/calling-stateful-client';
import { CallState as CallStatus } from '@azure/communication-calling';
/* @conditional-compile-remove(unsupported-browser) */
import { Features, EnvironmentInfo } from '@azure/communication-calling';
import {
  CommunicationIdentifier,
  CommunicationUserIdentifier,
  isCommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier,
  MicrosoftTeamsUserIdentifier,
  PhoneNumberIdentifier,
  UnknownIdentifier
} from '@azure/communication-common';
import { memoizeFnAll, toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

type ParticipantConnectionState =
  | 'Idle'
  | 'Connecting'
  | 'Ringing'
  | 'Connected'
  | 'Hold'
  | 'InLobby'
  | 'EarlyMedia'
  | 'Disconnected';

/**
 * Check if the call state represents being in the call
 *
 * @internal
 */
export const _isInCall = (callStatus?: CallStatus): boolean =>
  !!callStatus && !['None', 'Disconnected', 'Connecting', 'Ringing', 'EarlyMedia'].includes(callStatus);

/**
 * Check if the call state represents being in the lobby or waiting to be admitted.
 *
 * @internal
 */
export const _isInLobbyOrConnecting = (callStatus: CallStatus | undefined): boolean =>
  !!callStatus && ['Connecting', 'Ringing', 'InLobby', 'EarlyMedia'].includes(callStatus);

/**
 * Check if the device manager local video is on when not part of a call
 * i.e. do unparented views exist.
 *
 * @internal
 */
export const _isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
  // handle cases where 'Preview' view is in progress and not necessary completed.
  return deviceManager.unparentedViews.length > 0 && deviceManager.unparentedViews[0].view !== undefined;
};

/**
 * Dispose of all preview views
 * We assume all unparented views are local preview views.
 *
 * @private
 */
export const disposeAllLocalPreviewViews = async (callClient: StatefulCallClient): Promise<void> => {
  const unparentedViews = callClient.getState().deviceManager.unparentedViews;
  for (const view of unparentedViews) {
    await callClient.disposeView(undefined, undefined, view);
  }
};

/**
 * Update the users displayNames based on the type of user they are
 *
 * @internal
 */
export const _updateUserDisplayNames = (participants: RemoteParticipantState[]): RemoteParticipantState[] => {
  if (participants) {
    return memoizedUpdateDisplayName((memoizedFn) => {
      return Object.values(participants).map((p) => {
        const pid = toFlatCommunicationIdentifier(p.identifier);
        return memoizedFn(pid, p);
      });
    });
  } else {
    return [];
  }
};

const memoizedUpdateDisplayName = memoizeFnAll((participantId: string, participant: RemoteParticipantState) => {
  if (isPhoneNumberIdentifier(participant.identifier)) {
    return {
      ...participant,
      displayName: participant.identifier.phoneNumber
    };
  } else {
    return participant;
  }
});

/* @conditional-compile-remove(unsupported-browser) */
/**
 * Check whether the call is in a supported browser
 *
 * @internal
 */
export const _getEnvironmentInfo = async (callClient: StatefulCallClient): Promise<EnvironmentInfo> => {
  const environmentInfo = await callClient.feature(Features.DebugInfo).getEnvironmentInfo();
  return environmentInfo;
};

/**
 * @private
 * A type guard to ensure all participants are acceptable type for Teams call
 */
export const isTeamsCallParticipants = (
  participants: CommunicationIdentifier[]
): participants is (PhoneNumberIdentifier | MicrosoftTeamsUserIdentifier | UnknownIdentifier)[] => {
  return participants.every((p) => !isCommunicationUserIdentifier(p));
};

/**
 * @private
 * A type guard to ensure all participants are acceptable type for ACS call
 */
export const isACSCallParticipants = (
  participants: CommunicationIdentifier[]
): participants is (PhoneNumberIdentifier | CommunicationUserIdentifier | UnknownIdentifier)[] => {
  return participants.every((p) => !isMicrosoftTeamsUserIdentifier(p));
};

/**
 * @private
 * Checks whether the user is a 'Ringing' PSTN user.
 */
export const _isRingingPSTNParticipant = (participant: RemoteParticipantState): ParticipantConnectionState => {
  return participant.identifier.kind === 'phoneNumber' && participant.state === 'Connecting'
    ? 'Ringing'
    : participant.state;
};
