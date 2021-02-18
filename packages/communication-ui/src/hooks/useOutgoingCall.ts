// © Microsoft Corporation. All rights reserved.

import { AudioOptions, JoinCallOptions, LocalVideoStream } from '@azure/communication-calling';
import { CommunicationUser } from '@azure/communication-signaling';
import { useCallback, useEffect } from 'react';
import { useCallingContext, useCallContext } from '../providers';

export type UseOutgoingCallType = {
  makeCall: (receiver: CommunicationUser, joinCallOptions?: JoinCallOptions) => void;
  endCall: () => Promise<void>;
};

export const useOutgoingCall = (): UseOutgoingCallType => {
  const { callAgent } = useCallingContext();
  const { call, setCall, setCallState, localVideoStream } = useCallContext();

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

  const makeCall = useCallback(
    (receiver: CommunicationUser, joinCallOptions?: JoinCallOptions): void => {
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
    },
    [callAgent, localVideoStream, setCall]
  );

  const endCall = useCallback(async (): Promise<void> => {
    if (!call) {
      throw new Error('Call is invalid');
    }
    await call.hangUp({ forEveryone: true });
  }, [call]);

  return { makeCall, endCall };
};
