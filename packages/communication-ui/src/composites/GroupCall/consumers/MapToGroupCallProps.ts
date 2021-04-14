// © Microsoft Corporation. All rights reserved.

import { CallState, HangUpOptions } from '@azure/communication-calling';
import { useCallAgent } from '../../../hooks';
import { useGroupCall } from '../../../hooks/useGroupCall';
import { useCallContext, useCallingContext } from '../../../providers';

export type GroupCallContainerProps = {
  isCallInitialized: boolean;
  callState: CallState;
  isLocalScreenSharingOn: boolean;
  leaveCall: (hangupCallOptions: HangUpOptions) => Promise<void>;
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
    leaveCall: async (hangupCallOptions: HangUpOptions) => {
      await leave(hangupCallOptions);
    }
  };
};
