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
  const { call, setCall, setCallState, localVideoStream, setScreenShareStream, screenShareStream } = useCallContext();

  useEffect(() => {
    const updateCallState = (): void => {
      setCallState(call?.state ?? 'None');
    };

    setCallState(call?.state ?? 'None');

    call?.on('stateChanged', updateCallState);
    return () => {
      call?.off('stateChanged', updateCallState);
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

    const newCall = callAgent.startCall([receiver], { videoOptions, audioOptions });
    console.log('newCall', newCall);
    setCall(newCall);

    // Listen to Remote Participant screen share stream
    // Should we move this logic to CallProvider ?
    newCall.remoteParticipants.forEach((participant) => {
      participant.on('videoStreamsUpdated', (e) => {
        e.added.forEach((addedStream) => {
          if (addedStream.mediaStreamType === 'Video') return;
          addedStream.on('isAvailableChanged', () => {
            if (addedStream.isAvailable) {
              setScreenShareStream({ stream: addedStream, user: participant });
            } else {
              // Prevents race condition when participant A turns on screen sharing
              // and participant B turns off screen sharing at the same time.
              // Ensures that the screen sharing stream is turned off only when
              // the current screen sharing participant turns it off.
              if (!screenShareStream || screenShareStream?.stream?.id === addedStream.id) {
                setScreenShareStream(undefined);
              }
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
