// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState, HangUpOptions } from '@azure/communication-calling';
import { ParticipantStream } from '../../../types/ParticipantStream';
import { useOutgoingCall } from '../hooks/useOutgoingCall';
import { useCallingContext } from '../providers/CallingProvider';
import { useCallContext } from '../providers/CallProvider';

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
