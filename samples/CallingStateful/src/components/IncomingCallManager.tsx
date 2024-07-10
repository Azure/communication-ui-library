import { IncomingCall, TeamsIncomingCall } from '@azure/communication-calling';
import { IncomingCallNotification } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

/**
 * Props for the IncomingCallManager component.
 */
export interface IncomingCallManagerProps {
  incomingCalls: readonly IncomingCall[] | readonly TeamsIncomingCall[];
  onAcceptCall: (incomingCall: IncomingCall | TeamsIncomingCall, useVideo?: boolean) => void;
  onRejectCall: (incomingCall: IncomingCall | TeamsIncomingCall) => void;
}

/**
 * Wrapper to manage multiple incoming calls
 * @param props
 * @returns
 */
export const IncomingCallManager = (props: IncomingCallManagerProps): JSX.Element => {
  const { incomingCalls, onAcceptCall, onRejectCall } = props;
  return (
    <Stack style={{ top: 0, position: 'absolute' }}>
      {incomingCalls.map((incomingCall) => (
        <IncomingCallNotification
          callerName={incomingCall.callerInfo.displayName}
          onAcceptWithAudio={() => onAcceptCall(incomingCall)}
          onAcceptWithVideo={() => onAcceptCall(incomingCall, true)}
          onReject={() => onRejectCall(incomingCall)}
        ></IncomingCallNotification>
      ))}
    </Stack>
  );
};
