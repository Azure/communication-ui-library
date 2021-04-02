// © Microsoft Corporation. All rights reserved.
import { Call, CallAgent, RemoteParticipant, RemoteVideoStream } from '@azure/communication-calling';
import { UnsubscribeFunction } from './AzureCommunicationCallingAdapter';
import { CallingStateUpdate, ChangeEmitter } from './StateUpdates';

interface CollectionUpdatedEventPayload<T> {
  added: T[];
  removed: T[];
}

export function subscribeToCallAgent(emitOnChange: ChangeEmitter, callAgent: CallAgent): UnsubscribeFunction {
  const onCallsUpdatedHandler = (event): Promise<void> => emitOnChange(onCallsUpdated(emitOnChange, event));
  callAgent.on('callsUpdated', onCallsUpdatedHandler);
  return () => {
    callAgent.off('callsUpdated', onCallsUpdatedHandler);
  };
}

const subscribeToParticipant = (
  emitOnChange: ChangeEmitter,
  participant: RemoteParticipant,
  call: Call
): UnsubscribeFunction => {
  const onParticipantStateChangedHandler = (): Promise<void> => emitOnChange(onParticipantStateChanged(call));
  const onIsMutedChangedHandler = (): Promise<void> => emitOnChange(onIsMutedChanged(call));
  const onVideoStreamsUpdatedHandler = (event): Promise<void> =>
    emitOnChange(onVideoStreamsUpdated(emitOnChange, participant, event));

  participant.on('participantStateChanged', onParticipantStateChangedHandler);
  participant.on('isMutedChanged', onIsMutedChangedHandler);
  participant.on('videoStreamsUpdated', onVideoStreamsUpdatedHandler);
  return () => {
    participant.off('participantStateChanged', onParticipantStateChangedHandler);
    participant.off('isMutedChanged', onIsMutedChangedHandler);
    participant.off('videoStreamsUpdated', onVideoStreamsUpdatedHandler);
  };
};

const subscribeToCall = (emitOnChange: ChangeEmitter, call: Call): UnsubscribeFunction => {
  const onCallStateChangedHandler = (): Promise<void> => emitOnChange(onCallStateChanged(call));
  const remoteParticipantsUpdatedHandler = (event): Promise<void> =>
    emitOnChange(onRemoteParticipantsUpdated(emitOnChange, call, event));
  const onCallIdChangedHandler = (): Promise<void> => emitOnChange(onCallIdChanged(call));

  call.on('callStateChanged', onCallStateChangedHandler);
  call.on('remoteParticipantsUpdated', remoteParticipantsUpdatedHandler);
  call.on('callIdChanged', onCallIdChangedHandler);
  return () => {
    call.off('callStateChanged', onCallStateChangedHandler);
    call.off('remoteParticipantsUpdated', remoteParticipantsUpdatedHandler);
    call.off('callIdChanged', onCallIdChangedHandler);
  };
};

const subscribeToStream = (
  emitOnChange: ChangeEmitter,
  participant: RemoteParticipant,
  stream: RemoteVideoStream
): UnsubscribeFunction => {
  const onAvailabilityChangedHandler = (): Promise<void> => emitOnChange(onAvailabilityChanged(participant, stream));

  stream.on('availabilityChanged', onAvailabilityChangedHandler);
  return () => {
    stream.off('availabilityChanged', onAvailabilityChangedHandler);
  };
};

const onCallsUpdated = (
  emitOnChange: ChangeEmitter,
  event: CollectionUpdatedEventPayload<Call>
): CallingStateUpdate => {
  return (draft) => {
    for (const addedCall of event.added) {
      // ToDo hardcoded that CallingAdapter only supports one call at a time
      if (draft.call.status === 'Connected' && addedCall.isIncoming) {
        addedCall.reject();
        return;
      }
      draft.call.callId = addedCall.id;
      subscribeToCall(emitOnChange, addedCall);
    }
    for (const removedCall of event.removed) {
      if (draft.call.callId === removedCall.id) {
        draft.call.callId = undefined;
        draft.call.status = 'None';
        draft.call.screenShareStream = undefined;
        draft.call.localScreenShareActive = false;
        draft.call.participants = [];
        draft.call.remoteVideoStreams.clear();
      }
    }
  };
};

const onCallIdChanged = (call: Call): CallingStateUpdate => {
  return (draft) => {
    draft.call.callId = call.id;
  };
};

const refreshParticipants = (call: Call): CallingStateUpdate => {
  return (draft) => {
    draft.call.participants = call.remoteParticipants;
  };
};

const onParticipantStateChanged = refreshParticipants;
const onIsMutedChanged = refreshParticipants;

const onRemoteParticipantsUpdated = (
  emitOnChange: ChangeEmitter,
  call: Call,
  event: CollectionUpdatedEventPayload<RemoteParticipant>
): CallingStateUpdate => {
  return (draft) => {
    for (const addedParticipant of event.added) {
      subscribeToParticipant(emitOnChange, addedParticipant, call);
    }
    draft.call.participants = call.remoteParticipants;
  };
};

const onCallStateChanged = (call: Call): CallingStateUpdate => {
  return (draft) => {
    draft.call.status = call.state;
  };
};

const onScreenShareAvailabilityChanged = (
  participant: RemoteParticipant,
  stream: RemoteVideoStream
): CallingStateUpdate => {
  if (stream.isAvailable) {
    return (draft) => {
      draft.call.screenShareStream = { stream, user: participant };
    };
  }
  return (draft) => {
    const isCurrentScreenShare = draft.call.screenShareStream?.stream?.id === stream.id;
    if (isCurrentScreenShare) {
      draft.call.screenShareStream = undefined;
    }
  };
};

const onVideoAvailabilityChanged = (
  participant: RemoteParticipant,
  stream: RemoteVideoStream
): CallingStateUpdate | undefined => {
  if (stream.isAvailable) {
    // todo render
    return;
  }
};

const onAvailabilityChanged = (
  participant: RemoteParticipant,
  stream: RemoteVideoStream
): CallingStateUpdate | undefined => {
  switch (stream.type) {
    case 'ScreenSharing':
      return onScreenShareAvailabilityChanged(participant, stream);
    case 'Video':
      return onVideoAvailabilityChanged(participant, stream);
  }
};

const onVideoStreamsUpdated = (
  emitOnChange: ChangeEmitter,
  participant: RemoteParticipant,
  event: CollectionUpdatedEventPayload<RemoteVideoStream>
): CallingStateUpdate => {
  return (draft) => {
    const participantId = JSON.stringify(participant.identifier);
    for (const addedStream of event.added) {
      subscribeToStream(emitOnChange, participant, addedStream);
    }
    draft.call.remoteVideoStreams.set(participantId, participant.videoStreams);
  };
};
