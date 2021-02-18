// © Microsoft Corporation. All rights reserved.

import { CallState, HangupCallOptions } from '@azure/communication-calling';
import { useCallAgent } from '../hooks';
import { useCallContext, useCallingContext } from '../providers';
import { ParticipantStream } from '../types/ParticipantStream';
import { useOutgoingCall } from '../hooks';

export type CallContainerProps = {
  isCallInitialized: boolean;
  callState: CallState;
  screenShareStream: ParticipantStream | undefined;
  isLocalScreenSharingOn: boolean;
  leaveCall: (hangupCallOptions: HangupCallOptions) => Promise<void>;
};

export const MapToOneToOneCallProps = (): CallContainerProps => {
  const { callAgent, deviceManager } = useCallingContext();
  const { callState, screenShareStream, localScreenShareActive } = useCallContext();
  const { endCall } = useOutgoingCall();

  // Call useCallAgent to subscribe to events.
  useCallAgent();

  return {
    isCallInitialized: !!(callAgent && deviceManager),
    callState: callState,
    screenShareStream,
    isLocalScreenSharingOn: localScreenShareActive,
    leaveCall: endCall
  };
};
