// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallNotification } from './IncomingCallNotification';
import { IncomingCallNotificationStyles, IncomingCallNotificationStrings } from './IncomingCallNotification';
import { Stack } from '@fluentui/react';
import React from 'react';

/**
 * Represents an active incoming call.
 * @public
 */
export interface IncomingCallStackCall {
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
    displayName?: string;
  };
  /**
   * Whether or not the call is a voip capable call.
   */
  videoAvailable: boolean;
}
/**
 * Props for the IncomingCallManager component.
 * @public
 */
export interface IncomingCallStackProps {
  /**
   * List of incoming calls.
   */
  activeIncomingCalls: IncomingCallStackCall[];
  /**
   * List of incoming calls that have ended.
   */
  removedIncomingCalls: IncomingCallStackCall[];
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
  /**
   * Styles for the incoming call notifications.
   */
  styles?: IncomingCallNotificationStyles;
  /**
   * Strings for the incoming call notifications.
   */
  strings?: IncomingCallNotificationStrings;
  /**
   * Tab index for the incoming Call stack, this will set the tab order of the
   * incoming call notifications in your application.
   */
  tabIndex?: number;
}

/**
 * Wrapper to manage multiple incoming calls
 * @param props - {@link IncomingCallManagerProps}
 * @returns
 * @public
 */
export const IncomingCallStack = (props: IncomingCallStackProps): JSX.Element => {
  const { activeIncomingCalls, removedIncomingCalls, onAcceptCall, onRejectCall, styles, strings, tabIndex } = props;
  return (
    <Stack tokens={{ childrenGap: '0.25rem' }} role={'group'} tabIndex={tabIndex}>
      {activeIncomingCalls
        .filter((incomingCall) => !removedIncomingCalls.some((call) => call.id === incomingCall.id))
        .map((incomingCall) => {
          return (
            <IncomingCallNotification
              key={incomingCall.id}
              callerName={incomingCall.callerInfo.displayName}
              onAcceptWithAudio={() => onAcceptCall(incomingCall.id)}
              onAcceptWithVideo={() => onAcceptCall(incomingCall.id, true)}
              onReject={() => onRejectCall(incomingCall.id)}
              onDismiss={() => onRejectCall(incomingCall.id)}
              styles={styles}
              strings={strings}
              acceptOptions={{ showAcceptWithVideo: incomingCall.videoAvailable }}
            ></IncomingCallNotification>
          );
        })}
    </Stack>
  );
};
