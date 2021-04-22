// © Microsoft Corporation. All rights reserved.
import {
  Call as SdkCall,
  RemoteParticipant as SdkRemoteParticipant,
  RemoteVideoStream as SdkRemoteVideoStream,
  LocalVideoStream as SdkLocalVideoStream,
  IncomingCall as SdkIncomingCall,
  VideoStreamRendererView
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
  IncomingCall as DeclarativeIncomingCall,
  VideoStreamRendererView as DeclarativeVideoStreamRendererView
} from './CallClientState';

export function convertSdkLocalStreamToDeclarativeLocalStream(
  stream: SdkLocalVideoStream
): DeclarativeLocalVideoStream {
  return {
    source: stream.source,
    mediaStreamType: stream.mediaStreamType,
    videoStreamRendererView: undefined
  };
}

export function convertSdkRemoteStreamToDeclarativeRemoteStream(
  stream: SdkRemoteVideoStream
): DeclarativeRemoteVideoStream {
  return {
    id: stream.id,
    mediaStreamType: stream.mediaStreamType,
    isAvailable: stream.isAvailable,
    videoStreamRendererView: undefined
  };
}

export function convertSdkParticipantToDeclarativeParticipant(
  participant: SdkRemoteParticipant
): DeclarativeRemoteParticipant {
  const declarativeVideoStreams = new Map<number, DeclarativeRemoteVideoStream>();
  for (const videoStream of participant.videoStreams) {
    declarativeVideoStreams.set(videoStream.id, convertSdkRemoteStreamToDeclarativeRemoteStream(videoStream));
  }
  return {
    identifier: participant.identifier,
    displayName: participant.displayName,
    state: participant.state,
    callEndReason: participant.callEndReason,
    videoStreams: declarativeVideoStreams,
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

// Note at the time of writing only one LocalVideoStream is supported by the SDK.
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
    remoteParticipants: declarativeRemoteParticipants,
    remoteParticipantsEnded: new Map<string, DeclarativeRemoteParticipant>(),
    startTime: new Date(),
    endTime: undefined
  };
}

export function convertSdkIncomingCallToDeclarativeIncomingCall(call: SdkIncomingCall): DeclarativeIncomingCall {
  return {
    id: call.id,
    callerInfo: call.callerInfo,
    startTime: new Date(),
    endTime: undefined
  };
}

export function convertFromSDKToDeclarativeVideoStreamRendererView(
  view: VideoStreamRendererView
): DeclarativeVideoStreamRendererView {
  return {
    scalingMode: view.scalingMode,
    isMirrored: view.isMirrored,
    target: view.target
  };
}
