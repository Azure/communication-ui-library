// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(one-to-n-calling) */
import { IncomingCallNotification } from './IncomingCallNotification';
import { IStackStyles, Stack } from '@fluentui/react';
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
  endTime?: Date;
}

/**
 * Positional props for {@link IncomingCallStack} component.
 * @beta
 */
export type IncomingCallStackPosition =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'topCenter'
  | 'bottomCenter';

/**
 * Props for the IncomingCallManager component.
 * @beta
 */
export interface IncomingCallStackProps {
  /**
   * List of incoming calls.
   */
  activeIncomingCalls: ActiveIncomingCall[];
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
  /**
   * Prop to determine the position of the notification stack within their parent
   */
  position?: IncomingCallStackPosition;
}

/**
 * Wrapper to manage multiple incoming calls
 * @param props - {@link IncomingCallManagerProps}
 * @returns
 * @beta
 */
export const IncomingCallStack = (props: IncomingCallStackProps): JSX.Element => {
  /* @conditional-compile-remove(one-to-n-calling) */
  const { activeIncomingCalls, removedIncomingCalls, onAcceptCall, onRejectCall, position } = props;
  return (
    <Stack styles={incomingCallStackContainerStyle(position)}>
      {
        /* @conditional-compile-remove(one-to-n-calling) */ activeIncomingCalls
          .filter((incomingCall) => !removedIncomingCalls.some((call) => call.id === incomingCall.id))
          .map((incomingCall) => {
            return (
              <IncomingCallNotification
                key={incomingCall.id}
                callerName={incomingCall.callerInfo.displayName}
                onAcceptWithAudio={() => onAcceptCall(incomingCall.id)}
                onAcceptWithVideo={() => onAcceptCall(incomingCall.id, true)}
                onReject={() => onRejectCall(incomingCall.id)}
              ></IncomingCallNotification>
            );
          })
      }
    </Stack>
  );
};

const incomingCallStackContainerStyle = (position?: IncomingCallStackPosition): IStackStyles => {
  switch (position) {
    case 'topLeft':
      return {
        root: {
          top: 0,
          left: 0,
          position: 'absolute'
        }
      };
    case 'topRight':
      return {
        root: {
          top: 0,
          right: 0,
          position: 'absolute'
        }
      };
    case 'bottomLeft':
      return {
        root: {
          bottom: 0,
          left: 0,
          position: 'absolute'
        }
      };
    case 'bottomRight':
      return {
        root: {
          bottom: 0,
          right: 0,
          position: 'absolute'
        }
      };
    case 'topCenter':
      return {
        root: {
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          position: 'absolute'
        }
      };
    case 'bottomCenter':
      return {
        root: {
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          position: 'absolute'
        }
      };
    default:
      return {
        root: {
          top: 0,
          position: 'absolute'
        }
      };
  }
};
