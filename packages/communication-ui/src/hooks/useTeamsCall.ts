// © Microsoft Corporation. All rights reserved.

import { AudioOptions, Call, HangupCallOptions, JoinCallOptions } from '@azure/communication-calling';
import { useCallback } from 'react';
import { useCallingContext, useCallContext } from '../providers';

export type UseTeamsCallType = {
  leave: (hangupCallOptions: HangupCallOptions) => Promise<void>;
  join: (meetingLink: string, joinCallOptions?: JoinCallOptions) => Call;
};

export const useTeamsCall = (): UseTeamsCallType => {
  const { callAgent } = useCallingContext();
  const { call, localVideoStream, isMicrophoneEnabled } = useCallContext();

  const join = useCallback(
    (meetingLink: string, joinCallOptions?: JoinCallOptions): Call => {
      if (!callAgent) {
        throw new Error('CallAgent is invalid');
      }

      const audioOptions: AudioOptions = joinCallOptions?.audioOptions || { muted: !isMicrophoneEnabled };
      const videoOptions = joinCallOptions?.videoOptions || {
        localVideoStreams: localVideoStream ? [localVideoStream] : undefined
      };

      return callAgent.join({ meetingLink: meetingLink }, { videoOptions, audioOptions });
    },
    [callAgent, isMicrophoneEnabled, localVideoStream]
  );

  const leave = useCallback(
    async (hangupCallOptions: HangupCallOptions): Promise<void> => {
      if (!call) {
        throw new Error('Call is invalid');
      }
      await call.hangUp(hangupCallOptions);
    },
    [call]
  );

  return { join, leave };
};
