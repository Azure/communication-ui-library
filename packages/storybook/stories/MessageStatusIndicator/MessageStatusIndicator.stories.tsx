// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageStatus, MessageStatusIndicator as MessageStatusIndicatorComponent } from '@azure/communication-react';
import { Provider, teamsTheme } from '@fluentui/react-northstar';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { select, text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const DefaultMessageStatusIndicatorsExampleText =
  require('!!raw-loader!./snippets/AllDefaultIndicators.snippet.tsx').default;

const importStatement = `import { MessageStatus, MessageStatusIndicator } from '@azure/communication-react';`;

const MessageStatusIndicatorsExample: () => JSX.Element = () => (
  <>
    <span style={{ margin: '0 5px' }}>
      <MessageStatusIndicatorComponent status={'delivered'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <MessageStatusIndicatorComponent status={'seen'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <MessageStatusIndicatorComponent status={'sending'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <MessageStatusIndicatorComponent status={'failed'} />
    </span>
  </>
);

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MessageStatusIndicator</Title>
      <Description>
        MessageStatusIndicator is used to indicate whether a message has been read, delivered, currently sending, or
        failed to send.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Canvas mdxSource={DefaultMessageStatusIndicatorsExampleText}>
        <Provider theme={teamsTheme}>
          <MessageStatusIndicatorsExample />
        </Provider>
      </Canvas>

      <Heading>Props</Heading>
      <Props of={MessageStatusIndicatorComponent} />
    </>
  );
};

const MessageStatusIndicatorStory = (): JSX.Element => {
  return (
    <MessageStatusIndicatorComponent
      status={select<MessageStatus>('Message Status', ['delivered', 'sending', 'seen', 'failed'], 'delivered')}
      strings={{
        deliveredTooltipText: text('Delivered icon tooltip text', 'Sent'),
        sendingTooltipText: text('Sending icon tooltip text', 'Sending'),
        seenTooltipText: text('Seen icon tooltip text', 'Seen'),
        failedToSendTooltipText: text('Failed to send icon tooltip text', 'Failed to send')
      }}
    />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const MessageStatusIndicator = MessageStatusIndicatorStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-messagestatusindicator`,
  title: `${COMPONENT_FOLDER_PREFIX}/Message Status Indicator`,
  component: MessageStatusIndicatorComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
