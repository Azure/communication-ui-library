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
      participant.on('videoStreamsUpdated', (e) => {
        e.added.forEach((addedStream) => {
          if (addedStream.type === 'Video') return;
          addedStream.on('availabilityChanged', () => {
            if (addedStream.isAvailable) {
              setScreenShareStream({ stream: addedStream, user: participant });
            } else {
              // Prevents race condition when participant A turns on screen sharing
              // and participant B turns off screen sharing at the same time.
              // Ensures that the screen sharing stream is turned off only when
              // the current screen sharing participant turns it off.
              if (screenShareStream?.user.identifier === participant.identifier) {
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
