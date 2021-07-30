// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Meta } from '@storybook/react/types-6-0';
import { IncomingCallModal as IncomingCallModalComponent } from '@internal/react-composites';
import { Description, Heading, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { exampleIncomingCallModal } from './IncomingCallAlertsDocs';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { useVideoStreams } from '../../utils';

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Incoming Call Alerts</Title>
      <Description>
        The Incoming Call Alert Components alert about an incoming call. They can render a local video preview, custom
        avatar image, caller name and incoming call alert text.
      </Description>
      <Heading>Incoming Call Modal</Heading>
      <Source code={exampleIncomingCallModal} />
    </>
  );
};

const IncomingCallModalStory: (args) => JSX.Element = (args) => {
  const videoStreamElements = useVideoStreams(args.localVideoStreamEnabled ? 1 : 0);
  const videoStreamElement = videoStreamElements[0] ? videoStreamElements[0] : null;

  return (
    <IncomingCallModalComponent
      callerName={args.callerName}
      callerNameAlt={args.callerNameAlt}
      callerTitle={args.callerTitle}
      alertText={args.alertText}
      avatar={args.images.length > 0 ? args.images[0] : undefined}
      onClickVideoToggle={() => null}
      onClickAccept={() => null}
      onClickReject={() => null}
      localParticipantDisplayName={args.localParticipantDisplayName}
      localVideoInverted={args.localVideoInverted}
      showLocalVideo={args.showLocalVideo}
      localVideoStreamElement={videoStreamElement}
    />
  );
};

export const Modal = IncomingCallModalStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-incomingcallalerts-modal`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Incoming Call Alerts/Modal`,
  component: IncomingCallModalComponent,
  argTypes: {
    alertText: { control: 'text', defaultValue: 'Incoming Video Call', name: 'Alert Text' },
    callerName: { control: 'text', defaultValue: 'Maximus Aurelius', name: 'Caller Name' },
    callerNameAlt: { control: 'text', defaultValue: '1st', name: 'Caller Name Alt' },
    callerTitle: { control: 'text', defaultValue: 'Emperor and Philosopher, Rome', name: 'Caller Title' },
    images: { control: 'file', accept: '.jpeg, .jpg, .png', defaultValue: [], name: 'Avatar' },
    localParticipantDisplayName: { control: 'text', defaultValue: 'John Doe', name: 'Local Participant displayName' },
    localVideoStreamEnabled: { control: 'boolean', defaultValue: true, name: 'Turn Local Video On' },
    showLocalVideo: { control: 'boolean', defaultValue: true, name: 'Show Local Video' },
    localVideoInverted: { control: 'boolean', defaultValue: true, name: 'Invert Local Video' },
    // Hiding auto-generated controls
    avatar: { control: false, table: { disable: true } },
    onClickAccept: { control: false, table: { disable: true } },
    onClickReject: { control: false, table: { disable: true } },
    localVideoStreamElement: { control: false, table: { disable: true } },
    onClickVideoToggle: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
