// © Microsoft Corporation. All rights reserved.

import { CallState, HangupCallOptions } from '@azure/communication-calling';
import { useCallAgent } from '../hooks';
import { useGroupCall } from '../hooks/useGroupCall';
import { useCallContext, useCallingContext } from '../providers';
import { ParticipantStream } from '../types/ParticipantStream';

export type GroupCallContainerProps = {
  isCallInitialized: boolean;
  callState: CallState;
  screenShareStream: ParticipantStream | undefined;
  isLocalScreenSharingOn: boolean;
  leaveCall: (hangupCallOptions: HangupCallOptions) => Promise<void>;
};

export const MapToGroupCallProps = (): GroupCallContainerProps => {
  const { callAgent, deviceManager } = useCallingContext();
  const { call, localScreenShareActive, screenShareStream } = useCallContext();
  const { leave } = useGroupCall();
  // Call useCallAgent to subscribe to events.
  useCallAgent();

  return {
    isCallInitialized: !!(callAgent && deviceManager),
    callState: call?.state ?? 'None',
    screenShareStream,
    isLocalScreenSharingOn: localScreenShareActive,
    leaveCall: async (hangupCallOptions: HangupCallOptions) => {
      await leave(hangupCallOptions);
    }
  };
};
