// © Microsoft Corporation. All rights reserved.

import { AudioOptions, JoinCallOptions, LocalVideoStream } from '@azure/communication-calling';
import { CommunicationUser } from '@azure/communication-signaling';
import { useEffect } from 'react';
import { useCallingContext, useCallContext } from '../providers';

export type UseOutgoingCallType = {
  makeCall: (receiver: CommunicationUser, joinCallOptions?: JoinCallOptions) => void;
  endCall: () => Promise<void>;
};

export const useOutgoingCall = (): UseOutgoingCallType => {
  const { callAgent } = useCallingContext();
  const { call, setCall, setCallState, localVideoStream, setScreenShareStream } = useCallContext();

  useEffect(() => {
    const updateCallState = (): void => {
      setCallState(call?.state ?? 'None');
    };

    setCallState(call?.state ?? 'None');

    call?.on('callStateChanged', updateCallState);
    return () => {
      call?.off('callStateChanged', updateCallState);
    };
  }, [call, setCallState]);

  const makeCall = (receiver: CommunicationUser, joinCallOptions?: JoinCallOptions): void => {
    if (!callAgent) {
      throw new Error('CallAgent is invalid');
    }

    // Use provided audio options or default to unmuted for a direct call being made
    const audioOptions: AudioOptions = joinCallOptions?.audioOptions || { muted: false };

    // Use provided video options or grab options set in the react context
    let videoOptions = joinCallOptions?.videoOptions;
    if (!videoOptions && localVideoStream) {
      videoOptions = {
        localVideoStreams: [localVideoStream as LocalVideoStream]
      };
    }

    const newCall = callAgent.call([receiver], { videoOptions, audioOptions });
    setCall(newCall);

    // Listen to Remote Participant screen share stream
    // Should we move this logic to CallProvider ?
    newCall.remoteParticipants.forEach((participant) => {
      newCall.remoteParticipants[0].on('videoStreamsUpdated', (e) => {
        e.added.forEach((addedStream) => {
          if (addedStream.type === 'Video') return;
          addedStream.on('availabilityChanged', () => {
            if (addedStream.isAvailable) {
              setScreenShareStream({ stream: addedStream, user: participant });
            } else {
              setScreenShareStream(undefined);
            }
          });
          if (addedStream.isAvailable) {
            setScreenShareStream({ stream: addedStream, user: participant });
          }
        });
      });
    });
  };

  const endCall = async (): Promise<void> => {
    if (!call) {
      throw new Error('Call is invalid');
    }
    await call.hangUp({ forEveryone: true });
  };

  return { makeCall, endCall };
};
