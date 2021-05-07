// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AudioOptions, Call, GroupLocator, HangUpOptions, JoinCallOptions } from '@azure/communication-calling';
import { useCallback } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';
import { useCallingContext, useCallContext } from '../providers';

export type UseGroupCallType = {
  leave: (hangupCallOptions: HangUpOptions) => Promise<void>;
  join: (context: GroupLocator, joinCallOptions?: JoinCallOptions) => Call;
};

export const useGroupCall = (): UseGroupCallType => {
  const { callAgent } = useCallingContext();
  const { call, setCall, localVideoStream, isMicrophoneEnabled } = useCallContext();

  const join = useCallback(
    (context: GroupLocator, joinCallOptions?: JoinCallOptions): Call => {
      if (!callAgent) {
        throw new CommunicationUiError({
          message: 'CallAgent is undefined',
          code: CommunicationUiErrorCode.CONFIGURATION_ERROR
        });
      }

      const audioOptions: AudioOptions = { muted: !isMicrophoneEnabled };
      const videoOptions = { localVideoStreams: localVideoStream ? [localVideoStream] : undefined };

      try {
        const call = callAgent.join(context, {
          videoOptions: joinCallOptions?.videoOptions ?? videoOptions,
          audioOptions: joinCallOptions?.audioOptions ?? audioOptions
        });
        setCall(call);
        return call;
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error joining call',
          code: CommunicationUiErrorCode.JOIN_CALL_ERROR,
          error: error
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setCall(undefined);
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error hanging up call',
          code: CommunicationUiErrorCode.LEAVE_CALL_ERROR,
          error: error
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [call]
  );

  return { join, leave };
};
