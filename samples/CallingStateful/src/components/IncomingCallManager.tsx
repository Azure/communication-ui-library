// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCall, TeamsIncomingCall } from '@azure/communication-calling';
/* @conditional-compile-remove(one-to-n-calling) */
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
  /* @conditional-compile-remove(one-to-n-calling) */
  const { incomingCalls, onAcceptCall, onRejectCall } = props;
  return (
    <Stack style={{ top: 0, right: 0, position: 'absolute' }}>
      {
        /* @conditional-compile-remove(one-to-n-calling) */ incomingCalls.map((incomingCall) => (
          <IncomingCallNotification
            key={incomingCall.id}
            callerName={incomingCall.callerInfo.displayName}
            onAcceptWithAudio={() => onAcceptCall(incomingCall)}
            onAcceptWithVideo={() => onAcceptCall(incomingCall, true)}
            onReject={() => onRejectCall(incomingCall)}
          ></IncomingCallNotification>
        ))
      }
    </Stack>
  );
};
