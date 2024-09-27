// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallStack as IncomingCallStackComponent } from '@azure/communication-react';
import React from 'react';

const IncomingCallStackStory = (args): JSX.Element => {
  const numberOfCalls = args.maxIncomingCallsToShow;
  const incomingCalls = args.incomingCalls.slice(0, numberOfCalls);
  const onAcceptCall = (incomingCallId: string, useVideo?: boolean): void => {
    alert('Accepted, useVideo: ' + useVideo + ', incomingCallId: ' + incomingCallId);
  };
  const onRejectCall = (incomingCallId: string): void => {
    alert('Rejected, incomingCallId: ' + incomingCallId);
  };
  return (
    <IncomingCallStackComponent
      activeIncomingCalls={incomingCalls}
      removedIncomingCalls={[]}
      onAcceptCall={onAcceptCall}
      onRejectCall={onRejectCall}
    />
  );
};

export const IncomingCallStack = IncomingCallStackStory.bind({});
