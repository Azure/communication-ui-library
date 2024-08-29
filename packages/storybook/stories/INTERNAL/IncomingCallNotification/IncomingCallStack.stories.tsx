// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { IncomingCallStack as IncomingCallStackComponent } from '@azure/communication-react';
import { Canvas, Description, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd } from '../../controlsUtils';
import { IncomingCallStackExample } from './snippets/IncomingCallStack.snippet';

const IncomingCallStackExampleText: string =
  require('!!raw-loader!./snippets/IncomingCallStackPropsExample.snippet.tsx').default;

const getDocs = (): JSX.Element => {
  return (
    <>
      <Title>IncomingCallStack</Title>
      <Description>
        This component is a manager for your different incoming calls. It will render the different calls using the
        `IncomingCallNotification` component. Using the `usePropsFor` hook it will be able to get these calls from the
        `Statefulcallclient` and render them in the UI. This component will allow you to manage multiple incoming calls.
      </Description>
      <Canvas mdxSource={IncomingCallStackExampleText}>
        <IncomingCallStackExample />
      </Canvas>
      <Props of={IncomingCallStackComponent}></Props>
    </>
  );
};

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

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-Internal-InboundCalling-IncomingCallStack`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/InboundCalling/IncomingCallStack`,
  component: IncomingCallStack,
  argTypes: {
    incomingCalls: controlsToAdd.incomingCalls,
    maxIncomingCallsToShow: controlsToAdd.maxIncomingCallsToShow
  },
  parameters: {
    docs: {
      page: getDocs
    }
  }
} as Meta;
