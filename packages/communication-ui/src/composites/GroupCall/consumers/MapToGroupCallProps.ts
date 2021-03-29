// © Microsoft Corporation. All rights reserved.

import { CallState, HangupCallOptions } from '@azure/communication-calling';
import { useCallAgent } from '../../../hooks';
import { useGroupCall } from '../../../hooks/useGroupCall';
import { useCallContext, useCallingContext } from '../../../providers';

export type GroupCallContainerProps = {
  isCallInitialized: boolean;
  callState: CallState;
  isLocalScreenSharingOn: boolean;
  leaveCall: (hangupCallOptions: HangupCallOptions) => Promise<void>;
};

export const MapToGroupCallProps = (): GroupCallContainerProps => {
  const { callAgent, deviceManager } = useCallingContext();
  const { call, localScreenShareActive } = useCallContext();
  const callContext = useCallContext();
  const { leave } = useGroupCall();
  // Call useCallAgent to subscribe to events.
  useCallAgent(callContext);
  return {
    isCallInitialized: !!(callAgent && deviceManager),
    callState: call?.state ?? 'None',
    isLocalScreenSharingOn: localScreenShareActive,
    leaveCall: async (hangupCallOptions: HangupCallOptions) => {
      await leave(hangupCallOptions);
    }
  };
};
