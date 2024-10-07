// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallStack as IncomingCallStackComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';

import { IncomingCallStackExample } from './snippets/IncomingCallStack.snippet';
export const IncomingCallStackExampleDocsOnly = {
  render: IncomingCallStackExample
};

export { IncomingCallStack } from './IncomingCallStack.story';

const meta: Meta = {
  title: 'Components/IncomingCallNotification/IncomingCallStack',
  component: IncomingCallStackComponent,
  argTypes: {
    maxIncomingCallsToShow: controlsToAdd.maxIncomingCallsToShow,
    incomingCalls: controlsToAdd.incomingCalls,
    onAcceptCall: hiddenControl,
    onRejectCall: hiddenControl,
    activeIncomingCalls: hiddenControl,
    removedIncomingCalls: hiddenControl,
    styles: hiddenControl,
    strings: hiddenControl,
    tabIndex: hiddenControl
  },
  args: {
    maxIncomingCallsToShow: 3,
    incomingCalls: [
      {
        callerInfo: {
          displayName: 'John Wick'
        },
        id: '1'
      },
      {
        callerInfo: {
          displayName: 'Dog'
        },
        id: '2'
      },
      {
        callerInfo: {
          displayName: 'Dog2'
        },
        id: '3'
      }
    ]
  }
};

export default meta;
