import { IncomingCallStackCall, IncomingCallStack } from '@azure/communication-react';
import React from 'react';

const mockActiveIncomingCalls: IncomingCallStackCall[] = [
  {
    callerInfo: {
      displayName: 'John Wick'
    },
    id: '1',
    videoAvailable: false
  },
  {
    callerInfo: {
      displayName: 'Dog'
    },
    id: '2',
    videoAvailable: true
  }
];
const mockRemovedIncomingCalls: IncomingCallStackCall[] = [];

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
