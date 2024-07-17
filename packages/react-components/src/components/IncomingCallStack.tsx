// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(one-to-n-calling) */
import { IncomingCallNotification } from './IncomingCallNotification';
import { Stack } from '@fluentui/react';
import React from 'react';

/**
 * Represents an active incoming call.
 * @beta
 */
export interface ActiveIncomingCall {
  /**
   * Unique identifier for the incoming call.
   */
  id: string;
  /**
   * Information about the caller.
   */
  callerInfo: {
    /**
     * Display name of the caller.
     */
    displayName: string;
  };
  /**
   * Start time of the incoming call.
   */
  startTime: Date;
  /**
   * End time of the incoming call.
   */
  endTime: Date;
}

/**
 * Props for the IncomingCallManager component.
 * @beta
 */
export interface IncomingCallStackProps {
  /**
   * List of incoming calls.
   */
  incomingCalls: ActiveIncomingCall[];
  /**
   * List of incoming calls that have ended.
   */
  removedIncomingCalls: ActiveIncomingCall[];
  /**
   * Handler to accept the incoming call.
   * @param incomingCallId - Id of the incoming call to accept.
   * @param useVideo - Whether to accept with video.
   * @returns void
   */
  onAcceptCall: (incomingCallId: string, useVideo?: boolean) => void;
  /**
   * Handler to reject the incoming call.
   * @param incomingCallId - id of the incoming call to reject
   * @returns - void
   */
  onRejectCall: (incomingCallId: string) => void;
}

/**
 * Wrapper to manage multiple incoming calls
 * @param props - {@link IncomingCallManagerProps}
 * @returns
 * @beta
 */
export const IncomingCallStack = (props: IncomingCallStackProps): JSX.Element => {
  /* @conditional-compile-remove(one-to-n-calling) */
  const { incomingCalls, onAcceptCall, onRejectCall } = props;
  return (
    <Stack style={{ top: 0, position: 'absolute' }}>
      {
        /* @conditional-compile-remove(one-to-n-calling) */ incomingCalls.map((incomingCall) => (
          <IncomingCallNotification
            key={incomingCall.id}
            callerName={incomingCall.callerInfo.displayName}
            onAcceptWithAudio={() => onAcceptCall(incomingCall.id)}
            onAcceptWithVideo={() => onAcceptCall(incomingCall.id, true)}
            onReject={() => onRejectCall(incomingCall.id)}
          ></IncomingCallNotification>
        ))
      }
    </Stack>
  );
};
