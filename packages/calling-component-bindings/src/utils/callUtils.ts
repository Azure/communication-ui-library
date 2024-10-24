// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CallClientState,
  CallState,
  DeviceManagerState,
  RemoteParticipantState,
  StatefulCallClient
} from '@internal/calling-stateful-client';
import {
  CallState as CallStatus,
  EnvironmentInfo,
  Features,
  LocalVideoStream,
  ParticipantRole
} from '@azure/communication-calling';
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

/**
 * Type for connmection state
 *
 * @internal
 */
export type ParticipantConnectionState =
  | 'Idle'
  | 'Connecting'
  | 'Ringing'
  | 'Connected'
  | 'Hold'
  | 'InLobby'
  | 'EarlyMedia'
  | 'Disconnected'
  | 'Reconnecting';

/**
 * Check if the call state represents being in the call
 *
 * @internal
 */
export const _isInCall = (callStatus?: CallStatus): boolean =>
  !!callStatus &&
  !['None', 'Disconnected', 'Connecting', 'Ringing', 'EarlyMedia', 'Disconnecting'].includes(callStatus);

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
  return deviceManager.unparentedViews[0]?.view !== undefined;
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
 * Checks whether the user is a 'Ringing' PSTN user or in a 'Connecting' state.
 */
export const _convertParticipantState = (participant: RemoteParticipantState): ParticipantConnectionState => {
  /* @conditional-compile-remove(remote-ufd) */
  if (
    participant.diagnostics &&
    participant.diagnostics['serverConnection'] &&
    participant.diagnostics['serverConnection']?.value === false
  ) {
    return 'Reconnecting';
  }
  return isPhoneNumberIdentifier(participant.identifier) && participant.state === 'Connecting'
    ? 'Ringing'
    : participant.state;
};

/**
 * @private
 * Changes the display name of the participant based on the local and remote user's role.
 */
export const maskDisplayNameWithRole = (
  displayName: string | undefined,
  localUserRole?: ParticipantRole,
  participantRole?: ParticipantRole,
  isHideAttendeeNamesEnabled?: boolean
): string | undefined => {
  let maskedDisplayName = displayName;
  if (isHideAttendeeNamesEnabled && participantRole && participantRole === 'Attendee') {
    if (localUserRole && localUserRole === 'Attendee') {
      maskedDisplayName = '{AttendeeRole}';
    }
    if (
      localUserRole &&
      (localUserRole === 'Presenter' || localUserRole === 'Co-organizer' || localUserRole === 'Organizer')
    ) {
      maskedDisplayName = `{AttendeeRole}(${displayName})`;
    }
  }
  return maskedDisplayName;
};

/**
 * Helper to create a local video stream from the selected camera.
 * @private
 */
export const createLocalVideoStream = async (callClient: StatefulCallClient): Promise<LocalVideoStream | undefined> => {
  const camera = await callClient?.getState().deviceManager.selectedCamera;
  if (camera) {
    return new LocalVideoStream(camera);
  }
  return undefined;
};

/**
 * Get call state if existing, if not and the call not exists in ended record return undefined, if it never exists, throw an error.
 * @private
 */
export const getCallStateIfExist = (state: CallClientState, callId: string): CallState | undefined => {
  if (!state.calls[callId]) {
    // If call has ended, we don't need to throw an error.
    if (state.callsEnded[callId]) {
      return undefined;
    }
    throw new Error(`Call Not Found: ${callId}`);
  }
  return state.calls[callId];
};
