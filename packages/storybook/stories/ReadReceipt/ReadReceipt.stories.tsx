// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageStatus, ReadReceipt as ReadReceiptComponent } from '@azure/communication-react';
import { Provider, teamsTheme } from '@fluentui/react-northstar';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { select, text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const ReadReceiptExampleText = require('!!raw-loader!./snippets/ReadReceipt.snippet.tsx').default;

const importStatement = `import { ReadReceipt, MessageStatus } from '@azure/communication-react';`;

const ExampleReadReceipts: () => JSX.Element = () => (
  <>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={'delivered'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={'seen'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={'sending'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={'failed'} />
    </span>
  </>
);

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ReadReceipts</Title>
      <Description>
        Read Receipt is used to indicate whether a message has been read, delivered, currently sending, or failed to
        send.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Canvas mdxSource={ReadReceiptExampleText}>
        <Provider theme={teamsTheme}>
          <ExampleReadReceipts />
        </Provider>
      </Canvas>

      <Heading>Props</Heading>
      <Props of={ReadReceiptComponent} />
    </>
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Read Receipt`,
  component: ReadReceiptComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const ReadReceipt = (): JSX.Element => {
  return (
    <ReadReceiptComponent
      messageStatus={select<MessageStatus>('Message Status', ['delivered', 'sending', 'seen', 'failed'], 'delivered')}
      deliveredTooltipText={text('Delivered icon tooltip text', 'Sent')}
      sendingTooltipText={text('Sending icon tooltip text', 'Sending')}
      seenTooltipText={text('Seen icon tooltip text', 'Seen')}
      failedToSendTooltipText={text('Failed to send icon tooltip text', 'Failed to send')}
    />
  );
};
