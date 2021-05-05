// © Microsoft Corporation. All rights reserved.

import { AudioOptions, Call, HangUpOptions, JoinCallOptions } from '@azure/communication-calling';
import { useCallback } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';
import { useCallingContext, useCallContext } from '../providers';

export type UseTeamsCallType = {
  leave: (hangupCallOptions: HangUpOptions) => Promise<void>;
  join: (meetingLink: string, joinCallOptions?: JoinCallOptions) => Call;
};

export const useTeamsCall = (): UseTeamsCallType => {
  const { callAgent } = useCallingContext();
  const { call, localVideoStream, isMicrophoneEnabled } = useCallContext();

  const join = useCallback(
    (meetingLink: string, joinCallOptions?: JoinCallOptions): Call => {
      if (!callAgent) {
        throw new CommunicationUiError({
          message: 'CallAgent is undefined',
          code: CommunicationUiErrorCode.CONFIGURATION_ERROR
        });
      }

      const audioOptions: AudioOptions = joinCallOptions?.audioOptions || { muted: !isMicrophoneEnabled };
      const videoOptions = joinCallOptions?.videoOptions || {
        localVideoStreams: localVideoStream ? [localVideoStream] : undefined
      };

      try {
        return callAgent.join({ meetingLink: meetingLink }, { videoOptions, audioOptions });
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error joining call',
          code: CommunicationUiErrorCode.JOIN_CALL_ERROR,
          error: error
        });
      }
    },
    [callAgent, isMicrophoneEnabled, localVideoStream]
  );

  const leave = useCallback(
    async (hangupCallOptions: HangUpOptions): Promise<void> => {
      if (!call) {
        throw new CommunicationUiError({
          message: 'Call is invalid',
          code: CommunicationUiErrorCode.LEAVE_CALL_ERROR
        });
      }
      try {
        await call.hangUp(hangupCallOptions);
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error hanging up call',
          code: CommunicationUiErrorCode.LEAVE_CALL_ERROR,
          error: error
        });
      }
    },
    [call]
  );

  return { join, leave };
};
