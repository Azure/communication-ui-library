import { ActiveIncomingCall, IncomingCallStack } from '@azure/communication-react';
import React from 'react';

const mockActiveIncomingCalls: ActiveIncomingCall[] = [
  {
    callerInfo: {
      displayName: 'John Wick'
    },
    startTime: new Date(),
    id: '1',
    videoAvailable: false
  },
  {
    callerInfo: {
      displayName: 'Dog'
    },
    startTime: new Date(),
    id: '2',
    videoAvailable: true
  }
];
const mockRemovedIncomingCalls: ActiveIncomingCall[] = [];

export const IncomingCallStackExample: () => JSX.Element = () => {
  return (
    <IncomingCallStack
      activeIncomingCalls={mockActiveIncomingCalls}
      removedIncomingCalls={mockRemovedIncomingCalls}
      onAcceptCall={(incomingCallId: string, useVideo?: boolean) => {
        if (useVideo) {
          alert('call accepted with video id: ' + incomingCallId);
        } else {
          alert('call accepted id: ' + incomingCallId);
        }
      }}
      onRejectCall={(incomingCallId: string) => alert('call rejected id: ' + incomingCallId)}
    />
  );
};
