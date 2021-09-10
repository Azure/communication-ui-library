// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Call as SdkCall,
  RemoteParticipant as SdkRemoteParticipant,
  RemoteVideoStream as SdkRemoteVideoStream,
  LocalVideoStream as SdkLocalVideoStream,
  IncomingCall as SdkIncomingCall,
  VideoStreamRendererView,
  TransferRequestedEventArgs,
  Transfer
} from '@azure/communication-calling';
import { CommunicationUserIdentifier, PhoneNumberIdentifier } from '@azure/communication-common';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallState,
  RemoteParticipantState as DeclarativeRemoteParticipant,
  RemoteVideoStreamState as DeclarativeRemoteVideoStream,
  LocalVideoStreamState as DeclarativeLocalVideoStream,
  IncomingCallState as DeclarativeIncomingCall,
  VideoStreamRendererViewState as DeclarativeVideoStreamRendererView,
  TransferRequest,
  Transfer as DeclarativeTransfer
} from './CallClientState';

export function convertSdkLocalStreamToDeclarativeLocalStream(
  stream: SdkLocalVideoStream
): DeclarativeLocalVideoStream {
  return {
    source: stream.source,
    mediaStreamType: stream.mediaStreamType,
    view: undefined
  };
}

export function convertSdkRemoteStreamToDeclarativeRemoteStream(
  stream: SdkRemoteVideoStream
): DeclarativeRemoteVideoStream {
  return {
    id: stream.id,
    mediaStreamType: stream.mediaStreamType,
    isAvailable: stream.isAvailable,
    view: undefined
  };
}

export function convertSdkParticipantToDeclarativeParticipant(
  participant: SdkRemoteParticipant
): DeclarativeRemoteParticipant {
  const declarativeVideoStreams = {};
  for (const videoStream of participant.videoStreams) {
    declarativeVideoStreams[videoStream.id] = convertSdkRemoteStreamToDeclarativeRemoteStream(videoStream);
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

// Note at the time of writing only one LocalVideoStream is supported by the SDK.
export function convertSdkCallToDeclarativeCall(call: SdkCall): CallState {
  const declarativeRemoteParticipants = {};
  call.remoteParticipants.forEach((participant: SdkRemoteParticipant) => {
    declarativeRemoteParticipants[toFlatCommunicationIdentifier(participant.identifier)] =
      convertSdkParticipantToDeclarativeParticipant(participant);
  });
  return {
    id: call.id,
    callerInfo: call.callerInfo,
    state: call.state,
    callEndReason: call.callEndReason,
    diagnostics: {
      network: {
        latest: {}
      },
      media: {
        latest: {}
      }
    },
    direction: call.direction,
    isMuted: call.isMuted,
    isScreenSharingOn: call.isScreenSharingOn,
    localVideoStreams: call.localVideoStreams.map(convertSdkLocalStreamToDeclarativeLocalStream),
    remoteParticipants: declarativeRemoteParticipants,
    remoteParticipantsEnded: {},
    recording: { isRecordingActive: false },
    transcription: { isTranscriptionActive: false },
    transfer: { receivedTransferRequests: [], requestedTransfers: [] },
    screenShareRemoteParticipant: undefined,
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

export function convertSdkTransferRequestedToDeclarativeTransferRequested(
  transferRequested: TransferRequestedEventArgs
): TransferRequest {
  return {
    targetParticipant: transferRequested.targetParticipant
  };
}

export function convertSdkTransferToDeclarativeTransfer(
  transfer: Transfer,
  targetParticipant: CommunicationUserIdentifier | PhoneNumberIdentifier,
  transferId: number
): DeclarativeTransfer {
  return {
    id: transferId,
    targetParticipant: targetParticipant,
    state: transfer.state,
    error: transfer.error
  };
}
