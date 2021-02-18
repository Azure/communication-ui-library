// © Microsoft Corporation. All rights reserved.

import { CallState, HangupCallOptions } from '@azure/communication-calling';
import { useCallAgent, useGroupCall, useCallContext, useCallingContext } from '@azure/communication-ui';

export type GroupCallContainerProps = {
  isCallInitialized: boolean;
  callState: CallState;
  isLocalScreenSharingOn: boolean;
  leaveCall: (hangupCallOptions: HangupCallOptions) => Promise<void>;
};

export const MapToGroupCallProps = (): GroupCallContainerProps => {
  const { callAgent, deviceManager } = useCallingContext();
  const { call, localScreenShareActive } = useCallContext();
  const { leave } = useGroupCall();
  // Call useCallAgent to subscribe to events.
  useCallAgent();

  return {
    isCallInitialized: !!(callAgent && deviceManager),
    callState: call?.state ?? 'None',
    isLocalScreenSharingOn: localScreenShareActive,
    leaveCall: async (hangupCallOptions: HangupCallOptions) => {
      await leave(hangupCallOptions);
    }
  };
};
