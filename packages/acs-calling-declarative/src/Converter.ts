// © Microsoft Corporation. All rights reserved.
import {
  Call as SdkCall,
  RemoteParticipant as SdkRemoteParticipant,
  RemoteVideoStream as SdkRemoteVideoStream,
  LocalVideoStream as SdkLocalVideoStream,
  IncomingCall as SdkIncomingCall
} from '@azure/communication-calling';
import {
  CommunicationUserKind,
  MicrosoftTeamsUserKind,
  PhoneNumberKind,
  UnknownIdentifierKind
} from '@azure/communication-common';
import {
  Call as DeclarativeCall,
  RemoteParticipant as DeclarativeRemoteParticipant,
  RemoteVideoStream as DeclarativeRemoteVideoStream,
  LocalVideoStream as DeclarativeLocalVideoStream,
  IncomingCall as DeclarativeIncomingCall
} from './CallClientState';

export function convertSdkLocalStreamToDeclarativeLocalStream(
  stream: SdkLocalVideoStream
): DeclarativeLocalVideoStream {
  return {
    source: stream.source,
    mediaStreamType: stream.mediaStreamType
  };
}

export function convertSdkRemoteStreamToDeclarativeRemoteStream(
  stream: SdkRemoteVideoStream
): DeclarativeRemoteVideoStream {
  return {
    id: stream.id,
    mediaStreamType: stream.mediaStreamType,
    isAvailable: stream.isAvailable
  };
}

export function convertSdkParticipantToDeclarativeParticipant(
  participant: SdkRemoteParticipant
): DeclarativeRemoteParticipant {
  return {
    identifier: participant.identifier,
    displayName: participant.displayName,
    state: participant.state,
    callEndReason: participant.callEndReason,
    videoStreams: participant.videoStreams.map(convertSdkRemoteStreamToDeclarativeRemoteStream),
    isMuted: participant.isMuted,
    isSpeaking: participant.isSpeaking
  };
}

/**
 * Generates an identifier string for a given RemoteParticipant.identifier.
 *
 * @param identifier
 */
export function getRemoteParticipantKey(
  identifier: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind
): string {
  let id = '';
  switch (identifier.kind) {
    case 'communicationUser': {
      id = identifier.communicationUserId;
      break;
    }
    case 'phoneNumber': {
      id = identifier.phoneNumber;
      break;
    }
    case 'microsoftTeamsUser': {
      id = identifier.microsoftTeamsUserId;
      break;
    }
    default: {
      id = identifier.id;
    }
  }
  return `${identifier.kind}_${id}`;
}

export function convertSdkCallToDeclarativeCall(call: SdkCall): DeclarativeCall {
  const declarativeRemoteParticipants = new Map<string, DeclarativeRemoteParticipant>();
  call.remoteParticipants.forEach((participant: SdkRemoteParticipant) => {
    declarativeRemoteParticipants.set(
      getRemoteParticipantKey(participant.identifier),
      convertSdkParticipantToDeclarativeParticipant(participant)
    );
  });
  return {
    id: call.id,
    callerInfo: call.callerInfo,
    state: call.state,
    callEndReason: call.callEndReason,
    direction: call.direction,
    isMuted: call.isMuted,
    isScreenSharingOn: call.isScreenSharingOn,
    localVideoStreams: call.localVideoStreams.map(convertSdkLocalStreamToDeclarativeLocalStream),
    remoteParticipants: declarativeRemoteParticipants
  };
}

export function convertSdkIncomingCallToDeclarativeIncomingCall(call: SdkIncomingCall): DeclarativeIncomingCall {
  return {
    id: call.id,
    callerInfo: call.callerInfo,
    callEnded: false
  };
}
