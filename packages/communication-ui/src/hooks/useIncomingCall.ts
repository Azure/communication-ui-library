// © Microsoft Corporation. All rights reserved.

import { AcceptCallOptions, Call } from '@azure/communication-calling';
import { useCallback } from 'react';
import { useCallContext } from '../providers';

export type UseIncomingCallType = {
  accept: (incomingCall: Call, acceptCallOptions?: AcceptCallOptions) => Promise<void>;
  reject: (incomingCall: Call) => Promise<void>;
};

export const useIncomingCall = (): UseIncomingCallType => {
  const { setCall, localVideoStream } = useCallContext();

  /** Accept an incoming calls and set it as the active call. */
  const accept = useCallback(
    async (incomingCall: Call, acceptCallOptions?: AcceptCallOptions): Promise<void> => {
      if (!incomingCall) {
        throw new Error('incomingCall is null or undefined');
      }

      const videoOptions = acceptCallOptions?.videoOptions || {
        localVideoStreams: localVideoStream ? [localVideoStream] : undefined
      };

      await incomingCall.accept({ videoOptions });
      setCall(incomingCall);
    },
    [localVideoStream, setCall]
  );

  /** Reject an incoming call and remove it from `incomingCalls`. */
  const reject = useCallback(async (incomingCall: Call): Promise<void> => {
    if (!incomingCall) {
      throw new Error('incomingCall is null or undefined');
    }
    await incomingCall.reject();
  }, []);

  return { accept, reject };
};
