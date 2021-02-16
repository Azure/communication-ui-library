// © Microsoft Corporation. All rights reserved.

import { AudioOptions, Call, GroupCallContext, HangupCallOptions, JoinCallOptions } from '@azure/communication-calling';
import { useCallback } from 'react';
import { useCallingContext, useCallContext } from '../providers';

export type UseGroupCallType = {
  leave: (hangupCallOptions: HangupCallOptions) => Promise<void>;
  join: (context: GroupCallContext, joinCallOptions?: JoinCallOptions) => Call;
};

export const useGroupCall = (): UseGroupCallType => {
  const { callAgent } = useCallingContext();
  const { call, localVideoStream, isMicrophoneEnabled } = useCallContext();

  const join = useCallback(
    (context: GroupCallContext, joinCallOptions?: JoinCallOptions): Call => {
      if (!callAgent) {
        throw new Error('CallAgent is invalid');
      }

      const audioOptions: AudioOptions = { muted: !isMicrophoneEnabled };
      const videoOptions = { localVideoStreams: localVideoStream ? [localVideoStream] : undefined };

      return callAgent.join(context, {
        videoOptions: joinCallOptions?.videoOptions ?? videoOptions,
        audioOptions: joinCallOptions?.audioOptions ?? audioOptions
      });
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
