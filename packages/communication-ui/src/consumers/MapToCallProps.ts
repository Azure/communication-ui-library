// © Microsoft Corporation. All rights reserved.

import { CallState, HangUpOptions } from '@azure/communication-calling';
import { useCallContext, useCallingContext } from '../providers';
import { ParticipantStream } from '../types/ParticipantStream';
import { useOutgoingCall } from '../hooks';

export type CallContainerProps = {
  isCallInitialized: boolean;
  callState: CallState;
  screenShareStream: ParticipantStream | undefined;
  isLocalScreenSharingOn: boolean;
  leaveCall: (hangupCallOptions: HangUpOptions) => Promise<void>;
};

export const MapToOneToOneCallProps = (): CallContainerProps => {
  const { callAgent, deviceManager } = useCallingContext();
  const { callState, screenShareStream, localScreenShareActive } = useCallContext();
  const { endCall } = useOutgoingCall();

  return {
    isCallInitialized: !!(callAgent && deviceManager),
    callState: callState,
    screenShareStream,
    isLocalScreenSharingOn: localScreenShareActive,
    leaveCall: endCall
  };
};
