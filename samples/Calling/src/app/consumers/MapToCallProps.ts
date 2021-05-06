// © Microsoft Corporation. All rights reserved.

import { CallState, HangUpOptions } from '@azure/communication-calling';
import { useCallAgent, useGroupCall, useCallContext, useCallingContext } from '@azure/communication-ui';

export type GroupCallContainerProps = {
  callAgentSubscribed: boolean;
  isCallInitialized: boolean;
  callState: CallState;
  isLocalScreenSharingOn: boolean;
  joinCall: (groupId: string) => void;
  leaveCall: (hangupCallOptions: HangUpOptions) => Promise<void>;
};

export const MapToGroupCallProps = (): GroupCallContainerProps => {
  const { callAgent, deviceManager } = useCallingContext();
  const { call, localScreenShareActive } = useCallContext();
  const { join, leave } = useGroupCall();
  // Call useCallAgent to subscribe to events.
  const subscribed = useCallAgent();

  return {
    callAgentSubscribed: subscribed,
    isCallInitialized: !!(callAgent && deviceManager),
    callState: call?.state ?? 'None',
    isLocalScreenSharingOn: localScreenShareActive,
    joinCall: (groupId: string) => {
      !call && join({ groupId: groupId });
    },
    leaveCall: async (hangupCallOptions: HangUpOptions) => {
      await leave(hangupCallOptions);
    }
  };
};
